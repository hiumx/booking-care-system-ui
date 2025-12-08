// ============================================
// API Types (matching backend exactly)
// ============================================

import { AppointmentStatus, AppointmentType, AppointmentTime } from '@/enums/appointment.enums';

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
    consultationFee?: number;
}

// Service Information from API
export interface ServiceInfo {
    id: string;
    name?: string;
    price?: number;
    imageUrl?: string;
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

// Specialty Information from API (for hospital assigns doctor mode)
export interface SpecialtyInfo {
    id: string;
    name?: string;
    description?: string;
    imageUrl?: string;
}

// Relative Information from API
export interface RelativeInfo {
    id: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    gender?: string;
    dateOfBirth?: string;
    age?: number;
    phone?: string;
    relationship?: string;
    relationshipDisplay?: string;
}

// Appointment Response from API
export interface AppointmentResponse {
    id: string;
    patientId?: string;
    patientAccountId?: string;
    /** Relative ID when booking for a family member (null = booking for self) */
    relativeId?: string;
    cancelledBy?: string;
    cancelledAt?: string;
    appointmentDate: string;
    appointmentTimeId: AppointmentTime;
    appointmentType: AppointmentType;
    status: AppointmentStatus;
    reason?: string;
    result?: string;
    /** Original consultation/service fee at the time of booking (before any discounts) */
    amount?: number;
    consultationFees: number;
    createdAt: string;
    updatedAt: string;
    patientInfo?: PatientInfo;
    relativeInfo?: RelativeInfo;
    doctorInfo?: DoctorInfo;
    serviceInfo?: ServiceInfo;
    hospitalInfo?: HospitalInfo;
    /** Specialty info for hospital assigns doctor mode (no doctor selected yet) */
    specialtyInfo?: SpecialtyInfo;
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
    /** Filter for appointments booked for relatives (true = only relatives, false = only self, undefined = all) */
    forRelative?: boolean;
}

// Create Appointment Request
export interface CreateAppointmentRequest {
    patientId: string;
    patientAccountId?: string;
    /** Relative ID when booking for a family member (null/undefined = booking for self) */
    relativeId?: string;
    doctorId?: string;
    serviceId?: string;
    specialtyId?: string;
    appointmentDate: string;
    appointmentTimeId: string;
    hospitalId?: string;
    appointmentType: AppointmentType;
    reason?: string;
    symptoms?: string;
    attachmentUrls?: string;
    skipPayment?: boolean; // If true, skip payment and send confirmation email immediately
    /** Original consultation/service fee at the time of booking (before any discounts) */
    amount?: number;
}

// Reschedule Requests
export interface RescheduleSameDoctorRequest {
    appointmentId: string;
    rescheduleToken: string;
    newAppointmentDate: string;
    newAppointmentTimeId: string;
}

export interface ConfirmNewDoctorRequest {
    appointmentId: string;
    rescheduleToken: string;
    newDoctorId: string;
    newAppointmentDate?: string;
    newAppointmentTimeId?: string;
}

export interface RequestRefundRequest {
    appointmentId: string;
    rescheduleToken: string;
}

// Reschedule Options (for staff cancellation)
export interface RescheduleOptions {
    enableSameDoctorReschedule: boolean;
    enableNewDoctorAssignment: boolean;
    enableDoctorSelection: boolean;
    enableRefundRequest: boolean;
}

// Reschedule Response with all 4 options
export interface RescheduleResponse {
    appointmentId: string;
    rescheduleToken: string;
    tokenExpiry: string;
    message: string;
    // Option 1: Reschedule with same doctor
    sameDoctorRescheduleUrl?: string;
    // Option 2: Confirm new doctor assigned by hospital
    confirmNewDoctorUrl?: string;
    // Option 3: Choose new doctor yourself
    chooseNewDoctorUrl?: string;
    // Option 4: Request refund
    refundRequestUrl?: string;
}

// Refund History Response
export interface RefundHistoryResponse {
    id: string;
    appointmentId: string;
    patientId: string;
    paymentId: string;
    refundAmount: number;
    originalAmount: number;
    refundPercentage: number;
    status: string;
    reason: string;
    patientNote?: string;
    adminNote?: string;
    bankAccountNumber?: string;
    bankName?: string;
    bankAccountHolderName?: string;
    approvedAt?: string;
    approvedBy?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
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
    appointmentTimeId: AppointmentTime;
    appointmentType: AppointmentType;
    status: AppointmentStatus;
    reason?: string;
    result?: string;
    isNew?: boolean;
    hasReview?: boolean;
    consultationFees: number;

