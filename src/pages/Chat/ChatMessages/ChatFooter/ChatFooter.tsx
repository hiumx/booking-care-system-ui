import { useState } from 'react';
import clsx from 'clsx';
import styles from './ChatFooter.module.scss';

interface ChatFooterProps {
    setIsTyping: (isTyping: boolean) => void;
}

const ChatFooter: React.FC<ChatFooterProps> = ({ setIsTyping }) => {
    const [message, setMessage] = useState('');

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

    return (
        <div className="chat-footer">
            <form onSubmit={handleSubmit}>
                <div className="smile-foot">
                    <div className="chat-action-btns">
                        <div className="chat-action-col">
                            <a
                                className={clsx(styles.item, 'action-circle')}
                                href="#"
                                data-bs-toggle="dropdown"
                            >
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end">
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
                        </div>
                    </div>
                </div>
                <div className="smile-foot emoj-action-foot">
                    <a href="#" className="action-circle">
                        <i className="fa-regular fa-face-smile"></i>
                    </a>
                    <div className="emoj-group-list-foot down-emoji-circle">
                        <ul>
                            <li>
                                <a href="javascript:void(0);">
                                    <img src="./src/assets/img/icons/emoj-icon-01.svg" alt="Icon" />
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0);">
                                    <img src="./src/assets/img/icons/emoj-icon-02.svg" alt="Icon" />
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0);">
                                    <img src="./src/assets/img/icons/emoj-icon-03.svg" alt="Icon" />
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0);">
                                    <img src="./src/assets/img/icons/emoj-icon-04.svg" alt="Icon" />
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0);">
                                    <img src="./src/assets/img/icons/emoj-icon-05.svg" alt="Icon" />
                                </a>
                            </li>
                            <li className="add-emoj">
                                <a href="javascript:void(0);">
                                    <i className="fa-solid fa-plus"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
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
