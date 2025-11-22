import { AppointmentTime } from '@/enums/appointment.enums';

export interface HoldSlotRequest {
    doctorId: string;
    date: string; // YYYY-MM-DD format
    appointmentTimeId: AppointmentTime;
}

export interface ReleaseSlotRequest {
    doctorId: string;
    date: string; // YYYY-MM-DD format
    appointmentTimeId: AppointmentTime;
}

export interface HoldSlotInfo {
    doctorId: string;
    date: string;
    appointmentTimeId: AppointmentTime;
    userId: string;
    heldAt: string; // ISO date string
    expiresAt: string; // ISO date string
    remainingSeconds: number;
}

export interface HoldSlotResponse {
    success: boolean;
    message: string;
    holdSlot?: HoldSlotInfo;
    remainingSeconds: number;
}

export interface RemainingTimeResponse {
    remainingSeconds: number;
}

export interface ReleaseAllResponse {
    releasedCount: number;
}
