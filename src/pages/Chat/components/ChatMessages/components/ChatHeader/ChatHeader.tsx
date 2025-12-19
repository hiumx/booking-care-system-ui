import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useChat } from '@/providers/ChatProvider';
import { RootState } from '@/store';
import VideoCallWindow from '../../../VideoCallWindow';
import TagManager from '../../../TagManager';
import styles from './ChatHeader.module.scss';
import userDefault from '@/assets/img/patients/patient.jpg';

const ChatHeader = () => {
    const { t } = useTranslation('chat');
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
        globalThis.addEventListener('closeVideoCall', handleCloseVideoCall);
        return () => {
            globalThis.removeEventListener('closeVideoCall', handleCloseVideoCall);
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
                                        src={otherParticipant.avatarUrl || userDefault}
                                        alt="avatar"
                                    />
                                </figure>
                                <div className="mt-1">
                                    <h5>{otherParticipant.fullName}</h5>
                                    <small className="last-seen">
                                        {isOnline ? t('header.online') : t('header.offline')}
                                    </small>
                                </div>
                            </>
                        ) : (
                            <div className="mt-1">
                                <h5>{t('header.selectConversation')}</h5>
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
                                    title={t('header.search')}
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
                                        title={t('header.manageTags')}
                                        onClick={() => setShowTagManager(!showTagManager)}
                                        disabled={!activeConversation}
                                    >
                                        <i className="fa-solid fa-tag"></i>
                                    </button>
                                    {showTagManager && activeConversation && (
                                        <div
                                            role="menu"
                                            aria-label="Tag Manager Menu"
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
                                        >
                                            <TagManager
                                                userId={currentUserId}
                                                conversationId={activeConversation.id}
                                                onTagsUpdated={() => {
                                                    console.log(
                                                        '[ChatHeader] Tags updated, dispatching event'
                                                    );
                                                    globalThis.dispatchEvent(
                                                        new Event('conversationTagsUpdated')
                                                    );
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
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
                                                {t('header.menu.videoCall')}
                                            </a>
                                            <a href="#" className="dropdown-item">
                                                {t('header.menu.muteNotifications')}
                                            </a>
                                            <a href="#" className="dropdown-item">
                                                {t('header.menu.disappearingMessages')}
                                            </a>
                                            <a href="#" className="dropdown-item">
                                                {t('header.menu.deleteMessages')}
                                            </a>
                                            <a href="#" className="dropdown-item">
                                                {t('header.menu.deleteChat')}
                                            </a>
                                            <a href="#" className="dropdown-item">
                                                {t('header.menu.report')}
                                            </a>
                                            <a href="#" className="dropdown-item">
                                                {t('header.menu.block')}
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
                                    placeholder={t('header.searchMessages')}
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
