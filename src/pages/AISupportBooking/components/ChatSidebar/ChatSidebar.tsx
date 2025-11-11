import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MessageSquare, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { AppDispatch, RootState } from '@/store';
import { fetchUserProfile } from '@/store/slices/userSlice';
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

// Component để hiển thị avatar người dùng (dùng cho chat items)
const UserAvatar: React.FC = () => {
    const { profile } = useSelector((state: RootState) => state.user);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [avatarError, setAvatarError] = useState(false);

    // Reset avatar error when profile changes
    useEffect(() => {
        setAvatarError(false);
    }, [profile?.avatarUrl]);

    // Lấy chữ cái đầu để hiển thị trong avatar mặc định
    const getInitials = () => {
        if (!isAuthenticated || !profile?.fullName) {
            return 'U';
        }
        const names = profile.fullName.trim().split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[names.length - 1][0]).toUpperCase();
        }
        return names[0][0].toUpperCase();
    };

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
                        {getInitials()}
                    </div>
                </>
            ) : (
                <div className={styles.chatAvatarFallback}>{getInitials()}</div>
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
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { profile } = useSelector((state: RootState) => state.user);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [avatarError, setAvatarError] = useState(false);

    // Fetch user profile when authenticated and profile is null
    useEffect(() => {
        if (isAuthenticated && profile === null) {
            dispatch(fetchUserProfile()).catch((error) => {
                console.error('Failed to fetch user profile:', error);
            });
        }
    }, [isAuthenticated, profile, dispatch]);

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
        return 'Khách';
    };

    // Sử dụng lại hàm getInitials từ ChatAvatar component
    const getInitials = () => {
        if (!isAuthenticated || !profile?.fullName) {
            return 'U';
        }
        const names = profile.fullName.trim().split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[names.length - 1][0]).toUpperCase();
        }
        return names[0][0].toUpperCase();
    };

    return (
        <div className={clsx(styles.sidebar, { [styles.closed]: !isOpen })}>
            <div className={styles.sidebarHeader}>
                <div className={styles.title}>
                    <MessageSquare size={20} className={styles.titleIcon} />
                    {isOpen && <span>Lịch sử chat</span>}
                </div>
                {onToggle && (
                    <button
                        className={styles.toggleButton}
                        onClick={onToggle}
                        data-tooltip={isOpen ? 'Đóng' : 'Mở'}
                    >
                        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                )}
            </div>

            {isOpen && (
                <>
                    <button className={styles.newChatButton} onClick={onNewChat}>
                        <Plus size={18} />
                        <span>Cuộc trò chuyện mới</span>
                    </button>

                    <div className={styles.chatList}>
                        {chatHistories.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>Chưa có cuộc trò chuyện nào</p>
                                <p className={styles.emptyHint}>
                                    Nhấn nút "Cuộc trò chuyện mới" để bắt đầu
                                </p>
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
                                    aria-label={`Chọn cuộc trò chuyện: ${chat.title || chat.lastMessage || 'Cuộc trò chuyện'}`}
                                >
                                    <div className={styles.chatAvatar}>
                                        <UserAvatar />
                                    </div>
                                    <div className={styles.chatContent}>
                                        <div className={styles.chatTitle}>
                                            {chat.title || chat.lastMessage || 'Cuộc trò chuyện'}
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
                                            data-tooltip="Xóa"
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
                                    {getInitials()}
                                </div>
                            </>
                        ) : (
                            // Hiển thị avatar mặc định với chữ cái (đã login nhưng không có ảnh, hoặc chưa login, hoặc ảnh lỗi)
                            <div className={styles.avatarFallback}>{getInitials()}</div>
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
                            Login
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatSidebar;
