import { useState, useCallback } from 'react';

/**
 * Custom hook for star rating functionality
 * Handles hover state and selection
 */
export const useStarRating = (initialRating: number = 0) => {
    const [rating, setRating] = useState<number>(initialRating);
    const [hoveredStar, setHoveredStar] = useState<number>(0);

    const handleStarClick = useCallback((starValue: number) => {
        setRating(starValue);
    }, []);

    const handleStarHover = useCallback((starValue: number) => {
        setHoveredStar(starValue);
    }, []);

    const handleStarLeave = useCallback(() => {
        setHoveredStar(0);
    }, []);

    /**
     * Determines if a star should be active (filled)
     */
    const isStarActive = useCallback(
        (starValue: number): boolean => {
            if (hoveredStar > 0) {
                return starValue <= hoveredStar;
            }
            return starValue <= rating;
        },
        [hoveredStar, rating]
    );

    return {
        rating,
        setRating,
        hoveredStar,
        handleStarClick,
        handleStarHover,
        handleStarLeave,
        isStarActive,
    };
};
