export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    suggestions?: Suggestion[];
}

export interface Doctor {
    id: string;
    name: string;
    specialtyName: string;
    hospitalName: string;
    rating: number;
    yearOfExperience: number;
    serviceTypeName?: string;
    price?: string;
}

export interface Hospital {
    id: string;
    name: string;
    address: string;
    specialtyId: string[];
    specialtyName: string[];
}

export interface Suggestion {
    type: 'doctor' | 'hospital';
    doctor?: Doctor;
    hospital?: Hospital;
}

export interface ChatHistory {
    id: string;
    title: string;
    lastMessage: string;
    lastMessageTime: string;
    avatar: string;
}
