export type AppointmentStatus = 'upcoming' | 'cancelled' | 'completed';

export interface Appointment {
    id: string;
    appointmentNumber: string;
    doctorName: string;
    doctorImage: string;
    dateTime: string;
    visitType: string;
    callType: string;
    email: string;
    phone: string;
    status: AppointmentStatus;
    // Additional fields for appointment detail
    consultationFees?: number;
    clinicLocation?: string;
    location?: string;
    appointmentType?: string;
    cancelReason?: string;
}

export interface FilterState {
    appointmentTypeFilters: {
        allType: boolean;
        videoCall: boolean;
        audioCall: boolean;
        chat: boolean;
        directVisit: boolean;
    };
    visitTypeFilters: {
        allVisit: boolean;
        general: boolean;
        consultation: boolean;
        followUp: boolean;
        directVisit: boolean;
    };
    filterSearchTerm: string;
}
