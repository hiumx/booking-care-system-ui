import { TFunction } from 'i18next';
import { AppointmentType } from '@/enums/appointment.enums';

/**
 * Format date string to localized format
 * @param dateString - ISO date string
 * @param language - Current language (vi or en)
 * @returns Formatted date string
 */
export const formatAppointmentDate = (dateString: string, language: string): string => {
    const date = new Date(dateString);
    const locale = language === 'vi' ? 'vi-VN' : 'en-US';
    return date.toLocaleDateString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

/**
 * Get translated appointment type text
 * @param type - Appointment type enum
 * @param t - Translation function
 * @returns Translated appointment type text
 */
export const getAppointmentTypeText = (type: AppointmentType, t: TFunction): string => {
    if (type === AppointmentType.TELEHEALTH) {
        return t('appointments.card.appointmentType.telehealth');
    }
    return t('appointments.card.appointmentType.inPerson');
};

/**
 * Get appointment type icon color class
 * @param type - Appointment type enum
 * @returns CSS class for icon color
 */
export const getAppointmentTypeIconColor = (type: AppointmentType): string => {
    if (type === AppointmentType.TELEHEALTH) {
        return 'video-icon';
    }
    return 'hospital-icon';
};
