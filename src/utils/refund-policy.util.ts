/**
 * Refund Policy Utility
 * Calculates refund percentage based on cancellation time
 * Synchronized with backend: RefundPolicyHelper.cs
 *
 * Policy:
 * - Staff/Hospital cancel: Always 100% refund (hospital's fault)
 * - Patient cancel >= 24 hours before: 100% refund
 * - Patient cancel 12-24 hours before: 50% refund
 * - Patient cancel < 12 hours before: 0% refund (No refund)
 *
 * NOTE: Backend uses Vietnam timezone (UTC+7) and combines appointmentDate with appointmentTimeId
 * Frontend should pass the full appointment datetime for accurate calculation
 */

import { AppointmentTime } from '@/enums/appointment.enums';

export interface RefundInfo {
    refundPercentage: number;
    hoursUntilAppointment: number;
    isAllowed: boolean;
    policyMessage: string;
}

/**
 * Parse AppointmentTimeId enum to get start time
 * Example: AT_08_00_09_00 -> { hour: 8, minute: 0 }
 * Synchronized with backend: RefundPolicyHelper.ParseAppointmentStartTime
 */
const parseAppointmentStartTime = (
    appointmentTimeId: AppointmentTime | string
): { hour: number; minute: number } | null => {
    try {
        const timeString = String(appointmentTimeId);
        const parts = timeString.split('_');

        if (parts.length >= 3 && parts[0] === 'AT') {
            const hour = Number.parseInt(parts[1], 10);
            const minute = Number.parseInt(parts[2], 10);

            if (!Number.isNaN(hour) && !Number.isNaN(minute)) {
                return { hour, minute };
            }
        }

        return null;
    } catch {
        return null;
    }
};

/**
 * Combine AppointmentDate (date only) with AppointmentTimeId (time) to get full DateTime
 * Synchronized with backend: RefundPolicyHelper.GetFullAppointmentDateTime
 * NOTE: Result is in Vietnam local time
 */
const getFullAppointmentDateTime = (
    appointmentDate: Date | string,
    appointmentTimeId?: AppointmentTime | string
): Date => {
    const date = typeof appointmentDate === 'string' ? new Date(appointmentDate) : appointmentDate;

    if (appointmentTimeId) {
        const startTime = parseAppointmentStartTime(appointmentTimeId);

        if (startTime) {
            // Create date with time in Vietnam timezone
            const fullDate = new Date(date);
            fullDate.setHours(startTime.hour, startTime.minute, 0, 0);
            return fullDate;
        }
    }

    // Fallback: use date only (assume start of day)
    const fallbackDate = new Date(date);
    fallbackDate.setHours(0, 0, 0, 0);
    return fallbackDate;
};

/**
 * Calculate refund percentage based on time between cancellation and appointment
 * Synchronized with backend: RefundPolicyHelper.CalculateRefundPercentage
 *
 * Policy:
 * - Staff/Hospital cancel: Always 100% refund (hospital's fault)
 * - Patient cancel >= 24 hours before: 100% refund
 * - Patient cancel 12-24 hours before: 50% refund
 * - Patient cancel < 12 hours before: 0% refund
 *
 * @param appointmentDate - The appointment date
 * @param appointmentTimeId - The appointment time slot (optional, for more accurate calculation)
 * @param cancellationDate - The cancellation date (defaults to now)
 * @param isStaffCancellation - True if cancelled by staff/hospital
 */
export const calculateRefundPercentage = (
    appointmentDate: Date | string,
    appointmentTimeId?: AppointmentTime | string,
    cancellationDate?: Date,
    isStaffCancellation: boolean = false
): number => {
    // If cancelled by staff/hospital, always full refund (hospital's responsibility)
    if (isStaffCancellation) {
        return 100;
    }

    // Get full appointment datetime (combining date with time slot if available)
    const fullAppointmentDateTime = getFullAppointmentDateTime(appointmentDate, appointmentTimeId);

    // Use current time for cancellation
    const cancelTime = cancellationDate || new Date();

    // Calculate hours difference
    const hoursUntilAppointment =
        (fullAppointmentDateTime.getTime() - cancelTime.getTime()) / (1000 * 60 * 60);

    // Patient cancellation - apply time-based policy
    if (hoursUntilAppointment >= 24) {
        return 100; // Full refund
    } else if (hoursUntilAppointment >= 12) {
        return 50; // Half refund
    } else {
        return 0; // No refund
    }
};

