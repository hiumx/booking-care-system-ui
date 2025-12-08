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
import SpecialtyServiceSection from '@/pages/Booking/sections/SpecialtyServiceSection';
import AppointmentTypeSection from '@/pages/Booking/sections/AppointmentTypeSection';
import PaymentService, { CreatePaymentRequest } from '@/services/payment.service';
import {
    setAppointmentType,
    setCreatedAppointmentId,
    setBookingFlowType,
    setHospitalId,
} from '@/store/slices/bookingSlice';
import { getHospitalByIdAsync } from '@/store/slices/hospitalSlice';
import styles from '../../ChatArea.module.scss';

// Booking flow type for mini booking
type MiniBookingFlowType = 'doctor' | 'hospital';

interface MiniBookingInlineProps {
    doctorId?: string;
    hospitalId?: string;
    onClose: () => void;
    appointmentType?: AppointmentType;
}

const MiniBookingInline: React.FC<MiniBookingInlineProps> = ({
    doctorId,
    hospitalId,
    onClose,
    appointmentType = AppointmentType.IN_PERSON,
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { profile } = useSelector((state: RootState) => state.user);
    const userState = useSelector((state: RootState) => state.user);
    const doctorState = useSelector((state: RootState) => state.doctor);
    const scheduleState = useSelector((state: RootState) => state.schedule);
    const bookingState = useSelector((state: RootState) => state.booking);
    const hospitalState = useSelector((state: RootState) => state.hospital);
    const hospitalData = hospitalState.selectedHospital;
    const isLoadingHospital = hospitalState.isLoading;

    // Determine booking flow type
    const flowType: MiniBookingFlowType = hospitalId ? 'hospital' : 'doctor';
    const isHospitalBooking = flowType === 'hospital';

    // Steps for different flows
    type DoctorStep = 'datetime' | 'basic' | 'payment';
    type HospitalStep = 'specialty' | 'appointmentType' | 'datetime' | 'basic' | 'payment';
    type Step = DoctorStep | HospitalStep;

    const [currentStep, setCurrentStep] = useState<Step>(
        isHospitalBooking ? 'specialty' : 'datetime'
    );
    const [isGuideTyping, setIsGuideTyping] = useState(true);
    const [guideText, setGuideText] = useState<string>(
        isHospitalBooking
            ? 'Mời bạn chọn chuyên khoa hoặc dịch vụ'
            : 'Mời bạn chọn ngày và khung giờ phù hợp'
    );
    const [showStep, setShowStep] = useState(false);

    // Initialize booking flow
    useEffect(() => {
        dispatch(setAppointmentType(appointmentType));

        if (isHospitalBooking && hospitalId) {
            dispatch(setBookingFlowType('hospital'));
            dispatch(setHospitalId(hospitalId));
            // Fetch hospital data
            dispatch(getHospitalByIdAsync(hospitalId) as any)
                .unwrap()
                .catch((error: any) => {
                    console.error('Error fetching hospital:', error);
                    toast.error('Không thể tải thông tin bệnh viện');
                });
        } else if (doctorId) {
            dispatch(setBookingFlowType('doctor'));
        }

        return () => {
            dispatch(setAppointmentType(AppointmentType.IN_PERSON));
        };
    }, [appointmentType, dispatch, isHospitalBooking, hospitalId, doctorId]);

    // Build AI guide text per step
    const getGuideText = (step: Step): string => {
        if (step === 'specialty') return 'Mời bạn chọn chuyên khoa hoặc dịch vụ';
        if (step === 'appointmentType') return 'Chọn hình thức khám và bác sĩ (nếu có)';
        if (step === 'datetime') return 'Mời bạn chọn ngày và khung giờ phù hợp';
        if (step === 'basic') return 'Vui lòng xác nhận thông tin người khám';
        return 'Chọn phương thức thanh toán để hoàn tất đặt lịch';
    };

    // Helper function to get consultation fee based on appointment type
    const getConsultationFee = (): number | undefined => {
        // Hospital booking flow
        if (isHospitalBooking) {
            const currentAppointmentType =
                bookingState.appointmentType || AppointmentType.IN_PERSON;
            const serviceTypeName =
                currentAppointmentType === AppointmentType.IN_PERSON
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
        if (doctorId && doctorState.selectedDoctor?.prices) {
            const currentAppointmentType =
                bookingState.appointmentType || AppointmentType.IN_PERSON;
            const serviceTypeName =
                currentAppointmentType === AppointmentType.IN_PERSON
                    ? 'Khám trực tiếp'
                    : 'Tư vấn trực tuyến';
            const price = doctorState.selectedDoctor.prices.find(
                (p) => p.serviceTypeName === serviceTypeName
            );
            return price?.amount;
        }

        return undefined;
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

    // Hospital flow step handlers
    const handleContinueFromSpecialty = () => {
        if (!bookingState.selectedSpecialtyId && !bookingState.selectedServiceMedicalId) {
            toast.warn('Vui lòng chọn chuyên khoa hoặc dịch vụ');
            return;
        }
        setCurrentStep('appointmentType');
    };

    const handleContinueFromAppointmentType = () => {
        setCurrentStep('datetime');
    };

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
        if (!isHospitalBooking && !doctorId) throw new Error('Thiếu thông tin bác sĩ');
        if (isHospitalBooking && !hospitalId) throw new Error('Thiếu thông tin bệnh viện');
        if (!scheduleState.selectedDate || scheduleState.selectedSlots.length === 0)
            throw new Error('Vui lòng chọn ngày và khung giờ');

        const firstSlot = scheduleState.selectedSlots[0];
        const appointmentTimeId = createAppointmentTimeId({
            startTime: firstSlot.startTime,
            endTime: firstSlot.endTime,
        });

        // Get consultation fee
        const amount = getConsultationFee();

        // Base request params
        const baseParams = {
            patientId: profile.id,
            patientAccountId: profile.accountId,
            appointmentDate: scheduleState.selectedDate,
            appointmentTimeId,
            appointmentType: bookingState.appointmentType || appointmentType,
            symptoms: bookingState.symptoms || '',
            attachmentUrls: bookingState.attachmentUrls || [],
            amount,
            // Include relativeId if booking for a relative
            ...(bookingState.isBookingForRelative &&
                bookingState.relativeId && {
                    relativeId: bookingState.relativeId,
                }),
        };

        let request;

        if (isHospitalBooking) {
            // Hospital booking flow
            request = createAppointmentRequest({
                ...baseParams,
                hospitalId: hospitalId,
                specialtyId: bookingState.selectedSpecialtyId || undefined,
                serviceId: bookingState.selectedServiceMedicalId || undefined,
                doctorId: bookingState.selectedDoctorId || undefined,
            });
        } else {
            // Doctor booking flow
            request = createAppointmentRequest({
                ...baseParams,
                doctorId: doctorId,
                specialtyId: doctorState.selectedDoctor?.specialty?.id,
                hospitalId: doctorState.selectedDoctor?.hospital?.id,
            });
        }

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
        if (step === 'specialty') return 'Chọn chuyên khoa / dịch vụ';
        if (step === 'appointmentType') return 'Chọn hình thức khám';
        if (step === 'datetime') return 'Chọn ngày và giờ';
        if (step === 'basic') return 'Xác nhận thông tin người khám';
        return 'Thanh toán';
    };

    const nextStep = () => {
        if (currentStep === 'specialty') handleContinueFromSpecialty();
        else if (currentStep === 'appointmentType') handleContinueFromAppointmentType();
        else if (currentStep === 'datetime') handleContinueFromDateTime();
        else if (currentStep === 'basic') handleContinueFromBasic();
    };

    const prevStep = () => {
        if (isHospitalBooking) {
            if (currentStep === 'payment') setCurrentStep('basic');
            else if (currentStep === 'basic') setCurrentStep('datetime');
            else if (currentStep === 'datetime') setCurrentStep('appointmentType');
            else if (currentStep === 'appointmentType') setCurrentStep('specialty');
        } else if (currentStep === 'payment') {
            setCurrentStep('basic');
        } else if (currentStep === 'basic') {
            setCurrentStep('datetime');
        }
    };

    // Get hospitalId for payment based on flow type
    const getPaymentHospitalId = (): string | undefined => {
        if (isHospitalBooking) {
            return hospitalId;
        }
        return doctorState.selectedDoctor?.hospital?.id;
    };

    const renderStepContent = () => {
        // Hospital booking: specialty selection step
        if (currentStep === 'specialty' && isHospitalBooking) {
            return (
                <SpecialtyServiceSection
                    nextStep={nextStep}
                    prevStep={prevStep}
                    hospitalData={hospitalData}
                    isLoading={isLoadingHospital}
                />
            );
        }

        // Hospital booking: appointment type selection step
        if (currentStep === 'appointmentType' && isHospitalBooking) {
            return (
                <AppointmentTypeSection
                    nextStep={nextStep}
                    prevStep={prevStep}
                    hospitalData={hospitalData}
                />
            );
        }

        // DateTime step (both flows)
        if (currentStep === 'datetime') {
            return (
                <DateTimeSection
                    nextStep={nextStep}
                    prevStep={prevStep}
                    doctorId={isHospitalBooking ? undefined : doctorId}
                    hospitalId={isHospitalBooking ? hospitalId : undefined}
                    hidePrev={!isHospitalBooking}
                />
            );
        }

        // Basic info step (both flows)
        if (currentStep === 'basic') {
            return <BasicInfoSection nextStep={nextStep} prevStep={prevStep} />;
        }

        // Payment step (both flows)
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
                            hospitalId: getPaymentHospitalId(),
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
