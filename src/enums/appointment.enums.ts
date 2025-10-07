/**
 * Represents the available types of appointments in the system.
 */
export enum AppointmentType {
    /**
     * Appointment conducted via telehealth (video call, audio call, or chat).
     */
    TELEHEALTH = 'TELEHEALTH',

    /**
     * Appointment conducted in person at the hospital/clinic.
     */
    IN_PERSON = 'IN_PERSON',
}

/**
 * Represents the possible statuses of an appointment in the booking care system.
 *
 */
export enum AppointmentStatus {
    /**
     * The appointment is pending and awaiting confirmation.
     */
    PENDING = 'PENDING',

    /**
     * The appointment has been confirmed.
     */
    CONFIRMED = 'CONFIRMED',

    /**
     * The appointment has been cancelled.
     */
    CANCELLED = 'CANCELLED',

    /**
     * The appointment has been completed successfully.
     */
    COMPLETED = 'COMPLETED',
}
