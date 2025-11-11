import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { Stethoscope, Edit2, Copy, Check } from 'lucide-react';
import { RootState } from '@/store';
import { Message } from '@/types/ai.types';
import styles from './MessageBubble.module.scss';

interface MessageBubbleProps {
    message: Message;
    onEdit?: (messageId: string, newContent: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onEdit }) => {
    const isUser = message.sender === 'user';
    const { profile } = useSelector((state: RootState) => state.user);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(message.content);
    const [copied, setCopied] = useState(false);
    const [avatarError, setAvatarError] = useState(false);

    useEffect(() => {
        setEditContent(message.content);
    }, [message.content]);

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

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        if (onEdit && editContent.trim() !== message.content) {
            onEdit(message.id, editContent.trim());
        }
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditContent(message.content);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSaveEdit();
        } else if (e.key === 'Escape') {
            handleCancelEdit();
        }
    };

    // Helper functions to reduce cognitive complexity
    const processMarkdown = (text: string) => {
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    };

    const isSectionTitle = (line: string) => {
        return /^(Bệnh viện chuyên về|Bác sĩ chuyên về|Dựa trên các triệu chứng|Lời khuyên chung|Chuyên khoa phù hợp).*:?$/.test(
            line
        );
    };

    const isNameLine = (line: string) => {
        return !isSectionTitle(line) && /^(Bác sĩ|BS\.|Bệnh viện|Phòng khám)/.test(line);
    };

    const isListItem = (line: string) => {
        return /^[-•]/.test(line);
    };

    const renderDisclaimerTitle = (line: string, index: number) => {
        return (
            <React.Fragment key={`disclaimer-title-${index}`}>
                <div className={styles.disclaimerSection}>
                    <strong className={styles.disclaimerTitle}>{line}</strong>
                </div>
            </React.Fragment>
        );
    };

    const renderDisclaimerText = (line: string, index: number) => {
        const disclaimerText = line.slice(1, -1);
        return (
            <React.Fragment key={`disclaimer-text-${index}`}>
                <div
                    className={styles.disclaimerText}
                    dangerouslySetInnerHTML={{ __html: disclaimerText }}
                />
            </React.Fragment>
        );
    };

    const renderSectionTitle = (line: string, index: number, isLastLine: boolean) => {
        return (
            <React.Fragment key={`section-${index}`}>
                <strong
                    className={styles.sectionTitle}
                    dangerouslySetInnerHTML={{ __html: line }}
                />
                {!isLastLine && <br />}
            </React.Fragment>
        );
    };

    const renderNameLine = (line: string, index: number) => {
        return (
            <React.Fragment key={`name-${index}`}>
                <strong className={styles.boldName} dangerouslySetInnerHTML={{ __html: line }} />
            </React.Fragment>
        );
    };

    const renderListItem = (line: string, index: number) => {
        return (
            <React.Fragment key={`list-${index}`}>
                <div className={styles.listItem}>
                    <span dangerouslySetInnerHTML={{ __html: line }} />
                </div>
            </React.Fragment>
        );
    };

    const renderContentLine = (line: string, index: number, isLastLine: boolean) => {
        return (
            <React.Fragment key={`content-${index}`}>
                <span dangerouslySetInnerHTML={{ __html: line }} />
                {!isLastLine && <br />}
            </React.Fragment>
        );
    };

    const renderBlockBorder = (blockStart: number, suffix: string = '') => {
        return <div key={`border-${blockStart}${suffix}`} className={styles.dataBlockBorder}></div>;
    };

    const formatTextContent = (text: string) => {
        const processedText = processMarkdown(text);
        const lines = processedText.split('\n');
        const formattedLines: React.ReactNode[] = [];
        let currentBlockStart = -1;
        let isInBlock = false;
        let isInDisclaimer = false;
        let disclaimerProcessed = false;

        for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
            const trimmedLine = line.trim();
            const nextLine = index < lines.length - 1 ? lines[index + 1]?.trim() : '';
            const isLastLine = index === lines.length - 1;

            // Handle disclaimer title
            if (trimmedLine.startsWith('Lưu ý:') && !disclaimerProcessed) {
                isInDisclaimer = true;
                formattedLines.push(renderDisclaimerTitle(trimmedLine, index));
                continue;
            }

            // Handle disclaimer text
            if (
                isInDisclaimer &&
                trimmedLine.startsWith('*') &&
                trimmedLine.endsWith('*') &&
                !disclaimerProcessed
            ) {
                formattedLines.push(renderDisclaimerText(trimmedLine, index));
                disclaimerProcessed = true;
                isInDisclaimer = false;
                continue;
            }

            // Skip duplicate disclaimer lines
            if (
                disclaimerProcessed &&
                (trimmedLine.startsWith('Lưu ý:') ||
                    (trimmedLine.startsWith('*') && trimmedLine.endsWith('*')))
            ) {
                continue;
            }

            // Handle section titles
            if (isSectionTitle(trimmedLine)) {
                formattedLines.push(renderSectionTitle(trimmedLine, index, isLastLine));
            }
            // Handle name lines
            else if (isNameLine(trimmedLine)) {
                if (isInBlock && currentBlockStart >= 0) {
                    formattedLines.push(renderBlockBorder(currentBlockStart));
                }
                currentBlockStart = index;
                isInBlock = true;
                formattedLines.push(renderNameLine(trimmedLine, index));
            }
            // Handle content lines
            else if (trimmedLine) {
                if (isListItem(trimmedLine)) {
                    formattedLines.push(renderListItem(trimmedLine, index));
                } else {
                    formattedLines.push(renderContentLine(trimmedLine, index, isLastLine));
                }
            }
            // Handle empty lines
            else {
                if (
                    isInBlock &&
                    (/^(Bác sĩ|BS\.|Bệnh viện|Phòng khám)/.test(nextLine) || nextLine === '')
                ) {
                    formattedLines.push(
                        <React.Fragment key={`empty-${index}`}>
                            <br key={`br-${index}`} />
                            {renderBlockBorder(currentBlockStart, `-${index}`)}
                        </React.Fragment>
                    );
                    isInBlock = false;
                } else {
                    formattedLines.push(<br key={`br-${index}`} />);
                }
            }
        }

        // Add final border if needed
        if (isInBlock && currentBlockStart >= 0) {
            formattedLines.push(renderBlockBorder(currentBlockStart, '-end'));
        }

        return formattedLines;
    };

    return (
        <div
            className={clsx(styles.messageBubble, {
                [styles.userMessage]: isUser,
                [styles.aiMessage]: !isUser,
            })}
        >
            <div className={styles.avatar}>
                {isUser ? (
                    isAuthenticated && profile && profile.avatarUrl && !avatarError ? (
                        <img
                            src={profile.avatarUrl}
                            alt={profile.fullName || 'User'}
                            onError={() => setAvatarError(true)}
                            className={styles.userAvatarImg}
                        />
                    ) : (
                        <div className={styles.userAvatarFallback}>{getInitials()}</div>
                    )
                ) : (
                    <Stethoscope size={20} className={styles.aiIcon} />
                )}
            </div>
            <div className={styles.content}>
                <div
                    className={clsx(styles.bubble, styles.textContent, {
                        [styles.userBubble]: isUser,
                        [styles.aiBubble]: !isUser,
                    })}
                >
                    {isEditing ? (
                        <textarea
                            className={styles.editTextarea}
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            rows={Math.min(editContent.split('\n').length, 5)}
                        />
                    ) : (
                        <div className={styles.text}>
                            {isUser ? message.content : formatTextContent(message.content)}
                        </div>
                    )}
                </div>
                <div className={styles.footer}>
                    <span className={styles.timestamp}>{formatTime(message.timestamp)}</span>
                    {!isEditing && (
                        <div className={styles.actionButtons}>
                            {isUser && (
                                <button
                                    className={styles.actionButton}
                                    onClick={handleEdit}
                                    data-tooltip="Sửa"
                                >
                                    <Edit2 size={14} />
                                </button>
                            )}
                            <button
                                className={styles.actionButton}
                                onClick={handleCopy}
                                data-tooltip={copied ? 'Đã sao chép' : 'Sao chép'}
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                        </div>
                    )}
                    {isUser && isEditing && (
                        <div className={styles.editButtons}>
                            <button
                                className={clsx(styles.editButton, styles.saveButton)}
                                onClick={handleSaveEdit}
                            >
                                Lưu
                            </button>
                            <button
                                className={clsx(styles.editButton, styles.cancelButton)}
                                onClick={handleCancelEdit}
                            >
                                Hủy
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
