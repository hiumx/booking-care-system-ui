import { useState } from 'react';
import BookingLayout from '@/layouts/BookingLayout';
import { BOOKING_STEPS } from './data/data';
import BasicInfoSection from './sections/BasicInfoSection';
import ConfirmSection from './sections/ConfirmSection';
import DateTimeSection from './sections/DateTimeSection';
import PaymentSection from './sections/PaymentSection';
import styles from './Booking.module.scss';
import clsx from 'clsx';

const Booking: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<number>(1);

    const nextStep = () => setCurrentStep((prev) => prev + 1);
    const prevStep = () => setCurrentStep((prev) => prev - 1);

    return (
        <BookingLayout>
            <div className={clsx(styles.bookingContainer, 'doctor-content')}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            <div className="booking-wizard">
                                <ul
                                    className="form-wizard-steps d-sm-flex align-items-center justify-content-center"
                                    id="progressbar2"
                                >
                                    {BOOKING_STEPS.map((step, idx) => (
                                        <li
                                            key={idx}
                                            className={
                                                idx + 1 === currentStep
                                                    ? 'progress-active'
                                                    : idx + 1 < currentStep
                                                      ? 'progress-activated'
                                                      : ''
                                            }
                                        >
                                            <div className="profile-step">
                                                <span className="multi-steps">{step.id}</span>
                                                <div className="step-section">
                                                    <h6>{step.title}</h6>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="booking-widget multistep-form">
                                {currentStep === 1 && (
                                    <DateTimeSection nextStep={nextStep} prevStep={prevStep} />
                                )}
                                {currentStep === 2 && (
                                    <BasicInfoSection nextStep={nextStep} prevStep={prevStep} />
                                )}
                                {currentStep === 3 && (
                                    <PaymentSection nextStep={nextStep} prevStep={prevStep} />
                                )}
                                {currentStep === 4 && (
                                    <ConfirmSection handleGoBack={() => setCurrentStep(1)} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BookingLayout>
    );
};

export default Booking;
