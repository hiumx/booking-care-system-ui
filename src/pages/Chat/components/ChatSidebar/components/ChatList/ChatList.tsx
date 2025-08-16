import { mockChatContacts, ChatContact } from '../../../../data/mockData';
import styles from './ChatList.module.scss';

import clsx from 'clsx';
interface ChatListProps {
    searchTerm: string;
}

const ChatList: React.FC<ChatListProps> = ({ searchTerm }) => {
    const filteredContacts = mockChatContacts.filter(
        (contact: ChatContact) =>
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pinnedContacts = filteredContacts.filter((contact: ChatContact) => contact.isPinned);
    const recentContacts = filteredContacts.filter((contact: ChatContact) => !contact.isPinned);

    const getMessageIcon = (messageType: string) => {
        switch (messageType) {
            case 'video':
                return <i className="isax isax-video5 me-1"></i>;
            case 'file':
                return <i className="fa-solid fa-file-lines me-1"></i>;
            case 'audio':
                return <i className="fa-solid fa-microphone me-1"></i>;
            case 'image':
                return <i className="fa-solid fa-image me-1"></i>;
            case 'location':
                return <i className="fa-solid fa-location-dot me-1"></i>;
            case 'missed-call':
                return <i className="isax isax-call5-flip me-1"></i>;
            default:
                return null;
        }
    };

    const getStatusIcon = (contact: ChatContact) => {
        if (contact.unreadCount > 0) {
            return <div className="new-message-count">{contact.unreadCount}</div>;
        }
        if (contact.isPinned) {
            return <i className="fa-solid fa-thumbtack"></i>;
        }
        return null;
    };

    const renderContactList = (contacts: ChatContact[], title: string) => (
        <>
            <div className="d-flex justify-content-between align-items-center ps-0 pe-0">
                <div className="fav-title pin-chat">
                    <h6>{title}</h6>
                </div>
            </div>
            <ul className={clsx(styles.item, 'user-list')}>
                {contacts.map((contact: ChatContact) => (
                    <li key={contact.id} className="user-list-item">
                        <a href="#">
                            <div className={`avatar ${contact.isOnline ? 'avatar-online' : ''}`}>
                                <img src={contact.avatar} alt={contact.name} />
                            </div>
                            <div className="users-list-body">
                                <div>
                                    <h5>{contact.name}</h5>
                                    <p>
                                        {getMessageIcon(contact.messageType)}
                                        {contact.lastMessage}
                                    </p>
                                </div>
                                <div className="last-chat-time">
                                    <small className="text-muted">{contact.lastMessageTime}</small>
                                    <div className="chat-pin">{getStatusIcon(contact)}</div>
                                </div>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
        </>
    );

    return (
        <>
            {pinnedContacts.length > 0 && renderContactList(pinnedContacts, 'Tin nhắn ghim')}
            {recentContacts.length > 0 && renderContactList(recentContacts, 'Tin nhắn gần đây')}
        </>
    );
};

export default ChatList;
