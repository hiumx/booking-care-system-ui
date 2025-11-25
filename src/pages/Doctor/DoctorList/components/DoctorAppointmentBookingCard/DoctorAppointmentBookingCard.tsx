import clsx from 'clsx';
import styles from './DoctorAppointmentBookingCard.module.scss';
import { useMemo } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { PATHS, replacePathParams } from '@/routes/paths';
import { LanguageResponse } from '@/types/language.types';
import { useFavoriteDoctor } from '@/hooks/useFavoriteDoctor';

export interface DoctorPrice {
    id: string;
    serviceTypeId: string;
    serviceTypeName: string;
    amount: number;
}

export interface DoctorAppointmentBookingCardProps {
    doctorId: string; // Từ doctors.id
    patientId?: string; // Để kiểm tra yêu thích, tùy chọn nếu chưa đăng nhập
    name: string; // Nối first_name và last_name từ bảng doctors
    specialty: string; // Từ specialties.name
    position: string; // Từ positions.name
    prices: DoctorPrice[]; // Danh sách giá theo service type
    rating: number; // Trung bình từ reviews.rating
    location: string; // Từ clinics.address
    yearsOfExperience: number; // Từ doctors.years_of_experience
    isFavorite: boolean; // Từ bảng favourites
    languages: LanguageResponse[]; // Danh sách ngôn ngữ của bác sĩ
    image: string; // Từ doctors.avatar_url
    serviceTypeFilters?: string[]; // Service types đang được filter
    isRescheduleMode?: boolean; // Indicates if in reschedule flow (Option 3)
    rescheduleParams?: {
        appointmentId: string;
        token: string;
        rescheduleSpecialtyId: string;
        rescheduleHospitalId: string;
    };
}

// Hàm định dạng số tiền theo VND
const formatVND = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
    }).format(value);
};

