import { renderStars } from '@/utils/renderStars';

interface RatingStarsProps {
    rating: number;
    numberOfReviews: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, numberOfReviews }) => {
    return (
        <div className="rating">
            {renderStars(rating)}

            <span className="d-inline-block average-rating">
                &nbsp; {rating % 1 === 0 ? rating.toFixed(1) : `(${Math.round(rating)})`} (
                {numberOfReviews} đánh giá)
            </span>
        </div>
    );
};

export default RatingStars;
