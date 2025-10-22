import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PATHS, replacePathParams } from '@/routes/paths';
import FavoriteDoctorService from '@/services/favoriteDoctor.service';
import { FavouriteDoctor } from '@/types/doctor.types';
import RatingStars from '../RatingStars';
import clsx from 'clsx';
import styles from './DoctorCard.module.scss';

interface DoctorCardProps {
    doctor: FavouriteDoctor;
    patientId?: string;
    onFavoriteChange?: (doctorId: string, isFavorited: boolean) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, patientId, onFavoriteChange }) => {
    const [isFavourite, setIsFavourite] = useState(true);
    const [isToggling, setIsToggling] = useState(false);

    const handleFavouriteToggle = async () => {
        if (!patientId) {
            console.warn('Patient ID is required to toggle favorite status');
            return;
        }

        if (isToggling) return; // Prevent multiple requests

        try {
            setIsToggling(true);

            const result = await FavoriteDoctorService.toggleFavorite({
                patientId,
                doctorId: doctor.id,
            });

            const newFavoriteStatus = result.isFavorited;
            setIsFavourite(newFavoriteStatus);

            // Notify parent component about the change
            onFavoriteChange?.(doctor.id, newFavoriteStatus);
        } catch (error) {
            console.error('Error toggling favorite status:', error);
            // Could show a toast notification here
        } finally {
            setIsToggling(false);
        }
    };

    return (
        <div className="profile-widget patient-favour flex-fill">
            <div className="fav-head">
                <button
                    onClick={handleFavouriteToggle}
                    disabled={isToggling}
                    className={clsx(styles.favDoctorCard, 'fav-btn favourite-btn', {
                        [styles.disabled]: isToggling,
                    })}
                >
                    <span className={`favourite-icon ${isFavourite ? 'favourite' : ''}`}>
                        {isToggling ? (
                            <i className="fa fa-spinner fa-spin"></i>
                        ) : (
                            <i className="isax isax-heart5"></i>
                        )}
                    </span>
                </button>
                <div className="doc-img">
                    <Link
                        to={replacePathParams(`${PATHS.DOCTOR.ROOT}/${PATHS.DOCTOR.PROFILE}`, {
                            id: doctor.id,
                        })}
                    >
                        <img className="img-fluid" alt={doctor.name} src={doctor.image} />
                    </Link>
                </div>
                <div className="pro-content">
                    <h3 className="title">
                        <Link
                            to={replacePathParams(`${PATHS.DOCTOR.ROOT}/${PATHS.DOCTOR.PROFILE}`, {
                                id: doctor.id,
                            })}
                            className={styles.textFullName}
                        >
                            {doctor.name}
                        </Link>
                        {doctor.isVerified && <i className="isax isax-tick-circle5 verified"></i>}
                    </h3>
                    <p className="speciality">Chuyên khoa: {doctor.specialty}</p>
                    <RatingStars rating={doctor.rating} numberOfReviews={doctor.numberOfReviews} />
                    <ul className="available-info">
                        <li>
                            <i className="isax isax-calendar5 me-1"></i>
                            <span>Trình độ :</span> {doctor.level}
                        </li>
                        <li>
                            <i className="isax isax-location5 me-1"></i>
                            <span>Location :</span> {doctor.location}
                        </li>
                    </ul>
                    <div className="last-book">
                        <p>Kinh nghiệm {doctor.experience} năm</p>
                    </div>
                </div>
            </div>
            <div className="fav-footer">
                <div className="row row-sm">
                    <div className="col-6">
                        <Link
                            to={replacePathParams(`${PATHS.DOCTOR.ROOT}/${PATHS.DOCTOR.PROFILE}`, {
                                id: doctor.id,
                            })}
                            className="btn btn-md btn-light w-100"
                        >
                            Xem chi tiết
                        </Link>
                    </div>
                    <div className="col-6">
                        <Link
                            to={replacePathParams(PATHS.BOOKING.ROOT, { doctorId: doctor.id })}
                            className="btn btn-md btn-outline-primary w-100"
                        >
                            Đặt ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorCard;
