import React, { createContext, useContext, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RootState, AppDispatch } from '@/store';
import { useSharedChatHub } from '@/hooks/useSharedChatHub';
import { ChatHubCallbacks } from '@/hooks/useChatHub';
import { SignalRMessageReceived } from '@/types/communication.types';
import { incrementUnreadMessageCount, fetchUnreadMessageCount } from '@/store/slices/userSlice';

interface GlobalChatContextValue {
    isConnected: boolean;
    connection: any;
    onlineUsers: Set<string>;
    isUserOnline: (userId: string) => boolean;
}

const GlobalChatContext = createContext<GlobalChatContextValue | undefined>(undefined);

interface GlobalChatProviderProps {
    children: React.ReactNode;
}

/**
 * Global ChatProvider - Handles global chat notifications
 * - Uses shared ChatHub connection from ChatHubContext
 * - Receives message notifications globally (not just in Chat page)
 * - Shows toast notifications when NOT on Chat page
 */
export const GlobalChatProvider: React.FC<GlobalChatProviderProps> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>();
    const userProfile = useSelector((state: RootState) => state.user.profile);
    const userId = userProfile?.accountId || '';
    const location = useLocation();

    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

    // Global notification callbacks
    const hubCallbacks: ChatHubCallbacks = {
        onMessageReceived: useCallback(
            (message: SignalRMessageReceived) => {
                console.log('[GlobalChat] 🔔 New message notification:', message);

                // Only show notification if:
                // 1. Message is not from current user
                // 2. User is NOT on the Chat page (to avoid duplicate notifications)
                const isOnChatPage = location.pathname.toLowerCase().includes('/chat');

                if (message.senderId.toUpperCase() !== userId.toUpperCase()) {
                    // Increment unread count in Redux
                    dispatch(incrementUnreadMessageCount());

                    // Show toast notification if not on chat page
                    if (!isOnChatPage) {
                        toast.info('💬 Bạn có tin nhắn mới!', {
                            onClick: () => {
                                // Navigate to chat page
                                window.location.href = '/chat';
                            },
                        });
                    }
                }
            },
            [userId, location.pathname, dispatch]
        ),

        onAllMessagesRead: useCallback(() => {
            // Refresh unread count from server when messages are marked as read
            if (userId) {
                dispatch(fetchUnreadMessageCount(userId));
            }
        }, [userId, dispatch]),

        onOnlineUsers: useCallback((userIds: string[]) => {
            console.log('[GlobalChat] 👥 Received online users list:', userIds);
            // Normalize to UPPERCASE for case-insensitive matching
            const normalizedIds = userIds.map((id) => id.toUpperCase());
            setOnlineUsers(new Set(normalizedIds));
        }, []),

        onUserOnline: useCallback((userId: string) => {
            console.log('[GlobalChat] 🟢 User online:', userId);
            // Normalize to UPPERCASE for case-insensitive matching
            const normalizedId = userId.toUpperCase();
            setOnlineUsers((prev) => {
                const newSet = new Set(prev);
                newSet.add(normalizedId);
                return newSet;
            });
        }, []),

        onUserOffline: useCallback((userId: string) => {
            console.log('[GlobalChat] 🔴 User offline:', userId);
            // Normalize to UPPERCASE for case-insensitive matching
            const normalizedId = userId.toUpperCase();
            setOnlineUsers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(normalizedId);
                return newSet;
            });
        }, []),

        onError: useCallback((error: string) => {
            console.error('[GlobalChat] ❌ SignalR error:', error);
            // Don't show error toast for connection issues - too noisy
        }, []),
    };

    // Use shared ChatHub connection
    const chatHub = useSharedChatHub(hubCallbacks);

    // Helper function to check if user is online (case-insensitive)
    const isUserOnline = useCallback(
        (userId: string) => {
            if (!userId) return false;
            const normalizedId = userId.toUpperCase();
            return onlineUsers.has(normalizedId);
        },
        [onlineUsers]
    );

    const value: GlobalChatContextValue = {
        isConnected: chatHub.isConnected,
        connection: chatHub.connection,
        onlineUsers,
        isUserOnline,
    };

    return <GlobalChatContext.Provider value={value}>{children}</GlobalChatContext.Provider>;
};

/**
 * Hook to access global chat context
 */
export const useGlobalChat = (): GlobalChatContextValue => {
    const context = useContext(GlobalChatContext);
    if (!context) {
        throw new Error('useGlobalChat must be used within GlobalChatProvider');
    }
    return context;
};
