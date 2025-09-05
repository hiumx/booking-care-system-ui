import { Link } from 'react-router-dom';
import styles from './ConfirmSection.module.scss';
import { buildPath, PATHS } from '@/routes/paths';

interface ConfirmSectionProps {
    handleGoBack: () => void;
}

const ConfirmSection: React.FC<ConfirmSectionProps> = ({ handleGoBack }) => {
    return (
        <fieldset className="d-block">
            <div className="card booking-card">
                <div className="card-body booking-body pb-1">
                    <div className="row">
                        <div className="col-lg-8 d-flex">
                            <div className="flex-fill">
                                <div className="card ">
                                    <div className="card-header pt-3">
                                        <h5 className="d-flex align-items-center flex-wrap rpw-gap-2">
                                            <i className="isax isax-tick-circle5 text-success me-2"></i>
                                            Booking Confirmed
                                        </h5>
                                    </div>
                                    <div className="card-header d-flex align-items-center flex-wrap rpw-gap-2">
                                        <span className="avatar avatar-lg avatar-rounded me-2 flex-shrink-0">
                                            <img
                                                src="/src/assets/img/clients/client-16.jpg"
                                                alt="patient-avatar"
                                            />
                                        </span>
                                        <p className="mb-0">
                                            Your Booking has been Confirmed with{' '}
                                            <span className="text-dark">Dr. Michael Brown </span> be
                                            on time before{' '}
                                            <span className="text-dark">15 Mins </span> From the
                                            appointment Time
                                        </p>
                                    </div>
                                    <div className="card-body pb-1">
                                        <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-3">
                                            <h6>Booking Info</h6>
                                            <a
                                                href="javascript:void(0);"
                                                className="btn btn-light rounded-pill"
                                            >
                                                <i className="isax isax-calendar me-1"></i>
                                                Reschedule
                                            </a>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Service</label>
                                                    <div className="form-plain-text">
                                                        Cardiology (30 Mins)
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="form-label">
                                                        Additional Service
                                                    </label>
                                                    <div className="form-plain-text">
                                                        Echocardiograms
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="form-label">
                                                        Date & Time
                                                    </label>
                                                    <div className="form-plain-text">
                                                        10:00 - 11:00 AM, 15, Oct 2025{' '}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="form-label">
                                                        Appointment type
                                                    </label>
                                                    <div className="form-plain-text">Clinic </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="form-label">
                                                        Clinic Name & Location
                                                    </label>
                                                    <div className="form-plain-text">
                                                        Wellness Path{' '}
                                                        <a
                                                            href="javascript:void(0);"
                                                            className="text-primary"
                                                        >
                                                            View Location
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-body d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between">
                                        <div>
                                            <h6 className="mb-1">Need Our Assistance</h6>
                                            <p className="mb-0">
                                                Call us in case you face any Issue on Booking /
                                                Cancellation
                                            </p>
                                        </div>
                                        <a
                                            href="javascript:void(0);"
                                            className="btn btn-light rounded-pill"
                                        >
                                            <i className="isax isax-call5 me-1"></i>Call Us
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 d-flex">
                            <div className="card flex-fill">
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div className="text-center">
                                        <h6 className="fs-14 mb-2">Booking Number</h6>
                                        <span className="booking-id-badge mb-3">DCRA12565</span>
                                        <span className="d-block mb-3">
                                            <img
                                                src="/src/assets/img/icons/payment-qr.svg"
                                                alt=""
                                            />
                                        </span>
                                        <p>
                                            Scan this QR Code to Download the details of Appointment
                                        </p>
                                    </div>
                                    <div>
                                        <a
                                            href="javascript:void(0);"
                                            className="btn w-100 mb-3 btn-md btn-dark prev_btns inline-flex align-items-center rounded-pill"
                                        >
                                            Add To Calendar
                                        </a>
                                        <Link
                                            to={buildPath(PATHS.DOCTOR.ROOT, PATHS.DOCTOR.LIST)}
                                            className="btn w-100 btn-md btn-primary-gradient next_btns inline-flex align-items-center rounded-pill"
                                        >
                                            Start New Booking
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div onClick={handleGoBack} className={styles.backToBookings}>
                    <i className="isax isax-arrow-left-2 me-1"></i>
                    Back to Bookings
                </div>
            </div>
        </fieldset>
    );
};

export default ConfirmSection;
