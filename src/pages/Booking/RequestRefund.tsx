import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BookingLayout from '@/layouts/BookingLayout';
import { AppointmentService } from '@/services/appointment.service';
import { AppointmentResponse } from '@/types/appointment.types';
import { PATHS } from '@/routes/paths';
import styles from './Booking.module.scss';
import clsx from 'clsx';
import BookingLoadingSpinner from '@/components/BookingLoadingSpinner';
import {
    loadAppointmentData,
    validateAppointmentParams,
    formatAppointmentTime,
} from '@/utils/appointment-utils';

/**
 * RequestRefund Page - Option 4
 * Patient requests refund for cancelled appointment
 */
const RequestRefund: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [appointmentData, setAppointmentData] = useState<AppointmentResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const [searchParams] = useSearchParams();

    const rescheduleToken = searchParams.get('token');

    // Use the utility function from appointment-utils

    useEffect(() => {
        if (!validateAppointmentParams(appointmentId || null, rescheduleToken, navigate)) {
            return;
        }

        if (appointmentId) {
            loadAppointmentData(appointmentId, setAppointmentData, setIsLoading, navigate);
        }
    }, [appointmentId, rescheduleToken, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!appointmentId || !rescheduleToken) {
            toast.error('Thông tin không hợp lệ');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await AppointmentService.requestRefund({
                appointmentId,
                rescheduleToken,
            });

            if (response.success) {
                toast.success('Yêu cầu hoàn tiền đã được gửi thành công!');
                navigate(PATHS.HOME);
            } else {
                throw new Error(response.message || 'Không thể gửi yêu cầu hoàn tiền');
            }
        } catch (error: any) {
            console.error('Error requesting refund:', error);
            toast.error(error.message || 'Không thể gửi yêu cầu hoàn tiền');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <BookingLoadingSpinner />;
    }

    return (
        <BookingLayout>
            <div className={clsx(styles.bookingContainer, 'doctor-content')}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mx-auto">
                            <div className="card shadow-sm">
                                <div className="card-header bg-primary text-white">
                                    <h4 className="mb-0 d-flex align-items-center">
                                        <i className="isax isax-receipt-2 me-2"></i>
                                        Yêu cầu hoàn tiền
                                    </h4>
                                </div>
                                <div className="card-body p-4">
                                    {/* Appointment Information Card */}
                                    <div className="bg-light rounded-3 p-4 mb-4">
                                        <h5 className="mb-3 d-flex align-items-center text-dark">
                                            <i className="isax isax-calendar-1 me-2"></i>
                                            Thông tin lịch hẹn
                                        </h5>

                                        {/* Doctor Info */}
                                        <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
                                            <div className="me-3 flex-shrink-0">
                                                <img
                                                    src={
                                                        appointmentData?.doctorInfo?.avatarUrl ||
                                                        '/src/assets/img/clients/client-16.jpg'
                                                    }
                                                    alt="doctor"
                                                    className="rounded-circle"
                                                    style={{
                                                        width: '60px',
                                                        height: '60px',
                                                        objectFit: 'cover',
                                                        aspectRatio: '1/1',
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1 text-dark">
                                                    {appointmentData?.doctorInfo?.positionName}{' '}
                                                    {appointmentData?.doctorInfo?.fullName ||
                                                        'Bác sĩ'}
                                                </h6>
                                                <p className="text-muted mb-0">
                                                    <i
                                                        className="isax isax-health me-1"
                                                        aria-hidden="true"
                                                    ></i>
                                                    {appointmentData?.doctorInfo?.specialtyName ||
                                                        'Chưa cập nhật'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Appointment Details */}
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <div className="d-flex align-items-start">
                                                    <i
                                                        className="isax isax-calendar-2 text-primary me-2 mt-1"
                                                        aria-hidden="true"
                                                    ></i>
                                                    <div>
                                                        <small className="text-muted d-block">
                                                            Ngày khám
                                                        </small>
                                                        <span className="fw-medium text-dark">
                                                            {new Date(
                                                                appointmentData?.appointmentDate ||
                                                                    ''
                                                            ).toLocaleDateString('vi-VN', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="d-flex align-items-start">
                                                    <i
                                                        className="isax isax-clock text-primary me-2 mt-1"
                                                        aria-hidden="true"
                                                    ></i>
                                                    <div>
                                                        <small className="text-muted d-block">
                                                            Giờ khám
                                                        </small>
                                                        <span className="fw-medium text-dark">
                                                            {formatAppointmentTime(
                                                                appointmentData?.appointmentTimeId ||
                                                                    ''
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="d-flex align-items-start">
                                                    <i className="isax isax-hospital text-primary me-2 mt-1"></i>
                                                    <div>
                                                        <small className="text-muted d-block">
                                                            Địa điểm
                                                        </small>
                                                        <span className="fw-medium text-dark">
                                                            {appointmentData?.hospitalInfo?.name ||
                                                                'Chưa cập nhật'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="d-flex align-items-start">
                                                    <i className="isax isax-dollar-circle text-success me-2 mt-1"></i>
                                                    <div>
                                                        <small className="text-muted d-block">
                                                            Phí khám
                                                        </small>
                                                        <span className="fw-bold text-success ">
                                                            {appointmentData?.consultationFees?.toLocaleString(
                                                                'vi-VN'
                                                            ) || '0'}{' '}
                                                            VNĐ
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        {/* Info Alert */}
                                        <div className="alert alert-info d-flex align-items-start border-0 shadow-sm mb-4">
                                            <i className="isax isax-info-circle fs-3 me-3 mt-1 text-info"></i>
                                            <div>
                                                <h6 className="alert-heading mb-2">
                                                    Lưu ý quan trọng
                                                </h6>
                                                <p className="mb-0">
                                                    Yêu cầu hoàn tiền sẽ được xử lý trong vòng{' '}
                                                    <strong>3-5 ngày làm việc</strong>. Số tiền sẽ
                                                    được chuyển vào tài khoản ngân hàng mà bạn đã
                                                    đăng ký.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="d-flex justify-content-between gap-3 mt-4">
                                            <button
                                                type="button"
                                                className="btn btn-light btn-lg rounded-pill px-4 d-inline-flex align-items-center"
                                                onClick={() => navigate(PATHS.HOME)}
                                                disabled={isSubmitting}
                                            >
                                                <i className="isax isax-arrow-left-2 me-2"></i>
                                                Hủy
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-lg rounded-pill px-4 d-inline-flex align-items-center"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <output
                                                            className="spinner-border spinner-border-sm me-2"
                                                            aria-label="Đang xử lý"
                                                        >
                                                            <span className="visually-hidden">
                                                                Đang xử lý...
                                                            </span>
                                                        </output>
                                                        Đang xử lý...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i
                                                            className="isax isax-send-2 me-2"
                                                            aria-hidden="true"
                                                        ></i>
                                                        Gửi yêu cầu
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BookingLayout>
    );
};

export default RequestRefund;
