import { useState } from 'react';

import OnlineContacts from './OnlineContacts';
import ChatList from './ChatList';

const ChatSidebar = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div id="chats" className="left-sidebar-wrap sidebar active slimscroll">
            <div className="slimscroll-active-sidebar">
                {/* Left Chat Title */}
                <div className="left-chat-title all-chats">
                    <div className="setting-title-head">
                        <h4>Tất cả tin nhắn</h4>
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
                    </div>
                </div>
                {/* /Left Chat Title */}

                {/* Top Online Contacts */}
                <OnlineContacts />

                <div className="sidebar-body chat-body" id="chatsidebar">
                    <ChatList searchTerm={searchTerm} />
                </div>
            </div>
        </div>
    );
};

export default ChatSidebar;
