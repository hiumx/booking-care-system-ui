import React, { useState, useEffect } from 'react';
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
        if (typeof window !== 'undefined') {
            return window.innerWidth > 768;
        }
        return true;
    });

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
            navigate(`${PATHS.LOGIN}?returnUrl=${encodeURIComponent(window.location.pathname)}`);
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

            // Ưu tiên 1: Nếu đã đăng nhập, kiểm tra address trong profile
            if (isAuthenticated && profile?.address) {
                location = {
                    displayName: profile.address,
                };
            } else {
                // Ưu tiên 2: Kiểm tra localStorage
                const saved = localStorage.getItem('aiSupportLocation');
                if (saved) {
                    try {
                        location = JSON.parse(saved);
                    } catch (e) {
                        console.error('Error parsing location from localStorage:', e);
                    }
                }
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
    useEffect(() => {
        const loadSessions = async () => {
            setIsLoadingSessions(true);
            try {
                // Backend will get userId from authentication token
                const response = await AIService.getUserSessions();
                if (response.success && response.data) {
                    // Map sessions to ChatHistory format
                    const histories: ChatHistory[] = response.data.map((session) => {
                        // Parse UTC time string and convert to local time
                        // session.updatedAt is in UTC format from backend (ISO string)
                        let formattedTime = 'Vừa xong';
                        try {
                            // Parse the UTC date string
                            const utcDate = new Date(session.updatedAt);

                            // Check if date is valid
                            if (!isNaN(utcDate.getTime())) {
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
                    setChatHistories(histories);
                }
            } catch (error) {
                console.error('Error loading conversation sessions:', error);
                // Don't show error to user, just log it
            } finally {
                setIsLoadingSessions(false);
            }
        };

        // Only load if authenticated and have location
        if (isAuthenticated && userLocation) {
            loadSessions();
        }
    }, [isAuthenticated, userLocation]);

    // Sync activeChatId with URL parameter
    useEffect(() => {
        const syncChatWithUrl = async () => {
            if (chatId && chatId !== activeChatId && isAuthenticated && userLocation) {
                // URL has a chatId, load that chat
                setActiveChatId(chatId);
                setIsLoadingChat(true);

                // Load conversation history for this chat
                try {
                    const response = await AIService.getSession(chatId);
                    if (response.success && response.data?.conversationHistory) {
                        const history = response.data.conversationHistory;
                        const loadedMessages: Message[] = history.map((msg: any, index: number) =>
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
            } else if (!chatId && activeChatId) {
                // No chatId in URL but we have an active chat, update URL
                navigate(
                    replacePathParams(PATHS.AI_SUPPORT_BOOKING_CHAT, { chatId: activeChatId }),
                    { replace: true }
                );
            }
        };

        syncChatWithUrl();
    }, [chatId, isAuthenticated, userLocation]);

    // Generate GUID-like string for session ID
    const generateSessionId = (): string => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.trunc(Math.random() * 16);
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };

    const handleSendMessage = async (content: string) => {
        if (!content.trim()) return;

        // Kiểm tra authentication
        if (!isAuthenticated) {
            navigate(`${PATHS.LOGIN}?returnUrl=${encodeURIComponent(window.location.pathname)}`);
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
            currentChatId = generateSessionId();
            const newChat: ChatHistory = {
                id: currentChatId,
                title:
                    content.trim().length > 30
                        ? `${content.trim().substring(0, 30)}...`
                        : content.trim(),
                lastMessage: content.trim(),
                lastMessageTime: 'Vừa xong',
                avatar: '',
            };
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
            // Prepare conversation history (only user and AI messages, exclude current message)
            const conversationHistory = messages
                .filter((m) => m.sender === 'user' || m.sender === 'ai')
                .map((m) => ({
                    role: m.sender,
                    content: m.content,
                    timestamp: m.timestamp.toISOString(),
                }));

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
                // Update active chat ID if backend returns a different session ID
                setActiveChatId(response.data.sessionId);
                currentChatId = response.data.sessionId;
            }

            // Map response to Message format
            const suggestions: Suggestion[] = [
                ...(response.data.recommendedDoctors || []).map((d) => ({
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
                })),
                ...(response.data.recommendedHospitals || []).map((h) => ({
                    type: 'hospital' as const,
                    hospital: {
                        id: h.id,
                        name: h.name,
                        address: h.address,
                        specialtyId: [], // Would need from API
                        specialtyName: h.specialtyNames || [],
                        imageUrl: h.imageUrl || undefined,
                    },
                })),
            ];

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
            let errorContent =
                'Xin lỗi, đã có lỗi xảy ra khi phân tích triệu chứng của bạn. Vui lòng thử lại sau.';

            if (error.message) {
                errorContent = `Xin lỗi, ${error.message}`;
            } else if (error.response?.data?.message) {
                errorContent = `Xin lỗi, ${error.response.data.message}`;
            }

            const errorMessage: Message = {
                id: Date.now().toString(),
                content: errorContent,
                sender: 'ai',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsAITyping(false);

            // Update chat history
            if (currentChatId) {
                setChatHistories((prev) =>
                    prev.map((chat) =>
                        chat.id === currentChatId
                            ? {
                                  ...chat,
                                  lastMessage: content.trim(),
                                  lastMessageTime: 'Vừa xong',
                              }
                            : chat
                    )
                );
            }
        }
    };

    const handleNewChat = () => {
        // Kiểm tra authentication
        if (!isAuthenticated) {
            navigate(`${PATHS.LOGIN}?returnUrl=${encodeURIComponent(window.location.pathname)}`);
            return;
        }

        // Kiểm tra vị trí trước khi tạo chat mới
        if (!userLocation) {
            // Modal vị trí sẽ tự động hiển thị trong SearchBox
            return;
        }

        const newChatId = generateSessionId();
        const newChat: ChatHistory = {
            id: newChatId,
            title: 'Cuộc trò chuyện mới',
            lastMessage: '',
            lastMessageTime: 'Vừa tạo',
            avatar: '',
        };
        setChatHistories((prev) => [newChat, ...prev]);
        setActiveChatId(newChatId);
        setMessages([]);
        // Navigate to the new chat URL
        navigate(replacePathParams(PATHS.AI_SUPPORT_BOOKING_CHAT, { chatId: newChatId }));
    };

    const handleSelectChat = async (chatId: string) => {
        // Kiểm tra authentication
        if (!isAuthenticated) {
            navigate(`${PATHS.LOGIN}?returnUrl=${encodeURIComponent(window.location.pathname)}`);
            return;
        }

        // Kiểm tra vị trí trước khi chọn chat
        if (!userLocation) {
            // Modal vị trí sẽ tự động hiển thị trong SearchBox
            return;
        }

        setActiveChatId(chatId);
        // Update URL to reflect selected chat
        navigate(replacePathParams(PATHS.AI_SUPPORT_BOOKING_CHAT, { chatId: chatId }));
        setIsLoadingChat(true);

        // Load conversation history for this chat
        try {
            const response = await AIService.getSession(chatId);
            if (response.success && response.data?.conversationHistory) {
                const history = response.data.conversationHistory;
                // Map conversation history to Message format
                const loadedMessages: Message[] = history.map((msg: any, index: number) => {
                    // Parse suggestions if available
                    let suggestions: Suggestion[] | undefined = undefined;
                    if (msg.suggestions) {
                        try {
                            const suggestionsData = msg.suggestions;
                            console.log('Loading suggestions for message:', index, suggestionsData);

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

                            suggestions = [
                                ...(Array.isArray(doctors) ? doctors : []).map((d: any) => ({
                                    type: 'doctor' as const,
                                    doctor: {
                                        id: d.id || d.doctor?.id,
                                        name: d.name || d.doctor?.name,
                                        specialtyName: d.specialtyName || d.doctor?.specialtyName,
                                        hospitalName: d.hospitalName || d.doctor?.hospitalName,
                                        rating: d.rating || d.doctor?.rating || 0,
                                        yearOfExperience:
                                            d.yearOfExperience || d.doctor?.yearOfExperience || 0,
                                        serviceTypeName:
                                            d.serviceTypeName ||
                                            d.doctor?.serviceTypeName ||
                                            undefined,
                                        price: d.price || d.doctor?.price || undefined,
                                        avatarUrl: d.avatarUrl || d.doctor?.avatarUrl || undefined,
                                    },
                                })),
                                ...(Array.isArray(hospitals) ? hospitals : []).map((h: any) => ({
                                    type: 'hospital' as const,
                                    hospital: {
                                        id: h.id || h.hospital?.id,
                                        name: h.name || h.hospital?.name,
                                        address: h.address || h.hospital?.address,
                                        specialtyId: [],
                                        specialtyName:
                                            h.specialtyNames || h.hospital?.specialtyName || [],
                                        imageUrl: h.imageUrl || h.hospital?.imageUrl || undefined,
                                    },
                                })),
                            ];

                            if (suggestions.length > 0) {
                                console.log(
                                    'Successfully loaded suggestions:',
                                    suggestions.length,
                                    'items'
                                );
                            }
                        } catch (e) {
                            console.error('Error parsing suggestions:', e, msg.suggestions);
                        }
                    } else {
                        console.log('No suggestions found for message:', index);
                    }

                    // Determine sender: 'ai' for AI messages, 'user' for patient/guest/user messages
                    const sender = msg.role?.toLowerCase() === 'ai' ? 'ai' : 'user';

                    return {
                        id: `${chatId}-${index}`,
                        content: msg.content || '',
                        sender: sender,
                        timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
                        suggestions: suggestions,
                    };
                });
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

            // Cập nhật UI sau khi xóa thành công
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
        } catch (error) {
            console.error('Error deleting chat:', error);
            // Vẫn xóa trên UI nếu API call fail (fallback)
            setChatHistories((prev) => {
                const remainingChats = prev.filter((chat) => chat.id !== chatId);
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
        }
    };

    const handleEditMessage = (messageId: string, newContent: string) => {
        setMessages((prev) =>
            prev.map((msg) => (msg.id === messageId ? { ...msg, content: newContent } : msg))
        );
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
                            onEditMessage={handleEditMessage}
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
