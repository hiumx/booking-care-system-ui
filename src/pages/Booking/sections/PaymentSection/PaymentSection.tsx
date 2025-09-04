import BookingAction from '../../components/BookingAction/BookingAction';

interface PaymentSectionProps {
    nextStep: () => void;
    prevStep: () => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ nextStep, prevStep }) => {
    return (
        <fieldset className="d-block">
            <div className="card booking-card mb-0">
                <div className="card-header pt-3">
                    <div className="booking-header pb-0">
                        <div className="card mb-0">
                            <div className="card-body">
                                <div className="d-flex align-items-center flex-wrap rpw-gap-2 flex-wrap row-gap-2">
                                    <span className="avatar avatar-xxxl avatar-rounded me-2 flex-shrink-0">
                                        <img src="/src/assets/img/clients/client-15.jpg" alt="" />
                                    </span>
                                    <div>
                                        <h4 className="mb-1">
                                            Dr. Michael Brown{' '}
                                            <span className="badge bg-orange fs-12">
                                                <i className="fa-solid fa-star me-1"></i>5.0
                                            </span>
                                        </h4>
                                        <p className="text-indigo mb-3 fw-medium">Psychologist</p>
                                        <p className="mb-0">
                                            <i className="isax isax-location me-2"></i>5th Street -
                                            1011 W 5th St, Suite 120, Austin, TX 78703
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body booking-body">
                    <div className="row">
                        <div className="col-lg-6 d-flex">
                            <div className="card flex-fill mb-3 mb-lg-0">
                                <div className="card-body">
                                    <h6 className="mb-3">Payment Gateway</h6>
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
                                                    Credit Card
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
                                                    <label className="form-label">
                                                        Card Holder Name
                                                    </label>
                                                    <div className="position-relative input-icon">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                        />
                                                        <span>
                                                            <i className="isax isax-user"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">
                                                        Card Number
                                                    </label>
                                                    <div className="position-relative input-icon">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                        />
                                                        <span>
                                                            <i className="isax isax-card-tick"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">
                                                        Expire Date
                                                    </label>
                                                    <div className="position-relative input-icon">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                        />
                                                        <span>
                                                            <i className="isax isax-calendar-2"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="mb-0">
                                                    <label className="form-label">CVV</label>
                                                    <div className="position-relative input-icon">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                        />
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
                                                    <label className="form-label">
                                                        Email Address
                                                    </label>
                                                    <div className="position-relative input-icon">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                        />
                                                        <span>
                                                            <i className="isax isax-sms"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="form-label">Password</label>
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
                                                    <label className="form-label">
                                                        Email Address
                                                    </label>
                                                    <div className="position-relative input-icon">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                        />
                                                        <span>
                                                            <i className="isax isax-sms"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="form-label">Password</label>
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
                                    <h6 className="mb-3">Booking Info</h6>
                                    <div className="mb-3">
                                        <label className="form-label">Date & Time</label>
                                        <div className="form-plain-text">
                                            10:00 - 11:00 AM, 15, Oct 2025{' '}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Appointment type</label>
                                        <div className="form-plain-text">
                                            Clinic (Wellness Path){' '}
                                        </div>
                                    </div>
                                    <div className="pt-3 border-top booking-more-info">
                                        <h6 className="mb-3">Payment Info</h6>
                                        <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-2">
                                            <p className="mb-0">Echocardiograms</p>
                                            <span className="fw-medium d-block">$200</span>
                                        </div>
                                        <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-2">
                                            <p className="mb-0">Booking Fees</p>
                                            <span className="fw-medium d-block">$20</span>
                                        </div>
                                        <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-2">
                                            <p className="mb-0">Tax</p>
                                            <span className="fw-medium d-block">$18</span>
                                        </div>
                                        <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-2">
                                            <p className="mb-0">Discount</p>
                                            <span className="fw-medium text-danger d-block">
                                                -$15
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-primary d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between p-3 rounded">
                                        <h6 className="text-white">Total</h6>
                                        <h6 className="text-white">$320</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <BookingAction
                    nextStepTitle="Confirm & Pay"
                    nextStep={nextStep}
                    prevStep={prevStep}
                />
            </div>
        </fieldset>
    );
};

export default PaymentSection;
