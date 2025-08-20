import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

import VideoCallWindow from '../../../VideoCallWindow';
import styles from './ChatHeader.module.scss';
const ChatHeader = () => {
    const [showSearch, setShowSearch] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
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
                        <figure className="avatar avatar-online">
                            <img
                                src="./src/assets/img/doctors-dashboard/profile-06.jpg"
                                alt="image"
                            />
                        </figure>
                        <div className="mt-1">
                            <h5>Dr Edalin Hendry</h5>
                            <small className="last-seen">Đang online</small>
                        </div>
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
                                >
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </button>
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

            {showVideoCall && (
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
                    <VideoCallWindow />
                </div>
            )}
        </>
    );
};

export default ChatHeader;
