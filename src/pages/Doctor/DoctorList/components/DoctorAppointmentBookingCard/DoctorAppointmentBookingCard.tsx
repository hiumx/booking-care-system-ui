import clsx from 'clsx';
import styles from './DoctorAppointmentBookingCard.module.scss';
import { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { buildPath, PATHS } from '@/routes/paths';

interface DoctorAppointmentBookingCardProps {
    doctorId: string; // Từ doctors.id
    patientId?: string; // Để kiểm tra yêu thích, tùy chọn nếu chưa đăng nhập
    name: string; // Nối first_name và last_name từ bảng doctors
    specialty: string; // Từ specialties.name
    position: string; // Từ positions.name
    bookCounts: number; // Số lượng lịch hẹn (COMPLETED hoặc CONFIRMED)
    rating: number; // Trung bình từ reviews.rating
    location: string; // Từ clinics.address
    yearsOfExperience: number; // Từ doctors.years_of_experience
    fees: number; // Từ prices.amount qua doctor_prices
    isFavorite: boolean; // Từ bảng favourites
    likeCounts: number; // Số lượng reviews với recommend = 1
    dislikeCounts: number; // Số lượng reviews với recommend = 0
    nextAvailableTime: string; // Từ doctor_schedule_times và appointment_times.start_time
    image: string; // Từ doctors.avatar_url
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
        bookCounts,
        rating,
        location,
        yearsOfExperience,
        fees,
        isFavorite,
        likeCounts,
        dislikeCounts,
        nextAvailableTime,
        image,
    } = props;

    const [isSelected, setIsSelected] = useState(isFavorite);

    // Xử lý bật/tắt yêu thích (có thể gọi API để cập nhật bảng favourites)
    const handleFavoriteToggle = () => {
        if (!patientId) {
            console.warn('Cần ID bệnh nhân để bật/tắt trạng thái yêu thích');
            return;
        }
        setIsSelected(!isSelected);
        // TODO: Gọi API để thêm/xóa bản ghi trong bảng favourites
        // Ví dụ: POST đến /api/favourites với { patient_id, doctor_id }
    };

    return (
        <div className="col-lg-12">
            <div className={styles.card}>
                <div className={clsx(styles.cardContainer, 'd-md-flex align-items-stretch')}>
                    <div className={styles.cardImg}>
                        <Link to={`/doctor-profile/${doctorId}`}>
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
                            <span className={clsx(styles.badge, styles.bgOrange, 'badge')}>
                                <i className="fa-solid fa-star me-1"></i>
                                {rating.toFixed(1)}
                            </span>
                            <span
                                className={clsx(styles.favIcon, {
                                    [styles.isSelected]: isSelected,
                                })}
                                onClick={handleFavoriteToggle}
                            >
                                <i className="fa fa-heart"></i>
                            </span>
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
                                                    to={`/doctor-profile/${doctorId}`}
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
                                                <i className="isax isax-user-tick text-dark me-2"></i>
                                                {bookCounts} lượt đặt
                                            </p>
                                            <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                                                <i className="isax isax-like-1 text-dark me-2"></i>
                                                {likeCounts + dislikeCounts > 0
                                                    ? `${((likeCounts / (likeCounts + dislikeCounts)) * 100).toFixed(0)}% (${likeCounts} / ${likeCounts + dislikeCounts} Đánh giá)`
                                                    : 'Chưa có đánh giá'}
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
                                            {fees ? formatVND(fees) : 'Không xác định'}
                                        </h3>
                                    </div>
                                    <p className={clsx(styles.fs15, 'mb-0')}>
                                        Lịch trống tiếp theo <br />
                                        {nextAvailableTime || 'Không có lịch'}
                                    </p>
                                </div>
                                <div className={styles.bookingButtonContainer}>
                                    <Link
                                        to={buildPath(PATHS.BOOKING.ROOT, doctorId)}
                                        className="btn btn-md btn-primary-gradient d-inline-flex align-items-center rounded-pill"
                                    >
                                        <i className="isax isax-calendar-1 me-2"></i>
                                        Đặt lịch khám
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
