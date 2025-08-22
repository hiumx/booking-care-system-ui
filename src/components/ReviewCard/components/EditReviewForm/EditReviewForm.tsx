import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Button from '@/components/Button';
import styles from './EditReviewForm.module.scss';

interface Review {
    id: number;
    rating: number;
    text: string;
    recommend?: boolean;
}

interface EditReviewFormProps {
    review: Review;
    onSubmitEdit: (reviewData: {
        reviewId: number;
        rating: number;
        description: string;
        recommend?: boolean;
    }) => void;
    onCancel: () => void;
}

const EditReviewForm: React.FC<EditReviewFormProps> = ({ review, onSubmitEdit, onCancel }) => {
    const [rating, setRating] = useState<number>(review.rating || 0);
    const [description, setDescription] = useState<string>(review.text || '');
    const [recommend, setRecommend] = useState<boolean | undefined>(review.recommend);
    const [hoveredStar, setHoveredStar] = useState<number>(0);

    const maxChars = 500;
    const remainingChars = maxChars - description.length;

    useEffect(() => {
        setRating(review.rating || 0);
        setDescription(review.text || '');
        setRecommend(review.recommend);
    }, [review]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            alert('Vui lòng chọn rating');
            return;
        }

        if (!description.trim()) {
            alert('Vui lòng nhập nội dung review');
            return;
        }

        const reviewData = {
            reviewId: review.id,
            rating,
            description: description.trim(),
            recommend,
        };

        onSubmitEdit(reviewData);
    };

    const handleStarClick = (starValue: number) => {
        setRating(starValue);
    };

    const handleStarHover = (starValue: number) => {
        setHoveredStar(starValue);
    };

    const handleStarLeave = () => {
        setHoveredStar(0);
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const isHovered = hoveredStar > 0 && i <= hoveredStar;
            const isSelected = hoveredStar === 0 && i <= rating;
            const isActive = isHovered || isSelected;

            stars.push(
                <i
                    key={i}
                    className={clsx('fa-star', isActive ? 'fas' : 'far', styles.star)}
                    onClick={() => handleStarClick(i)}
                    onMouseEnter={() => handleStarHover(i)}
                    onMouseLeave={handleStarLeave}
                    role="button"
                    tabIndex={0}
                    aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
                    style={{
                        color: isActive ? '#ffc107' : '#ddd',
                    }}
                />
            );
        }
        return stars;
    };

    return (
        <div className={styles.editReviewForm}>
            <div className={styles.header}>
                <h4>Chỉnh sửa đánh giá</h4>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                {/* Rating Section */}
                <div className={styles.ratingSection}>
                    <label className={styles.label}>
                        Đánh giá của bạn <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.stars} role="radiogroup" aria-label="Rating">
                        {renderStars()}
                    </div>
                    <span className={styles.ratingText}>
                        {rating > 0 ? `${rating}/5 sao` : 'Chọn rating'}
                    </span>
                </div>

                {/* Description Section */}
                <div className={styles.descriptionSection}>
                    <label htmlFor="edit-description" className={styles.label}>
                        Nội dung đánh giá <span className={styles.required}>*</span>
                    </label>
                    <textarea
                        id="edit-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm của bạn về bác sĩ..."
                        className={styles.textarea}
                        rows={4}
                        maxLength={maxChars}
                        required
                    />
                    <div className={styles.charCounter}>
                        <span className={clsx({ [styles.warning]: remainingChars < 20 })}>
                            {remainingChars} ký tự còn lại
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className={styles.actions}>
                    <Button
                        text="Hủy"
                        type="button"
                        className={styles.cancelButton}
                        onClick={onCancel}
                    />
                    <Button
                        text="Cập nhật đánh giá"
                        type="submit"
                        className={styles.submitButton}
                    />
                </div>
            </form>
        </div>
    );
};

export default EditReviewForm;
