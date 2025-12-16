import React, { useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
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
    scrollToSection,
    calculatePriceRange,
    countAppointments,
    formatAverageRating,
} from '@/utils/profileUtils';
import { useFavoriteDoctor } from '@/hooks/useFavoriteDoctor';
import { useReviewSection } from '@/hooks/useReviewSection';
import { TargetType } from '@/types/review.types';
import { renderStars } from '@/utils/renderStars';

// Import images for DoctorProfileCard
import doctorImg from '@/assets/img/doctors/doc-profile-02.jpg';
import badgeCheck from '@/assets/img/icons/badge-check.svg';
import watchIcon from '@/assets/img/icons/watch-icon.svg';
import thumbIcon from '@/assets/img/icons/gmail-icon.svg';
import genderIcon from '@/assets/img/icons/gender-icon.svg';
import calendarIcon from '@/assets/img/icons/calendar3.svg';
import bullseyeIcon from '@/assets/img/icons/bullseye.svg';

// Import images for DoctorDetails
import experienceLogo1 from '@/assets/img/icons/experience-logo-01.svg';

// Icon CSS
import '@/assets/css/feather.css';
import '@/styles/bio-content.scss';
import ScheduleAvailability from '@/components/ScheduleAvailability';
import HospitalInfo from '@/components/HospitalInfo';
import ExpandableText from '@/components/ExpandableText';
import { Gender } from '@/enums/common.enums';
import { PATHS, replacePathParams } from '@/routes/paths';

