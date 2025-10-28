import React from 'react';

/**
 * Utility function to render star rating
 * @param rating - Rating value (0-5)
 * @returns JSX elements for star display
 */
export const renderStars = (rating: number): React.ReactElement[] => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars.push(<i key={i} className="fas fa-star filled"></i>);
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars.push(<i key={i} className="fas fa-star-half-alt filled"></i>);
        } else {
            stars.push(<i key={i} className="fas fa-star"></i>);
        }
    }
    return stars;
};
