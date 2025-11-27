import { AppointmentTime } from '@/enums/appointment.enums';

// Target type for hold slot operations
export enum HoldSlotTargetType {
    Doctor = 0,
    ServiceMedical = 1,
}

export interface HoldSlotRequest {
    targetId: string; // Can be DoctorId or ServiceMedicalId
    targetType: HoldSlotTargetType;
    date: string; // YYYY-MM-DD format
    appointmentTimeId: AppointmentTime;
}

export interface ReleaseSlotRequest {
    targetId: string; // Can be DoctorId or ServiceMedicalId
    targetType: HoldSlotTargetType;
    date: string; // YYYY-MM-DD format
    appointmentTimeId: AppointmentTime;
}

export interface HoldSlotInfo {
    targetId: string;
    targetType: HoldSlotTargetType;
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
