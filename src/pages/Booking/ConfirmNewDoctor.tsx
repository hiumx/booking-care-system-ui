import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BookingLayout from '@/layouts/BookingLayout';
import { AppointmentService } from '@/services/appointment.service';
import { DoctorService } from '@/services/doctor.service';
import { AppointmentResponse } from '@/types/appointment.types';
import { DoctorResponse } from '@/types/doctor.types';
import { PATHS } from '@/routes/paths';
import styles from './Booking.module.scss';
import clsx from 'clsx';
import FullScreenSpinner from '@/components/FullScreenSpinner';
import { formatAppointmentTime } from '@/utils/appointment-utils';

/**
 * ConfirmNewDoctor Page - Option 2
 * Hospital assigns new doctor, patient confirms
 * After confirmation, redirect to ChooseNewDoctor for price comparison (skip DateTimeSection)
 */
const ConfirmNewDoctor: React.FC = () => {
    const [isConfirming, setIsConfirming] = useState(false);
    const [appointmentData, setAppointmentData] = useState<AppointmentResponse | null>(null);
    const [newDoctor, setNewDoctor] = useState<DoctorResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Price comparison state
    const [priceDifference, setPriceDifference] = useState<{
        type: 'equal' | 'higher' | 'lower' | 'none';
        amount: number;
    } | null>(null);

    const navigate = useNavigate();
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const [searchParams] = useSearchParams();

    const rescheduleToken = searchParams.get('token');
    const newDoctorId = searchParams.get('newDoctorId');

    // Use formatAppointmentTime from utils

    // Calculate price difference between original and new doctor
    const calculatePriceDifference = () => {
        if (!appointmentData || !newDoctor) return;

        const originalPrice = appointmentData.consultationFees || 0;
        const newDoctorFullPrice = newDoctor.prices?.[0]?.amount || 0;

        // Business rule: newPrice is 30% deposit of the full price
        const newPrice = newDoctorFullPrice * 0.3;

        // If original appointment has no payment (originalPrice = 0), treat as equal
        if (originalPrice === 0) {
            setPriceDifference({ type: 'none', amount: 0 });
        } else if (newPrice === originalPrice) {
            setPriceDifference({ type: 'equal', amount: 0 });
        } else if (newPrice > originalPrice) {
            setPriceDifference({ type: 'higher', amount: newPrice - originalPrice });
        } else {
            setPriceDifference({ type: 'lower', amount: originalPrice - newPrice });
        }
    };

    useEffect(() => {
        if (!appointmentId || !rescheduleToken || !newDoctorId) {
            toast.error('Thông tin không hợp lệ');
            navigate(PATHS.HOME);
            return;
        }

        loadData();
    }, [appointmentId, newDoctorId]);

    // Calculate price difference when both appointment and doctor data are loaded
    useEffect(() => {
        if (appointmentData && newDoctor) {
            calculatePriceDifference();
        }
    }, [appointmentData, newDoctor]);

    const loadData = async () => {
        try {
            setIsLoading(true);

            // Load appointment data
            const appointmentResponse = await AppointmentService.getAppointmentById(appointmentId!);
            if (!appointmentResponse.success || !appointmentResponse.data) {
                throw new Error('Không thể tải thông tin lịch hẹn');
            }
            setAppointmentData(appointmentResponse.data);

            // Load new doctor info
            const doctorResponse = await DoctorService.getDoctorById(newDoctorId!);
            if (!doctorResponse.success || !doctorResponse.data) {
                throw new Error('Không thể tải thông tin bác sĩ mới');
            }
            setNewDoctor(doctorResponse.data);
        } catch (error: any) {
            console.error('Error loading data:', error);
            toast.error(error.message || 'Không thể tải thông tin');
            navigate(PATHS.HOME);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = async () => {
        if (!appointmentId || !rescheduleToken || !newDoctorId) {
            toast.error('Thông tin không hợp lệ');
            return;
        }

        if (!appointmentData || !newDoctor) {
            toast.error('Chưa tải đủ thông tin');
            return;
        }

        setIsConfirming(true);

        try {
            // Use original appointment date/time for staff-assigned flow
            const newAppointmentDate = appointmentData.appointmentDate;
            const newAppointmentTimeId = appointmentData.appointmentTimeId;
            const doctorPriceId = newDoctor.prices?.[0]?.id || '';

            const response = await AppointmentService.chooseNewDoctor({
                appointmentId,
                rescheduleToken,
                newDoctorId,
                newAppointmentDate,
                newAppointmentTimeId,
                doctorPriceId,
                isStaffAssigned: true, // Staff-assigned flow
            });

            if (response.success && response.data) {
                const { action } = response.data;

                if (action === 'direct_update') {
                    // Same price or no payment - direct update
                    toast.success('Đã cập nhật bác sĩ thành công!');
                    navigate(PATHS.BOOKING.CONFIRMATION.replace(':appointmentId', appointmentId));
                } else if (action === 'payment_required') {
                    // Higher price - redirect to ChooseNewDoctor for payment
                    toast.info('Bác sĩ mới có cọc cao hơn. Vui lòng thanh toán thêm để xác nhận.');
                    navigate(
                        `${PATHS.BOOKING.CHOOSE_NEW_DOCTOR.replace(':doctorId', newDoctorId)}?rescheduleFor=${appointmentId}&token=${rescheduleToken}&skipDateTime=true&isStaffAssigned=true&newDoctorId=${newDoctorId}`
                    );
                } else if (action === 'refund_created') {
                    // Lower price - refund created
                    toast.success('Đã cập nhật bác sĩ và tạo yêu cầu hoàn tiền!');
                    navigate(PATHS.BOOKING.CONFIRMATION.replace(':appointmentId', appointmentId));
                }
            } else {
                throw new Error(response.message || 'Không thể cập nhật bác sĩ');
            }
        } catch (error: any) {
            console.error('Error in handleConfirm:', error);
            toast.error(error.message || 'Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setIsConfirming(false);
        }
    };

    if (isLoading) {
        return (
            <BookingLayout>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            <div
                                className="d-flex flex-column align-items-center justify-content-center"
                                style={{ minHeight: '60vh' }}
                            >
                                <FullScreenSpinner
                                    isVisible={true}
                                    message="Đang tải thông tin bác sĩ..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </BookingLayout>
        );
    }

    return (
        <BookingLayout>
            <div className={clsx(styles.bookingContainer, 'doctor-content')}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            <div className="card shadow-sm">
                                <div className="card-header bg-success text-white">
                                    <h4 className="mb-0 d-flex align-items-center">
                                        <i className="isax isax-user-tick me-2"></i>
                                        Xác nhận bác sĩ được bệnh viện gán
                                    </h4>
                                </div>
                                <div className="card-body p-4">
                                    {/* Info Alert */}
                                    <div className="alert alert-success d-flex align-items-start border-0 shadow-sm mb-4">
                                        <i className="isax isax-info-circle fs-3 me-3 mt-1 text-success"></i>
                                        <div>
                                            <h6 className="alert-heading mb-2">
                                                Thông báo từ bệnh viện
                                            </h6>
                                            <p className="mb-0">
                                                Bệnh viện đã gán cho bạn một bác sĩ mới thay thế.
                                                Vui lòng xem thông tin chi tiết và xác nhận để tiếp
                                                tục.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Original Appointment Info */}
                                    <div className="bg-light rounded-3 p-4 mb-4">
                                        <h5 className="mb-3 d-flex align-items-center text-dark">
                                            <i className="isax isax-calendar-1 me-2"></i>
                                            Thông tin lịch hẹn gốc
                                        </h5>

                                        {/* Original Doctor Info */}
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
                                                <p className="text-muted mb-1 small">
                                                    Bác sĩ ban đầu
                                                </p>
                                                <h6 className="mb-1 text-dark">
                                                    {appointmentData?.doctorInfo?.positionName}{' '}
                                                    {appointmentData?.doctorInfo?.fullName ||
                                                        'Bác sĩ'}
                                                </h6>
                                                <p className="text-muted mb-0">
                                                    <i className="isax isax-health me-1"></i>
                                                    {appointmentData?.doctorInfo?.specialtyName ||
                                                        'Chưa cập nhật'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Appointment Details */}
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <div className="d-flex align-items-start">
                                                    <i className="isax isax-calendar-2 text-primary me-2 mt-1"></i>
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
                                                    <i className="isax isax-clock text-primary me-2 mt-1"></i>
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

                                            <div className="col-md-12">
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
                                        </div>
                                    </div>

                                    {/* New Doctor Info */}
                                    {newDoctor && (
                                        <div className="bg-success bg-opacity-10 rounded-3 p-4 mb-4 border border-success">
                                            <h5 className="mb-3 d-flex align-items-center text-success">
                                                <i className="isax isax-user-tick me-2"></i>
                                                Bác sĩ được gán mới
                                            </h5>

                                            <div className="d-flex align-items-start">
                                                <div className="me-3 flex-shrink-0">
                                                    <img
                                                        src={
                                                            newDoctor.avatarUrl ||
                                                            '/src/assets/img/clients/client-16.jpg'
                                                        }
                                                        alt="new doctor"
                                                        className="rounded-circle"
                                                        style={{
                                                            width: '80px',
                                                            height: '80px',
                                                            objectFit: 'cover',
                                                            aspectRatio: '1/1',
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-grow-1">
                                                    <h5 className="mb-2 text-dark">
                                                        {newDoctor.position?.name}{' '}
                                                        {newDoctor.firstName} {newDoctor.lastName}
                                                    </h5>
                                                    <p className="text-muted mb-2">
                                                        <i className="isax isax-health me-2"></i>
                                                        {newDoctor.specialty?.name}
                                                    </p>
                                                    <p className="text-muted mb-2">
                                                        <i className="isax isax-hospital me-2"></i>
                                                        {newDoctor.hospital?.name}
                                                    </p>
                                                    <p className="mb-2">
                                                        <i className="isax isax-briefcase me-2"></i>
                                                        <strong>Kinh nghiệm:</strong>{' '}
                                                        {newDoctor.yearsOfExperience} năm
                                                    </p>

                                                    {/* Price Comparison Info */}
                                                    {priceDifference &&
                                                        priceDifference.type !== 'none' && (
                                                            <div className="mt-3 p-3 bg-light rounded-3 border">
                                                                <h6 className="mb-2 text-dark">
                                                                    <i className="isax isax-money-2 me-2"></i>
                                                                    So sánh giá khám
                                                                </h6>
                                                                <div className="row g-2">
                                                                    <div className="col-6">
                                                                        <small className="text-muted d-block">
                                                                            Bác sĩ cũ
                                                                        </small>
                                                                        <span className="fw-medium">
                                                                            {(
                                                                                appointmentData?.consultationFees ||
                                                                                0
                                                                            ).toLocaleString(
                                                                                'vi-VN'
                                                                            )}{' '}
                                                                            đ
                                                                        </span>
                                                                    </div>
                                                                    <div className="col-6">
                                                                        <small className="text-muted d-block">
                                                                            Bác sĩ mới (cọc 30%)
                                                                        </small>
                                                                        <span className="fw-medium">
                                                                            {(
                                                                                (newDoctor
                                                                                    .prices?.[0]
                                                                                    ?.amount || 0) *
                                                                                0.3
                                                                            ).toLocaleString(
                                                                                'vi-VN'
                                                                            )}{' '}
                                                                            đ
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Price difference alert */}
                                                                {priceDifference.type ===
                                                                    'higher' && (
                                                                    <div className="alert alert-warning mt-2 mb-0 py-2">
                                                                        <i className="isax isax-warning-2 me-2"></i>
                                                                        <small>
                                                                            Bác sĩ mới có cọc cao
                                                                            hơn{' '}
                                                                            {priceDifference.amount.toLocaleString(
                                                                                'vi-VN'
                                                                            )}{' '}
                                                                            đ. Bạn cần thanh toán
                                                                            thêm để xác nhận.
                                                                        </small>
                                                                    </div>
                                                                )}
                                                                {priceDifference.type ===
                                                                    'lower' && (
                                                                    <div className="alert alert-success mt-2 mb-0 py-2">
                                                                        <i className="isax isax-tick-circle me-2"></i>
                                                                        <small>
                                                                            Bác sĩ mới có cọc thấp
                                                                            hơn{' '}
                                                                            {priceDifference.amount.toLocaleString(
                                                                                'vi-VN'
                                                                            )}{' '}
                                                                            đ. Bạn sẽ được hoàn
                                                                            tiền.
                                                                        </small>
                                                                    </div>
                                                                )}
                                                                {priceDifference.type ===
                                                                    'equal' && (
                                                                    <div className="alert alert-info mt-2 mb-0 py-2">
                                                                        <i className="isax isax-info-circle me-2"></i>
                                                                        <small>
                                                                            Bác sĩ mới có cọc bằng
                                                                            với bác sĩ cũ. Không cần
                                                                            thanh toán thêm.
                                                                        </small>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    <div className="d-flex justify-content-end gap-3 mt-4">
                                        <button
                                            type="button"
                                            className="btn btn-success  d-inline-flex align-items-center"
                                            onClick={handleConfirm}
                                            disabled={isConfirming}
                                        >
                                            {isConfirming ? (
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
                                                    <i className="isax isax-tick-circle me-2"></i>
                                                    {priceDifference?.type === 'higher'
                                                        ? 'Xác nhận & Thanh toán'
                                                        : 'Xác nhận bác sĩ mới'}
                                                </>
                                            )}
                                        </button>
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

export default ConfirmNewDoctor;
