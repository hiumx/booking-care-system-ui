import React, { useEffect, useState } from 'react';
import { Stethoscope } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { toast } from 'react-toastify';
import AppointmentService from '@/services/appointment.service';
import { AppointmentType } from '@/enums/appointment.enums';
import { createAppointmentRequest, createAppointmentTimeId } from '@/utils/appointment-utils';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import TypingIndicator from '../TypingIndicator';
import typingStyles from '../TypingIndicator/TypingIndicator.module.scss';
import DateTimeSection from '@/pages/Booking/sections/DateTimeSection';
import BasicInfoSection from '@/pages/Booking/sections/BasicInfoSection';
import PaymentSection from '@/pages/Booking/sections/PaymentSection';
import PaymentService, { CreatePaymentRequest } from '@/services/payment.service';
import { setCreatedAppointmentId } from '@/store/slices/bookingSlice';
import styles from '../../ChatArea.module.scss';

interface MiniBookingInlineProps {
    doctorId: string;
    onClose: () => void;
}

const MiniBookingInline: React.FC<MiniBookingInlineProps> = ({ doctorId, onClose }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { profile } = useSelector((state: RootState) => state.user);
    const userState = useSelector((state: RootState) => state.user);
    const doctorState = useSelector((state: RootState) => state.doctor);
    const scheduleState = useSelector((state: RootState) => state.schedule);

    type Step = 'datetime' | 'basic' | 'payment';

    const [currentStep, setCurrentStep] = useState<Step>('datetime');
    const [isGuideTyping, setIsGuideTyping] = useState(true);
    const [guideText, setGuideText] = useState<string>('Mời bạn chọn ngày và khung giờ phù hợp');
    const [showStep, setShowStep] = useState(false);

    // Build AI guide text per step
    const getGuideText = (step: Step): string => {
        if (step === 'datetime') return 'Mời bạn chọn ngày và khung giờ phù hợp';
        if (step === 'basic') return 'Vui lòng xác nhận thông tin người khám';
        return 'Chọn phương thức thanh toán để hoàn tất đặt lịch';
    };

    useEffect(() => {
        setIsGuideTyping(true);
        setShowStep(false);
        const text = getGuideText(currentStep);
        setGuideText(text);
        const t = setTimeout(() => {
            setIsGuideTyping(false);
            setShowStep(true);
        }, 2000);
        return () => clearTimeout(t);
    }, [currentStep]);

    const handleContinueFromDateTime = () => {
        if (!scheduleState.selectedDate || scheduleState.selectedSlots.length === 0) {
            toast.warn('Vui lòng chọn khung giờ');
            return;
        }
        setCurrentStep('basic');
    };

    const handleContinueFromBasic = () => {
        setCurrentStep('payment');
    };

    const ensureAppointmentCreated = async (skipPayment: boolean) => {
        if (!profile?.id) throw new Error('Vui lòng đăng nhập');
        if (!doctorId) throw new Error('Thiếu thông tin bác sĩ');
        if (!scheduleState.selectedDate || scheduleState.selectedSlots.length === 0)
            throw new Error('Vui lòng chọn ngày và khung giờ');

        const firstSlot = scheduleState.selectedSlots[0];
        const appointmentTimeId = createAppointmentTimeId({
            startTime: firstSlot.startTime,
            endTime: firstSlot.endTime,
        });
        const request = createAppointmentRequest({
            patientId: profile.id,
            doctorId: doctorId,
            specialtyId: doctorState.selectedDoctor?.specialtyId,
            appointmentDate: scheduleState.selectedDate,
            appointmentTimeId,
            hospitalId: doctorState.selectedDoctor?.hospital?.id,
            appointmentType: AppointmentType.IN_PERSON,
            symptoms: '',
            attachmentUrls: [],
        });
        const response = await AppointmentService.createAppointment({
            ...request,
            skipPayment,
        });
        // API returns appointmentId in data, but type definition says void
        const appointmentId = (response.data as unknown as { appointmentId?: string })
            ?.appointmentId;
        if (!appointmentId) throw new Error('Không nhận được ID lịch hẹn');
        dispatch(setCreatedAppointmentId(appointmentId));
        return appointmentId;
    };

    // Helpers to reuse Booking sections
    const getStepTitle = (step: Step): string => {
        if (step === 'datetime') return 'Chọn ngày và giờ';
        if (step === 'basic') return 'Xác nhận thông tin người khám';
        return 'Thanh toán';
    };

    const nextStep = () => {
        if (currentStep === 'datetime') handleContinueFromDateTime();
        else if (currentStep === 'basic') handleContinueFromBasic();
    };
    const prevStep = () => {
        if (currentStep === 'payment') setCurrentStep('basic');
        else if (currentStep === 'basic') setCurrentStep('datetime');
    };

    const renderStepContent = () => {
        if (currentStep === 'datetime') {
            return (
                <DateTimeSection
                    nextStep={nextStep}
                    prevStep={prevStep}
                    doctorId={doctorId}
                    hidePrev={true}
                />
            );
        }
        if (currentStep === 'basic') {
            return <BasicInfoSection nextStep={nextStep} prevStep={prevStep} />;
        }
        return (
            <PaymentSection
                nextStep={nextStep}
                prevStep={prevStep}
                isCreatingAppointment={false}
                onCreateAppointmentAndPayment={async (
                    paymentMethodId: string,
                    depositAmount: number
                ) => {
                    try {
                        const appointmentId = await ensureAppointmentCreated(false);
                        const paymentRequest: CreatePaymentRequest = {
                            appointmentId,
                            patientId: userState.profile!.id,
                            hospitalId: doctorState.selectedDoctor?.hospital?.id,
                            amount: depositAmount,
                            paymentMethodId,
                        };
                        const paymentResponse =
                            await PaymentService.createAppointmentPayment(paymentRequest);
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
                    }
                }}
                onCreateAppointmentOnly={async () => {
                    try {
                        const appointmentId = await ensureAppointmentCreated(true);
                        toast.success('Đặt lịch thành công!');
                        onClose();
                        navigate(
                            PATHS.BOOKING.CONFIRMATION.replace(':appointmentId', appointmentId)
                        );
                    } catch (error: any) {
                        console.error('Create appointment failed:', error);
                        toast.error(error.message || 'Không thể tạo lịch hẹn');
                    }
                }}
                isProcessingPayment={false}
            />
        );
    };

    return (
        <>
            <div className={styles.messageWrapper}>
                <div className={styles.aiMessageBubble}>
                    <div className={styles.aiAvatarSmall} style={{ width: 36, height: 36 }}>
                        <Stethoscope size={20} />
                    </div>
                    {isGuideTyping ? (
                        <TypingIndicator />
                    ) : (
                        <div className={typingStyles.typingIndicator}>{guideText}</div>
                    )}
                </div>
            </div>

            {showStep && (
                <div className="mt-3">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="d-flex align-items-center gap-2">
                                    <strong>{getStepTitle(currentStep)}</strong>
                                </div>
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={onClose}
                                >
                                    Đóng
                                </button>
                            </div>

                            {renderStepContent()}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MiniBookingInline;
