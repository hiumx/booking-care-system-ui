import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import ProfileCard from '@/components/ProfileCard';
import ProfileDetails from '@/components/ProfileDetails';
import ReviewsSection from '@/pages/MedicalService/ServiceDetail/components/ReviewsSection';
import { useReviewHandlers } from '@/hooks/useProfileHandlers';
import {
    ProfileType,
    ProfileData,
    Hospital,
    Specialty,
    Position,
    Review,
    Appointment,
    Price,
    DoctorPrice,
} from '@/types/profile.types';
import { buildPath, replacePathParams, PATHS } from '@/routes/paths';

interface ProfilePageProps {
    type: ProfileType;
    profile: ProfileData;
    hospital: Hospital;
    specialty: Specialty;
    specialties?: Specialty[];
    position?: Position;
    reviews: Review[];
    appointments: Appointment[];
    prices: Price[];
    doctorPrices: DoctorPrice[];
    servicesparentId?: string;
    serviceschildId?: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
    type,
    profile,
    hospital,
    specialty,
    specialties,
    position,
    reviews,
    appointments,
    prices,
    doctorPrices,
    servicesparentId,
    serviceschildId,
}) => {
    const { id } = useParams<{ id: string }>();

    // Mock current user ID for demo purposes
    const currentUserId = 101;

    // Use shared hooks
    const reviewHandlers = useReviewHandlers();
    let breadcrumbData = null;
    if (type === 'doctor') {
        breadcrumbData = {
            items: [
                { label: '', path: '/', isActive: false },
                { label: 'Hồ sơ bác sĩ', isActive: true },
            ],
            title: 'Hồ sơ bác sĩ',
        };
    } else {
        breadcrumbData = {
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
    }

    // Get display name based on type
    const getDisplayName = () => {
        if (type === 'doctor') {
            const doctorProfile = profile as any;
            return `${doctorProfile.last_name} ${doctorProfile.first_name}`;
        } else {
            const serviceProfile = profile as any;
            return serviceProfile.name;
        }
    };

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
            <div className="content">
                <div className="container">
                    <ProfileCard
                        type={type}
                        profile={profile}
                        hospital={hospital}
                        specialty={specialty}
                        reviews={reviews}
                        appointments={appointments}
                        prices={prices}
                        doctorPrices={doctorPrices}
                        profileId={id || ''}
                    />
                    <ProfileDetails
                        type={type}
                        profile={profile}
                        hospital={hospital}
                        specialty={specialty}
                        specialties={specialties}
                        position={position}
                    />
                    <ReviewsSection
                        reviews={reviews}
                        doctorName={getDisplayName()}
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

export default ProfilePage;
