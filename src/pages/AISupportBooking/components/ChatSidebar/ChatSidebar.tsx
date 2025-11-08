import React, { useState } from 'react';
import clsx from 'clsx';
import { MessageSquare, Plus, User, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ChatHistory } from '../../types';
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

interface ChatAvatarProps {
    avatar: string;
    title: string;
}

const ChatAvatar: React.FC<ChatAvatarProps> = ({ avatar, title }) => {
    const [avatarError, setAvatarError] = useState(false);
    const hasAvatar = avatar && avatar.trim() !== '';

    if (hasAvatar && !avatarError) {
        return <img src={avatar} alt={title} onError={() => setAvatarError(true)} />;
    }

    return <User size={20} />;
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
    const formatTime = (timeString: string) => {
        return timeString;
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
                                >
                                    <div className={styles.chatAvatar}>
                                        <ChatAvatar avatar={chat.avatar} title={chat.title} />
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
        </div>
    );
};

export default ChatSidebar;
