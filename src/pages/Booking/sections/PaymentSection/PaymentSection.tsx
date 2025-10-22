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
    onCreateAppointmentOnly?: () => Promise<void>; // New: Create appointment without payment
    isProcessingPayment?: boolean;
    isSupplementaryPayment?: boolean; // For reschedule with price difference
    supplementaryAmount?: number; // Amount to pay for reschedule
    rescheduleAppointmentDate?: string; // For staff-assigned doctor (skipDateTime=true)
    rescheduleAppointmentTimeId?: string; // For staff-assigned doctor (skipDateTime=true)
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
    prevStep,
    isCreatingAppointment = false,
    onCreateAppointmentAndPayment,
    onCreateAppointmentOnly,
    isProcessingPayment = false,
    isSupplementaryPayment = false,
    supplementaryAmount = 0,
    rescheduleAppointmentDate,
    rescheduleAppointmentTimeId,
}) => {
    // Get doctor info from Redux (already fetched in DateTimeSection)
    const doctorInfo = useDoctorInfo();

    // Get selected date and time slots (or use reschedule values if provided)
    const selectedDateFromRedux = useAppSelector(selectSelectedDate);
    const selectedSlotsFromRedux = useAppSelector(selectSelectedSlots);

    // Helper function to parse AppointmentTimeId (format: AT_08_00_09_00 -> { startTime: "08:00", endTime: "09:00" })
    const parseAppointmentTimeId = (timeId: string) => {
        // Format: AT_08_00_09_00
        const parts = timeId.split('_');
        if (parts.length === 5 && parts[0] === 'AT') {
            return {
                startTime: `${parts[1]}:${parts[2]}`,
                endTime: `${parts[3]}:${parts[4]}`,
            };
        }
        return null;
    };

    // Use reschedule date/time if provided (for staff-assigned flow with skipDateTime=true)
    const selectedDate = rescheduleAppointmentDate || selectedDateFromRedux;
    const selectedSlots = rescheduleAppointmentTimeId
        ? ([parseAppointmentTimeId(rescheduleAppointmentTimeId)].filter(Boolean) as Array<{
              startTime: string;
              endTime: string;
          }>)
        : selectedSlotsFromRedux;

    // Payment methods state
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<string>('');
    const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(true);

    // Payment option state (new business requirement)
    const [paymentOption, setPaymentOption] = useState<'deposit' | 'no-payment'>('deposit');

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

    const doctorState = useAppSelector((state) => state.doctor);

    // Constants for payment calculation
    // For supplementary payment: use the provided amount
    // For regular payment: calculate 30% deposit from doctor's price
    const TOTAL_AMOUNT = isSupplementaryPayment
        ? supplementaryAmount
        : doctorState.selectedDoctor?.prices?.[0]?.amount || 0;
    const DEPOSIT_PERCENTAGE = 0.3; // 30% deposit
    const DEPOSIT_AMOUNT = isSupplementaryPayment
        ? supplementaryAmount
        : Math.round(TOTAL_AMOUNT * DEPOSIT_PERCENTAGE);

    // Handle next step based on selected payment option
    const handleNextStep = async () => {
        if (isCreatingAppointment || isProcessingPayment) {
            return;
        }

        // Option 1: Deposit payment (with 10% discount incentive)
        if (paymentOption === 'deposit') {
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

            // Validate that we have a valid price
            if (!TOTAL_AMOUNT || TOTAL_AMOUNT <= 0) {
                toast.error('Không tìm thấy thông tin giá khám. Vui lòng thử lại.');
                return;
            }

            // Call parent handler with payment method and deposit amount
            await onCreateAppointmentAndPayment(selectedPayment, DEPOSIT_AMOUNT);
        }
        // Option 2: No payment (create appointment only)
        else if (paymentOption === 'no-payment') {
            if (!onCreateAppointmentOnly) {
                toast.error('Chức năng đặt lịch không thanh toán chưa được hỗ trợ');
                return;
            }

            // Call parent handler to create appointment without payment
            await onCreateAppointmentOnly();
        }
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
                if (isSupplementaryPayment) {
                    return 'Thanh toán';
                }
                // New business logic for button text
                if (paymentOption === 'deposit') {
                    return 'Đặt cọc & Thanh toán';
                } else if (paymentOption === 'no-payment') {
                    return 'Đặt lịch ngay';
                }
                return 'Tiếp tục';
            })()}
            nextStep={handleNextStep}
            prevStep={prevStep}
            isShowInfoHeader={false}
            disabled={
                isCreatingAppointment ||
                isProcessingPayment ||
                !TOTAL_AMOUNT ||
                TOTAL_AMOUNT <= 0 ||
                // Only require payment method selection if deposit option is chosen
                (paymentOption === 'deposit' && !selectedPayment)
            }
        >
            {/* Payment Options Selection */}
            {!isSupplementaryPayment && (
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title mb-4">
                                    <i className="isax isax-wallet-money me-2"></i>
                                    Chọn phương thức đặt lịch
                                </h5>

                                <div className="row">
                                    {/* Option 1: Deposit Payment with 10% Discount */}
                                    <div className="col-md-6 mb-3">
                                        <div
                                            className={`payment-option-card ${paymentOption === 'deposit' ? 'active' : ''}`}
                                            onClick={() => setPaymentOption('deposit')}
                                        >
                                            <div className="payment-option-header">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="paymentOption"
                                                        id="depositOption"
                                                        checked={paymentOption === 'deposit'}
                                                        onChange={() => setPaymentOption('deposit')}
                                                    />
                                                    <label
                                                        className="form-check-label fw-bold"
                                                        htmlFor="depositOption"
                                                    >
                                                        💳 Đặt cọc và thanh toán ngay
                                                    </label>
                                                </div>
                                                <div className="discount-badge">
                                                    <span className="badge bg-success">
                                                        Tiết kiệm 10%
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="payment-option-content">
                                                <div className="benefits-list">
                                                    <div className="benefit-item">
                                                        <i className="isax isax-tick-circle text-success me-2"></i>
                                                        <span>
                                                            Giảm ngay <strong>10%</strong> tổng chi
                                                            phí khi khám
                                                        </span>
                                                    </div>
                                                    <div className="benefit-item">
                                                        <i className="isax isax-tick-circle text-success me-2"></i>
                                                        <span>Đảm bảo giữ chỗ khám bệnh</span>
                                                    </div>
                                                </div>

                                                <div className="price-info mt-3">
                                                    <div className="current-price">
                                                        <span className="text-muted">
                                                            Cọc thanh toán:
                                                        </span>
                                                        <span className="fw-bold text-primary ms-2">
                                                            {DEPOSIT_AMOUNT.toLocaleString('vi-VN')}{' '}
                                                            đ
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Option 2: No Payment */}
                                    <div className="col-md-6 mb-3">
                                        <div
                                            className={`payment-option-card ${paymentOption === 'no-payment' ? 'active' : ''}`}
                                            onClick={() => setPaymentOption('no-payment')}
                                        >
                                            <div className="payment-option-header">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="paymentOption"
                                                        id="noPaymentOption"
                                                        checked={paymentOption === 'no-payment'}
                                                        onChange={() =>
                                                            setPaymentOption('no-payment')
                                                        }
                                                    />
                                                    <label
                                                        className="form-check-label fw-bold"
                                                        htmlFor="noPaymentOption"
                                                    >
                                                        📅 Đặt lịch không cọc
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="payment-option-content">
                                                <div className="benefits-list">
                                                    <div className="benefit-item">
                                                        <i className="isax isax-info-circle text-warning me-2"></i>
                                                        <span>Thanh toán toàn bộ khi khám</span>
                                                    </div>
                                                    <div className="benefit-item">
                                                        <i className="isax isax-info-circle text-warning me-2"></i>
                                                        <span>Không được giảm giá</span>
                                                    </div>
                                                </div>

                                                <div className="price-info mt-3">
                                                    <div className="current-price">
                                                        <span className="text-muted">
                                                            Thanh toán khi khám:
                                                        </span>
                                                        <span className="fw-bold text-dark ms-2">
                                                            {TOTAL_AMOUNT.toLocaleString('vi-VN')} đ
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="row">
                {/* Only show payment methods if deposit option is selected */}
                {(paymentOption === 'deposit' || isSupplementaryPayment) && (
                    <div className="col-lg-6 d-flex">
                        <div className="card flex-fill mb-3 mb-lg-0">
                            <div className="card-body">
                                <h6 className="mb-3">Cổng thanh toán</h6>
                                <div className="payment-tabs">{renderPaymentMethodContent()}</div>
                            </div>
                        </div>
                    </div>
                )}
                <div
                    className={`${paymentOption === 'no-payment' ? 'col-lg-12' : 'col-lg-6'} d-flex`}
                >
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
                                {TOTAL_AMOUNT > 0 ? (
                                    <>
                                        {isSupplementaryPayment ? (
                                            <>
                                                <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-2">
                                                    <p className="mb-0">
                                                        Số tiền cần thanh toán thêm
                                                    </p>
                                                    <span className="fw-medium text-warning d-block">
                                                        {DEPOSIT_AMOUNT.toLocaleString('vi-VN')} đ
                                                    </span>
                                                </div>
                                                <div className="alert alert-warning mt-3 mb-0">
                                                    <i className="bi bi-info-circle me-2"></i>
                                                    <small>
                                                        Bác sĩ mới có cọc cao hơn. Bạn cần thanh
                                                        toán thêm{' '}
                                                        {DEPOSIT_AMOUNT.toLocaleString('vi-VN')} đ
                                                        để xác nhận lịch hẹn. Số tiền còn lại sẽ
                                                        được thanh toán khi hoàn thành khám.
                                                    </small>
                                                </div>
                                            </>
                                        ) : (
                                            <>
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
                                                        {DEPOSIT_AMOUNT.toLocaleString('vi-VN')} đ)
                                                        để xác nhận lịch hẹn. Số tiền còn lại sẽ
                                                        được thanh toán trực tiếp tại phòng khám.
                                                    </small>
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="alert alert-warning">
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        Không tìm thấy thông tin giá khám. Vui lòng quay lại và chọn
                                        lại bác sĩ.
                                    </div>
                                )}
                            </div>
                            {TOTAL_AMOUNT > 0 && (
                                <div className="bg-primary d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between p-3 rounded">
                                    <h6 className="text-white">
                                        {isSupplementaryPayment
                                            ? 'Số tiền cần thanh toán thêm'
                                            : 'Số tiền thanh toán'}
                                    </h6>
                                    <h6 className="text-white">
                                        {DEPOSIT_AMOUNT.toLocaleString('vi-VN')} đ
                                    </h6>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </BookingSectionWrapper>
    );
};

export default PaymentSection;

// Add CSS styles for payment option cards
const styles = `
<style>
.payment-option-card {
    border: 2px solid #e9ecef;
    border-radius: 12px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    height: 100%;
    background: #fff;
}

.payment-option-card:hover {
    border-color: #007bff;
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
}

.payment-option-card.active {
    border-color: #007bff;
    background: linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%);
    box-shadow: 0 4px 16px rgba(0, 123, 255, 0.2);
}

.payment-option-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
}

.payment-option-header .form-check-label {
    font-size: 16px;
    color: #2c3e50;
    margin-bottom: 0;
}

.discount-badge {
    margin-left: 10px;
}

.discount-badge .badge {
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 20px;
}

.benefits-list {
    margin: 0;
}

.benefit-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-size: 14px;
    color: #495057;
}

.benefit-item:last-child {
    margin-bottom: 0;
}

.benefit-item i {
    font-size: 16px;
    flex-shrink: 0;
}

.price-info {
    border-top: 1px solid #e9ecef;
    padding-top: 12px;
}

.current-price {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.savings-info {
    text-align: center;
    font-size: 13px;
}

.payment-option-card.active .form-check-input:checked {
    background-color: #007bff;
    border-color: #007bff;
}

@media (max-width: 768px) {
    .payment-option-card {
        padding: 16px;
        margin-bottom: 16px;
    }
    
    .payment-option-header .form-check-label {
        font-size: 14px;
    }
    
    .benefit-item {
        font-size: 13px;
    }
}
</style>
`;

// Inject styles into document head
if (typeof document !== 'undefined') {
    const styleElement = document.createElement('div');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);
}
