import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { useChat } from '@/providers/ChatProvider';
import { RootState } from '@/store';
import VideoCallWindow from '../../../VideoCallWindow';
import TagManager from '../../../TagManager';
import styles from './ChatHeader.module.scss';

const ChatHeader = () => {
    const { activeConversation, onlineUsers } = useChat();
    const userProfile = useSelector((state: RootState) => state.user.profile);
    // Backend uses uppercase accountId, normalize for comparison
    const currentUserId = (userProfile?.accountId || userProfile?.id || '').toUpperCase();
    const [showSearch, setShowSearch] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showTagManager, setShowTagManager] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const tagDropdownRef = useRef<HTMLDivElement>(null);

    // Get other participant info - support both id and accountId fields
    const otherParticipant = activeConversation?.participantDetails?.find(
        (p) => (p.id || p.accountId || '').toUpperCase() !== currentUserId
    );
    // Check online status - normalize to UPPERCASE to match backend normalization
    const isOnline = otherParticipant
        ? onlineUsers.has((otherParticipant.id || otherParticipant.accountId || '').toUpperCase())
        : false;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;

            if (dropdownRef.current && !dropdownRef.current.contains(target)) {
                setShowDropdown(false);
            }

            if (tagDropdownRef.current && !tagDropdownRef.current.contains(target)) {
                // Additional check: don't close if clicking on modal backdrop or modal content
                const isModalClick = (target as Element)?.closest('.modal');

                if (!isModalClick) {
                    setShowTagManager(false);
                }
            }
        }

        if (showDropdown || showTagManager) {
            // Use setTimeout to avoid immediate closing when button is clicked
            const timeoutId = setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
            }, 100);

            return () => {
                clearTimeout(timeoutId);
                document.removeEventListener('mousedown', handleClickOutside);
            };
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown, showTagManager]);

    const [showVideoCall, setShowVideoCall] = useState(false);

    useEffect(() => {
        function handleCloseVideoCall() {
            setShowVideoCall(false);
        }
        window.addEventListener('closeVideoCall', handleCloseVideoCall);
        return () => {
            window.removeEventListener('closeVideoCall', handleCloseVideoCall);
        };
    }, []);

    return (
        <>
            <div className="chat-inner-header">
                <div className="chat-header">
                    <div className="user-details">
                        <div className="d-lg-none">
                            <ul className="list-inline mt-2 me-2">
                                <li className="list-inline-item">
                                    <a
                                        className="text-muted px-0 left_sides"
                                        href="#"
                                        data-chat="open"
                                    >
                                        <i className="fas fa-arrow-left"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        {activeConversation && otherParticipant ? (
                            <>
                                <figure className={`avatar ${isOnline ? 'avatar-online' : ''}`}>
                                    <img
                                        src={otherParticipant.avatarUrl || '/default-avatar.png'}
                                        alt="avatar"
                                    />
                                </figure>
                                <div className="mt-1">
                                    <h5>{otherParticipant.fullName}</h5>
                                    <small className="last-seen">
                                        {isOnline ? 'Đang online' : 'Offline'}
                                    </small>
                                </div>
                            </>
                        ) : (
                            <div className="mt-1">
                                <h5>Chọn hội thoại</h5>
                            </div>
                        )}
                    </div>
                    <div className="chat-options">
                        <ul className="list-inline">
                            <li className="list-inline-item">
                                <button
                                    className={clsx(
                                        styles.chatSearchBtn,
                                        'btn btn-outline-light chat-search-btn'
                                    )}
                                    onClick={() => setShowSearch(!showSearch)}
                                    title="Tìm kiếm"
                                    disabled={!activeConversation}
                                >
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </button>
                            </li>
                            <li className="list-inline-item">
                                <div className="dropdown" ref={tagDropdownRef}>
                                    <button
                                        className={clsx(
                                            styles.chatSearchBtn,
                                            'btn btn-outline-light'
                                        )}
                                        title="Quản lý nhãn"
                                        onClick={() => setShowTagManager(!showTagManager)}
                                        disabled={!activeConversation}
                                    >
                                        <i className="fa-solid fa-tag"></i>
                                    </button>
                                    {showTagManager && activeConversation && (
                                        <div
                                            className={clsx(
                                                styles.tagDropdown,
                                                'dropdown-menu dropdown-menu-end show'
                                            )}
                                            style={{
                                                display: 'block',
                                                position: 'absolute',
                                                top: '3.5rem',
                                                right: 0,
                                                minWidth: '400px',
                                            }}
                                            onMouseDown={(e) => {
                                                // Prevent event from bubbling up to handleClickOutside
                                                e.stopPropagation();
                                            }}
                                            onClick={(e) => {
                                                // Prevent event from bubbling up
                                                e.stopPropagation();
                                            }}
                                        >
                                            <TagManager
                                                userId={currentUserId}
                                                conversationId={activeConversation.id}
                                                onTagsUpdated={() => {
                                                    console.log(
                                                        '[ChatHeader] Tags updated, dispatching event'
                                                    );
                                                    window.dispatchEvent(
                                                        new Event('conversationTagsUpdated')
                                                    );
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </li>
                            <li className="list-inline-item">
                                <button
                                    className={clsx(styles.chatSearchBtn, 'btn btn-outline-light')}
                                    title="Gọi Video"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowVideoCall(true);
                                        setShowDropdown(false);
                                    }}
                                    disabled={!activeConversation}
                                >
                                    <i className="fa-solid fa-phone"></i>
                                </button>
                            </li>
                            <li className="list-inline-item">
                                <div className="dropdown" ref={dropdownRef}>
                                    <button
                                        className={clsx(
                                            styles.btnMenu,
                                            'btn btn-outline-light no-bg'
                                        )}
                                        onClick={() => setShowDropdown((prev) => !prev)}
                                        disabled={!activeConversation}
                                    >
                                        <i className="fa-solid fa-ellipsis-vertical"></i>
                                    </button>
                                    {showDropdown && (
                                        <div
                                            className={clsx(
                                                styles.dropdownMenu,
                                                'dropdown-menu dropdown-menu-end show'
                                            )}
                                            style={{ display: 'block' }}
                                        >
                                            <a
                                                href="#"
                                                className="dropdown-item"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setShowVideoCall(true);
                                                    setShowDropdown(false);
                                                }}
                                            >
                                                Gọi video
                                            </a>
                                            <a href="#" className="dropdown-item">
                                                Tắt thông báo
                                            </a>
                                            <a href="#" className="dropdown-item">
                                                Tin nhắn biến mất
                                            </a>
                                            <a href="#" className="dropdown-item">
                                                Xóa tin nhắn
                                            </a>
                                            <a href="#" className="dropdown-item">
                                                Xóa chat
                                            </a>
                                            <a href="#" className="dropdown-item">
                                                Báo cáo
                                            </a>
                                            <a href="#" className="dropdown-item">
                                                Chặn
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </li>
                        </ul>
                    </div>
                    {/* Chat Search */}
                    {showSearch && (
                        <div className={clsx(styles.chatSearch, 'chat-search', 'visible-chat')}>
                            <form>
                                <span className="form-control-feedback">
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </span>
                                <input
                                    type="text"
                                    name="chat-search"
                                    placeholder="Tìm kiếm tin nhắn"
                                    className="form-control"
                                />
                                <div
                                    className="close-btn-chat"
                                    onClick={() => setShowSearch(false)}
                                >
                                    <i className="fa fa-close"></i>
                                </div>
                            </form>
                        </div>
                    )}
                    {/* /Chat Search */}
                </div>
            </div>

            {showVideoCall && activeConversation && otherParticipant && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        zIndex: 9999,
                    }}
                >
                    <VideoCallWindow
                        isVisible={showVideoCall}
                        onClose={() => setShowVideoCall(false)}
                        participantId={otherParticipant.id || otherParticipant.accountId || ''}
                        conversationId={activeConversation.id}
                        participantName={otherParticipant.fullName || 'User'}
                        participantAvatar={otherParticipant.avatarUrl}
                        callType="video"
                        isIncoming={false}
                    />
                </div>
            )}
        </>
    );
};

export default ChatHeader;
