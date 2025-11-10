import styles from './MessageItem.module.scss';
import clsx from 'clsx';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ChatMessage } from '../../../../../data/mockData';
import { ChatService } from '@/services/chat.service';
import { RootState } from '@/store';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';

interface MessageItemProps {
    message: ChatMessage;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isRecalling, setIsRecalling] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // Get current user ID from Redux
    const userProfile = useSelector((state: RootState) => state.user.profile);
    const currentUserId = userProfile?.accountId || '';

    // Check if message can be recalled
    const canRecall = (): boolean => {
        // Only sender can recall
        if (!message.isOwn) return false;

        // Can't recall already recalled message
        if (message.status === 'RECALLED') return false;

        // Check if createdAt exists
        if (!message.createdAt) return false;

        // Check 1-hour time limit
        const messageTime = new Date(message.createdAt).getTime();
        const now = Date.now();
        const hoursSinceSent = (now - messageTime) / (1000 * 60 * 60);

        return hoursSinceSent < 1;
    };

    // Check if message is recalled
    const isRecalled = message.status === 'RECALLED';

    // Handle recall message
    const handleRecallMessage = async () => {
        if (!canRecall()) {
            toast.error('Không thể thu hồi tin nhắn này');
            return;
        }

        setShowConfirmDialog(true);
    };

    const confirmRecall = async () => {
        try {
            setIsRecalling(true);
            await ChatService.recallMessage(message.id, currentUserId);

            toast.success('Đã thu hồi tin nhắn');
            // Message will be updated via SignalR real-time notification
        } catch (error: any) {
            console.error('[MessageItem] ❌ Recall message error:', error);
            toast.error(error.message || 'Không thể thu hồi tin nhắn');
        } finally {
            setIsRecalling(false);
        }
    };

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
                                                alt="Play"
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
                                    key={attachment?.id || `${message.id}-attachment-${index}`}
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

                    {message.isOwn && !isRecalled && (
                        <div className="chat-action-btns ms-3">
                            <div className="chat-action-col">
                                <a href="#" data-bs-toggle="dropdown">
                                    <i className="fa-solid fa-ellipsis"></i>
                                </a>
                                <div className="dropdown-menu chat-drop-menu dropdown-menu-end">
                                    {canRecall() && (
                                        <button
                                            type="button"
                                            className="dropdown-item message-info-left"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleRecallMessage();
                                            }}
                                            style={{
                                                opacity: isRecalling ? 0.5 : 1,
                                                cursor: isRecalling ? 'not-allowed' : 'pointer',
                                            }}
                                            disabled={isRecalling}
                                        >
                                            {isRecalling ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    <span>Đang thu hồi...</span>
                                                </>
                                            ) : (
                                                'Thu hồi tin nhắn'
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="message-content">
                    {isRecalled ? (
                        <div style={{ fontStyle: 'italic', opacity: 0.6, color: '#6c757d' }}>
                            <i className="fa-solid fa-rotate-left me-1"></i>
                            {message.content}
                        </div>
                    ) : (
                        renderMessageContent()
                    )}
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
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                            setSelectedImage(null);
                        }
                    }}
                    role="dialog"
                    aria-modal="true"
                    tabIndex={-1}
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
                                <button
                                    type="button"
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: 0,
                                        cursor: 'default',
                                    }}
                                >
                                    <img
                                        src={selectedImage}
                                        alt="Preview"
                                        className="img-fluid"
                                        style={{ maxHeight: '90vh' }}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Dialog for message recall */}
            <ConfirmDialog
                isOpen={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                onConfirm={confirmRecall}
                title="Thu hồi tin nhắn"
                message="Bạn có chắc chắn muốn thu hồi tin nhắn này? Hành động này không thể hoàn tác."
                confirmText="Thu hồi"
                cancelText="Hủy"
                type="warning"
                icon="fa-solid fa-rotate-left"
            />
        </div>
    );
};

export default MessageItem;
