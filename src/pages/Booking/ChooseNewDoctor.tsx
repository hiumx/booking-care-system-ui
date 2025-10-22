import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BookingLayout from '@/layouts/BookingLayout';
import DateTimeSection from './sections/DateTimeSection';
import PaymentSection from './sections/PaymentSection';
import StepWizard from '@/components/StepWizard';
import { AppointmentService } from '@/services/appointment.service';
import PaymentService from '@/services/payment.service';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { PATHS, replacePathParams } from '@/routes/paths';
import styles from './Booking.module.scss';
import clsx from 'clsx';
import BookingLoadingSpinner from '@/components/BookingLoadingSpinner';
import { getDoctorByIdAsync } from '@/store/slices/doctorSlice';
import { getAppointmentDateTime } from '@/utils/appointment-utils';

/**
 * ChooseNewDoctor Page - Option 3
 * Patient chooses a new doctor from same hospital + specialty
 * Handles 3 scenarios:
 * 1. Same price or no payment → Update directly
 * 2. Higher price → Payment for difference
 * 3. Lower price → Refund excess amount
 */
// Helper function to get alert class based on price difference type
const getPriceAlertClass = (type: string): string => {
    switch (type) {
        case 'equal':
            return 'alert-info';
        case 'higher':
            return 'alert-warning';
        default:
            return 'alert-success';
    }
};

// Helper function to get icon class based on price difference type
const getPriceIconClass = (type: string): string => {
    switch (type) {
        case 'equal':
            return 'ti-info-circle';
        case 'higher':
            return 'ti-alert-circle';
        default:
            return 'ti-check-circle';
    }
};

