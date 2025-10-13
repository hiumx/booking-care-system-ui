import React, { useMemo } from 'react';
import BookingHeader, {
    type DoctorInfo,
    type AppointmentInfo,
} from '../BookingHeader/BookingHeader';
import BookingAction from '../BookingAction';
import { BookingHeaderSkeleton } from '../BookingHeader';
import { useFormattedDateTime } from '../../hooks/useFormattedDateTime';

interface BookingSectionWrapperProps {
    doctor: DoctorInfo;
    appointment: AppointmentInfo;
    nextStepTitle: string;
    nextStep: () => void;
    prevStep: () => void;
    children: React.ReactNode;
    className?: string;
    fieldsetId?: string;
    isShowInfoHeader?: boolean;
    disabled?: boolean;
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
    isShowInfoHeader,
    disabled = false,
}) => {
    // Get formatted date and time from Redux state
    const formattedDateTime = useFormattedDateTime();

    // Update appointment info with selected date and time
    const updatedAppointment = useMemo(
        () => ({
            ...appointment,
            dateTime: formattedDateTime,
        }),
        [appointment, formattedDateTime]
    );

    return (
        <fieldset className={className} id={fieldsetId}>
            <div className="card booking-card mb-0">
                {Object.keys(doctor).length > 0 ? (
                    <BookingHeader
                        doctor={doctor}
                        appointment={updatedAppointment}
                        isShowInfo={isShowInfoHeader}
                    />
                ) : (
                    <BookingHeaderSkeleton />
                )}
                <div className="card-body booking-body">{children}</div>
                <BookingAction
                    nextStepTitle={nextStepTitle}
                    nextStep={nextStep}
                    prevStep={prevStep}
                    disabled={disabled}
                />
            </div>
        </fieldset>
    );
};

export default BookingSectionWrapper;
