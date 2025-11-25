import React, { useState } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { Stethoscope, Copy, Check } from 'lucide-react';
import { RootState } from '@/store';
import { Message } from '@/types/ai.types';
import styles from './MessageBubble.module.scss';

interface MessageBubbleProps {
    message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isUser = message.sender === 'user';
    const { profile } = useSelector((state: RootState) => state.user);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [copied, setCopied] = useState(false);
    const [avatarError, setAvatarError] = useState(false);

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

    // Helper functions to reduce cognitive complexity
    const processMarkdown = (text: string) => {
        const boldRegex = /\*\*(.*?)\*\*/g;
        const segments: string[] = [];
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = boldRegex.exec(text)) !== null) {
            segments.push(text.slice(lastIndex, match.index), `<strong>${match[1]}</strong>`);
            lastIndex = match.index + match[0].length;
        }

        segments.push(text.slice(lastIndex));
        return segments.join('');
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

    const renderSectionTitle = (line: string, index: number) => {
        return (
            <React.Fragment key={`section-${index}`}>
                <strong
                    className={styles.sectionTitle}
                    dangerouslySetInnerHTML={{ __html: line }}
                />
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

    // Helper type for tracking state
    interface FormatState {
        formattedLines: React.ReactNode[];
        currentBlockStart: number;
        isInBlock: boolean;
        isInDisclaimer: boolean;
        disclaimerProcessed: boolean;
    }

    // Process disclaimer title
    const processDisclaimerTitle = (
        trimmedLine: string,
        index: number,
        state: FormatState
    ): boolean => {
        if (trimmedLine.startsWith('Lưu ý:') && !state.disclaimerProcessed) {
            state.isInDisclaimer = true;
            state.formattedLines.push(renderDisclaimerTitle(trimmedLine, index));
            return true;
        }
        return false;
    };

    // Process disclaimer text
    const processDisclaimerText = (
        trimmedLine: string,
        index: number,
        state: FormatState
    ): boolean => {
        if (
            state.isInDisclaimer &&
            trimmedLine.startsWith('*') &&
            trimmedLine.endsWith('*') &&
            !state.disclaimerProcessed
        ) {
            state.formattedLines.push(renderDisclaimerText(trimmedLine, index));
            state.disclaimerProcessed = true;
            state.isInDisclaimer = false;
            return true;
        }
        return false;
    };

    // Check if should skip duplicate disclaimer
    const shouldSkipDuplicateDisclaimer = (
        trimmedLine: string,
        disclaimerProcessed: boolean
    ): boolean => {
        return (
            disclaimerProcessed &&
            (trimmedLine.startsWith('Lưu ý:') ||
                (trimmedLine.startsWith('*') && trimmedLine.endsWith('*')))
        );
    };

    // Process name line
    const processNameLine = (trimmedLine: string, index: number, state: FormatState): void => {
        if (state.isInBlock && state.currentBlockStart >= 0) {
            state.formattedLines.push(renderBlockBorder(state.currentBlockStart));
        }
        state.currentBlockStart = index;
        state.isInBlock = true;
        state.formattedLines.push(renderNameLine(trimmedLine, index));
    };

    // Process content line
    const processContentLine = (
        trimmedLine: string,
        index: number,
        isLastLine: boolean,
        state: FormatState
    ): void => {
        if (isListItem(trimmedLine)) {
            state.formattedLines.push(renderListItem(trimmedLine, index));
        } else {
            state.formattedLines.push(renderContentLine(trimmedLine, index, isLastLine));
        }
    };

    // Process empty line
    const processEmptyLine = (
        index: number,
        nextLine: string,
        prevLine: string,
        state: FormatState
    ): void => {
        // Nếu empty line ngay sau section title, bỏ qua (không render <br />)
        if (isSectionTitle(prevLine)) {
            return;
        }

        if (
            state.isInBlock &&
            (/^(Bác sĩ|BS\.|Bệnh viện|Phòng khám)/.test(nextLine) || nextLine === '')
        ) {
            state.formattedLines.push(
                <React.Fragment key={`empty-${index}`}>
                    <br key={`br-${index}`} />
                    {renderBlockBorder(state.currentBlockStart, `-${index}`)}
                </React.Fragment>
            );
            state.isInBlock = false;
        } else {
            state.formattedLines.push(<br key={`br-${index}`} />);
        }
    };

    // Process a single line
    const processSingleLine = (
        trimmedLine: string,
        index: number,
        nextLine: string,
        prevLine: string,
        isLastLine: boolean,
        state: FormatState
    ): boolean => {
        // Process disclaimers - return true if processed
        if (processDisclaimerTitle(trimmedLine, index, state)) return true;
        if (processDisclaimerText(trimmedLine, index, state)) return true;
        if (shouldSkipDuplicateDisclaimer(trimmedLine, state.disclaimerProcessed)) return true;

        // Process different line types
        if (isSectionTitle(trimmedLine)) {
            state.formattedLines.push(renderSectionTitle(trimmedLine, index));
        } else if (isNameLine(trimmedLine)) {
            processNameLine(trimmedLine, index, state);
        } else if (trimmedLine) {
            processContentLine(trimmedLine, index, isLastLine, state);
        } else {
            processEmptyLine(index, nextLine, prevLine, state);
        }
        return false;
    };

    const formatTextContent = (text: string) => {
        const processedText = processMarkdown(text);
        const lines = processedText.split('\n');

        const state: FormatState = {
            formattedLines: [],
            currentBlockStart: -1,
            isInBlock: false,
            isInDisclaimer: false,
            disclaimerProcessed: false,
        };

        for (let index = 0; index < lines.length; index++) {
            const trimmedLine = lines[index].trim();
            const nextLine = index < lines.length - 1 ? lines[index + 1]?.trim() : '';
            const prevLine = index > 0 ? lines[index - 1]?.trim() : '';
            const isLastLine = index === lines.length - 1;

            processSingleLine(trimmedLine, index, nextLine, prevLine, isLastLine, state);
        }

        // Add final border if needed
        if (state.isInBlock && state.currentBlockStart >= 0) {
            state.formattedLines.push(renderBlockBorder(state.currentBlockStart, '-end'));
        }

        return state.formattedLines;
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
                    (() => {
                        const hasAvatar = isAuthenticated && profile?.avatarUrl && !avatarError;
                        if (hasAvatar) {
                            return (
                                <img
                                    src={profile.avatarUrl}
                                    alt={profile.fullName || 'User'}
                                    onError={() => setAvatarError(true)}
                                    className={styles.userAvatarImg}
                                />
                            );
                        }
                        return <div className={styles.userAvatarFallback}>{getInitials()}</div>;
                    })()
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
                    <div className={styles.text}>
                        {isUser ? message.content : formatTextContent(message.content)}
                    </div>

                    {/* Question Progress Indicator */}
                    {!isUser &&
                        message.questionCount !== undefined &&
                        !message.analysisComplete && (
                            <div className={styles.questionProgress}>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: `${(message.questionCount / 3) * 100}%` }}
                                    />
                                </div>
                                <span className={styles.progressText}>
                                    Câu hỏi {message.questionCount}/3
                                </span>
                            </div>
                        )}

                    {/* Disease Conclusion */}
                    {!isUser && message.disease && message.analysisComplete && (
                        <div className={styles.diseaseConclusion}>
                            <div className={styles.conclusionHeader}>
                                <h4>🔍 Kết luận</h4>
                            </div>
                            <div className={styles.conclusionBody}>
                                <div className={styles.diseaseName}>
                                    <strong>{message.disease.name}</strong>
                                </div>
                                <div className={styles.confidence}>
                                    <span className={styles.confidenceLabel}>Độ tin cậy:</span>
                                    <div className={styles.confidenceBar}>
                                        <div
                                            className={styles.confidenceFill}
                                            style={{
                                                width: `${message.disease.confidence * 100}%`,
                                                backgroundColor:
                                                    message.disease.confidence >= 0.7
                                                        ? '#10b981'
                                                        : message.disease.confidence >= 0.5
                                                          ? '#f59e0b'
                                                          : '#ef4444',
                                            }}
                                        />
                                    </div>
                                    <span className={styles.confidenceValue}>
                                        {(message.disease.confidence * 100).toFixed(0)}%
                                    </span>
                                </div>
                                {message.disease.reasons && message.disease.reasons.length > 0 && (
                                    <div className={styles.reasons}>
                                        <strong>Lý do:</strong>
                                        <ul>
                                            {message.disease.reasons.map((reason, idx) => (
                                                <li key={idx}>{reason}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className={styles.footer}>
                    <span className={styles.timestamp}>{formatTime(message.timestamp)}</span>
                    <div className={styles.actionButtons}>
                        <button
                            className={styles.actionButton}
                            onClick={handleCopy}
                            data-tooltip={copied ? 'Đã sao chép' : 'Sao chép'}
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
