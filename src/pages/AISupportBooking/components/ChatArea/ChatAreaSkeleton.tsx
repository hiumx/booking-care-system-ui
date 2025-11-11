import React from 'react';
import { Skeleton, Stack } from '@mui/material';
import styles from './ChatArea.module.scss';

const ChatAreaSkeleton: React.FC = () => {
    return (
        <div className={styles.chatArea}>
            {/* Header Skeleton */}
            <div className={styles.chatHeader}>
                <div className={styles.headerLeft}>
                    <Skeleton
                        animation={false}
                        variant="circular"
                        width={40}
                        height={40}
                        sx={{ bgcolor: '#e0e0e0', border: 'none' }}
                    />
                    <Stack spacing={0.5}>
                        <Skeleton
                            animation={false}
                            variant="text"
                            width={150}
                            height={24}
                            sx={{ bgcolor: '#e0e0e0' }}
                        />
                        <Skeleton
                            animation={false}
                            variant="text"
                            width={100}
                            height={16}
                            sx={{ bgcolor: '#e0e0e0' }}
                        />
                    </Stack>
                </div>
            </div>

            {/* Messages Area Skeleton */}
            <div className={styles.messagesContainer}>
                <div className={styles.welcomeSection}>
                    <div className={styles.welcomeIcon}>
                        <Skeleton
                            animation={false}
                            variant="circular"
                            width={48}
                            height={48}
                            sx={{ bgcolor: '#e0e0e0', border: 'none', margin: '0 auto' }}
                        />
                    </div>
                    <Skeleton
                        animation={false}
                        variant="text"
                        width={300}
                        height={32}
                        sx={{ margin: '0 auto', bgcolor: '#e0e0e0' }}
                    />
                    <Skeleton
                        animation={false}
                        variant="text"
                        width={400}
                        height={20}
                        sx={{ margin: '8px auto', bgcolor: '#e0e0e0' }}
                    />
                </div>

                {/* Sample Message Skeletons */}
                <div className={styles.messagesList}>
                    {/* User Message Skeleton */}
                    <div className={styles.messageGroup} style={{ justifyContent: 'flex-end' }}>
                        <Stack spacing={1} alignItems="flex-end" sx={{ maxWidth: '70%' }}>
                            <Skeleton
                                animation={false}
                                variant="rectangular"
                                width={250}
                                height={60}
                                sx={{ borderRadius: '12px', bgcolor: '#e0e0e0', border: 'none' }}
                            />
                            <Skeleton
                                animation={false}
                                variant="text"
                                width={80}
                                height={14}
                                sx={{ bgcolor: '#e0e0e0' }}
                            />
                        </Stack>
                    </div>

                    {/* AI Message Skeleton */}
                    <div className={styles.messageGroup} style={{ justifyContent: 'flex-start' }}>
                        <Skeleton
                            animation={false}
                            variant="circular"
                            width={32}
                            height={32}
                            sx={{ marginRight: '12px', bgcolor: '#e0e0e0', border: 'none' }}
                        />
                        <Stack spacing={1} alignItems="flex-start" sx={{ maxWidth: '70%' }}>
                            <Skeleton
                                animation={false}
                                variant="rectangular"
                                width={300}
                                height={80}
                                sx={{ borderRadius: '12px', bgcolor: '#e0e0e0', border: 'none' }}
                            />
                            <Skeleton
                                animation={false}
                                variant="text"
                                width={80}
                                height={14}
                                sx={{ bgcolor: '#e0e0e0' }}
                            />
                        </Stack>
                    </div>

                    {/* Suggestion Cards Skeleton */}
                    <Stack direction="row" spacing={2} sx={{ marginTop: '16px' }}>
                        <Skeleton
                            animation={false}
                            variant="rectangular"
                            width={280}
                            height={180}
                            sx={{ borderRadius: '12px', bgcolor: '#e0e0e0', border: 'none' }}
                        />
                        <Skeleton
                            animation={false}
                            variant="rectangular"
                            width={280}
                            height={180}
                            sx={{ borderRadius: '12px', bgcolor: '#e0e0e0', border: 'none' }}
                        />
                    </Stack>
                </div>
            </div>

            {/* Input Area Skeleton */}
            <div className={styles.inputArea}>
                <div
                    style={{
                        border: '1px solid #e5e7eb',
                        margin: '10px',
                        borderRadius: '12px',
                        background: '#ffffff',
                        padding: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                    }}
                >
                    {/* Textarea skeleton */}
                    <div style={{ padding: '0 0 4px 0' }}>
                        <Skeleton
                            animation={false}
                            variant="text"
                            width="60%"
                            height={24}
                            sx={{ bgcolor: '#f0f0f0' }}
                        />
                    </div>

                    {/* Icon row skeleton */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 12px',
                            marginTop: '4px',
                        }}
                    >
                        {/* Left icons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {/* Attachment button */}
                            <Skeleton
                                animation={false}
                                variant="circular"
                                width={40}
                                height={40}
                                sx={{ bgcolor: '#f0f0f0' }}
                            />

                            {/* Location wrapper */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {/* Location button */}
                                <Skeleton
                                    animation={false}
                                    variant="circular"
                                    width={40}
                                    height={40}
                                    sx={{ bgcolor: '#f0f0f0' }}
                                />

                                {/* Location badge */}
                                <Skeleton
                                    animation={false}
                                    variant="rectangular"
                                    width={120}
                                    height={28}
                                    sx={{ borderRadius: '12px', bgcolor: '#e3f2fd' }}
                                />
                            </div>

                            {/* Mic button */}
                            <Skeleton
                                animation={false}
                                variant="circular"
                                width={40}
                                height={40}
                                sx={{ bgcolor: '#f0f0f0' }}
                            />

                            {/* Clear button */}
                            <Skeleton
                                animation={false}
                                variant="circular"
                                width={40}
                                height={40}
                                sx={{ bgcolor: '#f0f0f0' }}
                            />
                        </div>

                        {/* Send button skeleton */}
                        <Skeleton
                            animation={false}
                            variant="rectangular"
                            width={70}
                            height={40}
                            sx={{ borderRadius: '20px', bgcolor: '#f0f0f0' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatAreaSkeleton;
