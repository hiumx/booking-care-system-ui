import BookingSectionWrapper from '../../components/BookingSectionWrapper/BookingSectionWrapper';
import { mockDoctorInfo, mockAppointmentInfo } from '../../constants/mockData';

interface PaymentSectionProps {
    nextStep: () => void;
    prevStep: () => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ nextStep, prevStep }) => {
    return (
        <BookingSectionWrapper
            doctor={mockDoctorInfo}
            appointment={mockAppointmentInfo}
            nextStepTitle="Xác nhận & Thanh toán"
            nextStep={nextStep}
            prevStep={prevStep}
        >
            <div className="row">
                <div className="col-lg-6 d-flex">
                    <div className="card flex-fill mb-3 mb-lg-0">
                        <div className="card-body">
                            <h6 className="mb-3">Cổng thanh toán</h6>
                            <div className="payment-tabs">
                                <ul
                                    className="nav nav-pills mb-3 row"
                                    id="pills-tab"
                                    role="tablist"
                                >
                                    <li className="nav-item col-sm-4" role="presentation">
                                        <button
                                            className="nav-link active"
                                            id="pills-home-tab"
                                            data-bs-toggle="pill"
                                            data-bs-target="#pills-home"
                                            type="button"
                                            role="tab"
                                        >
                                            <img
                                                src="/src/assets/img/icons/payment-icon-05.svg"
                                                className="me-2"
                                                alt=""
                                            />
                                            Thẻ tín dụng
                                        </button>
                                    </li>
                                    <li className="nav-item col-sm-4" role="presentation">
                                        <button
                                            className="nav-link"
                                            id="pills-profile-tab"
                                            data-bs-toggle="pill"
                                            data-bs-target="#pills-profile"
                                            type="button"
                                            role="tab"
                                        >
                                            <img
                                                src="/src/assets/img/icons/payment-icon-06.svg"
                                                className="me-2"
                                                alt=""
                                            />
                                            Paypal
                                        </button>
                                    </li>
                                    <li className="nav-item col-sm-4" role="presentation">
                                        <button
                                            className="nav-link"
                                            id="pills-contact-tab"
                                            data-bs-toggle="pill"
                                            data-bs-target="#pills-contact"
                                            type="button"
                                            role="tab"
                                        >
                                            <img
                                                src="/src/assets/img/icons/payment-icon-07.svg"
                                                className="me-2"
                                                alt=""
                                            />
                                            Stripe
                                        </button>
                                    </li>
                                </ul>
                                <div className="tab-content" id="pills-tabContent">
                                    <div
                                        className="tab-pane fade show active"
                                        id="pills-home"
                                        role="tabpanel"
                                    >
                                        <div className="mb-3">
                                            <label className="form-label">Tên chủ thẻ</label>
                                            <div className="position-relative input-icon">
                                                <input type="text" className="form-control" />
                                                <span>
                                                    <i className="isax isax-user"></i>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="card-number">
                                                Số thẻ
                                            </label>
                                            <div className="position-relative input-icon">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="card-number"
                                                />
                                                <span>
                                                    <i className="isax isax-card-tick"></i>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Ngày hết hạn</label>
                                            <div className="position-relative input-icon">
                                                <input type="text" className="form-control" />
                                                <span>
                                                    <i className="isax isax-calendar-2"></i>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mb-0">
                                            <label className="form-label">CVV</label>
                                            <div className="position-relative input-icon">
                                                <input type="text" className="form-control" />
                                                <span>
                                                    <i className="isax isax-check"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="tab-pane fade"
                                        id="pills-profile"
                                        role="tabpanel"
                                    >
                                        <div className="mb-3">
                                            <label className="form-label">Địa chỉ Email</label>
                                            <div className="position-relative input-icon">
                                                <input type="text" className="form-control" />
                                                <span>
                                                    <i className="isax isax-sms"></i>
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="form-label">Mật khẩu</label>
                                            <div className="pass-group">
                                                <input
                                                    type="password"
                                                    className="form-control pass-input"
                                                />
                                                <span className="feather-eye-off toggle-password"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="tab-pane fade"
                                        id="pills-contact"
                                        role="tabpanel"
                                    >
                                        <div className="mb-3">
                                            <label className="form-label">Địa chỉ Email</label>
                                            <div className="position-relative input-icon">
                                                <input type="text" className="form-control" />
                                                <span>
                                                    <i className="isax isax-sms"></i>
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="form-label">Mật khẩu</label>
                                            <div className="pass-group">
                                                <input
                                                    type="password"
                                                    className="form-control pass-input-sub"
                                                />
                                                <span className="feather-eye-off toggle-password-sub"></span>
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
                                <label className="form-label">Ngày & Giờ</label>
                                <div className="form-plain-text">
                                    10:00 - 11:00, 15, Tháng 10 2025{' '}
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Loại lịch hẹn</label>
                                <div className="form-plain-text">Phòng khám (Wellness Path) </div>
                            </div>
                            <div className="pt-3 border-top booking-more-info">
                                <h6 className="mb-3">Thông tin thanh toán</h6>
                                <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-2">
                                    <p className="mb-0">Siêu âm tim</p>
                                    <span className="fw-medium d-block">200.000 đ</span>
                                </div>
                                <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-2">
                                    <p className="mb-0">Phí đặt lịch</p>
                                    <span className="fw-medium d-block">20.000 đ</span>
                                </div>
                                <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-2">
                                    <p className="mb-0">Thuế</p>
                                    <span className="fw-medium d-block">18.000 đ</span>
                                </div>
                                <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-2">
                                    <p className="mb-0">Giảm giá</p>
                                    <span className="fw-medium text-danger d-block">-15.000 đ</span>
                                </div>
                            </div>
                            <div className="bg-primary d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between p-3 rounded">
                                <h6 className="text-white">Tổng cộng</h6>
                                <h6 className="text-white">223.000 đ</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BookingSectionWrapper>
    );
};

export default PaymentSection;
