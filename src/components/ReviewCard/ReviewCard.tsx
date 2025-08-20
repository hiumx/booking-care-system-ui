import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from '@/pages/Doctor/DoctorProfile/DoctorProfile.module.scss';

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
}

const ReviewCard: React.FC<ReviewCardProps> = ({
    review,
    isLast = false,
    showReplyLink = true,
    maxTextLength = 200,
}) => {
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

    return (
        <div
            className={clsx('doc-review-card', { 'mb-0': isLast })}
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
                    className={clsx(styles.link, 'reply', 'd-flex', 'align-items-center')}
                    onClick={(e) => e.preventDefault()}
                    aria-label="Reply to this review"
                >
                    <i className="fa-solid fa-reply me-2" aria-hidden="true"></i>Reply
                </Link>
            )}
            {review.replies && review.replies.length > 0 && (
                <div className="replies-section" aria-label="Replies to review">
                    {review.replies.map((reply) => (
                        <div key={reply.id} className="replied-info">
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
                                        'align-items-center'
                                    )}
                                    onClick={(e) => e.preventDefault()}
                                    aria-label="Reply to this reply"
                                >
                                    <i className="fa-solid fa-reply me-2" aria-hidden="true"></i>
                                    Reply
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewCard;
