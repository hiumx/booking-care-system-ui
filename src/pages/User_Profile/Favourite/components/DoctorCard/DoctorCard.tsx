import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FavouriteDoctor } from '../../data/mockData';
import RatingStars from '../RatingStars';
import clsx from 'clsx';
import styles from './DoctorCard.module.scss';
interface DoctorCardProps {
    doctor: FavouriteDoctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
    const [isFavourite, setIsFavourite] = useState(true);

    const handleFavouriteToggle = () => {
        setIsFavourite(!isFavourite);
    };

    return (
        <div className="profile-widget patient-favour flex-fill">
            <div className="fav-head">
                <button
                    onClick={handleFavouriteToggle}
                    className={clsx(styles.favDoctorCard, 'fav-btn favourite-btn')}
                >
                    <span className={`favourite-icon ${isFavourite ? 'favourite' : ''}`}>
                        <i className="isax isax-heart5"></i>
                    </span>
                </button>
                <div className="doc-img">
                    <Link to="/doctor-profile">
                        <img className="img-fluid" alt="User Image" src={doctor.image} />
                    </Link>
                </div>
                <div className="pro-content">
                    <h3 className="title">
                        <Link to="/doctor-profile">{doctor.name}</Link>
                        {doctor.isVerified && <i className="isax isax-tick-circle5 verified"></i>}
                    </h3>
                    <p className="speciality">{doctor.specialty}</p>
                    <RatingStars rating={doctor.rating} />
                    <ul className="available-info">
                        <li>
                            <i className="isax isax-calendar5 me-1"></i>
                            <span>Next Availability :</span> {doctor.nextAvailability}
                        </li>
                        <li>
                            <i className="isax isax-location5 me-1"></i>
                            <span>Location :</span> {doctor.location}
                        </li>
                    </ul>
                    <div className="last-book">
                        <p>Last Book on {doctor.lastBookDate}</p>
                    </div>
                </div>
            </div>
            <div className="fav-footer">
                <div className="row row-sm">
                    <div className="col-6">
                        <Link to="/doctor-profile" className="btn btn-md btn-light w-100">
                            View Profile
                        </Link>
                    </div>
                    <div className="col-6">
                        <Link to="/booking" className="btn btn-md btn-outline-primary w-100">
                            Book Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorCard;
