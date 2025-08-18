import React from 'react';
import DoctorProfileCard from '@/pages/DoctorProfile/components/DoctorProfileCard';
import DoctorDetails from '@/pages/DoctorProfile/components/DoctorDetails';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';

const breadcrumbData = {
    items: [
        { label: '', path: '/', isActive: false },
        { label: 'Hồ sơ bác sĩ', isActive: true },
    ],
    title: 'Hồ sơ bác sĩ',
};

const DoctorProfile: React.FC = () => {
    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
            <div className="content">
                <div className="container">
                    <DoctorProfileCard />
                    <DoctorDetails />
                </div>
            </div>
        </MainLayout>
    );
};

export default DoctorProfile;
