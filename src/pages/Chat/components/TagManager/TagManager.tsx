import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import { Tag, ConversationTagType } from '@/types/tag.types';
import TagService from '@/services/tag.service';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';
import styles from './TagManager.module.scss';

interface TagManagerProps {
    userId: string;
    conversationId?: string;
    onTagSelect?: (tagId: string) => void;
    selectedTags?: string[];
    showConversationTags?: boolean;
    onTagsUpdated?: () => void;
}

const TAG_COLORS = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E2',
    '#F8B739',
    '#52C41A',
];

const TAG_TYPE_LABELS: Record<ConversationTagType, string> = {
    [ConversationTagType.CUSTOM]: 'Tùy chỉnh',
    [ConversationTagType.SYSTEM]: 'Hệ thống',
    [ConversationTagType.IMPORTANT]: 'Quan trọng',
    [ConversationTagType.WORK]: 'Công việc',
    [ConversationTagType.PERSONAL]: 'Cá nhân',
    [ConversationTagType.SHOPPING]: 'Mua sắm',
    [ConversationTagType.TRAVEL]: 'Du lịch',
    [ConversationTagType.FAMILY]: 'Gia đình',
    [ConversationTagType.VIP]: 'VIP',
    [ConversationTagType.ARCHIVED]: 'Lưu trữ',
};