    // Cancellation information
    cancelledBy?: string;
    cancelledAt?: string;
    // Separate info sections - use priority: Doctor > Service > Hospital in components
    doctorInfo?: DoctorInfo;
    serviceInfo?: ServiceInfo;
    hospitalInfo?: HospitalInfo;
}

// Appointment Detail Data (for detail page)
// Now uses same structure as AppointmentCardData with priority logic
export interface AppointmentDetailData extends AppointmentCardData {
    visitType?: string;
    consultationFees: number;
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
    onReschedule?: (
        appointment?: AppointmentCardData,
        action?: 'SAME_DOCTOR' | 'NEW_DOCTOR'
    ) => void;
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
    showLocation: boolean;
    showStartSession: boolean;
    showReschedule: boolean;
    showDownloadPrescription: boolean;
    showCancelButton: boolean;
    showReasonLink: boolean;
    bottomSection?:
        | 'waiting_status'
        | 'start_session'
        | 'reschedule_status'
        | 'prescription_reschedule'
        | 'none';
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
 * Appointment time mapping - Using object mapping instead of switch to reduce complexity
 */
const APPOINTMENT_TIME_MAP: Record<AppointmentTime, string> = {
    // 30-minute intervals
    [AppointmentTime.AT_08_00_08_30]: '08:00 - 08:30',
    [AppointmentTime.AT_08_30_09_00]: '08:30 - 09:00',
    [AppointmentTime.AT_09_00_09_30]: '09:00 - 09:30',
    [AppointmentTime.AT_09_30_10_00]: '09:30 - 10:00',
    [AppointmentTime.AT_10_00_10_30]: '10:00 - 10:30',
    [AppointmentTime.AT_10_30_11_00]: '10:30 - 11:00',
    [AppointmentTime.AT_11_00_11_30]: '11:00 - 11:30',
    [AppointmentTime.AT_11_30_12_00]: '11:30 - 12:00',
    [AppointmentTime.AT_13_00_13_30]: '13:00 - 13:30',
    [AppointmentTime.AT_13_30_14_00]: '13:30 - 14:00',
    [AppointmentTime.AT_14_00_14_30]: '14:00 - 14:30',
    [AppointmentTime.AT_14_30_15_00]: '14:30 - 15:00',
    [AppointmentTime.AT_15_00_15_30]: '15:00 - 15:30',
    [AppointmentTime.AT_15_30_16_00]: '15:30 - 16:00',
    [AppointmentTime.AT_16_00_16_30]: '16:00 - 16:30',
    [AppointmentTime.AT_16_30_17_00]: '16:30 - 17:00',
    [AppointmentTime.AT_17_00_17_30]: '17:00 - 17:30',
    [AppointmentTime.AT_17_30_18_00]: '17:30 - 18:00',
    [AppointmentTime.AT_18_00_18_30]: '18:00 - 18:30',
    [AppointmentTime.AT_18_30_19_00]: '18:30 - 19:00',
    [AppointmentTime.AT_19_00_19_30]: '19:00 - 19:30',
    [AppointmentTime.AT_19_30_20_00]: '19:30 - 20:00',
    [AppointmentTime.AT_20_00_20_30]: '20:00 - 20:30',
    [AppointmentTime.AT_20_30_21_00]: '20:30 - 21:00',
    [AppointmentTime.AT_21_00_21_30]: '21:00 - 21:30',
    [AppointmentTime.AT_21_30_22_00]: '21:30 - 22:00',
    [AppointmentTime.AT_22_00_22_30]: '22:00 - 22:30',
    [AppointmentTime.AT_22_30_23_00]: '22:30 - 23:00',
    // 60-minute intervals
    [AppointmentTime.AT_08_00_09_00]: '08:00 - 09:00',
    [AppointmentTime.AT_09_00_10_00]: '09:00 - 10:00',
    [AppointmentTime.AT_10_00_11_00]: '10:00 - 11:00',
    [AppointmentTime.AT_11_00_12_00]: '11:00 - 12:00',
    [AppointmentTime.AT_13_00_14_00]: '13:00 - 14:00',
    [AppointmentTime.AT_14_00_15_00]: '14:00 - 15:00',
    [AppointmentTime.AT_15_00_16_00]: '15:00 - 16:00',
    [AppointmentTime.AT_16_00_17_00]: '16:00 - 17:00',
    [AppointmentTime.AT_17_00_18_00]: '17:00 - 18:00',
    [AppointmentTime.AT_18_00_19_00]: '18:00 - 19:00',
    [AppointmentTime.AT_19_00_20_00]: '19:00 - 20:00',
    [AppointmentTime.AT_20_00_21_00]: '20:00 - 21:00',
    [AppointmentTime.AT_21_00_22_00]: '21:00 - 22:00',
    [AppointmentTime.AT_22_00_23_00]: '22:00 - 23:00',
};

/**
 * Get time range text for appointment time slot
 */
export const getAppointmentTimeText = (timeSlot: AppointmentTime): string => {
    return APPOINTMENT_TIME_MAP[timeSlot] || 'Chưa xác định';
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
        appointmentTime: getAppointmentTimeText(apiResponse.appointmentTimeId),
        appointmentTimeId: apiResponse.appointmentTimeId,
        appointmentType: apiResponse.appointmentType,
        status: apiResponse.status,
        reason: apiResponse.reason,
        result: apiResponse.result,
        isNew: false, // Can be calculated based on createdAt
        hasReview: false, // Needs review data from another endpoint
        consultationFees: apiResponse.consultationFees,
        cancelledBy: apiResponse.cancelledBy,
        cancelledAt: apiResponse.cancelledAt,
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
        // Note: These fields will be added in future API updates
        visitType: undefined,
        consultationFees: apiResponse.consultationFees,
        clinicLocation: undefined,
        location: apiResponse.hospitalInfo?.address, // Use hospital address as location
        personWithPatient: undefined,
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
            `${appointment.doctorInfo.lastName || ''} ${appointment.doctorInfo.firstName || ''}`.trim() ||
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
    if (appointment.serviceInfo?.imageUrl) {
        return appointment.serviceInfo.imageUrl;
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
 * Get display specialty (for doctor appointments only)
 */
export const getDisplaySpecialty = (appointment: AppointmentCardData): string => {
    if (appointment.doctorInfo?.specialtyName) {
        return appointment.doctorInfo.specialtyName;
    }
    // Service appointments don't have specialty/category in basic info
    return 'Dịch vụ';
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

/**
 * Get display fee based on priority: Doctor consultationFee > Service price
 * Returns the fee amount or undefined if not available
 */
export const getDisplayFee = (appointment: AppointmentCardData): number | undefined => {
    if (appointment.doctorInfo?.consultationFee) {
        return appointment.doctorInfo.consultationFee;
    }
    if (appointment.serviceInfo?.price) {
        return appointment.serviceInfo.price;
    }
    return undefined;
};

/**
 * Get formatted display fee string
 * Returns formatted VNĐ string or fallback text
 */
export const getDisplayFeeText = (appointment: AppointmentCardData): string => {
    const fee = getDisplayFee(appointment);
    if (fee) {
        return `${fee.toLocaleString('vi-VN')} VNĐ`;
    }
    return 'Đang cập nhật...';
};

/**
 * Check if appointment is a service appointment (no doctor, has service)
 */
export const isServiceAppointment = (appointment: AppointmentCardData): boolean => {
    return !appointment.doctorInfo?.id && !!appointment.serviceInfo?.id;
};

/**
 * Get rebooking URL based on appointment type
 * Priority: Doctor > Service > Hospital
 * @returns URL path for rebooking
 */
export const getRebookingUrl = (appointment: AppointmentCardData): string => {
    // Doctor appointment - book with same doctor
    if (appointment.doctorInfo?.id) {
        return `/booking/${appointment.doctorInfo.id}`;
    }
    // Service appointment - book same service
    if (appointment.serviceInfo?.id) {
        return `/booking/service/${appointment.serviceInfo.id}`;
    }
    // Hospital appointment - book with same hospital
    if (appointment.hospitalInfo?.id) {
        return `/booking/hospital/${appointment.hospitalInfo.id}`;
    }
    // Fallback to home
    return '/';
};
