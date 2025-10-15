/**
 * Refund Policy Utility
 * Calculates refund percentage based on cancellation time
 * Policy:
 * - >= 24 hours before: 100% refund
 * - 12-24 hours before: 50% refund
 * - < 12 hours before: 0% refund (No refund)
 */

export interface RefundInfo {
    refundPercentage: number;
    hoursUntilAppointment: number;
    isAllowed: boolean;
    policyMessage: string;
}

/**
 * Calculate refund percentage based on time between cancellation and appointment
 * Uses UTC time to match backend calculation
 * Note: This is for PATIENT cancellation only. Staff cancellation always gets 100% refund.
 */
export const calculateRefundPercentage = (
    appointmentDate: Date | string,
    cancellationDate?: Date,
    isStaffCancellation: boolean = false
): number => {
    // If cancelled by staff/hospital, always full refund (hospital's responsibility)
    if (isStaffCancellation) {
        return 100; // Full refund for hospital cancellation
    }

    // Parse appointment date and ensure it's treated as UTC (same as backend)
    const appointmentDateTime =
        typeof appointmentDate === 'string'
            ? new Date(appointmentDate.endsWith('Z') ? appointmentDate : appointmentDate + 'Z')
            : appointmentDate;

    // Use current UTC time (same as backend)
    const cancelTime = cancellationDate || new Date();

    // Calculate hours difference
    const hoursUntilAppointment =
        (appointmentDateTime.getTime() - cancelTime.getTime()) / (1000 * 60 * 60);

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
 */
export const isCancellationAllowed = (
    appointmentDate: Date | string,
    cancellationDate?: Date
): boolean => {
    const appointmentDateTime =
        typeof appointmentDate === 'string' ? new Date(appointmentDate) : appointmentDate;
    const cancelTime = cancellationDate || new Date();
    return appointmentDateTime.getTime() > cancelTime.getTime();
};

/**
 * Get detailed refund info for display
 */
export const getRefundInfo = (
    appointmentDate: Date | string,
    cancellationDate?: Date,
    isStaffCancellation: boolean = false
): RefundInfo => {
    // Use same parsing logic as calculateRefundPercentage for consistency
    const appointmentDateTime =
        typeof appointmentDate === 'string'
            ? new Date(appointmentDate.endsWith('Z') ? appointmentDate : appointmentDate + 'Z')
            : appointmentDate;

    const cancelTime = cancellationDate || new Date();
    const hoursUntilAppointment =
        (appointmentDateTime.getTime() - cancelTime.getTime()) / (1000 * 60 * 60);

    const refundPercentage = calculateRefundPercentage(
        appointmentDate,
        cancellationDate,
        isStaffCancellation
    );
    const isAllowed = isCancellationAllowed(appointmentDate, cancellationDate);

    return {
        refundPercentage,
        hoursUntilAppointment,
        isAllowed,
        policyMessage: isStaffCancellation
            ? 'Bệnh viện hủy lịch hẹn - Bạn sẽ được hoàn lại 100% chi phí'
            : getRefundPolicyMessage(hoursUntilAppointment),
    };
};
