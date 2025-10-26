import React, { useEffect } from 'react';
import clsx from 'clsx';
import Button from '@/components/Button';
import { useReviewForm } from '@/hooks/useReviewForm';
import { useStarRating } from '@/hooks/useStarRating';
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
    // Use custom hooks for form validation and star rating
    const {
        description,
        setDescription,
        recommend,
        descriptionError,
        setDescriptionError,
        trimmedLength,
        remainingChars,
        maxChars,
        minChars,
        validateForm,
        updateFormValues,
    } = useReviewForm({
        initialRating: review.rating || 0,
        initialDescription: review.text || '',
        initialRecommend: review.recommend,
        maxChars: 500,
        minChars: 5,
    });

    const { rating, setRating, handleStarClick, handleStarHover, handleStarLeave, isStarActive } =
        useStarRating(review.rating || 0);

    // Update form when review ID changes (when editing a different review)

    useEffect(() => {
        updateFormValues(review.rating || 0, review.text || '', review.recommend);
        setRating(review.rating || 0);
        // Only depend on review.id to avoid resetting form while user is typing
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [review.id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form (pass rating from useStarRating)
        if (!validateForm(false, false, rating)) {
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

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const isActive = isStarActive(i);

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
                        onChange={(e) => {
                            setDescription(e.target.value);
                            setDescriptionError(''); // Clear error on change
                        }}
                        placeholder="Chia sẻ trải nghiệm của bạn về bác sĩ... (tối thiểu 5 ký tự)"
                        className={clsx(styles.textarea, {
                            [styles.error]: descriptionError,
                        })}
                        rows={4}
                        maxLength={maxChars}
                        required
                    />

                    {/* Error Message */}
                    {descriptionError && (
                        <div className={styles.errorMessage}>{descriptionError}</div>
                    )}

                    <div className={styles.charCounter}>
                        <span
                            className={clsx({
                                [styles.danger]: trimmedLength < minChars && trimmedLength > 0,
                                [styles.success]: trimmedLength >= minChars,
                            })}
                        >
                            {trimmedLength}/{minChars} ký tự tối thiểu
                        </span>
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
