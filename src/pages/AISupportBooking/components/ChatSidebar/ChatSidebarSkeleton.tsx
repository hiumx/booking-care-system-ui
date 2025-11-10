import React from 'react';
import { Skeleton } from '@mui/material';
import { MessageSquare } from 'lucide-react';
import styles from './ChatSidebar.module.scss';

const ChatSidebarSkeleton: React.FC = () => {
    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <div className={styles.title}>
                    <MessageSquare size={20} className={styles.titleIcon} />
                    <span>Lịch sử chat</span>
                </div>
            </div>

            {/* New Chat Button Skeleton */}
            <div className={styles.newChatButton} style={{ pointerEvents: 'none' }}>
                <Skeleton
                    animation={false}
                    variant="rectangular"
                    width="100%"
                    height={40}
                    sx={{
                        borderRadius: '8px',
                        bgcolor: '#e0e0e0',
                        border: 'none',
                        outline: 'none',
                        boxShadow: 'none',
                        '&::before': { display: 'none' },
                        '&::after': { display: 'none' },
                    }}
                />
            </div>

            {/* Chat List Skeleton */}
            <div className={styles.chatList}>
                {[1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className={styles.chatItem}>
                        <div className={styles.chatAvatar}>
                            <Skeleton
                                animation={false}
                                variant="circular"
                                width={40}
                                height={40}
                                sx={{
                                    bgcolor: '#e0e0e0',
                                    border: 'none',
                                    outline: 'none',
                                    boxShadow: 'none',
                                    '&::before': { display: 'none' },
                                    '&::after': { display: 'none' },
                                }}
                            />
                        </div>
                        <div className={styles.chatContent}>
                            <Skeleton
                                animation={false}
                                variant="text"
                                width="80%"
                                height={20}
                                sx={{ marginBottom: '4px', bgcolor: '#e0e0e0' }}
                            />
                            <Skeleton
                                animation={false}
                                variant="text"
                                width="60%"
                                height={16}
                                sx={{ marginBottom: '4px', bgcolor: '#e0e0e0' }}
                            />
                            <Skeleton
                                animation={false}
                                variant="text"
                                width="40%"
                                height={14}
                                sx={{ bgcolor: '#e0e0e0' }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* User Info Skeleton */}
            <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                    <Skeleton
                        animation={false}
                        variant="circular"
                        width={40}
                        height={40}
                        sx={{
                            bgcolor: '#e0e0e0',
                            border: 'none',
                            outline: 'none',
                            boxShadow: 'none',
                            '&::before': { display: 'none' },
                            '&::after': { display: 'none' },
                        }}
                    />
                </div>
                <div className={styles.userDetails}>
                    <Skeleton
                        animation={false}
                        variant="text"
                        width={100}
                        height={20}
                        sx={{ bgcolor: '#e0e0e0' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatSidebarSkeleton;
