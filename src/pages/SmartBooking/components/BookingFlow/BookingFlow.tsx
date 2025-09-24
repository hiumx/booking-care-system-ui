import React, { useState } from 'react';
import {
    Calendar,
    Clock,
    User,
    CreditCard,
    CheckCircle,
    ArrowLeft,
    ArrowRight,
} from 'lucide-react';

interface BookingFlowProps {
    isOpen: boolean;
    onClose: () => void;
    bookingType: 'doctor' | 'hospital' | 'service';
    itemId: string;
    itemName: string;
}

interface BookingData {
    date: string;
    time: string;
    patientName: string;
    phone: string;
    email: string;
    address: string;
    symptoms: string;
    paymentMethod: 'card' | 'cash' | 'insurance';
    notes: string;
}

const BookingFlow: React.FC<BookingFlowProps> = ({
    isOpen,
    onClose,
    bookingType,
    itemId,
    itemName,
}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [bookingData, setBookingData] = useState<BookingData>({
        date: '',
        time: '',
        patientName: '',
        phone: '',
        email: '',
        address: '',
        symptoms: '',
        paymentMethod: 'card',
        notes: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const steps = [
        { id: 1, title: 'Chọn thời gian', icon: Calendar },
        { id: 2, title: 'Thông tin cá nhân', icon: User },
        { id: 3, title: 'Thanh toán', icon: CreditCard },
        { id: 4, title: 'Xác nhận', icon: CheckCircle },
    ];

    const timeSlots = [
        '08:00',
        '08:30',
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30',
    ];

    const availableDates = [
        { date: '2024-01-15', label: 'Hôm nay' },
        { date: '2024-01-16', label: 'Ngày mai' },
        { date: '2024-01-17', label: 'Thứ 4' },
        { date: '2024-01-18', label: 'Thứ 5' },
        { date: '2024-01-19', label: 'Thứ 6' },
    ];

    const handleInputChange = (field: keyof BookingData, value: string) => {
        setBookingData((prev) => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setCurrentStep(4);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="row g-4">
                        <div className="col-12">
                            <h6 className="fw-semibold mb-3">Chọn ngày</h6>
                            <div className="row g-2">
                                {availableDates.map((dateInfo, index) => (
                                    <div key={index} className="col-6 col-md-4">
                                        <button
                                            onClick={() => handleInputChange('date', dateInfo.date)}
                                            className={`btn w-100 py-3 rounded-pill ${
                                                bookingData.date === dateInfo.date
                                                    ? 'btn-primary'
                                                    : 'btn-outline-primary'
                                            }`}
                                        >
                                            <div className="small fw-medium">{dateInfo.label}</div>
                                            <div className="small text-muted">{dateInfo.date}</div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-12">
                            <h6 className="fw-semibold mb-3">Chọn giờ</h6>
                            <div className="row g-2">
                                {timeSlots.map((time, index) => (
                                    <div key={index} className="col-4 col-md-3">
                                        <button
                                            onClick={() => handleInputChange('time', time)}
                                            className={`btn w-100 py-2 rounded-pill ${
                                                bookingData.time === time
                                                    ? 'btn-primary'
                                                    : 'btn-outline-primary'
                                            }`}
                                        >
                                            {time}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="row g-4">
                        <div className="col-md-6">
                            <label className="form-label fw-medium">Họ và tên *</label>
                            <input
                                type="text"
                                className="form-control"
                                value={bookingData.patientName}
                                onChange={(e) => handleInputChange('patientName', e.target.value)}
                                placeholder="Nhập họ và tên"
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-medium">Số điện thoại *</label>
                            <input
                                type="tel"
                                className="form-control"
                                value={bookingData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="Nhập số điện thoại"
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-medium">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={bookingData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="Nhập email"
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-medium">Địa chỉ</label>
                            <input
                                type="text"
                                className="form-control"
                                value={bookingData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                placeholder="Nhập địa chỉ"
                            />
                        </div>
                        <div className="col-12">
                            <label className="form-label fw-medium">Triệu chứng / Ghi chú</label>
                            <textarea
                                className="form-control"
                                rows={3}
                                value={bookingData.symptoms}
                                onChange={(e) => handleInputChange('symptoms', e.target.value)}
                                placeholder="Mô tả triệu chứng hoặc ghi chú thêm..."
                            />
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="row g-4">
                        <div className="col-12">
                            <h6 className="fw-semibold mb-3">Phương thức thanh toán</h6>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <button
                                        onClick={() => handleInputChange('paymentMethod', 'card')}
                                        className={`btn w-100 py-3 rounded-pill d-flex align-items-center justify-content-center ${
                                            bookingData.paymentMethod === 'card'
                                                ? 'btn-primary'
                                                : 'btn-outline-primary'
                                        }`}
                                    >
                                        <CreditCard size={20} className="me-2" />
                                        Thẻ tín dụng
                                    </button>
                                </div>
                                <div className="col-md-4">
                                    <button
                                        onClick={() => handleInputChange('paymentMethod', 'cash')}
                                        className={`btn w-100 py-3 rounded-pill d-flex align-items-center justify-content-center ${
                                            bookingData.paymentMethod === 'cash'
                                                ? 'btn-primary'
                                                : 'btn-outline-primary'
                                        }`}
                                    >
                                        <Clock size={20} className="me-2" />
                                        Thanh toán tại chỗ
                                    </button>
                                </div>
                                <div className="col-md-4">
                                    <button
                                        onClick={() =>
                                            handleInputChange('paymentMethod', 'insurance')
                                        }
                                        className={`btn w-100 py-3 rounded-pill d-flex align-items-center justify-content-center ${
                                            bookingData.paymentMethod === 'insurance'
                                                ? 'btn-primary'
                                                : 'btn-outline-primary'
                                        }`}
                                    >
                                        <CheckCircle size={20} className="me-2" />
                                        Bảo hiểm
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="bg-light rounded-4 p-4">
                                <h6 className="fw-semibold mb-3">Tóm tắt đặt lịch</h6>
                                <div className="row g-3">
                                    <div className="col-6">
                                        <p className="small text-muted mb-1">Dịch vụ</p>
                                        <p className="fw-medium mb-0">{itemName}</p>
                                    </div>
                                    <div className="col-6">
                                        <p className="small text-muted mb-1">Thời gian</p>
                                        <p className="fw-medium mb-0">
                                            {bookingData.date} - {bookingData.time}
                                        </p>
                                    </div>
                                    <div className="col-6">
                                        <p className="small text-muted mb-1">Bệnh nhân</p>
                                        <p className="fw-medium mb-0">{bookingData.patientName}</p>
                                    </div>
                                    <div className="col-6">
                                        <p className="small text-muted mb-1">Phí dịch vụ</p>
                                        <p className="fw-bold text-primary mb-0">300.000đ</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="text-center py-5">
                        <div
                            className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-4"
                            style={{
                                width: '80px',
                                height: '80px',
                                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                            }}
                        >
                            <CheckCircle size={40} className="text-white" />
                        </div>
                        <h4 className="fw-bold text-dark mb-3">Đặt lịch thành công!</h4>
                        <p className="text-muted mb-4">
                            Chúng tôi đã gửi thông tin xác nhận đến email của bạn. Vui lòng kiểm tra
                            email để biết thêm chi tiết.
                        </p>
                        <div className="bg-light rounded-4 p-4">
                            <h6 className="fw-semibold mb-3">Thông tin đặt lịch</h6>
                            <div className="row g-3 text-start">
                                <div className="col-6">
                                    <p className="small text-muted mb-1">Mã đặt lịch</p>
                                    <p className="fw-medium mb-0">#BK{itemId}001</p>
                                </div>
                                <div className="col-6">
                                    <p className="small text-muted mb-1">Thời gian</p>
                                    <p className="fw-medium mb-0">
                                        {bookingData.date} - {bookingData.time}
                                    </p>
                                </div>
                                <div className="col-6">
                                    <p className="small text-muted mb-1">Dịch vụ</p>
                                    <p className="fw-medium mb-0">{itemName}</p>
                                </div>
                                <div className="col-6">
                                    <p className="small text-muted mb-1">Trạng thái</p>
                                    <p className="fw-medium text-success mb-0">Đã xác nhận</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="modal fade show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            tabIndex={-1}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content rounded-4 border-0 shadow-lg">
                    <div className="modal-header border-0 pb-0">
                        <div className="d-flex align-items-center">
                            <h5 className="modal-title fw-bold">
                                Đặt lịch{' '}
                                {bookingType === 'doctor'
                                    ? 'bác sĩ'
                                    : bookingType === 'hospital'
                                      ? 'bệnh viện'
                                      : 'dịch vụ'}
                            </h5>
                        </div>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body pt-0">
                        {/* Progress Steps */}
                        <div className="mb-4">
                            <div className="d-flex align-items-center justify-content-between">
                                {steps.map((step) => {
                                    const Icon = step.icon;
                                    const isActive = currentStep === step.id;
                                    const isCompleted = currentStep > step.id;

                                    return (
                                        <div
                                            key={step.id}
                                            className="d-flex flex-column align-items-center"
                                        >
                                            <div
                                                className={`d-flex align-items-center justify-content-center rounded-circle mb-2 ${
                                                    isActive
                                                        ? 'bg-primary text-white'
                                                        : isCompleted
                                                          ? 'bg-success text-white'
                                                          : 'bg-light text-muted'
                                                }`}
                                                style={{ width: '40px', height: '40px' }}
                                            >
                                                <Icon size={20} />
                                            </div>
                                            <span
                                                className={`small fw-medium ${
                                                    isActive
                                                        ? 'text-primary'
                                                        : isCompleted
                                                          ? 'text-success'
                                                          : 'text-muted'
                                                }`}
                                            >
                                                {step.title}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Step Content */}
                        <div className="mb-4">{renderStepContent()}</div>

                        {/* Navigation Buttons */}
                        {currentStep < 4 && (
                            <div className="d-flex justify-content-between">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentStep === 1}
                                    className="btn btn-outline-secondary d-flex align-items-center"
                                >
                                    <ArrowLeft size={16} className="me-2" />
                                    Quay lại
                                </button>

                                {currentStep === 3 ? (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="btn btn-primary d-flex align-items-center"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                >
                                                    <span className="visually-hidden">
                                                        Loading...
                                                    </span>
                                                </div>
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            <>
                                                Xác nhận đặt lịch
                                                <ArrowRight size={16} className="ms-2" />
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleNext}
                                        className="btn btn-primary d-flex align-items-center"
                                    >
                                        Tiếp theo
                                        <ArrowRight size={16} className="ms-2" />
                                    </button>
                                )}
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="text-center">
                                <button onClick={onClose} className="btn btn-primary px-4 py-2">
                                    Hoàn thành
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingFlow;
