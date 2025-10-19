import { useState, useMemo, useEffect } from 'react';
import BookingSectionWrapper from '../../components/BookingSectionWrapper';
import { mockAppointmentInfo } from '../../constants/mockData';
import { useDoctorInfo } from '../../hooks';
import { useAppSelector } from '@/store/hooks';
import { selectSelectedDate, selectSelectedSlots } from '@/store/selectors/schedule.selectors';
import TimeSlotBadge from '../../components/TimeSlotBadge';
import PaymentService, { PaymentMethod } from '@/services/payment.service';
import { toast } from 'react-toastify';

interface PaymentSectionProps {
    nextStep: () => void;
    prevStep: () => void;
    isCreatingAppointment?: boolean;
    onCreateAppointmentAndPayment: (
        paymentMethodId: string,
        depositAmount: number
    ) => Promise<void>;
    isProcessingPayment?: boolean;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
    prevStep,
    isCreatingAppointment = false,
    onCreateAppointmentAndPayment,
    isProcessingPayment = false,
}) => {
    // Get doctor info from Redux (already fetched in DateTimeSection)
    const doctorInfo = useDoctorInfo();

    // Get selected date and time slots
    const selectedDate = useAppSelector(selectSelectedDate);
    const selectedSlots = useAppSelector(selectSelectedSlots);

    // Payment methods state
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<string>('');
    const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(true);

    // Fetch payment methods on component mount
    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                setIsLoadingPaymentMethods(true);
                const methods = await PaymentService.getActivePaymentMethods();
                setPaymentMethods(methods);

                // Set first payment method as default if available
                if (methods.length > 0) {
                    setSelectedPayment(methods[0].id);
                }
            } catch (error) {
                console.error('Failed to fetch payment methods:', error);
                // Fallback to empty array
                setPaymentMethods([]);
            } finally {
                setIsLoadingPaymentMethods(false);
            }
        };

        fetchPaymentMethods();
    }, []);

    // Note: Appointment will be created on-demand during payment process

    // Constants for payment calculation
    const TOTAL_AMOUNT = 242000; // Total fee in VND
    const DEPOSIT_PERCENTAGE = 0.3; // 30% deposit
    const DEPOSIT_AMOUNT = Math.round(TOTAL_AMOUNT * DEPOSIT_PERCENTAGE);

    // Handle payment method selection and delegate to parent
    const handleNextStep = async () => {
        if (isCreatingAppointment || isProcessingPayment) {
            return;
        }

        if (!selectedPayment) {
            toast.error('Vui lòng chọn phương thức thanh toán');
            return;
        }

        // Validate that the selected payment method exists
        const selectedMethod = paymentMethods.find((method) => method.id === selectedPayment);
        if (!selectedMethod) {
            toast.error('Phương thức thanh toán không hợp lệ');
            return;
        }

        // Delegate to parent component
        await onCreateAppointmentAndPayment(selectedPayment, DEPOSIT_AMOUNT);
    };

    // Render payment method content
    const renderPaymentMethodContent = () => {
        if (isLoadingPaymentMethods) {
            return (
                <div className="text-center py-4">
                    <div className="spinner-border spinner-border-sm">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 mb-0 text-muted">Đang tải phương thức thanh toán...</p>
                </div>
            );
        }

        if (paymentMethods.length === 0) {
            return (
                <div className="alert alert-warning">
                    <i className="bi bi-exclamation-triangle me-2"></i> Hiện tại không có phương
                    thức thanh toán nào khả dụng
                </div>
            );
        }

        return (
            <>
                <ul className="nav nav-pills mb-3 row" id="pills-tab">
                    {paymentMethods.map((method) => (
                        <li
                            key={method.id}
                            className={`nav-item ${paymentMethods.length === 2 ? 'col-sm-6' : 'col-sm-4'}`}
                        >
                            <button
                                className={`nav-link ${selectedPayment === method.id ? 'active' : ''}`}
                                id={`pills-${method.name.toLowerCase()}-tab`}
                                data-bs-toggle="pill"
                                data-bs-target={`#pills-${method.name.toLowerCase()}`}
                                type="button"
                                role="tab"
                                onClick={() => setSelectedPayment(method.id)}
                            >
                                <img
                                    src={method.imageUrl}
                                    className="me-2"
                                    alt={method.name}
                                    style={{ width: '24px', height: '24px' }}
                                    onError={(e) => {
                                        // Fallback image if payment method logo fails to load
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />{' '}
                                {method.name}
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="tab-content" id="pills-tabContent">
                    {paymentMethods.map((method) => {
                        const isActive = selectedPayment === method.id;

                        return (
                            <div
                                key={method.id}
                                className={`tab-pane fade ${isActive ? 'show active' : ''}`}
                                id={`pills-${method.name.toLowerCase()}`}
                                role="tabpanel"
                            >
                                <div className="payment-method-info">
                                    <div className="alert alert-info">
                                        <h6 className="mb-2">
                                            <i className="bi bi-info-circle me-2"></i>{' '}
                                            {method.description}
                                        </h6>
                                        <p className="mb-0">
                                            Bạn sẽ được chuyển đến cổng thanh toán {method.name} để
                                            hoàn tất giao dịch. {method.name} hỗ trợ thanh toán qua:
                                        </p>
                                        <ul className="mb-0 mt-2">
                                            <li>Thẻ ATM/Tài khoản ngân hàng</li>
                                            <li>
                                                Thẻ thanh toán quốc tế (Visa, Mastercard, JCB, AMEX)
                                            </li>
                                            <li>Ví điện tử VNPay</li>
                                            <li>QR Code</li>
                                        </ul>
                                    </div>
                                    <div className="mb-3">
                                        <label
                                            className="form-label"
                                            htmlFor={`${method.name.toLowerCase()}-email`}
                                        >
                                            Email nhận thông tin thanh toán
                                        </label>
                                        <div className="position-relative input-icon">
                                            <input
                                                type="email"
                                                className="form-control"
                                                id={`${method.name.toLowerCase()}-email`}
                                                placeholder="email@example.com"
                                            />
                                            <span>
                                                <i className="isax isax-sms"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mb-0">
                                        <label
                                            className="form-label"
                                            htmlFor={`${method.name.toLowerCase()}-phone`}
                                        >
                                            Số điện thoại
                                        </label>
                                        <div className="position-relative input-icon">
                                            <input
                                                type="tel"
                                                className="form-control"
                                                id={`${method.name.toLowerCase()}-phone`}
                                                placeholder="0123456789"
                                            />
                                            <span>
                                                <i className="isax isax-call"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </>
        );
    };

    // Format date and time for display
    const formattedAppointmentInfo = useMemo(() => {
        if (!selectedDate) {
            return {
                date: 'Chưa chọn',
                time: 'Chưa chọn',
                slots: [],
                totalDuration: 0,
            };
        }

        const date = new Date(selectedDate);
        const formattedDate = date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });

        let sortedSlots: typeof selectedSlots = [];
        let totalDuration = 0;

        if (selectedSlots && selectedSlots.length > 0) {
            // Sort slots by start time
            sortedSlots = [...selectedSlots].sort((a, b) => a.startTime.localeCompare(b.startTime));

            // Calculate total duration (assuming each slot is 30 minutes)
            totalDuration = sortedSlots.length * 30;
        }

        return {
            date: formattedDate,
            slots: sortedSlots,
            totalDuration,
        };
    }, [selectedDate, selectedSlots]);

    return (
        <BookingSectionWrapper
            doctor={doctorInfo}
            appointment={mockAppointmentInfo}
            nextStepTitle={(() => {
                if (isCreatingAppointment) {
                    return 'Đang xử lý...';
                }
                if (isProcessingPayment) {
                    return 'Đang xử lý...';
                }
                return 'Tạo lịch hẹn & Thanh toán';
            })()}
            nextStep={handleNextStep}
            prevStep={prevStep}
            isShowInfoHeader={false}
            disabled={isCreatingAppointment || isProcessingPayment || !selectedPayment}
        >
            <div className="row">
                <div className="col-lg-6 d-flex">
                    <div className="card flex-fill mb-3 mb-lg-0">
                        <div className="card-body">
                            <h6 className="mb-3">Cổng thanh toán</h6>
                            <div className="payment-tabs">{renderPaymentMethodContent()}</div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 d-flex">
                    <div className="card flex-fill mb-0">
                        <div className="card-body">
                            <h6 className="mb-3">Thông tin lịch khám</h6>
                            <div className="mb-3">
                                <div className="fw-medium">Ngày khám</div>
                                <div className="form-plain-text">
                                    {formattedAppointmentInfo.date}
                                </div>
                            </div>

                            {/* Time Slots Section */}
                            {formattedAppointmentInfo.slots.length > 0 ? (
                                <div className="mb-3">
                                    <div className="fw-medium mb-2">
                                        Khung giờ đã chọn ({formattedAppointmentInfo.slots.length}{' '}
                                        khung - {formattedAppointmentInfo.totalDuration} phút)
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                        {formattedAppointmentInfo.slots.map((slot) => (
                                            <TimeSlotBadge
                                                key={`${slot.startTime}-${slot.endTime}`}
                                                startTime={slot.startTime}
                                                endTime={slot.endTime}
                                                minWidth="136px"
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-3">
                                    <div className="fw-medium">Giờ khám</div>
                                    <div className="form-plain-text text-warning">
                                        <i className="bi bi-exclamation-triangle me-1"></i> Chưa
                                        chọn giờ khám
                                    </div>
                                </div>
                            )}

                            {doctorInfo?.name && (
                                <>
                                    <div className="mb-3">
                                        <div className="fw-medium">Bác sĩ</div>
                                        <div className="form-plain-text">{doctorInfo.name}</div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="fw-medium">Chuyên khoa</div>
                                        <div className="form-plain-text">
                                            {doctorInfo.specialty || 'Chưa cập nhật'}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="fw-medium">Bệnh viện</div>
                                        <div className="form-plain-text">
                                            {doctorInfo.location || 'Chưa cập nhật'}
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="pt-3 border-top booking-more-info">
                                <h6 className="mb-3">Thông tin thanh toán</h6>
                                <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-2">
                                    <p className="mb-0">Tổng phí khám bệnh</p>
                                    <span className="fw-medium d-block">
                                        {TOTAL_AMOUNT.toLocaleString('vi-VN')} đ
                                    </span>
                                </div>
                                <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-2">
                                    <p className="mb-0">Phí đặt cọc (30%)</p>
                                    <span className="fw-medium text-primary d-block">
                                        {DEPOSIT_AMOUNT.toLocaleString('vi-VN')} đ
                                    </span>
                                </div>
                                <div className="alert alert-info mt-3 mb-0">
                                    <i className="bi bi-info-circle me-2"></i>
                                    <small>
                                        Bạn chỉ cần thanh toán đặt cọc 30% (
                                        {DEPOSIT_AMOUNT.toLocaleString('vi-VN')} đ) để xác nhận lịch
                                        hẹn. Số tiền còn lại sẽ được thanh toán trực tiếp tại phòng
                                        khám.
                                    </small>
                                </div>
                            </div>
                            <div className="bg-primary d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between p-3 rounded">
                                <h6 className="text-white">Số tiền thanh toán</h6>
                                <h6 className="text-white">
                                    {DEPOSIT_AMOUNT.toLocaleString('vi-VN')} đ
                                </h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BookingSectionWrapper>
    );
};

export default PaymentSection;
