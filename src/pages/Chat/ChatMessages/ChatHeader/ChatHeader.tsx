import { useState } from 'react';

const ChatHeader = () => {
    const [showSearch, setShowSearch] = useState(false);

    return (
        <div className="chat-inner-header">
            <div className="chat-header">
                <div className="user-details">
                    <div className="d-lg-none">
                        <ul className="list-inline mt-2 me-2">
                            <li className="list-inline-item">
                                <a className="text-muted px-0 left_sides" href="#" data-chat="open">
                                    <i className="fas fa-arrow-left"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <figure className="avatar avatar-online">
                        <img src="./src/assets/img/doctors-dashboard/profile-06.jpg" alt="image" />
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
                                className="btn btn-outline-light chat-search-btn"
                                onClick={() => setShowSearch(!showSearch)}
                                title="Tìm kiếm"
                            >
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </button>
                        </li>
                        <li className="list-inline-item">
                            <div className="dropdown">
                                <button
                                    className="btn btn-outline-light no-bg"
                                    data-bs-toggle="dropdown"
                                >
                                    <i className="fa-solid fa-ellipsis-vertical"></i>
                                </button>
                                <div className="dropdown-menu dropdown-menu-end">
                                    <a href="#" className="dropdown-item">
                                        Đóng chat
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
                            </div>
                        </li>
                    </ul>
                </div>
                {/* Chat Search */}
                {showSearch && (
                    <div className="chat-search">
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
                            <div className="close-btn-chat" onClick={() => setShowSearch(false)}>
                                <i className="fa fa-close"></i>
                            </div>
                        </form>
                    </div>
                )}
                {/* /Chat Search */}
            </div>
        </div>
    );
};

export default ChatHeader;
