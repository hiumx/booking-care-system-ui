import { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { useChat } from '@/providers/ChatProvider';
import { RootState } from '@/store';
import { ConversationResponse, MessageType } from '@/types/communication.types';
import { Tag } from '@/types/tag.types';
import TagService from '@/services/tag.service';
import styles from './ChatList.module.scss';

interface ChatListProps {
    searchTerm: string;
    selectedTagIds?: string[];
}

const ChatList: React.FC<ChatListProps> = ({ searchTerm, selectedTagIds = [] }) => {
    const { conversations, selectConversation, activeConversation, isLoading, onlineUsers } =
        useChat();
    const userProfile = useSelector((state: RootState) => state.user.profile);
    const currentUserId = (userProfile?.accountId || userProfile?.id || '').toUpperCase();

    const [conversationTags, setConversationTags] = useState<Map<string, Tag[]>>(new Map());

    // Load tags for all conversations
    const loadConversationTags = async () => {
        if (!currentUserId) return;

        const tagsMap = new Map<string, Tag[]>();

        for (const conv of conversations || []) {
            try {
                const response = await TagService.getConversationTags(currentUserId, conv.id);
                if (response.success && response.data) {
                    tagsMap.set(conv.id, response.data);
                }
            } catch (error) {
                console.error(`Failed to load tags for conversation ${conv.id}:`, error);
            }
        }

        setConversationTags(tagsMap);
    };

    useEffect(() => {
        if (conversations && conversations.length > 0) {
            loadConversationTags();
        }
    }, [conversations?.length, currentUserId]);

    // Listen for tag updates
    useEffect(() => {
        const handleTagsUpdated = () => {
            loadConversationTags();
        };

        globalThis.addEventListener('conversationTagsUpdated', handleTagsUpdated);
        return () => {
            globalThis.removeEventListener('conversationTagsUpdated', handleTagsUpdated);
        };
    }, [conversations, currentUserId]);

    // Filter and sort conversations
    const filteredConversations = useMemo(() => {
        const convs = conversations || [];

        // Filter by search term
        let filtered = searchTerm
            ? convs.filter((conv) => {
                  const participantName = conv.participantDetails
                      ?.filter((p) => (p.id || p.accountId || '').toUpperCase() !== currentUserId)
                      .map((p) => p.fullName)
                      .join(', ');
                  const lastMessageContent = conv.lastMessage?.content || '';

                  return (
                      participantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      lastMessageContent.toLowerCase().includes(searchTerm.toLowerCase())
                  );
              })
            : convs;

        // Filter by selected tags
        if (selectedTagIds.length > 0) {
            filtered = filtered.filter((conv) => {
                const convTags = conversationTags.get(conv.id) || [];
                return convTags.some((tag) => selectedTagIds.includes(tag.id));
            });
        }

        // Sort by most recent message (newest first)
        return filtered.sort((a, b) => {
            const timeA = a.lastMessage?.createdAt || a.updatedAt || a.createdAt;
            const timeB = b.lastMessage?.createdAt || b.updatedAt || b.createdAt;

            return new Date(timeB).getTime() - new Date(timeA).getTime();
        });
    }, [conversations, searchTerm, currentUserId, selectedTagIds, conversationTags]);

    const recentContacts = filteredConversations || []; // Ensure always array

    // Get other participant info
    const getOtherParticipant = (conv: ConversationResponse) => {
        return conv.participantDetails?.find(
            (p) => (p.id || p.accountId || '').toUpperCase() !== currentUserId
        );
    };

    // Check if user is online - normalize to UPPERCASE to match backend normalization
    const isUserOnline = (userId: string) => {
        return onlineUsers.has(userId.toUpperCase());
    };

    // Format timestamp
    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Vừa xong';
        if (minutes < 60) return `${minutes} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        if (days < 7) return `${days} ngày trước`;
        return date.toLocaleDateString('vi-VN');
    };

    // Helper: Get attachment preview message
    const getAttachmentPreview = (type: MessageType, fileName?: string) => {
        const attachmentMessages: Record<MessageType, { withFile: string; withoutFile: string }> = {
            [MessageType.IMAGE]: { withFile: `📷 ${fileName}`, withoutFile: '📷 Đã gửi ảnh' },
            [MessageType.VIDEO]: { withFile: `🎥 ${fileName}`, withoutFile: '🎥 Đã gửi video' },
            [MessageType.AUDIO]: { withFile: `🎵 ${fileName}`, withoutFile: '🎵 Đã gửi audio' },
            [MessageType.FILE]: { withFile: `📎 ${fileName}`, withoutFile: '📎 Đã gửi file' },
            [MessageType.VOICE_NOTE]: {
                withFile: '🎤 Tin nhắn thoại',
                withoutFile: '🎤 Tin nhắn thoại',
            },
            [MessageType.TEXT]: { withFile: `📎 ${fileName}`, withoutFile: '📎 Đã gửi file' },
            [MessageType.SYSTEM]: {
                withFile: '⚙️ Tin nhắn hệ thống',
                withoutFile: '⚙️ Tin nhắn hệ thống',
            },
        };

        const message = attachmentMessages[type] || attachmentMessages[MessageType.FILE];
        return fileName ? message.withFile : message.withoutFile;
    };

    // Format last message preview
    const formatLastMessagePreview = (conv: ConversationResponse) => {
        if (!conv.lastMessage) return 'Không có tin nhắn';

        const { content, type, attachments } = conv.lastMessage;

        // If has content, show it
        if (content?.trim()) {
            return content;
        }

        // If no content but has attachments, show appropriate message
        if (attachments?.length) {
            const attachment = attachments[0];
            const fileName = attachment?.fileName || attachment?.name;
            return getAttachmentPreview(type || MessageType.FILE, fileName);
        }

        // Fallback
        return 'Không có tin nhắn';
    };

    const handleSelectConversation = (conversationId: string) => {
        selectConversation(conversationId);
    };

    const renderContactList = (convs: ConversationResponse[], title: string) => (
        <>
            <div className="d-flex justify-content-between align-items-center ps-0 pe-0">
                <div className="fav-title pin-chat">
                    <h6>{title}</h6>
                </div>
            </div>
            <ul className={clsx(styles.item, 'user-list')}>
                {convs.map((conv) => {
                    const otherUser = getOtherParticipant(conv);
                    const isOnline = otherUser
                        ? isUserOnline(otherUser.id || otherUser.accountId || '')
                        : false;
                    const isActive = activeConversation?.id === conv.id;
                    const convTags = conversationTags.get(conv.id) || [];

                    return (
                        <li key={conv.id}>
                            <button
                                className={clsx('user-list-item', { active: isActive })}
                                onClick={() => handleSelectConversation(conv.id)}
                                type="button"
                            >
                                <div className={clsx(styles.conversation, 'd-flex w-100')}>
                                    <div className={`avatar ${isOnline ? 'avatar-online' : ''}`}>
                                        <img
                                            src={otherUser?.avatarUrl || '/default-avatar.png'}
                                            alt={otherUser?.fullName || 'User'}
                                        />
                                    </div>
                                    <div className="users-list-body">
                                        <div>
                                            <div className="d-flex align-items-center">
                                                <h5 className="me-2 mb-0">
                                                    {otherUser?.fullName || 'Unknown User'}
                                                </h5>
                                                {/* Zalo-style Tag Dots */}
                                                {convTags.length > 0 && (
                                                    <div
                                                        className={clsx(
                                                            styles.tagDots,
                                                            'd-flex align-items-center'
                                                        )}
                                                    >
                                                        {convTags.slice(0, 3).map((tag, index) => (
                                                            <span
                                                                key={tag.id}
                                                                className={clsx(styles.tagDot)}
                                                                style={{
                                                                    backgroundColor: tag.color,
                                                                    animationDelay: `${index * 100}ms`,
                                                                }}
                                                                title={`${tag.name} (${String(tag.type).toLowerCase()})`}
                                                            />
                                                        ))}
                                                        {convTags.length > 3 && (
                                                            <span
                                                                className={clsx(
                                                                    styles.tagMoreIndicator,
                                                                    'text-muted small'
                                                                )}
                                                                title={`+${convTags.length - 3} more tags: ${convTags
                                                                    .slice(3)
                                                                    .map(
                                                                        (t) =>
                                                                            `${t.name} (${String(t.type).toLowerCase()})`
                                                                    )
                                                                    .join(', ')}`}
                                                            >
                                                                +{convTags.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <p>{formatLastMessagePreview(conv)}</p>
                                        </div>
                                        <div className="last-chat-time">
                                            <small className="text-muted">
                                                {conv.lastMessage
                                                    ? formatTime(conv.lastMessage.createdAt)
                                                    : ''}
                                            </small>
                                            <div className="chat-pin">
                                                {conv.unreadCount && conv.unreadCount > 0 ? (
                                                    <div className="new-message-count">
                                                        {conv.unreadCount}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </>
    );

    if (isLoading) {
        return (
            <div className="text-center p-4">
                <output className="spinner-border">
                    <span className="visually-hidden">Đang tải...</span>
                </output>
            </div>
        );
    }

    if (recentContacts.length === 0) {
        return (
            <div className="text-center p-4">
                <p className="text-muted">Không có hội thoại nào</p>
            </div>
        );
    }

    return (
        <>{recentContacts.length > 0 && renderContactList(recentContacts, 'Tin nhắn gần đây')}</>
    );
};

export default ChatList;
