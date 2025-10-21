import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BookingLayout from '@/layouts/BookingLayout';
import DateTimeSection from './sections/DateTimeSection';
import StepWizard from '@/components/StepWizard';
import { BOOKING_STEPS } from './data/data';
import { AppointmentService } from '@/services/appointment.service';
import { useAppSelector } from '@/store/hooks';
import { PATHS } from '@/routes/paths';
import styles from './Booking.module.scss';
import clsx from 'clsx';
import FullScreenSpinner from '@/components/FullScreenSpinner';

/**
 * RescheduleAppointment Page - Option 1
 * Patient reschedules with same doctor, selecting new date/time
 */
const RescheduleAppointment: React.FC = () => {
    const [appointmentData, setAppointmentData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const [searchParams] = useSearchParams();

    const scheduleState = useAppSelector((state) => state.schedule);

    const rescheduleToken = searchParams.get('token');
    const doctorId = searchParams.get('doctorId');

    useEffect(() => {
        if (!appointmentId || !rescheduleToken) {
            toast.error('Thông tin không hợp lệ');
            navigate(PATHS.HOME);
            return;
        }

        loadAppointmentData();
    }, [appointmentId]);

    const loadAppointmentData = async () => {
        if (!appointmentId) return;

        try {
            setIsLoading(true);
            const response = await AppointmentService.getAppointmentById(appointmentId);

            if (response.success && response.data) {
                setAppointmentData(response.data);
            } else {
                throw new Error('Không thể tải thông tin lịch hẹn');
            }
        } catch (error: any) {
            console.error('Error loading appointment:', error);
            toast.error(error.message || 'Không thể tải thông tin lịch hẹn');
            navigate(PATHS.HOME);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReschedule = async () => {
        if (!scheduleState.selectedDate || scheduleState.selectedSlots.length === 0) {
            toast.error('Vui lòng chọn ngày và giờ khám mới');
            return;
        }

        if (!appointmentId || !rescheduleToken) {
            toast.error('Thông tin không hợp lệ');
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
                toast.success('Đổi lịch hẹn thành công!');
                navigate(PATHS.BOOKING.CONFIRMATION.replace(':appointmentId', appointmentId));
            } else {
                throw new Error(response.message || 'Không thể đổi lịch hẹn');
            }
        } catch (error: any) {
            console.error('Error rescheduling:', error);
            toast.error(error.message || 'Không thể đổi lịch hẹn');
        }
    };

    if (isLoading) {
        return (
            <BookingLayout>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            <div
                                className="d-flex flex-column align-items-center justify-content-center"
                                style={{ minHeight: '60vh' }}
                            >
                                <FullScreenSpinner
                                    isVisible={true}
                                    message="Đang tải thông tin lịch hẹn..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </BookingLayout>
        );
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
