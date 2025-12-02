import { AppointmentInfo } from '../components/BookingHeader/BookingHeader';
import { AppointmentType } from '@/enums/appointment.enums';

// Helper function to get appointment type display text
export const getAppointmentTypeDisplayText = (appointmentType: AppointmentType): string => {
    switch (appointmentType) {
        case AppointmentType.TELEHEALTH:
            return 'Tư vấn trực tiếp';
        case AppointmentType.IN_PERSON:
            return 'Khám trực tiếp';
        default:
            return 'Khám trực tiếp';
    }
};

export const mockAppointmentInfo: AppointmentInfo = {
    service: 'Tim mạch (30 phút)',
    serviceType: 'Siêu âm tim',
    dateTime: '10:00 - 11:00, 15 Tháng 10',
    appointmentType: 'Khám trực tiếp', // This will be overridden by BookingSectionWrapper
};
