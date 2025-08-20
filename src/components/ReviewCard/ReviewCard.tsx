import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from '@/pages/Doctor/DoctorProfile/DoctorProfile.module.scss';
import reviewStyles from './ReviewCard.module.scss';
import ReplyForm from './components/ReplyForm';

interface Reply {
    id: number;
    name: string;
    avatar?: string;
    text: string;
}

interface Review {
    id: number;
    name: string;
    avatar?: string;
    rating?: number;
    timeAgo?: string;
    text: string;
    recommend?: boolean;
    replies?: Reply[];
}

interface ReviewCardProps {
    review: Review;
    isLast?: boolean;
    showReplyLink?: boolean;
    maxTextLength?: number;
    onReply?: (replyData: { reviewId: number; text: string }) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
    review,
    isLast = false,
    showReplyLink = true,
    maxTextLength = 200,
    onReply,
}) => {
    const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
    const [replyToReplyId, setReplyToReplyId] = useState<number | null>(null);
    // Handle missing or invalid rating
    const displayRating =
        review.rating && review.rating >= 0 && review.rating <= 5 ? review.rating : 0;
    const truncatedText =
        review.text.length > maxTextLength
            ? `${review.text.slice(0, maxTextLength)}...`
            : review.text;

    // Recommendation logic
    const recommendStatus =
        review.recommend === true
            ? {
                  icon: 'fa-thumbs-up',
                  text: 'Đề xuất đặt lịch hẹn',
                  className: 'recommend-positive thumb-icon',
              }
            : review.recommend === false
              ? {
                    icon: 'fa-thumbs-down',
                    text: 'Không đề xuất đặt lịch hẹn',
                    className: 'recommend-negative',
                }
              : null;

    // Handle reply submission
    const handleReplySubmit = (replyData: { reviewId: number; text: string }) => {
        if (onReply) {
            onReply(replyData);
        }
        setShowReplyForm(false);
        setReplyToReplyId(null);
    };

    // Handle reply to main review
    const handleReplyToReview = () => {
        setShowReplyForm(true);
        setReplyToReplyId(null);
    };

    // Handle reply to a specific reply
    const handleReplyToReply = (replyId: number) => {
        setReplyToReplyId(replyId);
        setShowReplyForm(true);
    };

    // Handle cancel reply
    const handleCancelReply = () => {
        setShowReplyForm(false);
        setReplyToReplyId(null);
    };

    return (
        <div
            className={clsx('doc-review-card', reviewStyles.reviewCard, { 'mb-0': isLast })}
            role="article"
            aria-label={`Review by ${review.name}`}
        >
            <div className="user-info-review">
                <div className="reviewer-img">
                    <Link
                        to="#"
                        className={clsx(styles.link, 'avatar-img')}
                        onClick={(e) => e.preventDefault()}
                        aria-label={`View profile of ${review.name}`}
                    >
                        <img
                            src={review.avatar || '/default-avatar.png'}
                            alt={`${review.name}'s avatar`}
                            onError={(e) => {
                                e.currentTarget.src = '/default-avatar.png';
                            }}
                        />
                    </Link>
                    <div className="review-star">
                        <Link
                            to="#"
                            className={styles.link}
                            onClick={(e) => e.preventDefault()}
                            aria-label={`Review by ${review.name}`}
                        >
                            {review.name || 'Anonymous'}
                        </Link>
                        <div
                            className="rating"
                            role="img"
                            aria-label={`${displayRating} out of 5 stars`}
                        >
                            {Array.from({ length: 5 }).map((_, i) => (
                                <i
                                    key={i}
                                    className={clsx('fas fa-star', { filled: i < displayRating })}
                                    aria-hidden="true"
                                />
                            ))}
                            <span className="sr-only">{displayRating} out of 5 stars</span>
                            {review.timeAgo && (
                                <span className="time-ago" aria-hidden="true">
                                    {' | '}
                                    {review.timeAgo}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                {recommendStatus && (
                    <span
                        className={clsx('recommend-icon', recommendStatus.className)}
                        role="note"
                        aria-label={recommendStatus.text}
                    >
                        <i
                            className={clsx('fa-regular', recommendStatus.icon)}
                            aria-hidden="true"
                        ></i>{' '}
                        {recommendStatus.text}
                    </span>
                )}
            </div>
            <p>{truncatedText}</p>
            {showReplyLink && (
                <Link
                    to="#"
                    className={clsx(
                        styles.link,
                        'reply',
                        'd-flex',
                        'align-items-center',
                        reviewStyles.replyButton
                    )}
                    onClick={(e) => {
                        e.preventDefault();
                        handleReplyToReview();
                    }}
                    aria-label="Reply to this review"
                >
                    <i className="fa-solid fa-reply me-2" aria-hidden="true"></i>Phản hồi
                </Link>
            )}

            {/* Reply Form for main review */}
            {showReplyForm && replyToReplyId === null && (
                <div className={reviewStyles.replyFormContainer}>
                    <ReplyForm
                        reviewId={review.id}
                        onSubmitReply={handleReplySubmit}
                        onCancel={handleCancelReply}
                        placeholder="Viết phản hồi cho đánh giá này..."
                    />
                </div>
            )}
            {review.replies && review.replies.length > 0 && (
                <div
                    className={clsx('replies-section', reviewStyles.repliesSection)}
                    aria-label="Replies to review"
                >
                    {review.replies.map((reply) => (
                        <div
                            key={reply.id}
                            className={clsx('replied-info', reviewStyles.repliedInfo)}
                        >
                            <div className="user-info-review">
                                <div className="reviewer-img">
                                    <Link
                                        to="#"
                                        className={clsx(styles.link, 'avatar-img')}
                                        onClick={(e) => e.preventDefault()}
                                        aria-label={`View profile of ${reply.name}`}
                                    >
                                        <img
                                            src={reply.avatar || '/default-avatar.png'}
                                            alt={`${reply.name}'s avatar`}
                                            onError={(e) => {
                                                e.currentTarget.src = '/default-avatar.png';
                                            }}
                                        />
                                    </Link>
                                    <div className="review-star">
                                        <Link
                                            to="#"
                                            className={styles.link}
                                            onClick={(e) => e.preventDefault()}
                                            aria-label={`Reply by ${reply.name}`}
                                        >
                                            {reply.name || 'Anonymous'}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <p>{reply.text}</p>
                            {showReplyLink && (
                                <Link
                                    to="#"
                                    className={clsx(
                                        styles.link,
                                        'reply',
                                        'd-flex',
                                        'align-items-center',
                                        reviewStyles.replyButton
                                    )}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleReplyToReply(reply.id);
                                    }}
                                    aria-label="Reply to this reply"
                                >
                                    <i className="fa-solid fa-reply me-2" aria-hidden="true"></i>
                                    Phản hồi
                                </Link>
                            )}

                            {/* Reply Form for specific reply */}
                            {showReplyForm && replyToReplyId === reply.id && (
                                <div className={reviewStyles.replyFormContainer}>
                                    <ReplyForm
                                        reviewId={review.id}
                                        onSubmitReply={handleReplySubmit}
                                        onCancel={handleCancelReply}
                                        placeholder={`Phản hồi cho ${reply.name}...`}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewCard;
