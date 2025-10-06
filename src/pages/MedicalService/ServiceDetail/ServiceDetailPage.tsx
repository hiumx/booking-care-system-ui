import React from 'react';
import { useParams } from 'react-router-dom';
import ProfilePage from '@/components/ProfilePage';
import {
    mockService,
    mockSpecialty,
    mockHospital,
    mockPosition,
    mockPrices,
    mockDoctorPrices,
    mockAppointments,
    reviews,
} from '@/pages/MedicalService/ServiceDetail/sharedMockData';

const ServiceDetailPage: React.FC = () => {
    const { servicesparentId, serviceschildId } = useParams<{
        servicesparentId: string;
        serviceschildId: string;
    }>();

    return (
        <ProfilePage
            type="service"
            profile={mockService}
            hospital={mockHospital}
            specialty={mockSpecialty}
            specialties={[mockSpecialty, mockSpecialty, mockSpecialty]} // Mock multiple specialties
            position={mockPosition}
            reviews={reviews}
            appointments={mockAppointments}
            prices={mockPrices}
            doctorPrices={mockDoctorPrices}
            servicesparentId={servicesparentId}
            serviceschildId={serviceschildId}
        />
    );
};

export default ServiceDetailPage;
