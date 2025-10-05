// ============================================
// API Types (matching backend exactly)
// ============================================

import { AppointmentStatus, AppointmentType } from '@/enums/appointment.enums';

// Patient Information from API
export interface PatientInfo {
    id: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    gender?: string;
}

// Doctor Information from API
export interface DoctorInfo {
    id: string;
    accountId: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    gender?: string;
    address?: string;
    specialtyId?: string;
    positionId?: string;
    hospitalId?: string;
    bio?: string;
    yearsOfExperience: number;
    avatarUrl?: string;
    status?: string;
}

// Service Information from API
export interface ServiceInfo {
    id: string;
    name?: string;
    description?: string;
    price?: number;
    category?: string;
}

// Hospital Information from API
export interface HospitalInfo {
    id: string;
    name?: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
}

// Appointment Response from API
export interface AppointmentResponse {
    id: string;
    appointmentDate: string;
    appointmentTimeId: string;
    appointmentType: AppointmentType;
    status: AppointmentStatus;
    reason?: string;
    result?: string;
    createdAt: string;
    updatedAt: string;
    patientInfo?: PatientInfo;
    doctorInfo?: DoctorInfo;
    serviceInfo?: ServiceInfo;
    hospitalInfo?: HospitalInfo;
}

// Appointment List Response with Pagination
export interface AppointmentListResponse {
    appointments: AppointmentResponse[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

// Appointment Query Request (for filtering and pagination)
export interface AppointmentQueryRequest {
    patientId?: string;
    doctorId?: string;
    hospitalId?: string;
    serviceId?: string;
    appointmentType?: AppointmentType;
    status?: AppointmentStatus;
    fromDate?: string;
    toDate?: string;
    searchTerm?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortDescending?: boolean;
}

// Create Appointment Request
export interface CreateAppointmentRequest {
    patientId: string;
    doctorId?: string;
    serviceId?: string;
    appointmentDate: string;
    appointmentTimeId: string;
    hospitalId?: string;
    appointmentType: AppointmentType;
    reason?: string;
}

// Update Appointment Status Request
export interface UpdateAppointmentStatusRequest {
    id: string;
    status: AppointmentStatus;
    result?: string;
}

// ============================================
// UI Display Types (for components)
// ============================================

// UI Tab Status (for filtering in UI)
export type AppointmentUITab = 'upcoming' | 'cancelled' | 'completed';

// Simplified Doctor Info for UI Cards
export interface AppointmentDoctorUI {
    id: string;
    name: string;
    avatar: string;
    email: string;
    phone: string;
    specialty?: string;
}

// Appointment Card Data (optimized for UI display)
export interface AppointmentCardData {
    appointmentId: string;
    doctor: AppointmentDoctorUI;
    appointmentDate: string;
    appointmentTime: string;
    appointmentType: AppointmentType;
    visitType: string;
    status: AppointmentStatus;
    price?: string;
    notes?: string;
    isNew?: boolean;
    hasReview?: boolean;
}

// Appointment Detail Data (for detail page)
export interface AppointmentDetailData {
    appointmentId: string;
    doctor: {
        name: string;
        image: string;
        email: string;
        phone: string;
    };
    appointmentType: AppointmentType;
    visitType: string;
    appointmentDate: string;
    appointmentTime: string;
    consultationFees: number;
    clinicLocation?: string;
    location?: string;
    personWithPatient?: string;
    status: AppointmentStatus;
}

// Props for AppointmentDetail component
export interface AppointmentDetailProps {
    appointment: AppointmentDetailData;
    onStartSession?: () => void;
    onMessage?: () => void;
    onCancel?: () => void;
    onReschedule?: () => void;
    onDownloadPrescription?: () => void;
    onViewReason?: () => void;
}

// Status Config for UI
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

// Filter Options for UI
export interface AppointmentFilterOptions {
    appointmentType: AppointmentType[];
    visitType: string[];
    dateRange: {
        from: string;
        to: string;
    };
}

// ============================================
// Helper Functions
// ============================================

/**
 * Get Vietnamese text for appointment status
 */
export const getAppointmentStatusText = (status: AppointmentStatus): string => {
    switch (status) {
        case AppointmentStatus.PENDING:
            return 'Chờ xác nhận';
        case AppointmentStatus.CONFIRMED:
            return 'Đã xác nhận';
        case AppointmentStatus.CANCELLED:
            return 'Đã hủy';
        case AppointmentStatus.COMPLETED:
            return 'Hoàn thành';
        case AppointmentStatus.NO_SHOW:
            return 'Không đến';
        default:
            return 'Không xác định';
    }
};

/**
 * Get Vietnamese text for appointment type
 */
export const getAppointmentTypeText = (type: AppointmentType): string => {
    switch (type) {
        case AppointmentType.VIDEO_CALL:
            return 'Video Call';
        case AppointmentType.AUDIO_CALL:
            return 'Audio Call';
        case AppointmentType.CHAT:
            return 'Chat';
        case AppointmentType.IN_PERSON:
            return 'Trực tiếp';
        default:
            return 'Không xác định';
    }
};

/**
 * Map AppointmentStatus to UI Tab
 */
export const mapStatusToUITab = (status: AppointmentStatus): AppointmentUITab => {
    switch (status) {
        case AppointmentStatus.CONFIRMED:
        case AppointmentStatus.PENDING:
            return 'upcoming';
        case AppointmentStatus.CANCELLED:
            return 'cancelled';
        case AppointmentStatus.COMPLETED:
        case AppointmentStatus.NO_SHOW:
            return 'completed';
        default:
            return 'upcoming';
    }
};

/**
 * Map UI Tab to AppointmentStatus
 */
export const mapUITabToStatus = (tab: AppointmentUITab): AppointmentStatus => {
    switch (tab) {
        case 'upcoming':
            return AppointmentStatus.CONFIRMED;
        case 'cancelled':
            return AppointmentStatus.CANCELLED;
        case 'completed':
            return AppointmentStatus.COMPLETED;
        default:
            return AppointmentStatus.CONFIRMED;
    }
};

/**
 * Transform API AppointmentResponse to UI AppointmentCardData
 */
export const transformToCardData = (apiResponse: AppointmentResponse): AppointmentCardData => {
    return {
        appointmentId: apiResponse.id,
        doctor: {
            id: apiResponse.doctorInfo?.id || '',
            name: apiResponse.doctorInfo?.fullName || 'N/A',
            avatar: apiResponse.doctorInfo?.avatarUrl || '',
            email: apiResponse.doctorInfo?.email || '',
            phone: '', // Phone not in API response yet
            specialty: '', // Specialty needs to be fetched separately
        },
        appointmentDate: apiResponse.appointmentDate,
        appointmentTime: apiResponse.appointmentDate, // Using same field for time
        appointmentType: apiResponse.appointmentType,
        visitType: apiResponse.serviceInfo?.category || 'General Visit',
        status: apiResponse.status,
        price: apiResponse.serviceInfo?.price?.toString(),
        notes: apiResponse.reason,
        isNew: false, // Can be calculated based on createdAt
        hasReview: false, // Needs review data from another endpoint
    };
};

/**
 * Check if appointment is new (created within last 24 hours)
 */
export const isNewAppointment = (createdAt: string): boolean => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
    return diffHours <= 24;
};

/**
 * Get badge CSS class for appointment status
 */
export const getStatusBadgeClass = (status: AppointmentStatus): string => {
    switch (status) {
        case AppointmentStatus.PENDING:
            return 'badge-warning';
        case AppointmentStatus.CONFIRMED:
            return 'badge-success';
        case AppointmentStatus.CANCELLED:
            return 'badge-danger';
        case AppointmentStatus.COMPLETED:
            return 'badge-info';
        case AppointmentStatus.NO_SHOW:
            return 'badge-secondary';
        default:
            return 'badge-secondary';
    }
};

/**
 * Get icon class for appointment type
 */
export const getAppointmentTypeIcon = (type: AppointmentType): string => {
    switch (type) {
        case AppointmentType.VIDEO_CALL:
            return 'isax isax-video';
        case AppointmentType.AUDIO_CALL:
            return 'isax isax-call';
        case AppointmentType.CHAT:
            return 'isax isax-messages';
        case AppointmentType.IN_PERSON:
            return 'isax isax-hospital5';
        default:
            return 'isax isax-calendar';
    }
};
