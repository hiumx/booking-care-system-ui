import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useChat } from '@/providers/ChatProvider';
import { RootState } from '@/store';
import { MessageResponse } from '@/types/communication.types';
import MessageItem from './MessageItem';

const MessageList = () => {
    const { messages, activeConversation, isLoadingMessages, typingUsers } = useChat();
    const userProfile = useSelector((state: RootState) => state.user.profile);
    // Backend uses uppercase accountId, normalize for comparison
    const currentUserId = (userProfile?.accountId || userProfile?.id || '').toUpperCase();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const prevMessagesLengthRef = useRef<number>(0);

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
            } else if (currentLength > prevLength) {
                // New message arrived - smooth scroll
                scrollToBottom('smooth');
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

    // Transform MessageResponse to match MessageItem props
    const transformedMessages = (messages || []).map((msg: MessageResponse) => ({
        id: msg.id,
        senderId: msg.senderId,
        senderName: msg.senderInfo?.fullName || 'Unknown',
        senderAvatar: msg.senderInfo?.avatarUrl || '/default-avatar.png',
        content: msg.content,
        timestamp: new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        }),
        // Convert type to string (backend sends enum number or string)
        messageType: (typeof msg.type === 'string'
            ? msg.type
            : String(msg.type || 'Text')
        ).toLowerCase() as any,
        // Case-insensitive comparison for isOwn (senderId might be lowercase, currentUserId uppercase)
        isOwn: msg.senderId?.toLowerCase() === currentUserId?.toLowerCase(),
        isRead: msg.status === 'READ',
        // Backend returns "url" but frontend expects "fileUrl"
        // Filter out undefined values
        attachments:
            msg.attachments
                ?.map((att: any) => att.url || att.fileUrl)
                .filter((url: string | undefined) => !!url) || [],
    }));

    return (
        <div className="messages">
            {transformedMessages.map((message) => (
                <MessageItem key={message.id} message={message} />
            ))}

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
