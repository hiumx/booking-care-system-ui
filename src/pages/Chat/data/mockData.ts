export interface OnlineContact {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
}

export interface ChatContact {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    lastMessageTime: string;
    isOnline: boolean;
    isPinned: boolean;
    unreadCount: number;
    messageType: 'text' | 'video' | 'file' | 'audio' | 'image' | 'location' | 'missed-call';
}

export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    senderAvatar: string;
    content: string;
    timestamp: string;
    messageType: 'text' | 'video' | 'file' | 'audio' | 'image' | 'location' | 'voice';
    isOwn: boolean;
    isRead: boolean;
    attachments?: string[];
}

export const mockOnlineContacts: OnlineContact[] = [
    {
        id: '1',
        name: 'Dr. Adrian Marshall',
        avatar: './src/assets/img/doctors-dashboard/profile-01.jpg',
        isOnline: true,
    },
    {
        id: '2',
        name: 'Dr. Sarah Johnson',
        avatar: './src/assets/img/doctors-dashboard/profile-04.jpg',
        isOnline: true,
    },
    {
        id: '3',
        name: 'Dr. Michael Chen',
        avatar: './src/assets/img/doctors-dashboard/profile-03.jpg',
        isOnline: true,
    },
    {
        id: '4',
        name: 'Dr. Emily Davis',
        avatar: './src/assets/img/doctors-dashboard/profile-08.jpg',
        isOnline: true,
    },
    {
        id: '5',
        name: 'Dr. Robert Wilson',
        avatar: './src/assets/img/doctors-dashboard/profile-06.jpg',
        isOnline: true,
    },
    {
        id: '6',
        name: 'Dr. Lisa Brown',
        avatar: './src/assets/img/doctors-dashboard/profile-07.jpg',
        isOnline: true,
    },
];

export const mockChatContacts: ChatContact[] = [
    // Pinned Chats
    {
        id: '1',
        name: 'Adrian Marshall',
        avatar: './src/assets/img/doctors-dashboard/profile-01.jpg',
        lastMessage: 'Have you called them?',
        lastMessageTime: 'Just Now',
        isOnline: true,
        isPinned: true,
        unreadCount: 0,
        messageType: 'text',
    },
    {
        id: '2',
        name: 'Dr Joseph Boyd',
        avatar: './src/assets/img/doctors-dashboard/doctor-profile-img.jpg',
        lastMessage: 'Video',
        lastMessageTime: 'Yesterday',
        isOnline: false,
        isPinned: true,
        unreadCount: 0,
        messageType: 'video',
    },
    {
        id: '3',
        name: 'Dr Edalin Hendry',
        avatar: './src/assets/img/doctors-dashboard/profile-04.jpg',
        lastMessage: 'Prescription.doc',
        lastMessageTime: '10:20 PM',
        isOnline: true,
        isPinned: true,
        unreadCount: 0,
        messageType: 'file',
    },
    // Recent Chats
    {
        id: '4',
        name: 'Kelly Stevens',
        avatar: './src/assets/img/doctors-dashboard/profile-02.jpg',
        lastMessage: 'Have you called them?',
        lastMessageTime: 'Just Now',
        isOnline: true,
        isPinned: false,
        unreadCount: 2,
        messageType: 'text',
    },
    {
        id: '5',
        name: 'Robert Miller',
        avatar: './src/assets/img/doctors-dashboard/profile-05.jpg',
        lastMessage: 'Video',
        lastMessageTime: 'Yesterday',
        isOnline: true,
        isPinned: false,
        unreadCount: 0,
        messageType: 'video',
    },
    {
        id: '6',
        name: 'Emily Musick',
        avatar: './src/assets/img/doctors-dashboard/profile-08.jpg',
        lastMessage: 'Project Tools.doc',
        lastMessageTime: '10:20 PM',
        isOnline: false,
        isPinned: false,
        unreadCount: 0,
        messageType: 'file',
    },
    {
        id: '7',
        name: 'Samuel James',
        avatar: './src/assets/img/doctors-dashboard/profile-03.jpg',
        lastMessage: 'Audio',
        lastMessageTime: '12:30 PM',
        isOnline: true,
        isPinned: false,
        unreadCount: 0,
        messageType: 'audio',
    },
    {
        id: '8',
        name: 'Dr Shanta Neill',
        avatar: './src/assets/img/doctors-dashboard/profile-02.jpg',
        lastMessage: 'Missed Call',
        lastMessageTime: 'Yesterday',
        isOnline: false,
        isPinned: false,
        unreadCount: 0,
        messageType: 'missed-call',
    },
    {
        id: '9',
        name: 'Peter Anderson',
        avatar: './src/assets/img/doctors-dashboard/profile-07.jpg',
        lastMessage: 'Have you called them?',
        lastMessageTime: '23/03/24',
        isOnline: true,
        isPinned: false,
        unreadCount: 0,
        messageType: 'text',
    },
    {
        id: '10',
        name: 'Catherine Gracey',
        avatar: './src/assets/img/doctors-dashboard/profile-06.jpg',
        lastMessage: 'Photo',
        lastMessageTime: '20/03/24',
        isOnline: false,
        isPinned: false,
        unreadCount: 0,
        messageType: 'image',
    },
];

export const mockChatMessages: ChatMessage[] = [
    {
        id: '1',
        senderId: 'user',
        senderName: 'Andrea Kearns',
        senderAvatar: './src/assets/img/doctors-dashboard/profile-06.jpg',
        content: 'Hello Doctor, could you tell a diet plan that suits for me?',
        timestamp: '8:16 PM',
        messageType: 'text',
        isOwn: true,
        isRead: true,
    },
    {
        id: '2',
        senderId: 'doctor',
        senderName: 'Edalin Hendry',
        senderAvatar: './src/assets/img/doctors-dashboard/doctor-profile-img.jpg',
        content: '',
        timestamp: '9:45 AM',
        messageType: 'voice',
        isOwn: false,
        isRead: true,
    },
    {
        id: '3',
        senderId: 'user',
        senderName: 'Andrea Kearns',
        senderAvatar: './src/assets/img/doctors-dashboard/profile-06.jpg',
        content: 'https://www.youtube.com/watch?v=GCmL3mS0Psk',
        timestamp: '9:47 AM',
        messageType: 'text',
        isOwn: true,
        isRead: true,
        attachments: ['./src/assets/img/sending-img.jpg'],
    },
    {
        id: '4',
        senderId: 'doctor',
        senderName: 'Edalin Hendry',
        senderAvatar: './src/assets/img/doctors-dashboard/doctor-profile-img.jpg',
        content: '',
        timestamp: '9:50 AM',
        messageType: 'image',
        isOwn: false,
        isRead: true,
        attachments: [
            './src/assets/img/media/media-02.jpg',
            './src/assets/img/media/media-03.jpg',
            './src/assets/img/media/media-01.jpg',
        ],
    },
    {
        id: '5',
        senderId: 'user',
        senderName: 'Andrea Kearns',
        senderAvatar: './src/assets/img/doctors-dashboard/profile-06.jpg',
        content: 'My Location',
        timestamp: '8:16 PM',
        messageType: 'location',
        isOwn: true,
        isRead: true,
    },
    {
        id: '6',
        senderId: 'user',
        senderName: 'Andrea Kearns',
        senderAvatar: './src/assets/img/doctors-dashboard/profile-06.jpg',
        content: 'Thank you for your support',
        timestamp: '8:16 PM',
        messageType: 'text',
        isOwn: true,
        isRead: false,
    },
];
