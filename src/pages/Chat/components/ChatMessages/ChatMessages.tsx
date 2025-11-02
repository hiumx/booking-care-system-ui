import clsx from 'clsx';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import ChatFooter from './components/ChatFooter';
import styles from './ChatMessages.module.scss';

const ChatMessages = () => {
    return (
        <div className="chat chat-messages" id="middle">
            <ChatHeader />
            <div className={clsx(styles.chatMessagesScroll, 'slimscroll chat-messages-scroll')}>
                <div className="chat-body">
                    <MessageList />
                </div>
            </div>
            <ChatFooter setIsTyping={() => {}} />
        </div>
    );
};

export default ChatMessages;
