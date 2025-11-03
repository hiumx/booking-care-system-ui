import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { useChat } from '@/providers/ChatProvider';
import { MessageType } from '@/types/communication.types';
import styles from './ChatFooter.module.scss';

interface ChatFooterProps {
    setIsTyping: (isTyping: boolean) => void;
}

const ChatFooter: React.FC<ChatFooterProps> = ({ setIsTyping }) => {
    const { sendMessage, activeConversation, startTyping, stopTyping } = useChat();
    const [message, setMessage] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);
    const [isSending, setIsSending] = useState(false);
    // File staging states (modern UX like Slack)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [fileMessageType, setFileMessageType] = useState<MessageType | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation: Must have either text or files
        const hasText = message.trim().length > 0;
        const hasFiles = selectedFiles.length > 0;

        if (!hasText && !hasFiles) {
            return;
        }

        if (!activeConversation || isSending) {
            return;
        }

        setIsSending(true);
        try {
            if (hasFiles && fileMessageType) {
                // Send message with files (and optional text caption)
                await sendMessage(message.trim(), fileMessageType, selectedFiles);
                toast.success(`Đã gửi ${selectedFiles.length} file thành công`);
            } else {
                // Send text-only message
                await sendMessage(message.trim(), MessageType.TEXT);
            }

            // Clear all inputs after successful send
            setMessage('');
            setSelectedFiles([]);
            setFileMessageType(null);
            setIsTyping(false);
            stopTyping();
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Không thể gửi tin nhắn');
        } finally {
            setIsSending(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMessage(value);
        setIsTyping(value.length > 0);

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        if (value.trim()) {
            // Send typing indicator
            startTyping();

            // Stop typing after 3 seconds of inactivity
            typingTimeoutRef.current = setTimeout(() => {
                stopTyping();
            }, 3000);
        } else {
            stopTyping();
        }
    };

    // Stage files for preview (don't send immediately)
    const handleFileSelect = (files: FileList | null, messageType: MessageType) => {
        if (!files || files.length === 0 || !activeConversation) return;

        const fileArray = Array.from(files);

        // Validate file types match message type
        const isValid = validateFileTypes(fileArray, messageType);
        if (!isValid) {
            toast.error('Loại file không hợp lệ');
            return;
        }

        // Stage files for preview
        setSelectedFiles(fileArray);
        setFileMessageType(messageType);
        setShowDropdown(false);

        console.log('[ChatFooter] Files staged:', {
            count: fileArray.length,
            type: messageType,
            files: fileArray.map((f) => ({ name: f.name, size: f.size, type: f.type })),
        });
    };

    // Validate file types match message type
    const validateFileTypes = (files: File[], messageType: MessageType): boolean => {
        switch (messageType) {
            case MessageType.IMAGE:
                return files.every((f) => f.type.startsWith('image/'));
            case MessageType.AUDIO:
                return files.every((f) => f.type.startsWith('audio/'));
            case MessageType.FILE:
                // Documents can be any file type
                return true;
            default:
                return false;
        }
    };

    // Remove a staged file
    const handleRemoveFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        if (selectedFiles.length === 1) {
            // Last file removed, clear message type
            setFileMessageType(null);
        }
    };

    // Clear all staged files
    const handleClearFiles = () => {
        setSelectedFiles([]);
        setFileMessageType(null);
    };

    // Cleanup typing timeout on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            stopTyping();
        };
    }, []);

    // Cleanup object URLs when files change to prevent memory leaks
    useEffect(() => {
        return () => {
            selectedFiles.forEach((file) => {
                if (file.type.startsWith('image/')) {
                    URL.revokeObjectURL(URL.createObjectURL(file));
                }
            });
        };
    }, [selectedFiles]);

    // Emoji click handler
    const handleEmojiClick = (emoji: string) => {
        setMessage((prev) => prev + emoji);
        setIsTyping(true);
        setShowEmoji(false);
    };

    // Helper: Format file size
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    // Helper: Get file icon based on type
    const getFileIcon = (file: File): string => {
        if (file.type.startsWith('image/')) return 'fa-solid fa-image';
        if (file.type.startsWith('audio/')) return 'fa-solid fa-volume-high';
        if (file.type.startsWith('video/')) return 'fa-solid fa-video';
        if (file.type.includes('pdf')) return 'fa-solid fa-file-pdf';
        if (file.type.includes('word')) return 'fa-solid fa-file-word';
        if (file.type.includes('excel') || file.type.includes('spreadsheet'))
            return 'fa-solid fa-file-excel';
        return 'fa-solid fa-file';
    };

    // Helper: Create preview URL for images
    const createPreviewUrl = (file: File): string | null => {
        if (file.type.startsWith('image/')) {
            return URL.createObjectURL(file);
        }
        return null;
    };

    return (
        <div className="chat-footer">
            {/* File Preview Area (Modern UX like Slack) */}
            {selectedFiles.length > 0 && (
                <div className={styles.filePreviewArea}>
                    <div className={styles.filePreviewHeader}>
                        <span className={styles.filePreviewTitle}>
                            <i className="fa-solid fa-paperclip"></i>
                            {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} đã chọn
                        </span>
                        <button
                            type="button"
                            className={styles.clearAllBtn}
                            onClick={handleClearFiles}
                            title="Xóa tất cả"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div className={styles.filePreviewList}>
                        {selectedFiles.map((file, index) => {
                            const previewUrl = createPreviewUrl(file);
                            return (
                                <div key={index} className={styles.filePreviewItem}>
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt={file.name}
                                            className={styles.filePreviewImage}
                                        />
                                    ) : (
                                        <div className={styles.filePreviewIcon}>
                                            <i className={getFileIcon(file)}></i>
                                        </div>
                                    )}
                                    <div className={styles.filePreviewInfo}>
                                        <div className={styles.filePreviewName} title={file.name}>
                                            {file.name}
                                        </div>
                                        <div className={styles.filePreviewSize}>
                                            {formatFileSize(file.size)}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.removeFileBtn}
                                        onClick={() => handleRemoveFile(index)}
                                        title="Xóa file"
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="smile-foot">
                    <div className="chat-action-btns">
                        <div className="chat-action-col" ref={dropdownRef}>
                            <a
                                className={clsx(styles.item, 'action-circle')}
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowDropdown((prev) => !prev);
                                }}
                            >
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                            </a>
                            {showDropdown && (
                                <div
                                    className={clsx(
                                        'dropdown-menu dropdown-menu-end show',
                                        styles.dropdownMenuUp
                                    )}
                                    style={{ display: 'block' }}
                                >
                                    <a
                                        href="#"
                                        className="dropdown-item"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            fileInputRef.current?.click();
                                            setShowDropdown(false);
                                        }}
                                    >
                                        <span>
                                            <i className="fa-solid fa-file-lines"></i>
                                        </span>
                                        Tài liệu
                                    </a>
                                    <a
                                        href="#"
                                        className="dropdown-item"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const input = document.createElement('input');
                                            input.type = 'file';
                                            input.accept = 'image/*';
                                            input.capture = 'environment';
                                            input.onchange = (e) =>
                                                handleFileSelect(
                                                    (e.target as HTMLInputElement).files,
                                                    MessageType.IMAGE
                                                );
                                            input.click();
                                        }}
                                    >
                                        <span>
                                            <i className="fa-solid fa-camera"></i>
                                        </span>
                                        Camera
                                    </a>
                                    <a
                                        href="#"
                                        className="dropdown-item"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const input = document.createElement('input');
                                            input.type = 'file';
                                            input.accept = 'image/*';
                                            input.multiple = true;
                                            input.onchange = (e) =>
                                                handleFileSelect(
                                                    (e.target as HTMLInputElement).files,
                                                    MessageType.IMAGE
                                                );
                                            input.click();
                                        }}
                                    >
                                        <span>
                                            <i className="fa-solid fa-image"></i>
                                        </span>
                                        Thư viện
                                    </a>
                                    <a
                                        href="#"
                                        className="dropdown-item"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const input = document.createElement('input');
                                            input.type = 'file';
                                            input.accept = 'audio/*';
                                            input.onchange = (e) =>
                                                handleFileSelect(
                                                    (e.target as HTMLInputElement).files,
                                                    MessageType.AUDIO
                                                );
                                            input.click();
                                        }}
                                    >
                                        <span>
                                            <i className="fa-solid fa-volume-high"></i>
                                        </span>
                                        Âm thanh
                                    </a>
                                </div>
                            )}
                            {/* Hidden file input for documents */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                style={{ display: 'none' }}
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                                multiple
                                onChange={(e) => handleFileSelect(e.target.files, MessageType.FILE)}
                            />
                        </div>
                    </div>
                </div>
                <div className="smile-foot emoj-action-foot">
                    <a
                        href="#"
                        className="action-circle"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowEmoji((prev) => !prev);
                        }}
                    >
                        <i className="fa-regular fa-face-smile"></i>
                    </a>
                    {showEmoji && (
                        <div
                            className={clsx(
                                styles.emojiVisible,
                                'emoj-group-list-foot down-emoji-circle'
                            )}
                        >
                            <ul>
                                <li>
                                    <a
                                        href="javascript:void(0);"
                                        onClick={() => handleEmojiClick('😀')}
                                    >
                                        😀
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="javascript:void(0);"
                                        onClick={() => handleEmojiClick('😂')}
                                    >
                                        😂
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="javascript:void(0);"
                                        onClick={() => handleEmojiClick('😍')}
                                    >
                                        😍
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="javascript:void(0);"
                                        onClick={() => handleEmojiClick('👍')}
                                    >
                                        👍
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="javascript:void(0);"
                                        onClick={() => handleEmojiClick('🥰')}
                                    >
                                        🥰
                                    </a>
                                </li>
                                <li className="add-emoj">
                                    <a href="javascript:void(0);">
                                        <i className="fa-solid fa-plus"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
                <div className="smile-foot">
                    <a href="#" className="action-circle">
                        <i className="isax isax-microphone-2"></i>
                    </a>
                </div>
                <input
                    type="text"
                    className="form-control chat_form"
                    placeholder={
                        selectedFiles.length > 0
                            ? `Thêm chú thích cho ${selectedFiles.length} file...`
                            : 'Nhập tin nhắn của bạn...'
                    }
                    value={message}
                    onChange={handleInputChange}
                />
                <div className="form-buttons">
                    <button
                        className="btn send-btn"
                        type="submit"
                        disabled={
                            isSending ||
                            !activeConversation ||
                            (message.trim().length === 0 && selectedFiles.length === 0)
                        }
                    >
                        {isSending ? (
                            <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Đang gửi...</span>
                            </div>
                        ) : (
                            <i className="isax isax-send-25"></i>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatFooter;
