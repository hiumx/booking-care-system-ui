import styles from './MessageItem.module.scss';
import clsx from 'clsx';

import { ChatMessage } from '../../data/mockData';

interface MessageItemProps {
    message: ChatMessage;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
    const renderMessageContent = () => {
        switch (message.messageType) {
            case 'voice':
                return (
                    <div className="chat-voice-group">
                        <ul>
                            <li>
                                <a href="javascript:void(0);">
                                    <span>
                                        <img src="./src/assets/img/icons/play-01.svg" alt="image" />
                                    </span>
                                </a>
                            </li>
                            <li>
                                <img src="./src/assets/img/icons/voice.svg" alt="image" />
                            </li>
                            <li>0:05</li>
                        </ul>
                    </div>
                );
            case 'image':
                return (
                    <div className="download-col">
                        <ul className="nav mb-0">
                            {message.attachments?.map((attachment, index) => (
                                <li key={index}>
                                    <div className="image-download-col">
                                        <a
                                            href={attachment}
                                            data-fancybox="gallery"
                                            className="fancybox"
                                        >
                                            <img src={attachment} alt="Img" />
                                        </a>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case 'location':
                return (
                    <div className="file-download d-flex align-items-center mb-0">
                        <div className="file-type d-flex align-items-center justify-content-center me-2">
                            <i className="fa-solid fa-location-dot"></i>
                        </div>
                        <div className="file-details">
                            <span className="file-name">{message.content}</span>
                            <ul>
                                <li>
                                    <a href="javascript:void(0);">Tải xuống</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                );
            default:
                return message.content;
        }
    };

    return (
        <div className={clsx(styles.item, `chats ${message.isOwn ? 'chats-right' : ''}`)}>
            <div className="chat-avatar">
                <img src={message.senderAvatar} className="dreams_chat" alt="image" />
            </div>
            <div className="chat-content">
                <div
                    className={`chat-profile-name ${message.isOwn ? 'text-end justify-content-end' : ''}`}
                >
                    <h6>
                        {message.senderName}
                        <span>
                            {message.timestamp}
                            {message.isRead && !message.isOwn && (
                                <i className="fa-solid fa-check-double green-check"></i>
                            )}
                        </span>
                    </h6>
                    <div className="chat-action-btns ms-3">
                        <div className="chat-action-col">
                            <a href="#" data-bs-toggle="dropdown">
                                <i className="fa-solid fa-ellipsis"></i>
                            </a>
                            <div className="dropdown-menu chat-drop-menu dropdown-menu-end">
                                <a href="#" className="dropdown-item message-info-left">
                                    Thông tin tin nhắn
                                </a>
                                <a href="#" className="dropdown-item">
                                    Trả lời
                                </a>
                                <a href="#" className="dropdown-item">
                                    Phản ứng
                                </a>
                                <a href="#" className="dropdown-item">
                                    Chuyển tiếp
                                </a>
                                <a href="#" className="dropdown-item">
                                    Xóa
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="message-content">
                    {renderMessageContent()}
                    <div className={`emoj-group ${message.isOwn ? 'right-emoji-group' : ''}`}>
                        <ul>
                            <li className="emoj-action">
                                <a href="javascript:void(0);">
                                    <i className="fa-regular fa-face-smile"></i>
                                </a>
                                <div className="emoj-group-list">
                                    <ul>
                                        <li>
                                            <a href="javascript:void(0);">
                                                <img
                                                    src="./src/assets/img/icons/emoj-icon-01.svg"
                                                    alt="Icon"
                                                />
                                            </a>
                                        </li>
                                        <li>
                                            <a href="javascript:void(0);">
                                                <img
                                                    src="./src/assets/img/icons/emoj-icon-02.svg"
                                                    alt="Icon"
                                                />
                                            </a>
                                        </li>
                                        <li>
                                            <a href="javascript:void(0);">
                                                <img
                                                    src="./src/assets/img/icons/emoj-icon-03.svg"
                                                    alt="Icon"
                                                />
                                            </a>
                                        </li>
                                        <li>
                                            <a href="javascript:void(0);">
                                                <img
                                                    src="./src/assets/img/icons/emoj-icon-04.svg"
                                                    alt="Icon"
                                                />
                                            </a>
                                        </li>
                                        <li>
                                            <a href="javascript:void(0);">
                                                <img
                                                    src="./src/assets/img/icons/emoj-icon-05.svg"
                                                    alt="Icon"
                                                />
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#forward-message"
                                >
                                    <i className="fa-solid fa-share"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageItem;
