import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import ProfileCard from '@/components/ProfileCard';
import ProfileDetails from '@/components/ProfileDetails';
import ReviewsSection from './components/ReviewsSection';
import { useReviewHandlers } from '@/hooks/useProfileHandlers';
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
import { replacePathParams, buildPath, PATHS } from '@/routes/paths';

const ServiceDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { servicesparentId, serviceschildId } = useParams<{
        servicesparentId: string;
        serviceschildId: string;
    }>();

    // Mock current user ID for demo purposes
    const currentUserId = 101;

    // Use shared hooks
    const reviewHandlers = useReviewHandlers();
    const breadcrumbData = {
        items: [
            { label: 'Trang chủ', path: '/', isActive: false },
            {
                label: 'Dịch Vụ Y Tế',
                path: replacePathParams(buildPath(PATHS.Service.CATEGORIES), {
                    servicesparentId: servicesparentId!.toString(),
                }),
                isActive: false,
            },
            {
                label: 'Chuyên Khoa Tiêu Hóa',
                path: replacePathParams(PATHS.Service.HOSPITALS, {
                    servicesparentId: servicesparentId!.toString(),
                    serviceschildId: serviceschildId!.toString(),
                }),
                isActive: false,
            },
            { label: 'Chuyên Khoa Tiêu Hóa', isActive: true },
        ],
        title: 'Chuyên Khoa Tiêu Hóa',
    };
    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
            <div className="content">
                <div className="container">
                    <ProfileCard
                        type="service"
                        profile={mockService}
                        hospital={mockHospital}
                        specialty={mockSpecialty}
                        reviews={reviews}
                        appointments={mockAppointments}
                        prices={mockPrices}
                        doctorPrices={mockDoctorPrices}
                        profileId={id || ''}
                    />
                    <ProfileDetails
                        type="service"
                        profile={mockService}
                        hospital={mockHospital}
                        specialty={mockSpecialty}
                        specialties={[mockSpecialty, mockSpecialty, mockSpecialty]} // Mock multiple specialties
                        position={mockPosition}
                    />
                    <ReviewsSection
                        reviews={reviews}
                        doctorName={mockService.name}
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

export default ServiceDetailPage;
