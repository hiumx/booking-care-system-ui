import React from 'react';
import BookingHeader, { DoctorInfo, AppointmentInfo } from '../BookingHeader/BookingHeader';
import BookingAction from '../BookingAction/BookingAction';

// export { DoctorInfo, AppointmentInfo };

interface BookingSectionWrapperProps {
    doctor: DoctorInfo;
    appointment: AppointmentInfo;
    nextStepTitle: string;
    nextStep: () => void;
    prevStep: () => void;
    children: React.ReactNode;
    className?: string;
    fieldsetId?: string;
}

const BookingSectionWrapper: React.FC<BookingSectionWrapperProps> = ({
    doctor,
    appointment,
    nextStepTitle,
    nextStep,
    prevStep,
    children,
    className = 'd-block',
    fieldsetId,
}) => {
    return (
        <fieldset className={className} id={fieldsetId}>
            <div className="card booking-card mb-0">
                <BookingHeader doctor={doctor} appointment={appointment} />
                <div className="card-body booking-body">{children}</div>
                <BookingAction
                    nextStepTitle={nextStepTitle}
                    nextStep={nextStep}
                    prevStep={prevStep}
                />
            </div>
        </fieldset>
    );
};

export default BookingSectionWrapper;
