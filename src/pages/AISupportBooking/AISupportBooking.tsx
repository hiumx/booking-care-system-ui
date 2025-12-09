import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Home } from 'lucide-react';
import { toast } from 'react-toastify';
import ChatSidebar from './components/ChatSidebar';
import ChatArea from './components/ChatArea';
import ChatSidebarSkeleton from './components/ChatSidebar/ChatSidebarSkeleton';
import ChatAreaSkeleton from './components/ChatArea/ChatAreaSkeleton';
import { AppDispatch, RootState } from '@/store';
import { fetchUserProfile } from '@/store/slices/userSlice';
import styles from './AISupportBooking.module.scss';
import { Message, ChatHistory, Suggestion } from '@/types/ai.types';
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
                    let formattedTime = 'Vừa xong';
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
                        formattedTime = 'Vừa xong';
                    }

                    return {
                        id: session.sessionId,
                        title: session.title || 'Cuộc trò chuyện mới',
                        lastMessage: session.lastMessage || '',
                        lastMessageTime: formattedTime,
                        avatar: '',
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

                        // Merge: local-only chats (newest) first, then sorted backend histories
                        return [...localOnlyChats, ...historiesFromBackend];
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
    const generateSessionId = (): string => {
        if (globalThis.crypto?.randomUUID) {
            return globalThis.crypto.randomUUID();
        }

        // Ensure crypto.getRandomValues is available for secure random generation
        if (!globalThis.crypto?.getRandomValues) {
            throw new Error('Crypto API not available. Secure random generation is required.');
        }

        const bytes = new Uint8Array(16);
        globalThis.crypto.getRandomValues(bytes);

        // Set version (4) and variant bits for UUID v4
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;

        const byteToHex = (byte: number) => {
            return byte.toString(16).padStart(2, '0');
        };

        const segments = [
            bytes.slice(0, 4),
            bytes.slice(4, 6),
            bytes.slice(6, 8),
            bytes.slice(8, 10),
            bytes.slice(10, 16),
        ];

        return segments.map((segment) => Array.from(segment, byteToHex).join('')).join('-');
    };

    const formatChatTimestamp = (date: Date = new Date()) => {
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    const buildChatHistory = (id: string, initialContent?: string): ChatHistory => {
        const trimmed = initialContent?.trim() ?? '';
        let title = 'Cuộc trò chuyện mới';
        if (trimmed.length > 0) {
            title = trimmed.length > 30 ? `${trimmed.substring(0, 30)}...` : trimmed;
        }

        return {
            id,
            title,
            lastMessage: trimmed,
            lastMessageTime: trimmed ? 'Vừa xong' : formatChatTimestamp(),
            avatar: '',
        };
    };

    const startLocalChat = (
        initialContent?: string,
        options: { preserveMessages?: boolean; replaceHistory?: boolean } = {}
    ): string => {
        const newChatId = generateSessionId();
        const history = buildChatHistory(newChatId, initialContent);

        newlyCreatedChatsRef.current.add(newChatId);
        setChatHistories((prev) => [history, ...prev]);
        setActiveChatId(newChatId);

        if (!options.preserveMessages) {
            setMessages([]);
            setIsLoadingChat(false);
        }

        navigate(replacePathParams(PATHS.AI_SUPPORT_BOOKING_CHAT, { chatId: newChatId }), {
            replace: options.replaceHistory ?? false,
        });

        return newChatId;
    };

    const ensureChatSession = (initialContent: string): string => {
        if (activeChatId) {
            return activeChatId;
        }
        return startLocalChat(initialContent, { preserveMessages: true, replaceHistory: true });
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
            return `Xin lỗi, ${error.message}`;
        }
        if (error.response?.data?.message) {
            return `Xin lỗi, ${error.response.data.message}`;
        }
        return 'Xin lỗi, đã có lỗi xảy ra khi phân tích triệu chứng của bạn. Vui lòng thử lại sau.';
    };

    // Helper function to build lab result message
    const buildLabResultMessage = (data: any): string => {
        const lines: string[] = [];
        lines.push('KẾT QUẢ PHÂN TÍCH XÉT NGHIỆM:');
        lines.push('');

        // Normal indicators
        if (data.normalIndicators && data.normalIndicators.length > 0) {
            lines.push('Các chỉ số bình thường:');
            data.normalIndicators.forEach((indicator: any) => {
                lines.push(
                    `- ${indicator.name}: ${indicator.value} ${indicator.unit} (Tham chiếu: ${indicator.referenceRange})`
                );
            });
            lines.push('');
        }

        // Abnormal indicators
        if (data.abnormalIndicators && data.abnormalIndicators.length > 0) {
            lines.push('Các chỉ số bất thường:');
            data.abnormalIndicators.forEach((indicator: any) => {
                lines.push(
                    `- ${indicator.name}: ${indicator.value} ${indicator.unit} (Tham chiếu: ${indicator.referenceRange})`
                );
                lines.push(`  - Giải thích: ${indicator.explanation}`);
                lines.push(`  - Lời khuyên: ${indicator.advice}`);
                if (indicator.possibleDiagnosis) {
                    lines.push(`  - Chẩn đoán có thể: ${indicator.possibleDiagnosis}`);
                    if (
                        indicator.recommendedSpecialties &&
                        indicator.recommendedSpecialties.length > 0
                    ) {
                        const specialtyNames = indicator.recommendedSpecialties
                            .map((s: any) => s.specialtyName || s)
                            .join(', ');
                        lines.push(`    - Chuyên khoa phù hợp: ${specialtyNames}`);
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
        lines.push('KẾT QUẢ PHÂN TÍCH ẢNH DA:');
        lines.push('');

        // Diagnosis
        if (data.diagnosis) {
            lines.push(`Chẩn đoán khả năng: ${data.diagnosis.conditionName}`);
            lines.push(`Độ tin cậy: ${(data.diagnosis.confidence * 100).toFixed(0)}%`);
            lines.push('');
        }

        // Biopsy recommendation
        if (data.biopsyRecommended) {
            lines.push('Khuyến nghị sinh thiết: Có');
            if (data.biopsyReason) {
                lines.push(`Lý do: ${data.biopsyReason}`);
            }
            lines.push('');
        }

        // General advice
        if (data.generalAdvice && data.generalAdvice.length > 0) {
            lines.push('Lời khuyên:');
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

        const trimmedContent = content.trim();
        const userMessage: Message = {
            id: Date.now().toString(),
            content: trimmedContent,
            sender: 'user',
            timestamp: new Date(),
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);

        // Create new chat if no active chat
        let currentChatId = ensureChatSession(trimmedContent);

        // Call real AI API
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

    const handleNewChat = () => {
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

        startLocalChat(undefined, { preserveMessages: false, replaceHistory: false });
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
            toast.success('Đã xóa cuộc trò chuyện thành công');
            return;
        }

        try {
            await AIService.deleteSession(chatId);
            handleChatDeletionNavigation(chatId);
            await loadSessions(true);
            toast.success('Đã xóa cuộc trò chuyện thành công');
        } catch (error: any) {
            console.error('Error deleting chat:', error);
            toast.error(error?.message || 'Không thể xóa cuộc trò chuyện. Vui lòng thử lại.');
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
            toast.error('Vui lòng chọn vị trí trước khi phân tích kết quả xét nghiệm');
            return;
        }

        // Create user message with file attachment
        // Note: Content format must match backend marker text for upload limit check
        const userMessage: Message = {
            id: Date.now().toString(),
            content: `Đã gửi file xét nghiệm: ${file.name}`,
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

        // Create new chat if no active chat
        let currentChatId = ensureChatSession('Phân tích kết quả xét nghiệm');

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
            toast.success('Đã phân tích kết quả xét nghiệm thành công');
        } catch (error: any) {
            console.error('Error analyzing lab result:', error);

            // Check if error is about upload limit
            // Backend returns BadRequest with message in error.response.data.message
            const errorMessage = error?.response?.data?.message || error?.message || '';

            if (
                errorMessage
                    .toLowerCase()
                    .includes('mỗi cuộc trò chuyện chỉ hỗ trợ phân tích một file xét nghiệm')
            ) {
                // Show clear message to user
                toast.info(
                    'Mỗi cuộc trò chuyện chỉ hỗ trợ phân tích một file xét nghiệm. Vui lòng tạo cuộc trò chuyện mới để tiếp tục với file khác nhé!'
                );
                // Remove the user message since upload was rejected
                setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
                setIsAITyping(false);
                return;
            }

            // Show generic error message to user
            const errorContent = getErrorMessage(error);

            const errorMsg: Message = {
                id: Date.now().toString(),
                content: errorContent,
                sender: 'ai',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, errorMsg]);
            toast.error('Không thể phân tích kết quả xét nghiệm. Vui lòng thử lại.');
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
            toast.error('Vui lòng chọn vị trí trước khi phân tích ảnh da');
            return;
        }

        // Create user message with file attachment
        const userMessage: Message = {
            id: Date.now().toString(),
            content: 'Đã gửi ảnh da để phân tích',
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

        // Create new chat if no active chat
        let currentChatId = ensureChatSession('Phân tích ảnh da');

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
            toast.success('Đã phân tích ảnh da thành công');
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
            toast.error('Không thể phân tích ảnh da. Vui lòng thử lại.');
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
                <span className={styles.homeText}>Trở về trang chủ</span>
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
                    aria-label="Close sidebar"
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
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AISupportBooking;
