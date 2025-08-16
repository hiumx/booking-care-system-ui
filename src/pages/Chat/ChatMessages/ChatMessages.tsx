import { useState } from 'react';

import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatFooter from './ChatFooter';

const ChatMessages = () => {
    const [isTyping, setIsTyping] = useState(false);

    return (
        <div className="chat chat-messages" id="middle">
            <div className="slimscroll">
                <ChatHeader />
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
