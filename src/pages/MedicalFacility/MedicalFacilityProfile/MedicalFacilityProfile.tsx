import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import clsx from 'clsx';
import styles from './MedicalFacilityProfile.module.scss';
import Overview from './components/Overview';
import LocationTab from './components/Location';
import BusinessHours from './components/BusinessHours';
import ReviewCard from '@/components/ReviewCard';
import Pagination from '@/components/Pagination';

import medicalImg1 from '@/assets/img/medical-img1.jpg';
import patientImg from '@/assets/img/patients/patient.jpg';
import patientImg1 from '@/assets/img/patients/patient1.jpg';
import patientImg2 from '@/assets/img/patients/patient2.jpg';
import featureImg1 from '@/assets/img/features/feature-01.jpg';
import featureImg2 from '@/assets/img/features/feature-02.jpg';
import featureImg3 from '@/assets/img/features/feature-03.jpg';
import featureImg4 from '@/assets/img/features/feature-04.jpg';

interface BreadcrumbItem {
    label: string;
    path?: string;
    isActive?: boolean;
}

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

// Updated mock data in MedicalFacilityProfile.tsx

const mockClinic: Clinic = {
    id: 1,
    account_id: 1,
    name: 'Phòng Khám Medlife',
    address: '96 Đường Hồng Hạc, Cyrus, MN 56323',
    phone: '320-795-8815',
    email: 'lienhe@medlife.com',
    description:
        'Phòng khám Medlife là một cơ sở y tế hàng đầu tại khu vực, được thành lập từ năm 2005 với sứ mệnh mang đến dịch vụ chăm sóc sức khỏe toàn diện, chất lượng cao và thân thiện với bệnh nhân. Chúng tôi tự hào sở hữu đội ngũ bác sĩ và nhân viên y tế giàu kinh nghiệm, được đào tạo tại các trường đại học y khoa uy tín trong và ngoài nước. Với hơn 15 năm hoạt động, Medlife đã phục vụ hàng ngàn bệnh nhân, từ các trường hợp khám sức khỏe định kỳ đến điều trị các bệnh lý phức tạp. Phòng khám được trang bị hệ thống máy móc hiện đại nhập khẩu từ các quốc gia tiên tiến như Mỹ, Đức và Nhật Bản, bao gồm máy siêu âm 4D, máy chụp CT, MRI, và các thiết bị xét nghiệm tự động hóa cao. Chúng tôi cam kết tuân thủ nghiêm ngặt các tiêu chuẩn vệ sinh và an toàn y tế theo quy định của Bộ Y tế, đảm bảo môi trường khám chữa bệnh sạch sẽ, thoải mái và an toàn tuyệt đối cho mọi bệnh nhân. Tại Medlife, chúng tôi không chỉ tập trung vào việc điều trị bệnh mà còn nhấn mạnh vào công tác phòng ngừa, giáo dục sức khỏe cộng đồng thông qua các chương trình hội thảo, tư vấn miễn phí và các chiến dịch nâng cao nhận thức về lối sống lành mạnh. Dịch vụ của chúng tôi bao gồm khám ngoại trú, nội trú ngắn ngày, tiêm chủng, kiểm tra sức khỏe doanh nghiệp, và hỗ trợ tư vấn trực tuyến 24/7. Chúng tôi luôn đặt bệnh nhân làm trung tâm, lắng nghe và đồng hành cùng bạn trong mọi giai đoạn sức khỏe. Với phương châm "Sức khỏe là vàng", Medlife không ngừng cải tiến để mang đến trải nghiệm tốt nhất, giúp bạn và gia đình sống khỏe mạnh hơn mỗi ngày. Ngoài ra, phòng khám còn hợp tác chặt chẽ với các bệnh viện lớn trong khu vực để chuyển tuyến kịp thời các ca bệnh nặng, đảm bảo sự liên tục trong chăm sóc. Chúng tôi cũng đầu tư vào nghiên cứu y khoa, tham gia các dự án cộng đồng như khám bệnh miễn phí cho người nghèo, hỗ trợ y tế vùng sâu vùng xa, và các chương trình đào tạo nâng cao năng lực cho nhân viên y tế địa phương. Medlife không chỉ là nơi chữa bệnh mà còn là người bạn đồng hành đáng tin cậy trong hành trình chăm sóc sức khỏe của bạn.',
    background_url: medicalImg1,
    avatar_url: medicalImg1,
    status: 'ACTIVE',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
};