const DoctorAppointmentBookingCard: React.FC<DoctorAppointmentBookingCardProps> = (props) => {
    const {
        doctorId,
        patientId,
        name,
        specialty,
        position,
        prices,
        rating,
        location,
        yearsOfExperience,
        isFavorite,
        languages,
        image,
        serviceTypeFilters = [],
        isRescheduleMode = false,
        rescheduleParams,
    } = props;

    // Use the custom hook for favorite functionality
    const {
        isFavorited,
        isLoading: isFavoriteLoading,
        toggleFavorite,
    } = useFavoriteDoctor(patientId, doctorId, isFavorite);

    // Tính toán service type và giá hiển thị dựa trên filter
    const displayServiceInfo = useMemo(() => {
        // Nếu có filter service type, tìm giá tương ứng
        if (serviceTypeFilters.length > 0 && prices.length > 0) {
            // Tìm giá của service type đầu tiên trong filter
            const filteredPrice = prices.find((p) =>
                serviceTypeFilters.includes(p.serviceTypeName)
            );
            if (filteredPrice) {
                return {
                    serviceTypeName: filteredPrice.serviceTypeName,
                    amount: filteredPrice.amount,
                };
            }
        }

        // Mặc định: hiển thị giá đầu tiên
        if (prices.length > 0) {
            return {
                serviceTypeName: prices[0].serviceTypeName,
                amount: prices[0].amount,
            };
        }

        return {
            serviceTypeName: 'Chưa cập nhật',
            amount: 0,
        };
    }, [prices, serviceTypeFilters]);

    // Handle favorite toggle using the custom hook
    const handleFavoriteToggle = () => {
        toggleFavorite();
    };

    return (
        <div className="col-lg-12">
            <div className={styles.card}>
                <div className={clsx(styles.cardContainer, 'd-md-flex align-items-stretch')}>
                    <div className={styles.cardImg}>
                        <Link to={replacePathParams(PATHS.DOCTOR.PROFILE, { id: doctorId })}>
                            <img
                                src={image || 'https://bookingcaree.com/user-avatar-default.png'}
                                alt="hình ảnh bác sĩ"
                            />
                        </Link>
                        <div
                            className={clsx(
                                styles.gridOverlayItem,
                                'd-flex align-items-center justify-content-between'
                            )}
                        >
                            <div className="d-flex flex-column gap-1">
                                <span className={clsx(styles.badge, styles.bgOrange, 'badge')}>
                                    <i className="fa-solid fa-star me-1"></i>
                                    {rating > 0 ? rating.toFixed(1) : 'Chưa có đánh giá'}
                                </span>
                            </div>
                            <button
                                type="button"
                                className={clsx(styles.favIcon, {
                                    [styles.isSelected]: isFavorited,
                                })}
                                onClick={handleFavoriteToggle}
                                disabled={isFavoriteLoading}
                                aria-label={
                                    isFavorited ? 'Bỏ yêu thích bác sĩ' : 'Yêu thích bác sĩ'
                                }
                            >
                                <i className="fa fa-heart"></i>
                            </button>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                            <Link
                                to="#"
                                className={clsx(
                                    styles.doctorSpecialty,
                                    'text-black',
                                    'fw-medium',
                                    'fs-14'
                                )}
                            >
                                Chuyên khoa:{' '}
                                <span
                                    className={clsx(
                                        styles.doctorSpecialty,
                                        'text-teal',
                                        'fw-medium',
                                        'fs-14'
                                    )}
                                >
                                    {specialty || 'Không xác định'}
                                </span>
                            </Link>
                        </div>
                        <div className="p-3">
                            <div className={clsx(styles.doctorInfo, 'pb-3')}>
                                <div className="row align-items-center gy-3">
                                    <div className="col-sm-6">
                                        <div>
                                            <h6 className="d-flex align-items-center mb-1">
                                                <Link
                                                    to={replacePathParams(PATHS.DOCTOR.PROFILE, {
                                                        id: doctorId,
                                                    })}
                                                    className={styles.doctorInfoName}
                                                >
                                                    {name || 'Bác sĩ Không xác định'}
                                                </Link>
                                                <i className="isax isax-tick-circle5 text-success ms-2"></i>
                                            </h6>
                                            <p className={clsx(styles.fs15, 'mb-2')}>
                                                {position || 'Chuyên gia'}
                                            </p>
                                            <p className="d-flex align-items-center mb-0 fs-14">
                                                <i className="isax isax-location text-dark me-2"></i>
                                                {location || 'Không xác định'}
                                                <Link
                                                    to="#"
                                                    className="text-primary text-decoration-underline ms-2"
                                                >
                                                    Chỉ đường
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div>
                                            <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                                                <i className="isax isax-health text-dark me-2"></i>
                                                {displayServiceInfo.serviceTypeName}
                                            </p>
                                            <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                                                <i className="isax isax-language-square text-dark me-2"></i>
                                                {languages && languages.length > 0
                                                    ? languages.map((lang) => lang.name).join(', ')
                                                    : 'Không xác định ngôn ngữ'}
                                            </p>
                                            <p className="d-flex align-items-center mb-0 fs-14">
                                                <i className="isax isax-calendar text-dark me-2"></i>
                                                {yearsOfExperience
                                                    ? `${yearsOfExperience} năm kinh nghiệm`
                                                    : 'Không xác định'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3 mt-3">
                                <div className="d-flex align-items-center flex-wrap row-gap-3">
                                    <div className="me-3">
                                        <p className={clsx(styles.fs15, 'mb-1')}>Phí khám</p>
                                        <h3 className="text-orange">
                                            {displayServiceInfo.amount > 0
                                                ? formatVND(displayServiceInfo.amount)
                                                : 'Liên hệ để biết giá'}
                                        </h3>
                                    </div>
                                </div>
                                <div className={styles.bookingButtonContainer}>
                                    <Link
                                        to={
                                            isRescheduleMode && rescheduleParams
                                                ? `${replacePathParams(PATHS.BOOKING.CHOOSE_NEW_DOCTOR, { doctorId })}?rescheduleFor=${rescheduleParams.appointmentId}&token=${rescheduleParams.token}&rescheduleSpecialtyId=${rescheduleParams.rescheduleSpecialtyId}&rescheduleHospitalId=${rescheduleParams.rescheduleHospitalId}`
                                                : (() => {
                                                      const basePath = replacePathParams(
                                                          PATHS.BOOKING.ROOT,
                                                          { doctorId }
                                                      );
                                                      // Check if service type is online consultation
                                                      const isOnlineConsultation =
                                                          displayServiceInfo.serviceTypeName
                                                              .toLowerCase()
                                                              .includes('tư vấn trực tiếp') ||
                                                          displayServiceInfo.serviceTypeName
                                                              .toLowerCase()
                                                              .includes('tu van truc tiep') ||
                                                          displayServiceInfo.serviceTypeName
                                                              .toLowerCase()
                                                              .includes('truc tiep');
                                                      return isOnlineConsultation
                                                          ? `${basePath}?appointmentType=TELEHEALTH`
                                                          : basePath;
                                                  })()
                                        }
                                        className="btn btn-md btn-primary-gradient d-inline-flex align-items-center rounded-pill"
                                    >
                                        <i className="isax isax-calendar-1 me-2"></i>
                                        {isRescheduleMode ? 'Chọn bác sĩ này' : 'Đặt lịch khám'}
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

export default DoctorAppointmentBookingCard;
