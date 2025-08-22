import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import clsx from 'clsx';
import styles from './MedicalFacilityProfile.module.scss';

// Định nghĩa BreadcrumbItem trong file này để tránh lỗi TS2614
interface BreadcrumbItem {
    label: string;
    path?: string;
    isActive?: boolean;
}

// Nhập ảnh
import medicalImg1 from '@/assets/img/medical-img1.jpg';
import patientImg from '@/assets/img/patients/patient.jpg';
import patientImg1 from '@/assets/img/patients/patient1.jpg';
import patientImg2 from '@/assets/img/patients/patient2.jpg';
import featureImg1 from '@/assets/img/features/feature-01.jpg';
import featureImg2 from '@/assets/img/features/feature-02.jpg';
import featureImg3 from '@/assets/img/features/feature-03.jpg';
import featureImg4 from '@/assets/img/features/feature-04.jpg';

// Giao diện dựa trên schema cơ sở dữ liệu
interface Clinic {
    id: number;
    account_id: number;
    name: string;
    address: string;
    phone: string | null;
    email: string;
    description: string;
    background_url: string;
    avatar_url: string;
    status: 'ACTIVE' | 'INACTIVE';
    created_at: string;
    updated_at: string;
}

interface Specialty {
    id: number;
    name: string;
    image_url: string;
    status: 'ACTIVE' | 'INACTIVE';
    created_at: string;
    updated_at: string;
}

interface Review {
    id: number;
    patient_id: number;
    doctor_id: number;
    appointment_id: number | null;
    rating: number;
    comment: string | null;
    parent_review_id: number | null;
    recommend: boolean;
    created_at: string;
    updated_at: string;
    patient: {
        first_name: string;
        last_name: string;
        avatar_url: string;
    };
}

interface Location {
    name: string;
    address: string;
    rating: number;
    images: string[];
    timings: { days: string; times: string[] }[];
}

interface BusinessHour {
    day: string;
    time: string;
}

// Dữ liệu giả lập khớp với schema cơ sở dữ liệu, nội dung bằng tiếng Việt
const mockClinic: Clinic = {
    id: 1,
    account_id: 1,
    name: 'Phòng Khám Medlife',
    address: '96 Đường Hồng Hạc, Cyrus, MN 56323',
    phone: '320-795-8815',
    email: 'lienhe@medlife.com',
    description:
        'Phòng khám Medlife cung cấp dịch vụ y tế chất lượng cao, với đội ngũ bác sĩ giàu kinh nghiệm và trang thiết bị hiện đại. Chúng tôi cam kết mang lại sự chăm sóc tốt nhất cho bệnh nhân, từ khám bệnh định kỳ đến điều trị chuyên sâu.',
    background_url: medicalImg1,
    avatar_url: medicalImg1,
    status: 'ACTIVE',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
};

const mockSpecialties: Specialty[] = [
    {
        id: 1,
        name: 'Dược phẩm',
        image_url: medicalImg1,
        status: 'ACTIVE',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
    },
    {
        id: 2,
        name: 'Thiết bị phẫu thuật',
        image_url: medicalImg1,
        status: 'ACTIVE',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
    },
];

