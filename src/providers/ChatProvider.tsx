import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    ReactNode,
} from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from '@/store';
import { useChatHub, ChatHubCallbacks } from '@/hooks/useChatHub';
import { ChatService } from '@/services/chat.service';
import {
    ConversationResponse,
    MessageResponse,
    SignalRMessageReceived,
    SignalRMessageRead,
    SignalRTypingEvent,
    MessageType,
} from '@/types/communication.types';

interface ChatContextValue {
    // State
    conversations: ConversationResponse[];
    activeConversation: ConversationResponse | null;
    messages: MessageResponse[];
    onlineUsers: Set<string>;
    typingUsers: Map<string, string>; // conversationId -> userId
    isLoading: boolean;
    isLoadingMessages: boolean;

    // Conversation methods
    loadConversations: () => Promise<void>;
    selectConversation: (conversationId: string) => Promise<void>;
    createOrGetConversation: (otherUserId: string) => Promise<ConversationResponse>;

    // Message methods
    sendMessage: (content: string, type?: MessageType, files?: File[]) => Promise<void>;
    sendMessageViaREST: (content: string, type?: MessageType, files?: File[]) => Promise<void>;
    loadMessages: (conversationId: string, before?: string) => Promise<void>;
    markAsRead: (messageId: string) => Promise<void>;
    markAllAsRead: (conversationId: string) => Promise<void>;

    // Real-time methods
    startTyping: () => void;
    stopTyping: () => void;

    // SignalR status
    isConnected: boolean;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

interface ChatProviderProps {
    children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    // Get user info from Redux
    const userProfile = useSelector((state: RootState) => state.user.profile);
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    const userId = userProfile?.accountId || '';

    // State
    const [conversations, setConversations] = useState<ConversationResponse[]>([]);
    const [activeConversation, setActiveConversation] = useState<ConversationResponse | null>(null);
    const [messages, setMessages] = useState<MessageResponse[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
    const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);

    // Helper function to get sender info for a message
    const getSenderInfo = useCallback(
        (senderId: string) => {
            const senderIdUpper = senderId.toUpperCase();
            const currentUserIdUpper = (
                userProfile?.accountId ||
                userProfile?.id ||
                ''
            ).toUpperCase();

            // If sender is current user, use user profile
            if (senderIdUpper === currentUserIdUpper) {
                return {
                    id: userProfile?.accountId || userProfile?.id,
                    accountId: userProfile?.accountId,
                    email: userProfile?.email || '',
                    fullName: userProfile?.fullName || 'You',
                    avatarUrl: userProfile?.avatarUrl || '/default-avatar.png',
                    phoneNumber: userProfile?.phone,
                };
            }

            // Otherwise, try to find sender in active conversation's participant details
            if (activeConversation?.participantDetails) {
                const participant = activeConversation.participantDetails.find(
                    (p) => (p.id || p.accountId || '').toUpperCase() === senderIdUpper
                );
                if (participant) {
                    return participant;
                }
            }

            // Fallback to basic info
            return {
                id: senderId,
                email: '',
                fullName: 'Unknown User',
                avatarUrl: '/default-avatar.png',
            };
        },
        [userProfile, activeConversation]
    );

    // SignalR callbacks
    const hubCallbacks: ChatHubCallbacks = {
        onMessageReceived: useCallback(
            (message: SignalRMessageReceived) => {
                console.log('[ChatProvider] 📨 ReceiveMessage event fired!');
                console.log('[ChatProvider] Message received:', message);

                // Add message to messages list if it's for active conversation
                if (activeConversation && message.conversationId === activeConversation.id) {
                    const newMessage: MessageResponse = {
                        id: message.messageId,
                        conversationId: message.conversationId,
                        senderId: message.senderId,
                        receiverId: message.receiverId,
                        content: message.content,
                        type: message.type,
                        status: message.status,
                        attachments: [],
                        createdAt: message.createdAt,
                        updatedAt: message.createdAt,
                        senderInfo: getSenderInfo(message.senderId), // ✅ Add sender info
                    };

                    // Deduplicate: only add if message doesn't exist
                    setMessages((prev) => {
                        const exists = prev.some((m) => m.id === newMessage.id);
                        if (exists) {
                            console.log(
                                '[ChatProvider] ⚠️ Message already exists, skipping:',
                                newMessage.id
                            );
                            return prev;
                        }
                        console.log('[ChatProvider] ✅ Adding new message to UI:', newMessage.id);
                        return [...prev, newMessage];
                    });
                }

                // Update conversation's last message
                setConversations((prev) =>
                    prev.map((conv) =>
                        conv.id === message.conversationId
                            ? {
                                  ...conv,
                                  lastMessage: {
                                      messageId: message.messageId,
                                      content: message.content,
                                      senderId: message.senderId,
                                      createdAt: message.createdAt,
                                  },
                                  unreadCount:
                                      message.senderId !== userId
                                          ? (conv.unreadCount || 0) + 1
                                          : conv.unreadCount,
                              }
                            : conv
                    )
                );

                // Show toast notification if message is not from current user
                if (message.senderId !== userId) {
                    toast.info('Bạn có tin nhắn mới!');
                }
            },
            [activeConversation, userId, getSenderInfo]
        ),

        onMessageRead: useCallback((data: SignalRMessageRead) => {
            console.log('[ChatProvider] Message read:', data);

            // Update message status
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === data.messageId
                        ? {
                              ...msg,
                              status: 'READ' as any,
                              readAt: data.readAt,
                          }
                        : msg
                )
            );
        }, []),

