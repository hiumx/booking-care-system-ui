/**
 * Represents the types of exceptions that can occur in the scheduling system.
 */
export enum ExceptionType {
    /**
     * Indicates that a specific slot is blocked and cannot be booked.
     */
    BLOCK_SLOT = 1,

    /**
     * Indicates that a previously blocked slot is now unblocked and available for booking.
     */
    UNBLOCK_SLOT = 2,

    /**
     * Represents a day off when no slots are available for booking.
     */
    DAY_OFF = 3,

    /**
     * Indicates a change in the capacity for a slot or schedule.
     */
    CAPACITY_CHANGE = 4,
}

/**
 * Represents the scheduling patterns for appointments.
 */
export enum SchedulePatterns {
    /**
     * Morning pattern (e.g., 08:00 - 12:00)
     */
    MORNING = 1,

    /**
     * Afternoon pattern (e.g., 13:00 - 17:00)
     */
    AFTERNOON = 2,

    /**
     * Evening pattern (e.g., 17:00 - 21:00)
     */
    EVENING = 3,

    /**
     * Full day pattern (e.g., 08:00 - 21:00)
     */
    FULL_DAY = 4,
}

/**
 * Enum for appointment time slots
 */
export enum AppointmentTime {
    TIME_8_00 = '08:00',
    TIME_8_30 = '08:30',
    TIME_9_00 = '09:00',
    TIME_9_30 = '09:30',
    TIME_10_00 = '10:00',
    TIME_10_30 = '10:30',
    TIME_11_00 = '11:00',
    TIME_11_30 = '11:30',
    TIME_12_00 = '12:00',
    TIME_13_00 = '13:00',
    TIME_13_30 = '13:30',
    TIME_14_00 = '14:00',
    TIME_14_30 = '14:30',
    TIME_15_00 = '15:00',
    TIME_15_30 = '15:30',
    TIME_16_00 = '16:00',
    TIME_16_30 = '16:30',
    TIME_17_00 = '17:00',
    TIME_17_30 = '17:30',
    TIME_18_00 = '18:00',
    TIME_18_30 = '18:30',
    TIME_19_00 = '19:00',
    TIME_19_30 = '19:30',
    TIME_20_00 = '20:00',
    TIME_20_30 = '20:30',
    TIME_21_00 = '21:00',
}
