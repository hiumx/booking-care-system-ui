import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import ProfileCard from '@/components/ProfileCard';
import ProfileDetails from '@/components/ProfileDetails';
import ReviewsSection from '@/pages/MedicalService/ServiceDetail/components/ReviewsSection';
import { useReviewHandlers, useBreadcrumbData } from '@/hooks/useProfileHandlers';
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
    const { id } = useParams<{ id: string }>();

    // Mock current user ID for demo purposes
    const currentUserId = 101;

    // Use shared hooks
    const reviewHandlers = useReviewHandlers();
    const breadcrumbData = useBreadcrumbData('doctor');

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
            <div className="content">
                <div className="container">
                    <ProfileCard
                        type="doctor"
                        profile={mockDoctor}
                        hospital={mockHospital}
                        specialty={mockSpecialty}
                        reviews={reviews}
                        appointments={mockAppointments}
                        prices={mockPrices}
                        doctorPrices={mockDoctorPrices}
                        profileId={id || ''}
                    />
                    <ProfileDetails
                        type="doctor"
                        profile={mockDoctor}
                        hospital={mockHospital}
                        specialty={mockSpecialty}
                        position={mockPosition}
                    />
                    <ReviewsSection
                        reviews={reviews}
                        doctorName={`${mockDoctor.last_name} ${mockDoctor.first_name}`}
                        currentUserId={currentUserId}
                        onSubmitReview={reviewHandlers.handleSubmitReview}
                        onReplySubmission={reviewHandlers.handleReplySubmission}
                        onEditReview={reviewHandlers.handleEditReview}
                        onDeleteReview={reviewHandlers.handleDeleteReview}
                        onEditReply={reviewHandlers.handleEditReply}
                        onDeleteReply={reviewHandlers.handleDeleteReply}
                    />
                </div>
            </div>
        </MainLayout>
    );
};

export default DoctorProfile;
