import clsx from 'clsx';
import styles from './DoctorAppointmentBookingCard.module.scss';
import { useState } from 'react';

interface DoctorAppointmentBookingCardProps {
    name: string;
    specialty: string;
    position: string;
    bookCounts: number;
    rating: number;
    location: string;
    yearsOfExperience: number;
    fees: number;
    isFavorite: boolean;
    likeCounts: number;
    dislikeCounts: number;
    nextAvailableTime: string;
    image: string;
}

const DoctorAppointmentBookingCard: React.FC<DoctorAppointmentBookingCardProps> = (props) => {
    const {
        name,
        specialty,
        position,
        bookCounts,
        rating,
        location,
        yearsOfExperience,
        fees,
        isFavorite,
        likeCounts,
        dislikeCounts,
        nextAvailableTime,
        image,
    } = props;

    const [isSelected, setIsSelected] = useState(isFavorite);

    return (
        <div className="col-lg-12">
            <div className={styles.card}>
                <div className="d-md-flex align-items-center">
                    <div className={styles.cardImg}>
                        <a href="doctor-profile.html">
                            <img src={image} alt="doctor-image" />
                        </a>
                        <div
                            className={clsx(
                                styles.gridOverlayItem,
                                'd-flex align-items-center justify-content-between'
                            )}
                        >
                            <span className={clsx(styles.badge, styles.bgOrange, 'badge')}>
                                <i className="fa-solid fa-star me-1"></i>
                                {rating}
                            </span>
                            <span
                                className={clsx(styles.favIcon, {
                                    [styles.isSelected]: isSelected,
                                })}
                                onClick={() => setIsSelected(!isSelected)}
                            >
                                <i className="fa fa-heart"></i>
                            </span>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                            <a
                                href="#"
                                className={clsx(
                                    styles.doctorSpecialty,
                                    'text-teal',
                                    'fw-medium',
                                    'fs-14'
                                )}
                            >
                                {specialty}
                            </a>
                        </div>
                        <div className="p-3">
                            <div className={clsx(styles.doctorInfo, 'pb-3')}>
                                <div className="row align-items-center gy-3">
                                    <div className="col-sm-6">
                                        <div>
                                            <h6 className="d-flex align-items-center mb-1">
                                                <a
                                                    href="doctor-profile.html"
                                                    className={styles.doctorInfoName}
                                                >
                                                    {name}
                                                </a>
                                                <i className="isax isax-tick-circle5 text-success ms-2"></i>
                                            </h6>
                                            <p className={clsx(styles.fs15, 'mb-2')}>{position}</p>
                                            <p className="d-flex align-items-center mb-0 fs-14">
                                                <i className="isax isax-location me-2"></i>
                                                {location}
                                                <a
                                                    href="#"
                                                    className="text-primary text-decoration-underline ms-2"
                                                >
                                                    Get Direction
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div>
                                            <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                                                <i className="isax isax-language-circle text-dark me-2"></i>
                                                {bookCounts} booked
                                            </p>
                                            <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                                                <i className="isax isax-like-1 text-dark me-2"></i>
                                                {`${((likeCounts / (likeCounts + dislikeCounts)) * 100).toFixed(0)}% (${likeCounts} / ${likeCounts + dislikeCounts} Votes)`}
                                            </p>
                                            <p className="d-flex align-items-center mb-0 fs-14">
                                                <i className="isax isax-archive-14 text-dark me-2"></i>
                                                {`${yearsOfExperience} Years of Experience`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3 mt-3">
                                <div className="d-flex align-items-center flex-wrap row-gap-3">
                                    <div className="me-3">
                                        <p className={clsx(styles.fs15, 'mb-1')}>
                                            Consultation Fees
                                        </p>
                                        <h3 className="text-orange">{`$${fees}`}</h3>
                                    </div>
                                    <p className={clsx(styles.fs15, 'mb-0')}>
                                        Next available at <br />
                                        {nextAvailableTime}
                                    </p>
                                </div>
                                <a
                                    href="booking.html"
                                    className="btn btn-md btn-primary-gradient d-inline-flex align-items-center rounded-pill"
                                >
                                    <i className="isax isax-calendar-1 me-2"></i>
                                    Book Appointment
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorAppointmentBookingCard;
