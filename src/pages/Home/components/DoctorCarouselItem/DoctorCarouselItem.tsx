import { FC } from 'react';
import styles from './DoctorCarouselItem.module.scss';
import { Link } from 'react-router-dom';

type DoctorCarouselItemProps = {
    image: string;
    name: string;
    specialty: string;
    location: string;
    rating: number;
    available?: boolean;
    fee: number;
    consultationTime: string;
    profileLink?: string;
    bookingLink?: string;
};

const DoctorCarouselItem: FC<DoctorCarouselItemProps> = ({
    image,
    name,
    specialty,
    location,
    rating,
    available = true,
    fee,
    consultationTime,
    profileLink = '#',
    bookingLink = '#',
}) => {
    return (
        <div className={`${styles.root} card`}>
            <div className="card-img card-img-hover">
                <Link to={profileLink}>
                    <img src={image} alt={name} />
                </Link>
                <div className="grid-overlay-item d-flex align-items-center justify-content-between">
                    <span className="badge bg-orange">
                        <i className="fa-solid fa-star me-1"></i> {rating.toFixed(1)}
                    </span>
                    <button className="fav-icon">
                        <i className="fa fa-heart"></i>
                    </button>
                </div>
            </div>

            <div className="card-body p-0">
                <div className="d-flex active-bar align-items-center justify-content-between p-3">
                    <a href="#" className="text-indigo fw-medium fs-14">
                        {specialty}
                    </a>
                    <span className="badge bg-success-light d-inline-flex align-items-center">
                        <i className="fa-solid fa-circle fs-5 me-1"></i>
                        {available ? 'Available' : 'Unavailable'}
                    </span>
                </div>

                <div className="p-3 pt-0">
                    <div className="doctor-info-detail mb-3 pb-3">
                        <h3 className="mb-1">
                            <a href={profileLink}>{name}</a>
                        </h3>
                        <div className="d-flex align-items-center">
                            <p className="d-flex align-items-center mb-0 fs-14">
                                <i className="isax isax-location me-2"></i>
                                {location}
                            </p>
                            <i className="fa-solid fa-circle fs-5 text-primary mx-2 me-1"></i>
                            <span className="fs-14 fw-medium">{consultationTime}</span>
                        </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <p className="mb-1">Consultation Fees</p>
                            <h3 className="text-orange">${fee}</h3>
                        </div>
                        <Link
                            to={bookingLink}
                            className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                        >
                            <i className="isax isax-calendar-1 me-2"></i>
                            Book Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorCarouselItem;
