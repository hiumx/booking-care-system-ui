import React, { useRef, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import styles from './DoctorProfile.module.scss';
import Pagination from '@/components/Pagination';
import ReviewCard from '@/components/ReviewCard';
import Button from '@/components/Button';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import WriteReview from './components/WriteReview';
import { getDoctorByIdAsync } from '@/store/slices/doctorSlice';
import {
    selectSelectedDoctor,
    selectDoctorLoading,
    selectDoctorError,
} from '@/store/selectors/doctor.selectors';
import { AppDispatch } from '@/store';

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
import DoctorAvailability from './components/DoctorAvailability';
import { PATHS, replacePathParams } from '@/routes/paths';

// Mock data for Appointments
const mockAppointments = Array.from({ length: 200 }, (_, index) => ({
    id: 201 + index,
    patient_id: 100 + (index % 50) + 1,
    doctor_id: 1,
    clinic_id: 1,
    appointment_time_id: 1,
    appointment_date: new Date(Date.now() - index * 86400000).toISOString(),
    price_id: index % 2 === 0 ? 1 : 2,
    status: 'COMPLETED',
    type: 'IN_PERSON',
    reason: `Check-up ${index + 1}`,
    result: `Successful visit ${index + 1}`,
    created_at: new Date(Date.now() - index * 86400000).toISOString(),
    updated_at: new Date(Date.now() - index * 86400000).toISOString(),
}));

// Mock data for Reviews
const baseReviews = [
    {
        id: 1,
        patient_id: 101,
        doctor_id: 1,
        appointment_id: 201,
        rating: 5,
        comment: 'Cảm ơn bác sĩ vì sự tận tâm! Dịch vụ rất tốt.',
        recommend: true,
        parent_review_id: null,
        created_at: '2025-08-17 14:03:00',
        updated_at: '2025-08-17 14:03:00',
        timeAgo: '2 days ago',
        user: {
            id: 101,
            account_id: 101,
            email: 'patient1@example.com',
            first_name: 'Nguyễn',
            last_name: 'Thị B',
            gender: 'FEMALE',
            address: 'Hải Châu, Đà Nẵng',
            phone: '0905-123-456',
            avatar_url: doctorImg,
            created_at: '2025-01-01 10:00:00',
            updated_at: '2025-08-17 14:00:00',
        },
    },
    {
        id: 2,
        patient_id: 102,
        doctor_id: 1,
        appointment_id: 202,
        rating: 5,
        comment: 'Bác sĩ rất chuyên nghiệp, tôi rất hài lòng!',
        recommend: true,
        parent_review_id: null,
        created_at: '2025-07-19 14:03:00',
        updated_at: '2025-07-19 14:03:00',
        timeAgo: '31 days ago',
        user: {
            id: 102,
            account_id: 102,
            email: 'patient2@example.com',
            first_name: 'Trần',
            last_name: 'Văn C',
            gender: 'MALE',
            address: 'Sơn Trà, Đà Nẵng',
            phone: '0905-654-321',
            avatar_url: doctorImg,
            created_at: '2025-02-01 10:00:00',
            updated_at: '2025-07-19 14:00:00',
        },
    },
    {
        id: 3,
        patient_id: 103,
        doctor_id: 1,
        appointment_id: 203,
        rating: 5,
        comment: 'Dịch vụ tuyệt vời, sẽ quay lại!',
        recommend: true,
        parent_review_id: null,
        created_at: '2025-08-04 14:03:00',
        updated_at: '2025-08-04 14:03:00',
        timeAgo: '15 days ago',
        user: {
            id: 103,
            account_id: 103,
            email: 'patient3@example.com',
            first_name: 'Lê',
            last_name: 'Thị D',
            gender: 'FEMALE',
            address: 'Ngũ Hành Sơn, Đà Nẵng',
            phone: '0905-789-123',
            avatar_url: doctorImg,
            created_at: '2025-03-01 10:00:00',
            updated_at: '2025-08-04 14:00:00',
        },
        replies: [
            {
                id: 4,
                patient_id: 104,
                doctor_id: 1,
                appointment_id: null,
                rating: null,
                comment: 'Cảm ơn ý kiến của bạn, chúng tôi sẽ cải thiện!',
                recommend: false,
                parent_review_id: 3,
                created_at: '2025-08-05 14:03:00',
                updated_at: '2025-08-05 14:03:00',
                user: {
                    id: 104,
                    account_id: 104,
                    email: 'reply1@example.com',
                    first_name: 'Phan',
                    last_name: 'Văn E',
                    gender: 'MALE',
                    address: 'Liên Chiểu, Đà Nẵng',
                    phone: '0905-456-789',
                    avatar_url: doctorImg,
                    created_at: '2025-04-01 10:00:00',
                    updated_at: '2025-08-05 14:00:00',
                },
            },
        ],
    },
];

// Generate 150 reviews to match "150 Đánh giá" and achieve 94% recommendation
const reviews = Array.from({ length: 150 }, (_, index) => {
    const baseIndex = index % baseReviews.length;
    const baseReview = baseReviews[baseIndex];
    const recommend = index < 141;
    return {
        ...baseReview,
        id: index + 1,
        patient_id: 100 + index + 1,
        appointment_id: 201 + index,
        rating: 5,
        comment: `${baseReview.comment} (Review ${index + 1})`,
        recommend,
        created_at: new Date(Date.now() - index * 86400000).toISOString(),
        updated_at: new Date(Date.now() - index * 86400000).toISOString(),
        timeAgo: `${(index % 30) + 1} days ago`,
        userId: baseReview.user.id, // Add userId for edit/delete permission check
        user: {
            ...baseReview.user,
            id: 100 + index + 1,
            account_id: 100 + index + 1,
            email: `patient${index + 1}@example.com`,
            first_name: baseReview.user.first_name,
            last_name: `${baseReview.user.last_name}${index + 1}`,
            created_at: new Date(Date.now() - index * 86400000).toISOString(),
            updated_at: new Date(Date.now() - index * 86400000).toISOString(),
        },
        replies: baseReview.replies?.map((reply) => ({
            ...reply,
            id: reply.id + index,
            patient_id: 100 + index + 2,
            recommend: false,
            userId: reply.user.id, // Add userId for edit/delete permission
            user: {
                ...reply.user,
                id: 100 + index + 2,
                account_id: 100 + index + 2,
                email: `reply${index + 1}@example.com`,
                first_name: reply.user.first_name,
                last_name: `${reply.user.last_name}${index + 1}`,
                created_at: new Date(Date.now() - (index + 1) * 86400000).toISOString(),
                updated_at: new Date(Date.now() - (index + 1) * 86400000).toISOString(),
            },
        })),
    };
});

const DoctorProfile: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>();

    // Redux selectors
    const selectedDoctor = useSelector(selectSelectedDoctor);
    const isLoading = useSelector(selectDoctorLoading);
    const error = useSelector(selectDoctorError);

    // Fetch doctor data when component mounts or id changes
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

    const scrollToSection = (el: HTMLDivElement | null) => {
        el?.scrollIntoView({ behavior: 'smooth' });
    };

    const [expanded, setExpanded] = useState(false);

    // Function to generate Google Maps embed URL from address
    const generateMapUrl = (address: string) => {
        if (!address) {
            // Fallback to default location if no address
            return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.7301009561315!2d-76.13077892422932!3d36.82498697224007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89bae976cfe9f8af%3A0xa61eac05156fbdb9!2sBeachStreet%20USA!5e0!3m2!1sen!2sin!4v1669777904208!5m2!1sen!2sin';
        }

        // Encode the address for URL - using simple Google Maps embed
        const encodedAddress = encodeURIComponent(address);
        return `https://maps.google.com/maps?q=${encodedAddress}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    };

    // Use selectedDoctor data instead of mock data
    const doctor = selectedDoctor;
    const limit = 300;
    const isLongText = doctor?.bio ? doctor.bio.length > limit : false;
    const displayText = doctor?.bio
        ? expanded || !isLongText
            ? doctor.bio
            : doctor.bio.slice(0, limit) + '...'
        : '';

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 2;
    const totalPages = Math.ceil(reviews.length / pageSize);
    const displayedReviews = reviews.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const [showWriteReview, setShowWriteReview] = useState(false);

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
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
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

    // Calculate average rating from review statistics
    const averageRating = doctor.reviewStatistics?.averageRating
        ? doctor.reviewStatistics.averageRating.toFixed(1)
        : '0.0';

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

    // Count completed appointments (mock data for now)
    const appointmentCount = mockAppointments.filter(
        (apt) => apt.doctor_id === parseInt(doctor.id || '1')
    ).length;

    // Get price range from doctor data
    const prices = doctor.prices?.map((price) => price.amount) || [];

    const allPrices = prices;
    const priceRange =
        allPrices.length > 0
            ? `${Math.min(...allPrices).toLocaleString('vi-VN')}đ - ${Math.max(...allPrices).toLocaleString('vi-VN')}đ`
            : 'N/A';

    // Handle review submission
    const handleSubmitReview = (reviewData: {
        rating: number;
        description: string;
        termsAccepted: boolean;
    }) => {
        console.log('New review submitted:', reviewData);
        // Trong thực tế, sẽ gọi API để submit review
        alert('Đánh giá của bạn đã được gửi thành công!');
        setShowWriteReview(false);
    };

    // Handle reply submission
    const handleReplySubmission = (replyData: { reviewId: number; text: string }) => {
        console.log('New reply submitted:', replyData);
        // Trong thực tế, sẽ gọi API để submit reply
        alert('Phản hồi của bạn đã được gửi thành công!');
        // Có thể refresh reviews hoặc update state local
    };

    // Handle edit review
    const handleEditReview = (reviewData: {
        reviewId: number;
        rating: number;
        description: string;
        recommend?: boolean;
    }) => {
        console.log('Review edited:', reviewData);
        // Trong thực tế, sẽ gọi API để update review
        alert('Đánh giá của bạn đã được cập nhật thành công!');
        // Có thể refresh reviews hoặc update state local
    };

    // Handle delete review
    const handleDeleteReview = (reviewId: number) => {
        console.log('Review deleted:', reviewId);
        // Trong thực tế, sẽ gọi API để delete review
        alert('Đánh giá đã được xóa thành công!');
        // Có thể refresh reviews hoặc update state local
    };

    // Handle edit reply
    const handleEditReply = (replyData: { replyId: number; text: string }) => {
        console.log('Reply edited:', replyData);
        // Trong thực tế, sẽ gọi API để update reply
        alert('Phản hồi đã được cập nhật thành công!');
        // Có thể refresh reviews hoặc update state local
    };

    // Handle delete reply
    const handleDeleteReply = (replyId: number) => {
        console.log('Reply deleted:', replyId);
        // Trong thực tế, sẽ gọi API để delete reply
        alert('Phản hồi đã được xóa thành công!');
        // Có thể refresh reviews hoặc update state local
    };

    // Mock current user ID for demo purposes
    const currentUserId = 101; // Giả sử user hiện tại có ID là 101

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
                                            {doctor.hospital?.address}{' '}
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
                                                    Giới tính:{' '}
                                                    {String(doctor.gender) === 'FEMALE'
                                                        ? 'Nữ'
                                                        : String(doctor.gender) === 'MALE'
                                                          ? 'Nam'
                                                          : 'Khác'}
                                                </p>
                                            </div>
                                            <h5 className="accept-text">
                                                <span>
                                                    <i className="feather-check"></i>
                                                </span>
                                                Tiếp nhận bệnh nhân mới
                                            </h5>
                                        </li>
                                        <li>
                                            <div className="rating">
                                                {renderStars(parseFloat(averageRating))}
                                                <span>{averageRating}</span>
                                                <Link
                                                    to="#reviews"
                                                    className="d-inline-block average-rating"
                                                >
                                                    {doctor.reviewStatistics?.totalReviews || 0}{' '}
                                                    Đánh giá
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
                                                        Chat
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/voice-call">
                                                        <span className="bg-violet">
                                                            <i className="feather-phone-forwarded"></i>
                                                        </span>
                                                        Audio Call
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/video-call">
                                                        <span className="bg-indigo">
                                                            <i className="fa-solid fa-video"></i>
                                                        </span>
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
                                            <h5>{doctor.hospital?.name || 'Bệnh viện'}</h5>
                                            <p>
                                                <strong>Chuyên khoa:</strong>{' '}
                                                {doctor.specialty?.name || 'Chuyên khoa'}
                                            </p>
                                            <p>
                                                <strong>Trình độ:</strong>{' '}
                                                {doctor.position?.name || 'Bác sĩ'}
                                            </p>
                                            <p>
                                                <strong>Kinh nghiệm:</strong>{' '}
                                                {doctor.yearsOfExperience} năm kinh nghiệm
                                            </p>
                                            <p>
                                                <strong>Mô tả:</strong>{' '}
                                                {doctor.bio
                                                    ? doctor.bio.substring(0, 100) + '...'
                                                    : 'Không có thông tin giới thiệu'}
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
                                                {doctor.specialty?.name || 'Chuyên khoa'}
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
                                            doctor.prices.map((price, index) => (
                                                <li key={index}>
                                                    <Link to={`/service/${price.id}`}>
                                                        {price.serviceTypeName}
                                                        <span>
                                                            {price.amount.toLocaleString('vi-VN')}đ
                                                        </span>
                                                    </Link>
                                                </li>
                                            ))
                                        ) : (
                                            <>
                                                <li>
                                                    <Link to="/service/basic-consultation">
                                                        Tư vấn cơ bản
                                                        <span>300.000đ</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/service/specialty-examination">
                                                        Khám chuyên khoa
                                                        <span>500.000đ</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/service/advanced-consultation">
                                                        Tư vấn nâng cao
                                                        <span>800.000đ</span>
                                                    </Link>
                                                </li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                            </div>
                            <div ref={clinicRef}>
                                <div className="doc-information-details" id="clinic">
                                    <div className="detail-title">
                                        <h4>Bệnh viện & Vị trí</h4>
                                    </div>
                                    <div className="clinic-loc">
                                        <div className="row align-items-center">
                                            <div className="col-lg-7">
                                                <div className="clinic-info">
                                                    <div className="clinic-img">
                                                        <img
                                                            src={
                                                                doctor.hospital?.avatarUrl ||
                                                                '/assets/img/clinic/clinic-11.jpg'
                                                            }
                                                            alt={
                                                                doctor.hospital?.name || 'Bệnh viện'
                                                            }
                                                        />
                                                    </div>
                                                    <div className="detail-clinic">
                                                        <h5>
                                                            {doctor.hospital?.name || 'Bệnh viện'}
                                                        </h5>
                                                        <Link
                                                            to={`/hospital/${doctor.hospital?.id || ''}`}
                                                            className="clinic-link"
                                                        >
                                                            Xem thông tin bệnh viện
                                                        </Link>
                                                        <p>
                                                            <i className="feather-map-pin me-2"></i>
                                                            {doctor.hospital?.address ||
                                                                doctor.address ||
                                                                'Địa chỉ bệnh viện'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center avail-time-slot">
                                                    {[
                                                        {
                                                            day: 'Thứ 2',
                                                            time: '07:00 AM - 17:00 PM',
                                                        },
                                                        {
                                                            day: 'Thứ 7',
                                                            time: '07:00 AM - 17:00 PM',
                                                        },
                                                    ].map((slot, idx) => (
                                                        <div
                                                            className="availability-date"
                                                            key={idx}
                                                        >
                                                            <div className="book-date">
                                                                <h6>{slot.day}</h6>
                                                                <span>{slot.time}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="col-lg-5">
                                                <div className="contact-map d-flex">
                                                    <iframe
                                                        src={generateMapUrl(
                                                            doctor.hospital?.address ||
                                                                doctor.address ||
                                                                'Địa chỉ bệnh viện'
                                                        )}
                                                        allowFullScreen
                                                        loading="lazy"
                                                        referrerPolicy="no-referrer-when-downgrade"
                                                        title={`Map for ${doctor.hospital?.name || 'Bệnh viện'}`}
                                                    ></iframe>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div ref={hoursRef}>
                                <div className="doc-information-details" id="bussiness_hour">
                                    <div className="detail-title">
                                        <h4>Lịch làm việc</h4>
                                    </div>
                                    <DoctorAvailability />
                                </div>
                            </div>
                            {/* Write Review  */}
                            <div ref={reviewRef}>
                                <div id="review">
                                    <div className="detail-title mb-3">
                                        <h4>Đánh giá ({reviews.length})</h4>
                                    </div>

                                    {/* Write Review Section */}
                                    <div className="write-review-section mb-4">
                                        {!showWriteReview ? (
                                            <Button
                                                text="Viết đánh giá"
                                                type="button"
                                                className="btn-primary"
                                                onClick={() => setShowWriteReview(true)}
                                            />
                                        ) : (
                                            <WriteReview
                                                doctorName={`${doctor.lastName} ${doctor.firstName}`}
                                                onSubmitReview={handleSubmitReview}
                                            />
                                        )}

                                        {showWriteReview && (
                                            <Button
                                                text="Hủy"
                                                type="button"
                                                className={clsx('mt-2', styles.cancelButton)}
                                                onClick={() => setShowWriteReview(false)}
                                            />
                                        )}
                                    </div>

                                    {displayedReviews.map((review, index) => (
                                        <ReviewCard
                                            key={review.id}
                                            review={{
                                                id: review.id,
                                                name: `${review.user.first_name} ${review.user.last_name}`,
                                                avatar: review.user.avatar_url,
                                                rating: review.rating,
                                                timeAgo: review.timeAgo, // Fixed: Changed from timesworth to timeAgo
                                                text: review.comment,
                                                recommend: review.recommend,
                                                userId: review.userId,
                                                isEditable: true, // Mock: reviews can be edited within 24h
                                                replies: review.replies?.map((reply) => ({
                                                    id: reply.id,
                                                    name: `${reply.user.first_name} ${reply.user.last_name}`,
                                                    avatar: reply.user.avatar_url,
                                                    text: reply.comment,
                                                    userId: reply.userId, // Add userId for edit/delete permission
                                                })),
                                            }}
                                            isLast={index === displayedReviews.length - 1}
                                            onReply={handleReplySubmission}
                                            canEdit={true}
                                            canDelete={true}
                                            currentUserId={currentUserId}
                                            onEdit={handleEditReview}
                                            onDelete={handleDeleteReview}
                                            onEditReply={handleEditReply}
                                            onDeleteReply={handleDeleteReply}
                                        />
                                    ))}
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default DoctorProfile;
