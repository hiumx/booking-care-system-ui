import React, { useRef, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import clsx from 'clsx';
import styles from './ServiceDetailPage.module.scss';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import ScheduleAvailability from '@/components/ScheduleAvailability';
import ReviewSection from '@/components/ReviewSection';
import ExpandableText from '@/components/ExpandableText';
import { mockAppointments, scrollToSection, countAppointments } from '@/utils/profileUtils';
import { useServiceReviews } from '@/hooks/useServiceReviews';
import { useReviewHandlers } from '@/hooks/useReviewHandlers';
import { TargetType } from '@/types/review.types';
import { renderStars } from '@/utils/renderStars';

// Import images for DoctorProfileCard
import badgeCheck from '@/assets/img/icons/badge-check.svg';
import watchIcon from '@/assets/img/icons/watch-icon.svg';
import thumbIcon from '@/assets/img/icons/count-02.svg';
import buildingIcon from '@/assets/img/icons/building-icon.svg';
import deviceMessageIcon from '@/assets/img/icons/device-message2.svg';
import calendarIcon from '@/assets/img/icons/calendar3.svg';

// Icon CSS
import '@/assets/css/feather.css';
import { buildPath, PATHS, replacePathParams } from '@/routes/paths';
import { HospitalCarousel } from '@/components/SimpleCarousel';
import { getServicesWithHospitalAsync } from '@/store/slices/medicalServiceSlice';

const ServiceDetailPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const bioRef = useRef<HTMLDivElement>(null);
    const clinicRef = useRef<HTMLDivElement>(null);
    const hoursRef = useRef<HTMLDivElement>(null);
    const reviewRef = useRef<HTMLDivElement>(null);

    const [reviewPage, setReviewPage] = useState(1);
    const { servicesparentId, serviceschildId, servicesId } = useParams<{
        servicesparentId: string;
        serviceschildId: string;
        servicesId: string;
    }>();

    // Redux selectors
    const servicesData = useAppSelector(
        (state) => state.medicalService.serviceCategories.servicesWithHospital
    );

    const isLoading = useAppSelector((state) => state.medicalService.serviceCategories.isLoading);
    const error = useAppSelector((state) => state.medicalService.serviceCategories.error);

    // Get current user info - MUST be before early returns!
    const currentUserProfile = useAppSelector((state: any) => state.user?.profile);
    const currentUserId = currentUserProfile?.id; // For create review (patientId) & UI comparison
    const currentAccountId = currentUserProfile?.accountId; // For create reply (authorId)

    // Find selected service from Redux data (needed for targetName)
    const selectedService =
        servicesData?.services.find((service) => service.id === servicesId) || null;

    // Custom hook for service reviews with server-side pagination - No Redux needed!
    const {
        reviews,
        statistics: reviewStatistics,
        pagination: reviewPagination,
        isLoading: reviewLoading,
        fetchReviews,
        refetchStatistics,
    } = useServiceReviews(servicesId, reviewPage, 10);

    // Review handlers using custom hook - MUST be before early returns
    const {
        handleSubmitReview,
        handleReplySubmission,
        handleEditReview,
        handleDeleteReview,
        handleEditReply,
        handleDeleteReply,
    } = useReviewHandlers({
        targetType: TargetType.SERVICE,
        targetId: servicesId,
        currentUserId,
        currentAccountId,
        targetName: selectedService?.name || 'Dịch vụ',
        hospitalId: selectedService?.hospitalId,
        refetchReviews: () => fetchReviews(reviewPage),
        refetchStatistics,
    });

    // Fetch data if not available in Redux
    useEffect(() => {
        if (serviceschildId && !servicesData && !isLoading && !error) {
            dispatch(
                getServicesWithHospitalAsync({
                    categoryId: serviceschildId,
                    params: {
                        page: 1,
                        pageSize: 10,
                        includeInactive: false,
                    },
                })
            );
        }
    }, [dispatch, serviceschildId, servicesData, isLoading, error]);

    // Use selected service data or show loading/error state
    const currentService = selectedService;

    // Show loading state
    if (isLoading) {
        return (
            <MainLayout>
                <Breadcrumb items={[]} title="Đang tải..." />
                <div className="content">
                    <div className="container">
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{ minHeight: '400px' }}
                        >
                            <div className="spinner-border text-primary">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    // Show error state
    if (error) {
        return (
            <MainLayout>
                <Breadcrumb items={[]} title="Lỗi" />
                <div className="content">
                    <div className="container">
                        <div className="alert alert-danger" role="alert">
                            <h4 className="alert-heading">Lỗi!</h4>
                            <p>{error}</p>
                            <hr />
                            <button
                                className="btn btn-outline-danger"
                                onClick={() => globalThis.location.reload()}
                            >
                                Thử lại
                            </button>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    // Show no service found state
    if (!currentService) {
        return (
            <MainLayout>
                <Breadcrumb items={[]} title="Không tìm thấy dịch vụ" />
                <div className="content">
                    <div className="container">
                        <div className="alert alert-info" role="alert">
                            <h4 className="alert-heading">Không tìm thấy dịch vụ!</h4>
                            <p>Dịch vụ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                            <hr />
                            <button
                                className="btn btn-outline-primary"
                                onClick={() => globalThis.history.back()}
                            >
                                Quay lại
                            </button>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    // Calculate average rating from review statistics
    const averageRating = reviewStatistics?.averageRating
        ? reviewStatistics.averageRating.toFixed(1)
        : '0.0';
    const totalReviews = reviewStatistics?.totalReviews || 0;

    // Count completed appointments (using service ID)
    const appointmentCount = countAppointments(mockAppointments, Number(currentService.id) || 1);

    // Get price from current service
    const servicePrice = currentService.price;
    const priceRange = servicePrice > 0 ? `${servicePrice.toLocaleString('vi-VN')} VNĐ` : 'Liên hệ';

    const breadcrumbData = {
        items: [
            { label: 'Trang chủ', path: '/', isActive: false },
            {
                label: 'Dịch Vụ Y Tế',
                path: replacePathParams(buildPath(PATHS.Service.ROOT), {}),
                isActive: false,
            },
            {
                label: servicesData?.parentCategoryName || 'Chuyên Khoa',
                path: replacePathParams(buildPath(PATHS.Service.CATEGORIES), {
                    servicesparentId: servicesparentId!.toString(),
                }),
                isActive: false,
            },
            {
                label: servicesData?.serviceCategoryName || 'Chuyên Khoa',
                path: replacePathParams(PATHS.Service.SERVICES, {
                    servicesparentId: servicesparentId!.toString(),
                    serviceschildId: serviceschildId!.toString(),
                }),
                isActive: false,
            },
            { label: currentService.name, isActive: true },
        ],
        title: currentService.name,
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
                                            src={currentService.imageUrl}
                                            className="img-fluid"
                                            alt="Service"
                                        />
                                    </div>
                                    <div className="doc-info-cont">
                                        <span className="badge doc-avail-badge">
                                            <i className="fa-solid fa-circle"></i> Sẵn sàng phục vụ
                                        </span>
                                        <h4 className="doc-name">
                                            {currentService.name}{' '}
                                            <img src={badgeCheck} alt="Badge" />
                                        </h4>
                                        <p>
                                            Loại Dịch vụ:{' '}
                                            {servicesData?.serviceCategoryName || 'Dịch vụ y tế'}
                                        </p>
                                        <p className="address-detail">
                                            <span className="loc-icon">
                                                <i className="feather-map-pin"></i>
                                            </span>
                                            {currentService.hospital.address}{' '}
                                        </p>
                                    </div>
                                </div>
                                <div className="doc-info-right">
                                    <ul className="doctors-activities">
                                        <li>
                                            <div className="hospital-info">
                                                <span className="list-icon">
                                                    <img
                                                        src={thumbIcon}
                                                        alt="Icon"
                                                        style={{ width: '18px' }}
                                                    />
                                                </span>
                                                <p>Toàn thời gian, Liệu pháp trực tuyến sẵn có</p>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="hospital-info">
                                                <span className="list-icon">
                                                    <img src={watchIcon} alt="Icon" />
                                                </span>
                                                <p>
                                                    Duration: {currentService.durationTime} minutes
                                                </p>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="hospital-info">
                                                <span className="list-icon">
                                                    <img src={buildingIcon} alt="Icon" />
                                                </span>
                                                <p>{currentService.hospital.name}</p>
                                            </div>
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
                                                doctorId: servicesId!.toString() || '',
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
                                    <ExpandableText text={currentService.description} limit={300} />
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
                                    {servicesData && servicesData.services.length > 0 ? (
                                        <HospitalCarousel
                                            hospitals={servicesData.services.map((service) => ({
                                                id: Number(service.hospital.id) || 1,
                                                name: service.hospital.name,
                                                address: service.hospital.address,
                                                background_url: service.hospital.avatarUrl,
                                            }))}
                                        />
                                    ) : (
                                        <div className="alert alert-info">
                                            <p>Không có bệnh viện nào cung cấp dịch vụ này.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* ----------------------- */}
                            {/* Write Review  */}
                            <div ref={reviewRef}>
                                <ReviewSection
                                    reviews={reviews}
                                    doctorName={currentService.name}
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

export default ServiceDetailPage;
