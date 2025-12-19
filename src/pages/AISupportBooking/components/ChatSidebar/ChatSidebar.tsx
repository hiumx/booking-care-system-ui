import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { RootState } from '@/store';
import { PATHS } from '@/routes/paths';
import { ChatHistory } from '@/types/ai.types';
import styles from './ChatSidebar.module.scss';

interface ChatSidebarProps {
    chatHistories: ChatHistory[];
    activeChatId: string | null;
    onNewChat: () => void;
    onSelectChat: (chatId: string) => void;
    onDeleteChat?: (chatId: string) => void;
    isOpen?: boolean;
    onToggle?: () => void;
}

// Shared utility function to get user initials
const getUserInitials = (isAuthenticated: boolean, fullName?: string): string => {
    if (!isAuthenticated || !fullName) {
        return 'U';
    }
    const names = fullName.trim().split(' ');
    if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
};

// Component để hiển thị avatar người dùng (dùng cho chat items)
const UserAvatar: React.FC = () => {
    const { profile } = useSelector((state: RootState) => state.user);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [avatarError, setAvatarError] = useState(false);

    // Reset avatar error when profile changes
    useEffect(() => {
        setAvatarError(false);
    }, [profile?.avatarUrl]);

    return (
        <>
            {isAuthenticated && profile?.avatarUrl && !avatarError ? (
                <>
                    <img
                        key={profile.avatarUrl}
                        src={profile.avatarUrl}
                        alt={profile.fullName || 'User'}
                        onError={() => {
                            setAvatarError(true);
                        }}
                    />
                    <div className={styles.chatAvatarFallback} style={{ display: 'none' }}>
                        {getUserInitials(isAuthenticated, profile?.fullName)}
                    </div>
                </>
            ) : (
                <div className={styles.chatAvatarFallback}>
                    {getUserInitials(isAuthenticated, profile?.fullName)}
                </div>
            )}
        </>
    );
};

const ChatSidebar: React.FC<ChatSidebarProps> = ({
    chatHistories,
    activeChatId,
    onNewChat,
    onSelectChat,
    onDeleteChat,
    isOpen = true,
    onToggle,
}) => {
    const { t } = useTranslation('aiSupport');
    const navigate = useNavigate();
    const { profile } = useSelector((state: RootState) => state.user);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [avatarError, setAvatarError] = useState(false);

    // Reset avatar error when profile changes
    useEffect(() => {
        setAvatarError(false);
    }, [profile?.avatarUrl]);

    const formatTime = (timeString: string) => {
        return timeString;
    };

    // Lấy tên hiển thị
    const getDisplayName = () => {
        if (profile?.fullName) {
            return profile.fullName;
        }
        return t('sidebar.guest');
    };

    return (
        <div className={clsx(styles.sidebar, { [styles.closed]: !isOpen })}>
            <div className={styles.sidebarHeader}>
                <div className={styles.title}>
                    <MessageSquare size={20} className={styles.titleIcon} />
                    {isOpen && <span>{t('sidebar.chatHistory')}</span>}
                </div>
                {onToggle && (
                    <button
                        className={styles.toggleButton}
                        onClick={onToggle}
                        data-tooltip={isOpen ? t('sidebar.close') : t('sidebar.open')}
                    >
                        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                )}
            </div>

            {isOpen && (
                <>
                    <button className={styles.newChatButton} onClick={onNewChat}>
                        <Plus size={18} />
                        <span>{t('chat.newConversation')}</span>
                    </button>

                    <div className={styles.chatList}>
                        {chatHistories.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>{t('sidebar.noConversations')}</p>
                                <p className={styles.emptyHint}>{t('sidebar.startHint')}</p>
                            </div>
                        ) : (
                            chatHistories.map((chat) => (
                                <div
                                    key={chat.id}
                                    className={clsx(styles.chatItem, {
                                        [styles.active]: activeChatId === chat.id,
                                    })}
                                    onClick={() => onSelectChat(chat.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            onSelectChat(chat.id);
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={t('sidebar.selectConversation', {
                                        title:
                                            chat.title ||
                                            chat.lastMessage ||
                                            t('sidebar.conversation'),
                                    })}
                                >
                                    <div className={styles.chatAvatar}>
                                        <UserAvatar />
                                    </div>
                                    <div className={styles.chatContent}>
                                        <div className={styles.chatTitle}>
                                            {chat.title ||
                                                chat.lastMessage ||
                                                t('sidebar.conversation')}
                                        </div>
                                        {chat.lastMessage && (
                                            <div className={styles.chatPreview}>
                                                {chat.lastMessage.length > 50
                                                    ? `${chat.lastMessage.substring(0, 50)}...`
                                                    : chat.lastMessage}
                                            </div>
                                        )}
                                        <div className={styles.chatTime}>
                                            {formatTime(chat.lastMessageTime)}
                                        </div>
                                    </div>
                                    {onDeleteChat && (
                                        <button
                                            className={styles.deleteButton}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteChat(chat.id);
                                            }}
                                            data-tooltip={t('sidebar.delete')}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            {/* User Info Section */}
            {isOpen && (
                <div className={styles.userInfo}>
                    <div
                        className={styles.userAvatar}
                        onClick={() =>
                            navigate(`${PATHS.USER.ROOT}/${PATHS.USER.PROFILE}?tab=settings`)
                        }
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                navigate(`${PATHS.USER.ROOT}/${PATHS.USER.PROFILE}?tab=settings`);
                            }
                        }}
                        aria-label="User profile"
                    >
                        {isAuthenticated && profile?.avatarUrl && !avatarError ? (
                            <>
                                <img
                                    key={profile.avatarUrl}
                                    src={profile.avatarUrl}
                                    alt={getDisplayName()}
                                    onError={() => {
                                        setAvatarError(true);
                                    }}
                                />
                                <div className={styles.avatarFallback} style={{ display: 'none' }}>
                                    {getUserInitials(isAuthenticated, profile?.fullName)}
                                </div>
                            </>
                        ) : (
                            // Hiển thị avatar mặc định với chữ cái (đã login nhưng không có ảnh, hoặc chưa login, hoặc ảnh lỗi)
                            <div className={styles.avatarFallback}>
                                {getUserInitials(isAuthenticated, profile?.fullName)}
                            </div>
                        )}
                    </div>
                    <div
                        className={styles.userDetails}
                        onClick={() =>
                            navigate(`${PATHS.USER.ROOT}/${PATHS.USER.PROFILE}?tab=settings`)
                        }
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                navigate(`${PATHS.USER.ROOT}/${PATHS.USER.PROFILE}?tab=settings`);
                            }
                        }}
                        aria-label="User details"
                    >
                        <div className={styles.userName}>{getDisplayName()}</div>
                    </div>
                    {!isAuthenticated && (
                        <button
                            className={styles.upgradeButton}
                            onClick={() => navigate(PATHS.LOGIN)}
                        >
                            {t('sidebar.login')}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatSidebar;
