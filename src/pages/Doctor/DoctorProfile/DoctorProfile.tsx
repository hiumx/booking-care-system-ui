import React from 'react';
import ProfilePage from '@/components/ProfilePage';
import {
    mockDoctor,
    mockSpecialty,
    mockHospital,
    mockPosition,
    mockPrices,
    mockDoctorPrices,
    mockAppointments,
    reviews,
} from '@/pages/MedicalService/ServiceDetail/sharedMockData';

const DoctorProfile: React.FC = () => {
    return (
        <ProfilePage
            type="doctor"
            profile={mockDoctor}
            hospital={mockHospital}
            specialty={mockSpecialty}
            position={mockPosition}
            reviews={reviews}
            appointments={mockAppointments}
            prices={mockPrices}
            doctorPrices={mockDoctorPrices}
        />
    );
};

export default DoctorProfile;