const mockSpecialties: Specialty[] = [
    {
        id: 1,
        name: 'Nội khoa',
        image_url: medicalImg1,
        status: 'ACTIVE',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
    },
    {
        id: 2,
        name: 'Ngoại khoa',
        image_url: medicalImg1,
        status: 'ACTIVE',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
    },
    {
        id: 3,
        name: 'Sản phụ khoa',
        image_url: medicalImg1,
        status: 'ACTIVE',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
    },
    {
        id: 4,
        name: 'Nhi khoa',
        image_url: medicalImg1,
        status: 'ACTIVE',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
    },
    {
        id: 5,
        name: 'Tai mũi họng',
        image_url: medicalImg1,
        status: 'ACTIVE',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
    },
    {
        id: 6,
        name: 'Răng hàm mặt',
        image_url: medicalImg1,
        status: 'ACTIVE',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
    },
    {
        id: 7,
        name: 'Da liễu',
        image_url: medicalImg1,
        status: 'ACTIVE',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
    },
    {
        id: 8,
        name: 'Tâm thần',
        image_url: medicalImg1,
        status: 'ACTIVE',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
    },
    {
        id: 9,
        name: 'Chẩn đoán hình ảnh',
        image_url: medicalImg1,
        status: 'ACTIVE',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
    },
    {
        id: 10,
        name: 'Phục hồi chức năng',
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

const MedicalFacilityProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [clinic, setClinic] = useState<Clinic | null>(null);
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [currentPage, setCurrentPage] = useState(1);

    const pageSize = 2;
    const totalPages = Math.ceil(reviews.filter((r) => !r.parent_review_id).length / pageSize);
    const displayedReviews = reviews
        .filter((r) => !r.parent_review_id)
        .slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Mock current user ID for edit/delete permissions
    const currentUserId = 1;

    // Mock handlers for review actions
    const handleReplySubmission = (replyData: { reviewId: number; text: string }) => {
        console.log('New reply submitted:', replyData);
        alert('Phản hồi của bạn đã được gửi thành công!');
    };

    const handleEditReview = (reviewData: {
        reviewId: number;
        rating: number;
        description: string;
        recommend?: boolean;
    }) => {
        console.log('Review edited:', reviewData);
        alert('Đánh giá của bạn đã được cập nhật thành công!');
    };

    const handleDeleteReview = (reviewId: number) => {
        console.log('Review deleted:', reviewId);
        alert('Đánh giá đã được xóa thành công!');
    };

    const handleEditReply = (replyData: { replyId: number; text: string }) => {
        console.log('Reply edited:', replyData);
        alert('Phản hồi đã được cập nhật thành công!');
    };

    const handleDeleteReply = (replyId: number) => {
        console.log('Reply deleted:', replyId);
        alert('Phản hồi đã được xóa thành công!');
    };

    useEffect(() => {
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
            { label: 'Cơ Sở Y Tế', path: '/medical-facility', isActive: false },
            { label: clinic.name, isActive: true },
        ],
        title: clinic.name,
    };

    const averageRating = 4.0;
    const reviewCount = 17;

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
            <div className="content">
                <div className="container">
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
                                            <span
                                                className={clsx(
                                                    'badge badge-primary',
                                                    styles.customMargin
                                                )}
                                            >
                                                {averageRating}
                                            </span>
                                            {Array.from({ length: 5 }).map((_, index) => (
                                                <i
                                                    key={index}
                                                    className={clsx(
                                                        'fas fa-star',
                                                        index < Math.floor(averageRating) &&
                                                            'filled',
                                                        styles.customPadding
                                                    )}
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
                                                    <i className="isax isax-arrow-right-3 me-1"></i>{' '}
                                                    Mở cửa lúc 08:00 Sáng
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

                                        <Link
                                            className="btn btn-primary"
                                            to="#"
                                            data-bs-toggle="modal"
                                            data-bs-target="#voice_call"
                                        >
                                            Gọi Ngay
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body pt-0">
                            <nav className="user-tabs mb-4">
                                <ul className="nav nav-tabs nav-tabs-bottom nav-justified">
                                    <li className="nav-item">
                                        <a
                                            className={clsx('nav-link', {
                                                active: activeTab === 'overview',
                                            })}
                                            href="#doc_overview"
                                            data-bs-toggle="tab"
                                            onClick={() => setActiveTab('overview')}
                                        >
                                            Tổng Quan
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a
                                            className={clsx('nav-link', {
                                                active: activeTab === 'locations',
                                            })}
                                            href="#doc_locations"
                                            data-bs-toggle="tab"
                                            onClick={() => setActiveTab('locations')}
                                        >
                                            Địa Điểm
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a
                                            className={clsx('nav-link', {
                                                active: activeTab === 'reviews',
                                            })}
                                            href="#doc_reviews"
                                            data-bs-toggle="tab"
                                            onClick={() => setActiveTab('reviews')}
                                        >
                                            Đánh Giá
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a
                                            className={clsx('nav-link', {
                                                active: activeTab === 'business_hours',
                                            })}
                                            href="#doc_business_hours"
                                            data-bs-toggle="tab"
                                            onClick={() => setActiveTab('business_hours')}
                                        >
                                            Giờ Làm Việc
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                            <div className="tab-content pt-0">
                                {activeTab === 'overview' && (
                                    <Overview
                                        clinic={clinic}
                                        specialties={specialties}
                                        isActive={activeTab === 'overview'}
                                    />
                                )}
                                {activeTab === 'locations' && (
                                    <LocationTab
                                        location={mockLocation}
                                        isActive={activeTab === 'locations'}
                                    />
                                )}
                                {activeTab === 'reviews' && (
                                    <div
                                        className={clsx('tab-pane fade', {
                                            'show active': activeTab === 'reviews',
                                        })}
                                        id="doc_reviews"
                                    >
                                        <div className="detail-title">
                                            <h4>Đánh giá ({reviews.length})</h4>
                                        </div>
                                        {reviews.length === 0 ? (
                                            <p>Không có đánh giá nào để hiển thị.</p>
                                        ) : (
                                            <div className="widget review-listing">
                                                {displayedReviews.map((review, index) => (
                                                    <ReviewCard
                                                        key={review.id}
                                                        review={{
                                                            id: review.id,
                                                            name: `${review.patient.first_name} ${review.patient.last_name}`,
                                                            avatar: review.patient.avatar_url,
                                                            rating: review.rating,
                                                            timeAgo: `${Math.round(
                                                                (Date.now() -
                                                                    new Date(
                                                                        review.created_at
                                                                    ).getTime()) /
                                                                    (1000 * 60 * 60 * 24)
                                                            )} days ago`,
                                                            text: review.comment || '',
                                                            recommend: review.recommend,
                                                            userId: review.patient_id,
                                                            isEditable: false,
                                                            replies: reviews
                                                                .filter(
                                                                    (r) =>
                                                                        r.parent_review_id ===
                                                                        review.id
                                                                )
                                                                .map((reply) => ({
                                                                    id: reply.id,
                                                                    name: `${reply.patient.first_name} ${reply.patient.last_name}`,
                                                                    avatar: reply.patient
                                                                        .avatar_url,
                                                                    text: reply.comment || '',
                                                                    userId: reply.patient_id,
                                                                })),
                                                        }}
                                                        isLast={
                                                            index === displayedReviews.length - 1
                                                        }
                                                        onReply={handleReplySubmission}
                                                        canEdit={false}
                                                        canDelete={false}
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
                                        )}
                                    </div>
                                )}
                                {activeTab === 'business_hours' && (
                                    <BusinessHours
                                        businessHours={mockBusinessHours}
                                        isActive={activeTab === 'business_hours'}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default MedicalFacilityProfile;
