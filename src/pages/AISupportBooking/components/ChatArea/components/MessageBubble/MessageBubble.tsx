import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { Stethoscope, Edit2, Copy, Check } from 'lucide-react';
import { RootState } from '@/store';
import { Message } from '../../../../types';
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

    const formatTextContent = (text: string) => {
        // Loại bỏ markdown ** và thay thế bằng <strong>
        // Xử lý **text** thành <strong>text</strong>
        const processedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Format text response với bold tên và border-bottom dưới mỗi block thông tin
        const lines = processedText.split('\n');
        const formattedLines: React.ReactNode[] = [];
        let currentBlockStart = -1;
        let isInBlock = false;
        let isInDisclaimer = false;
        let disclaimerProcessed = false; // Track if disclaimer has been processed to avoid duplicates

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            const nextLine = index < lines.length - 1 ? lines[index + 1]?.trim() : '';

            // Kiểm tra nếu là disclaimer section (bắt đầu với "Lưu ý:") - chỉ xử lý 1 lần
            if (trimmedLine.startsWith('Lưu ý:') && !disclaimerProcessed) {
                isInDisclaimer = true;
                formattedLines.push(
                    <React.Fragment key={index}>
                        <div className={styles.disclaimerSection}>
                            <strong className={styles.disclaimerTitle}>{trimmedLine}</strong>
                        </div>
                    </React.Fragment>
                );
                return;
            }

            // Kiểm tra nếu là disclaimer text (bắt đầu với *) - chỉ xử lý 1 lần
            if (
                isInDisclaimer &&
                trimmedLine.startsWith('*') &&
                trimmedLine.endsWith('*') &&
                !disclaimerProcessed
            ) {
                const disclaimerText = trimmedLine.slice(1, -1); // Remove * at start and end
                formattedLines.push(
                    <React.Fragment key={index}>
                        <div
                            className={styles.disclaimerText}
                            dangerouslySetInnerHTML={{ __html: disclaimerText }}
                        />
                    </React.Fragment>
                );
                // Mark disclaimer as processed and reset flag
                disclaimerProcessed = true;
                isInDisclaimer = false;
                return;
            }

            // Skip duplicate disclaimer lines - only skip if already processed
            if (
                disclaimerProcessed &&
                (trimmedLine.startsWith('Lưu ý:') ||
                    (trimmedLine.startsWith('*') && trimmedLine.endsWith('*')))
            ) {
                return; // Skip duplicate disclaimer only if already processed
            }

            // Kiểm tra nếu là section title (có dấu hai chấm ở cuối và không phải là tên bác sĩ/bệnh viện)
            const isSectionTitle = trimmedLine.match(/^(Bệnh viện chuyên về|Bác sĩ chuyên về).*:$/);

            // Kiểm tra nếu là tên bác sĩ hoặc bệnh viện (bắt đầu với "Bác sĩ", "BS.", hoặc "Bệnh viện", "Phòng khám" nhưng không phải section title)
            const isNameLine =
                !isSectionTitle && trimmedLine.match(/^(Bác sĩ|BS\.|Bệnh viện|Phòng khám)/);

            if (isSectionTitle) {
                // Section title - không thêm border, spacing nhỏ hơn
                formattedLines.push(
                    <React.Fragment key={index}>
                        <strong
                            className={styles.sectionTitle}
                            dangerouslySetInnerHTML={{ __html: trimmedLine }}
                        />
                        {index < lines.length - 1 && <br />}
                    </React.Fragment>
                );
            } else if (isNameLine) {
                // Nếu đang trong một block, thêm border-bottom trước khi bắt đầu block mới
                if (isInBlock && currentBlockStart >= 0) {
                    formattedLines.push(
                        <div
                            key={`border-${currentBlockStart}`}
                            className={styles.dataBlockBorder}
                        ></div>
                    );
                }

                // Bắt đầu block mới
                currentBlockStart = index;
                isInBlock = true;
                formattedLines.push(
                    <React.Fragment key={index}>
                        <strong
                            className={styles.boldName}
                            dangerouslySetInnerHTML={{ __html: trimmedLine }}
                        />
                    </React.Fragment>
                );
            } else if (trimmedLine) {
                // Nếu là dòng có nội dung trong block - render HTML nếu có
                formattedLines.push(
                    <React.Fragment key={index}>
                        <span dangerouslySetInnerHTML={{ __html: trimmedLine }} />
                        {index < lines.length - 1 && <br />}
                    </React.Fragment>
                );
            } else {
                // Dòng trống - kiểm tra xem có phải kết thúc block không
                // Nếu dòng trống và dòng tiếp theo là tên mới hoặc không có dòng tiếp theo, kết thúc block
                if (
                    isInBlock &&
                    (nextLine.match(/^(Bác sĩ|BS\.|Bệnh viện|Phòng khám)/) || nextLine === '')
                ) {
                    formattedLines.push(
                        <React.Fragment key={index}>
                            <br />
                            <div
                                key={`border-${currentBlockStart}`}
                                className={styles.dataBlockBorder}
                            ></div>
                        </React.Fragment>
                    );
                    isInBlock = false;
                } else {
                    formattedLines.push(<br key={index} />);
                }
            }
        });

        // Thêm border-bottom cho block cuối cùng nếu chưa có
        if (isInBlock && currentBlockStart >= 0) {
            formattedLines.push(
                <div
                    key={`border-${currentBlockStart}-end`}
                    className={styles.dataBlockBorder}
                ></div>
            );
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
                            {!isUser ? formatTextContent(message.content) : message.content}
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
