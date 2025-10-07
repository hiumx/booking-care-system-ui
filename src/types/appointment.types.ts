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
    email?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    specialtyName?: string;
    positionName?: string;
    hospitalId?: string;
    avatarUrl?: string;
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
    phone?: string;
    email?: string;
    avatarUrl?: string;
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

// Status counts for all appointment statuses
export interface AppointmentStatusCounts {
    pending: number;
    confirmed: number;
    cancelled: number;
    completed: number;
    total: number;
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
    statusCounts?: AppointmentStatusCounts;
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
    includeStatusCounts?: boolean;
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
export type AppointmentUITab = 'waiting' | 'upcoming' | 'cancelled' | 'completed';

// Appointment Card Data (optimized for UI display)
export interface AppointmentCardData {
    appointmentId: string;
    appointmentDate: string;
    appointmentTime: string;
    appointmentType: AppointmentType;
    status: AppointmentStatus;
    reason?: string;
    result?: string;
    isNew?: boolean;
    hasReview?: boolean;
    // Separate info sections - use priority: Doctor > Service > Hospital in components
    doctorInfo?: DoctorInfo;
    serviceInfo?: ServiceInfo;
    hospitalInfo?: HospitalInfo;
}

// Appointment Detail Data (for detail page)
// Now uses same structure as AppointmentCardData with priority logic
export interface AppointmentDetailData extends AppointmentCardData {
    visitType?: string;
    consultationFees?: number;
    clinicLocation?: string;
    location?: string;
    personWithPatient?: string;
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
    bottomSection?:
        | 'waiting_status'
        | 'start_session'
        | 'reschedule_status'
        | 'prescription_reschedule';
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
        default:
            return 'Không xác định';
    }
};

/**
 * Get Vietnamese text for appointment type
 */
export const getAppointmentTypeText = (type: AppointmentType): string => {
    switch (type) {
        case AppointmentType.TELEHEALTH:
            return 'Trực tuyến';
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
        case AppointmentStatus.PENDING:
            return 'waiting';
        case AppointmentStatus.CONFIRMED:
            return 'upcoming';
        case AppointmentStatus.CANCELLED:
            return 'cancelled';
        case AppointmentStatus.COMPLETED:
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
        case 'waiting':
            return AppointmentStatus.PENDING;
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
 * Maps data as-is, components will handle display priority
 */
export const transformToCardData = (apiResponse: AppointmentResponse): AppointmentCardData => {
    return {
        appointmentId: apiResponse.id,
        appointmentDate: apiResponse.appointmentDate,
        appointmentTime: apiResponse.appointmentDate, // Using same field for time
        appointmentType: apiResponse.appointmentType,
        status: apiResponse.status,
        reason: apiResponse.reason,
        result: apiResponse.result,
        isNew: false, // Can be calculated based on createdAt
        hasReview: false, // Needs review data from another endpoint
        // Map info sections directly from API response
        doctorInfo: apiResponse.doctorInfo,
        serviceInfo: apiResponse.serviceInfo,
        hospitalInfo: apiResponse.hospitalInfo,
    };
};

/**
 * Transform API AppointmentResponse to UI AppointmentDetailData
 * Includes additional detail fields
 */
export const transformToDetailData = (apiResponse: AppointmentResponse): AppointmentDetailData => {
    return {
        ...transformToCardData(apiResponse),
        visitType: undefined, // TODO: Add visitType to API response
        consultationFees: undefined, // TODO: Add consultationFees to API response
        clinicLocation: undefined, // TODO: Add clinicLocation to API response
        location: apiResponse.hospitalInfo?.address, // Use hospital address as location
        personWithPatient: undefined, // TODO: Add personWithPatient to API response
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
 * Get display name based on priority: Doctor > Service > Hospital
 */
export const getDisplayName = (appointment: AppointmentCardData): string => {
    if (appointment.doctorInfo?.id) {
        return (
            appointment.doctorInfo.fullName ||
            `${appointment.doctorInfo.firstName || ''} ${appointment.doctorInfo.lastName || ''}`.trim() ||
            'Bác sĩ'
        );
    }
    if (appointment.serviceInfo?.id) {
        return appointment.serviceInfo.name || 'Dịch vụ';
    }
    if (appointment.hospitalInfo?.id) {
        return appointment.hospitalInfo.name || 'Bệnh viện';
    }
    return 'Chưa xác định';
};

/**
 * Get display avatar based on priority: Doctor > Service > Hospital
 */
export const getDisplayAvatar = (appointment: AppointmentCardData): string => {
    if (appointment.doctorInfo?.avatarUrl) {
        return appointment.doctorInfo.avatarUrl;
    }
    if (appointment.hospitalInfo?.avatarUrl) {
        return appointment.hospitalInfo.avatarUrl;
    }
    return ''; // No avatar for service
};

/**
 * Get display email based on priority: Doctor > Hospital
 */
export const getDisplayEmail = (appointment: AppointmentCardData): string => {
    if (appointment.doctorInfo?.email) {
        return appointment.doctorInfo.email;
    }
    if (appointment.hospitalInfo?.email) {
        return appointment.hospitalInfo.email;
    }
    return '';
};

/**
 * Get display phone - only show hospital phone when there's no doctor and no service
 */
export const getDisplayPhone = (appointment: AppointmentCardData): string => {
    // Only show hospital phone if there's no doctor info and no service info
    if (!appointment.doctorInfo?.id && appointment.hospitalInfo?.phone) {
        return appointment.hospitalInfo.phone;
    }
    return '';
};

/**
 * Get display specialty/category
 */
export const getDisplaySpecialty = (appointment: AppointmentCardData): string => {
    if (appointment.doctorInfo?.specialtyName) {
        return appointment.doctorInfo.specialtyName;
    }
    if (appointment.serviceInfo?.category) {
        return appointment.serviceInfo.category;
    }
    return '';
};

/**
 * Get display label (Bác sĩ, Dịch vụ, Bệnh viện)
 */
export const getDisplayLabel = (appointment: AppointmentCardData): string => {
    if (appointment.doctorInfo?.id) {
        return appointment.doctorInfo.positionName || 'Bác sĩ';
    }
    if (appointment.serviceInfo?.id) {
        return 'Dịch vụ';
    }
    if (appointment.hospitalInfo?.id) {
        return 'Bệnh viện';
    }
    return 'Chưa xác định';
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
        default:
            return 'badge-secondary';
    }
};

/**
 * Get icon class for appointment type
 */
export const getAppointmentTypeIcon = (type: AppointmentType): string => {
    switch (type) {
        case AppointmentType.TELEHEALTH:
            return 'isax isax-video5';
        case AppointmentType.IN_PERSON:
            return 'isax isax-hospital5';
        default:
            return 'isax isax-calendar';
    }
};
