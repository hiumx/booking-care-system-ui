/**
 * Represents the available types of appointments in the system.
 */
export enum AppointmentType {
    /**
     * Appointment conducted via video call.
     */
    VIDEO_CALL = 'VIDEO_CALL',

    /**
     * Appointment conducted via audio call.
     */
    AUDIO_CALL = 'AUDIO_CALL',

    /**
     * Appointment conducted via chat messaging.
     */
    CHAT = 'CHAT',

    /**
     * Appointment conducted in person.
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

    /**
     * The appointment was missed and marked as no-show.
     */
    NO_SHOW = 'NO_SHOW',
}
