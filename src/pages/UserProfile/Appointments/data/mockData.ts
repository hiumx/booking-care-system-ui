import { AppointmentData, AppointmentStatus, AppointmentType } from '../types/appointment.types';

// Helper function to create doctor data
const createDoctor = (
    id: string,
    name: string,
    avatarNum: string,
    email: string,
    phone: string
) => ({
    id,
    name,
    avatar: `/src/assets/img/doctors/doctor-thumb-${avatarNum}.jpg`,
    email,
    phone,
});

// Helper function to create appointment data with reduced parameters
interface CreateAppointmentParams {
    id: string;
    doctorData: ReturnType<typeof createDoctor>;
    date: string;
    time: string;
    appointmentType: AppointmentType;
    visitType: string;
    status: AppointmentStatus;
    price: string;
    options?: { isNew?: boolean; hasReview?: boolean };
}

const createAppointment = (params: CreateAppointmentParams): AppointmentData => ({
    appointmentId: params.id,
    doctor: params.doctorData,
    appointmentDate: params.date,
    appointmentTime: params.time,
    appointmentType: params.appointmentType,
    visitType: params.visitType,
    status: params.status,
    price: params.price,
    ...params.options,
});

// Predefined doctors to reduce duplication
const doctors = {
    edalin: createDoctor('1', 'Dr. Edalin', '21', 'edalin@example.com', '+1 504 368 6874'),
    shanta: createDoctor('2', 'Dr. Shanta', '13', 'shanta@example.com', '+1 832 891 8403'),
    john: createDoctor('3', 'Dr. John', '14', 'john@example.com', '+1 749 104 6291'),
    susan: createDoctor('4', 'Dr. Susan', '15', 'susan@example.com', '+1 584 920 7183'),
    juliet: createDoctor('5', 'Dr. Juliet', '16', 'juliet@example.com', '+1 059 327 6729'),
    michael: createDoctor('6', 'Dr. Michael', '17', 'michael@example.com', '+1 123 456 7890'),
};

