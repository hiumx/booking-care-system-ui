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
        if (!message.trim() || !activeConversation || isSending) {
            return;
        }

        setIsSending(true);
        try {
            await sendMessage(message.trim(), MessageType.TEXT);
            setMessage('');
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

    const handleFileUpload = async (files: FileList | null, messageType: MessageType) => {
        if (!files || files.length === 0 || !activeConversation) return;

        setIsSending(true);
        try {
            const fileArray = Array.from(files);
            await sendMessage('', messageType, fileArray);
            toast.success('Đã gửi file thành công');
            setShowDropdown(false);
        } catch (error) {
            console.error('Error uploading files:', error);
            toast.error('Không thể gửi file');
        } finally {
            setIsSending(false);
        }
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

    // Emoji click handler
    const handleEmojiClick = (emoji: string) => {
        setMessage((prev) => prev + emoji);
        setIsTyping(true);
        setShowEmoji(false);
    };

    return (
        <div className="chat-footer">
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
                                                handleFileUpload(
                                                    (e.target as HTMLInputElement).files,
                                                    MessageType.IMAGE
                                                );
                                            input.click();
                                            setShowDropdown(false);
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
                                                handleFileUpload(
                                                    (e.target as HTMLInputElement).files,
                                                    MessageType.IMAGE
                                                );
                                            input.click();
                                            setShowDropdown(false);
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
                                                handleFileUpload(
                                                    (e.target as HTMLInputElement).files,
                                                    MessageType.AUDIO
                                                );
                                            input.click();
                                            setShowDropdown(false);
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
                                onChange={(e) => handleFileUpload(e.target.files, MessageType.FILE)}
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
                    placeholder="Nhập tin nhắn của bạn..."
                    value={message}
                    onChange={handleInputChange}
                />
                <div className="form-buttons">
                    <button
                        className="btn send-btn"
                        type="submit"
                        disabled={isSending || !activeConversation}
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
