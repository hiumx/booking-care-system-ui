import { useState, useEffect, useCallback } from 'react';
import BookingLayout from '@/layouts/BookingLayout';
import StepWizard from '@/components/StepWizard';
import { BOOKING_STEPS, HOSPITAL_BOOKING_STEPS } from './data/data';
import BasicInfoSection from './sections/BasicInfoSection';
import DateTimeSection from './sections/DateTimeSection';
import PaymentSection from './sections/PaymentSection';
import SpecialtyServiceSection from './sections/SpecialtyServiceSection';
import AppointmentTypeSection from './sections/AppointmentTypeSection';
import styles from './Booking.module.scss';
import clsx from 'clsx';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toast } from 'react-toastify';
import { AppointmentService } from '@/services/appointment.service';
import { getHospitalByIdAsync } from '@/store/slices/hospitalSlice';
import { AppointmentType } from '@/enums/appointment.enums';
import {
    setCreatedAppointmentId,
    setAppointmentType,
    setBookingFlowType,
    setHospitalId,
    setSelectedSpecialtyId,
    setSelectedServiceMedicalId,
} from '@/store/slices/bookingSlice';
import { resetScheduleState } from '@/store/slices/schedule.slice';
import PaymentService, { CreatePaymentRequest } from '@/services/payment.service';
import { createAppointmentTimeId, createAppointmentRequest } from '@/utils/appointment-utils';

