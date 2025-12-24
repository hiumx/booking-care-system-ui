import { ExceptionType, SchedulePatterns, AppointmentTime } from '../enums/schedule.enums';

// API Response wrapper
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errors?: string[];
}

// Base schedule interfaces
export interface DoctorDailySchedule {
    id: string;
    doctorId: string;
    medicalServiceId: string;
    clinicId: string;
    scheduleDate: string; // ISO date string
    pattern: SchedulePatterns;
    startTime: AppointmentTime;
    endTime: AppointmentTime;
    slotDuration: number; // minutes
    maxCapacityPerSlot: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    availableSlots?: AvailableSlot[];
}

export interface AvailableSlot {
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    isBlocked: boolean;
}

export interface DoctorScheduleException {
    id: string;
    doctorId: string;
    medicalServiceId: string;
    exceptionDate: string; // ISO date string
    exceptionType: ExceptionType;
    startTime?: AppointmentTime;
    endTime?: AppointmentTime;
    newCapacity?: number;
    reason?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Request DTOs
export interface GetDoctorScheduleRequest {
    doctorId: string;
    date: string; // ISO date string (YYYY-MM-DD)
    medicalServiceId?: string;
}

export interface GetDoctorAvailableSlotsRequest {
    doctorId: string;
    date: string; // ISO date string (YYYY-MM-DD)
    medicalServiceId?: string;
}

// Service Medical Schedule interfaces
export interface ServiceMedicalDailySchedule {
    id: string;
    serviceMedicalId: string;
    scheduleDate: string; // ISO date string
    schedulePatterns: SchedulePatterns[];
    createdAt: string;
    updatedAt: string;
}

export interface ServiceMedicalScheduleException {
    id: string;
    serviceMedicalId: string;
    exceptionDate: string; // ISO date string
    appointmentTime?: string; // Nullable - if null means full day off
    exceptionType: ExceptionType;
    isAvailable: boolean;
    reason?: string;
    createdAt: string;
    updatedAt: string;
}

// Request DTOs for Service Medical
export interface GetServiceMedicalScheduleRequest {
    serviceMedicalId: string;
    date: string; // ISO date string (YYYY-MM-DD)
}

export interface GetServiceMedicalAvailableSlotsRequest {
    serviceMedicalId: string;
    date: string; // ISO date string (YYYY-MM-DD)
}

// Response DTOs
export type DoctorScheduleResponse = ApiResponse<DoctorDailySchedule>;

export type DoctorScheduleListResponse = ApiResponse<DoctorDailySchedule[]>;

export type AvailableSlotsResponse = ApiResponse<AvailableSlot[]>;

// Service Medical Response DTOs
export type ServiceMedicalScheduleResponse = ApiResponse<ServiceMedicalDailySchedule>;

export type ServiceMedicalAvailableSlotsResponse = ApiResponse<AvailableSlot[]>;

// Time slot for UI
export interface TimeSlot {
    startTime: string;
    endTime: string;
    // available: boolean;
    // capacity?: number;
}

// Schedule category for UI grouping
export interface ScheduleCategory {
    title: string;
    pattern: SchedulePatterns;
    timeSlots: TimeSlot[];
}

// Query parameters for filtering
export interface ScheduleQueryParams {
    doctorId?: string;
    medicalServiceId?: string;
    clinicId?: string;
    startDate?: string;
    endDate?: string;
    pattern?: SchedulePatterns;
    isActive?: boolean;
    page?: number;
    limit?: number;
}

// Specialty Available Slots (for "hospital assigns doctor" mode)
export interface SpecialtyAvailableSlot {
    id: string;
    startTime: string;
    endTime: string;
    /** Number of doctors available for this time slot */
    availableDoctorCount: number;
    /** Number of slots currently held by other users */
    heldCount: number;
    /** Whether this slot is available for booking (availableDoctorCount - heldCount > 0) */
    isAvailable: boolean;
}

export interface SpecialtyAvailableSlotsResponse {
    hospitalId: string;
    specialtyId: string;
    date: string;
    appointmentType: string;
    /** Total number of doctors available for this specialty on this date */
    totalDoctorsAvailable: number;
    /** List of available time slots with capacity information */
    availableSlots: SpecialtyAvailableSlot[];
}

export interface GetSpecialtyAvailableSlotsRequest {
    hospitalId: string;
    specialtyId: string;
    date: string; // ISO date string (YYYY-MM-DD)
    appointmentType: 'IN_PERSON' | 'TELEHEALTH';
}

export type SpecialtyAvailableSlotsApiResponse = ApiResponse<SpecialtyAvailableSlotsResponse>;
