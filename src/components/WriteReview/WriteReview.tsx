import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import Button from '@/components/Button';
import { useReviewForm } from '@/hooks/useReviewForm';
import { useStarRating } from '@/hooks/useStarRating';
import styles from './WriteReview.module.scss';

interface WriteReviewProps {
    doctorName: string;
    onSubmitReview?: (reviewData: {
        rating: number;
        description: string;
        termsAccepted: boolean;
    }) => void;
}

const WriteReview: React.FC<WriteReviewProps> = ({ doctorName, onSubmitReview }) => {
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

    // Use custom hooks for form validation and star rating
    const {
        description,
        setDescription,
        descriptionError,
        setDescriptionError,
        trimmedLength,
        remainingChars,
        maxChars,
        minChars,
        validateForm,
    } = useReviewForm({ maxChars: 100, minChars: 5 });

    const { rating, setRating, handleStarClick, handleStarHover, handleStarLeave, isStarActive } =
        useStarRating(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form with terms requirement (pass rating to validateForm)
        if (!validateForm(true, termsAccepted, rating)) {
            return;
        }

        const reviewData = {
            rating,
            description: description.trim(),
            termsAccepted,
        };

        onSubmitReview?.(reviewData);

        // Reset form
        setDescription('');
        setRating(0);
        setTermsAccepted(false);
    };

    const getStarClass = (starValue: number) => {
        return isStarActive(starValue) ? 'active' : '';
    };

    return (
        <div className={clsx('write-review', styles.writeReview)}>
            <h4>
                Viết đánh giá cho <strong>{doctorName}</strong>
            </h4>

            {/* Write Review Form */}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="mb-2" htmlFor="star-rating">
                        Đánh giá
                    </label>
                    <div className={clsx('star-rating', styles.starRating)} id="star-rating">
                        {[5, 4, 3, 2, 1].map((starValue) => (
                            <React.Fragment key={starValue}>
                                <input
                                    id={`star-${starValue}`}
                                    type="radio"
                                    name="rating"
                                    value={`star-${starValue}`}
                                    checked={rating === starValue}
                                    onChange={() => handleStarClick(starValue)}
                                    className={styles.starInput}
                                />
                                <label
                                    htmlFor={`star-${starValue}`}
                                    title={`${starValue} sao`}
                                    onMouseEnter={() => handleStarHover(starValue)}
                                    onMouseLeave={handleStarLeave}
                                    className={styles.starLabel}
                                    aria-label={`${starValue} sao`}
                                >
                                    <i
                                        className={clsx('fa fa-star', styles.faStar, {
                                            [styles.active]: getStarClass(starValue) === 'active',
                                        })}
                                    ></i>
                                </label>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="mb-3">
                    <label className="mb-2" htmlFor="review_desc">
                        Nội dung đánh giá <span className="text-danger">*</span>
                    </label>
                    <textarea
                        id="review_desc"
                        maxLength={maxChars}
                        className={clsx(styles.formControl, 'form-control', {
                            'is-invalid': descriptionError,
                        })}
                        rows={4}
                        placeholder="Chia sẻ trải nghiệm của bạn với bác sĩ... (tối thiểu 5 ký tự)"
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                            setDescriptionError(''); // Clear error on change
                        }}
                    />

                    {/* Error Message */}
                    {descriptionError && (
                        <div className="invalid-feedback d-block">{descriptionError}</div>
                    )}

                    <div className="d-flex justify-content-between mt-2">
                        <small
                            className={clsx({
                                'text-danger': trimmedLength < minChars && trimmedLength > 0,
                                'text-success': trimmedLength >= minChars,
                                'text-muted': trimmedLength === 0,
                            })}
                        >
                            {trimmedLength}/{minChars} ký tự tối thiểu
                        </small>
                        <small className="text-muted">
                            <span id="chars">{remainingChars}</span> ký tự còn lại
                        </small>
                    </div>
                </div>

                <hr />

                <div className="mb-3">
                    <div className="terms-accept">
                        <div className={clsx(styles.termsAccept, styles.customCheckbox)}>
                            <input
                                type="checkbox"
                                id="terms_accept"
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                            />
                            <label htmlFor="terms_accept">
                                Tôi đã đọc và đồng ý với{' '}
                                <Link to="/terms-conditions" target="_blank">
                                    Điều khoản &amp; Điều kiện
                                </Link>
                            </label>
                        </div>
                    </div>
                </div>

                <div className={styles.submitSection}>
                    <Button text="Thêm đánh giá" type="submit" className={styles.submitBtn} />
                </div>
            </form>
            {/* /Write Review Form */}
        </div>
    );
};

export default WriteReview;
