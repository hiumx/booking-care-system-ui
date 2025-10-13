import { useState } from 'react';
import BookingLayout from '@/layouts/BookingLayout';
import StepWizard from '@/components/StepWizard';
import { BOOKING_STEPS } from './data/data';
import BasicInfoSection from './sections/BasicInfoSection';
import ConfirmSection from './sections/ConfirmSection';
import DateTimeSection from './sections/DateTimeSection';
import PaymentSection from './sections/PaymentSection';
import styles from './Booking.module.scss';
import clsx from 'clsx';
import { useNavigate, useParams } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toast } from 'react-toastify';
import { AppointmentService } from '@/services/appointment.service';
import { CreateAppointmentRequest } from '@/types/appointment.types';
import { AppointmentType } from '@/enums/appointment.enums';
import { setCreatedAppointmentId } from '@/store/slices/bookingSlice';

const Booking: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { doctorId } = useParams<{ doctorId: string }>();

    // Redux selectors for authentication and user state
    const authState = useAppSelector((state) => state.auth);
    const userState = useAppSelector((state) => state.user);
    const bookingState = useAppSelector((state) => state.booking);
    const scheduleState = useAppSelector((state) => state.schedule);
    const doctorState = useAppSelector((state) => state.doctor);

    const nextStep = async () => {
        // Check authentication and phone confirmation when moving from step 1 to step 2
        if (currentStep === 1) {
            // Check if user is authenticated
            if (!authState.isAuthenticated) {
                toast.warn('Vui lòng đăng nhập');
                navigate(PATHS.LOGIN);
                return;
            }

            // Check phone confirmation and phone value
            if (!authState.phoneConfirmed && !userState.profile?.phone) {
                toast.warn('Vui lòng cập nhật số điện thoại');
                navigate(PATHS.USER.ROOT + '/' + PATHS.USER.PROFILE + '?tab=settings');
                return;
            }
        }

        // Create appointment when moving from step 2 to step 3
        if (currentStep === 3) {
            await handleCreateAppointment();
            return;
        }

        setCurrentStep((prev) => prev + 1);
    };

    const handleCreateAppointment = async () => {
        if (!userState.profile?.id) {
            toast.error('Không tìm thấy thông tin người dùng');
            return;
        }

        if (!scheduleState.selectedDate || scheduleState.selectedSlots.length === 0) {
            toast.error('Vui lòng chọn ngày và giờ khám');
            return;
        }

        setIsCreatingAppointment(true);
        try {
            // Get first selected slot
            const firstSlot = scheduleState.selectedSlots[0];
            const appointmentTimeId = `AT_${firstSlot.startTime.replace(':', '_')}_${firstSlot.endTime.replace(':', '_')}`;

            const request: CreateAppointmentRequest = {
                patientId: userState.profile.id,
                doctorId: doctorId,
                appointmentDate: scheduleState.selectedDate,
                appointmentTimeId: appointmentTimeId,
                hospitalId: doctorState.selectedDoctor?.hospital?.id,
                appointmentType: bookingState.appointmentType || AppointmentType.IN_PERSON,
                symptoms: bookingState.symptoms,
                attachmentUrls: bookingState.attachmentUrls.join(','),
            };

            const response = await AppointmentService.createAppointment(request);

            if (response.success && response.data) {
                const appointmentId = (response.data as any).appointmentId;
                if (appointmentId) {
                    dispatch(setCreatedAppointmentId(appointmentId));
                    setCurrentStep((prev) => prev + 1);
                }
            }
        } catch (error: any) {
            toast.error(error.message || 'Không thể tạo lịch hẹn');
        } finally {
            setIsCreatingAppointment(false);
        }
    };

    const prevStep = () => setCurrentStep((prev) => prev - 1);

    if (currentStep < 1 || currentStep > BOOKING_STEPS.length) {
        navigate(PATHS.DOCTOR.ROOT);
    }

    return (
        <BookingLayout>
            <div className={clsx(styles.bookingContainer, 'doctor-content')}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            {currentStep <= 3 && (
                                <StepWizard steps={BOOKING_STEPS} currentStep={currentStep} />
                            )}
                            <div className="booking-widget multistep-form">
                                {currentStep === 1 && (
                                    <DateTimeSection
                                        nextStep={nextStep}
                                        prevStep={prevStep}
                                        doctorId={doctorId}
                                    />
                                )}
                                {currentStep === 2 && (
                                    <BasicInfoSection nextStep={nextStep} prevStep={prevStep} />
                                )}
                                {currentStep === 3 && (
                                    <PaymentSection
                                        nextStep={nextStep}
                                        prevStep={prevStep}
                                        isCreatingAppointment={isCreatingAppointment}
                                    />
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
