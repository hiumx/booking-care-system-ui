import React from 'react';
import DoctorProfileCard from '@/pages/DoctorProfile/components/DoctorProfileCard';
import DoctorDetails from '@/pages/DoctorProfile/components/DoctorDetails';

const DoctorProfile: React.FC = () => {
    return (
        <div className="content">
            <div className="container">
                <DoctorProfileCard />
                <DoctorDetails />
            </div>
        </div>
    );
};

export default DoctorProfile;
