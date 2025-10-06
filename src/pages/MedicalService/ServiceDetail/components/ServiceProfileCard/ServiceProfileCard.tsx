import React from 'react';
import { Link } from 'react-router-dom';
import { replacePathParams, PATHS } from '@/routes/paths';

// Import images
import badgeCheck from '@/assets/img/icons/badge-check.svg';
import watchIcon from '@/assets/img/icons/watch-icon.svg';
import thumbIcon from '@/assets/img/icons/thumb-icon.svg';
import buildingIcon from '@/assets/img/icons/building-icon.svg';
import deviceMessageIcon from '@/assets/img/icons/device-message2.svg';
import calendarIcon from '@/assets/img/icons/calendar3.svg';
import bullseyeIcon from '@/assets/img/icons/bullseye.svg';

interface ServiceProfileCardProps {
    doctor: {
        id: number;
        name: string;
        avatar_url: string;
        years_of_experience: number;
        bio: string;
    };
    clinic: {
        id: number;
        name: string;
        address: string;
    };
    specialty: {
        id: number;
        name: string;
    };
    reviews: Array<{
        id: number;
        rating: number;
        recommend: boolean;
    }>;
    appointments: Array<{
        id: number;
        doctor_id: number;
    }>;
    prices: Array<{
        id: number;
        amount: number;
    }>;
    doctorPrices: Array<{
        doctor_id: number;
        price_id: number;
        description: string;
    }>;
    doctorId: string;
}

const ServiceProfileCard: React.FC<ServiceProfileCardProps> = ({
    doctor,
    clinic,
    reviews,
    appointments,
    prices,
    doctorPrices,
    doctorId,
}) => {
    // Calculate average rating
    const averageRating =
        reviews.length > 0
            ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
            : '0.0';

    // Calculate recommendation percentage
    const recommendCount = reviews.filter((review) => review.recommend).length;
    const recommendPercentage =
        reviews.length > 0 ? Math.round((recommendCount / reviews.length) * 100) : 0;

    // Count completed appointments
    const appointmentCount = appointments.filter((apt) => apt.doctor_id === doctor.id).length;

    // Get price range
    const doctorPriceAmounts = doctorPrices
        .filter((dp) => dp.doctor_id === doctor.id)
        .map((dp) => prices.find((p) => p.id === dp.price_id)?.amount)
        .filter((amount): amount is number => amount !== undefined);
    const priceRange =
        doctorPriceAmounts.length > 0
            ? `${Math.min(...doctorPriceAmounts).toLocaleString('vi-VN')}đ - ${Math.max(...doctorPriceAmounts).toLocaleString('vi-VN')}đ`
            : 'N/A';

    return (
        <div className="card doc-profile-card">
            <div className="card-body">
                <div className="doctor-widget doctor-profile-two">
                    <div className="doc-info-left">
                        <div className="doctor-img">
                            <img src={doctor.avatar_url} className="img-fluid" alt="User" />
                        </div>
                        <div className="doc-info-cont">
                            <span className="badge doc-avail-badge">
                                <i className="fa-solid fa-circle"></i> Sẵn sàng phục vụ
                            </span>
                            <h4 className="doc-name">
                                {doctor.name} <img src={badgeCheck} alt="Badge" />
                            </h4>
                            <p>{clinic.name}</p>
                            <p>Dịch vụ: Khám chuyên khoa</p>
                            <p className="address-detail">
                                <span className="loc-icon">
                                    <i className="feather-map-pin"></i>
                                </span>
                                {clinic.address}
                                <span className="view-text"> ( Xem vị trí )</span>
                            </p>
                        </div>
                    </div>
                    <div className="doc-info-right">
                        <ul className="doctors-activities">
                            <li>
                                <div className="hospital-info">
                                    <span className="list-icon">
                                        <img src={watchIcon} alt="Icon" />
                                    </span>
                                    <p>Toàn thời gian, Liệu pháp trực tuyến sẵn có</p>
                                </div>
                            </li>
                            <li>
                                <div className="hospital-info">
                                    <span className="list-icon">
                                        <img src={thumbIcon} alt="Icon" />
                                    </span>
                                    <p>
                                        <b>{recommendPercentage}%</b> được đề xuất
                                    </p>
                                </div>
                            </li>
                            <li>
                                <div className="hospital-info">
                                    <span className="list-icon">
                                        <img src={buildingIcon} alt="Icon" />
                                    </span>
                                    <p>{clinic.name}</p>
                                </div>
                            </li>
                            <li>
                                <div className="rating">
                                    <i className="fas fa-star filled"></i>
                                    <i className="fas fa-star filled"></i>
                                    <i className="fas fa-star filled"></i>
                                    <i className="fas fa-star filled"></i>
                                    <i className="fas fa-star filled"></i>
                                    <span>{averageRating}</span>
                                    <Link to="#" className="d-inline-block average-rating">
                                        {reviews.length} Đánh giá
                                    </Link>
                                </div>
                                <ul className="contact-doctors">
                                    <li>
                                        <Link to="/chat-doctor">
                                            <span>
                                                <img src={deviceMessageIcon} alt="Chat" />
                                            </span>{' '}
                                            Chat
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="doc-profile-card-bottom">
                    <ul>
                        <li>
                            <span className="bg-blue">
                                <img src={calendarIcon} alt="Calendar" />
                            </span>
                            Gần {appointmentCount}+ cuộc hẹn đã được đặt
                        </li>
                        <li>
                            <span className="bg-dark-blue">
                                <img src={bullseyeIcon} alt="Target" />
                            </span>
                            {doctor.years_of_experience} năm kinh nghiệm
                        </li>
                    </ul>
                    <div className="bottom-book-btn">
                        <p>
                            <span>Giá: {priceRange}</span> mỗi lượt khám
                        </p>
                        <div className="clinic-booking">
                            <Link
                                className="apt-btn"
                                to={replacePathParams(PATHS.BOOKING.ROOT, {
                                    doctorId: doctorId,
                                })}
                            >
                                Đặt lịch hẹn
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceProfileCard;
