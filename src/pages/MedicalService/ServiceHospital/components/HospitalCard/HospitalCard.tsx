import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HospitalCard.module.scss';
import medcureLogo from '@/assets/img/image_error.jpg';

type HospitalCardProps = {
    image: string;
    rating: number;
    available: boolean;
    name: string; // Service name
    degrees: string; // Hospital name
    location: string;
    votes: { positive: number; total: number };
    experience: number; // Duration
    fees: number;
    linkDetail: string;
    linkBooking: string;
};

const HospitalCard: React.FC<HospitalCardProps> = ({
    image,
    rating,
    available,
    name,
    degrees,
    location,
    votes,
    experience,
    fees,
    linkDetail,
    linkBooking,
}) => {
    return (
        <div className="col-lg-12">
            <div className="card doctor-list-card">
                <div className="d-md-flex align-items-start">
                    {/* Doctor Image */}
                    <div className={`card-img card-img-hover ${styles.imageWrapper}`}>
                        <img
                            src={image ?? medcureLogo}
                            alt={name}
                            className={styles.image}
                            onError={(e) => {
                                // Fallback to Medcure logo if provided image fails to load
                                if (e.currentTarget.src !== medcureLogo) {
                                    e.currentTarget.src = medcureLogo;
                                }
                            }}
                        />
                        <div className="grid-overlay-item d-flex align-items-center justify-content-between">
                            <span className="badge bg-orange">
                                <i className="fa-solid fa-star me-1"></i>
                                {rating}
                            </span>
                        </div>
                    </div>

                    {/* Doctor Info */}
                    <div className="card-body p-0">
                        <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                            <span
                                className={`badge ${available ? 'bg-success-light' : 'bg-danger-light'} d-inline-flex align-items-center ${styles.badgeRight}`}
                            >
                                <i className="fa-solid fa-circle fs-5 me-1"></i>
                                {available ? 'Available' : 'Unavailable'}
                            </span>
                        </div>

                        <div className="p-3">
                            <div className="doctor-info-detail pb-3">
                                <div className="row align-items-center gy-3">
                                    {/* Left */}
                                    <div className="col-sm-7">
                                        <div>
                                            <h6 className="d-flex align-items-center mb-1">
                                                {name}
                                            </h6>
                                            <p className="mb-2 d-flex align-items-center">
                                                {degrees}
                                                <i className="isax isax-tick-circle5 text-success ms-2"></i>
                                            </p>
                                            <p className="d-flex align-items-center mb-0 fs-14">
                                                <i
                                                    className="isax isax-location me-2"
                                                    style={{ flexShrink: 0 }}
                                                ></i>
                                                <span
                                                    style={{
                                                        display: 'inline',
                                                        wordBreak: 'break-word',
                                                    }}
                                                >
                                                    {location}{' '}
                                                    <Link
                                                        to="#"
                                                        className="text-primary text-decoration-underline"
                                                        style={{ whiteSpace: 'nowrap' }}
                                                    >
                                                        {'Chỉ đường'}
                                                    </Link>
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    {/* Right */}
                                    <div className="col-sm-5">
                                        <div>
                                            <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                                                <i className="isax isax-like-1 text-dark me-2"></i>
                                                {Math.round((votes.positive / votes.total) * 100)}%
                                                ({votes.positive} / {votes.total} Đánh giá)
                                            </p>
                                            <p className="d-flex align-items-center mb-0 fs-14">
                                                <i className="isax isax-clock text-dark me-2"></i>
                                                {experience} phút
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Fees + Book Button */}
                            <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3 mt-3">
                                <div className="d-flex align-items-center flex-wrap row-gap-3">
                                    <div className="me-3">
                                        <p className="mb-1">Phí dịch vụ</p>
                                        <h3 className="text-orange">
                                            {fees.toLocaleString('vi-VN')} VNĐ
                                        </h3>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <Link
                                        to={linkDetail}
                                        className="btn btn-light d-inline-flex align-items-center rounded-pill"
                                        style={{
                                            height: '30.7px',
                                            fontSize: '0.813rem',
                                        }}
                                    >
                                        <i className="isax isax-eye me-2"></i>
                                        {'Xem Chi Tiết'}
                                    </Link>

                                    <Link
                                        to={linkBooking}
                                        className="btn btn-md btn-primary-gradient d-inline-flex align-items-center rounded-pill"
                                    >
                                        <i className="isax isax-calendar-1 me-2"></i>
                                        {'Đặt Dịch Vụ'}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HospitalCard;
