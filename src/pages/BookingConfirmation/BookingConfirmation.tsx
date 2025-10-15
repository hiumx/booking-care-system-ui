import { Link, useParams, useNavigate } from 'react-router-dom';
import { useMemo, useEffect, useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import { PATHS } from '@/routes/paths';
import TimeSlotBadge from '../Booking/components/TimeSlotBadge';
import styles from './BookingConfirmation.module.scss';
import clsx from 'clsx';
import NotificationToast from '@/components/NotificationToast';
import { AppointmentService } from '@/services/appointment.service';
import { AppointmentResponse } from '@/types/appointment.types';
import { toast } from 'react-toastify';
import Spinner from '@/components/Spinner';

const BookingConfirmation: React.FC = () => {
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const navigate = useNavigate();

    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [appointment, setAppointment] = useState<AppointmentResponse | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch appointment data
    useEffect(() => {
        const fetchAppointment = async () => {
            if (!appointmentId) {
                toast.error('Không tìm thấy mã cuộc hẹn');
                navigate(PATHS.HOME);
                return;
            }

            try {
                setLoading(true);
                const response = await AppointmentService.getAppointmentById(appointmentId);

                if (response.success && response.data) {
                    setAppointment(response.data);
                    setShowSuccessToast(true);
                } else {
                    throw new Error(response.message || 'Không thể tải thông tin cuộc hẹn');
                }
            } catch (error: any) {
                console.error('Error fetching appointment:', error);
                toast.error(error.message || 'Không thể tải thông tin cuộc hẹn');
                navigate(PATHS.HOME);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointment();
    }, [appointmentId, navigate]);

    // Format appointment info from API data
    const formattedAppointmentInfo = useMemo(() => {
        if (!appointment) {
            return {
                date: 'Đang tải...',
                dateTime: 'Đang tải...',
                timeSlot: null,
                doctor: null,
                hospital: null,
            };
        }

        // Format appointment date
        const date = new Date(appointment.appointmentDate);
        const formattedDate = date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });

        // Parse time from appointmentTimeId (format: AT_11_00_11_30)
        let timeSlot = null;
        if (appointment.appointmentTimeId) {
            const timeMatch = appointment.appointmentTimeId.match(/AT_(\d+)_(\d+)_(\d+)_(\d+)/);
            if (timeMatch) {
                const [, startHour, startMin, endHour, endMin] = timeMatch;
                const startTime = `${startHour.padStart(2, '0')}:${startMin.padStart(2, '0')}`;
                const endTime = `${endHour.padStart(2, '0')}:${endMin.padStart(2, '0')}`;
                timeSlot = { startTime, endTime };
            }
        }

        return {
            date: formattedDate,
            dateTime: timeSlot
                ? `${timeSlot.startTime} - ${timeSlot.endTime}, ${formattedDate}`
                : formattedDate,
            timeSlot,
            doctor: appointment.doctorInfo,
            hospital: appointment.hospitalInfo,
        };
    }, [appointment]);

    // Breadcrumb configuration
    const breadcrumbItems = [
        { label: 'Trang chủ', path: PATHS.HOME },
        { label: 'Đặt lịch khám', path: PATHS.DOCTOR.ROOT },
        { label: 'Xác nhận đặt lịch', isActive: true },
    ];

    // Show loading spinner while fetching data
    if (loading) {
        return (
            <MainLayout>
                <Breadcrumb items={breadcrumbItems} title="Xác nhận đặt lịch" />
                <div
                    className="container d-flex justify-content-center align-items-center"
                    style={{ minHeight: '400px' }}
                >
                    <Spinner />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbItems} title="Xác nhận đặt lịch" />

            <div className={clsx(styles.container, 'container')}>
                <div className="row">
                    <div className="col-12">
                        <fieldset className="d-block">
                            <div className="card booking-card">
                                <div className="card-body booking-body pb-1">
                                    <div className="row">
                                        <div className="col-lg-8 d-flex">
                                            <div className="flex-fill">
                                                <div className="card ">
                                                    <div className="card-header pt-3">
                                                        <h5 className="d-flex align-items-center flex-wrap rpw-gap-2">
                                                            <i className="isax isax-tick-circle5 text-success me-2"></i>{' '}
                                                            Đặt lịch thành công
                                                        </h5>
                                                    </div>
                                                    <div className="card-header d-flex align-items-center flex-wrap rpw-gap-2">
                                                        <span className="avatar avatar-lg avatar-rounded me-2 flex-shrink-0">
                                                            <img
                                                                src={
                                                                    formattedAppointmentInfo.doctor
                                                                        ?.avatarUrl ||
                                                                    '/src/assets/img/clients/client-16.jpg'
                                                                }
                                                                alt="doctor-avatar"
                                                            />
                                                        </span>
                                                        <p className="mb-0">
                                                            Lịch khám của bạn đã được xác nhận với{' '}
                                                            <span className="text-dark">
                                                                {
                                                                    formattedAppointmentInfo.doctor
                                                                        ?.positionName
                                                                }{' '}
                                                                {formattedAppointmentInfo.doctor
                                                                    ?.fullName || 'Bác sĩ'}{' '}
                                                            </span>
                                                            . Vui lòng đến trước{' '}
                                                            <span className="text-dark">
                                                                15 phút{' '}
                                                            </span>{' '}
                                                            so với giờ hẹn.
                                                        </p>
                                                    </div>
                                                    <div className="card-body pb-1">
                                                        <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-3">
                                                            <h6>Thông tin lịch khám</h6>
                                                            <Link
                                                                to={PATHS.DOCTOR.ROOT}
                                                                className="btn btn-light rounded-pill"
                                                            >
                                                                <i className="isax isax-calendar me-1"></i>{' '}
                                                                Đặt lại lịch
                                                            </Link>
                                                        </div>
                                                        <div className="row">
                                                            {/* Doctor Information */}
                                                            {formattedAppointmentInfo.doctor && (
                                                                <>
                                                                    <div className="col-md-6">
                                                                        <div className="mb-3">
                                                                            <div className="form-label">
                                                                                Bác sĩ
                                                                            </div>
                                                                            <div className="form-plain-text">
                                                                                {
                                                                                    formattedAppointmentInfo
                                                                                        .doctor
                                                                                        .positionName
                                                                                }{' '}
                                                                                {
                                                                                    formattedAppointmentInfo
                                                                                        .doctor
                                                                                        .fullName
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <div className="mb-3">
                                                                            <div className="form-label">
                                                                                Chuyên khoa
                                                                            </div>
                                                                            <div className="form-plain-text">
                                                                                {formattedAppointmentInfo
                                                                                    .doctor
                                                                                    .specialtyName ||
                                                                                    'Chưa cập nhật'}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}

                                                            {/* Date */}
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <div className="form-label">
                                                                        Ngày khám
                                                                    </div>
                                                                    <div className="form-plain-text">
                                                                        {
                                                                            formattedAppointmentInfo.date
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Time Slot */}
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <div className="form-label">
                                                                        Thời gian khám
                                                                    </div>
                                                                    <div className="form-plain-text">
                                                                        {formattedAppointmentInfo.timeSlot
                                                                            ? `${formattedAppointmentInfo.timeSlot.startTime} - ${formattedAppointmentInfo.timeSlot.endTime}`
                                                                            : 'Chưa có thông tin'}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Time Slot Badge */}
                                                            {formattedAppointmentInfo.timeSlot && (
                                                                <div className="col-md-12">
                                                                    <div className="mb-3">
                                                                        <div className="form-label mb-2">
                                                                            Khung giờ đã đặt
                                                                        </div>
                                                                        <div className="d-flex flex-wrap gap-2">
                                                                            <TimeSlotBadge
                                                                                startTime={
                                                                                    formattedAppointmentInfo
                                                                                        .timeSlot
                                                                                        .startTime
                                                                                }
                                                                                endTime={
                                                                                    formattedAppointmentInfo
                                                                                        .timeSlot
                                                                                        .endTime
                                                                                }
                                                                                type="success"
                                                                                minWidth="136px"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Appointment Type */}
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <div className="form-label">
                                                                        Hình thức khám
                                                                    </div>
                                                                    <div className="form-plain-text">
                                                                        {appointment?.appointmentType ===
                                                                        'IN_PERSON'
                                                                            ? 'Tại phòng khám'
                                                                            : 'Trực tuyến'}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Hospital Information */}
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <div className="form-label">
                                                                        Địa điểm khám
                                                                    </div>
                                                                    <div className="form-plain-text">
                                                                        {formattedAppointmentInfo
                                                                            .hospital?.name ||
                                                                            'Chưa cập nhật'}
                                                                        <br />
                                                                        <small className="text-muted">
                                                                            {
                                                                                formattedAppointmentInfo
                                                                                    .hospital
                                                                                    ?.address
                                                                            }
                                                                        </small>
                                                                        {formattedAppointmentInfo
                                                                            .hospital?.address && (
                                                                            <div>
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-link p-0 text-primary"
                                                                                    onClick={() => {
                                                                                        /* Show map */
                                                                                    }}
                                                                                >
                                                                                    Xem vị trí
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card">
                                                    <div className="card-body d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between">
                                                        <div>
                                                            <h6 className="mb-1">Cần hỗ trợ?</h6>
                                                            <p className="mb-0">
                                                                Gọi cho chúng tôi nếu bạn gặp vấn đề
                                                                khi đặt lịch hoặc hủy lịch.
                                                            </p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="btn btn-light rounded-pill"
                                                            onClick={() => {
                                                                if (
                                                                    formattedAppointmentInfo
                                                                        .hospital?.phone
                                                                ) {
                                                                    window.open(
                                                                        `tel:${formattedAppointmentInfo.hospital.phone}`
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            <i className="isax isax-call5 me-1"></i>{' '}
                                                            Gọi cho chúng tôi
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 d-flex">
                                            <div className="card flex-fill">
                                                <div className="card-body d-flex flex-column justify-content-between">
                                                    <div className="text-center">
                                                        <h6 className="fs-14 mb-2">Mã đặt lịch</h6>
                                                        <span className="booking-id-badge mb-3">
                                                            {appointmentId
                                                                ?.substring(0, 8)
                                                                .toUpperCase() || 'LOADING'}
                                                        </span>
                                                        <span className="d-block mb-3">
                                                            <img
                                                                src="/src/assets/img/icons/payment-qr.svg"
                                                                alt="QR Code"
                                                            />
                                                        </span>
                                                        <p>
                                                            Quét mã QR này để tải thông tin chi tiết
                                                            về lịch hẹn
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <button
                                                            type="button"
                                                            className="btn w-100 mb-3 btn-md btn-dark prev_btns inline-flex align-items-center rounded-pill"
                                                            onClick={() => {
                                                                /* Add to calendar */
                                                            }}
                                                        >
                                                            Thêm vào lịch
                                                        </button>
                                                        <Link
                                                            to={PATHS.DOCTOR.ROOT}
                                                            className="btn w-100 btn-md btn-primary-gradient next_btns inline-flex align-items-center rounded-pill"
                                                        >
                                                            Đặt lịch mới
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </div>

            {/* Success Toast */}
            <NotificationToast
                isOpen={showSuccessToast}
                onClose={() => setShowSuccessToast(false)}
                message={'Thanh toán thành công! Lịch hẹn đã được xác nhận.'}
                type="success"
                icon="fa-solid fa-check-circle"
                duration={3000}
            />
        </MainLayout>
    );
};

export default BookingConfirmation;
