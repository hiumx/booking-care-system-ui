// Mock data for Appointments (shared)
export const mockAppointments = Array.from({ length: 200 }, (_, index) => ({
    id: 201 + index,
    patient_id: 100 + (index % 50) + 1,
    doctor_id: 1,
    clinic_id: 1,
    appointment_time_id: 1,
    appointment_date: new Date(Date.now() - index * 86400000).toISOString(),
    price_id: index % 2 === 0 ? 1 : 2,
    status: 'COMPLETED',
    type: 'IN_PERSON',
    reason: `Check-up ${index + 1}`,
    result: `Successful visit ${index + 1}`,
    created_at: new Date(Date.now() - index * 86400000).toISOString(),
    updated_at: new Date(Date.now() - index * 86400000).toISOString(),
}));

// Common utility functions
export const getDisplayText = (
    bio: string | undefined,
    isExpanded: boolean,
    isLong: boolean,
    textLimit: number
) => {
    if (!bio) {
        return '';
    }
    if (isExpanded || !isLong) {
        return bio;
    }
    return bio.slice(0, textLimit) + '...';
};

export const scrollToSection = (el: HTMLDivElement | null) => {
    el?.scrollIntoView({ behavior: 'smooth' });
};

export const calculatePriceRange = (prices: { amount: number }[]) => {
    if (prices.length === 0) {
        return 'N/A';
    }
    const amounts = prices.map((price) => price.amount);
    return `${Math.min(...amounts).toLocaleString('vi-VN')}đ - ${Math.max(...amounts).toLocaleString('vi-VN')}đ`;
};

export const calculateAverageRating = (reviews: { rating: number }[]) => {
    if (reviews.length === 0) {
        return '0.0';
    }
    return (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1);
};

/**
 * Format average rating from review statistics
 * @param averageRating - The average rating value
 * @returns Formatted average rating as a string with 1 decimal place
 */
export const formatAverageRating = (averageRating: number | undefined): string => {
    return averageRating ? averageRating.toFixed(1) : '0.0';
};

export const countAppointments = (appointments: any[], doctorId: number | string) => {
    return appointments.filter((apt) => apt.doctor_id === Number(doctorId)).length;
};

// Common review handlers (shared logic)
export const createReviewHandlers = () => ({
    handleSubmitReview: (reviewData: {
        rating: number;
        description: string;
        termsAccepted: boolean;
    }) => {
        console.log('New review submitted:', reviewData);
        alert('Đánh giá của bạn đã được gửi thành công!');
    },

    handleReplySubmission: (replyData: { reviewId: number; text: string }) => {
        console.log('New reply submitted:', replyData);
        alert('Phản hồi của bạn đã được gửi thành công!');
    },

    handleEditReview: (reviewData: {
        reviewId: number;
        rating: number;
        description: string;
        recommend?: boolean;
    }) => {
        console.log('Review edited:', reviewData);
        alert('Đánh giá của bạn đã được cập nhật thành công!');
    },

    handleDeleteReview: (reviewId: number) => {
        console.log('Review deleted:', reviewId);
        alert('Đánh giá đã được xóa thành công!');
    },

    handleEditReply: (replyData: { replyId: number; text: string }) => {
        console.log('Reply edited:', replyData);
        alert('Phản hồi đã được cập nhật thành công!');
    },

    handleDeleteReply: (replyId: number) => {
        console.log('Reply deleted:', replyId);
        alert('Phản hồi đã được xóa thành công!');
    },
});