const ChooseNewDoctor: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [originalAppointment, setOriginalAppointment] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [priceDifference, setPriceDifference] = useState<{
        type: 'none' | 'equal' | 'higher' | 'lower';
        amount: number;
    } | null>(null);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { doctorId } = useParams<{ doctorId: string }>();
    const [searchParams] = useSearchParams();

    const scheduleState = useAppSelector((state) => state.schedule);
    const doctorState = useAppSelector((state) => state.doctor);
    const userState = useAppSelector((state) => state.user);

    const rescheduleAppointmentId = searchParams.get('rescheduleFor');
    const rescheduleToken = searchParams.get('token');
    const rescheduleSpecialtyId = searchParams.get('rescheduleSpecialtyId');
    const rescheduleHospitalId = searchParams.get('rescheduleHospitalId');
    const skipDateTime = searchParams.get('skipDateTime') === 'true'; // From Option 2 (hospital assigned)
    const isStaffAssigned = searchParams.get('isStaffAssigned') === 'true'; // True = ConfirmNewDoctor, False = UpdateAppointment
    const newDoctorIdParam = searchParams.get('newDoctorId'); // For staff-assigned flow

    useEffect(() => {
        if (!rescheduleAppointmentId || !rescheduleToken || !doctorId) {
            toast.error('Thông tin không hợp lệ');
            navigate(PATHS.HOME);
            return;
        }

        loadOriginalAppointment();

        // If newDoctorIdParam is provided (from staff-assigned flow), use it
        // Otherwise use doctorId from URL param (patient-chosen flow)
        const doctorToLoad = newDoctorIdParam || doctorId;
        loadNewDoctorInfo(doctorToLoad);
    }, [rescheduleAppointmentId, doctorId, newDoctorIdParam]);

    const loadOriginalAppointment = async () => {
        if (!rescheduleAppointmentId) return;

        try {
            setIsLoading(true);
            const response = await AppointmentService.getAppointmentById(rescheduleAppointmentId);

            if (response.success && response.data) {
                setOriginalAppointment(response.data);
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

    const loadNewDoctorInfo = async (doctorIdToLoad: string) => {
        if (!doctorIdToLoad) return;

        try {
            await dispatch(getDoctorByIdAsync(doctorIdToLoad)).unwrap();
        } catch (error) {
            console.error('Error loading doctor:', error);
        }
    };

    // Calculate price difference when doctor and appointment are loaded
    useEffect(() => {
        if (originalAppointment && doctorState.selectedDoctor) {
            calculatePriceDifference();

            // If skipDateTime=true (from Option 2), auto-proceed to payment/action
            if (skipDateTime) {
                setCurrentStep(2); // Skip DateTimeSection, go straight to price comparison
            }
        }
    }, [originalAppointment, doctorState.selectedDoctor, skipDateTime]);

    const calculatePriceDifference = () => {
        const originalPrice = originalAppointment?.consultationFees || 0;
        const newDoctorFullPrice = doctorState.selectedDoctor?.prices?.[0]?.amount || 0;

        // Business rule: newPrice is 30% deposit of the full price
        const newPrice = newDoctorFullPrice * 0.3;
        // If original appointment has no payment (originalPrice = 0), treat as equal
        if (originalPrice === 0) {
            setPriceDifference({ type: 'none', amount: 0 });
        } else if (newPrice === originalPrice) {
            setPriceDifference({ type: 'equal', amount: 0 });
        } else if (newPrice > originalPrice) {
            setPriceDifference({ type: 'higher', amount: newPrice - originalPrice });
        } else {
            setPriceDifference({ type: 'lower', amount: originalPrice - newPrice });
        }
    };

    const handleNextStep = async () => {
        if (!scheduleState.selectedDate || scheduleState.selectedSlots.length === 0) {
            toast.error('Vui lòng chọn ngày và giờ khám');
            return;
        }

        // Scenario 1: Same price or no payment → Update directly
        if (priceDifference?.type === 'equal') {
            await handleDirectUpdate();
            return;
        }

        // Scenario 2: Higher price → Go to payment
        if (priceDifference?.type === 'higher') {
            setCurrentStep(2); // Go to payment section
        }
        // Scenario 3: Lower price → Request refund
        else if (priceDifference?.type === 'lower') {
            await handleRefundRequest();
        }
    };

    // Helper function to call chooseNewDoctor API
    const callChooseNewDoctorAPI = async (
        newAppointmentDate: string,
        newAppointmentTimeId: string
    ) => {
        const doctorPriceId = doctorState.selectedDoctor?.prices?.[0]?.id || '';

        return await AppointmentService.chooseNewDoctor({
            appointmentId: rescheduleAppointmentId || '',
            rescheduleToken: rescheduleToken || '',
            newDoctorId: doctorId || '',
            newAppointmentDate,
            newAppointmentTimeId,
            doctorPriceId,
            isStaffAssigned,
        });
    };

    const handleDirectUpdate = async () => {
        if (!rescheduleAppointmentId || !rescheduleToken || !doctorId) {
            toast.error('Thông tin không hợp lệ');
            return;
        }

        // Get date/time from original appointment if skipDateTime, otherwise from schedule state
        const dateTime = getAppointmentDateTime(skipDateTime, originalAppointment, scheduleState);

        if (!dateTime) {
            toast.error('Vui lòng chọn ngày và giờ khám');
            return;
        }

        const { appointmentDate: newAppointmentDate, appointmentTimeId: newAppointmentTimeId } =
            dateTime;

        setIsProcessing(true);

        try {
            const response = await callChooseNewDoctorAPI(newAppointmentDate, newAppointmentTimeId);

            if (response.success && response.data) {
                toast.success(response.data.message);
                navigate(
                    PATHS.BOOKING.CONFIRMATION.replace(':appointmentId', rescheduleAppointmentId)
                );
            } else {
                throw new Error(response.message || 'Không thể cập nhật lịch hẹn');
            }
        } catch (error: any) {
            console.error('Error updating appointment:', error);
            toast.error(error.message || 'Không thể cập nhật lịch hẹn');
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePaymentForDifference = async (paymentMethodId: string) => {
        if (
            !rescheduleAppointmentId ||
            !rescheduleToken ||
            !priceDifference ||
            !userState.profile?.id ||
            !doctorId
        ) {
            toast.error('Thông tin không hợp lệ');
            return;
        }

        // Get date/time from original appointment if skipDateTime, otherwise from schedule state
        const dateTime = getAppointmentDateTime(skipDateTime, originalAppointment, scheduleState);

        if (!dateTime) {
            toast.error('Vui lòng chọn ngày và giờ khám');
            return;
        }

        const { appointmentDate: newAppointmentDate, appointmentTimeId: newAppointmentTimeId } =
            dateTime;

        setIsProcessing(true);

        try {
            // Step 1: Call backend to update appointment with new doctor first
            const doctorPriceId = doctorState.selectedDoctor?.prices?.[0]?.id || '';

            const chooseResponse = await AppointmentService.chooseNewDoctor({
                appointmentId: rescheduleAppointmentId,
                rescheduleToken,
                newDoctorId: doctorId,
                newAppointmentDate,
                newAppointmentTimeId,
                doctorPriceId,
                isStaffAssigned, // Tell backend to use ConfirmNewDoctor or UpdateAppointment
            });

            if (chooseResponse.success && chooseResponse.data?.action === 'payment_required') {
                // Step 2: Create supplementary payment for the difference
                const supplementaryPaymentRequest = {
                    appointmentId: rescheduleAppointmentId,
                    patientId: userState.profile.id,
                    additionalAmount: priceDifference.amount,
                    paymentMethodId: paymentMethodId,
                    rescheduleToken: rescheduleToken,
                    reason: 'Price difference payment for doctor change',
                    isStaffAssigned: isStaffAssigned, // Pass to payment service for callback handling
                };

                const paymentResponse = await PaymentService.createSupplementaryPayment(
                    supplementaryPaymentRequest
                );

                // Step 3: Redirect to payment gateway
                if (paymentResponse.paymentUrl) {
                    toast.success('Đang chuyển hướng đến cổng thanh toán...');
                    setTimeout(() => {
                        globalThis.location.href = paymentResponse.paymentUrl;
                    }, 1000);
                } else {
                    throw new Error('Không nhận được URL thanh toán');
                }
            } else {
                throw new Error(chooseResponse.message || 'Không thể cập nhật lịch hẹn');
            }
        } catch (error: any) {
            console.error('Error processing payment:', error);
            toast.error(error.message || 'Không thể xử lý thanh toán');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRefundRequest = async () => {
        if (!rescheduleAppointmentId || !rescheduleToken || !priceDifference || !doctorId) {
            toast.error('Thông tin không hợp lệ');
            return;
        }

        // Get date/time from original appointment if skipDateTime, otherwise from schedule state
        const dateTime = getAppointmentDateTime(skipDateTime, originalAppointment, scheduleState);

        if (!dateTime) {
            toast.error('Vui lòng chọn ngày và giờ khám');
            return;
        }

        const { appointmentDate: newAppointmentDate, appointmentTimeId: newAppointmentTimeId } =
            dateTime;

        setIsProcessing(true);

        try {
            const response = await callChooseNewDoctorAPI(newAppointmentDate, newAppointmentTimeId);

            if (response.success && response.data) {
                toast.success(response.data.message);
                if (response.data.action === 'refund_created') {
                    toast.info(
                        `Số tiền hoàn lại: ${response.data.priceDifference.toLocaleString('vi-VN')} đ`
                    );
                }
                navigate(
                    PATHS.BOOKING.CONFIRMATION.replace(':appointmentId', rescheduleAppointmentId)
                );
            } else {
                throw new Error(response.message || 'Không thể xử lý yêu cầu');
            }
        } catch (error: any) {
            console.error('Error requesting refund:', error);
            toast.error(error.message || 'Không thể xử lý yêu cầu hoàn tiền');
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePrevStep = () => {
        if (currentStep === 1) {
            // If staff-assigned (Option 2), go back to ConfirmNewDoctor
            if (isStaffAssigned && rescheduleAppointmentId && rescheduleToken && newDoctorIdParam) {
                navigate(
                    `${PATHS.BOOKING.CONFIRM_NEW_DOCTOR.replace(':appointmentId', rescheduleAppointmentId)}?token=${rescheduleToken}&newDoctorId=${newDoctorIdParam}`
                );
            } else if (
                rescheduleHospitalId &&
                rescheduleSpecialtyId &&
                rescheduleAppointmentId &&
                rescheduleToken
            ) {
                // If patient-chosen (Option 3), go back to DoctorList with filters
                navigate(
                    `${PATHS.DOCTOR.ROOT}?hospitalId=${rescheduleHospitalId}&specialtyId=${rescheduleSpecialtyId}&rescheduleFor=${rescheduleAppointmentId}&token=${rescheduleToken}`
                );
            } else {
                // Fallback to doctor list
                navigate(PATHS.DOCTOR.ROOT);
            }
        } else if (currentStep === 2) {
            // From PaymentSection
            if (isStaffAssigned && rescheduleAppointmentId && rescheduleToken && newDoctorIdParam) {
                // Staff-assigned: go back to ConfirmNewDoctor (skip DateTimeSection)
                navigate(
                    `${PATHS.BOOKING.CONFIRM_NEW_DOCTOR.replace(':appointmentId', rescheduleAppointmentId)}?token=${rescheduleToken}&newDoctorId=${newDoctorIdParam}`
                );
            } else {
                // Patient-chosen: go back to step 1 (DateTimeSection)
                navigate(
                    `${replacePathParams(PATHS.BOOKING.CHOOSE_NEW_DOCTOR, { doctorId: doctorId! })}?rescheduleFor=${rescheduleAppointmentId}&token=${rescheduleToken}&rescheduleSpecialtyId=${rescheduleSpecialtyId}&rescheduleHospitalId=${rescheduleHospitalId}`
                );
            }
        }
    };

    if (isLoading) {
        return <BookingLoadingSpinner />;
    }

    return (
        <BookingLayout>
            <div className={clsx(styles.bookingContainer, 'doctor-content')}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            {/* Show price difference info */}
                            {priceDifference && (
                                <>
                                    <div className="alert alert-light mb-3">
                                        <i className="ti ti-info-circle me-2"></i>
                                        <strong>Lưu ý:</strong> Bạn chỉ cần thanh toán cọc 30% giá
                                        khám. Số tiền còn lại sẽ được thanh toán khi hoàn thành
                                        khám.
                                    </div>
                                    <div
                                        className={`alert ${getPriceAlertClass(priceDifference.type)} mb-4`}
                                    >
                                        <i
                                            className={`ti ${getPriceIconClass(priceDifference.type)} me-2`}
                                            aria-hidden="true"
                                        ></i>
                                        {priceDifference.type === 'equal' &&
                                            'Cọc khám giống nhau, bạn không cần thanh toán thêm'}
                                        {priceDifference.type === 'higher' &&
                                            `Bác sĩ mới có cọc cao hơn ${priceDifference.amount.toLocaleString('vi-VN')} đ, bạn cần thanh toán thêm`}
                                        {priceDifference.type === 'lower' &&
                                            `Bác sĩ mới có cọc thấp hơn ${priceDifference.amount.toLocaleString('vi-VN')} đ, hệ thống sẽ hoàn tiền cho bạn`}
                                    </div>
                                </>
                            )}

                            <StepWizard
                                steps={
                                    priceDifference?.type === 'higher'
                                        ? [
                                              { id: 1, title: 'Ngày & Giờ' },
                                              { id: 2, title: 'Thanh Toán' },
                                          ]
                                        : [{ id: 1, title: 'Ngày & Giờ' }]
                                }
                                currentStep={currentStep}
                            />

                            <div className="booking-widget multistep-form">
                                {currentStep === 1 && (
                                    <DateTimeSection
                                        nextStep={handleNextStep}
                                        prevStep={handlePrevStep}
                                        doctorId={doctorId}
                                        isRescheduleMode={true}
                                    />
                                )}
                                {currentStep === 2 && priceDifference?.type === 'higher' && (
                                    <PaymentSection
                                        nextStep={() => {}}
                                        prevStep={handlePrevStep}
                                        isCreatingAppointment={false}
                                        onCreateAppointmentAndPayment={async (
                                            paymentMethodId,
                                            _depositAmount
                                        ) => {
                                            await handlePaymentForDifference(paymentMethodId);
                                        }}
                                        isProcessingPayment={isProcessing}
                                        isSupplementaryPayment={true}
                                        supplementaryAmount={priceDifference.amount}
                                        rescheduleAppointmentDate={
                                            skipDateTime && originalAppointment
                                                ? originalAppointment.appointmentDate
                                                : undefined
                                        }
                                        rescheduleAppointmentTimeId={
                                            skipDateTime && originalAppointment
                                                ? originalAppointment.appointmentTimeId
                                                : undefined
                                        }
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

export default ChooseNewDoctor;