        onAllMessagesRead: useCallback((data: any) => {
            console.log('[ChatProvider] All messages read:', data);

            // Reset unread count for conversation
            setConversations((prev) =>
                prev.map((conv) =>
                    conv.id === data.conversationId ? { ...conv, unreadCount: 0 } : conv
                )
            );
        }, []),

        onUserStartedTyping: useCallback((data: SignalRTypingEvent) => {
            console.log('[ChatProvider] User started typing:', data);
            setTypingUsers((prev) => {
                const newMap = new Map(prev);
                newMap.set(data.conversationId, data.userId);
                return newMap;
            });
        }, []),

        onUserStoppedTyping: useCallback((data: SignalRTypingEvent) => {
            console.log('[ChatProvider] User stopped typing:', data);
            setTypingUsers((prev) => {
                const newMap = new Map(prev);
                newMap.delete(data.conversationId);
                return newMap;
            });
        }, []),

        onUserOnline: useCallback((userId: string) => {
            console.log('[ChatProvider] User online:', userId);
            setOnlineUsers((prev) => new Set(prev).add(userId));
        }, []),

        onUserOffline: useCallback((userId: string) => {
            console.log('[ChatProvider] User offline:', userId);
            setOnlineUsers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }, []),

        onError: useCallback((error: string) => {
            console.error('[ChatProvider] SignalR error:', error);
            toast.error(`Lỗi kết nối: ${error}`);
        }, []),
    };

    // Initialize SignalR hub
    const chatHub = useChatHub(accessToken, hubCallbacks);

    // Load conversations on mount
    useEffect(() => {
        if (userId) {
            loadConversations();
        }
    }, [userId]);

    // Join conversation when selected
    useEffect(() => {
        console.log('[ChatProvider] Join conversation effect triggered:', {
            hasActiveConversation: !!activeConversation,
            conversationId: activeConversation?.id,
            isConnected: chatHub.isConnected,
        });

        if (activeConversation && chatHub.isConnected) {
            console.log(
                '[ChatProvider] 🔗 Attempting to join conversation:',
                activeConversation.id
            );
            chatHub
                .joinConversation(activeConversation.id)
                .then(() => {
                    console.log(
                        '[ChatProvider] ✅ Successfully joined conversation:',
                        activeConversation.id
                    );
                })
                .catch((error) => {
                    console.error('[ChatProvider] ❌ Error joining conversation:', error);
                });

            return () => {
                console.log('[ChatProvider] 🔌 Leaving conversation:', activeConversation.id);
                chatHub.leaveConversation(activeConversation.id).catch((error) => {
                    console.error('[ChatProvider] Error leaving conversation:', error);
                });
            };
        } else {
            console.warn('[ChatProvider] ⚠️ Cannot join conversation:', {
                reason: !activeConversation ? 'No active conversation' : 'SignalR not connected',
            });
        }
    }, [activeConversation, chatHub]);

    // Conversation methods
    const loadConversations = useCallback(async () => {
        if (!userId) return;

        setIsLoading(true);
        try {
            const response = await ChatService.getConversations(userId, {
                limit: 50,
                includeParticipantDetails: true,
                includeUnreadCount: true,
                includeOnlineStatus: true,
            });
            setConversations(response.data.data);
        } catch (error) {
            console.error('[ChatProvider] Error loading conversations:', error);
            toast.error('Không thể tải danh sách hội thoại');
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    const selectConversation = useCallback(
        async (conversationId: string) => {
            setIsLoadingMessages(true);
            try {
                // Load conversation details
                const convResponse = await ChatService.getConversation(conversationId);
                setActiveConversation(convResponse.data);

                // Load messages (mixed timeline includes both messages and call logs)
                const messagesResponse = await ChatService.getMessages(conversationId, {
                    limit: 50,
                    includeSenderInfo: true,
                });

                // Extract messages from mixed timeline items
                // Backend returns { items: [{ itemType: "Message", message: {...} }] }
                // Backend sorts by descending (newest first), but UI needs ascending (oldest first)
                const responseData = messagesResponse.data as any;
                const timelineItems = responseData.items || responseData.data || [];
                const extractedMessages = timelineItems
                    .filter((item: any) => item.itemType === 'Message' && item.message)
                    .map((item: any) => item.message)
                    .reverse(); // Reverse to show oldest first, newest last

                setMessages(extractedMessages);

                // Check if conversation has unread messages before calling mark-all-as-read
                const conversation = conversations.find((conv) => conv.id === conversationId);
                const hasUnreadMessages =
                    conversation && conversation.unreadCount && conversation.unreadCount > 0;

                if (hasUnreadMessages) {
                    // Only mark as read if there are unread messages
                    try {
                        if (chatHub.isConnected) {
                            await chatHub.markAllMessagesAsRead(conversationId);
                        } else {
                            await ChatService.markAllMessagesAsRead({
                                conversationId,
                                userId,
                            });
                        }

                        // Update local state (reset unread count)
                        setConversations((prev) =>
                            prev.map((conv) =>
                                conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
                            )
                        );
                    } catch (markError) {
                        // Log but don't fail the whole selection
                        console.warn('[ChatProvider] Could not mark messages as read:', markError);
                    }
                } else {
                    console.log('[ChatProvider] Skipping mark-all-as-read, no unread messages');
                }
            } catch (error) {
                console.error('[ChatProvider] Error selecting conversation:', error);
                toast.error('Không thể tải hội thoại');
                // Don't clear activeConversation if it was already set
            } finally {
                setIsLoadingMessages(false);
            }
        },
        [userId, chatHub, conversations]
    );

    const createOrGetConversation = useCallback(
        async (otherUserId: string): Promise<ConversationResponse> => {
            try {
                // Try to find existing conversation
                const response = await ChatService.getConversationBetweenUsers(userId, otherUserId);
                return response.data;
            } catch {
                // Create new conversation if not found
                const response = await ChatService.createConversation({
                    participants: [userId, otherUserId],
                });
                return response.data;
            }
        },
        [userId]
    );

    // Message methods
    const loadMessages = useCallback(async (conversationId: string, before?: string) => {
        try {
            const response = await ChatService.getMessages(conversationId, {
                limit: 50,
                before,
                messagesOnly: true,
                includeSenderInfo: true,
                includeReceiverInfo: true,
            });

            // Extract messages (handle both direct array and items structure)
            // Backend sorts by descending (newest first), but UI needs ascending (oldest first)
            const responseData = response.data as any;
            const timelineItems = responseData.items || responseData.data || [];
            const extractedMessages = Array.isArray(timelineItems)
                ? timelineItems
                      .filter((item: any) => !item.itemType || item.itemType === 'Message')
                      .map((item: any) => item.message || item)
                      .reverse() // Reverse to show oldest first, newest last
                : [];

            if (before) {
                // Load more older messages - prepend to the beginning
                setMessages((prev) => [...extractedMessages, ...prev]);
            } else {
                // Initial load
                setMessages(extractedMessages);
            }
        } catch (error) {
            console.error('[ChatProvider] Error loading messages:', error);
            toast.error('Không thể tải tin nhắn');
        }
    }, []);

    const sendMessage = useCallback(
        async (content: string, type: MessageType = MessageType.TEXT, files?: File[]) => {
            if (!activeConversation) {
                console.error('[ChatProvider] No active conversation');
                toast.error('Chưa chọn cuộc hội thoại');
                return;
            }

            console.log('[ChatProvider] Sending message:', {
                conversationId: activeConversation.id,
                content: content.substring(0, 50),
                type,
                hasFiles: !!files,
                isConnected: chatHub.isConnected,
                userId,
            });

            try {
                // Try to send via SignalR first
                if (chatHub.isConnected && type === MessageType.TEXT && !files) {
                    // Find receiver with case-insensitive comparison
                    console.log('[ChatProvider] Finding receiver - userId:', userId);
                    console.log('[ChatProvider] Participants:', activeConversation.participants);

                    const receiverId = activeConversation.participants.find(
                        (p) => p.toLowerCase() !== userId?.toLowerCase()
                    );

                    console.log('[ChatProvider] Sending via SignalR to receiver:', receiverId);

                    if (!receiverId) {
                        console.warn('[ChatProvider] ⚠️ No receiver found! Self-conversation?');
                    }

                    await chatHub.sendMessage({
                        conversationId: activeConversation.id,
                        content,
                        receiverId,
                    });

                    console.log('[ChatProvider] ✅ Message sent successfully via SignalR');
                } else {
                    // Fall back to REST API for files or if SignalR is not connected
                    console.log('[ChatProvider] Using REST API fallback');
                    await sendMessageViaREST(content, type, files);
                }
            } catch (error) {
                console.error('[ChatProvider] ❌ Error sending message:', error);
                toast.error('Không thể gửi tin nhắn');
                throw error;
            }
        },
        [activeConversation, userId, chatHub]
    );

    const sendMessageViaREST = useCallback(
        async (content: string, type: MessageType = MessageType.TEXT, files?: File[]) => {
            if (!activeConversation) return;

            try {
                let response;
                if (files && files.length > 0) {
                    // Send with files
                    response = await ChatService.createMessageWithFiles({
                        conversationId: activeConversation.id,
                        senderId: userId,
                        receiverId: activeConversation.participants.find((p) => p !== userId),
                        content,
                        type,
                        files,
                    });
                } else {
                    // Send text message
                    response = await ChatService.createMessage({
                        conversationId: activeConversation.id,
                        senderId: userId,
                        receiverId: activeConversation.participants.find((p) => p !== userId),
                        content,
                        type,
                    });
                }

                // Add message to local state with senderInfo
                const messageWithSenderInfo = {
                    ...response.data,
                    senderInfo: response.data.senderInfo || getSenderInfo(response.data.senderId),
                };
                setMessages((prev) => [...prev, messageWithSenderInfo]);
            } catch (error) {
                console.error('[ChatProvider] Error sending message via REST:', error);
                throw error;
            }
        },
        [activeConversation, userId, getSenderInfo]
    );

    const markAsRead = useCallback(
        async (messageId: string) => {
            try {
                if (chatHub.isConnected) {
                    await chatHub.markMessageAsRead(messageId);
                } else {
                    await ChatService.markMessageAsRead({ messageId });
                }
            } catch (error) {
                console.error('[ChatProvider] Error marking message as read:', error);
            }
        },
        [chatHub]
    );

    const markAllAsRead = useCallback(
        async (conversationId: string) => {
            try {
                if (chatHub.isConnected) {
                    await chatHub.markAllMessagesAsRead(conversationId);
                } else {
                    const response = await ChatService.markAllMessagesAsRead({
                        conversationId,
                        userId,
                    });

                    // Log if all messages were already read
                    if (response.success && response.data?.markedAllAsRead === false) {
                        console.log(
                            '[ChatProvider] All messages already read in conversation:',
                            conversationId
                        );
                    }
                }

                // Update local state (always reset unread count)
                setConversations((prev) =>
                    prev.map((conv) =>
                        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
                    )
                );
            } catch (error) {
                console.error('[ChatProvider] Error marking all as read:', error);
                // Don't show toast error for "already read" case as it's handled in service
            }
        },
        [userId, chatHub]
    );

    // Typing indicators
    const startTyping = useCallback(() => {
        if (activeConversation && chatHub.isConnected) {
            chatHub.startTyping(activeConversation.id);
        }
    }, [activeConversation, chatHub]);

    const stopTyping = useCallback(() => {
        if (activeConversation && chatHub.isConnected) {
            chatHub.stopTyping(activeConversation.id);
        }
    }, [activeConversation, chatHub]);

    const value: ChatContextValue = {
        conversations,
        activeConversation,
        messages,
        onlineUsers,
        typingUsers,
        isLoading,
        isLoadingMessages,
        loadConversations,
        selectConversation,
        createOrGetConversation,
        sendMessage,
        sendMessageViaREST,
        loadMessages,
        markAsRead,
        markAllAsRead,
        startTyping,
        stopTyping,
        isConnected: chatHub.isConnected,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Custom hook to use chat context
export const useChat = (): ChatContextValue => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within ChatProvider');
    }
    return context;
};
