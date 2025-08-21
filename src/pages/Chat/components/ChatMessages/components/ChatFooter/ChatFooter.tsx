import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import styles from './ChatFooter.module.scss';

interface ChatFooterProps {
    setIsTyping: (isTyping: boolean) => void;
}

const ChatFooter: React.FC<ChatFooterProps> = ({ setIsTyping }) => {
    const [message, setMessage] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            // Handle send message
            console.log('Sending message:', message);
            setMessage('');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
        setIsTyping(e.target.value.length > 0);
    };

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
                                    <a href="#" className="dropdown-item">
                                        <span>
                                            <i className="fa-solid fa-file-lines"></i>
                                        </span>
                                        Tài liệu
                                    </a>
                                    <a href="#" className="dropdown-item">
                                        <span>
                                            <i className="fa-solid fa-camera"></i>
                                        </span>
                                        Camera
                                    </a>
                                    <a href="#" className="dropdown-item">
                                        <span>
                                            <i className="fa-solid fa-image"></i>
                                        </span>
                                        Thư viện
                                    </a>
                                    <a href="#" className="dropdown-item">
                                        <span>
                                            <i className="fa-solid fa-volume-high"></i>
                                        </span>
                                        Âm thanh
                                    </a>
                                    <a href="#" className="dropdown-item">
                                        <span>
                                            <i className="fa-solid fa-location-dot"></i>
                                        </span>
                                        Vị trí
                                    </a>
                                    <a href="#" className="dropdown-item">
                                        <span>
                                            <i className="fa-solid fa-user"></i>
                                        </span>
                                        Liên hệ
                                    </a>
                                </div>
                            )}
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
                    <button className="btn send-btn" type="submit">
                        <i className="isax isax-send-25"></i>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatFooter;
