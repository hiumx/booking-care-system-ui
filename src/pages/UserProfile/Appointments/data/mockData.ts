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

// Helper function to create appointment data
const createAppointment = (
    id: string,
    doctorData: ReturnType<typeof createDoctor>,
    date: string,
    time: string,
    appointmentType: AppointmentType,
    visitType: string,
    status: AppointmentStatus,
    price: string,
    options: { isNew?: boolean; hasReview?: boolean } = {}
): AppointmentData => ({
    appointmentId: id,
    doctor: doctorData,
    appointmentDate: date,
    appointmentTime: time,
    appointmentType,
    visitType,
    status,
    price,
    ...options,
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
    createAppointment(
        '#Apt0001',
        doctors.edalin,
        '2024-11-11',
        '10:45 AM',
        'video_call',
        'General Visit',
        'upcoming',
        '$300'
    ),
    createAppointment(
        '#Apt0002',
        doctors.shanta,
        '2024-11-05',
        '11:50 AM',
        'audio_call',
        'General Visit',
        'upcoming',
        '$250',
        { isNew: true }
    ),
    createAppointment(
        '#Apt0003',
        doctors.john,
        '2024-10-27',
        '09:30 AM',
        'video_call',
        'General Visit',
        'upcoming',
        '$400'
    ),
    createAppointment(
        '#Apt0004',
        doctors.susan,
        '2024-10-18',
        '12:20 PM',
        'direct_visit',
        'General Visit',
        'upcoming',
        '$350'
    ),
    createAppointment(
        '#Apt0005',
        doctors.juliet,
        '2024-10-10',
        '11:30 AM',
        'chat',
        'General Visit',
        'upcoming',
        '$200'
    ),
    createAppointment(
        '#Apt0006',
        doctors.michael,
        '2024-10-05',
        '02:30 PM',
        'video_call',
        'Consultation',
        'upcoming',
        '$280'
    ),
    createAppointment(
        '#Apt0007',
        doctors.michael,
        '2024-10-05',
        '02:30 PM',
        'video_call',
        'Consultation',
        'upcoming',
        '$280'
    ),
    createAppointment(
        '#Apt0008',
        doctors.michael,
        '2024-10-05',
        '02:30 PM',
        'video_call',
        'Consultation',
        'upcoming',
        '$280'
    ),
    createAppointment(
        '#Apt0009',
        doctors.michael,
        '2024-10-05',
        '02:30 PM',
        'video_call',
        'Consultation',
        'upcoming',
        '$280'
    ),
    createAppointment(
        '#Apt0010',
        doctors.michael,
        '2024-10-05',
        '02:30 PM',
        'video_call',
        'Consultation',
        'upcoming',
        '$280'
    ),

    // Cancelled Appointments
    createAppointment(
        '#Apt0011',
        doctors.edalin,
        '2024-11-11',
        '10:45 AM',
        'video_call',
        'General Visit',
        'cancelled',
        '$300'
    ),
    createAppointment(
        '#Apt0012',
        doctors.shanta,
        '2024-11-05',
        '11:50 AM',
        'audio_call',
        'General Visit',
        'cancelled',
        '$250',
        { isNew: true }
    ),
    createAppointment(
        '#Apt0013',
        doctors.john,
        '2024-10-27',
        '09:30 AM',
        'video_call',
        'General Visit',
        'cancelled',
        '$400'
    ),
    createAppointment(
        '#Apt0014',
        doctors.susan,
        '2024-10-15',
        '03:15 PM',
        'direct_visit',
        'Follow-up',
        'cancelled',
        '$350'
    ),

    // Completed Appointments
    createAppointment(
        '#Apt0021',
        doctors.edalin,
        '2024-09-15',
        '10:45 AM',
        'video_call',
        'General Visit',
        'completed',
        '$300',
        { hasReview: false }
    ),
    createAppointment(
        '#Apt0022',
        doctors.shanta,
        '2024-09-10',
        '11:50 AM',
        'audio_call',
        'General Visit',
        'completed',
        '$250',
        { isNew: true, hasReview: true }
    ),
    createAppointment(
        '#Apt0023',
        doctors.john,
        '2024-09-05',
        '09:30 AM',
        'video_call',
        'General Visit',
        'completed',
        '$400',
        { hasReview: true }
    ),
    createAppointment(
        '#Apt0024',
        doctors.susan,
        '2024-08-28',
        '12:20 PM',
        'direct_visit',
        'General Visit',
        'completed',
        '$350',
        { hasReview: true }
    ),
    createAppointment(
        '#Apt0025',
        doctors.juliet,
        '2024-08-20',
        '11:30 AM',
        'chat',
        'General Visit',
        'completed',
        '$200',
        { hasReview: true }
    ),
    createAppointment(
        '#Apt0026',
        doctors.michael,
        '2024-08-15',
        '02:00 PM',
        'video_call',
        'Consultation',
        'completed',
        '$280',
        { hasReview: false }
    ),
];

export type { AppointmentData } from '../types/appointment.types';