/**
 * Get refund policy message based on hours until appointment
 * Synchronized with backend: RefundPolicyHelper.GetRefundPolicyMessage
 */
export const getRefundPolicyMessage = (hoursUntilAppointment: number): string => {
    if (hoursUntilAppointment >= 24) {
        return 'Bạn sẽ được hoàn lại 100% chi phí';
    } else if (hoursUntilAppointment >= 12) {
        return 'Bạn sẽ được hoàn lại 50% chi phí';
    } else if (hoursUntilAppointment >= 0) {
        return 'Bạn sẽ không được hoàn lại chi phí';
    } else {
        return 'Không thể hủy lịch hẹn đã qua';
    }
};

/**
 * Check if cancellation is allowed (appointment must be in the future)
 * Synchronized with backend: RefundPolicyHelper.IsCancellationAllowed
 */
export const isCancellationAllowed = (
    appointmentDate: Date | string,
    appointmentTimeId?: AppointmentTime | string,
    cancellationDate?: Date
): boolean => {
    const fullAppointmentDateTime = getFullAppointmentDateTime(appointmentDate, appointmentTimeId);
    const cancelTime = cancellationDate || new Date();
    return fullAppointmentDateTime.getTime() > cancelTime.getTime();
};

/**
 * Check if reschedule is allowed (must be at least 24 hours before appointment)
 * Synchronized with backend: RefundPolicyHelper.IsRescheduleAllowed
 */
export const isRescheduleAllowed = (
    appointmentDate: Date | string,
    appointmentTimeId?: AppointmentTime | string,
    requestTime?: Date
): boolean => {
    const fullAppointmentDateTime = getFullAppointmentDateTime(appointmentDate, appointmentTimeId);
    const checkTime = requestTime || new Date();
    const hoursUntilAppointment =
        (fullAppointmentDateTime.getTime() - checkTime.getTime()) / (1000 * 60 * 60);

    // Must be at least 24 hours before appointment
    return hoursUntilAppointment >= 24;
};

/**
 * Get reschedule policy message
 * Synchronized with backend: RefundPolicyHelper.GetReschedulePolicyMessage
 */
export const getReschedulePolicyMessage = (
    appointmentDate: Date | string,
    appointmentTimeId?: AppointmentTime | string,
    requestTime?: Date
): string => {
    const fullAppointmentDateTime = getFullAppointmentDateTime(appointmentDate, appointmentTimeId);
    const checkTime = requestTime || new Date();
    const hoursUntilAppointment =
        (fullAppointmentDateTime.getTime() - checkTime.getTime()) / (1000 * 60 * 60);

    if (hoursUntilAppointment >= 24) {
        return 'Bạn có thể đổi lịch hẹn này';
    } else if (hoursUntilAppointment > 0) {
        return `Chỉ có thể đổi lịch trước ít nhất 24 giờ. Còn ${hoursUntilAppointment.toFixed(1)} giờ nữa đến lịch hẹn.`;
    } else {
        return 'Không thể đổi lịch hẹn đã qua';
    }
};

/**
 * Get detailed refund info for display
 * Synchronized with backend: RefundPolicyHelper.GetRefundInfo
 *
 * @param appointmentDate - The appointment date
 * @param appointmentTimeId - The appointment time slot (optional, for more accurate calculation)
 * @param cancellationDate - The cancellation date (defaults to now)
 * @param isStaffCancellation - True if cancelled by staff/hospital
 */
export const getRefundInfo = (
    appointmentDate: Date | string,
    appointmentTimeId?: AppointmentTime | string,
    cancellationDate?: Date,
    isStaffCancellation: boolean = false
): RefundInfo => {
    const fullAppointmentDateTime = getFullAppointmentDateTime(appointmentDate, appointmentTimeId);
    const cancelTime = cancellationDate || new Date();
    const hoursUntilAppointment =
        (fullAppointmentDateTime.getTime() - cancelTime.getTime()) / (1000 * 60 * 60);

    const refundPercentage = calculateRefundPercentage(
        appointmentDate,
        appointmentTimeId,
        cancellationDate,
        isStaffCancellation
    );
    const isAllowed = isCancellationAllowed(appointmentDate, appointmentTimeId, cancellationDate);

    return {
        refundPercentage,
        hoursUntilAppointment,
        isAllowed,
        policyMessage: isStaffCancellation
            ? 'Bệnh viện hủy lịch hẹn - Bạn sẽ được hoàn lại 100% chi phí'
            : getRefundPolicyMessage(hoursUntilAppointment),
    };
};
