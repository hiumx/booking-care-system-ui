import React from 'react';
import { Link } from 'react-router-dom';
import { replacePathParams, PATHS } from '@/routes/paths';
import {
    ProfileType,
    ProfileData,
    Hospital,
    Specialty,
    Review,
    Appointment,
    Price,
    DoctorPrice,
} from '@/types/profile.types';

// Import images
import badgeCheck from '@/assets/img/icons/badge-check.svg';
import watchIcon from '@/assets/img/icons/watch-icon.svg';
import thumbIcon from '@/assets/img/icons/thumb-icon.svg';
import buildingIcon from '@/assets/img/icons/building-icon.svg';
import deviceMessageIcon from '@/assets/img/icons/device-message2.svg';
import calendarIcon from '@/assets/img/icons/calendar3.svg';
import bullseyeIcon from '@/assets/img/icons/bullseye.svg';

interface ProfileCardProps {
    type: ProfileType;
    profile: ProfileData;
    hospital: Hospital;
    specialty: Specialty;
    reviews: Review[];
    appointments: Appointment[];
    prices: Price[];
    doctorPrices: DoctorPrice[];
    profileId: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
    type,
    profile,
    hospital,
    specialty,
    reviews,
    appointments,
    prices,
    doctorPrices,
    profileId,
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
    const appointmentCount = appointments.filter((apt) => apt.doctor_id === profile.id).length;

    // Get price range
    const profilePriceAmounts = doctorPrices
        .filter((dp) => dp.doctor_id === profile.id)
        .map((dp) => prices.find((p) => p.id === dp.price_id)?.amount)
        .filter((amount): amount is number => amount !== undefined);
    const priceRange =
        profilePriceAmounts.length > 0
            ? `${Math.min(...profilePriceAmounts).toLocaleString('vi-VN')}đ - ${Math.max(...profilePriceAmounts).toLocaleString('vi-VN')}đ`
            : 'N/A';

    // Get display name based on type
    const getDisplayName = () => {
        if (type === 'doctor') {
            const doctorProfile = profile as any;
            return `${doctorProfile.last_name} ${doctorProfile.first_name}`;
        } else {
            const serviceProfile = profile as any;
            return serviceProfile.name;
        }
    };

    // Get additional info based on type
    const getAdditionalInfo = () => {
        if (type === 'doctor') {
            return 'Trình độ: Tiến sĩ'; // This should come from position data
        } else {
            return 'Dịch vụ: Khám chuyên khoa';
        }
    };

    return (
        <div className="card doc-profile-card">
            <div className="card-body">
                <div className="doctor-widget doctor-profile-two">
                    <div className="doc-info-left">
                        <div className="doctor-img">
                            <img src={profile.avatar_url} className="img-fluid" alt="User" />
                        </div>
                        <div className="doc-info-cont">
                            <span className="badge doc-avail-badge">
                                <i className="fa-solid fa-circle"></i> Sẵn sàng phục vụ
                            </span>
                            <h4 className="doc-name">
                                {getDisplayName()} <img src={badgeCheck} alt="Badge" />
                                {type === 'doctor' && (
                                    <span className="badge doctor-role-badge">
                                        <i className="fa-solid fa-circle"></i> {specialty.name}
                                    </span>
                                )}
                            </h4>
                            <p>{hospital.name}</p>
                            <p>{getAdditionalInfo()}</p>
                            <p className="address-detail">
                                <span className="loc-icon">
                                    <i className="feather-map-pin"></i>
                                </span>
                                {hospital.address}
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
                                {type === 'doctor' && (
                                    <ul className="sub-links">
                                        <li>
                                            <Link to="#">
                                                <i className="feather-heart"></i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#">
                                                <i className="feather-share-2"></i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#">
                                                <i className="feather-link"></i>
                                            </Link>
                                        </li>
                                    </ul>
                                )}
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
                                    <p>{hospital.name}</p>
                                </div>
                                {type === 'doctor' && (
                                    <h5 className="accept-text">
                                        <span>
                                            <i className="feather-check"></i>
                                        </span>
                                        {`Tiếp nhận bệnh nhân mới`}
                                    </h5>
                                )}
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
                                    {type === 'doctor' && (
                                        <>
                                            <li>
                                                <Link to="/voice-call">
                                                    <span className="bg-violet">
                                                        <i className="feather-phone-forwarded"></i>
                                                    </span>
                                                    {'Audio Call'}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/video-call">
                                                    <span className="bg-indigo">
                                                        <i className="fa-solid fa-video"></i>
                                                    </span>
                                                    {'Video Call'}
                                                </Link>
                                            </li>
                                        </>
                                    )}
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
                            {profile.years_of_experience} năm kinh nghiệm
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
                                    doctorId: profileId,
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

export default ProfileCard;
