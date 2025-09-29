export type AppointmentStatus = 'upcoming' | 'cancelled' | 'completed';

export type AppointmentType = 'video_call' | 'audio_call' | 'chat' | 'direct_visit';

export interface DoctorInfo {
    id: string;
    name: string;
    avatar: string;
    email: string;
    phone: string;
    specialty?: string;
}

export interface AppointmentData {
    appointmentId: string;
    doctor: DoctorInfo;
    appointmentDate: string;
    appointmentTime: string;
    appointmentType: AppointmentType;
    visitType: string;
    status: AppointmentStatus;
    isNew?: boolean;
    hasReview?: boolean;
    price?: string;
    notes?: string;
}

export interface FilterOptions {
    appointmentType: AppointmentType[];
    visitType: string[];
    dateRange: {
        from: string;
        to: string;
    };
}
