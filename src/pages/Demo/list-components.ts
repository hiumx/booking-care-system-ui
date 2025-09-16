import { DoctorAppointmentBookingCard } from '@/pages/Doctor/DoctorList/components/DoctorAppointmentBookingCard';
import type { ComponentType } from 'react';

const COMPONENTS: Array<{
    title: string;
    description: string;
    component: ComponentType<any>;
    mockData: any;
}> = [
    {
        title: 'Doctor Appointment Booking Card',
        description: 'A card component for booking doctor appointments.',
        component: DoctorAppointmentBookingCard,
        mockData: {
            name: 'Dr. Charles Scott',
            specialty: 'Neurologist',
            position: 'MBBS, DNB - Neurology',
            bookCounts: 100,
            rating: 4.8,
            location: 'Hamshire, TX',
            yearsOfExperience: 10,
            fees: 600,
            isFavorite: false,
            likeCounts: 287,
            dislikeCounts: 35,
            nextAvailableTime: '10:00 AM - 15 Oct, Tue',
            image: './src/assets/img/doctor-grid/doctor-list-01.jpg',
        },
    },
];

export default COMPONENTS;
