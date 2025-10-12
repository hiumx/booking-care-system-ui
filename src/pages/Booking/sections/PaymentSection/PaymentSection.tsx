import { useState, useMemo } from 'react';
import BookingSectionWrapper from '../../components/BookingSectionWrapper';
import { mockAppointmentInfo } from '../../constants/mockData';
import { useDoctorInfo } from '../../hooks';
import { useAppSelector } from '@/store/hooks';
import { selectSelectedDate, selectSelectedSlots } from '@/store/selectors/schedule.selectors';
import TimeSlotBadge from '../../components/TimeSlotBadge';

interface PaymentSectionProps {
    nextStep: () => void;
    prevStep: () => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ nextStep, prevStep }) => {
    // Get doctor info from Redux (already fetched in DateTimeSection)
    const doctorInfo = useDoctorInfo();

    // Get selected date and time slots
    const selectedDate = useAppSelector(selectSelectedDate);
    const selectedSlots = useAppSelector(selectSelectedSlots);

    // Selected payment method
    const [selectedPayment, setSelectedPayment] = useState<'payos' | 'vnpay'>('payos');

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
            nextStepTitle="Xác nhận & Thanh toán"
            nextStep={nextStep}
            prevStep={prevStep}
            isShowInfoHeader={false}
        >
            <div className="row">
                <div className="col-lg-6 d-flex">
                    <div className="card flex-fill mb-3 mb-lg-0">
                        <div className="card-body">
                            <h6 className="mb-3">Cổng thanh toán</h6>
                            <div className="payment-tabs">
                                <ul className="nav nav-pills mb-3 row" id="pills-tab">
                                    <li className="nav-item col-sm-6">
                                        <button
                                            className={`nav-link ${selectedPayment === 'payos' ? 'active' : ''}`}
                                            id="pills-payos-tab"
                                            data-bs-toggle="pill"
                                            data-bs-target="#pills-payos"
                                            type="button"
                                            role="tab"
                                            onClick={() => setSelectedPayment('payos')}
                                        >
                                            <img
                                                src="https://payos.vn/docs/img/logo.svg"
                                                className="me-2"
                                                alt="PayOS"
                                                style={{ width: '24px', height: '24px' }}
                                            />{' '}
                                            PayOS
                                        </button>
                                    </li>
                                    <li className="nav-item col-sm-6">
                                        <button
                                            className={`nav-link ${selectedPayment === 'vnpay' ? 'active' : ''}`}
                                            id="pills-vnpay-tab"
                                            data-bs-toggle="pill"
                                            data-bs-target="#pills-vnpay"
                                            type="button"
                                            role="tab"
                                            onClick={() => setSelectedPayment('vnpay')}
                                        >
                                            <img
                                                src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png"
                                                className="me-2"
                                                alt="VNPay"
                                                style={{ width: '24px', height: '24px' }}
                                            />{' '}
                                            VNPay
                                        </button>
                                    </li>
                                </ul>
                                <div className="tab-content" id="pills-tabContent">
                                    <div
                                        className={`tab-pane fade ${selectedPayment === 'payos' ? 'show active' : ''}`}
                                        id="pills-payos"
                                        role="tabpanel"
                                    >
                                        <div className="payment-method-info">
                                            <div className="alert alert-info">
                                                <h6 className="mb-2">
                                                    <i className="bi bi-info-circle me-2"></i> Thanh
                                                    toán qua PayOS
                                                </h6>
                                                <p className="mb-0">
                                                    Bạn sẽ được chuyển đến cổng thanh toán PayOS để
                                                    hoàn tất giao dịch. PayOS hỗ trợ thanh toán qua:
                                                </p>
                                                <ul className="mb-0 mt-2">
                                                    <li>Thẻ ATM nội địa</li>
                                                    <li>
                                                        Thẻ tín dụng/ghi nợ quốc tế (Visa,
                                                        Mastercard)
                                                    </li>
                                                    <li>Ví điện tử (Momo, ZaloPay, ViettelPay)</li>
                                                    <li>Chuyển khoản ngân hàng</li>
                                                </ul>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label" htmlFor="payos-email">
                                                    Email nhận thông tin thanh toán
                                                </label>
                                                <div className="position-relative input-icon">
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        id="payos-email"
                                                        placeholder="email@example.com"
                                                    />
                                                    <span>
                                                        <i className="isax isax-sms"></i>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mb-0">
                                                <label className="form-label" htmlFor="payos-phone">
                                                    Số điện thoại
                                                </label>
                                                <div className="position-relative input-icon">
                                                    <input
                                                        type="tel"
                                                        className="form-control"
                                                        id="payos-phone"
                                                        placeholder="0123456789"
                                                    />
                                                    <span>
                                                        <i className="isax isax-call"></i>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={`tab-pane fade ${selectedPayment === 'vnpay' ? 'show active' : ''}`}
                                        id="pills-vnpay"
                                        role="tabpanel"
                                    >
                                        <div className="payment-method-info">
                                            <div className="alert alert-info">
                                                <h6 className="mb-2">
                                                    <i className="bi bi-info-circle me-2"></i> Thanh
                                                    toán qua VNPay
                                                </h6>
                                                <p className="mb-0">
                                                    Bạn sẽ được chuyển đến cổng thanh toán VNPay để
                                                    hoàn tất giao dịch. VNPay hỗ trợ thanh toán qua:
                                                </p>
                                                <ul className="mb-0 mt-2">
                                                    <li>Thẻ ATM/Tài khoản ngân hàng</li>
                                                    <li>
                                                        Thẻ thanh toán quốc tế (Visa, Mastercard,
                                                        JCB, AMEX)
                                                    </li>
                                                    <li>Ví điện tử VNPay</li>
                                                    <li>QR Code</li>
                                                </ul>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label" htmlFor="vnpay-email">
                                                    Email nhận thông tin thanh toán
                                                </label>
                                                <div className="position-relative input-icon">
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        id="vnpay-email"
                                                        placeholder="email@example.com"
                                                    />
                                                    <span>
                                                        <i className="isax isax-sms"></i>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mb-0">
                                                <label className="form-label" htmlFor="vnpay-phone">
                                                    Số điện thoại
                                                </label>
                                                <div className="position-relative input-icon">
                                                    <input
                                                        type="tel"
                                                        className="form-control"
                                                        id="vnpay-phone"
                                                        placeholder="0123456789"
                                                    />
                                                    <span>
                                                        <i className="isax isax-call"></i>
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
                                        <div className="fw-medium">Phòng khám</div>
                                        <div className="form-plain-text">
                                            {doctorInfo.location || 'Chưa cập nhật'}
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="pt-3 border-top booking-more-info">
                                <h6 className="mb-3">Thông tin thanh toán</h6>
                                <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-2">
                                    <p className="mb-0">Phí khám bệnh</p>
                                    <span className="fw-medium d-block">200.000 đ</span>
                                </div>
                                <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-2">
                                    <p className="mb-0">Phí đặt lịch</p>
                                    <span className="fw-medium d-block">20.000 đ</span>
                                </div>
                                <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-2">
                                    <p className="mb-0">Thuế VAT (10%)</p>
                                    <span className="fw-medium d-block">22.000 đ</span>
                                </div>
                                <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-2">
                                    <p className="mb-0">Giảm giá</p>
                                    <span className="fw-medium text-danger d-block">-0 đ</span>
                                </div>
                            </div>
                            <div className="bg-primary d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between p-3 rounded">
                                <h6 className="text-white">Tổng cộng</h6>
                                <h6 className="text-white">242.000 đ</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BookingSectionWrapper>
    );
};

export default PaymentSection;
