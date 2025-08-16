import { mockChatMessages, ChatMessage } from '../../../../data/mockData';

import MessageItem from './MessageItem';

const MessageList = () => {
    return (
        <div className="messages">
            {mockChatMessages.map((message: ChatMessage) => (
                <MessageItem key={message.id} message={message} />
            ))}
        </div>
    );
};

export default MessageList;
