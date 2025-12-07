import { useState, useEffect, useMemo } from 'react';
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
 * Supports: Doctor, Service, and Hospital appointments
 */
const RequestRefund: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [appointmentData, setAppointmentData] = useState<AppointmentResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const [searchParams] = useSearchParams();

    const rescheduleToken = searchParams.get('token');

    // Determine appointment type and get display info
    const displayInfo = useMemo(() => {
        if (!appointmentData) return null;

        const hasDoctor = !!appointmentData.doctorInfo?.id;
        const hasService = !!appointmentData.serviceInfo?.id;

        if (hasDoctor) {
            return {
                type: 'doctor' as const,
                label: appointmentData.doctorInfo?.positionName || 'Bác sĩ',
                name: appointmentData.doctorInfo?.fullName || 'Bác sĩ',
                avatar: appointmentData.doctorInfo?.avatarUrl,
                specialty: appointmentData.doctorInfo?.specialtyName,
                fee: appointmentData.consultationFees,
            };
        }

        if (hasService) {
            return {
                type: 'service' as const,
                label: 'Dịch vụ',
                name: appointmentData.serviceInfo?.name || 'Dịch vụ',
                avatar: appointmentData.serviceInfo?.imageUrl,
                specialty: null,
                fee: appointmentData.consultationFees || appointmentData.serviceInfo?.price,
            };
        }

        return {
            type: 'hospital' as const,
            label: 'Bệnh viện',
            name: appointmentData.hospitalInfo?.name || 'Bệnh viện',
            avatar: appointmentData.hospitalInfo?.avatarUrl,
            specialty: null,
            fee: appointmentData.consultationFees,
        };
    }, [appointmentData]);

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
                            <div className="card booking-card">
                                <div className="card-body booking-body pb-1">
                                    {/* Header */}
                                    <div className="card-header pt-3">
                                        <h5 className="d-flex align-items-center flex-wrap gap-2">
                                            <i className="isax isax-receipt-2 text-primary me-2"></i>
                                            Yêu cầu hoàn tiền
                                        </h5>
                                    </div>

                                    {/* Provider Info - Doctor/Service/Hospital */}
                                    <div className="card-header d-flex align-items-center flex-wrap gap-2 py-3">
                                        <span className="avatar avatar-lg avatar-rounded me-2 flex-shrink-0">
                                            <img
                                                src={
                                                    displayInfo?.avatar ||
                                                    '/src/assets/img/clients/client-16.jpg'
                                                }
                                                alt={displayInfo?.name}
                                            />
                                        </span>
                                        <p className="mb-0">
                                            Bạn đang yêu cầu hoàn tiền cho lịch hẹn với{' '}
                                            <span className="text-dark fw-semibold">
                                                {displayInfo?.type === 'doctor' &&
                                                    `${displayInfo.label} `}
                                                {displayInfo?.name}
                                            </span>
                                        </p>
                                    </div>

                                    {/* Appointment Details */}
                                    <div className="card-body pb-3">
                                        <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-3">
                                            <h6>Thông tin lịch hẹn</h6>
                                        </div>

                                        <div className="row">
                                            {/* Provider Name - Doctor/Service/Hospital */}
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <div className="form-label">
                                                        {displayInfo?.label}
                                                    </div>
                                                    <div className="form-plain-text">
                                                        {displayInfo?.type === 'doctor' &&
                                                            `${displayInfo.label} `}
                                                        {displayInfo?.name}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Specialty - Only for Doctor */}
                                            {displayInfo?.type === 'doctor' &&
                                                displayInfo.specialty && (
                                                    <div className="col-md-6">
                                                        <div className="mb-3">
                                                            <div className="form-label">
                                                                Chuyên khoa
                                                            </div>
                                                            <div className="form-plain-text">
                                                                {displayInfo.specialty}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                            {/* Date */}
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <div className="form-label">Ngày hẹn</div>
                                                    <div className="form-plain-text">
                                                        {new Date(
                                                            appointmentData?.appointmentDate || ''
                                                        ).toLocaleDateString('vi-VN', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Time */}
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <div className="form-label">Giờ hẹn</div>
                                                    <div className="form-plain-text">
                                                        {formatAppointmentTime(
                                                            appointmentData?.appointmentTimeId || ''
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Hospital - Show for Doctor and Service appointments */}
                                            {displayInfo?.type !== 'hospital' &&
                                                appointmentData?.hospitalInfo?.name && (
                                                    <div className="col-md-6">
                                                        <div className="mb-3">
                                                            <div className="form-label">
                                                                Địa điểm
                                                            </div>
                                                            <div className="form-plain-text">
                                                                {appointmentData.hospitalInfo.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                            {/* Address - Show for Hospital appointments */}
                                            {displayInfo?.type === 'hospital' &&
                                                appointmentData?.hospitalInfo?.address && (
                                                    <div className="col-md-6">
                                                        <div className="mb-3">
                                                            <div className="form-label">
                                                                Địa chỉ
                                                            </div>
                                                            <div className="form-plain-text">
                                                                {
                                                                    appointmentData.hospitalInfo
                                                                        .address
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                            {/* Fee */}
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <div className="form-label">
                                                        {displayInfo?.type === 'service'
                                                            ? 'Phí dịch vụ'
                                                            : 'Phí khám'}
                                                    </div>
                                                    <div className="form-plain-text text-success fw-semibold">
                                                        {(displayInfo?.fee || 0).toLocaleString(
                                                            'vi-VN'
                                                        )}{' '}
                                                        VNĐ
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Info Note */}
                                        <div className="alert alert-light border mb-4">
                                            <div className="d-flex">
                                                <i className="isax isax-info-circle text-primary me-2 mt-1"></i>
                                                <div>
                                                    <strong>Lưu ý:</strong> Yêu cầu hoàn tiền sẽ
                                                    được xử lý trong vòng 3-5 ngày làm việc. Số tiền
                                                    sẽ được chuyển vào tài khoản ngân hàng mà bạn đã
                                                    đăng ký.
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <form onSubmit={handleSubmit}>
                                            <div className="d-flex justify-content-end gap-3">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary rounded-pill px-4"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <span
                                                                className="spinner-border spinner-border-sm me-2"
                                                                role="status"
                                                                aria-hidden="true"
                                                            ></span>
                                                            Đang xử lý...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="isax isax-tick-circle me-2"></i>
                                                            Xác nhận hoàn tiền
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
            </div>
        </BookingLayout>
    );
};

export default RequestRefund;
