import { AppointmentDetailData } from '../types/appointmentDetail.types';

export const mockAppointmentDetailData: Record<string, AppointmentDetailData> = {
    upcoming: {
        appointmentId: 'Apt0001',
        doctor: {
            name: 'Dr Edalin Hendry',
            image: '/src/assets/img/doctors-dashboard/doctor-profile-img.jpg',
            email: 'edalin.hendry@example.com',
            phone: '+1 504 368 6874',
        },
        appointmentType: 'direct_visit',
        visitType: 'General',
        appointmentDate: '22 Jul 2023',
        appointmentTime: '12:00 pm',
        consultationFees: 200,
        clinicLocation: "Adrian's Dentistry",
        location: 'Newyork, United States',
        status: 'upcoming',
    },
    cancelled: {
        appointmentId: 'Apt0001',
        doctor: {
            name: 'Dr Edalin Hendry',
            image: '/src/assets/img/doctors-dashboard/doctor-profile-img.jpg',
            email: 'edalin.hendry@example.com',
            phone: '+1 504 368 6874',
        },
        appointmentType: 'video_call',
        visitType: 'General',
        appointmentDate: '22 Jul 2023',
        appointmentTime: '12:00 pm',
        consultationFees: 200,
        personWithPatient: 'Andrew',
        status: 'cancelled',
    },
    completed: {
        appointmentId: 'Apt0001',
        doctor: {
            name: 'Dr Edalin Hendry',
            image: '/src/assets/img/doctors-dashboard/doctor-profile-img.jpg',
            email: 'edalin.hendry@example.com',
            phone: '+1 504 368 6874',
        },
        appointmentType: 'video_call',
        visitType: 'General',
        appointmentDate: '22 Jul 2023',
        appointmentTime: '12:00 pm',
        consultationFees: 200,
        personWithPatient: 'Andrew',
        status: 'completed',
    },
};
