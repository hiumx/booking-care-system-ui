// import { useState } from 'react';
import { BOOKING_STEPS } from './data/data';
import BasicInfoSection from './sections/BasicInfoSection';
import ConfirmSection from './sections/ConfirmSection';
import DateTimeSection from './sections/DateTimeSection';
import PaymentSection from './sections/PaymentSection';

const Booking: React.FC = () => {
    // const [currentStep, setCurrentStep] = useState<number>(1);

    return (
        <div className="doctor-content">
            <div className="container">
                <div className="row">
                    <div className="col-lg-10 mx-auto">
                        <div className="booking-wizard">
                            <ul
                                className="form-wizard-steps d-sm-flex align-items-center justify-content-center"
                                id="progressbar2"
                            >
                                {BOOKING_STEPS.map((step) => (
                                    <li key={step.id}>
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
                        <div className="booking-widget multistep-form mb-5">
                            <DateTimeSection />

                            <BasicInfoSection />
                            <PaymentSection />
                            <ConfirmSection />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
