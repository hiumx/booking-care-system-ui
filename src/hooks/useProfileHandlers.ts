import { useCallback } from 'react';
import { ProfileType, Review } from '@/types/profile.types';

// Hook for review handlers
export const useReviewHandlers = () => {
    const handleSubmitReview = useCallback(
        (reviewData: { rating: number; description: string; termsAccepted: boolean }) => {
            console.log('New review submitted:', reviewData);
            alert('Đánh giá của bạn đã được gửi thành công!');
        },
        []
    );

    const handleReplySubmission = useCallback((replyData: { reviewId: number; text: string }) => {
        console.log('New reply submitted:', replyData);
        alert('Phản hồi của bạn đã được gửi thành công!');
    }, []);

    const handleEditReview = useCallback(
        (reviewData: {
            reviewId: number;
            rating: number;
            description: string;
            recommend?: boolean;
        }) => {
            console.log('Review edited:', reviewData);
            alert('Đánh giá của bạn đã được cập nhật thành công!');
        },
        []
    );

    const handleDeleteReview = useCallback((reviewId: number) => {
        console.log('Review deleted:', reviewId);
        alert('Đánh giá đã được xóa thành công!');
    }, []);

    const handleEditReply = useCallback((replyData: { replyId: number; text: string }) => {
        console.log('Reply edited:', replyData);
        alert('Phản hồi đã được cập nhật thành công!');
    }, []);

    const handleDeleteReply = useCallback((replyId: number) => {
        console.log('Reply deleted:', replyId);
        alert('Phản hồi đã được xóa thành công!');
    }, []);

    return {
        handleSubmitReview,
        handleReplySubmission,
        handleEditReview,
        handleDeleteReview,
        handleEditReply,
        handleDeleteReply,
    };
};

// Hook for profile data calculations
export const useProfileCalculations = (
    reviews: Review[],
    appointments: any[],
    profileId: number
) => {
    // Calculate average rating
    const averageRating =
        reviews.length > 0
            ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
            : '0.0';

    // Calculate recommendation percentage
    const recommendCount = reviews.filter((review) => review.recommend).length;
    const recommendPercentage =
        reviews.length > 0 ? Math.round((recommendCount / reviews.length) * 100) : 0;

    // Count completed appointments
    const appointmentCount = appointments.filter((apt) => apt.doctor_id === profileId).length;

    return {
        averageRating,
        recommendPercentage,
        appointmentCount,
    };
};

// Hook for breadcrumb data
export const useBreadcrumbData = (
    type: ProfileType,
    servicesparentId?: string,
    serviceschildId?: string
) => {
    if (type === 'doctor') {
        return {
            items: [
                { label: '', path: '/', isActive: false },
                { label: 'Hồ sơ bác sĩ', isActive: true },
            ],
            title: 'Hồ sơ bác sĩ',
        };
    } else {
        return {
            items: [
                { label: 'Trang chủ', path: '/', isActive: false },
                {
                    label: 'Dịch Vụ Y Tế',
                    path: `/services/${servicesparentId}`,
                    isActive: false,
                },
                {
                    label: 'Chuyên Khoa Tiêu Hóa',
                    path: `/services/${servicesparentId}/${serviceschildId}`,
                    isActive: false,
                },
                { label: 'Chuyên Khoa Tiêu Hóa', isActive: true },
            ],
            title: 'Chuyên Khoa Tiêu Hóa',
        };
    }
};
