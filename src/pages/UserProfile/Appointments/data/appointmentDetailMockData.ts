import {
    AppointmentDetailData,
    AppointmentType,
    AppointmentStatus,
} from '@/types/appointment.types';

export const mockAppointmentDetailData: Record<string, AppointmentDetailData> = {
    upcoming: {
        appointmentId: 'Apt0001',
        doctor: {
            name: 'Dr Edalin Hendry',
            image: '/src/assets/img/doctors-dashboard/doctor-profile-img.jpg',
            email: 'edalin.hendry@example.com',
            phone: '+1 504 368 6874',
        },
        appointmentType: AppointmentType.IN_PERSON,
        visitType: 'General',
        appointmentDate: '22 Jul 2023',
        appointmentTime: '12:00 pm',
        consultationFees: 200,
        clinicLocation: "Adrian's Dentistry",
        location: 'Newyork, United States',
        status: AppointmentStatus.CONFIRMED,
    },
    cancelled: {
        appointmentId: 'Apt0001',
        doctor: {
            name: 'Dr Edalin Hendry',
            image: '/src/assets/img/doctors-dashboard/doctor-profile-img.jpg',
            email: 'edalin.hendry@example.com',
            phone: '+1 504 368 6874',
        },
        appointmentType: AppointmentType.VIDEO_CALL,
        visitType: 'General',
        appointmentDate: '22 Jul 2023',
        appointmentTime: '12:00 pm',
        consultationFees: 200,
        personWithPatient: 'Andrew',
        status: AppointmentStatus.CANCELLED,
    },
    completed: {
        appointmentId: 'Apt0001',
        doctor: {
            name: 'Dr Edalin Hendry',
            image: '/src/assets/img/doctors-dashboard/doctor-profile-img.jpg',
            email: 'edalin.hendry@example.com',
            phone: '+1 504 368 6874',
        },
        appointmentType: AppointmentType.VIDEO_CALL,
        visitType: 'General',
        appointmentDate: '22 Jul 2023',
        appointmentTime: '12:00 pm',
        consultationFees: 200,
        personWithPatient: 'Andrew',
        status: AppointmentStatus.COMPLETED,
    },
};