export const mockAppointmentsData: AppointmentData[] = [
    // Upcoming Appointments
    createAppointment({
        id: '#Apt0001',
        doctorData: doctors.edalin,
        date: '2024-11-11',
        time: '10:45 AM',
        appointmentType: 'video_call',
        visitType: 'General Visit',
        status: 'upcoming',
        price: '$300',
    }),
    createAppointment({
        id: '#Apt0002',
        doctorData: doctors.shanta,
        date: '2024-11-05',
        time: '11:50 AM',
        appointmentType: 'audio_call',
        visitType: 'General Visit',
        status: 'upcoming',
        price: '$250',
        options: { isNew: true },
    }),
    createAppointment({
        id: '#Apt0003',
        doctorData: doctors.john,
        date: '2024-10-27',
        time: '09:30 AM',
        appointmentType: 'video_call',
        visitType: 'General Visit',
        status: 'upcoming',
        price: '$400',
    }),
    createAppointment({
        id: '#Apt0004',
        doctorData: doctors.susan,
        date: '2024-10-18',
        time: '12:20 PM',
        appointmentType: 'direct_visit',
        visitType: 'General Visit',
        status: 'upcoming',
        price: '$350',
    }),
    createAppointment({
        id: '#Apt0005',
        doctorData: doctors.juliet,
        date: '2024-10-10',
        time: '11:30 AM',
        appointmentType: 'chat',
        visitType: 'General Visit',
        status: 'upcoming',
        price: '$200',
    }),
    createAppointment({
        id: '#Apt0006',
        doctorData: doctors.michael,
        date: '2024-10-05',
        time: '02:30 PM',
        appointmentType: 'video_call',
        visitType: 'Consultation',
        status: 'upcoming',
        price: '$280',
    }),
    createAppointment({
        id: '#Apt0007',
        doctorData: doctors.michael,
        date: '2024-10-05',
        time: '02:30 PM',
        appointmentType: 'video_call',
        visitType: 'Consultation',
        status: 'upcoming',
        price: '$280',
    }),
    createAppointment({
        id: '#Apt0008',
        doctorData: doctors.michael,
        date: '2024-10-05',
        time: '02:30 PM',
        appointmentType: 'video_call',
        visitType: 'Consultation',
        status: 'upcoming',
        price: '$280',
    }),
    createAppointment({
        id: '#Apt0009',
        doctorData: doctors.michael,
        date: '2024-10-05',
        time: '02:30 PM',
        appointmentType: 'video_call',
        visitType: 'Consultation',
        status: 'upcoming',
        price: '$280',
    }),
    createAppointment({
        id: '#Apt0010',
        doctorData: doctors.michael,
        date: '2024-10-05',
        time: '02:30 PM',
        appointmentType: 'video_call',
        visitType: 'Consultation',
        status: 'upcoming',
        price: '$280',
    }),

    // Cancelled Appointments
    createAppointment({
        id: '#Apt0011',
        doctorData: doctors.edalin,
        date: '2024-11-11',
        time: '10:45 AM',
        appointmentType: 'video_call',
        visitType: 'General Visit',
        status: 'cancelled',
        price: '$300',
    }),
    createAppointment({
        id: '#Apt0012',
        doctorData: doctors.shanta,
        date: '2024-11-05',
        time: '11:50 AM',
        appointmentType: 'audio_call',
        visitType: 'General Visit',
        status: 'cancelled',
        price: '$250',
        options: { isNew: true },
    }),
    createAppointment({
        id: '#Apt0013',
        doctorData: doctors.john,
        date: '2024-10-27',
        time: '09:30 AM',
        appointmentType: 'video_call',
        visitType: 'General Visit',
        status: 'cancelled',
        price: '$400',
    }),
    createAppointment({
        id: '#Apt0014',
        doctorData: doctors.susan,
        date: '2024-10-15',
        time: '03:15 PM',
        appointmentType: 'direct_visit',
        visitType: 'Follow-up',
        status: 'cancelled',
        price: '$350',
    }),

    // Completed Appointments
    createAppointment({
        id: '#Apt0021',
        doctorData: doctors.edalin,
        date: '2024-09-15',
        time: '10:45 AM',
        appointmentType: 'video_call',
        visitType: 'General Visit',
        status: 'completed',
        price: '$300',
        options: { hasReview: false },
    }),
    createAppointment({
        id: '#Apt0022',
        doctorData: doctors.shanta,
        date: '2024-09-10',
        time: '11:50 AM',
        appointmentType: 'audio_call',
        visitType: 'General Visit',
        status: 'completed',
        price: '$250',
        options: { isNew: true, hasReview: true },
    }),
    createAppointment({
        id: '#Apt0023',
        doctorData: doctors.john,
        date: '2024-09-05',
        time: '09:30 AM',
        appointmentType: 'video_call',
        visitType: 'General Visit',
        status: 'completed',
        price: '$400',
        options: { hasReview: true },
    }),
    createAppointment({
        id: '#Apt0024',
        doctorData: doctors.susan,
        date: '2024-08-28',
        time: '12:20 PM',
        appointmentType: 'direct_visit',
        visitType: 'General Visit',
        status: 'completed',
        price: '$350',
        options: { hasReview: true },
    }),
    createAppointment({
        id: '#Apt0025',
        doctorData: doctors.juliet,
        date: '2024-08-20',
        time: '11:30 AM',
        appointmentType: 'chat',
        visitType: 'General Visit',
        status: 'completed',
        price: '$200',
        options: { hasReview: true },
    }),
    createAppointment({
        id: '#Apt0026',
        doctorData: doctors.michael,
        date: '2024-08-15',
        time: '02:00 PM',
        appointmentType: 'video_call',
        visitType: 'Consultation',
        status: 'completed',
        price: '$280',
        options: { hasReview: false },
    }),
];

export type { AppointmentData } from '../types/appointment.types';
