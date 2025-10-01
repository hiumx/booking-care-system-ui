export type AppointmentDetailStatus = 'upcoming' | 'cancelled' | 'completed';

export interface AppointmentDetailData {
    appointmentId: string;
    doctor: {
        name: string;
        image: string;
        email: string;
        phone: string;
    };
    appointmentType: 'video_call' | 'audio_call' | 'chat' | 'direct_visit';
    visitType: string;
    appointmentDate: string;
    appointmentTime: string;
    consultationFees: number;
    clinicLocation?: string;
    location?: string;
    personWithPatient?: string;
    status: AppointmentDetailStatus;
}

export interface AppointmentDetailProps {
    appointment: AppointmentDetailData;
    onStartSession?: () => void;
    onMessage?: () => void;
    onCancel?: () => void;
    onReschedule?: () => void;
    onDownloadPrescription?: () => void;
    onViewReason?: () => void;
}

export interface StatusConfig {
    badge: {
        className: string;
        text: string;
    };
    showContactInfo: boolean;
    showStartSession: boolean;
    showReschedule: boolean;
    showDownloadPrescription: boolean;
    showCancelButton: boolean;
    showReasonLink: boolean;
    bottomSection?: 'start_session' | 'reschedule_status' | 'prescription_reschedule';
}