const DoctorProfile: React.FC = () => {
    const { t } = useTranslation('doctor');
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

    // Use selectedDoctor data instead of mock data
    const doctor = selectedDoctor;

    // Custom hook for favorite doctor
    const {
        isFavorited,
        isLoading: favoriteLoading,
        toggleFavorite,
    } = useFavoriteDoctor(currentUserId, id);

    // Custom hook for review section - handles reviews, pagination, and all review/reply operations
    const {
        reviews,
        reviewStatistics,
        reviewPagination,
        reviewLoading,
        handlePageChange,
        handleSubmitReview,
        handleReplySubmission,
        handleEditReview,
        handleDeleteReview,
        handleEditReply,
        handleDeleteReply,
    } = useReviewSection({
        targetType: TargetType.DOCTOR,
        targetId: id,
        targetName: doctor ? `${doctor.lastName} ${doctor.firstName}` : '',
        currentUserId,
        currentAccountId,
        hospitalId: doctor?.hospital?.id,
    });

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

    // Breadcrumb data
    const breadcrumbData = {
        items: [
            { label: '', path: '/', isActive: false },
            { label: t('profile.breadcrumb.title'), isActive: true },
        ],
        title: t('profile.breadcrumb.title'),
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
                            <p className="mt-3">{t('profile.loading')}</p>
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
                            <h4 className="fw-semibold mb-2">{t('profile.error.title')}</h4>
                            <p className="text-muted mb-4">{t('profile.error.message')}</p>
                            <Link to={PATHS.HOME} className="btn btn-outline-primary px-4">
                                {t('profile.error.backHome')}
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
                            <h4 className="fw-semibold mb-2">{t('profile.notFound.title')}</h4>
                            <p className="text-muted mb-4">{t('profile.notFound.message')}</p>
                            <Link to={PATHS.HOME} className="btn btn-outline-primary px-4">
                                {t('profile.notFound.backHome')}
                            </Link>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    // Calculate average rating from review statistics
    const averageRating = formatAverageRating(reviewStatistics?.averageRating);
    const totalReviews = reviewStatistics?.totalReviews || 0;

    // Function to get gender display text
    const getGenderDisplayText = (gender: Gender | undefined) => {
        if (gender === Gender.FEMALE) {
            return t('profile.gender.female');
        }
        if (gender === Gender.MALE) {
            return t('profile.gender.male');
        }
        return t('profile.gender.other');
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
                                            <i className="fa-solid fa-circle"></i>{' '}
                                            {t('profile.card.available')}
                                        </span>
                                        <h4 className="doc-name">
                                            {doctor.lastName} {doctor.firstName}{' '}
                                            <img src={badgeCheck} alt="Badge" />
                                            <span className="badge doctor-role-badge">
                                                <i className="fa-solid fa-circle"></i>{' '}
                                                {doctor.specialty?.name}
                                            </span>
                                        </h4>
                                        <p>
                                            {t('profile.card.degree')}: {doctor.position?.name}
                                        </p>
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
                                                <p>{t('profile.card.fullTime')}</p>
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
                                                                ? t(
                                                                      'profile.card.removeFromFavorite'
                                                                  )
                                                                : t('profile.card.addToFavorite')
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
                                                <p>
                                                    {t('profile.card.email')}: {doctor.email}
                                                </p>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="hospital-info">
                                                <span className="list-icon">
                                                    <img src={genderIcon} alt="Icon" />
                                                </span>
                                                <p>
                                                    {t('profile.card.gender')}:{' '}
                                                    {getGenderDisplayText(doctor.gender)}
                                                </p>
                                            </div>
                                            <h5 className="accept-text">
                                                <span>
                                                    <i className="feather-check"></i>
                                                </span>{' '}
                                                {t('profile.card.acceptingPatients')}
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
                                                    {totalReviews} {t('profile.card.reviews')}
                                                </Link>
                                            </div>
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
                                        {t('profile.card.appointmentsBooked', {
                                            count: appointmentCount,
                                        })}
                                    </li>
                                    <li>
                                        <span className="bg-dark-blue">
                                            <img src={bullseyeIcon} alt="Target" />
                                        </span>
                                        {t('profile.card.yearsExperience', {
                                            years: doctor.yearsOfExperience,
                                        })}
                                    </li>
                                </ul>
                                <div className="bottom-book-btn">
                                    <p>
                                        <span>
                                            {t('profile.card.price')}: {priceRange}
                                        </span>{' '}
                                        {t('profile.card.perVisit')}
                                    </p>
                                    <div className="clinic-booking">
                                        <Link
                                            className="apt-btn"
                                            to={replacePathParams(PATHS.BOOKING.ROOT, {
                                                doctorId: id || '',
                                            })}
                                        >
                                            {t('profile.card.bookAppointment')}
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
                                    {t('profile.nav.bio')}
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
                                    {t('profile.nav.experience')}
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
                                    {t('profile.nav.specialty')}
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
                                    {t('profile.nav.services')}
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
                                    {t('profile.nav.hospital')}
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
                                    {t('profile.nav.schedule')}
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
                                    {t('profile.nav.reviews')}
                                </Link>
                            </li>
                        </ul>
                        <div>
                            <div ref={bioRef}>
                                <div className="doc-information-details bio-detail" id="doc_bio">
                                    <div className="detail-title">
                                        <h4>{t('profile.sections.bio.title')}</h4>
                                    </div>
                                    <ExpandableText text={doctor?.bio} limit={300} />
                                </div>
                            </div>
                            <div ref={expRef}>
                                <div className="doc-information-details" id="experience">
                                    <div className="detail-title">
                                        <h4>{t('profile.sections.experience.title')}</h4>
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
                                                <strong>
                                                    {t('profile.sections.experience.specialty')}:
                                                </strong>{' '}
                                                {doctor.specialty?.name}
                                            </p>
                                            <p>
                                                <strong>
                                                    {t('profile.sections.experience.degree')}:
                                                </strong>{' '}
                                                {doctor.position?.name}
                                            </p>
                                            <p>
                                                <strong>
                                                    {t('profile.sections.experience.years')}:
                                                </strong>{' '}
                                                {t('profile.sections.experience.yearsValue', {
                                                    years: doctor.yearsOfExperience,
                                                })}
                                            </p>
                                            <div>
                                                <strong>
                                                    {t('profile.sections.experience.description')}:
                                                </strong>{' '}
                                                {doctor.bio ? (
                                                    <span
                                                        className="bio-content"
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                doctor.bio.substring(0, 100) +
                                                                '...',
                                                        }}
                                                    />
                                                ) : (
                                                    t('profile.sections.experience.noDescription')
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div ref={specialityRef}>
                                <div className="doc-information-details" id="speciality">
                                    <div className="detail-title">
                                        <h4>{t('profile.sections.specialty.title')}</h4>
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
                                        <h4>{t('profile.sections.services.title')}</h4>
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
                                                <span className="text-muted">
                                                    {t('profile.sections.services.noServices')}
                                                </span>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                            <div ref={clinicRef}>
                                <div className="doc-information-details" id="clinic">
                                    <div className="detail-title">
                                        <h4>{t('profile.sections.hospital.title')}</h4>
                                    </div>
                                    <HospitalInfo
                                        hospital={{
                                            id: Number(doctor.hospital?.id) || 1,
                                            name:
                                                doctor.hospital?.name ||
                                                t('profile.sections.hospital.defaultName'),
                                            address:
                                                doctor.hospital?.address ||
                                                doctor.address ||
                                                t('profile.sections.hospital.defaultAddress'),
                                            background_url: doctor.hospital?.avatarUrl || doctorImg,
                                        }}
                                        availabilitySlots={[
                                            {
                                                day: t('profile.availability.monday'),
                                                time: '07:00 AM - 17:00 PM',
                                            },
                                            {
                                                day: t('profile.availability.saturday'),
                                                time: '07:00 AM - 17:00 PM',
                                            },
                                        ]}
                                    />
                                </div>
                            </div>
                            <div ref={hoursRef}>
                                <div className="doc-information-details" id="bussiness_hour">
                                    <div className="detail-title">
                                        <h4>{t('profile.sections.schedule.title')}</h4>
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
                                    onPageChange={handlePageChange}
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
