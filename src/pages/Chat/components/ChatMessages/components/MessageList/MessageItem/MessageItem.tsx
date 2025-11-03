import styles from './MessageItem.module.scss';
import clsx from 'clsx';
import { useState } from 'react';

import { ChatMessage } from '../../../../../data/mockData';

interface MessageItemProps {
    message: ChatMessage;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Helper: Get file icon based on mimeType
    const getFileIcon = (mimeType?: string): string => {
        if (!mimeType) return 'fa-solid fa-file';
        if (mimeType.startsWith('image/')) return 'fa-solid fa-image';
        if (mimeType.startsWith('audio/')) return 'fa-solid fa-volume-high';
        if (mimeType.startsWith('video/')) return 'fa-solid fa-video';
        if (mimeType.includes('pdf')) return 'fa-solid fa-file-pdf';
        if (mimeType.includes('word')) return 'fa-solid fa-file-word';
        if (mimeType.includes('excel') || mimeType.includes('spreadsheet'))
            return 'fa-solid fa-file-excel';
        if (mimeType.includes('text')) return 'fa-solid fa-file-lines';
        return 'fa-solid fa-file';
    };

    // Helper: Format file size
    const formatFileSize = (bytes?: number): string => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const renderMessageContent = () => {
        switch (message.messageType) {
            case 'voice':
            case 'audio':
                return (
                    <div className="audio-attachments">
                        <div className="chat-voice-group">
                            <ul>
                                <li>
                                    <a href="javascript:void(0);">
                                        <span>
                                            <img
                                                src="./src/assets/img/icons/play-01.svg"
                                                alt="image"
                                            />
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <img src="./src/assets/img/icons/voice.svg" alt="image" />
                                </li>
                                <li>0:05</li>
                            </ul>
                        </div>
                        {/* Show text caption if exists (check for non-empty string) */}
                        {message.content && message.content.trim().length > 0 && (
                            <div className="mt-2">{message.content}</div>
                        )}
                    </div>
                );
            case 'image':
                return (
                    <div className="image-attachments">
                        <div className="download-col">
                            <ul className="nav mb-0">
                                {message.attachments?.map((attachment: any, index) => {
                                    const imageUrl =
                                        attachment?.url || attachment?.fileUrl || attachment;
                                    return (
                                        <li key={index}>
                                            <div className="image-download-col">
                                                <a
                                                    href="#"
                                                    data-fancybox="gallery"
                                                    className="fancybox"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setSelectedImage(imageUrl);
                                                    }}
                                                >
                                                    <img src={imageUrl} alt="Img" />
                                                </a>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        {/* Show text caption if exists (check for non-empty string) */}
                        {message.content && message.content.trim().length > 0 && (
                            <div className="mt-2">{message.content}</div>
                        )}
                    </div>
                );
            case 'file':
                return (
                    <div className="file-attachments">
                        {message.attachments?.map((attachment: any, index) => {
                            const fileUrl = attachment?.url || attachment?.fileUrl;
                            const fileName = attachment?.name || attachment?.fileName || 'File';
                            const fileSize = attachment?.size || attachment?.fileSize;
                            const mimeType = attachment?.mimeType;

                            return (
                                <div
                                    key={index}
                                    className="file-download d-flex align-items-center mb-2"
                                >
                                    <div className="file-type d-flex align-items-center justify-content-center me-2">
                                        <i className={getFileIcon(mimeType)}></i>
                                    </div>
                                    <div className="file-details flex-grow-1">
                                        <span className="file-name">{fileName}</span>
                                        <ul className="mb-0">
                                            <li className="text-muted small">
                                                {formatFileSize(fileSize)}
                                            </li>
                                            <li>
                                                <a
                                                    href={fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    download={fileName}
                                                >
                                                    Tải xuống
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                        {/* Show text content if exists (caption) */}
                        {message.content && message.content.trim().length > 0 && (
                            <div className="mt-2 text-muted small">{message.content}</div>
                        )}
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

            {/* Image Preview Modal */}
            {selectedImage && (
                <div
                    className="modal fade show"
                    style={{
                        display: 'block',
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    }}
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content bg-transparent border-0">
                            <div className="modal-body p-0 text-center">
                                <button
                                    type="button"
                                    className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedImage(null);
                                    }}
                                    style={{ zIndex: 1051 }}
                                ></button>
                                <img
                                    src={selectedImage}
                                    alt="Preview"
                                    className="img-fluid"
                                    style={{ maxHeight: '90vh', cursor: 'pointer' }}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageItem;
