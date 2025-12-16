import React, { useEffect, useState } from 'react';
import { Stethoscope } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation('aiSupport');
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
        isHospitalBooking ? t('miniBooking.selectSpecialty') : t('miniBooking.selectDateTime')
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
                    toast.error(t('miniBooking.cannotLoadHospital'));
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
        if (step === 'specialty') return t('miniBooking.selectSpecialty');
        if (step === 'appointmentType') return t('miniBooking.selectAppointmentType');
        if (step === 'datetime') return t('miniBooking.selectDateTime');
        if (step === 'basic') return t('miniBooking.confirmInfo');
        return t('miniBooking.selectPayment');
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
            toast.warn(t('miniBooking.selectSpecialtyRequired'));
            return;
        }
        setCurrentStep('appointmentType');
    };

    const handleContinueFromAppointmentType = () => {
        setCurrentStep('datetime');
    };

    const handleContinueFromDateTime = () => {
        if (!scheduleState.selectedDate || scheduleState.selectedSlots.length === 0) {
            toast.warn(t('miniBooking.selectTimeSlot'));
            return;
        }
        setCurrentStep('basic');
    };

    const handleContinueFromBasic = () => {
        setCurrentStep('payment');
    };

    const ensureAppointmentCreated = async (skipPayment: boolean) => {
        if (!profile?.id) throw new Error(t('miniBooking.pleaseLogin'));
        if (!isHospitalBooking && !doctorId) throw new Error(t('miniBooking.missingDoctorInfo'));
        if (isHospitalBooking && !hospitalId) throw new Error(t('miniBooking.missingHospitalInfo'));
        if (!scheduleState.selectedDate || scheduleState.selectedSlots.length === 0)
            throw new Error(t('miniBooking.selectDateTimeRequired'));

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
        if (!appointmentId) throw new Error(t('miniBooking.noAppointmentId'));
        dispatch(setCreatedAppointmentId(appointmentId));
        return appointmentId;
    };

    // Helpers to reuse Booking sections
    const getStepTitle = (step: Step): string => {
        if (step === 'specialty') return t('miniBooking.stepSpecialty');
        if (step === 'appointmentType') return t('miniBooking.stepAppointmentType');
        if (step === 'datetime') return t('miniBooking.stepDateTime');
        if (step === 'basic') return t('miniBooking.stepBasicInfo');
        return t('miniBooking.stepPayment');
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
                            throw new Error(t('miniBooking.noPaymentUrl'));
                        }
                        toast.success(t('miniBooking.redirectingPayment'));
                        setTimeout(() => {
                            globalThis.location.href = paymentResponse.paymentUrl;
                        }, 1000);
                    } catch (error: any) {
                        console.error('Process failed:', error);
                        toast.error(error.message || t('miniBooking.cannotCompleteProcess'));
                    }
                }}
                onCreateAppointmentOnly={async () => {
                    try {
                        const appointmentId = await ensureAppointmentCreated(true);
                        toast.success(t('miniBooking.bookingSuccess'));
                        onClose();
                        navigate(
                            PATHS.BOOKING.CONFIRMATION.replace(':appointmentId', appointmentId)
                        );
                    } catch (error: any) {
                        console.error('Create appointment failed:', error);
                        toast.error(error.message || t('miniBooking.cannotCreateAppointment'));
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
                                    {t('miniBooking.close')}
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
