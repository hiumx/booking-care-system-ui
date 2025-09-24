import { Link } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import styles from './HospitalCard.module.scss';
import { Hospital } from '../types/booking';

interface HospitalCardProps {
    hospital: Hospital;
    onViewDetails: (hospitalId: string) => void;
    onBookAppointment: (hospitalId: string) => void;
}

const HospitalCard: React.FC<HospitalCardProps> = ({ hospital }) => {
    const rating = hospital.rating || 0;
    const full = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    const empty = 5 - Math.ceil(rating);

    return (
        <Link
            to={`${PATHS.MEDICAL_FACILITY.ROOT}/${hospital.id}`}
            className={styles.clinicCarouselItem}
        >
            <div className={`card h-100 ${styles.clinicCard}`}>
                <div className={styles.clinicImageContainer}>
                    <img
                        src={hospital.logo}
                        alt={hospital.name}
                        className={`card-img-top ${styles.clinicImage}`}
                        loading="lazy"
                    />
                    <div className={styles.imageOverlay}>
                        {hospital.distance && (
                            <div className={styles.distanceBadge}>
                                <i className="fas fa-map-marker-alt"></i>
                                <span>{hospital.distance}</span>
                            </div>
                        )}
                    </div>
                    <div className={styles.slotsIndicator}>
                        <span className={styles.slotsCount}>10</span>
                        <span className={styles.slotsText}>SLOTS TODAY</span>
                    </div>
                </div>

                <div className={`card-body ${styles.clinicBody}`}>
                    <h5 className={styles.clinicName}>{hospital.name}</h5>
                    <div className={styles.priceContainer}>
                        <p className={styles.priceRange}>500.000 - 2.000.000 VNĐ</p>
                    </div>
                    <div className={styles.locationSection}>
                        <i className={`fas fa-map-marker-alt ${styles.locationIcon}`}></i>
                        <span className={styles.locationText}>{hospital.address}</span>
                    </div>
                    <div className={styles.ratingSection}>
                        <div className={styles.stars}>
                            {Array.from({ length: full }).map((_, i) => (
                                <i key={`f-${i}`} className="fas fa-star text-warning"></i>
                            ))}
                            {hasHalf && <i className="fas fa-star-half-alt text-warning"></i>}
                            {Array.from({ length: empty }).map((_, i) => (
                                <i key={`e-${i}`} className="far fa-star text-muted"></i>
                            ))}
                        </div>
                        <span className={styles.ratingText}>
                            {rating.toFixed(1)} ({hospital.reviewCount} reviews)
                        </span>
                    </div>
                    <div className={styles.specialtiesSection}>
                        <div className={styles.specialtiesContainer}>
                            {hospital.specialties.slice(0, 3).map((s: string) => (
                                <span key={s} className={styles.specialtyTag}>
                                    {s}
                                </span>
                            ))}
                            {hospital.specialties.length > 3 && (
                                <span className={`${styles.specialtyTag} ${styles.more}`}>
                                    +{hospital.specialties.length - 3} more
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
