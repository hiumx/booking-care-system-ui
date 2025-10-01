import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import styles from './HospitalCard.module.scss';

export interface HospitalCardProps {
    clinic: {
        id: string;
        name: string;
        image: string;
        rating: number;
        reviewCount: number;
        specialties: string[];
        location: string;
        distance?: string;
        priceRange: string;
        availableSlots: number;
        description?: string;
    };
    className?: string;
}

const HospitalCard: React.FC<HospitalCardProps> = ({
    clinic = {
        id: '1',
        name: 'City Medical Center',
        image: '/src/assets/img/clinic-1.jpg',
        rating: 4.5,
        reviewCount: 128,
        specialties: ['Cardiology', 'Neurology', 'Orthopedics'],
        location: 'Downtown, City Center',
        distance: '2.5 km',
        priceRange: '$50 - $200',
        availableSlots: 5,
        description:
            'Leading healthcare facility with state-of-the-art equipment and experienced medical professionals.',
    },
    className,
}) => {
    const {
        id,
        name,
        image,
        rating,
        reviewCount,
        specialties,
        location,
        distance,
        priceRange,
        availableSlots,
    } = clinic;

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<i key={i} className="fas fa-star text-warning"></i>);
        }

        if (hasHalfStar) {
            stars.push(<i key="half" className="fas fa-star-half-alt text-warning"></i>);
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<i key={`empty-${i}`} className="far fa-star text-muted"></i>);
        }

        return stars;
    };

    return (
        <Link to={`${PATHS.HOSPITAL.ROOT}/${id}`} className={styles.clinicCarouselItem}>
            <div className={`card h-100 ${styles.clinicCard} ${className || ''}`}>
                {/* Image Section */}
                <div className={styles.clinicImageContainer}>
                    <img
                        src={image}
                        alt={name}
                        className={`card-img-top ${styles.clinicImage}`}
                        loading="lazy"
                    />

                    {/* Overlay Elements */}
                    <div className={styles.imageOverlay}>
                        {distance && (
                            <div className={styles.distanceBadge}>
                                <i className="fas fa-map-marker-alt"></i>
                                <span>{distance}</span>
                            </div>
                        )}
                    </div>

                    {/* Available Slots Indicator */}
                    {availableSlots > 0 && (
                        <div className={styles.slotsIndicator}>
                            <span className={styles.slotsCount}>{availableSlots}</span>
                            <span className={styles.slotsText}>slots today</span>
                        </div>
                    )}
                </div>

                {/* Card Body */}
                <div className={`card-body ${styles.clinicBody}`}>
                    {/* Header Section */}
                    <h5 className={styles.clinicName}>{name}</h5>
                    <div className={styles.priceContainer}>
                        <p className={styles.priceRange}>{priceRange}</p>
                    </div>

                    {/* Location */}
                    <div className={styles.locationSection}>
                        <i className={`fas fa-map-marker-alt ${styles.locationIcon}`}></i>
                        <span className={styles.locationText}>{location}</span>
                    </div>

                    {/* Rating Section */}
                    <div className={styles.ratingSection}>
                        <div className={styles.stars}>{renderStars(rating)}</div>
                        <span className={styles.ratingText}>
                            {rating.toFixed(1)} ({reviewCount} reviews)
                        </span>
                    </div>

                    {/* Specialties */}
                    <div className={styles.specialtiesSection}>
                        <div className={styles.specialtiesContainer}>
                            {specialties.slice(0, 3).map((specialty) => (
                                <span key={specialty} className={styles.specialtyTag}>
                                    {specialty}
                                </span>
                            ))}
                            {specialties.length > 3 && (
                                <span className={`${styles.specialtyTag} ${styles.more}`}>
                                    +{specialties.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default HospitalCard;
