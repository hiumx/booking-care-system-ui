import React, { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import styles from './ServiceDetailPage.module.scss';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import ScheduleAvailability from '@/components/ScheduleAvailability';
import ReviewSection from '@/components/ReviewSection';
import { useServiceReviews } from '@/hooks/useServiceReviews';
import { useReviewHandlers } from '@/hooks/useReviewHandlers';
import { TargetType } from '@/types/review.types';
import {
    mockAppointments,
    getDisplayText,
    scrollToSection,
    calculatePriceRange,
    countAppointments,
} from '@/utils/profileUtils';

// Import images for DoctorProfileCard
import serviceImg from '@/assets/img/doctors/doc-profile-02.jpg';
import badgeCheck from '@/assets/img/icons/badge-check.svg';
import watchIcon from '@/assets/img/icons/watch-icon.svg';
import thumbIcon from '@/assets/img/icons/gmail-icon.svg';
import buildingIcon from '@/assets/img/icons/building-icon.svg';
import deviceMessageIcon from '@/assets/img/icons/device-message2.svg';
import calendarIcon from '@/assets/img/icons/calendar3.svg';

// Import images for DoctorDetails
import clinicImg1 from '@/assets/img/clinic/clinic-11.jpg';

// Icon CSS
import '@/assets/css/feather.css';
import { buildPath, PATHS, replacePathParams } from '@/routes/paths';
import { HospitalCarousel } from '@/components/SimpleCarousel';

// Mock data for Doctor
const mockDoctor = {
    id: 1,
    account_id: 1,
    email: 'nguyenvana@example.com',
    address: 'Võ Chí Công, Đà Nẵng',
    name: 'Chuyên Khoa Tiêu Hóa Bệnh Viện Đa Khoa Đà Nẵng',
    gender: 'MALE',
    position_id: 1,
    specialty_id: 1,
    clinic_id: 1,
    bio: 'Khoa Tiêu hóa tại Bệnh viện Đa khoa Đà Nẵng cung cấp dịch vụ chăm sóc toàn diện cho các bệnh lý về hệ tiêu hóa, bao gồm các bệnh lý dạ dày, ruột, gan, tụy và túi mật. Đội ngũ bác sĩ giàu kinh nghiệm và tận tâm của chúng tôi kết hợp chuyên môn y khoa với công nghệ chẩn đoán tiên tiến để đảm bảo đánh giá chính xác và lên kế hoạch điều trị hiệu quả.Bệnh nhân được tư vấn cá nhân hóa, từ phát hiện sớm và chăm sóc phòng ngừa đến quản lý các bệnh lý đường tiêu hóa phức tạp. Với cam kết về sự tận tâm và chuyên nghiệp, khoa luôn nỗ lực cải thiện chất lượng cuộc sống của bệnh nhân thông qua các biện pháp can thiệp kịp thời, các thủ thuật xâm lấn tối thiểu và chăm sóc theo dõi liên tục.',
    avatar_url: serviceImg,
    years_of_experience: 21,
    created_at: '2020-01-15 10:00:00',
    updated_at: '2025-08-18 14:00:00',
};

// Mock data for Clinic
const mockClinic = {
    id: 1,
    account_id: 1,
    name: 'Bệnh viện Đa Khoa Đà Nẵng',
    address: 'Võ Chí Công, Đà Nẵng, Việt Nam',
    phone: '0236-123-456',
    email: 'info@dananghospital.vn',
    description: 'Bệnh viện hàng đầu tại Đà Nẵng với đội ngũ y bác sĩ chuyên nghiệp.',
    background_url: clinicImg1,
    avatar_url: clinicImg1,
    status: 'ACTIVE',
    created_at: '2019-12-01 08:00:00',
    updated_at: '2025-08-18 15:00:00',
};
const listmockClinic = [mockClinic, mockClinic, mockClinic, mockClinic];

// Mock data for Prices
const mockPrices = [
    {
        id: 1,
        amount: 300000,
    },
    {
        id: 2,
        amount: 500000,
    },
];

// Mock data for Doctor Prices
const mockDoctorPrices = [
    {
        doctor_id: 1,
        price_id: 1,
        description: 'Standard consultation',
    },
    {
        doctor_id: 1,
        price_id: 2,
        description: 'Premium consultation',
    },
];

const ServiceDetailPage: React.FC = () => {
    const bioRef = useRef<HTMLDivElement>(null);
    const clinicRef = useRef<HTMLDivElement>(null);
    const hoursRef = useRef<HTMLDivElement>(null);
    const reviewRef = useRef<HTMLDivElement>(null);

    const [expanded, setExpanded] = useState(false);
    const { id } = useParams<{ id: string }>();

    // Get current user info
    const currentUserProfile = useSelector((state: any) => state.user?.profile);
    const currentUserId = currentUserProfile?.id; // For create review
    const currentAccountId = currentUserProfile?.accountId; // For create reply

    // Custom hook for service reviews
    const {
        reviews,
        statistics: reviewStatistics,
        isLoading: reviewLoading,
        refetchReviews,
        refetchStatistics,
    } = useServiceReviews(id);

    const limit = 300;
    const isLongText = mockDoctor.bio.length > limit;
    const displayText = getDisplayText(mockDoctor.bio, expanded, isLongText, limit);

    // Calculate average rating from statistics
    const averageRating = reviewStatistics?.averageRating || 0;

    // Count completed appointments
    const appointmentCount = countAppointments(mockAppointments, mockDoctor.id);

    // Get price range
    const prices = mockDoctorPrices
        .filter((dp) => dp.doctor_id === mockDoctor.id)
        .map((dp) => mockPrices.find((p) => p.id === dp.price_id)?.amount)
        .filter((amount): amount is number => amount !== undefined);
    const priceRange = calculatePriceRange(prices.map((amount) => ({ amount })));

    // Review handlers using custom hook
    const {
        handleSubmitReview,
        handleReplySubmission,
        handleEditReview,
        handleDeleteReview,
        handleEditReply,
        handleDeleteReply,
    } = useReviewHandlers({
        targetType: TargetType.SERVICE,
        targetId: id,
        currentUserId,
        currentAccountId,
        targetName: mockDoctor.name,
        refetchReviews,
        refetchStatistics,
    });
    const { servicesparentId, serviceschildId } = useParams<{
        servicesparentId: string;
        serviceschildId: string;
    }>();
    const breadcrumbData = {
        items: [
            { label: 'Trang chủ', path: '/', isActive: false },
            {
                label: 'Dịch Vụ Y Tế',
                path: replacePathParams(buildPath(PATHS.Service.CATEGORIES), {
                    servicesparentId: servicesparentId!.toString(),
                }),
                isActive: false,
            },
            {
                label: 'Chuyên Khoa Tiêu Hóa',
                path: replacePathParams(PATHS.Service.HOSPITALS, {
                    servicesparentId: servicesparentId!.toString(),
                    serviceschildId: serviceschildId!.toString(),
                }),
                isActive: false,
            },
            { label: 'Chuyên Khoa Tiêu Hóa', isActive: true },
        ],
        title: 'Chuyên Khoa Tiêu Hóa',
    };

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
                                            src={mockDoctor.avatar_url}
                                            className="img-fluid"
                                            alt="User"
                                        />
                                    </div>
                                    <div className="doc-info-cont">
                                        <span className="badge doc-avail-badge">
                                            <i className="fa-solid fa-circle"></i> Sẵn sàng phục vụ
                                        </span>
                                        <h4 className="doc-name">
                                            {mockDoctor.name} <img src={badgeCheck} alt="Badge" />
                                            {/* <span className="badge doctor-role-badge">
                                                <i className="fa-solid fa-circle"></i>{' '}
                                                {mockSpecialty.name}
                                            </span> */}
                                        </h4>
                                        <p>Loại Dịch vụ: Khám chuyên khoa</p>
                                        <p className="address-detail">
                                            <span className="loc-icon">
                                                <i className="feather-map-pin"></i>
                                            </span>
                                            {mockClinic.address}{' '}
                                            <span className="view-text">( Xem vị trí )</span>
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
                                                <p>Email: {mockDoctor.email}</p>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="hospital-info">
                                                <span className="list-icon">
                                                    <img src={buildingIcon} alt="Icon" />
                                                </span>
                                                <p>{mockClinic.name}</p>
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
                                                <Link
                                                    to="#"
                                                    className="d-inline-block average-rating"
                                                >
                                                    {reviews.length} Đánh giá
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
                                                        </span>
                                                        {'Chat'}
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
                                    Mô tả dịch vụ
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
                                        scrollToSection(clinicRef.current);
                                    }}
                                >
                                    Các Bệnh Viện Cung Cấp Chung Dịch Vụ
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
                                        <h4>Mô tả dịch vụ</h4>
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
                            {/* ----------------------- */}
                            <div ref={hoursRef}>
                                <div className="doc-information-details" id="bussiness_hour">
                                    <div className="detail-title">
                                        <h4>Lịch làm việc</h4>
                                    </div>
                                    <ScheduleAvailability />
                                </div>
                            </div>
                            {/* ----------------------- */}
                            <div ref={clinicRef}>
                                <div className="doc-information-details" id="clinic">
                                    <div className="detail-title">
                                        <h4>Các Bệnh Viện Cung Cấp Chung Dịch Vụ</h4>
                                    </div>
                                    <HospitalCarousel hospitals={listmockClinic} />
                                </div>
                            </div>
                            {/* ----------------------- */}
                            {/* Write Review  */}
                            <div ref={reviewRef}>
                                <ReviewSection
                                    reviews={reviews}
                                    doctorName={mockDoctor.name}
                                    currentUserId={currentUserId}
                                    currentAccountId={currentAccountId}
                                    isLoading={reviewLoading}
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

export default ServiceDetailPage;
