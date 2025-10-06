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

// Response DTOs
export type DoctorScheduleResponse = ApiResponse<DoctorDailySchedule>;

export type DoctorScheduleListResponse = ApiResponse<DoctorDailySchedule[]>;

export type AvailableSlotsResponse = ApiResponse<AvailableSlot[]>;

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