const Booking: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { doctorId, serviceMedicalId, hospitalId } = useParams<{
        doctorId?: string;
        serviceMedicalId?: string;
        hospitalId?: string;
    }>();
    const [searchParams] = useSearchParams();

    // Hospital data from Redux for hospital booking
    const hospitalState = useAppSelector((state) => state.hospital);
    const hospitalData = hospitalState.selectedHospital;
    const isLoadingHospital = hospitalState.isLoading;

    // Determine booking type: doctor, service medical, or hospital
    const isServiceMedicalBooking = !!serviceMedicalId;
    const isDoctorBooking = !!doctorId;
    const isHospitalBooking = !!hospitalId;

    // Get current steps based on booking type
    const currentSteps = isHospitalBooking ? HOSPITAL_BOOKING_STEPS : BOOKING_STEPS;
    const totalSteps = currentSteps.length;

    // Note: Payment success now redirects to separate confirmation page instead of step 4

    // Redux selectors for authentication and user state
    const authState = useAppSelector((state) => state.auth);
    const userState = useAppSelector((state) => state.user);
    const bookingState = useAppSelector((state) => state.booking);
    const scheduleState = useAppSelector((state) => state.schedule);
    const doctorState = useAppSelector((state) => state.doctor);
    const serviceMedicalState = useAppSelector(
        (state) => state.medicalService.serviceCategories.selectedServiceWithHospital
    );

    // Clear previous booking state when starting a new booking flow
    // This prevents reusing old appointment ID and clears highlighted slots
    useEffect(() => {
        // Only clear if there's an existing createdAppointmentId from previous booking
        if (bookingState.createdAppointmentId) {
            dispatch(setCreatedAppointmentId(null));
            // Also reset schedule state to clear highlighted slots from previous booking
            dispatch(resetScheduleState());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only on mount

    // Set booking flow type and fetch hospital data
    useEffect(() => {
        if (isHospitalBooking && hospitalId) {
            dispatch(setBookingFlowType('hospital'));
            dispatch(setHospitalId(hospitalId));

            // Fetch hospital data using Redux thunk
            dispatch(getHospitalByIdAsync(hospitalId))
                .unwrap()
                .catch((error) => {
                    console.error('Error fetching hospital:', error);
                    toast.error('Không thể tải thông tin bệnh viện');
                });
        } else if (isDoctorBooking) {
            dispatch(setBookingFlowType('doctor'));
        } else if (isServiceMedicalBooking) {
            dispatch(setBookingFlowType('service'));
        }
    }, [isHospitalBooking, isDoctorBooking, isServiceMedicalBooking, hospitalId, dispatch]);

    // Get appointmentType from URL params and set it in Redux (only for non-hospital booking)
    useEffect(() => {
        if (!isHospitalBooking) {
            const appointmentTypeParam = searchParams.get('appointmentType');
            if (appointmentTypeParam === 'TELEHEALTH') {
                dispatch(setAppointmentType(AppointmentType.TELEHEALTH));
            } else {
                // Default to IN_PERSON if no parameter or invalid parameter
                dispatch(setAppointmentType(AppointmentType.IN_PERSON));
            }
        }
    }, [searchParams, dispatch, isHospitalBooking]);

    // Pre-select specialty or service from URL params (for hospital booking)
    // This allows navigation from HospitalProfile page with pre-selected item
    useEffect(() => {
        if (isHospitalBooking) {
            const specialtyIdParam = searchParams.get('specialtyId');
            const serviceIdParam = searchParams.get('serviceId');

            if (specialtyIdParam) {
                dispatch(setSelectedSpecialtyId(specialtyIdParam));
            } else if (serviceIdParam) {
                dispatch(setSelectedServiceMedicalId(serviceIdParam));
            }
        }
    }, [searchParams, dispatch, isHospitalBooking]);

    // Get the step where authentication check should happen
    const getAuthCheckStep = useCallback(() => {
        // For hospital booking: check at step 3 (DateTime)
        // For doctor/service booking: check at step 1 (DateTime)
        return isHospitalBooking ? 3 : 1;
    }, [isHospitalBooking]);

    const nextStep = async () => {
        const authCheckStep = getAuthCheckStep();

        // Check authentication and phone confirmation at the appropriate step
        if (currentStep === authCheckStep) {
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

    // Helper function to get consultation fee based on appointment type
    const getConsultationFee = (): number | undefined => {
        // Hospital booking flow
        if (isHospitalBooking) {
            const appointmentType = bookingState.appointmentType || AppointmentType.IN_PERSON;
            const serviceTypeName =
                appointmentType === AppointmentType.IN_PERSON
                    ? 'Khám trực tiếp'
                    : 'Tư vấn trực tuyến';

            // If doctor is selected, get price from doctor
            if (bookingState.selectedDoctorId && doctorState.selectedDoctor?.prices) {
                const price = doctorState.selectedDoctor.prices.find(
                    (p) => p.serviceTypeName === serviceTypeName
                );
                return price?.amount;
            }

            // If service is selected (no doctor), get price from hospital's service
            if (bookingState.selectedServiceMedicalId && hospitalData) {
                const service = hospitalData.serviceMedicals?.find(
                    (s) => s.id === bookingState.selectedServiceMedicalId
                );
                return service?.price;
            }

            return undefined;
        }

        // Direct doctor booking
        if (isDoctorBooking && doctorState.selectedDoctor?.prices) {
            const appointmentType = bookingState.appointmentType || AppointmentType.IN_PERSON;
            const serviceTypeName =
                appointmentType === AppointmentType.IN_PERSON
                    ? 'Khám trực tiếp'
                    : 'Tư vấn trực tuyến';
            const price = doctorState.selectedDoctor.prices.find(
                (p) => p.serviceTypeName === serviceTypeName
            );
            return price?.amount;
        }

        // Direct service medical booking
        if (isServiceMedicalBooking && serviceMedicalState?.price) {
            return serviceMedicalState.price;
        }

        return undefined;
    };

    // Helper function to create appointment request from schedule
    const createAppointmentFromSchedule = () => {
        if (!scheduleState.selectedSlots[0] || !userState.profile || !scheduleState.selectedDate) {
            return null;
        }

        const firstSlot = scheduleState.selectedSlots[0];
        const appointmentTimeId = createAppointmentTimeId(firstSlot);

        // Get the original consultation/service fee at booking time
        const amount = getConsultationFee();

        // Base appointment request
        const baseRequest = {
            patientId: userState.profile.id,
            patientAccountId: userState.profile.accountId,
            appointmentDate: scheduleState.selectedDate,
            appointmentTimeId,
            appointmentType: bookingState.appointmentType || AppointmentType.IN_PERSON,
            symptoms: bookingState.symptoms,
            attachmentUrls: bookingState.attachmentUrls,
            amount, // Include original fee for statistics
            // Include relativeId if booking for a relative
            ...(bookingState.isBookingForRelative &&
                bookingState.relativeId && {
                    relativeId: bookingState.relativeId,
                }),
        };

        // For doctor booking
        if (isDoctorBooking && doctorId) {
            return createAppointmentRequest({
                ...baseRequest,
                doctorId: doctorId,
                specialtyId: doctorState.selectedDoctor?.specialtyId,
                hospitalId: doctorState.selectedDoctor?.hospital?.id,
            });
        }

        // For service medical booking
        if (isServiceMedicalBooking && serviceMedicalId) {
            return createAppointmentRequest({
                ...baseRequest,
                serviceId: serviceMedicalId,
                hospitalId: serviceMedicalState?.hospital?.id,
            });
        }

        // For hospital booking
        if (isHospitalBooking && hospitalId) {
            return createAppointmentRequest({
                ...baseRequest,
                hospitalId: hospitalId,
                // Include specialty or service based on user selection
                specialtyId: bookingState.selectedSpecialtyId || undefined,
                serviceId: bookingState.selectedServiceMedicalId || undefined,
                // Include doctor if user selected one
                doctorId: bookingState.selectedDoctorId || undefined,
            });
        }

        return null;
    };

    // Helper function to ensure appointment is created and return appointmentId
    const ensureAppointmentCreated = async (skipPayment: boolean = false): Promise<string> => {
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

        // Add skipPayment flag for no-payment option
        const finalRequest = { ...request, skipPayment };

        const response = await AppointmentService.createAppointment(finalRequest);

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
            // Get hospitalId based on booking type
            let paymentHospitalId: string | undefined;
            if (isHospitalBooking) {
                paymentHospitalId = hospitalId;
            } else if (isServiceMedicalBooking) {
                paymentHospitalId = serviceMedicalState?.hospital?.id;
            } else {
                paymentHospitalId = doctorState.selectedDoctor?.hospital?.id;
            }

            const paymentRequest: CreatePaymentRequest = {
                appointmentId,
                patientId: userState.profile.id,
                hospitalId: paymentHospitalId,
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
            // Pass skipPayment = true to send booking confirmation email immediately
            const appointmentId = await ensureAppointmentCreated(true);
            toast.success('Đặt lịch thành công! Vui lòng thanh toán khi đến khám.');
            navigate(PATHS.BOOKING.CONFIRMATION.replace(':appointmentId', appointmentId));
        } catch (error: any) {
            console.error('Create appointment failed:', error);
            toast.error(error.message || 'Không thể tạo lịch hẹn');
            setIsCreatingAppointment(false);
        }
    };

    const prevStep = () => {
        if (currentStep === 1) {
            // Navigate back to previous page based on booking type
            navigate(-1); // Go back to the previous page in history
        } else {
            setCurrentStep((prev) => prev - 1);
        }
    };

    if (currentStep < 1 || currentStep > totalSteps) {
        // Navigate based on booking type
        if (isServiceMedicalBooking || isHospitalBooking) {
            navigate(-1); // Go back to previous page
        } else {
            navigate(PATHS.DOCTOR.ROOT);
        }
    }

    // Render sections based on booking type
    const renderSections = () => {
        if (isHospitalBooking) {
            // Hospital booking flow: 5 steps
            return (
                <>
                    {currentStep === 1 && (
                        <SpecialtyServiceSection
                            nextStep={nextStep}
                            prevStep={prevStep}
                            hospitalData={hospitalData}
                            isLoading={isLoadingHospital}
                        />
                    )}
                    {currentStep === 2 && (
                        <AppointmentTypeSection
                            nextStep={nextStep}
                            prevStep={prevStep}
                            hospitalData={hospitalData}
                        />
                    )}
                    {currentStep === 3 && (
                        <DateTimeSection
                            nextStep={nextStep}
                            prevStep={prevStep}
                            hospitalId={hospitalId}
                        />
                    )}
                    {currentStep === 4 && (
                        <BasicInfoSection nextStep={nextStep} prevStep={prevStep} />
                    )}
                    {currentStep === 5 && (
                        <PaymentSection
                            nextStep={nextStep}
                            prevStep={prevStep}
                            isCreatingAppointment={isCreatingAppointment}
                            onCreateAppointmentAndPayment={handleCreateAppointmentAndPayment}
                            onCreateAppointmentOnly={handleCreateAppointmentOnly}
                            isProcessingPayment={isProcessingPayment}
                        />
                    )}
                </>
            );
        }

        // Doctor/Service booking flow: 3 steps
        return (
            <>
                {currentStep === 1 && (
                    <DateTimeSection
                        nextStep={nextStep}
                        prevStep={prevStep}
                        doctorId={doctorId}
                        serviceMedicalId={serviceMedicalId}
                    />
                )}
                {currentStep === 2 && <BasicInfoSection nextStep={nextStep} prevStep={prevStep} />}
                {currentStep === 3 && (
                    <PaymentSection
                        nextStep={nextStep}
                        prevStep={prevStep}
                        isCreatingAppointment={isCreatingAppointment}
                        onCreateAppointmentAndPayment={handleCreateAppointmentAndPayment}
                        onCreateAppointmentOnly={handleCreateAppointmentOnly}
                        isProcessingPayment={isProcessingPayment}
                    />
                )}
            </>
        );
    };

    // Determine which steps to show in wizard (exclude confirmation step)
    const stepsToShow = isHospitalBooking ? totalSteps : totalSteps - 1;

    return (
        <BookingLayout>
            <div className={clsx(styles.bookingContainer, 'doctor-content')}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            {currentStep <= stepsToShow && (
                                <StepWizard steps={currentSteps} currentStep={currentStep} />
                            )}
                            <div className="booking-widget multistep-form">{renderSections()}</div>
                        </div>
                    </div>
                </div>
            </div>
        </BookingLayout>
    );
};

export default Booking;
