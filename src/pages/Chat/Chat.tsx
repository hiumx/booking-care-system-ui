import clsx from 'clsx';
import MainLayout from '@/layouts/MainLayout';
import { ChatProvider } from '@/providers/ChatProvider';
import ChatSidebar from './components/ChatSidebar';
import ChatMessages from './components/ChatMessages';

import styles from './Chat.module.scss';

const Chat = () => {
    return (
        <MainLayout hasFooter={false}>
            <ChatProvider>
                <div className={clsx(styles.hideScrollbar, 'main-chat-blk')}>
                    <div className="main-wrapper">
                        <div
                            className={clsx(
                                styles.chatPageWrapper,
                                'page-wrapper chat-page-wrapper'
                            )}
                        >
                            <div className="container">
                                <div className={clsx(styles.content, 'content doctor-content')}>
                                    <div className="chat-sec">
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
            </ChatProvider>
        </MainLayout>
    );
};

export default Chat;