const mockReviews: Review[] = [
    {
        id: 1,
        patient_id: 1,
        doctor_id: 1,
        appointment_id: 1,
        rating: 4,
        comment:
            'Dịch vụ tại phòng khám rất tốt, bác sĩ thân thiện và chuyên nghiệp. Tôi rất hài lòng với trải nghiệm khám bệnh tại đây.',
        parent_review_id: null,
        recommend: true,
        created_at: '2025-08-19T10:00:00Z',
        updated_at: '2025-08-19T10:00:00Z',
        patient: {
            first_name: 'Anh',
            last_name: 'Nguyễn',
            avatar_url: patientImg,
        },
    },
    {
        id: 2,
        patient_id: 2,
        doctor_id: 1,
        appointment_id: 2,
        rating: 4,
        comment:
            'Bác sĩ tư vấn rất nhiệt tình, nhưng thời gian chờ hơi lâu. Nhìn chung, tôi vẫn hài lòng với dịch vụ.',
        parent_review_id: 1,
        recommend: true,
        created_at: '2025-08-18T10:00:00Z',
        updated_at: '2025-08-18T10:00:00Z',
        patient: {
            first_name: 'Mai',
            last_name: 'Trần',
            avatar_url: patientImg1,
        },
    },
    {
        id: 3,
        patient_id: 3,
        doctor_id: 1,
        appointment_id: 3,
        rating: 4,
        comment: 'Phòng khám sạch sẽ, nhân viên nhiệt tình. Tôi sẽ quay lại trong tương lai.',
        parent_review_id: null,
        recommend: true,
        created_at: '2025-08-17T10:00:00Z',
        updated_at: '2025-08-17T10:00:00Z',
        patient: {
            first_name: 'Hùng',
            last_name: 'Lê',
            avatar_url: patientImg2,
        },
    },
];

const mockBusinessHours: BusinessHour[] = [
    { day: 'Thứ Hai', time: '07:00 Sáng - 09:00 Tối' },
    { day: 'Thứ Ba', time: '07:00 Sáng - 09:00 Tối' },
    { day: 'Thứ Tư', time: '07:00 Sáng - 09:00 Tối' },
    { day: 'Thứ Năm', time: '07:00 Sáng - 09:00 Tối' },
    { day: 'Thứ Sáu', time: '07:00 Sáng - 09:00 Tối' },
    { day: 'Thứ Bảy', time: '07:00 Sáng - 09:00 Tối' },
    { day: 'Chủ Nhật', time: 'Đóng cửa' },
];

const mockLocation: Location = {
    name: mockClinic.name,
    address: mockClinic.address,
    rating: 4,
    images: [featureImg1, featureImg2, featureImg3, featureImg4],
    timings: [
        { days: 'Thứ Hai - Thứ Bảy', times: ['10:00 Sáng - 2:00 Chiều', '4:00 Chiều - 9:00 Tối'] },
        { days: 'Chủ Nhật', times: ['10:00 Sáng - 2:00 Chiều'] },
    ],
};

