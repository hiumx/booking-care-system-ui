import { useState } from 'react';
import clsx from 'clsx';

import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import ChatFooter from './components/ChatFooter';
import styles from './ChatMessages.module.scss';
const ChatMessages = () => {
    const [isTyping, setIsTyping] = useState(false);

    return (
        <div className="chat chat-messages" id="middle">
            <ChatHeader />
            <div className={clsx(styles.chatMessagesScroll, 'slimscroll chat-messages-scroll')}>
                <div className="chat-body">
                    <MessageList />
                    {isTyping && (
                        <div className="chats chats-right">
                            <div className="chat-avatar text-end justify-content-end">
                                <img
                                    src="./src/assets/img/doctors-dashboard/profile-06.jpg"
                                    className="dreams_chat"
                                    alt="image"
                                />
                            </div>
                            <div className="chat-content chat-cont-type">
                                <div className="chat-profile-name chat-type-wrapper">
                                    <p>Andrea Kearns đang nhập...</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <ChatFooter setIsTyping={setIsTyping} />
        </div>
    );
};

export default ChatMessages;
