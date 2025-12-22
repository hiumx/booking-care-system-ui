import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Home } from 'lucide-react';
import { toast } from 'react-toastify';
import ChatSidebar from './components/ChatSidebar';
import ChatArea from './components/ChatArea';
import ChatSidebarSkeleton from './components/ChatSidebar/ChatSidebarSkeleton';
import ChatAreaSkeleton from './components/ChatArea/ChatAreaSkeleton';
import { AppDispatch, RootState } from '@/store';
import { fetchUserProfile } from '@/store/slices/userSlice';
import styles from './AISupportBooking.module.scss';
import { Message, ChatHistory, Suggestion, ConversationType } from '@/types/ai.types';
import { PATHS, replacePathParams } from '@/routes/paths';
import { AIService, SymptomAnalysisRequest } from '@/services/ai.service';

// Helper function to parse doctor data (preserve service options for filtering)
const parseDoctorData = (d: any) => {
    const rawOptions =
        d.serviceOptions ||
        d.ServiceOptions ||
        d.doctor?.serviceOptions ||
        d.doctor?.ServiceOptions;

    const serviceOptions = Array.isArray(rawOptions)
        ? rawOptions.map((o: any) => ({
              serviceTypeId: o.serviceTypeId || o.ServiceTypeId,
              serviceTypeName: o.serviceTypeName || o.ServiceTypeName,
              price: o.price || o.Price,
          }))
        : [];

    const fallbackOption = serviceOptions[0];

    return {
        type: 'doctor' as const,
        doctor: {
            id: d.id || d.Id || d.doctor?.id,
            name: d.name || d.Name || d.doctor?.name,
            specialtyName: d.specialtyName || d.SpecialtyName || d.doctor?.specialtyName,
            hospitalName: d.hospitalName || d.HospitalName || d.doctor?.hospitalName,
            rating: d.rating || d.Rating || d.doctor?.rating || 0,
            yearOfExperience:
                d.yearOfExperience || d.YearOfExperience || d.doctor?.yearOfExperience || 0,
            serviceTypeName:
                d.serviceTypeName ||
                d.ServiceTypeName ||
                d.doctor?.serviceTypeName ||
                fallbackOption?.serviceTypeName ||
                undefined,
            price: d.price || d.Price || d.doctor?.price || fallbackOption?.price || undefined,
            avatarUrl: d.avatarUrl || d.AvatarUrl || d.doctor?.avatarUrl || undefined,
            serviceOptions,
        },
    };
};

// Helper function to parse hospital data
const parseHospitalData = (h: any) => ({
    type: 'hospital' as const,
    hospital: {
        id: h.id || h.Id || h.hospital?.id,
        name: h.name || h.Name || h.hospital?.name,
        address: h.address || h.Address || h.hospital?.address,
        specialtyId: [],
        specialtyName: h.specialtyNames || h.SpecialtyNames || h.hospital?.specialtyName || [],
        imageUrl: h.imageUrl || h.ImageUrl || h.hospital?.imageUrl || undefined,
    },
});

// Helper function to parse suggestions
const parseSuggestions = (suggestionsData: any): Suggestion[] | undefined => {
    if (!suggestionsData) return undefined;

    try {
        const doctors =
            suggestionsData.doctors ||
            (Array.isArray(suggestionsData)
                ? suggestionsData.filter((s: any) => s.type === 'doctor')
                : []);

        const hospitals =
            suggestionsData.hospitals ||
            (Array.isArray(suggestionsData)
                ? suggestionsData.filter((s: any) => s.type === 'hospital')
                : []);

        const parsedDoctors = (Array.isArray(doctors) ? doctors : []).map(parseDoctorData);
        const parsedHospitals = (Array.isArray(hospitals) ? hospitals : []).map(parseHospitalData);

        const result = [...parsedDoctors, ...parsedHospitals];

        return result;
    } catch (e) {
        console.error('Error parsing suggestions:', e);
        return undefined;
    }
};

// Helper function to convert message from API
const convertMessageFromAPI = (msg: any, chatId: string, index: number): Message => {
    const suggestions = parseSuggestions(msg.suggestions);
    const sender = msg.role?.toLowerCase() === 'ai' ? 'ai' : 'user';

    return {
        id: `${chatId}-${index}`,
        content: msg.content || '',
        sender: sender,
        timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
        suggestions: suggestions,
        questionCount: msg.questionCount,
        currentRound: msg.currentRound,
        maxQuestions: msg.maxQuestions,
        disease: msg.disease,
        analysisComplete: msg.analysisComplete,
        canRequestMoreQuestions: msg.canRequestMoreQuestions,
    };
};

// Helper function to convert history message to Message format
const convertHistoryMessage = (msg: any, index: number, chatId: string): Message => {
    const baseMessage = convertMessageFromAPI(msg, chatId, index);
    const parsedSuggestions = parseSuggestions(msg.suggestions || msg.Suggestions);

    // Parse disease data (support both camelCase and PascalCase)
    const diseaseData = msg.disease || msg.Disease;
    const parsedDisease = diseaseData
        ? {
              name: diseaseData.name || diseaseData.Name || '',
              confidence: diseaseData.confidence ?? diseaseData.Confidence ?? 0,
              reasons: diseaseData.reasons || diseaseData.Reasons || [],
          }
        : undefined;

    if (!msg.timestamp && !parsedSuggestions && !parsedDisease) {
        return baseMessage;
    }

    return {
        ...baseMessage,
        timestamp: msg.timestamp ? new Date(msg.timestamp) : baseMessage.timestamp,
        suggestions: parsedSuggestions ?? baseMessage.suggestions,
        disease: parsedDisease ?? baseMessage.disease,
        questionCount: msg.questionCount ?? msg.QuestionCount ?? baseMessage.questionCount,
        currentRound: msg.currentRound ?? msg.CurrentRound ?? baseMessage.currentRound,
        maxQuestions: msg.maxQuestions ?? msg.MaxQuestions ?? baseMessage.maxQuestions,
        analysisComplete:
            msg.analysisComplete ?? msg.AnalysisComplete ?? baseMessage.analysisComplete,
        canRequestMoreQuestions:
            msg.canRequestMoreQuestions ??
            msg.CanRequestMoreQuestions ??
            baseMessage.canRequestMoreQuestions,
    };
};

