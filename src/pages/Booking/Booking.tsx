import { useState } from 'react';
import BookingLayout from '@/layouts/BookingLayout';
import StepWizard from '@/components/StepWizard';
import { BOOKING_STEPS } from './data/data';
import BasicInfoSection from './sections/BasicInfoSection';
import DateTimeSection from './sections/DateTimeSection';
import PaymentSection from './sections/PaymentSection';
import styles from './Booking.module.scss';
import clsx from 'clsx';
import { useNavigate, useParams } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toast } from 'react-toastify';
import { AppointmentService } from '@/services/appointment.service';
import { AppointmentType } from '@/enums/appointment.enums';
import { setCreatedAppointmentId } from '@/store/slices/bookingSlice';
import PaymentService, { CreatePaymentRequest } from '@/services/payment.service';
import { createAppointmentTimeId, createAppointmentRequest } from '@/utils/appointment-utils';

const Booking: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { doctorId } = useParams<{ doctorId: string }>();

    // Note: Payment success now redirects to separate confirmation page instead of step 4

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

        // No appointment creation here - will be handled in PaymentSection

        setCurrentStep((prev) => prev + 1);
    };

    // Helper function to create appointment request from schedule
    const createAppointmentFromSchedule = () => {
        if (!scheduleState.selectedSlots[0] || !userState.profile || !scheduleState.selectedDate) {
            return null;
        }

        const firstSlot = scheduleState.selectedSlots[0];
        const appointmentTimeId = createAppointmentTimeId(firstSlot);

        return createAppointmentRequest({
            patientId: userState.profile.id,
            doctorId: doctorId || '',
            specialtyId: doctorState.selectedDoctor?.specialtyId,
            appointmentDate: scheduleState.selectedDate,
            appointmentTimeId,
            hospitalId: doctorState.selectedDoctor?.hospital?.id,
            appointmentType: bookingState.appointmentType || AppointmentType.IN_PERSON,
            symptoms: bookingState.symptoms,
            attachmentUrls: bookingState.attachmentUrls,
        });
    };

    // Helper function to ensure appointment is created and return appointmentId
    const ensureAppointmentCreated = async (): Promise<string> => {
        // Return existing appointment ID if available
        if (bookingState.createdAppointmentId) {
            return bookingState.createdAppointmentId;
        }

        // Create new appointment
        setIsCreatingAppointment(true);

        const request = createAppointmentFromSchedule();
        if (!request) {
            throw new Error('Không thể tạo yêu cầu đặt lịch');
        }

        const response = await AppointmentService.createAppointment(request);

        if (!response.success) {
            throw new Error(response.message || 'Không thể tạo lịch hẹn');
        }

        const appointmentId = (response.data as any)?.appointmentId;
        if (!appointmentId) {
            throw new Error('Không nhận được ID cuộc hẹn');
        }

        dispatch(setCreatedAppointmentId(appointmentId));
        setIsCreatingAppointment(false);

        return appointmentId;
    };

    // Handle appointment creation and payment (Option 1: Deposit)
    const handleCreateAppointmentAndPayment = async (
        paymentMethodId: string,
        depositAmount: number
    ) => {
        if (!userState.profile?.id) {
            toast.error('Không tìm thấy thông tin người dùng');
            return;
        }

        if (!scheduleState.selectedDate || scheduleState.selectedSlots.length === 0) {
            toast.error('Vui lòng chọn ngày và giờ khám');
            return;
        }

        setIsProcessingPayment(true);

        try {
            // Step 1: Ensure appointment is created
            const appointmentId = await ensureAppointmentCreated();

            // Step 2: Create payment request
            const paymentRequest: CreatePaymentRequest = {
                appointmentId,
                patientId: userState.profile.id,
                amount: depositAmount,
                paymentMethodId,
            };

            const paymentResponse = await PaymentService.createAppointmentPayment(paymentRequest);

            // Step 3: Redirect to payment gateway
            if (!paymentResponse.paymentUrl) {
                throw new Error('Không nhận được URL thanh toán');
            }

            toast.success('Đang chuyển hướng đến cổng thanh toán...');
            setTimeout(() => {
                globalThis.location.href = paymentResponse.paymentUrl;
            }, 1000);
        } catch (error: any) {
            console.error('Process failed:', error);
            toast.error(error.message || 'Không thể hoàn tất quy trình');
            setIsCreatingAppointment(false);
            setIsProcessingPayment(false);
        }
    };

    // Handle appointment creation without payment (Option 2: No Payment)
    const handleCreateAppointmentOnly = async () => {
        if (!userState.profile?.id) {
            toast.error('Không tìm thấy thông tin người dùng');
            return;
        }

        if (!scheduleState.selectedDate || scheduleState.selectedSlots.length === 0) {
            toast.error('Vui lòng chọn ngày và giờ khám');
            return;
        }

        try {
            const appointmentId = await ensureAppointmentCreated();
            toast.success('Đặt lịch thành công! Vui lòng thanh toán khi đến khám.');
            navigate(PATHS.BOOKING.CONFIRMATION.replace(':appointmentId', appointmentId));
        } catch (error: any) {
            console.error('Create appointment failed:', error);
            toast.error(error.message || 'Không thể tạo lịch hẹn');
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
                                        onCreateAppointmentAndPayment={
                                            handleCreateAppointmentAndPayment
                                        }
                                        onCreateAppointmentOnly={handleCreateAppointmentOnly}
                                        isProcessingPayment={isProcessingPayment}
                                    />
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
