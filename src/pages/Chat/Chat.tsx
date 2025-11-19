import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { ChatProvider, useChat } from '@/providers/ChatProvider';
import ChatSidebar from './components/ChatSidebar';
import ChatMessages from './components/ChatMessages';

import styles from './Chat.module.scss';

// Inner component to access ChatProvider context
const ChatContent = () => {
    const location = useLocation();
    const { selectConversation, loadConversations } = useChat();
    const hasAutoSelectedRef = useRef(false);

    // Auto-select conversation if conversationId is passed via navigation state
    useEffect(() => {
        // Only run once to avoid infinite loop
        if (hasAutoSelectedRef.current) return;

        const state = location.state as { conversationId?: string; refetchConversations?: boolean };

        // Refetch conversations if requested (e.g., after creating new conversation)
        if (state?.refetchConversations) {
            console.log('[Chat] Refetching conversations after navigation');
            loadConversations();
        }

        if (state?.conversationId) {
            console.log('[Chat] Auto-selecting conversation:', state.conversationId);
            selectConversation(state.conversationId);
            hasAutoSelectedRef.current = true;
            // Clear the state after using it
            globalThis.history.replaceState({}, document.title);
        }
    }, [location.state, selectConversation, loadConversations]);

    return (
        <div className={clsx(styles.hideScrollbar, 'main-chat-blk')}>
            <div className="main-wrapper">
                <div className={clsx(styles.chatPageWrapper, 'page-wrapper chat-page-wrapper')}>
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
    );
};

const Chat = () => {
    return (
        <MainLayout hasFooter={false}>
            <ChatProvider>
                <ChatContent />
            </ChatProvider>
        </MainLayout>
    );
};

export default Chat;
