import React, { useRef, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import styles from './DoctorProfile.module.scss';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import ReviewSection from '@/components/ReviewSection';
import { getDoctorByIdAsync } from '@/store/slices/doctorSlice';
import {
    selectSelectedDoctor,
    selectDoctorLoading,
    selectDoctorError,
} from '@/store/selectors/doctor.selectors';
import { AppDispatch } from '@/store';
import {
    mockAppointments,
    getDisplayText,
    scrollToSection,
    calculatePriceRange,
    countAppointments,
} from '@/utils/profileUtils';
import { useDoctorReviews } from '@/hooks/useDoctorReviews';
import { useFavoriteDoctor } from '@/hooks/useFavoriteDoctor';
import { useReviewHandlers } from '@/hooks/useReviewHandlers';
import { TargetType } from '@/types/review.types';

// Import images for DoctorProfileCard
import doctorImg from '@/assets/img/doctors/doc-profile-02.jpg';
import badgeCheck from '@/assets/img/icons/badge-check.svg';
import watchIcon from '@/assets/img/icons/watch-icon.svg';
import thumbIcon from '@/assets/img/icons/gmail-icon.svg';
import genderIcon from '@/assets/img/icons/gender-icon.svg';
import deviceMessageIcon from '@/assets/img/icons/device-message2.svg';
import calendarIcon from '@/assets/img/icons/calendar3.svg';
import bullseyeIcon from '@/assets/img/icons/bullseye.svg';

// Import images for DoctorDetails
import experienceLogo1 from '@/assets/img/icons/experience-logo-01.svg';

// Icon CSS
import '@/assets/css/feather.css';
import ScheduleAvailability from '@/components/ScheduleAvailability';
import HospitalInfo from '@/components/HospitalInfo';
import { Gender } from '@/enums/common.enums';
import { PATHS, replacePathParams } from '@/routes/paths';

const DoctorProfile: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>();

    // Redux selectors - Doctor only (reviews use local state now!)
    const selectedDoctor = useSelector(selectSelectedDoctor);
    const isLoading = useSelector(selectDoctorLoading);
    const error = useSelector(selectDoctorError);

    // Get current user info - MUST be before early returns!
    const currentUserProfile = useSelector((state: any) => state.user?.profile);
    const currentUserId = currentUserProfile?.id; // For create review (patientId) & UI comparison
    const currentAccountId = currentUserProfile?.accountId; // For create reply (authorId)

    // State for review pagination
    const [reviewPage, setReviewPage] = useState(1);

    // Custom hook for reviews with server-side pagination - No Redux needed!
    const {
        reviews,
        statistics: reviewStatistics,
        pagination: reviewPagination,
        isLoading: reviewLoading,
        fetchReviews,
        refetchStatistics,
    } = useDoctorReviews(id, reviewPage, 10);

    // Custom hook for favorite doctor
    const {
        isFavorited,
        isLoading: favoriteLoading,
        toggleFavorite,
    } = useFavoriteDoctor(currentUserId, id);

    // Fetch doctor data when component mounts
    useEffect(() => {
        if (id) {
            dispatch(getDoctorByIdAsync(id));
        }
    }, [dispatch, id]);

    const bioRef = useRef<HTMLDivElement>(null);
    const expRef = useRef<HTMLDivElement>(null);
    const specialityRef = useRef<HTMLDivElement>(null);
    const servicesRef = useRef<HTMLDivElement>(null);
    const clinicRef = useRef<HTMLDivElement>(null);
    const hoursRef = useRef<HTMLDivElement>(null);
    const reviewRef = useRef<HTMLDivElement>(null);

    const [expanded, setExpanded] = useState(false);

    // Use selectedDoctor data instead of mock data
    const doctor = selectedDoctor;
    const limit = 300;
    const isLongText = doctor?.bio ? doctor.bio.length > limit : false;

    const displayText = getDisplayText(doctor?.bio, expanded, isLongText, limit);

    // Review handlers using custom hook - MUST be before early returns
    const {
        handleSubmitReview,
        handleReplySubmission,
        handleEditReview,
        handleDeleteReview,
        handleEditReply,
        handleDeleteReply,
    } = useReviewHandlers({
        targetType: TargetType.DOCTOR,
        targetId: id,
        currentUserId,
        currentAccountId,
        targetName: doctor ? `${doctor.lastName} ${doctor.firstName}` : '',
        hospitalId: doctor?.hospital?.id,
        refetchReviews: () => fetchReviews(reviewPage),
        refetchStatistics,
    });

    // Breadcrumb data
    const breadcrumbData = {
        items: [
            { label: '', path: '/', isActive: false },
            { label: 'Hồ sơ bác sĩ', isActive: true },
        ],
        title: 'Hồ sơ bác sĩ',
    };

    // Loading and error states
    if (isLoading) {
        return (
            <MainLayout>
                <div className="content">
                    <div className="container">
                        <div className="text-center py-5">
                            <div className="spinner-border">
                                <output className="visually-hidden">Loading...</output>
                            </div>
                            <p className="mt-3">Đang tải thông tin bác sĩ...</p>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
                <div className="content">
                    <div className="container">
                        <div className="text-center py-5">
                            <h4 className="fw-semibold mb-2">Đã xảy ra lỗi!</h4>
                            <p className="text-muted mb-4">Đã có lỗi xảy ra khi tải dữ liệu.</p>
                            <Link to={PATHS.HOME} className="btn btn-outline-primary px-4">
                                Quay về trang chủ
                            </Link>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (!doctor) {
        return (
            <MainLayout>
                <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
                <div className="content">
                    <div className="container">
                        <div className="text-center py-5">
                            <h4 className="fw-semibold mb-2">Không tìm thấy bác sĩ!</h4>
                            <p className="text-muted mb-4">
                                Bác sĩ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                            </p>
                            <Link to={PATHS.HOME} className="btn btn-outline-primary px-4">
                                Quay về trang chủ
                            </Link>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    // Calculate average rating from review statistics (use Redux state)
    const averageRating = reviewStatistics?.averageRating
        ? reviewStatistics.averageRating.toFixed(1)
        : '0.0';
    const totalReviews = reviewStatistics?.totalReviews || 0;

    // Function to render stars based on rating
    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<i key={i} className="fas fa-star filled"></i>);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<i key={i} className="fas fa-star-half-alt filled"></i>);
            } else {
                stars.push(<i key={i} className="fas fa-star"></i>);
            }
        }
        return stars;
    };

    // Function to get gender display text
    const getGenderDisplayText = (gender: Gender | undefined) => {
        if (gender === Gender.FEMALE) {
            return 'Nữ';
        }
        if (gender === Gender.MALE) {
            return 'Nam';
        }
        return 'Khác';
    };

    // Count completed appointments (mock data for now)
    const appointmentCount = countAppointments(
        mockAppointments,
        Number.parseInt(doctor.id || '1', 10)
    );

    // Get price range from doctor data
    const prices = doctor.prices?.map((price) => price.amount) || [];
    const priceRange = calculatePriceRange(prices.map((amount) => ({ amount })));

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
            <div className="content">
                <div className="container">
                    <div className="card doc-profile-card">
                        <div className="card-body">
                            <div className="doctor-widget doctor-profile-two">
                                <div className="doc-info-left">
                                    <div className="doctor-img">
                                        <img
                                            src={doctor.avatarUrl || doctorImg}
                                            className="img-fluid"
                                            alt="User"
                                        />
                                    </div>
                                    <div className="doc-info-cont">
                                        <span className="badge doc-avail-badge">
                                            <i className="fa-solid fa-circle"></i> Sẵn sàng phục vụ
                                        </span>
                                        <h4 className="doc-name">
                                            {doctor.lastName} {doctor.firstName}{' '}
                                            <img src={badgeCheck} alt="Badge" />
                                            <span className="badge doctor-role-badge">
                                                <i className="fa-solid fa-circle"></i>{' '}
                                                {doctor.specialty?.name}
                                            </span>
                                        </h4>
                                        <p>Học vị: {doctor.position?.name}</p>
                                        <p>{doctor.hospital?.name}</p>

                                        <p className="address-detail">
                                            <span className="loc-icon">
                                                <i className="feather-map-pin"></i>
                                            </span>
                                            {doctor.hospital?.address}
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
                                            <ul className="sub-links">
                                                <li>
                                                    <Link
                                                        to="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            toggleFavorite();
                                                        }}
                                                        title={
                                                            isFavorited
                                                                ? 'Xóa khỏi yêu thích'
                                                                : 'Thêm vào yêu thích'
                                                        }
                                                        className={clsx({
                                                            'text-danger': isFavorited,
                                                        })}
                                                    >
                                                        {favoriteLoading ? (
                                                            <i className="feather-loader"></i>
                                                        ) : (
                                                            <i
                                                                className={clsx(
                                                                    isFavorited
                                                                        ? 'fas fa-heart'
                                                                        : 'feather-heart'
                                                                )}
                                                            ></i>
                                                        )}
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
                                        </li>
                                        <li>
                                            <div className="hospital-info">
                                                <span className="list-icon">
                                                    <img src={thumbIcon} alt="Icon" />
                                                </span>
                                                <p>Email: {doctor.email}</p>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="hospital-info">
                                                <span className="list-icon">
                                                    <img src={genderIcon} alt="Icon" />
                                                </span>
                                                <p>
                                                    Giới tính: {getGenderDisplayText(doctor.gender)}
                                                </p>
                                            </div>
                                            <h5 className="accept-text">
                                                <span>
                                                    <i className="feather-check"></i>
                                                </span>{' '}
                                                Tiếp nhận bệnh nhân mới
                                            </h5>
                                        </li>
                                        <li>
                                            <div className="rating">
                                                {renderStars(Number.parseFloat(averageRating))}
                                                <span>{averageRating}</span>
                                                <Link
                                                    to="#reviews"
                                                    className="d-inline-block average-rating"
                                                >
                                                    {totalReviews} Đánh giá
                                                </Link>
                                            </div>
                                            <ul className="contact-doctors">
                                                <li>
                                                    <Link to="/chat-doctor">
                                                        <span>
                                                            <img
                                                                src={deviceMessageIcon}
                                                                alt="Chat"
                                                            />
                                                        </span>{' '}
                                                        Chat
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/voice-call">
                                                        <span className="bg-violet">
                                                            <i className="feather-phone-forwarded"></i>
                                                        </span>{' '}
                                                        Audio Call
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/video-call">
                                                        <span className="bg-indigo">
                                                            <i className="fa-solid fa-video"></i>
                                                        </span>{' '}
                                                        Video Call
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
                                        {doctor.yearsOfExperience} năm kinh nghiệm
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
                                                doctorId: id || '',
                                            })}
                                        >
                                            Đặt lịch hẹn
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="doctors-detailed-info">
                        <ul className={clsx('information-title-list', styles.marginLeftZero)}>
                            <li className="active">
                                <Link
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection(bioRef.current);
                                    }}
                                >
                                    Tiểu sử
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection(expRef.current);
                                    }}
                                >
                                    Kinh nghiệm
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection(specialityRef.current);
                                    }}
                                >
                                    Chuyên khoa
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection(servicesRef.current);
                                    }}
                                >
                                    Dịch vụ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection(clinicRef.current);
                                    }}
                                >
                                    Bệnh viện
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection(hoursRef.current);
                                    }}
                                >
                                    Lịch làm việc
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection(reviewRef.current);
                                    }}
                                >
                                    Đánh giá
                                </Link>
                            </li>
                        </ul>
                        <div>
                            <div ref={bioRef}>
                                <div className="doc-information-details bio-detail" id="doc_bio">
                                    <div className="detail-title">
                                        <h4>Tiểu sử bác sĩ</h4>
                                    </div>
                                    <p>{displayText}</p>
                                    {isLongText && (
                                        <Link
                                            to="#"
                                            className="show-more d-flex align-items-center"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setExpanded((prev) => !prev);
                                            }}
                                        >
                                            {expanded ? 'Thu gọn' : 'Xem thêm'}
                                            <i
                                                className={clsx('fa-solid', 'ms-2', {
                                                    'fa-chevron-up': expanded,
                                                    'fa-chevron-down': !expanded,
                                                })}
                                            ></i>
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <div ref={expRef}>
                                <div className="doc-information-details" id="experience">
                                    <div className="detail-title">
                                        <h4>Kinh nghiệm</h4>
                                    </div>
                                    <div className="experience-info">
                                        <div className="experience-logo">
                                            <span>
                                                <img src={experienceLogo1} alt="Experience Logo" />
                                            </span>
                                        </div>
                                        <div className="experience-content">
                                            <h5>{doctor.hospital?.name}</h5>
                                            <p>
                                                <strong>Chuyên khoa:</strong>{' '}
                                                {doctor.specialty?.name}
                                            </p>
                                            <p>
                                                <strong>Trình độ:</strong> {doctor.position?.name}
                                            </p>
                                            <p>
                                                <strong>Kinh nghiệm:</strong>{' '}
                                                {doctor.yearsOfExperience} năm kinh nghiệm
                                            </p>
                                            <p>
                                                <strong>Mô tả:</strong>{' '}
                                                {doctor.bio
                                                    ? doctor.bio.substring(0, 100) + '...'
                                                    : 'Không có thông tin tiểu sử'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div ref={specialityRef}>
                                <div className="doc-information-details" id="speciality">
                                    <div className="detail-title">
                                        <h4>Chuyên khoa</h4>
                                    </div>
                                    <ul className={clsx('special-links', styles.marginLeftZero)}>
                                        <li>
                                            <Link to={`/specialty/${doctor.specialty?.id || ''}`}>
                                                {doctor.specialty?.name}
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div ref={servicesRef}>
                                <div className="doc-information-details" id="services">
                                    <div className="detail-title">
                                        <h4>Dịch vụ & Giá</h4>
                                    </div>
                                    <ul className={clsx('special-links', styles.marginLeftZero)}>
                                        {doctor.prices && doctor.prices.length > 0 ? (
                                            doctor.prices.map((price) => (
                                                <li key={price.id}>
                                                    <Link to={`/service/${price.id}`}>
                                                        {price.serviceTypeName}
                                                        <span>
                                                            {price.amount.toLocaleString('vi-VN')}đ
                                                        </span>
                                                    </Link>
                                                </li>
                                            ))
                                        ) : (
                                            <li>
                                                <span className="text-muted">Chưa có dịch vụ</span>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                            <div ref={clinicRef}>
                                <div className="doc-information-details" id="clinic">
                                    <div className="detail-title">
                                        <h4>Bệnh viện & Vị trí</h4>
                                    </div>
                                    <HospitalInfo
                                        hospital={{
                                            id: Number(doctor.hospital?.id) || 1,
                                            name: doctor.hospital?.name || 'Bệnh viện',
                                            address:
                                                doctor.hospital?.address ||
                                                doctor.address ||
                                                'Địa chỉ bệnh viện',
                                            background_url: doctor.hospital?.avatarUrl || doctorImg,
                                        }}
                                        availabilitySlots={[
                                            {
                                                day: 'Thứ 2',
                                                time: '07:00 AM - 17:00 PM',
                                            },
                                            {
                                                day: 'Thứ 7',
                                                time: '07:00 AM - 17:00 PM',
                                            },
                                        ]}
                                    />
                                </div>
                            </div>
                            <div ref={hoursRef}>
                                <div className="doc-information-details" id="bussiness_hour">
                                    <div className="detail-title">
                                        <h4>Lịch làm việc</h4>
                                    </div>
                                    <ScheduleAvailability />
                                </div>
                            </div>
                            {/* Write Review  */}
                            <div ref={reviewRef}>
                                <ReviewSection
                                    reviews={reviews}
                                    doctorName={`${doctor.lastName} ${doctor.firstName}`}
                                    currentUserId={currentUserId}
                                    currentAccountId={currentAccountId}
                                    isLoading={reviewLoading}
                                    currentPage={reviewPagination?.currentPage || 1}
                                    totalPages={reviewPagination?.totalPages || 1}
                                    totalCount={reviewPagination?.totalCount || 0}
                                    onPageChange={(page) => {
                                        setReviewPage(page);
                                        fetchReviews(page);
                                    }}
                                    onSubmitReview={handleSubmitReview}
                                    onReplySubmission={handleReplySubmission}
                                    onEditReview={handleEditReview}
                                    onDeleteReview={handleDeleteReview}
                                    onEditReply={handleEditReply}
                                    onDeleteReply={handleDeleteReply}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default DoctorProfile;
