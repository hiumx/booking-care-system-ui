import { useState } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

import ChatList from './components/ChatList';
import TagManager from '../TagManager';
import { RootState } from '@/store';
import styles from './ChatSidebar.module.scss';

const ChatSidebar = () => {
    const userProfile = useSelector((state: RootState) => state.user.profile);
    const currentUserId = (userProfile?.accountId || userProfile?.id || '').toUpperCase();

    const [searchTerm, setSearchTerm] = useState('');
    const [showTagPanel, setShowTagPanel] = useState(false);
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

    const handleTagSelect = (tagId: string) => {
        setSelectedTagIds((prev) => {
            if (prev.includes(tagId)) {
                return prev.filter((id) => id !== tagId);
            }
            return [...prev, tagId];
        });
    };

    return (
        <div
            id="chats"
            className={clsx(styles.sidebarContainer, 'left-sidebar-wrap sidebar active slimscroll')}
        >
            <div className={clsx(styles.leftChatTitle, 'left-chat-title all-chats')}>
                <div className="setting-title-head d-flex justify-content-between align-items-start">
                    <h4 style={{ marginBottom: '0.75rem' }}>Tất cả tin nhắn</h4>
                    <button
                        className={clsx(
                            styles.tagPanelBtn,
                            'btn btn-sm d-flex align-items-center gap-2',
                            showTagPanel && styles.active
                        )}
                        onClick={() => setShowTagPanel(!showTagPanel)}
                        title={showTagPanel ? 'Ẩn nhãn' : 'Hiện nhãn'}
                        type="button"
                    >
                        <i className="fa-solid fa-tags"></i>
                        <span className="d-none d-sm-inline">Nhãn</span>
                        {selectedTagIds.length > 0 && (
                            <span className={styles.tagBadge}>{selectedTagIds.length}</span>
                        )}
                    </button>
                </div>
                <div className="add-section">
                    {/* Chat Search */}
                    <form>
                        <div className="user-chat-search">
                            <span className="form-control-feedback">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </span>
                            <input
                                type="text"
                                name="chat-search"
                                placeholder="Tìm kiếm"
                                className="form-control"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </form>
                    {/* /Chat Search */}

                    {/* Active Filter Indicator */}
                    {selectedTagIds.length > 0 && (
                        <div className="d-flex align-items-center justify-content-between mt-2 px-2">
                            <span className="text-muted small">
                                <i className="fa-solid fa-filter me-1"></i>
                                Lọc theo {selectedTagIds.length} nhãn
                            </span>
                            <button
                                className="btn btn-sm btn-ghost-danger"
                                onClick={() => setSelectedTagIds([])}
                                type="button"
                            >
                                <i className="fa-solid fa-xmark"></i> Xóa lọc
                            </button>
                        </div>
                    )}

                    {/* Tag Filter Panel */}
                    {showTagPanel && currentUserId && (
                        <div className={clsx(styles.tagPanel, 'mt-3')}>
                            <TagManager
                                userId={currentUserId}
                                onTagSelect={handleTagSelect}
                                selectedTags={selectedTagIds}
                            />
                        </div>
                    )}
                </div>
            </div>
            {/* /Left Chat Title */}
            <div className={clsx(styles.sidebarScroll, 'slimscroll-active-sidebar')}>
                <div className="sidebar-body chat-body" id="chatsidebar">
                    <ChatList searchTerm={searchTerm} selectedTagIds={selectedTagIds} />
                </div>
            </div>
        </div>
    );
};

export default ChatSidebar;