const TagManager: React.FC<TagManagerProps> = ({
    userId,
    conversationId,
    onTagSelect,
    selectedTags = [],
    showConversationTags = false,
    onTagsUpdated,
}) => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [conversationTags, setConversationTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [deletingTagId, setDeletingTagId] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);
    const [newTagType, setNewTagType] = useState<ConversationTagType>(ConversationTagType.CUSTOM);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const [editTagName, setEditTagName] = useState('');
    const [editTagColor, setEditTagColor] = useState(TAG_COLORS[0]);
    const [editTagType, setEditTagType] = useState<ConversationTagType>(ConversationTagType.CUSTOM);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);

    useEffect(() => {
        loadTags();
    }, [userId]);

    useEffect(() => {
        if (showConversationTags && conversationId) {
            loadConversationTags();
        }
    }, [showConversationTags, conversationId]);

    useEffect(() => {
        if (showCreateModal || showEditModal) {
            document.body.classList.add('modal-open');
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            backdrop.style.zIndex = '1040';
            backdrop.id = 'tag-modal-backdrop';
            document.body.appendChild(backdrop);

            return () => {
                document.body.classList.remove('modal-open');
                const existingBackdrop = document.getElementById('tag-modal-backdrop');
                if (existingBackdrop) {
                    existingBackdrop.remove();
                }
            };
        }
    }, [showCreateModal, showEditModal]);

    const loadTags = async () => {
        try {
            setIsLoading(true);
            const response = await TagService.getUserTags(userId, true);
            if (response.success && response.data) {
                setTags(response.data);
            }
        } catch (error) {
            console.error('Failed to load tags:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadConversationTags = async () => {
        if (!conversationId) return;
        try {
            const response = await TagService.getConversationTags(userId, conversationId);
            if (response.success && response.data) {
                setConversationTags(response.data);
            }
        } catch (error) {
            console.error('Failed to load conversation tags:', error);
        }
    };

    const handleCreateTag = async () => {
        if (!newTagName.trim()) return;

        try {
            const response = await TagService.createTag(userId, {
                name: newTagName.trim(),
                color: newTagColor,
                type: newTagType,
            });

            if (response.success && response.data) {
                setTags([...tags, response.data]);
                setShowCreateModal(false);
                setNewTagName('');
                setNewTagColor(TAG_COLORS[0]);
                setNewTagType(ConversationTagType.CUSTOM);
                onTagsUpdated?.();
                // Dispatch event to notify other components
                globalThis.dispatchEvent(new CustomEvent('conversationTagsUpdated'));
            }
        } catch (error) {
            console.error('Failed to create tag:', error);
        }
    };

    const handleEditTag = (tag: Tag) => {
        setEditingTag(tag);
        setEditTagName(tag.name);
        setEditTagColor(tag.color);
        setEditTagType(tag.type);
        setShowEditModal(true);
    };

    const handleUpdateTag = async () => {
        if (!editingTag || !editTagName.trim()) return;

        try {
            const response = await TagService.updateTag(userId, editingTag.id, {
                name: editTagName.trim(),
                color: editTagColor,
                type: editTagType,
            });

            if (response.success && response.data) {
                // Update the tag in the list
                setTags(tags.map((tag) => (tag.id === editingTag.id ? response.data : tag)));
                // Update conversation tags if it exists there
                setConversationTags(
                    conversationTags.map((tag) => (tag.id === editingTag.id ? response.data : tag))
                );
                setShowEditModal(false);
                setEditingTag(null);
                setEditTagName('');
                setEditTagColor(TAG_COLORS[0]);
                setEditTagType(ConversationTagType.CUSTOM);
                onTagsUpdated?.();
                // Dispatch event to notify other components
                globalThis.dispatchEvent(new CustomEvent('conversationTagsUpdated'));
            }
        } catch (error) {
            console.error('Failed to update tag:', error);
            alert('Không thể cập nhật nhãn. Vui lòng thử lại.');
        }
    };

    const cancelEditTag = () => {
        setShowEditModal(false);
        setEditingTag(null);
        setEditTagName('');
        setEditTagColor(TAG_COLORS[0]);
        setEditTagType(ConversationTagType.CUSTOM);
    };

    const handleDeleteTag = (tagId: string) => {
        const tag = tags.find((t) => t.id === tagId);
        if (!tag) return;

        setTagToDelete(tag);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteTag = async () => {
        if (!tagToDelete) return;

        try {
            setDeletingTagId(tagToDelete.id);
            const response = await TagService.deleteTag(userId, tagToDelete.id);
            if (response.success) {
                setTags(tags.filter((t) => t.id !== tagToDelete.id));
                setConversationTags(conversationTags.filter((t) => t.id !== tagToDelete.id));
                onTagsUpdated?.();
                // Dispatch event to notify other components
                globalThis.dispatchEvent(new CustomEvent('conversationTagsUpdated'));
            }
        } catch (error) {
            console.error('Failed to delete tag:', error);
            alert('Không thể xóa nhãn. Vui lòng thử lại.');
        } finally {
            setDeletingTagId(null);
            setTagToDelete(null);
        }
    };

    const cancelDeleteTag = () => {
        setShowDeleteConfirm(false);
        setTagToDelete(null);
    };

    const handleToggleTag = async (tagId: string) => {
        if (!conversationId) {
            onTagSelect?.(tagId);
            return;
        }

        try {
            const isSelected = conversationTags.some((t) => t.id === tagId);

            if (isSelected) {
                // Remove tag from conversation
                const response = await TagService.removeTagFromConversation(
                    userId,
                    conversationId,
                    tagId
                );
                console.log('[TagManager] Remove tag response:', response);

                if (response.success) {
                    setConversationTags(conversationTags.filter((t) => t.id !== tagId));
                    console.log('[TagManager] Tag removed successfully from UI');
                } else {
                    throw new Error(response.message || 'Failed to remove tag');
                }
            } else {
                // Add tag to conversation
                const response = await TagService.addTagsToConversation(userId, conversationId, [
                    tagId,
                ]);
                console.log('[TagManager] Add tag response:', response);

                if (response.success) {
                    const tag = tags.find((t) => t.id === tagId);
                    if (tag) {
                        setConversationTags([...conversationTags, tag]);
                        console.log('[TagManager] Tag added successfully to UI');
                    }
                } else {
                    throw new Error(response.message || 'Failed to add tag');
                }
            }

            // Notify parent component to refresh tags
            onTagsUpdated?.();
            // Dispatch event to notify other components
            globalThis.dispatchEvent(new CustomEvent('conversationTagsUpdated'));
        } catch (error) {
            console.error('[TagManager] Failed to toggle tag:', error);
            alert(
                `Không thể ${conversationTags.some((t) => t.id === tagId) ? 'xóa' : 'thêm'} nhãn. Vui lòng thử lại.`
            );
        }
    };

    const isTagSelected = (tagId: string) => {
        if (showConversationTags) {
            return conversationTags.some((t) => t.id === tagId);
        }
        return selectedTags.includes(tagId);
    };

    const getDeleteMessage = (): string => {
        if (!tagToDelete) return '';
        if (tagToDelete.conversationCount > 0) {
            return `Bạn có chắc muốn xóa nhãn "${tagToDelete.name}"? Nhãn này đang được sử dụng trong ${tagToDelete.conversationCount} hội thoại.`;
        }
        return `Bạn có chắc muốn xóa nhãn "${tagToDelete.name}"?`;
    };

    return (
        <div className={styles.tagManager}>
            <div className={styles.header}>
                <h6 className={styles.title}>
                    <i className="fa-solid fa-tags me-2"></i>
                    {' Quản lý nhãn'}
                </h6>
                <button
                    className={clsx(styles.createBtn, 'btn btn-sm')}
                    onClick={() => setShowCreateModal(true)}
                    type="button"
                    title="Tạo nhãn mới"
                >
                    <i className="fa-solid fa-plus"></i>
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-3">
                    <div className="spinner-border spinner-border-sm" aria-label="Đang tải">
                        <output className="visually-hidden">Đang tải...</output>
                    </div>
                </div>
            ) : (
                <div className={styles.tagList}>
                    {tags.length === 0 ? (
                        <p className="text-muted text-center py-3">Chưa có nhãn nào</p>
                    ) : (
                        tags.map((tag) => (
                            <div
                                key={tag.id}
                                role="button"
                                tabIndex={0}
                                aria-label={`Toggle tag ${tag.name}`}
                                className={clsx(
                                    styles.tagItem,
                                    isTagSelected(tag.id) && styles.selected
                                )}
                                onClick={() => handleToggleTag(tag.id)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleToggleTag(tag.id);
                                    }
                                }}
                                style={{
                                    paddingRight:
                                        tag.type === ConversationTagType.CUSTOM ||
                                        tag.type === ConversationTagType.SYSTEM ||
                                        typeof tag.type === 'string'
                                            ? '5rem'
                                            : '0.75rem',
                                }}
                            >
                                <span
                                    className={styles.tagBadge}
                                    style={{ backgroundColor: tag.color }}
                                >
                                    {tag.icon && <span className="me-1">{tag.icon}</span>}
                                    {tag.name}
                                </span>
                                {/* Action buttons for CUSTOM and SYSTEM tags (user-created) */}
                                {(tag.type === ConversationTagType.CUSTOM ||
                                    tag.type === ConversationTagType.SYSTEM ||
                                    typeof tag.type === 'string') && (
                                    <div className={styles.actionButtons}>
                                        {/* Edit button */}
                                        <button
                                            className={styles.editBtn}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditTag(tag);
                                            }}
                                            type="button"
                                            title="Chỉnh sửa nhãn"
                                            aria-label="Chỉnh sửa nhãn"
                                        >
                                            <i className="fa-solid fa-pen"></i>
                                        </button>

                                        {/* Delete button */}
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTag(tag.id);
                                            }}
                                            type="button"
                                            title="Xóa nhãn"
                                            disabled={deletingTagId === tag.id}
                                            aria-label="Xóa nhãn"
                                        >
                                            {deletingTagId === tag.id ? (
                                                <output
                                                    className="spinner-border spinner-border-sm"
                                                    style={{ width: '0.7rem', height: '0.7rem' }}
                                                    aria-label="Đang xóa"
                                                />
                                            ) : (
                                                <i className="fa-solid fa-trash-can"></i>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {showCreateModal &&
                ReactDOM.createPortal(
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="create-tag-modal-title"
                        className="modal fade show d-block"
                        tabIndex={-1}
                        style={{ zIndex: 1050 }}
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="create-tag-modal-title">
                                        Tạo nhãn mới
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowCreateModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="create-tag-name" className="form-label">
                                            Tên nhãn
                                        </label>
                                        <input
                                            id="create-tag-name"
                                            type="text"
                                            className="form-control"
                                            value={newTagName}
                                            onChange={(e) => setNewTagName(e.target.value)}
                                            placeholder="Nhập tên nhãn..."
                                            autoFocus
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" id="create-tag-color-label">
                                            Màu sắc
                                        </label>
                                        <div
                                            role="group"
                                            aria-labelledby="create-tag-color-label"
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(5, 1fr)',
                                                gap: '12px',
                                                marginTop: '12px',
                                                padding: '4px 0',
                                            }}
                                        >
                                            {TAG_COLORS.map((color, index) => (
                                                <div
                                                    key={color}
                                                    role="button"
                                                    tabIndex={0}
                                                    aria-label={`Select color ${color}`}
                                                    onClick={() => setNewTagColor(color)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            setNewTagColor(color);
                                                        }
                                                    }}
                                                    style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        background: `linear-gradient(135deg, ${color}e6, ${color})`,
                                                        borderRadius: '50%',
                                                        cursor: 'pointer',
                                                        position: 'relative',
                                                        border:
                                                            newTagColor === color
                                                                ? '3px solid #667eea'
                                                                : '2px solid #e2e8f0',
                                                        boxShadow:
                                                            newTagColor === color
                                                                ? '0 0 0 2px rgba(102, 126, 234, 0.3), 0 4px 12px rgba(102, 126, 234, 0.2)'
                                                                : '0 2px 8px rgba(0,0,0,0.1)',
                                                        transition:
                                                            'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        transform:
                                                            newTagColor === color
                                                                ? 'scale(1.1)'
                                                                : 'scale(1)',
                                                        animationDelay: `${index * 50}ms`,
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (newTagColor !== color) {
                                                            e.currentTarget.style.transform =
                                                                'scale(1.15)';
                                                            e.currentTarget.style.boxShadow =
                                                                '0 4px 16px rgba(0,0,0,0.15)';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (newTagColor !== color) {
                                                            e.currentTarget.style.transform =
                                                                'scale(1)';
                                                            e.currentTarget.style.boxShadow =
                                                                '0 2px 8px rgba(0,0,0,0.1)';
                                                        }
                                                    }}
                                                >
                                                    {newTagColor === color && (
                                                        <div
                                                            style={{
                                                                position: 'absolute',
                                                                top: '50%',
                                                                left: '50%',
                                                                transform: 'translate(-50%, -50%)',
                                                                width: '20px',
                                                                height: '20px',
                                                                backgroundColor:
                                                                    'rgba(255,255,255,0.95)',
                                                                borderRadius: '50%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                boxShadow:
                                                                    '0 2px 8px rgba(0,0,0,0.2)',
                                                                animation: 'pulse 2s infinite',
                                                            }}
                                                        >
                                                            <i
                                                                className="fa-solid fa-check"
                                                                style={{
                                                                    color: '#667eea',
                                                                    fontSize: '12px',
                                                                }}
                                                            ></i>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <style>{`
                                            @keyframes pulse {
                                                0%, 100% { transform: translate(-50%, -50%) scale(1); }
                                                50% { transform: translate(-50%, -50%) scale(1.1); }
                                            }
                                        `}</style>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="create-tag-type" className="form-label">
                                            Loại nhãn
                                        </label>
                                        <select
                                            id="create-tag-type"
                                            className="form-select"
                                            value={newTagType}
                                            onChange={(e) => setNewTagType(Number(e.target.value))}
                                        >
                                            {Object.entries(TAG_TYPE_LABELS).map(
                                                ([value, label]) => (
                                                    <option key={value} value={value}>
                                                        {label}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowCreateModal(false)}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleCreateTag}
                                        disabled={!newTagName.trim()}
                                    >
                                        Tạo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}

            {/* Edit Tag Modal */}
            {showEditModal &&
                ReactDOM.createPortal(
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-tag-modal-title"
                        className="modal fade show d-block"
                        tabIndex={-1}
                        style={{ zIndex: 1050 }}
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Chỉnh sửa nhãn</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={cancelEditTag}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="edit-tag-name" className="form-label">
                                            Tên nhãn
                                        </label>
                                        <input
                                            id="edit-tag-name"
                                            type="text"
                                            className="form-control"
                                            value={editTagName}
                                            onChange={(e) => setEditTagName(e.target.value)}
                                            placeholder="Nhập tên nhãn..."
                                            autoFocus
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" id="edit-tag-color-label">
                                            Màu sắc
                                        </label>
                                        <div
                                            role="group"
                                            aria-labelledby="edit-tag-color-label"
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(5, 1fr)',
                                                gap: '12px',
                                                marginTop: '12px',
                                                padding: '4px 0',
                                            }}
                                        >
                                            {TAG_COLORS.map((color, index) => (
                                                <div
                                                    key={color}
                                                    role="button"
                                                    tabIndex={0}
                                                    aria-label={`Select color ${color}`}
                                                    onClick={() => setEditTagColor(color)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            setEditTagColor(color);
                                                        }
                                                    }}
                                                    style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        background: `linear-gradient(135deg, ${color}e6, ${color})`,
                                                        borderRadius: '50%',
                                                        cursor: 'pointer',
                                                        position: 'relative',
                                                        border:
                                                            editTagColor === color
                                                                ? '3px solid #667eea'
                                                                : '2px solid #e2e8f0',
                                                        boxShadow:
                                                            editTagColor === color
                                                                ? '0 0 0 2px rgba(102, 126, 234, 0.3), 0 4px 12px rgba(102, 126, 234, 0.2)'
                                                                : '0 2px 8px rgba(0,0,0,0.1)',
                                                        transition:
                                                            'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        transform:
                                                            editTagColor === color
                                                                ? 'scale(1.1)'
                                                                : 'scale(1)',
                                                        animationDelay: `${index * 50}ms`,
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (editTagColor !== color) {
                                                            e.currentTarget.style.transform =
                                                                'scale(1.15)';
                                                            e.currentTarget.style.boxShadow =
                                                                '0 4px 16px rgba(0,0,0,0.15)';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (editTagColor !== color) {
                                                            e.currentTarget.style.transform =
                                                                'scale(1)';
                                                            e.currentTarget.style.boxShadow =
                                                                '0 2px 8px rgba(0,0,0,0.1)';
                                                        }
                                                    }}
                                                >
                                                    {editTagColor === color && (
                                                        <div
                                                            style={{
                                                                position: 'absolute',
                                                                top: '50%',
                                                                left: '50%',
                                                                transform: 'translate(-50%, -50%)',
                                                                width: '20px',
                                                                height: '20px',
                                                                backgroundColor:
                                                                    'rgba(255,255,255,0.95)',
                                                                borderRadius: '50%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                boxShadow:
                                                                    '0 2px 8px rgba(0,0,0,0.2)',
                                                                animation: 'pulse 2s infinite',
                                                            }}
                                                        >
                                                            <i
                                                                className="fa-solid fa-check"
                                                                style={{
                                                                    color: '#667eea',
                                                                    fontSize: '12px',
                                                                }}
                                                            ></i>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="edit-tag-type" className="form-label">
                                            Loại nhãn
                                        </label>
                                        <select
                                            id="edit-tag-type"
                                            className="form-select"
                                            value={editTagType}
                                            onChange={(e) => setEditTagType(Number(e.target.value))}
                                        >
                                            {Object.entries(TAG_TYPE_LABELS).map(
                                                ([value, label]) => (
                                                    <option key={value} value={value}>
                                                        {label}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={cancelEditTag}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleUpdateTag}
                                        disabled={!editTagName.trim()}
                                    >
                                        Cập nhật
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={cancelDeleteTag}
                onConfirm={confirmDeleteTag}
                title="Xóa nhãn"
                message={getDeleteMessage()}
                confirmText="Xóa"
                cancelText="Hủy"
                type="danger"
                icon="fa-solid fa-trash-can"
            />
        </div>
    );
};

export default TagManager;
