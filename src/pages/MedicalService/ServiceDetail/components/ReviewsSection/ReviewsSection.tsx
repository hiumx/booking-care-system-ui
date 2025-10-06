import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './ReviewsSection.module.scss';
import Pagination from '@/components/Pagination';
import ReviewCard from '@/components/ReviewCard';
import Button from '@/components/Button';
import Review from '../Review/Review';

interface Review {
    id: number;
    patient_id: number;
    doctor_id: number;
    appointment_id: number;
    rating: number;
    comment: string;
    recommend: boolean;
    parent_review_id: number | null;
    created_at: string;
    updated_at: string;
    timeAgo: string;
    userId: number;
    user: {
        id: number;
        account_id: number;
        email: string;
        first_name: string;
        last_name: string;
        gender: string;
        address: string;
        phone: string;
        avatar_url: string;
        created_at: string;
        updated_at: string;
    };
    replies?: Array<{
        id: number;
        patient_id: number;
        doctor_id: number;
        appointment_id: number | null;
        rating: number | null;
        comment: string;
        recommend: boolean;
        parent_review_id: number;
        created_at: string;
        updated_at: string;
        userId: number;
        user: {
            id: number;
            account_id: number;
            email: string;
            first_name: string;
            last_name: string;
            gender: string;
            address: string;
            phone: string;
            avatar_url: string;
            created_at: string;
            updated_at: string;
        };
    }>;
}

interface ReviewsSectionProps {
    reviews: Review[];
    doctorName: string;
    currentUserId: number;
    onSubmitReview: (reviewData: {
        rating: number;
        description: string;
        termsAccepted: boolean;
    }) => void;
    onReplySubmission: (replyData: { reviewId: number; text: string }) => void;
    onEditReview: (reviewData: {
        reviewId: number;
        rating: number;
        description: string;
        recommend?: boolean;
    }) => void;
    onDeleteReview: (reviewId: number) => void;
    onEditReply: (replyData: { replyId: number; text: string }) => void;
    onDeleteReply: (replyId: number) => void;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
    reviews,
    doctorName,
    currentUserId,
    onSubmitReview,
    onReplySubmission,
    onEditReview,
    onDeleteReview,
    onEditReply,
    onDeleteReply,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [showWriteReview, setShowWriteReview] = useState(false);

    const pageSize = 2;
    const totalPages = Math.ceil(reviews.length / pageSize);
    const displayedReviews = reviews.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div id="review">
            <div className="detail-title">
                <h4>Đánh giá ({reviews.length})</h4>
            </div>

            {/* Write Review Section */}
            <div className="write-review-section mb-4">
                {!showWriteReview ? (
                    <Button
                        text="Viết đánh giá"
                        type="button"
                        className="btn-primary"
                        onClick={() => setShowWriteReview(true)}
                    />
                ) : (
                    <Review doctorName={doctorName} onSubmitReview={onSubmitReview} />
                )}

                {showWriteReview && (
                    <Button
                        text="Hủy"
                        type="button"
                        className={clsx('mt-2', styles.cancelButton)}
                        onClick={() => setShowWriteReview(false)}
                    />
                )}
            </div>

            {displayedReviews.map((review, index) => (
                <ReviewCard
                    key={review.id}
                    review={{
                        id: review.id,
                        name: `${review.user.first_name} ${review.user.last_name}`,
                        avatar: review.user.avatar_url,
                        rating: review.rating,
                        timeAgo: review.timeAgo,
                        text: review.comment,
                        recommend: review.recommend,
                        userId: review.userId,
                        isEditable: true,
                        replies: review.replies?.map((reply) => ({
                            id: reply.id,
                            name: `${reply.user.first_name} ${reply.user.last_name}`,
                            avatar: reply.user.avatar_url,
                            text: reply.comment,
                            userId: reply.userId,
                        })),
                    }}
                    isLast={index === displayedReviews.length - 1}
                    onReply={onReplySubmission}
                    canEdit={true}
                    canDelete={true}
                    currentUserId={currentUserId}
                    onEdit={onEditReview}
                    onDelete={onDeleteReview}
                    onEditReply={onEditReply}
                    onDeleteReply={onDeleteReply}
                />
            ))}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default ReviewsSection;
