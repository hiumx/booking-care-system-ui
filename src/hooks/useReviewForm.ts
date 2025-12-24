import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

interface UseReviewFormProps {
    initialRating?: number;
    initialDescription?: string;
    initialRecommend?: boolean;
    maxChars?: number;
    minChars?: number;
}

/**
 * Custom hook for review form validation and state management
 * Reduces code duplication between WriteReview and EditReviewForm
 */
export const useReviewForm = ({
    initialRating = 0,
    initialDescription = '',
    initialRecommend,
    maxChars = 500,
    minChars = 5,
}: UseReviewFormProps = {}) => {
    const [rating, setRating] = useState<number>(initialRating);
    const [description, setDescription] = useState<string>(initialDescription);
    const [recommend, setRecommend] = useState<boolean | undefined>(initialRecommend);
    const [descriptionError, setDescriptionError] = useState<string>('');

    const trimmedLength = description.trim().length;
    const remainingChars = maxChars - description.length;

    /**
     * Validates the review form
     * Returns true if valid, false otherwise
     * @param requireTerms - Whether to validate terms acceptance
     * @param termsAccepted - Whether terms are accepted
     * @param currentRating - Current rating value (can override internal rating state)
     */
    const validateForm = (currentRating?: number): boolean => {
        // Clear previous errors
        setDescriptionError('');

        const ratingToValidate = currentRating ?? rating;

        // Validate rating
        if (ratingToValidate === 0) {
            toast.warning('Vui lòng chọn đánh giá sao', {
                position: 'top-center',
                autoClose: 3000,
            });
            return false;
        }

        // Validate description is not empty
        if (description.trim().length === 0) {
            setDescriptionError('Vui lòng nhập nội dung review');
            toast.error('Vui lòng nhập nội dung đánh giá', {
                position: 'top-center',
                autoClose: 3000,
            });
            return false;
        }

        // Validate minimum length
        if (trimmedLength < minChars) {
            setDescriptionError(`Nội dung review phải có ít nhất ${minChars} ký tự`);
            toast.error(`Nội dung đánh giá phải có ít nhất ${minChars} ký tự`, {
                position: 'top-center',
                autoClose: 3000,
            });
            return false;
        }

        return true;
    };

    /**
     * Resets the form to initial values
     */
    const resetForm = useCallback(() => {
        setRating(initialRating);
        setDescription(initialDescription);
        setRecommend(initialRecommend);
        setDescriptionError('');
    }, [initialRating, initialDescription, initialRecommend]);

    /**
     * Updates form values (useful for EditReviewForm when review data changes)
     */
    const updateFormValues = useCallback(
        (newRating: number, newDescription: string, newRecommend?: boolean) => {
            setRating(newRating);
            setDescription(newDescription);
            setRecommend(newRecommend);
            setDescriptionError('');
        },
        []
    );

    return {
        // Form state
        rating,
        setRating,
        description,
        setDescription,
        recommend,
        setRecommend,
        descriptionError,
        setDescriptionError,

        // Computed values
        trimmedLength,
        remainingChars,
        maxChars,
        minChars,

        // Methods
        validateForm,
        resetForm,
        updateFormValues,
    };
};
