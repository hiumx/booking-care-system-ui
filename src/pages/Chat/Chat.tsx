import MainLayout from '../../layouts/MainLayout';
import ChatSidebar from './ChatSidebar';

import ChatMessages from './ChatMessages';
import './swiper.css';

const Chat = () => {
    return (
        <MainLayout>
            <div className="main-chat-blk">
                <div className="main-wrapper">
                    <div className="page-wrapper chat-page-wrapper">
                        <div className="container">
                            <div className="content doctor-content">
                                <div className="chat-sec">
                                    {/* Sidebar group */}
                                    <div className="sidebar-group left-sidebar chat_sidebar">
                                        <ChatSidebar />
                                    </div>

                                    {/* Chat Messages */}
                                    <ChatMessages />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Chat;
