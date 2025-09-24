import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from './DoctorCard.module.scss';
import { Doctor } from '../types/booking';

interface DoctorCardProps {
    doctor: Doctor;
    onBookAppointment: (doctorId: string) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBookAppointment }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    const toggleFavorite = () => setIsFavorite((prev) => !prev);

    const rating = doctor.rating || 0;
    const available = doctor.availableToday;
    const feeUsd = Math.round((doctor.consultationFee || 0) / 24000);

    return (
        <div className={clsx(styles.doctorCarouselItemContainer, 'card')}>
            <div className="card-img card-img-hover">
                <Link to="#">
                    <img src={doctor.avatar} alt={doctor.name} />
                </Link>
                <div className="grid-overlay-item d-flex align-items-center justify-content-between">
                    <span className="badge bg-orange">
                        <i className="fa-solid fa-star me-1"></i> {rating.toFixed(1)}
                    </span>
                    <div className={styles.favWrapper}>
                        <button
                            className={`${styles.favIcon} ${isFavorite ? styles.active : ''}`}
                            onClick={toggleFavorite}
                        >
                            <i
                                className={`fa${isFavorite ? ' fa-heart' : ' fa-regular fa-heart'}`}
                            ></i>
                        </button>
                    </div>
                </div>
            </div>

            <div className="card-body p-0">
                <div className="d-flex active-bar align-items-center justify-content-between p-3">
                    <Link to="#" className="text-indigo fw-medium fs-14">
                        {doctor.specialty}
                    </Link>
                    <span className="badge bg-success-light d-inline-flex align-items-center">
                        <div className={styles.dotIconWrapper}>
                            <i className="fa-solid fa-circle me-1"></i>
                        </div>
                        {available ? 'Available' : 'Unavailable'}
                    </span>
                </div>

                <div className="p-3 pt-0">
                    <div className="doctor-info-detail mb-3 pb-3">
                        <div className={styles.doctorName}>
                            <h3 className="mb-1">
                                <Link to="#">{doctor.name}</Link>
                            </h3>
                        </div>
                        <div className="d-flex align-items-center">
                            <p className="d-flex align-items-center mb-0 fs-14">
                                <i className="isax isax-location me-2"></i>
                                {doctor.location}
                            </p>
                            <div className={styles.fsWrapper}>
                                <i className="fa-solid fa-circle text-primary mx-2 me-1"></i>
                            </div>
                            <span className="fs-14 fw-medium">30 Phút</span>
                        </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <p className="mb-1">Phí tư vấn</p>
                            <h3 className="text-orange">${feeUsd}</h3>
                        </div>
                        <button
                            onClick={() => onBookAppointment(doctor.id)}
                            className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                        >
                            <i className="isax isax-calendar-1 me-2"></i>
                            {'Đặt ngay'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorCard;
