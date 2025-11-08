import { useEffect, useRef, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { useChat } from '@/providers/ChatProvider';
import { RootState } from '@/store';
import MessageItem from './MessageItem';
import CallLogItem from './CallLogItem';

const MessageList = () => {
    const {
        messages,
        activeConversation,
        isLoadingMessages,
        typingUsers,
        loadMoreOldMessages,
        hasMoreOldMessages,
        isLoadingMoreMessages,
    } = useChat();
    const userProfile = useSelector((state: RootState) => state.user.profile);
    // Backend uses uppercase accountId, normalize for comparison
    const currentUserId = (userProfile?.accountId || userProfile?.id || '').toUpperCase();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const prevMessagesLengthRef = useRef<number>(0);
    const prevScrollHeightRef = useRef<number>(0);
    const isLoadingOldMessagesRef = useRef<boolean>(false);

    // Scroll to bottom helper function
    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    // Auto scroll to bottom when switching conversation (instant scroll)
    useEffect(() => {
        if (activeConversation) {
            // Use setTimeout to ensure DOM is updated
            setTimeout(() => scrollToBottom('auto'), 100);
        }
    }, [activeConversation?.id]);

    // Auto scroll when new messages arrive (smooth scroll)
    useEffect(() => {
        const currentLength = messages.length;
        const prevLength = prevMessagesLengthRef.current;

        if (currentLength > 0) {
            if (prevLength === 0) {
                // Initial load - scroll instantly to bottom
                setTimeout(() => scrollToBottom('auto'), 100);
            } else if (currentLength > prevLength && !isLoadingOldMessagesRef.current) {
                // New message arrived (NOT from loading old messages) - smooth scroll
                // Use ref instead of state to avoid race conditions
                console.log('[MessageList] 📥 New message detected, scrolling to bottom');
                scrollToBottom('smooth');
            } else if (isLoadingOldMessagesRef.current) {
                console.log('[MessageList] 🚫 Skipping auto-scroll (loading old messages)');
            }
        }

        // Update previous length
        prevMessagesLengthRef.current = currentLength;
    }, [messages]);

    // Auto scroll when typing indicator appears
    useEffect(() => {
        const typingUserId = activeConversation ? typingUsers.get(activeConversation.id) : null;
        if (typingUserId) {
            scrollToBottom('smooth');
        }
    }, [typingUsers, activeConversation]);

    // Helper to get scrollable container (chat-messages-scroll)
    const getScrollContainer = () => {
        // DOM structure: chat-messages-scroll > chat-body > messages
        // messagesContainerRef.current is "messages"
        // Need to go up 2 levels to get "chat-messages-scroll"
        const messagesDiv = messagesContainerRef.current;
        const chatBody = messagesDiv?.parentElement; // chat-body
        const scrollContainer = chatBody?.parentElement; // chat-messages-scroll

        if (!scrollContainer) {
            console.warn('[MessageList] Could not find scroll container');
            return null;
        }

        console.log('[MessageList] 🔍 Scroll container found:', {
            className: scrollContainer.className,
            scrollHeight: scrollContainer.scrollHeight,
            clientHeight: scrollContainer.clientHeight,
            scrollTop: scrollContainer.scrollTop,
        });

        return scrollContainer;
    };

    // Preserve scroll position when loading more old messages
    useEffect(() => {
        if (isLoadingMoreMessages) {
            // Mark that we're loading old messages (prevents auto-scroll)
            isLoadingOldMessagesRef.current = true;

            // Store current scroll height before new messages are added
            const container = getScrollContainer();
            if (container) {
                prevScrollHeightRef.current = container.scrollHeight;
                console.log('[MessageList] 📏 Stored scroll height:', container.scrollHeight);
            }
        } else if (prevScrollHeightRef.current > 0) {
            // After messages are loaded, restore scroll position
            // Use setTimeout to ensure DOM is fully updated with new messages
            setTimeout(() => {
                const container = getScrollContainer();
                if (container) {
                    const heightDiff = container.scrollHeight - prevScrollHeightRef.current;
                    if (heightDiff > 0) {
                        // Scroll down by the amount of new content added
                        container.scrollTop = heightDiff;
                        console.log('[MessageList] ✅ Restored scroll position:', {
                            oldHeight: prevScrollHeightRef.current,
                            newHeight: container.scrollHeight,
                            heightDiff,
                            newScrollTop: container.scrollTop,
                        });
                    } else {
                        console.warn('[MessageList] ⚠️ No height difference detected:', {
                            oldHeight: prevScrollHeightRef.current,
                            newHeight: container.scrollHeight,
                        });
                    }
                    prevScrollHeightRef.current = 0;
                }

                // Reset flag after restoring scroll position
                isLoadingOldMessagesRef.current = false;
                console.log('[MessageList] ✅ Reset loading flag, auto-scroll re-enabled');
            }, 150); // Wait slightly longer than auto-scroll effect (100ms)
        }
    }, [isLoadingMoreMessages]);

    // Infinite scroll: Load more old messages when scrolling to top
    useEffect(() => {
        const container = getScrollContainer();
        if (!container) {
            console.warn('[MessageList] ⚠️ No scroll container, infinite scroll disabled');
            return;
        }

        console.log('[MessageList] ✅ Infinite scroll enabled on:', container.className);

        const handleScroll = () => {
            const scrollTop = container.scrollTop;

            // Check if scrolled near the top (within 100px)
            if (scrollTop < 100 && hasMoreOldMessages && !isLoadingMoreMessages) {
                console.log('[MessageList] 🚀 TRIGGERING load more old messages!');
                loadMoreOldMessages();
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => {
            console.log('[MessageList] 🧹 Cleaning up scroll listener');
            container.removeEventListener('scroll', handleScroll);
        };
    }, [hasMoreOldMessages, isLoadingMoreMessages, loadMoreOldMessages]);

    // Get typing user info
    const typingUserId = activeConversation ? typingUsers.get(activeConversation.id) : null;
    const typingUser =
        typingUserId && activeConversation
            ? activeConversation.participantDetails?.find(
                  (p) => (p.id || p.accountId || '').toUpperCase() === typingUserId.toUpperCase()
              )
            : null;

    if (!activeConversation) {
        return (
            <div className="messages text-center p-4">
                <p className="text-muted">Chọn một hội thoại để bắt đầu nhắn tin</p>
            </div>
        );
    }

    if (isLoadingMessages) {
        return (
            <div className="messages text-center p-4">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Đang tải tin nhắn...</span>
                </div>
            </div>
        );
    }

    // Helper: Format timestamp smartly (like WhatsApp)
    const formatMessageTimestamp = (createdAt: string): string => {
        const messageDate = new Date(createdAt);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);

        const timeStr = messageDate.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        });

        // Today: just time
        if (messageDate >= today) {
            return timeStr;
        }

        // Yesterday
        if (messageDate >= yesterday) {
            return `Hôm qua ${timeStr}`;
        }

        // This week: day name
        if (messageDate >= lastWeek) {
            const dayName = messageDate.toLocaleDateString('vi-VN', { weekday: 'long' });
            return `${dayName} ${timeStr}`;
        }

        // Older: full date
        const dateStr = messageDate.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
        return `${dateStr} ${timeStr}`;
    };

    // Transform MessageResponse to match MessageItem props
    // Note: messages array contains mixed items (Message + CallLog)
    const transformedMessages: Array<any> = (messages || []).map((item: any) => {
        // Check itemType to determine if it's a message or call log
        const isCallLog = item.itemType === 'CallLog';

        if (isCallLog && item.callLog) {
            // Find caller info from participantDetails
            const callerId = item.callLog.callerId || '';
            const callerInfo = activeConversation?.participantDetails?.find(
                (p) => (p.id || p.accountId || '').toUpperCase() === callerId.toUpperCase()
            );

            // 🔍 Debug: Check ownership calculation
            const isOwnCall = callerId.toUpperCase() === currentUserId.toUpperCase();
            console.log('[MessageList] 🔍 Call log ownership check:', {
                callerId: callerId.toUpperCase(),
                currentUserId: currentUserId,
                isOwn: isOwnCall,
                callLogId: item.id,
            });

            // Return call log item with caller information
            return {
                id: item.id,
                itemType: 'CallLog' as const,
                callLog: item.callLog,
                createdAt: item.createdAt,
                // For call logs, determine ownership by comparing callerId with currentUserId
                isOwn: isOwnCall,
                // Add caller info for display
                callerName: callerInfo?.fullName || 'Unknown',
                callerAvatar: callerInfo?.avatarUrl || '/default-avatar.png',
            };
        }

        // Regular message transformation
        const msg = item.message || item; // Handle both wrapped and unwrapped messages
        const transformed = {
            id: msg.id || item.id,
            itemType: 'Message' as const,
            senderId: msg.senderId,
            senderName: msg.senderInfo?.fullName || 'Unknown',
            senderAvatar: msg.senderInfo?.avatarUrl || '/default-avatar.png',
            content: msg.content,
            timestamp: formatMessageTimestamp(msg.createdAt || item.createdAt), // ✅ Smart formatting
            createdAt: msg.createdAt || item.createdAt,
            // Convert type to string (backend sends enum number or string)
            messageType: (() => {
                if (typeof msg.type === 'string') {
                    return msg.type.toLowerCase();
                }

                // Map MessageType enum NUMBER to string
                const typeMap: { [key: number]: string } = {
                    0: 'text', // Text
                    1: 'image', // Image
                    2: 'file', // File
                    3: 'video', // Video
                    4: 'audio', // Audio
                    5: 'system', // System
                    6: 'voice', // VoiceNote
                    7: 'location', // Location
                };

                const typeNum =
                    typeof msg.type === 'number' ? msg.type : Number.parseInt(String(msg.type));
                return typeMap[typeNum] || 'text';
            })() as any,
            // Case-insensitive comparison for isOwn (senderId might be lowercase, currentUserId uppercase)
            isOwn: msg.senderId?.toLowerCase() === currentUserId?.toLowerCase(),
            isRead: msg.status === 'READ',
            // Pass full attachment info (url, name, size, mimeType) for proper file rendering
            attachments: msg.attachments || [],
        };

        return transformed;
    });

    // Helper: Get date label for separator
    const getDateLabel = (dateStr: string): string => {
        const messageDate = new Date(dateStr);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (messageDate >= today) {
            return 'Hôm nay';
        }
        if (messageDate >= yesterday) {
            return 'Hôm qua';
        }
        return messageDate.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    // Helper: Check if we need date separator
    const needsDateSeparator = (currentMsg: any, previousMsg: any): boolean => {
        if (!previousMsg) return true; // First message always needs separator

        const currentDate = new Date(currentMsg.createdAt).toDateString();
        const previousDate = new Date(previousMsg.createdAt).toDateString();

        return currentDate !== previousDate;
    };

    return (
        <div className="messages" ref={messagesContainerRef}>
            {/* Loading indicator for old messages */}
            {isLoadingMoreMessages && (
                <div className="text-center py-2">
                    <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Đang tải tin nhắn cũ...</span>
                    </div>
                    <p className="text-muted small mt-1">Đang tải tin nhắn cũ...</p>
                </div>
            )}

            {transformedMessages.map((item, index) => {
                // Find original item by ID (more reliable than index)
                const currentOriginalItem = messages.find((m) => m.id === item.id);
                const previousTransformedItem = index > 0 ? transformedMessages[index - 1] : null;
                const previousOriginalItem = previousTransformedItem
                    ? messages.find((m) => m.id === previousTransformedItem.id)
                    : null;

                const showDateSeparator = needsDateSeparator(
                    currentOriginalItem,
                    previousOriginalItem
                );

                return (
                    <Fragment key={item.id}>
                        {/* Date Separator (like WhatsApp) */}
                        {showDateSeparator && currentOriginalItem && (
                            <div className="text-center my-3">
                                <span className="badge bg-light text-dark px-3 py-2 rounded-pill shadow-sm">
                                    {getDateLabel(currentOriginalItem.createdAt)}
                                </span>
                            </div>
                        )}

                        {/* Render based on itemType */}
                        {item.itemType === 'CallLog' ? (
                            <CallLogItem
                                callLog={item.callLog}
                                isOwn={item.isOwn}
                                callerName={item.callerName}
                                callerAvatar={item.callerAvatar}
                            />
                        ) : (
                            <MessageItem message={item} />
                        )}
                    </Fragment>
                );
            })}

            {/* Typing indicator */}
            {typingUser && (
                <div className="chats">
                    <div className="chat-avatar">
                        <img
                            src={typingUser.avatarUrl || '/default-avatar.png'}
                            className="dreams_chat"
                            alt="avatar"
                        />
                    </div>
                    <div className="chat-content chat-cont-type">
                        <div className="chat-profile-name chat-type-wrapper">
                            <p>{typingUser.fullName} đang nhập...</p>
                        </div>
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;
