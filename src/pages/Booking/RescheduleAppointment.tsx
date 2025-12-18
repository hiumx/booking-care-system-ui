import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import BookingLayout from '@/layouts/BookingLayout';
import DateTimeSection from './sections/DateTimeSection';
import StepWizard from '@/components/StepWizard';
import { BOOKING_STEPS } from './data/data';
import { AppointmentService } from '@/services/appointment.service';
import { useAppSelector } from '@/store/hooks';
import { PATHS } from '@/routes/paths';
import styles from './Booking.module.scss';
import clsx from 'clsx';
import BookingLoadingState from './components/BookingLoadingState';
import { loadAppointmentData, validateAppointmentParams } from '@/utils/appointment-utils';

/**
 * RescheduleAppointment Page - Option 1
 * Patient reschedules with same doctor, selecting new date/time
 */
const RescheduleAppointment: React.FC = () => {
    const { t } = useTranslation('booking');
    const [appointmentData, setAppointmentData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const [searchParams] = useSearchParams();

    const scheduleState = useAppSelector((state) => state.schedule);

    const rescheduleToken = searchParams.get('token');
    const doctorId = searchParams.get('doctorId');

    useEffect(() => {
        if (!validateAppointmentParams(appointmentId || null, rescheduleToken, navigate)) {
            return;
        }

        if (appointmentId) {
            loadAppointmentData(appointmentId, setAppointmentData, setIsLoading, navigate);
        }
    }, [appointmentId, rescheduleToken, navigate]);

    const handleReschedule = async () => {
        if (!scheduleState.selectedDate || scheduleState.selectedSlots.length === 0) {
            toast.error(t('rescheduleAppointment.toast.selectDateTime'));
            return;
        }

        if (!appointmentId || !rescheduleToken) {
            toast.error(t('rescheduleAppointment.toast.invalidInfo'));
            return;
        }

        try {
            const firstSlot = scheduleState.selectedSlots[0];
            const newAppointmentTimeId = `AT_${firstSlot.startTime.replace(':', '_')}_${firstSlot.endTime.replace(':', '_')}`;

            const response = await AppointmentService.rescheduleSameDoctor({
                appointmentId,
                rescheduleToken,
                newAppointmentDate: scheduleState.selectedDate,
                newAppointmentTimeId,
            });

            if (response.success) {
                toast.success(t('rescheduleAppointment.toast.success'));
                navigate(PATHS.BOOKING.CONFIRMATION.replace(':appointmentId', appointmentId));
            } else {
                throw new Error(response.message || t('rescheduleAppointment.toast.error'));
            }
        } catch (error: any) {
            console.error('Error rescheduling:', error);
            toast.error(error.message || t('rescheduleAppointment.toast.error'));
        }
    };

    if (isLoading) {
        return <BookingLoadingState message={t('rescheduleAppointment.loading')} />;
    }

    return (
        <BookingLayout>
            <div className={clsx(styles.bookingContainer, 'doctor-content')}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            <StepWizard steps={[BOOKING_STEPS[0]]} currentStep={1} />

                            <div className="booking-widget">
                                <DateTimeSection
                                    nextStep={handleReschedule}
                                    prevStep={() => navigate(PATHS.HOME)}
                                    doctorId={doctorId || appointmentData?.doctorInfo?.id}
                                    isRescheduleMode={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BookingLayout>
    );
};

export default RescheduleAppointment;
