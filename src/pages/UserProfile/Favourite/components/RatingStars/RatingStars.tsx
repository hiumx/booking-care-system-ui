interface RatingStarsProps {
    rating: number;
    numberOfReviews: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, numberOfReviews }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="rating">
            {/* Full stars */}
            {Array.from({ length: fullStars }, (_, index) => (
                <i key={`full-${index}`} className="fas fa-star filled"></i>
            ))}

            {/* Half star */}
            {hasHalfStar && <i className="fas fa-star-half-alt filled"></i>}

            {/* Empty stars */}
            {Array.from({ length: emptyStars }, (_, index) => (
                <i key={`empty-${index}`} className="fas fa-star"></i>
            ))}

            <span className="d-inline-block average-rating">
                &nbsp; {rating % 1 === 0 ? rating.toFixed(1) : `(${Math.round(rating)})`} (
                {numberOfReviews} đánh giá)
            </span>
        </div>
    );
};

export default RatingStars;
