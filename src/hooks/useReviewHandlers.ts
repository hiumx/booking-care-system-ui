import { toast } from 'react-toastify';
import { ReviewService } from '@/services/review.service';
import { TargetType } from '@/types/review.types';

interface UseReviewHandlersProps {
    targetType: TargetType;
    targetId: string | undefined;
    currentUserId: string | undefined;
    currentAccountId: string | undefined;
    targetName: string;
    hospitalId: string | undefined;
    refetchReviews: () => Promise<void>;
    refetchStatistics: () => Promise<void>;
}

/**
 * Helper function to get entity type text based on target type
 */
const getEntityTypeText = (targetType: TargetType): string => {
    return targetType === TargetType.DOCTOR ? 'bác sĩ' : 'dịch vụ';
};

/**
 * Helper function to build review payload based on target type
 */
const buildReviewPayload = (
    targetType: TargetType,
    targetId: string,
    currentUserId: string,
    reviewData: { rating: number; description: string },
    hospitalId?: string
) => {
    const payload: any = {
        patientId: currentUserId,
        targetType,
        rating: reviewData.rating,
        comment: reviewData.description,
    };

    if (targetType === TargetType.DOCTOR) {
        payload.doctorId = targetId;
    } else if (targetType === TargetType.SERVICE) {
        payload.serviceId = targetId;
    }

    // Add hospitalId if provided
    if (hospitalId) {
        payload.hospitalId = hospitalId;
    }

    return payload;
};

/**
 * Helper function to handle review creation errors
 */
const handleReviewError = (err: any, targetType: TargetType) => {
    console.error('Error creating review:', err);

    const errorMessage = err.message || '';
    const entityType = getEntityTypeText(targetType);

    if (errorMessage.includes('appointment')) {
        const prefix = targetType === TargetType.DOCTOR ? 'lịch hẹn với' : '';
        toast.error(`Bạn cần hoàn thành ${prefix} ${entityType} này trước khi đánh giá.`, {
            position: 'top-center',
            autoClose: 4000,
        });
        return;
    }

    if (errorMessage.includes('already reviewed')) {
        toast.error(`Bạn đã đánh giá ${entityType} này rồi. Vui lòng cập nhật đánh giá hiện tại.`, {
            position: 'top-center',
            autoClose: 4000,
        });
        return;
    }

    toast.error('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.', {
        position: 'top-center',
        autoClose: 4000,
    });
};

/**
 * Custom hook to handle review operations (create, update, delete, reply)
 * Reduces code duplication across Doctor and Service profile pages
 */
export const useReviewHandlers = ({
    targetType,
    targetId,
    currentUserId,
    currentAccountId,
    hospitalId,
    refetchReviews,
    refetchStatistics,
}: UseReviewHandlersProps) => {
    const handleSubmitReview = async (reviewData: {
        rating: number;
        description: string;
        termsAccepted: boolean;
    }) => {
        if (!targetId || !currentUserId) return;

        try {
            const payload = buildReviewPayload(
                targetType,
                targetId,
                currentUserId,
                reviewData,
                hospitalId
            );
            await ReviewService.createReview(payload);
            await refetchReviews();
            await refetchStatistics();

            toast.success('Đã gửi đánh giá thành công!', {
                position: 'top-right',
                autoClose: 2000,
            });
        } catch (err: any) {
            handleReviewError(err, targetType);
        }
    };

    const handleReplySubmission = async (replyData: { reviewId: string; text: string }) => {
        if (!currentAccountId) return;

        try {
            await ReviewService.createReply({
                reviewId: replyData.reviewId,
                authorId: currentAccountId,
                content: replyData.text,
            });
            await refetchReviews();

            toast.success('Đã gửi phản hồi thành công!', {
                position: 'top-right',
                autoClose: 2000,
            });
        } catch (err) {
            console.error('Error creating reply:', err);
            toast.error('Có lỗi xảy ra khi gửi phản hồi. Vui lòng thử lại.', {
                position: 'top-center',
                autoClose: 4000,
            });
        }
    };

    const handleEditReview = async (reviewData: {
        reviewId: string;
        rating: number;
        description: string;
    }) => {
        try {
            await ReviewService.updateReview({
                id: reviewData.reviewId,
                rating: reviewData.rating,
                comment: reviewData.description,
            });
            await refetchReviews();
            await refetchStatistics();

            toast.success('Đã cập nhật đánh giá thành công!', {
                position: 'top-right',
                autoClose: 2000,
            });
        } catch (err) {
            console.error('Error updating review:', err);
            toast.error('Có lỗi xảy ra khi cập nhật đánh giá. Vui lòng thử lại.', {
                position: 'top-center',
                autoClose: 4000,
            });
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        try {
            await ReviewService.deleteReview(reviewId);
            await refetchReviews();
            await refetchStatistics();

            toast.success('Đã xóa đánh giá thành công!', {
                position: 'top-right',
                autoClose: 2000,
            });
        } catch (err) {
            console.error('Error deleting review:', err);
            toast.error('Có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại.', {
                position: 'top-center',
                autoClose: 4000,
            });
        }
    };

    const handleEditReply = async (replyData: {
        reviewId: string;
        replyId: string;
        text: string;
    }) => {
        try {
            await ReviewService.updateReply({
                reviewId: replyData.reviewId,
                replyId: replyData.replyId,
                content: replyData.text,
            });
            await refetchReviews();

            toast.success('Đã cập nhật phản hồi thành công!', {
                position: 'top-right',
                autoClose: 2000,
            });
        } catch (err) {
            console.error('Error updating reply:', err);
            toast.error('Có lỗi xảy ra khi cập nhật phản hồi. Vui lòng thử lại.', {
                position: 'top-center',
                autoClose: 4000,
            });
        }
    };

    const handleDeleteReply = async (replyId: string, reviewId: string) => {
        try {
            await ReviewService.deleteReply(reviewId, replyId);
            await refetchReviews();

            toast.success('Đã xóa phản hồi thành công!', {
                position: 'top-right',
                autoClose: 2000,
            });
        } catch (err) {
            console.error('Error deleting reply:', err);
            toast.error('Có lỗi xảy ra khi xóa phản hồi. Vui lòng thử lại.', {
                position: 'top-center',
                autoClose: 4000,
            });
        }
    };

    return {
        handleSubmitReview,
        handleReplySubmission,
        handleEditReview,
        handleDeleteReview,
        handleEditReply,
        handleDeleteReply,
    };
};
