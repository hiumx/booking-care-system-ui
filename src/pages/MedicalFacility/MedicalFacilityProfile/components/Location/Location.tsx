import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from './Location.module.scss';

interface Location {
    name: string;
    address: string;
    rating: number;
    images: string[];
    timings: { days: string; times: string[] }[];
}

const Location: React.FC<{ location: Location; isActive?: boolean }> = ({
    location,
    isActive = false,
}) => (
    <div className={clsx('tab-pane fade', { 'show active': isActive })} id="doc_locations">
        <div className="location-list">
            <div className="row">
                <div className="col-md-6">
                    <div className="clinic-content">
                        <h4 className="clinic-name">
                            <Link to="#">{location.name}</Link>
                        </h4>
                        <div className="rating">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <i
                                    key={i}
                                    className={clsx(
                                        'fas fa-star',
                                        i < location.rating && 'filled',
                                        styles.customPadding
                                    )}
                                ></i>
                            ))}
                            <span className="d-inline-block average-rating">
                                ({location.rating})
                            </span>
                        </div>
                        <div className="clinic-details mb-0">
                            <h5 className="clinic-direction">
                                <i className="isax isax-location5"></i> {location.address} <br />
                                <Link to="#">Chỉ Đường</Link>
                            </h5>
                            <ul>
                                {location.images.map((img, i) => (
                                    <li key={i}>
                                        <Link to={img} data-fancybox="gallery2">
                                            <img src={img} alt="Hình ảnh cơ sở" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="clinic-timing">
                        {location.timings.map((timing, i) => (
                            <div key={i}>
                                <p className="timings-days">
                                    <span>{timing.days}</span>
                                </p>
                                <p className="timings-times">
                                    {timing.times.map((time, j) => (
                                        <span key={j}>{time}</span>
                                    ))}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Location;
