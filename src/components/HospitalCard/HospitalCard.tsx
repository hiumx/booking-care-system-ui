import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import styles from './HospitalCard.module.scss';

export interface HospitalCardProps {
    clinic: {
        id: string;
        name: string;
        image: string;
        specialties: string[];
        location: string;
        distance?: string;
        specialtyCount: number;
        description?: string;
    };
    className?: string;
}

const HospitalCard: React.FC<HospitalCardProps> = ({
    clinic = {
        id: '1',
        name: 'City Medical Center',
        image: '/src/assets/img/clinic-1.jpg',
        specialties: [
            'Cardiology',
            'Neurology',
            'Orthopedics',
            'Dermatology',
            'Pediatrics',
            'Ophthalmology',
        ],
        location: 'Downtown, City Center',
        distance: '2.5 km',
        specialtyCount: 6,
        description:
            'Leading healthcare facility with state-of-the-art equipment and experienced medical professionals.',
    },
    className,
}) => {
    const { id, name, image, specialties, location, distance, specialtyCount } = clinic;

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

                    {/* Specialty Count Indicator */}
                    {specialtyCount > 0 && (
                        <div className={styles.specialtyIndicator}>
                            <span className={styles.specialtyCount}>{specialtyCount}</span>
                            <span className={styles.specialtyText}>specialties</span>
                        </div>
                    )}
                </div>

                {/* Card Body */}
                <div className={`card-body ${styles.clinicBody}`}>
                    {/* Header Section */}
                    <h5 className={styles.clinicName}>{name}</h5>

                    {/* Location */}
                    <div className={styles.locationSection}>
                        <i className={`fas fa-map-marker-alt ${styles.locationIcon}`}></i>
                        <span className={styles.locationText}>{location}</span>
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
                                    +{specialties.length - 3} chuyên khoa
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
