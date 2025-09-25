export interface Doctor {
    id: string;
    name: string;
    avatar: string;
    specialty: string;
    experience: number;
    rating: number;
    reviewCount: number;
    location: string;
    consultationFee: number;
    availableToday: boolean;
}

export interface Hospital {
    id: string;
    name: string;
    logo: string;
    address: string;
    rating: number;
    reviewCount: number;
    distance?: string;
    specialties: string[];
    emergency: boolean;
}

export interface Service {
    id: string;
    name: string;
    description: string;
    price: string;
    duration: string;
    category: string;
    availability: string;
}

export type TabType = 'all' | 'doctors' | 'hospitals' | 'services';

export interface SearchResults {
    doctors: Doctor[];
    hospitals: Hospital[];
    services: Service[];
}