// FacilityWidget Component
const FacilityWidget: React.FC<{ clinic: Clinic }> = ({ clinic }) => {
    const averageRating = 4.0; // Giả lập; tính trung bình từ đánh giá trong ứng dụng thực
    const reviewCount = 17; // Giả lập

    return (
        <div className="card">
            <div className="card-body">
                <div className="doctor-widget">
                    <div className="doc-info-left">
                        <div className="doctor-img1">
                            <Link to={`/facility/${clinic.id}`}>
                                <img
                                    src={clinic.avatar_url}
                                    className="img-fluid"
                                    alt="Hình ảnh cơ sở y tế"
                                />
                            </Link>
                        </div>
                        <div className="doc-info-cont">
                            <h4 className="doc-name mb-2">
                                <Link to={`/facility/${clinic.id}`}>{clinic.name}</Link>
                            </h4>
                            <div className="rating mb-2">
                                <span className={clsx('badge badge-primary', styles.customMargin)}>
                                    {averageRating}
                                </span>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <i
                                        key={index}
                                        className={`fas fa-star ${index < Math.floor(averageRating) ? 'filled' : ''}`}
                                    ></i>
                                ))}
                                <span className="d-inline-block average-rating">
                                    ({reviewCount})
                                </span>
                            </div>
                            <div className="clinic-details">
                                <div className="clini-infos pt-3">
                                    <p className="doc-location mb-2">
                                        <i className="isax isax-call-calling5 me-1"></i>{' '}
                                        {clinic.phone || 'Không có'}
                                    </p>
                                    <p className="doc-location mb-2">
                                        <i className="isax isax-sms me-1"></i>{' '}
                                        {clinic.email || 'Không có'}
                                    </p>
                                    <p className="doc-location mb-2 text-ellipse">
                                        <i className="isax isax-location5 me-1"></i>{' '}
                                        {clinic.address}
                                    </p>
                                    <p className="doc-location mb-2">
                                        <i className="isax isax-arrow-right-3 me-1"></i> Mở cửa lúc
                                        08:00 Sáng
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="doc-info-right d-flex align-items-center justify-content-center">
                        <div className="clinic-booking">
                            <Link className="btn btn-outline-primary" to="/chat">
                                Gửi Tin Nhắn
                            </Link>
                            <a
                                className="btn btn-primary"
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#voice_call"
                            >
                                Gọi Ngay
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Overview Component
const Overview: React.FC<{ clinic: Clinic; specialties: Specialty[] }> = ({
    clinic,
    specialties,
}) => {
    return (
        <div className="row">
            <div className="col-md-12">
                <div className="widget about-widget">
                    <h4 className="widget-title">Giới Thiệu</h4>
                    <p>{clinic.description}</p>
                </div>
                <div className="widget specialties-widget mb-0">
                    <h4 className="widget-title">Chuyên Khoa</h4>
                    <div className="experience-box">
                        <ul className="experience-list">
                            {specialties.length > 0 ? (
                                specialties.map((specialty) => (
                                    <li key={specialty.id}>
                                        <div className="experience-user">
                                            <div className="before-circle"></div>
                                        </div>
                                        <div className="experience-content">
                                            <div className="timeline-content">
                                                <h6 className="exp-title">{specialty.name}</h6>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li>
                                    <div className="experience-content">
                                        <div className="timeline-content">
                                            <p>Không có chuyên khoa nào được liệt kê.</p>
                                        </div>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Locations Component
const Locations: React.FC<{ location: Location }> = ({ location }) => {
    return (
        <div className="location-list">
            <div className="row">
                <div className="col-md-6">
                    <div className="clinic-content">
                        <h4 className="clinic-name">
                            <a href="#">{location.name}</a>
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
                                <a href="javascript:void(0);">Chỉ Đường</a>
                            </h5>
                            <ul>
                                {location.images.map((img, i) => (
                                    <li key={i}>
                                        <a href={img} data-fancybox="gallery2">
                                            <img src={img} alt="Hình ảnh cơ sở" />
                                        </a>
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
    );
};

// Reviews Component
const Reviews: React.FC<{ reviews: Review[]; clinicName: string }> = ({ reviews, clinicName }) => {
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [accepted, setAccepted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Đánh giá mới:', { rating, title, comment, recommend: true });
    };

    return (
        <>
            <div className="widget review-listing">
                <ul className="comments-list">
                    {reviews
                        .filter((r) => !r.parent_review_id)
                        .map((review) => (
                            <li key={review.id}>
                                <div className="comment">
                                    <img
                                        className="avatar avatar-sm rounded-circle"
                                        alt="Hình ảnh bệnh nhân"
                                        src={review.patient.avatar_url}
                                    />
                                    <div className="comment-body">
                                        <div className="meta-data">
                                            <span className="comment-author">
                                                {review.patient.first_name}{' '}
                                                {review.patient.last_name}
                                            </span>
                                            <span className="comment-date">
                                                Đánh giá vào{' '}
                                                {new Date(review.created_at).toLocaleDateString(
                                                    'vi-VN'
                                                )}
                                            </span>
                                            <div className="review-count rating">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <i
                                                        key={i}
                                                        className={`fas fa-star ${i < review.rating ? 'filled' : ''}`}
                                                    ></i>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="recommended">
                                            <i className="far fa-thumbs-up"></i>{' '}
                                            {review.recommend
                                                ? 'Tôi khuyên dùng'
                                                : 'Tôi không khuyên dùng'}
                                        </p>
                                        <p className="comment-content">{review.comment}</p>
                                        <div className="comment-reply">
                                            <a className="comment-btn" href="#">
                                                <i className="fas fa-reply"></i> Trả lời
                                            </a>
                                            <p className="recommend-btn">
                                                <span>Khuyên dùng?</span>
                                                <a href="#" className="like-btn">
                                                    <i className="far fa-thumbs-up"></i> Có
                                                </a>
                                                <a href="#" className="dislike-btn">
                                                    <i className="far fa-thumbs-down"></i> Không
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <ul className="comments-reply">
                                    {reviews
                                        .filter((r) => r.parent_review_id === review.id)
                                        .map((reply) => (
                                            <li key={reply.id}>
                                                <div className="comment">
                                                    <img
                                                        className="avatar avatar-sm rounded-circle"
                                                        alt="Hình ảnh bệnh nhân"
                                                        src={reply.patient.avatar_url}
                                                    />
                                                    <div className="comment-body">
                                                        <div className="meta-data">
                                                            <span className="comment-author">
                                                                {reply.patient.first_name}{' '}
                                                                {reply.patient.last_name}
                                                            </span>
                                                            <span className="comment-date">
                                                                Trả lời vào{' '}
                                                                {new Date(
                                                                    reply.created_at
                                                                ).toLocaleDateString('vi-VN')}
                                                            </span>
                                                            <div className="review-count rating">
                                                                {Array.from({ length: 5 }).map(
                                                                    (_, i) => (
                                                                        <i
                                                                            key={i}
                                                                            className={`fas fa-star ${i < reply.rating ? 'filled' : ''}`}
                                                                        ></i>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                        <p className="comment-content">
                                                            {reply.comment}
                                                        </p>
                                                        <div className="comment-reply">
                                                            <a className="comment-btn" href="#">
                                                                <i className="fas fa-reply"></i> Trả
                                                                lời
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                </ul>
                            </li>
                        ))}
                </ul>
                <div className="all-feedback text-center">
                    <a href="#" className="btn btn-primary btn-sm">
                        Xem tất cả đánh giá <strong>(167)</strong>
                    </a>
                </div>
            </div>
            <div className="write-review">
                <h4>
                    Viết đánh giá cho <strong>{clinicName}</strong>
                </h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="mb-2">Đánh giá</label>
                        <div className="star-rating">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <React.Fragment key={i}>
                                    <input
                                        id={`star-${5 - i}`}
                                        type="radio"
                                        name="rating"
                                        value={5 - i}
                                        onChange={() => setRating(5 - i)}
                                    />
                                    <label htmlFor={`star-${5 - i}`} title={`${5 - i} sao`}>
                                        <i
                                            className={`active fa fa-star ${rating >= 5 - i ? 'filled' : ''}`}
                                        ></i>
                                    </label>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="mb-2">Tiêu đề đánh giá</label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Bạn sẽ nói gì trong một câu?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="mb-2">Nội dung đánh giá</label>
                        <textarea
                            className="form-control"
                            maxLength={100}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                        <div className="d-flex justify-content-between mt-3">
                            <small className="text-muted">
                                <span>{100 - comment.length}</span> ký tự còn lại
                            </small>
                        </div>
                    </div>
                    <hr />
                    <div className="mb-3">
                        <div className="terms-accept">
                            <div className="custom-checkbox">
                                <input
                                    type="checkbox"
                                    id="terms_accept"
                                    checked={accepted}
                                    onChange={() => setAccepted(!accepted)}
                                />
                                <label htmlFor="terms_accept">
                                    Tôi đã đọc và đồng ý với{' '}
                                    <a href="/terms-condition">Điều khoản & Điều kiện</a>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="submit-section">
                        <button
                            type="submit"
                            className="btn btn-primary submit-btn"
                            disabled={!accepted}
                        >
                            Thêm Đánh Giá
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

// BusinessHours Component
const BusinessHours: React.FC<{ businessHours: BusinessHour[] }> = ({ businessHours }) => {
    return (
        <div className="row">
            <div className="col-md-6 offset-md-3">
                <div className="widget business-widget">
                    <div className="widget-content">
                        <div className="listing-hours">
                            <div className="listing-day current">
                                <div className="day">
                                    Hôm nay{' '}
                                    <span>
                                        {new Date().toLocaleDateString('vi-VN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                                <div className="time-items">
                                    <span className="open-status">
                                        <span className="badge bg-success-light">Đang Mở</span>
                                    </span>
                                    <span className="time">07:00 Sáng - 09:00 Tối</span>
                                </div>
                            </div>
                            {businessHours.map((hour, index) => (
                                <div
                                    className={`listing-day ${hour.time === 'Đóng cửa' ? 'closed' : ''}`}
                                    key={index}
                                >
                                    <div className="day">{hour.day}</div>
                                    <div className="time-items">
                                        <span className="time">
                                            {hour.time === 'Đóng cửa' ? (
                                                <span className="badge bg-danger-light">
                                                    Đóng cửa
                                                </span>
                                            ) : (
                                                hour.time
                                            )}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// FacilityTabs Component
const FacilityTabs: React.FC<{
    clinic: Clinic;
    specialties: Specialty[];
    location: Location;
    reviews: Review[];
    businessHours: BusinessHour[];
}> = ({ clinic, specialties, location, reviews, businessHours }) => {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="card">
            <div className="card-body pt-0">
                <nav className="user-tabs mb-4">
                    <ul className="nav nav-tabs nav-tabs-bottom nav-justified">
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                                href="#doc_overview"
                                onClick={() => setActiveTab('overview')}
                            >
                                Tổng Quan
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeTab === 'locations' ? 'active' : ''}`}
                                href="#doc_locations"
                                onClick={() => setActiveTab('locations')}
                            >
                                Địa Điểm
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                                href="#doc_reviews"
                                onClick={() => setActiveTab('reviews')}
                            >
                                Đánh Giá
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeTab === 'business_hours' ? 'active' : ''}`}
                                href="#doc_business_hours"
                                onClick={() => setActiveTab('business_hours')}
                            >
                                Giờ Làm Việc
                            </a>
                        </li>
                    </ul>
                </nav>
                <div className="tab-content pt-0">
                    <div
                        className={`tab-pane fade ${activeTab === 'overview' ? 'show active' : ''}`}
                        id="doc_overview"
                    >
                        <Overview clinic={clinic} specialties={specialties} />
                    </div>
                    <div
                        className={`tab-pane fade ${activeTab === 'locations' ? 'show active' : ''}`}
                        id="doc_locations"
                    >
                        <Locations location={location} />
                    </div>
                    <div
                        className={`tab-pane fade ${activeTab === 'reviews' ? 'show active' : ''}`}
                        id="doc_reviews"
                    >
                        <Reviews reviews={reviews} clinicName={clinic.name} />
                    </div>
                    <div
                        className={`tab-pane fade ${activeTab === 'business_hours' ? 'show active' : ''}`}
                        id="doc_business_hours"
                    >
                        <BusinessHours businessHours={businessHours} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Component
const MedicalFacilityProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [clinic, setClinic] = useState<Clinic | null>(null);
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Giả lập gọi API với dữ liệu giả
        setClinic(mockClinic);
        setSpecialties(mockSpecialties);
        setReviews(mockReviews);
        setLoading(false);
    }, [id]);

    if (loading) {
        return (
            <MainLayout>
                <div>Đang tải...</div>
            </MainLayout>
        );
    }

    if (!clinic) {
        return (
            <MainLayout>
                <div>Không tìm thấy cơ sở y tế</div>
            </MainLayout>
        );
    }

    const breadcrumbData: { items: BreadcrumbItem[]; title: string } = {
        items: [
            { label: 'Trang Chủ', path: '/', isActive: false },
            { label: 'Cơ Sở Y Tế', path: '/facilities', isActive: false },
            { label: clinic.name, isActive: true },
        ],
        title: clinic.name,
    };

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
            <div className="content">
                <div className="container">
                    <FacilityWidget clinic={clinic} />
                    <FacilityTabs
                        clinic={clinic}
                        specialties={specialties}
                        location={mockLocation}
                        reviews={reviews}
                        businessHours={mockBusinessHours}
                    />
                </div>
            </div>
        </MainLayout>
    );
};

export default MedicalFacilityProfile;