const AISupportBooking: React.FC = () => {
    const { t } = useTranslation('aiSupport');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { chatId } = useParams<{ chatId?: string }>();
    const { profile } = useSelector((state: RootState) => state.user);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const [messages, setMessages] = useState<Message[]>([]);
    const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [isAITyping, setIsAITyping] = useState(false);
    const [isLoadingSessions, setIsLoadingSessions] = useState(true);
    const [isLoadingChat, setIsLoadingChat] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        // Mặc định mở trên desktop, đóng trên mobile
        if (globalThis.window !== undefined) {
            return globalThis.window.innerWidth > 768;
        }
        return true;
    });

    // Track newly created chat IDs to avoid loading from backend
    const newlyCreatedChatsRef = useRef<Set<string>>(new Set());
    const activeChatIdRef = useRef<string | null>(null);

    useEffect(() => {
        activeChatIdRef.current = activeChatId;
    }, [activeChatId]);

    // Location state
    const [userLocation, setUserLocation] = useState<{
        provinceId?: string;
        districtId?: string;
        displayName: string;
    } | null>(null);

    // Check authentication - redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            // Redirect to login with return URL
            navigate(
                `${PATHS.LOGIN}?returnUrl=${encodeURIComponent(globalThis.location.pathname)}`
            );
        }
    }, [isAuthenticated, navigate]);

    // Fetch user profile when authenticated
    useEffect(() => {
        if (isAuthenticated && profile === null) {
            dispatch(fetchUserProfile()).catch((error) => {
                console.error('Failed to fetch user profile:', error);
            });
        }
    }, [isAuthenticated, profile, dispatch]);

    // Kiểm tra và load vị trí khi vào page
    useEffect(() => {
        const checkLocation = () => {
            let location: { provinceId?: string; districtId?: string; displayName: string } | null =
                null;

            // Ưu tiên 1: Kiểm tra localStorage (aiSupportLocation) - ưu tiên cao nhất
            const saved = localStorage.getItem('aiSupportLocation');
            if (saved) {
                try {
                    location = JSON.parse(saved);
                } catch (e) {
                    console.error('Error parsing location from localStorage:', e);
                }
            }

            // Ưu tiên 2: Nếu không có trong localStorage, kiểm tra address trong profile
            if (!location && isAuthenticated && profile?.address) {
                location = {
                    displayName: profile.address,
                };
            }

            if (location) {
                setUserLocation(location);
            }
        };

        // Chờ profile được fetch nếu đã đăng nhập
        if (isAuthenticated && profile === null) {
            // Đợi profile được fetch
            return;
        }

        checkLocation();
    }, [isAuthenticated, profile]);

    // Load conversation sessions when component mounts or user changes
    // silentReload: if true, don't show loading skeleton (used for background refresh)
    const loadSessions = useCallback(async (silentReload: boolean = false) => {
        if (!silentReload) {
            setIsLoadingSessions(true);
        }
        try {
            // Backend will get userId from authentication token
            const response = await AIService.getUserSessions();
            if (response.success && response.data) {
                // Sort sessions by updatedAt (newest first) before mapping
                const sortedSessions = [...response.data].sort((a, b) => {
                    try {
                        const dateA = new Date(a.updatedAt);
                        const dateB = new Date(b.updatedAt);
                        // If dates are invalid, treat as newest
                        if (Number.isNaN(dateA.getTime())) return -1;
                        if (Number.isNaN(dateB.getTime())) return 1;
                        return dateB.getTime() - dateA.getTime(); // Newest first
                    } catch {
                        return 0;
                    }
                });

                // Map sorted sessions to ChatHistory format
                const historiesFromBackend: ChatHistory[] = sortedSessions.map((session) => {
                    // Parse UTC time string and convert to local time
                    // session.updatedAt is in UTC format from backend (ISO string)
                    let formattedTime = t('chat.justNow');
                    try {
                        // Parse the UTC date string
                        const utcDate = new Date(session.updatedAt);

                        // Check if date is valid
                        if (!Number.isNaN(utcDate.getTime())) {
                            // Format with local timezone (no timeZone option needed, Date already converts to local)
                            formattedTime = utcDate.toLocaleString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false, // Use 24-hour format
                            });
                        }
                    } catch (error) {
                        console.error('Error formatting time:', error);
                        formattedTime = t('chat.justNow');
                    }

                    return {
                        id: session.sessionId,
                        title: session.title || t('chat.newConversation'),
                        lastMessage: session.lastMessage || '',
                        lastMessageTime: formattedTime,
                        avatar: '',
                        conversationType:
                            session.conversationType ||
                            session.ConversationType ||
                            ConversationType.SYMPTOM_ANALYSIS,
                    };
                });

                // MERGE with existing local chats instead of replacing
                // This preserves newly created chats that haven't been saved to backend yet
                if (silentReload) {
                    setChatHistories((prevHistories) => {
                        // Get IDs from backend
                        const backendIds = new Set(historiesFromBackend.map((h) => h.id));

                        // Remove newly created chats from tracking if they now exist in backend
                        backendIds.forEach((id) => {
                            if (newlyCreatedChatsRef.current.has(id)) {
                                newlyCreatedChatsRef.current.delete(id);
                            }
                        });

                        // Keep local chats that are not yet in backend (newly created)
                        // These are the newest chats, so they should be at the top
                        const localOnlyChats = prevHistories.filter(
                            (chat) => !backendIds.has(chat.id)
                        );

                        // Merge backend histories with local state, preserving conversationType from local if exists
                        const mergedBackendHistories = historiesFromBackend.map((backendChat) => {
                            const localChat = prevHistories.find((c) => c.id === backendChat.id);
                            // If chat exists in local state and has conversationType, preserve it
                            // This prevents overwriting with default SYMPTOM_ANALYSIS
                            if (localChat && localChat.conversationType) {
                                return {
                                    ...backendChat,
                                    conversationType: localChat.conversationType,
                                };
                            }
                            return backendChat;
                        });

                        // Merge: local-only chats (newest) first, then merged backend histories
                        return [...localOnlyChats, ...mergedBackendHistories];
                    });
                } else {
                    // Full reload (first time load), already sorted by updatedAt (newest first)
                    setChatHistories(historiesFromBackend);
                }
            }
        } catch (error) {
            console.error('Error loading conversation sessions:', error);
            // Don't show error to user, just log it
        } finally {
            if (!silentReload) {
                setIsLoadingSessions(false);
            }
        }
    }, []);

    // Track if initial location load has been done
    const hasLoadedSessionsRef = useRef(false);

    const fetchChatMessages = useCallback(async (sessionId: string) => {
        setIsLoadingChat(true);
        try {
            const response = await AIService.getConversationHistory(sessionId);
            if (activeChatIdRef.current !== sessionId) {
                return;
            }
            if (response.success && response.data) {
                const history = response.data;
                setMessages(
                    history.map((msg: any, index: number) =>
                        convertHistoryMessage(msg, index, sessionId)
                    )
                );
            } else {
                setMessages([]);
            }
        } catch (error) {
            console.error('Error loading conversation history:', error);
            if (activeChatIdRef.current === sessionId) {
                setMessages([]);
            }
        } finally {
            if (activeChatIdRef.current === sessionId) {
                setIsLoadingChat(false);
            }
        }
    }, []);

    useEffect(() => {
        // Only load if authenticated and have location
        // Don't reload if we're in a newly created chat to avoid "văng" UI
        if (isAuthenticated && userLocation) {
            // If we're in a newly created chat, always use silent reload to preserve local state
            const isInNewChat = activeChatId && newlyCreatedChatsRef.current.has(activeChatId);

            if (isInNewChat) {
                // Always use silent reload for newly created chats (preserve local state)
                loadSessions(true);
            } else if (!hasLoadedSessionsRef.current) {
                // Initial load (first time with location)
                hasLoadedSessionsRef.current = true;
                loadSessions(false);
            }
            // If already loaded and not in new chat, don't reload (avoid "văng")
        }
    }, [isAuthenticated, userLocation, activeChatId, loadSessions]);

    // Sync activeChatId with URL parameter
    useEffect(() => {
        const syncChatWithUrl = async () => {
            if (!isAuthenticated || !userLocation) {
                return;
            }

            if (chatId && chatId !== activeChatIdRef.current) {
                setActiveChatId(chatId);

                if (newlyCreatedChatsRef.current.has(chatId)) {
                    setMessages([]);
                    setIsLoadingChat(false);
                    return;
                }

                await fetchChatMessages(chatId);
                return;
            }

            if (!chatId && activeChatIdRef.current) {
                navigate(
                    replacePathParams(PATHS.AI_SUPPORT_BOOKING_CHAT, {
                        chatId: activeChatIdRef.current,
                    }),
                    { replace: true }
                );
            }
        };

        syncChatWithUrl();
    }, [chatId, isAuthenticated, userLocation, navigate, fetchChatMessages]);

    // Generate GUID-like string for session ID
    // Create new session with conversation type
    const createNewSession = async (
        conversationType: ConversationType,
        initialMessage?: string
    ): Promise<string> => {
        try {
            const response = await AIService.createSession({
                conversationType,
                initialMessage,
            });

            if (response.success && response.data) {
                const newSession = response.data;

                // Add to local state
                const history: ChatHistory = {
                    id: newSession.sessionId,
                    title: newSession.title || initialMessage || t('chat.newConversation'),
                    lastMessage: initialMessage || '',
                    lastMessageTime: t('chat.justNow'),
                    avatar: '',
                    conversationType: newSession.conversationType,
                };

                setChatHistories((prev) => [history, ...prev]);
                setActiveChatId(newSession.sessionId);
                setMessages([]);
                setIsLoadingChat(false);

                navigate(
                    replacePathParams(PATHS.AI_SUPPORT_BOOKING_CHAT, {
                        chatId: newSession.sessionId,
                    }),
                    { replace: true }
                );

                return newSession.sessionId;
            }

            throw new Error('Failed to create session');
        } catch (error: any) {
            console.error('Error creating session:', error);
            toast.error(error.message || t('errors.cannotCreateSession'));
            throw error;
        }
    };

    // Helper function to map API response to suggestions
    const mapResponseToSuggestions = (response: any): Suggestion[] => {
        const doctorSuggestions = (response.data.recommendedDoctors || []).map((d: any) => ({
            type: 'doctor' as const,
            doctor: {
                id: d.id,
                name: d.name,
                specialtyName: d.specialtyName,
                hospitalName: d.hospitalName,
                rating: d.rating,
                yearOfExperience: d.yearOfExperience,
                serviceTypeName: d.serviceTypeName || undefined,
                price: d.price || undefined,
                avatarUrl: d.avatarUrl || undefined,
                serviceOptions:
                    d.serviceOptions?.map((o: any) => ({
                        serviceTypeId: o.serviceTypeId,
                        serviceTypeName: o.serviceTypeName,
                        price: o.price,
                    })) ||
                    (d.serviceTypeName || d.price
                        ? [
                              {
                                  serviceTypeId: undefined,
                                  serviceTypeName: d.serviceTypeName || 'Khám trực tiếp',
                                  price: d.price,
                              },
                          ]
                        : []),
            },
        }));

        const hospitalSuggestions = (response.data.recommendedHospitals || []).map((h: any) => ({
            type: 'hospital' as const,
            hospital: {
                id: h.id,
                name: h.name,
                address: h.address,
                specialtyId: [],
                specialtyName: h.specialtyNames || [],
                imageUrl: h.imageUrl || undefined,
            },
        }));

        return [...doctorSuggestions, ...hospitalSuggestions];
    };

    // Helper function to handle AI response: sync sessionId, build suggestions & AI message
    const handleAiResponse = (
        response: any,
        currentChatId: string,
        options?: {
            buildContent?: (response: any) => string;
            extraMessageFields?: Partial<Message>;
        }
    ): string => {
        // Update session ID from response if provided
        if (response.data.sessionId && response.data.sessionId !== currentChatId) {
            const oldChatId = currentChatId;
            const newChatId = response.data.sessionId;

            // Update tracking: keep new ID as newly created to prevent fetchChatMessages
            // It will be removed from tracking when loadSessions confirms backend has it
            if (newlyCreatedChatsRef.current.has(oldChatId)) {
                newlyCreatedChatsRef.current.delete(oldChatId);
            }
            newlyCreatedChatsRef.current.add(newChatId);

            // Update chatHistories: replace old chat with new ID
            setChatHistories((prev) =>
                prev.map((chat) => (chat.id === oldChatId ? { ...chat, id: newChatId } : chat))
            );

            // Update active chat ID
            setActiveChatId(newChatId);
            currentChatId = newChatId;
        }

        // Map response to suggestions
        const suggestions = mapResponseToSuggestions(response);

        // Build AI message content
        const aiMessageContent = options?.buildContent
            ? options.buildContent(response)
            : (response.data.message || '').replace(/\\n/g, '\n');

        const aiMessage: Message = {
            id: Date.now().toString(),
            content: aiMessageContent.trim(),
            sender: 'ai',
            timestamp: new Date(response.data.timestamp || new Date().toISOString()),
            suggestions: suggestions.length > 0 ? suggestions : undefined,
            ...options?.extraMessageFields,
        };

        setMessages((prev) => [...prev, aiMessage]);

        return currentChatId;
    };

    // Helper function to prepare conversation history
    const prepareConversationHistory = (messages: Message[]) => {
        return messages
            .filter((m) => m.sender === 'user' || m.sender === 'ai')
            .map((m) => ({
                role: m.sender,
                content: m.content,
                timestamp: m.timestamp.toISOString(),
            }));
    };

    // Helper function to get error message
    const getErrorMessage = (error: any): string => {
        if (error.message) {
            return t('errors.sorry', { message: error.message });
        }
        if (error.response?.data?.message) {
            return t('errors.sorry', { message: error.response.data.message });
        }
        return t('errors.generic');
    };

    // Helper function to build lab result message
    const buildLabResultMessage = (data: any): string => {
        const lines: string[] = [];
        lines.push(t('labResult.title'), '');

        // Normal indicators
        if (data.normalIndicators && data.normalIndicators.length > 0) {
            lines.push(t('labResult.normalIndicators'));
            data.normalIndicators.forEach((indicator: any) => {
                lines.push(
                    `- ${indicator.name}: ${indicator.value} ${indicator.unit} (${t('labResult.reference')}: ${indicator.referenceRange})`
                );
            });
            lines.push('');
        }

        // Abnormal indicators
        if (data.abnormalIndicators && data.abnormalIndicators.length > 0) {
            lines.push(t('labResult.abnormalIndicators'));
            data.abnormalIndicators.forEach((indicator: any) => {
                lines.push(
                    `- ${indicator.name}: ${indicator.value} ${indicator.unit} (${t('labResult.reference')}: ${indicator.referenceRange})`,
                    `  - ${t('labResult.explanation')}: ${indicator.explanation}`,
                    `  - ${t('labResult.advice')}: ${indicator.advice}`
                );
                if (indicator.possibleDiagnosis) {
                    lines.push(
                        `  - ${t('labResult.possibleDiagnosis')}: ${indicator.possibleDiagnosis}`
                    );
                    if (
                        indicator.recommendedSpecialties &&
                        indicator.recommendedSpecialties.length > 0
                    ) {
                        const specialtyNames = indicator.recommendedSpecialties
                            .map((s: any) => s.specialtyName || s)
                            .join(', ');
                        lines.push(
                            `    - ${t('labResult.recommendedSpecialties')}: ${specialtyNames}`
                        );
                    }
                }
                lines.push('');
            });
        }

        // Disclaimer
        if (data.disclaimer) {
            lines.push(data.disclaimer);
        }

        return lines.join('\n');
    };

    // Helper function to build dermatology message
    const buildDermatologyMessage = (data: any): string => {
        const lines: string[] = [];
        lines.push(t('dermatology.title'), '');

        // Diagnosis
        if (data.diagnosis) {
            lines.push(
                `${t('dermatology.diagnosis')}: ${data.diagnosis.conditionName}`,
                `${t('dermatology.confidence')}: ${(data.diagnosis.confidence * 100).toFixed(0)}%`,
                ''
            );
        }

        // Biopsy recommendation
        if (data.biopsyRecommended) {
            if (data.biopsyReason) {
                lines.push(
                    t('dermatology.biopsyRecommended'),
                    `${t('dermatology.biopsyReason')}: ${data.biopsyReason}`,
                    ''
                );
            } else {
                lines.push(t('dermatology.biopsyRecommended'), '');
            }
        }

        // General advice
        if (data.generalAdvice && data.generalAdvice.length > 0) {
            lines.push(`${t('dermatology.advice')}:`);
            data.generalAdvice.forEach((advice: string) => {
                lines.push(`- ${advice}`);
            });
            lines.push('');
        }

        // Disclaimer
        if (data.disclaimer) {
            lines.push(data.disclaimer);
        }

        return lines.join('\n');
    };

    // Helper function to build nutrition completion message
    const buildNutritionCompletionMessage = (
        profile: any,
        mealPlan: any,
        workoutPlan: any
    ): string => {
        const lines: string[] = [];

        // Header
        lines.push('Tuyệt vời! Hồ sơ dinh dưỡng của bạn đã được tạo thành công.');
        lines.push('');

        // Profile info
        lines.push('THÔNG TIN CỦA BẠN');
        const bmiStatus =
            profile.bmi < 18.5
                ? 'Gầy'
                : profile.bmi < 25
                  ? 'Bình thường'
                  : profile.bmi < 30
                    ? 'Thừa cân'
                    : 'Béo phì';
        lines.push(`BMI: ${profile.bmi.toFixed(1)} (${bmiStatus})`);
        lines.push(`Chiều cao: ${profile.heightCm} cm`);
        lines.push(`Cân nặng: ${profile.weightKg} kg`);
        const goalText =
            profile.healthGoal === 'WeightLoss'
                ? 'Giảm cân'
                : profile.healthGoal === 'MuscleGain'
                  ? 'Tăng cơ'
                  : 'Duy trì';
        lines.push(`Mục tiêu: ${goalText}`);
        lines.push(`Calories mục tiêu: ${profile.targetCalories} kcal/ngày`);
        lines.push(
            `Protein: ${profile.targetProteinG}g | Carbs: ${profile.targetCarbsG}g | Fat: ${profile.targetFatG}g`
        );
        lines.push('');

        // Meal plan
        lines.push(`THỰC ĐƠN HÔM NAY (${new Date(mealPlan.date).toLocaleDateString('vi-VN')})`);
        lines.push('');

        const mealTypeMap: Record<string, string> = {
            Breakfast: 'Bữa sáng',
            Lunch: 'Bữa trưa',
            Dinner: 'Bữa tối',
            Snack: 'Bữa phụ',
        };

        if (mealPlan.meals && Array.isArray(mealPlan.meals)) {
            mealPlan.meals.forEach((meal: any, index: number) => {
                const mealTypeVi = mealTypeMap[meal.mealType] || meal.mealType;
                lines.push(`${mealTypeVi}`);
                if (meal.recipe) {
                    const r = meal.recipe;
                    lines.push(`Món: ${r.nameVi || r.nameEn}`);
                    lines.push(`Thời gian: ${r.prepTimeMinutes + r.cookTimeMinutes} phút`);
                    lines.push(
                        `Dinh dưỡng: ${r.nutrition?.calories} kcal | Protein: ${r.nutrition?.proteinG}g | Carbs: ${r.nutrition?.carbsG}g | Fat: ${r.nutrition?.fatG}g`
                    );
                }
                if (index < mealPlan.meals.length - 1) {
                    lines.push('');
                }
            });
        }

        lines.push('');
        lines.push(`Tổng năng lượng: ${mealPlan.totalCalories} kcal`);
        lines.push('');

        // Workout plan
        lines.push('KẾ HOẠCH TẬP LUYỆN HÔM NAY');
        lines.push(`Loại: ${workoutPlan.workoutType}`);
        lines.push(`Thời gian: ${workoutPlan.durationMinutes} phút`);
        lines.push(`Calories đốt cháy: ~${workoutPlan.estimatedCaloriesBurned} kcal`);
        lines.push('');

        if (workoutPlan.exercises && Array.isArray(workoutPlan.exercises)) {
            workoutPlan.exercises.forEach((exercise: any, index: number) => {
                const duration = exercise.durationMinutes
                    ? ` (${exercise.durationMinutes} phút)`
                    : '';
                const sets = exercise.sets ? ` - ${exercise.sets} sets` : '';
                const reps = exercise.reps ? ` x ${exercise.reps} reps` : '';
                const intensity = exercise.intensity ? ` [${exercise.intensity}]` : '';
                lines.push(
                    `${index + 1}. ${exercise.nameVi || exercise.nameEn}${duration}${sets}${reps}${intensity}`
                );
            });
        }

        lines.push('');
        lines.push(
            'Bạn sẽ nhận được thông báo mỗi sáng với thực đơn và kế hoạch tập mới. Chúc bạn thành công!'
        );
        return lines.join('\n');
    };

    // Handler for starting nutrition conversation
    const handleStartNutrition = async () => {
        if (!isAuthenticated) {
            navigate(
                `${PATHS.LOGIN}?returnUrl=${encodeURIComponent(globalThis.location.pathname)}`
            );
            return;
        }

        // Create new chat for nutrition conversation
        const newChatId = await createNewSession(
            ConversationType.SYMPTOM_ANALYSIS,
            'Tôi muốn tạo kế hoạch dinh dưỡng'
        );

        // Call nutrition conversation API
        setIsAITyping(true);
        try {
            const response = await AIService.startNutritionConversation(newChatId);

            // Add AI's first question to chat
            const aiMessage: Message = {
                id: Date.now().toString(),
                content: response.data.question,
                sender: 'ai',
                timestamp: new Date(),
                nutritionStep: response.data.currentStep,
                nutritionTotalSteps: response.data.totalSteps,
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error starting nutrition conversation:', error);
            toast.error('Không thể bắt đầu tạo kế hoạch dinh dưỡng');
        } finally {
            setIsAITyping(false);
        }
    };

    // Handler for starting symptom analysis
    const handleStartSymptomAnalysis = async () => {
        if (!isAuthenticated) {
            navigate(
                `${PATHS.LOGIN}?returnUrl=${encodeURIComponent(globalThis.location.pathname)}`
            );
            return;
        }

        // Kiểm tra vị trí
        if (!userLocation) {
            toast.error('Vui lòng chọn vị trí trước khi bắt đầu');
            return;
        }

        // Get current chat type
        const currentChat = chatHistories.find((c) => c.id === activeChatId);
        const conversationType = currentChat?.conversationType;

        // If already in symptom analysis chat with no messages, do nothing
        if (
            conversationType === ConversationType.SYMPTOM_ANALYSIS &&
            !messages.some((m) => m.fileAttachment) &&
            messages.length === 0
        ) {
            // Already in correct chat type with no messages, do nothing
            return;
        }

        // If in symptom analysis chat with messages, do nothing (already active)
        if (conversationType === ConversationType.SYMPTOM_ANALYSIS && messages.length > 0) {
            return;
        }

        // Create new symptom analysis chat
        await createNewSession(ConversationType.SYMPTOM_ANALYSIS);
    };

    const handleSendMessage = async (content: string) => {
        if (!content.trim()) return;

        // Kiểm tra authentication
        if (!isAuthenticated) {
            navigate(
                `${PATHS.LOGIN}?returnUrl=${encodeURIComponent(globalThis.location.pathname)}`
            );
            return;
        }

        // Kiểm tra vị trí trước khi gửi message
        if (!userLocation) {
            // Modal vị trí sẽ tự động hiển thị trong SearchBox
            return;
        }

        // Get conversation type from current chat
        const currentChat = chatHistories.find((c) => c.id === activeChatId);
        const conversationType = currentChat?.conversationType;

        // VALIDATE: Không cho gửi text message trong chat phân tích file
        if (
            conversationType === ConversationType.LAB_RESULT_ANALYSIS ||
            conversationType === ConversationType.MEDICAL_IMAGE_ANALYSIS
        ) {
            toast.warning(
                'Cuộc trò chuyện này chỉ dùng để phân tích file. Vui lòng tạo cuộc trò chuyện mới để chat.'
            );
            return;
        }

        // Kiểm tra nếu đang ở chế độ phân tích file (xét nghiệm hoặc ảnh da)
        const hasFileAttachment = messages.some((m) => m.fileAttachment);
        if (hasFileAttachment) {
            toast.warning(
                'Cuộc trò chuyện này chỉ dùng để phân tích file. Vui lòng tạo cuộc trò chuyện mới để chat.'
            );
            return;
        }

        const trimmedContent = content.trim();
        const userMessage: Message = {
            id: Date.now().toString(),
            content: trimmedContent,
            sender: 'user',
            timestamp: new Date(),
        };

        // Create new chat if no active chat - always use SYMPTOM_ANALYSIS type for text messages
        let currentChatId = activeChatId;
        if (!currentChatId) {
            // Create new symptom analysis session
            currentChatId = await createNewSession(
                ConversationType.SYMPTOM_ANALYSIS,
                trimmedContent
            );
        }

        // Add user message AFTER creating session (to avoid being cleared by setMessages([]))
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);

        // Check if in nutrition conversation
        const lastAiMessage = messages.filter((m) => m.sender === 'ai').pop();
        if (lastAiMessage?.nutritionStep !== undefined) {
            // This is a nutrition conversation
            setIsAITyping(true);
            try {
                const response = await AIService.answerNutritionQuestion(
                    currentChatId,
                    trimmedContent
                );

                if (response.data.isComplete) {
                    // Show completion message with profile, meal plan, workout plan
                    const completionMessage = buildNutritionCompletionMessage(
                        response.data.profile,
                        response.data.mealPlan,
                        response.data.workoutPlan
                    );

                    const aiMessage: Message = {
                        id: Date.now().toString(),
                        content: completionMessage,
                        sender: 'ai',
                        timestamp: new Date(),
                        nutritionComplete: true,
                        nutritionData: {
                            profile: response.data.profile!,
                            mealPlan: response.data.mealPlan!,
                            workoutPlan: response.data.workoutPlan!,
                        },
                    };

                    setMessages((prev) => [...prev, aiMessage]);
                } else {
                    // Show next question
                    const aiMessage: Message = {
                        id: Date.now().toString(),
                        content: response.data.question,
                        sender: 'ai',
                        timestamp: new Date(),
                        nutritionStep: response.data.currentStep,
                        nutritionTotalSteps: response.data.totalSteps,
                    };

                    setMessages((prev) => [...prev, aiMessage]);
                }
            } catch (error: any) {
                console.error('Error answering nutrition question:', error);
                const errorMessage: Message = {
                    id: Date.now().toString(),
                    content: getErrorMessage(error),
                    sender: 'ai',
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, errorMessage]);
            } finally {
                setIsAITyping(false);
            }
            return;
        }

        // Call real AI API for symptom analysis
        setIsAITyping(true);

        try {
            // Prepare conversation history
            const conversationHistory = prepareConversationHistory(updatedMessages);

            // Backend will get userId from authentication token
            const request: SymptomAnalysisRequest = {
                sessionId: currentChatId,
                message: trimmedContent,
                location: userLocation
                    ? {
                          provinceId: userLocation.provinceId,
                          districtId: userLocation.districtId,
                          displayName: userLocation.displayName,
                      }
                    : undefined,
                conversationHistory:
                    conversationHistory.length > 0 ? conversationHistory : undefined,
            };

            const response = await AIService.analyzeSymptoms(request);

            currentChatId = handleAiResponse(response, currentChatId, {
                extraMessageFields: {
                    questionCount: response.data.questionCount,
                    currentRound: response.data.currentRound,
                    maxQuestions: response.data.maxQuestions,
                    disease: response.data.disease,
                    analysisComplete: response.data.analysisComplete,
                    canRequestMoreQuestions: response.data.canRequestMoreQuestions,
                },
            });
        } catch (error: any) {
            console.error('Error analyzing symptoms:', error);

            // Show error message to user
            const errorContent = getErrorMessage(error);

            const errorMessage: Message = {
                id: Date.now().toString(),
                content: errorContent,
                sender: 'ai',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsAITyping(false);

            // Chỉ reload sessions khi là message đầu tiên (để sync title từ backend)
            // Backend sẽ tạo title dựa vào message đầu tiên của user
            if (currentChatId && updatedMessages.length === 1) {
                // Reload sessions sau 2000ms để đảm bảo backend đã update title
                // silentReload = true để không show loading skeleton (tránh văng UI)
                // loadSessions sẽ tự động merge và remove chat khỏi newlyCreatedChatsRef
                setTimeout(() => {
                    loadSessions(true); // silent reload with merge
                }, 2000); // Tăng lên 2000ms để backend chắc chắn kịp lưu
            }
        }
    };

    const handleNewChat = async () => {
        // Kiểm tra authentication
        if (!isAuthenticated) {
            navigate(
                `${PATHS.LOGIN}?returnUrl=${encodeURIComponent(globalThis.location.pathname)}`
            );
            return;
        }

        // Kiểm tra vị trí trước khi tạo chat mới
        if (!userLocation) {
            // Modal vị trí sẽ tự động hiển thị trong SearchBox
            return;
        }

        // Clear active chat to show welcome screen
        // User will choose function by clicking on one of the 3 cards
        setActiveChatId(null);
        setMessages([]);
        navigate(PATHS.AI_SUPPORT_BOOKING);
    };

    // Helper function to handle chat deletion navigation
    const handleChatDeletionNavigation = (chatId: string) => {
        setChatHistories((prev) => {
            const remainingChats = prev.filter((chat) => chat.id !== chatId);
            // Nếu chat bị xóa là chat đang active, chuyển sang chat khác hoặc reset
            if (activeChatId === chatId) {
                // Clear messages ngay lập tức để tránh hiển thị nội dung chat đã xóa
                setMessages([]);
                if (remainingChats.length > 0) {
                    const newActiveId = remainingChats[0].id;
                    setActiveChatId(newActiveId);
                    navigate(
                        replacePathParams(PATHS.AI_SUPPORT_BOOKING_CHAT, {
                            chatId: newActiveId,
                        })
                    );
                } else {
                    setActiveChatId(null);
                    navigate(PATHS.AI_SUPPORT_BOOKING);
                }
            }
            return remainingChats;
        });
    };

    const handleSelectChat = async (chatId: string) => {
        // Kiểm tra authentication
        if (!isAuthenticated) {
            navigate(
                `${PATHS.LOGIN}?returnUrl=${encodeURIComponent(globalThis.location.pathname)}`
            );
            return;
        }

        // Kiểm tra vị trí trước khi chọn chat
        if (!userLocation) {
            // Modal vị trí sẽ tự động hiển thị trong SearchBox
            return;
        }

        // Nếu đang select chat đang active, skip
        if (chatId === activeChatId) {
            return;
        }

        // Set active chat ID và navigate URL ngay lập tức để UI responsive
        setActiveChatId(chatId);
        navigate(replacePathParams(PATHS.AI_SUPPORT_BOOKING_CHAT, { chatId }));

        await fetchChatMessages(chatId);
    };

    const handleDeleteChat = async (chatId: string) => {
        const isLocalChat = newlyCreatedChatsRef.current.has(chatId);
        if (isLocalChat) {
            newlyCreatedChatsRef.current.delete(chatId);
            handleChatDeletionNavigation(chatId);
            toast.success(t('chat.deleteSuccess'));
            return;
        }

        try {
            await AIService.deleteSession(chatId);
            handleChatDeletionNavigation(chatId);
            await loadSessions(true);
            toast.success(t('chat.deleteSuccess'));
        } catch (error: any) {
            console.error('Error deleting chat:', error);
            toast.error(error?.message || t('chat.deleteError'));
        }
    };

    const handleLabResultFileSelect = async (file: File) => {
        // Kiểm tra authentication
        if (!isAuthenticated) {
            navigate(
                `${PATHS.LOGIN}?returnUrl=${encodeURIComponent(globalThis.location.pathname)}`
            );
            return;
        }

        // Kiểm tra vị trí
        if (!userLocation) {
            toast.error(t('errors.selectLocationFirst'));
            return;
        }

        // Get conversation type from current chat
        const currentChat = chatHistories.find((c) => c.id === activeChatId);
        const conversationType = currentChat?.conversationType;

        // VALIDATE: Chỉ cho upload nếu chưa có chat hoặc chat đúng loại
        if (conversationType && conversationType !== ConversationType.LAB_RESULT_ANALYSIS) {
            toast.warning('Vui lòng tạo cuộc trò chuyện mới để phân tích xét nghiệm');
            return;
        }

        // Create new session with LAB_RESULT_ANALYSIS type
        let currentChatId = activeChatId;
        if (!currentChatId || conversationType !== ConversationType.LAB_RESULT_ANALYSIS) {
            currentChatId = await createNewSession(
                ConversationType.LAB_RESULT_ANALYSIS,
                t('messages.analyzeLabResult')
            );
        }

        // Create user message with file attachment
        // Note: Content format must match backend marker text for upload limit check
        const userMessage: Message = {
            id: Date.now().toString(),
            content: t('messages.labResultFile', { fileName: file.name }),
            sender: 'user',
            timestamp: new Date(),
            fileAttachment: {
                fileName: file.name,
                fileType: file.type,
                fileUrl: URL.createObjectURL(file),
            },
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);

        // Call AI API to analyze lab result
        setIsAITyping(true);

        try {
            const response = await AIService.analyzeLabResult(file, userLocation, currentChatId);

            currentChatId = handleAiResponse(response, currentChatId, {
                buildContent: (resp) =>
                    resp.data.message
                        ? resp.data.message.replace(/\\n/g, '\n')
                        : buildLabResultMessage(resp.data),
            });
            toast.success(t('success.labResultAnalyzed'));
        } catch (error: any) {
            console.error('Error analyzing lab result:', error);

            // Show error message to user
            const errorContent = getErrorMessage(error);

            const errorMsg: Message = {
                id: Date.now().toString(),
                content: errorContent,
                sender: 'ai',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, errorMsg]);
            toast.error(t('errors.labResultFailed'));
        } finally {
            setIsAITyping(false);

            // Reload sessions to sync title from backend
            if (currentChatId && updatedMessages.length === 1) {
                setTimeout(() => {
                    loadSessions(true);
                }, 2000);
            }
        }
    };

    const handleDermatologyFileSelect = async (file: File) => {
        // Kiểm tra authentication
        if (!isAuthenticated) {
            navigate(
                `${PATHS.LOGIN}?returnUrl=${encodeURIComponent(globalThis.location.pathname)}`
            );
            return;
        }

        // Kiểm tra vị trí
        if (!userLocation) {
            toast.error(t('errors.selectLocationDermatology'));
            return;
        }

        // Get conversation type from current chat
        const currentChat = chatHistories.find((c) => c.id === activeChatId);
        const conversationType = currentChat?.conversationType;

        // VALIDATE: Chỉ cho upload nếu chưa có chat hoặc chat đúng loại
        if (conversationType && conversationType !== ConversationType.MEDICAL_IMAGE_ANALYSIS) {
            toast.warning('Vui lòng tạo cuộc trò chuyện mới để phân tích hình ảnh y tế');
            return;
        }

        // Create new session with MEDICAL_IMAGE_ANALYSIS type
        let currentChatId = activeChatId;
        if (!currentChatId || conversationType !== ConversationType.MEDICAL_IMAGE_ANALYSIS) {
            currentChatId = await createNewSession(
                ConversationType.MEDICAL_IMAGE_ANALYSIS,
                t('messages.analyzeDermatology')
            );
        }

        // Create user message with file attachment
        const userMessage: Message = {
            id: Date.now().toString(),
            content: t('messages.dermatologyImage'),
            sender: 'user',
            timestamp: new Date(),
            fileAttachment: {
                fileName: file.name,
                fileType: file.type,
                fileUrl: URL.createObjectURL(file),
            },
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);

        // Call AI API to analyze dermatology image
        setIsAITyping(true);

        try {
            const response = await AIService.analyzeDermatology(file, userLocation, currentChatId);

            currentChatId = handleAiResponse(response, currentChatId, {
                buildContent: (resp) =>
                    resp.data.message
                        ? resp.data.message.replace(/\\n/g, '\n')
                        : buildDermatologyMessage(resp.data),
            });
            toast.success(t('success.dermatologyAnalyzed'));
        } catch (error: any) {
            console.error('Error analyzing dermatology image:', error);

            // Show error message to user
            const errorContent = getErrorMessage(error);

            const errorMessage: Message = {
                id: Date.now().toString(),
                content: errorContent,
                sender: 'ai',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, errorMessage]);
            toast.error(t('errors.dermatologyFailed'));
        } finally {
            setIsAITyping(false);

            // Reload sessions to sync title from backend
            if (currentChatId && updatedMessages.length === 1) {
                setTimeout(() => {
                    loadSessions(true);
                }, 2000);
            }
        }
    };

    return (
        <div className={styles.aiSupportBooking}>
            <Link to={PATHS.HOME} className={styles.homeButton}>
                <Home size={18} className={styles.homeIcon} />
                <span className={styles.homeText}>{t('home.backToHome')}</span>
            </Link>
            {/* Overlay khi sidebar mở trên mobile */}
            {isSidebarOpen && (
                <div
                    className={styles.sidebarOverlay}
                    onClick={() => setIsSidebarOpen(false)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
                            setIsSidebarOpen(false);
                        }
                    }}
                    aria-label={t('home.closeSidebar')}
                />
            )}
            <div className={styles.container}>
                <div className={styles.chatLayout}>
                    {/* Sidebar - Lịch sử chat */}
                    {isLoadingSessions ? (
                        <ChatSidebarSkeleton />
                    ) : (
                        <ChatSidebar
                            chatHistories={chatHistories}
                            activeChatId={activeChatId}
                            onNewChat={handleNewChat}
                            onSelectChat={handleSelectChat}
                            onDeleteChat={handleDeleteChat}
                            isOpen={isSidebarOpen}
                            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                        />
                    )}

                    {/* Chat Area - Khu vực chat chính */}
                    {isLoadingChat ? (
                        <ChatAreaSkeleton />
                    ) : (
                        <ChatArea
                            messages={messages}
                            isAITyping={isAITyping}
                            onSendMessage={handleSendMessage}
                            onToggleSidebar={() => setIsSidebarOpen(true)}
                            activeChatId={activeChatId}
                            userLocation={userLocation}
                            onLocationChange={(location) => {
                                setUserLocation(location);
                                localStorage.setItem('aiSupportLocation', JSON.stringify(location));
                            }}
                            onLabResultFileSelect={handleLabResultFileSelect}
                            onDermatologyFileSelect={handleDermatologyFileSelect}
                            onNutritionClick={handleStartNutrition}
                            onSymptomClick={handleStartSymptomAnalysis}
                            conversationType={
                                chatHistories.find((c) => c.id === activeChatId)?.conversationType
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AISupportBooking;
