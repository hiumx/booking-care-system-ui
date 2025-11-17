import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Home } from 'lucide-react';
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

// Helper function to parse doctor data
const parseDoctorData = (d: any) => ({
    type: 'doctor' as const,
    doctor: {
        id: d.id || d.doctor?.id,
        name: d.name || d.doctor?.name,
        specialtyName: d.specialtyName || d.doctor?.specialtyName,
        hospitalName: d.hospitalName || d.doctor?.hospitalName,
        rating: d.rating || d.doctor?.rating || 0,
        yearOfExperience: d.yearOfExperience || d.doctor?.yearOfExperience || 0,
        serviceTypeName: d.serviceTypeName || d.doctor?.serviceTypeName || undefined,
        price: d.price || d.doctor?.price || undefined,
        avatarUrl: d.avatarUrl || d.doctor?.avatarUrl || undefined,
    },
});

// Helper function to parse hospital data
const parseHospitalData = (h: any) => ({
    type: 'hospital' as const,
    hospital: {
        id: h.id || h.hospital?.id,
        name: h.name || h.hospital?.name,
        address: h.address || h.hospital?.address,
        specialtyId: [],
        specialtyName: h.specialtyNames || h.hospital?.specialtyName || [],
        imageUrl: h.imageUrl || h.hospital?.imageUrl || undefined,
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

        return [
            ...(Array.isArray(doctors) ? doctors : []).map(parseDoctorData),
            ...(Array.isArray(hospitals) ? hospitals : []).map(parseHospitalData),
        ];
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
    const loadSessions = async (silentReload: boolean = false) => {
        if (!silentReload) {
            setIsLoadingSessions(true);
        }
        try {
            // Backend will get userId from authentication token
            const response = await AIService.getUserSessions();
            if (response.success && response.data) {
                // Map sessions to ChatHistory format
                const historiesFromBackend: ChatHistory[] = response.data.map((session) => {
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
                        const localOnlyChats = prevHistories.filter(
                            (chat) => !backendIds.has(chat.id)
                        );

                        // Merge: backend histories + local-only chats
                        return [...historiesFromBackend, ...localOnlyChats];
                    });
                } else {
                    // Full reload (first time load), just use backend data
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
    };

    // Track if initial location load has been done
    const hasLoadedSessionsRef = useRef(false);

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
    }, [isAuthenticated, userLocation]);

    // Sync activeChatId with URL parameter
    useEffect(() => {
        const syncChatWithUrl = async () => {
            // Nếu không authenticated hoặc không có location, không làm gì
            if (!isAuthenticated || !userLocation) {
                return;
            }

            // Case 1: URL có chatId và khác với activeChatId hiện tại
            if (chatId && chatId !== activeChatId) {
                setActiveChatId(chatId);

                // Skip loading if this is a newly created chat (not saved yet)
                const isNewlyCreated = newlyCreatedChatsRef.current.has(chatId);

                if (!isNewlyCreated) {
                    // Load from backend for existing chats
                    setIsLoadingChat(true);

                    try {
                        const response = await AIService.getSession(chatId);
                        if (response.success && response.data?.conversationHistory) {
                            const history = response.data.conversationHistory;
                            const loadedMessages: Message[] = history.map(
                                (msg: any, index: number) =>
                                    convertMessageFromAPI(msg, chatId, index)
                            );
                            setMessages(loadedMessages);
                        } else {
                            setMessages([]);
                        }
                    } catch (error) {
                        console.error('Error loading conversation history:', error);
                        setMessages([]);
                    } finally {
                        setIsLoadingChat(false);
                    }
                } else {
                    // New chat - keep current messages, don't load from backend
                }
            }
            // Case 2: Không có chatId trong URL nhưng có activeChatId
            else if (!chatId && activeChatId) {
                // Sync URL với activeChatId
                navigate(
                    replacePathParams(PATHS.AI_SUPPORT_BOOKING_CHAT, { chatId: activeChatId }),
                    { replace: true }
                );
            }
            // Case 3: Không có chatId và không có activeChatId → trang chủ AI (empty state)
            // Không cần làm gì
        };

        syncChatWithUrl();
    }, [chatId, activeChatId, isAuthenticated, userLocation, navigate]);

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

    // Helper function to create a new chat
    const createNewChat = (content: string): ChatHistory => {
        const title =
            content.trim().length > 30 ? `${content.trim().substring(0, 30)}...` : content.trim();

        return {
            id: generateSessionId(),
            title,
            lastMessage: content.trim(),
            lastMessageTime: 'Vừa xong',
            avatar: '',
        };
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

        const userMessage: Message = {
            id: Date.now().toString(),
            content: content.trim(),
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);

        // Create new chat if no active chat
        let currentChatId = activeChatId;
        if (!currentChatId) {
            const newChat = createNewChat(content);
            currentChatId = newChat.id;

            // Track this as a newly created chat to prevent loading from backend
            newlyCreatedChatsRef.current.add(currentChatId);

            setChatHistories((prev) => [newChat, ...prev]);
            setActiveChatId(currentChatId);

            // Navigate to the new chat URL
            navigate(replacePathParams(PATHS.AI_SUPPORT_BOOKING_CHAT, { chatId: currentChatId }), {
                replace: true,
            });
        }

        // Call real AI API
        setIsAITyping(true);

        try {
            // Prepare conversation history
            const conversationHistory = prepareConversationHistory(messages);

            // Backend will get userId from authentication token
            const request: SymptomAnalysisRequest = {
                sessionId: currentChatId,
                message: content.trim(),
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

            // Update session ID from response if provided
            if (response.data.sessionId && response.data.sessionId !== currentChatId) {
                const oldChatId = currentChatId;
                const newChatId = response.data.sessionId;

                // Update tracking: remove old ID, add new ID
                if (newlyCreatedChatsRef.current.has(oldChatId)) {
                    newlyCreatedChatsRef.current.delete(oldChatId);
                    newlyCreatedChatsRef.current.add(newChatId);
                }

                // Update chatHistories: replace old chat with new ID
                setChatHistories((prev) =>
                    prev.map((chat) => (chat.id === oldChatId ? { ...chat, id: newChatId } : chat))
                );

                // Update active chat ID
                setActiveChatId(newChatId);
                currentChatId = newChatId;

                // Navigate to new URL
                navigate(replacePathParams(PATHS.AI_SUPPORT_BOOKING_CHAT, { chatId: newChatId }), {
                    replace: true,
                });
            }

            // Map response to suggestions
            const suggestions = mapResponseToSuggestions(response);

            // Build AI message content
            // Message từ backend đã bao gồm disclaimer và intro text nếu có recommendations
            const aiMessageContent = response.data.message || '';

            const aiMessage: Message = {
                id: Date.now().toString(),
                content: aiMessageContent.trim(),
                sender: 'ai',
                timestamp: new Date(response.data.timestamp || new Date().toISOString()),
                suggestions: suggestions.length > 0 ? suggestions : undefined,
            };

            setMessages((prev) => [...prev, aiMessage]);

            // Handle emergency cases
            if (response.data.requiresImmediateAttention) {
                console.warn('EMERGENCY: User needs immediate medical attention');
                // Show emergency alert
                alert(
                    '⚠️ KHẨN CẤP: Các triệu chứng của bạn cần được chăm sóc y tế ngay lập tức. Vui lòng gọi 115 hoặc đến phòng cấp cứu gần nhất!'
                );
            }
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
            if (currentChatId && messages.length <= 1) {
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

        const newChatId = generateSessionId();
        const now = new Date();
        const formattedTime = now.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
        const newChat: ChatHistory = {
            id: newChatId,
            title: 'Cuộc trò chuyện mới',
            lastMessage: '',
            lastMessageTime: formattedTime,
            avatar: '',
        };
        setChatHistories([newChat, ...chatHistories]);
        setActiveChatId(newChatId);
        setMessages([]);
        // Navigate to the new chat URL
        navigate(replacePathParams(PATHS.AI_SUPPORT_BOOKING_CHAT, { chatId: newChatId }));
    };

    // Helper function to parse doctor suggestions
    const parseDoctorSuggestions = (doctors: any[]): Suggestion[] => {
        if (!Array.isArray(doctors)) return [];
        return doctors.map(parseDoctorData);
    };

    // Helper function to parse hospital suggestions
    const parseHospitalSuggestions = (hospitals: any[]): Suggestion[] => {
        if (!Array.isArray(hospitals)) return [];

        return hospitals.map((h: any) => ({
            type: 'hospital' as const,
            hospital: {
                id: h.id || h.hospital?.id,
                name: h.name || h.hospital?.name,
                address: h.address || h.hospital?.address,
                specialtyId: [],
                specialtyName: h.specialtyNames || h.hospital?.specialtyName || [],
                imageUrl: h.imageUrl || h.hospital?.imageUrl || undefined,
            },
        }));
    };

    // Helper function to parse suggestions from message
    const parseSuggestions = (suggestionsData: any): Suggestion[] | undefined => {
        if (!suggestionsData) {
            return undefined;
        }

        try {
            // Handle both object and already parsed structure
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

            const suggestions = [
                ...parseDoctorSuggestions(doctors),
                ...parseHospitalSuggestions(hospitals),
            ];

            return suggestions;
        } catch (e) {
            console.error('Error parsing suggestions:', e, suggestionsData);
            return undefined;
        }
    };

    // Helper function to convert history message to Message format
    const convertHistoryMessage = (msg: any, index: number, chatId: string): Message => {
        const suggestions = parseSuggestions(msg.suggestions);
        const sender = msg.role?.toLowerCase() === 'ai' ? 'ai' : 'user';

        return {
            id: `${chatId}-${index}`,
            content: msg.content || '',
            sender: sender,
            timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
            suggestions: suggestions,
        };
    };

    // Helper function to handle chat deletion navigation
    const handleChatDeletionNavigation = (chatId: string) => {
        setChatHistories((prev) => {
            const remainingChats = prev.filter((chat) => chat.id !== chatId);
            // Nếu chat bị xóa là chat đang active, chuyển sang chat khác hoặc reset
            if (activeChatId === chatId) {
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
                    setMessages([]);
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

        setIsLoadingChat(true);
        try {
            const response = await AIService.getSession(chatId);
            if (response.success && response.data?.conversationHistory) {
                const history = response.data.conversationHistory;
                const loadedMessages: Message[] = history.map((msg: any, index: number) =>
                    convertHistoryMessage(msg, index, chatId)
                );
                setMessages(loadedMessages);
            } else {
                setMessages([]);
            }
        } catch (error) {
            console.error('Error loading conversation history:', error);
            setMessages([]);
        } finally {
            setIsLoadingChat(false);
        }
    };

    const handleDeleteChat = async (chatId: string) => {
        try {
            // Gọi API để xóa session trong database
            await AIService.deleteSession(chatId);
        } catch (error) {
            console.error('Error deleting chat:', error);
            // Vẫn xóa trên UI nếu API call fail (fallback)
        } finally {
            // Cập nhật UI sau khi xóa (thành công hoặc thất bại)
            handleChatDeletionNavigation(chatId);
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
                            userLocation={userLocation}
                            onLocationChange={(location) => {
                                setUserLocation(location);
                                localStorage.setItem('aiSupportLocation', JSON.stringify(location));
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AISupportBooking;
