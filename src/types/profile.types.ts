// Shared types for profile pages
export interface BaseProfile {
    id: number;
    avatar_url: string;
    bio: string;
    years_of_experience: number;
}

export interface DoctorProfile extends BaseProfile {
    first_name: string;
    last_name: string;
    account_id: number;
    email: string;
    address: string;
    gender: string;
    position_id: number;
    specialty_id: number;
    hospital_id: number;
    created_at: string;
    updated_at: string;
}

export interface ServiceProfile extends BaseProfile {
    name: string;
    account_id: number;
    email: string;
    address: string;
    gender: string;
    position_id: number;
    specialty_id: number;
    hospital_id: number;
    created_at: string;
    updated_at: string;
}

export interface Hospital {
    id: number;
    account_id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    description: string;
    background_url: string;
    avatar_url: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface Specialty {
    id: number;
    name: string;
    image_url: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface Position {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface Price {
    id: number;
    amount: number;
}

export interface DoctorPrice {
    doctor_id: number;
    price_id: number;
    description: string;
}

export interface Appointment {
    id: number;
    patient_id: number;
    doctor_id: number;
    hospital_id: number;
    appointment_time_id: number;
    appointment_date: string;
    price_id: number;
    status: string;
    type: string;
    reason: string;
    result: string;
    created_at: string;
    updated_at: string;
}

export interface Review {
    id: number;
    patient_id: number;
    doctor_id: number;
    appointment_id: number;
    rating: number;
    comment: string;
    recommend: boolean;
    parent_review_id: number | null;
    created_at: string;
    updated_at: string;
    timeAgo: string;
    userId: number;
    user: {
        id: number;
        account_id: number;
        email: string;
        first_name: string;
        last_name: string;
        gender: string;
        address: string;
        phone: string;
        avatar_url: string;
        created_at: string;
        updated_at: string;
    };
    replies?: Array<{
        id: number;
        patient_id: number;
        doctor_id: number;
        appointment_id: number | null;
        rating: number | null;
        comment: string;
        recommend: boolean;
        parent_review_id: number;
        created_at: string;
        updated_at: string;
        userId: number;
        user: {
            id: number;
            account_id: number;
            email: string;
            first_name: string;
            last_name: string;
            gender: string;
            address: string;
            phone: string;
            avatar_url: string;
            created_at: string;
            updated_at: string;
        };
    }>;
}

export type ProfileType = 'doctor' | 'service';
export type ProfileData = DoctorProfile | ServiceProfile;
