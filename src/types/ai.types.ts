export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    suggestions?: Suggestion[];
    questionCount?: number; // Number of questions asked so far (0-3)
    disease?: DiseaseConclusion; // Disease conclusion (only when analysisComplete = true)
    analysisComplete?: boolean; // Whether the analysis is complete
}

// Disease conclusion with confidence and reasoning
export interface DiseaseConclusion {
    name: string;
    confidence: number; // 0-1
    reasons: string[];
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
    avatarUrl?: string;
}

export interface Hospital {
    id: string;
    name: string;
    address: string;
    specialtyId: string[];
    specialtyName: string[];
    imageUrl?: string;
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
