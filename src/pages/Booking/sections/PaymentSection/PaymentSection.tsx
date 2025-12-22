import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BookingSectionWrapper from '../../components/BookingSectionWrapper';
import { mockAppointmentInfo } from '../../constants/mockData';
import { useBookingEntityInfo } from '../../hooks';
import { useAppSelector } from '@/store/hooks';
import { selectSelectedDate, selectSelectedSlots } from '@/store/selectors/schedule.selectors';
import TimeSlotBadge from '../../components/TimeSlotBadge';
import PaymentService, { PaymentMethod } from '@/services/payment.service';
import DiscountService from '@/services/discount.service';
import { toast } from 'react-toastify';
import { AppointmentType } from '@/enums/appointment.enums';
import BenefitItem from '../../components/BenefitItem';
import PaymentOptionCard from '../../components/PaymentOptionCard';

// Helper function to parse AppointmentTimeId (format: AT_08_00_09_00 -> { startTime: "08:00", endTime: "09:00" })
const parseAppointmentTimeId = (timeId: string) => {
    // Format: AT_08_00_09_00
    const parts = timeId.split('_');
    if (parts.length === 5 && parts[0] === 'AT') {
        return {
            startTime: `${parts[1]}:${parts[2]}`,
            endTime: `${parts[3]}:${parts[4]}`,
        };
    }
    return null;
};

interface PaymentSectionProps {
    nextStep: () => void;
    prevStep: () => void;
    isCreatingAppointment?: boolean;
    onCreateAppointmentAndPayment: (
        paymentMethodId: string,
        depositAmount: number,
        discountId?: string,
        discountCode?: string,
        discountedTotalAmount?: number
    ) => Promise<void>;
    onCreateAppointmentOnly?: () => Promise<void>; // New: Create appointment without payment
    isProcessingPayment?: boolean;
    isSupplementaryPayment?: boolean; // For reschedule with price difference
    supplementaryAmount?: number; // Amount to pay for reschedule
    rescheduleAppointmentDate?: string; // For staff-assigned doctor (skipDateTime=true)
    rescheduleAppointmentTimeId?: string; // For staff-assigned doctor (skipDateTime=true)
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
    prevStep,
    isCreatingAppointment = false,
    onCreateAppointmentAndPayment,
    onCreateAppointmentOnly,
    isProcessingPayment = false,
    isSupplementaryPayment = false,
    supplementaryAmount = 0,
    rescheduleAppointmentDate,
    rescheduleAppointmentTimeId,
}) => {
    const { t, i18n } = useTranslation('booking');

    // Use shared hook for booking type detection and entity info
    const { entityInfo, isServiceMedicalBooking, isHospitalBooking } = useBookingEntityInfo();

    // Get selected date and time slots (or use reschedule values if provided)
    const selectedDateFromRedux = useAppSelector(selectSelectedDate);
    const selectedSlotsFromRedux = useAppSelector(selectSelectedSlots);

    // Use reschedule date/time if provided (for staff-assigned flow with skipDateTime=true)
    const selectedDate = rescheduleAppointmentDate || selectedDateFromRedux;
    const selectedSlots = rescheduleAppointmentTimeId
        ? ([parseAppointmentTimeId(rescheduleAppointmentTimeId)].filter(Boolean) as Array<{
              startTime: string;
              endTime: string;
          }>)
        : selectedSlotsFromRedux;

    // Payment methods state
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<string>('');
    const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(true);

    // Discount state
    const [discountCode, setDiscountCode] = useState<string>('');
    const [appliedDiscount, setAppliedDiscount] = useState<{
        id: string; // Discount ID from validation response
        code: string;
        discountAmount: number;
        finalAmount: number;
    } | null>(null);
    const [isValidatingDiscount, setIsValidatingDiscount] = useState(false);

    // Payment option state (new business requirement)
    // For specialty booking, default to 'no-payment' since there's no price yet
    const [paymentOption, setPaymentOption] = useState<'deposit' | 'no-payment'>('deposit');

    // Fetch payment methods on component mount
    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                setIsLoadingPaymentMethods(true);
                const methods = await PaymentService.getActivePaymentMethods();
                setPaymentMethods(methods);

                // Set first payment method as default if available
                if (methods.length > 0) {
                    setSelectedPayment(methods[0].id);
                }
            } catch (error) {
                console.error('Failed to fetch payment methods:', error);
                // Fallback to empty array
                setPaymentMethods([]);
            } finally {
                setIsLoadingPaymentMethods(false);
            }
        };

        fetchPaymentMethods();
    }, []);

    // Note: Appointment will be created on-demand during payment process

    const doctorState = useAppSelector((state) => state.doctor);
    const bookingState = useAppSelector((state) => state.booking);
    const serviceMedicalState = useAppSelector(
        (state) => state.medicalService.serviceCategories.selectedServiceWithHospital
    );
    const hospitalState = useAppSelector((state) => state.hospital);

    // Determine if this is a specialty booking (hospital assigns doctor mode)
    // Specialty booking: has specialtyId but NO doctorId and NO serviceId selected
    const isSpecialtyBooking =
        isHospitalBooking &&
        !!bookingState.selectedSpecialtyId &&
        !bookingState.selectedDoctorId &&
        !bookingState.selectedServiceMedicalId;

    // Check if telehealth appointment (requires 100% payment, no "no-payment" option)
    const isTelehealthAppointment = bookingState.appointmentType === AppointmentType.TELEHEALTH;

    // Auto-select 'no-payment' for specialty booking (no price available yet)
    // But for telehealth, always use 'deposit' (100% payment required)
    useEffect(() => {
        if (isTelehealthAppointment) {
            setPaymentOption('deposit');
        } else if (isSpecialtyBooking) {
            setPaymentOption('no-payment');
        }
    }, [isSpecialtyBooking, isTelehealthAppointment]);

    // Helper to get service type name based on appointment type
    const getServiceTypeName = (): string => {
        const appointmentType = bookingState.appointmentType || AppointmentType.IN_PERSON;
        return appointmentType === AppointmentType.IN_PERSON
            ? 'Khám trực tiếp'
            : 'Tư vấn trực tuyến';
    };

    // Helper to get price from doctor's prices
    const getDoctorPrice = (): number => {
        if (!doctorState.selectedDoctor?.prices) return 0;
        const price = doctorState.selectedDoctor.prices.find(
            (p) => p.serviceTypeName === getServiceTypeName()
        );
        return price?.amount || 0;
    };

    // Helper to get price from hospital's service
    const getHospitalServicePrice = (): number => {
        if (!hospitalState.selectedHospital?.serviceMedicals) return 0;
        const service = hospitalState.selectedHospital.serviceMedicals.find(
            (s) => s.id === bookingState.selectedServiceMedicalId
        );
        return service?.price || 0;
    };

    // Helper function to get consultation fee based on appointment type
    // Refactored to reduce cognitive complexity
    const getConsultationFee = (): number => {
        // Hospital booking flow
        if (isHospitalBooking) {
            // If doctor is selected, get price from doctor
            if (bookingState.selectedDoctorId) {
                return getDoctorPrice();
            }
            // If service is selected (no doctor), get price from hospital's service
            if (bookingState.selectedServiceMedicalId) {
                return getHospitalServicePrice();
            }
            return 0;
        }

        // Direct doctor booking
        if (!isServiceMedicalBooking && doctorState.selectedDoctor?.prices) {
            return getDoctorPrice();
        }

        // Direct service medical booking
        if (isServiceMedicalBooking && serviceMedicalState?.price) {
            return serviceMedicalState.price;
        }

        return 0;
    };

    // Helper function to render booking entity info - extracted to avoid nested ternary
    const renderBookingEntityInfo = () => {
        if (isServiceMedicalBooking) {
            return (
                <>
                    <div className="mb-3">
                        <div className="fw-medium">
                            {t('paymentSection.appointmentInfo.service')}
                        </div>
                        <div className="form-plain-text">{entityInfo.name}</div>
                    </div>
                    <div className="mb-3">
                        <div className="fw-medium">
                            {t('paymentSection.appointmentInfo.hospital')}
                        </div>
                        <div className="form-plain-text">
                            {'subtitle' in entityInfo
                                ? entityInfo.subtitle
                                : t('paymentSection.appointmentInfo.notUpdated')}
                        </div>
                    </div>
                </>
            );
        }

        // Doctor Booking Flow
        return (
            <>
                <div className="mb-3">
                    <div className="fw-medium">{t('paymentSection.appointmentInfo.doctor')}</div>
                    <div className="form-plain-text">{entityInfo.name}</div>
                </div>
                <div className="mb-3">
                    <div className="fw-medium">{t('paymentSection.appointmentInfo.specialty')}</div>
                    <div className="form-plain-text">
                        {'specialty' in entityInfo
                            ? entityInfo.specialty
                            : t('paymentSection.appointmentInfo.notUpdated')}
                    </div>
                </div>
                <div className="mb-3">
                    <div className="fw-medium">{t('paymentSection.appointmentInfo.hospital')}</div>
                    <div className="form-plain-text">
                        {entityInfo.location || t('paymentSection.appointmentInfo.notUpdated')}
                    </div>
                </div>
            </>
        );
    };

    // Constants for payment calculation
    // For supplementary payment: use the provided amount
    // For regular payment: calculate deposit based on appointment type
    // Business rule: TELEHEALTH = 100% payment, IN_PERSON = 30% deposit
    const TOTAL_AMOUNT = isSupplementaryPayment ? supplementaryAmount : getConsultationFee();
    const appointmentType = bookingState.appointmentType || AppointmentType.IN_PERSON;
    const DEPOSIT_PERCENTAGE = appointmentType === AppointmentType.TELEHEALTH ? 1 : 0.3;

    // Calculate deposit from total amount (or final amount if discount applied)
    const TOTAL_AFTER_DISCOUNT = appliedDiscount ? appliedDiscount.finalAmount : TOTAL_AMOUNT;
    const DEPOSIT_AMOUNT = isSupplementaryPayment
        ? supplementaryAmount
        : Math.round(TOTAL_AFTER_DISCOUNT * DEPOSIT_PERCENTAGE);

    // Final amount to pay (deposit after discount)
    const FINAL_AMOUNT = DEPOSIT_AMOUNT;

    // Get hospitalId from multiple sources based on booking flow
    const getHospitalId = (): string | undefined => {
        // Priority 1: From service medical state (service booking flow)
        if (serviceMedicalState?.hospitalId) return serviceMedicalState.hospitalId;

        // Priority 2: From doctor state (doctor booking flow)
        if (doctorState.selectedDoctor?.hospital?.id)
            return doctorState.selectedDoctor?.hospital?.id;

        // Priority 3: From hospital state (hospital booking flow with selected hospital)
        if (hospitalState.selectedHospital?.id) return hospitalState.selectedHospital.id;

        return undefined;
    };

    const resolvedHospitalId = getHospitalId();

    // Handle discount code validation
    const handleValidateDiscount = async () => {
        if (!discountCode.trim()) {
            toast.warning(t('paymentSection.toast.enterDiscountCode'));
            return;
        }

        if (!resolvedHospitalId) {
            toast.error(t('paymentSection.toast.hospitalNotFound'));
            return;
        }

        setIsValidatingDiscount(true);
        try {
            const result = await DiscountService.validateDiscount(discountCode.trim(), {
                hospitalId: resolvedHospitalId,
                totalAmount: TOTAL_AMOUNT, // Validate against total amount, not deposit
            });

            if (result.isValid) {
                // Discount object should exist when isValid=true
                if (!result.discount?.id) {
                    toast.error(t('paymentSection.toast.discountIdError'));
                    return;
                }

                setAppliedDiscount({
                    id: result.discount.id, // Store discount ID for payment
                    code: discountCode.trim(),
                    discountAmount: result.discountAmount,
                    finalAmount: result.finalAmount, // This is total after discount
                });
                toast.success(t('paymentSection.toast.discountSuccess'));
            } else {
                toast.error(result.message || t('paymentSection.toast.discountInvalid'));
            }
        } catch (error: any) {
            toast.error(error.message || t('paymentSection.toast.discountValidateError'));
        } finally {
            setIsValidatingDiscount(false);
        }
    };

    // Handle remove discount
    const handleRemoveDiscount = () => {
        setAppliedDiscount(null);
        setDiscountCode('');
        toast.info(t('paymentSection.toast.discountRemoved'));
    };

    // Handle next step based on selected payment option
    const handleNextStep = async () => {
        if (isCreatingAppointment || isProcessingPayment) {
            return;
        }

        // Option 1: Deposit payment (with 10% discount incentive)
        if (paymentOption === 'deposit') {
            if (!selectedPayment) {
                toast.error(t('paymentSection.toast.selectPaymentMethod'));
                return;
            }

            // Validate that the selected payment method exists
            const selectedMethod = paymentMethods.find((method) => method.id === selectedPayment);
            if (!selectedMethod) {
                toast.error(t('paymentSection.toast.invalidPaymentMethod'));
                return;
            }

            // Validate that we have a valid price
            if (!TOTAL_AMOUNT || TOTAL_AMOUNT <= 0) {
                toast.error(t('paymentSection.toast.noPriceError'));
                return;
            }

            // Call parent handler with payment method, deposit amount, discount ID, discount code, and total after discount
            await onCreateAppointmentAndPayment(
                selectedPayment,
                FINAL_AMOUNT,
                appliedDiscount?.id,
                appliedDiscount?.code,
                TOTAL_AFTER_DISCOUNT // Pass total after discount for appointment amount
            );
        }
        // Option 2: No payment (create appointment only)
        else if (paymentOption === 'no-payment') {
            if (!onCreateAppointmentOnly) {
                toast.error(t('paymentSection.toast.noPaymentNotSupported'));
                return;
            }

            // Call parent handler to create appointment without payment
            await onCreateAppointmentOnly();
        }
    };

    // Helper function to check if next step should be disabled - extracted to reduce cognitive complexity
    const isNextStepDisabled = (): boolean => {
        if (isCreatingAppointment || isProcessingPayment) {
            return true;
        }
        // For specialty booking with no-payment, don't require TOTAL_AMOUNT
        // For other cases, require valid price
        if (
            !isSpecialtyBooking &&
            paymentOption === 'deposit' &&
            (!TOTAL_AMOUNT || TOTAL_AMOUNT <= 0)
        ) {
            return true;
        }
        // Only require payment method selection if deposit option is chosen
        if (paymentOption === 'deposit' && !selectedPayment) {
            return true;
        }
        return false;
    };

    // Helper function to check if hospital booking flow should render - extracted to reduce cognitive complexity
    const shouldRenderHospitalBookingFlow = (): boolean => {
        return (
            isHospitalBooking &&
            entityInfo !== null &&
            'bookingType' in entityInfo &&
            entityInfo.bookingType === 'hospital'
        );
    };

    // Helper function to format currency based on locale
    const formatCurrency = (amount: number): string => {
        const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
        return amount.toLocaleString(locale);
    };

    // Helper function to render supplementary payment info - extracted to reduce cognitive complexity
    const renderSupplementaryPaymentInfo = () => (
        <>
            <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-2">
                <p className="mb-0">{t('paymentSection.paymentInfo.supplementaryAmount')}</p>
                <span className="fw-medium text-warning d-block">
                    {formatCurrency(DEPOSIT_AMOUNT)} đ
                </span>
            </div>
            <div className="alert alert-warning mt-3 mb-0">
                <i className="bi bi-info-circle me-2"></i>
                <small>
                    {t('paymentSection.supplementaryNote', {
                        amount: formatCurrency(DEPOSIT_AMOUNT),
                    })}
                </small>
            </div>
        </>
    );

    // Helper function to render regular payment info - extracted to reduce cognitive complexity
    const renderRegularPaymentInfo = () => (
        <>
            <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-2">
                <p className="mb-0">{t('paymentSection.paymentInfo.totalFee')}</p>
                <span className="fw-medium d-block">{formatCurrency(TOTAL_AMOUNT)} đ</span>
            </div>

            {/* Show discount if applied */}
            {appliedDiscount && (
                <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-2">
                    <p className="mb-0 text-success">
                        {t('paymentSection.paymentInfo.discount')} ({appliedDiscount.code})
                    </p>
                    <span className="fw-medium text-success d-block">
                        - {formatCurrency(appliedDiscount.discountAmount)} đ
                    </span>
                </div>
            )}

            {/* Show total after discount if discount applied */}
            {appliedDiscount && (
                <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-2 pb-2 border-bottom">
                    <p className="mb-0 fw-bold">
                        {t('paymentSection.paymentInfo.totalAfterDiscount')}
                    </p>
                    <span className="fw-bold d-block">
                        {formatCurrency(TOTAL_AFTER_DISCOUNT)} đ
                    </span>
                </div>
            )}

            <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-2">
                <p className="mb-0">
                    {appointmentType === AppointmentType.TELEHEALTH
                        ? t('paymentSection.paymentInfo.fullPaymentFee')
                        : t('paymentSection.paymentInfo.depositFee')}
                </p>
                <span className="fw-medium text-primary d-block">
                    {formatCurrency(DEPOSIT_AMOUNT)} đ
                </span>
            </div>
            <div className="alert alert-info mt-3 mb-0">
                <i className="bi bi-info-circle me-2"></i>
                <small>
                    {appointmentType === AppointmentType.TELEHEALTH
                        ? t('paymentSection.telehealthNote', {
                              amount: formatCurrency(DEPOSIT_AMOUNT),
                          })
                        : t('paymentSection.depositNote', {
                              depositAmount: formatCurrency(DEPOSIT_AMOUNT),
                              remainingAmount: formatCurrency(
                                  TOTAL_AFTER_DISCOUNT - DEPOSIT_AMOUNT
                              ),
                          })}
                </small>
            </div>
        </>
    );

    // Helper function to render payment amount details - extracted to reduce cognitive complexity
    const renderPaymentAmountDetails = () => {
        if (TOTAL_AMOUNT <= 0) {
            return (
                <div className="alert alert-warning">
                    <i className="bi bi-exclamation-triangle me-2" aria-hidden="true"></i>{' '}
                    {t('paymentSection.noPriceWarning', {
                        entity: isServiceMedicalBooking
                            ? t('paymentSection.entityService')
                            : t('paymentSection.entityDoctor'),
                    })}
                </div>
            );
        }
        return isSupplementaryPayment
            ? renderSupplementaryPaymentInfo()
            : renderRegularPaymentInfo();
    };

    // Render payment method content
    const renderPaymentMethodContent = () => {
        if (isLoadingPaymentMethods) {
            return (
                <div className="text-center py-4">
                    <div className="spinner-border spinner-border-sm">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 mb-0 text-muted">
                        {t('paymentSection.loadingPaymentMethods')}
                    </p>
                </div>
            );
        }

        if (paymentMethods.length === 0) {
            return (
                <div className="alert alert-warning">
                    <i className="bi bi-exclamation-triangle me-2"></i>{' '}
                    {t('paymentSection.noPaymentMethods')}
                </div>
            );
        }

        return (
            <>
                <ul className="nav nav-pills mb-3 row" id="pills-tab">
                    {paymentMethods.map((method) => (
                        <li
                            key={method.id}
                            className={`nav-item ${paymentMethods.length === 2 ? 'col-sm-6' : 'col-sm-4'}`}
                        >
                            <button
                                className={`nav-link ${selectedPayment === method.id ? 'active' : ''}`}
                                id={`pills-${method.name.toLowerCase()}-tab`}
                                data-bs-toggle="pill"
                                data-bs-target={`#pills-${method.name.toLowerCase()}`}
                                type="button"
                                role="tab"
                                onClick={() => setSelectedPayment(method.id)}
                            >
                                <img
                                    src={method.imageUrl}
                                    className="me-2"
                                    alt={method.name}
                                    style={{ width: '24px', height: '24px' }}
                                    onError={(e) => {
                                        // Fallback image if payment method logo fails to load
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />{' '}
                                {method.name}
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="tab-content" id="pills-tabContent">
                    {paymentMethods.map((method) => {
                        const isActive = selectedPayment === method.id;

                        return (
                            <div
                                key={method.id}
                                className={`tab-pane fade ${isActive ? 'show active' : ''}`}
                                id={`pills-${method.name.toLowerCase()}`}
                                role="tabpanel"
                            >
                                <div className="payment-method-info">
                                    <div className="alert alert-info">
                                        <h6 className="mb-2">
                                            <i className="bi bi-info-circle me-2"></i>{' '}
                                            {method.description}
                                        </h6>
                                        <p className="mb-0">
                                            {t('paymentSection.paymentMethodInfo', {
                                                methodName: method.name,
                                            })}
                                        </p>
                                        <ul className="mb-0 mt-2">
                                            <li>
                                                {t('paymentSection.paymentMethodOptions.atmBank')}
                                            </li>
                                            <li>
                                                {t(
                                                    'paymentSection.paymentMethodOptions.internationalCard'
                                                )}
                                            </li>
                                            <li>
                                                {t('paymentSection.paymentMethodOptions.eWallet')}
                                            </li>
                                            <li>
                                                {t('paymentSection.paymentMethodOptions.qrCode')}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </>
        );
    };

    // Format date and time for display
    const formattedAppointmentInfo = useMemo(() => {
        if (!selectedDate) {
            return {
                date: t('paymentSection.notSelected'),
                time: t('paymentSection.notSelected'),
                slots: [],
                totalDuration: 0,
            };
        }

        const date = new Date(selectedDate);
        const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
        const formattedDate = date.toLocaleDateString(locale, {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });

        let sortedSlots: typeof selectedSlots = [];
        let totalDuration = 0;

        if (selectedSlots && selectedSlots.length > 0) {
            // Sort slots by start time
            sortedSlots = [...selectedSlots].sort((a, b) => a.startTime.localeCompare(b.startTime));

            // Calculate total duration (assuming each slot is 30 minutes)
            totalDuration = sortedSlots.length * 30;
        }

        return {
            date: formattedDate,
            slots: sortedSlots,
            totalDuration,
        };
    }, [selectedDate, selectedSlots, i18n.language, t]);

    // Helper function to get next step button title - extracted to reduce cognitive complexity
    const getNextStepButtonTitle = (): string => {
        if (isCreatingAppointment || isProcessingPayment) {
            return t('paymentSection.buttons.processing');
        }
        if (isSupplementaryPayment) {
            return t('paymentSection.buttons.pay');
        }
        if (paymentOption === 'deposit') {
            return t('paymentSection.buttons.depositAndPay');
        }
        if (paymentOption === 'no-payment') {
            return t('paymentSection.buttons.bookNow');
        }
        return t('paymentSection.buttons.continue');
    };

    return (
        <BookingSectionWrapper
            doctor={entityInfo}
            appointment={mockAppointmentInfo}
            nextStepTitle={getNextStepButtonTitle()}
            nextStep={handleNextStep}
            prevStep={prevStep}
            isShowInfoHeader={false}
            disabled={isNextStepDisabled()}
        >
            {/* Payment Options Selection */}
            {!isSupplementaryPayment && (
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title mb-4">
                                    <i
                                        className="isax isax-wallet-money me-2"
                                        aria-hidden="true"
                                    ></i>{' '}
                                    {t('paymentSection.bookingOptions.title')}
                                </h5>

                                {/* Specialty booking notice */}
                                {isSpecialtyBooking && (
                                    <div className="alert alert-info mb-4">
                                        <i
                                            className="isax isax-info-circle me-2"
                                            aria-hidden="true"
                                        ></i>
                                        {t('paymentSection.bookingOptions.specialtyNotice')}
                                    </div>
                                )}

                                <div className="row">
                                    {/* Option 1: Deposit Payment with 10% Discount - Hidden for specialty booking and telehealth */}
                                    {!isSpecialtyBooking && !isTelehealthAppointment && (
                                        <PaymentOptionCard
                                            optionValue="deposit"
                                            currentValue={paymentOption}
                                            onSelect={setPaymentOption}
                                            ariaLabel={t(
                                                'paymentSection.bookingOptions.depositOption.ariaLabel'
                                            )}
                                            className="col-md-6 mb-3"
                                        >
                                            <div className="payment-option-header">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="paymentOption"
                                                        id="depositOption"
                                                        checked={paymentOption === 'deposit'}
                                                        onChange={() => setPaymentOption('deposit')}
                                                    />
                                                    <label
                                                        className="form-check-label fw-bold"
                                                        htmlFor="depositOption"
                                                    >
                                                        {t(
                                                            'paymentSection.bookingOptions.depositOption.label'
                                                        )}
                                                    </label>
                                                </div>
                                                <div className="discount-badge">
                                                    <span className="badge bg-success">
                                                        {t(
                                                            'paymentSection.bookingOptions.depositOption.saveBadge'
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="payment-option-content">
                                                <div className="benefits-list">
                                                    <BenefitItem
                                                        icon="isax isax-tick-circle"
                                                        iconColorClass="text-success"
                                                        text={t(
                                                            'paymentSection.bookingOptions.depositOption.benefit1'
                                                        )}
                                                        useHtml={true}
                                                    />
                                                    <BenefitItem
                                                        icon="isax isax-tick-circle"
                                                        iconColorClass="text-success"
                                                        text={t(
                                                            'paymentSection.bookingOptions.depositOption.benefit2'
                                                        )}
                                                    />
                                                </div>

                                                <div className="price-info mt-3">
                                                    <div className="current-price">
                                                        <span className="text-muted">
                                                            {t(
                                                                'paymentSection.bookingOptions.depositOption.depositPayment'
                                                            )}
                                                        </span>
                                                        <span className="fw-bold text-primary ms-2">
                                                            {formatCurrency(DEPOSIT_AMOUNT)} đ
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </PaymentOptionCard>
                                    )}

                                    {/* Option 2: No Payment - Full width for specialty booking */}
                                    {/* Hidden for telehealth appointments (100% payment required) */}
                                    {!isTelehealthAppointment && (
                                        <PaymentOptionCard
                                            optionValue="no-payment"
                                            currentValue={paymentOption}
                                            onSelect={setPaymentOption}
                                            ariaLabel={t(
                                                'paymentSection.bookingOptions.noPaymentOption.ariaLabel'
                                            )}
                                            className={
                                                isSpecialtyBooking ? 'col-12 mb-3' : 'col-md-6 mb-3'
                                            }
                                        >
                                            <div className="payment-option-header">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="paymentOption"
                                                        id="noPaymentOption"
                                                        checked={paymentOption === 'no-payment'}
                                                        onChange={() =>
                                                            setPaymentOption('no-payment')
                                                        }
                                                    />
                                                    <label
                                                        className="form-check-label fw-bold"
                                                        htmlFor="noPaymentOption"
                                                    >
                                                        {t(
                                                            'paymentSection.bookingOptions.noPaymentOption.label'
                                                        )}
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="payment-option-content">
                                                <div className="benefits-list">
                                                    <BenefitItem
                                                        icon="isax isax-info-circle"
                                                        iconColorClass="text-info"
                                                        text={t(
                                                            'paymentSection.bookingOptions.noPaymentOption.benefit1'
                                                        )}
                                                    />
                                                    <BenefitItem
                                                        icon="isax isax-info-circle"
                                                        iconColorClass="text-info"
                                                        text={t(
                                                            'paymentSection.bookingOptions.noPaymentOption.benefit2'
                                                        )}
                                                    />
                                                    <BenefitItem
                                                        icon="isax isax-info-circle"
                                                        iconColorClass="text-info"
                                                        text={t(
                                                            'paymentSection.bookingOptions.noPaymentOption.benefit3'
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </PaymentOptionCard>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="row">
                {/* Only show payment methods if deposit option is selected */}
                {(paymentOption === 'deposit' || isSupplementaryPayment) && (
                    <div className="col-lg-6 d-flex">
                        <div className="card flex-fill mb-3 mb-lg-0">
                            <div className="card-body">
                                <h6 className="mb-3">{t('paymentSection.paymentGateway')}</h6>
                                <div className="payment-tabs">{renderPaymentMethodContent()}</div>
                            </div>
                        </div>
                    </div>
                )}
                <div
                    className={`${paymentOption === 'no-payment' ? 'col-lg-12' : 'col-lg-6'} d-flex`}
                >
                    <div className="card flex-fill mb-0">
                        <div className="card-body">
                            <h6 className="mb-3">{t('paymentSection.appointmentInfo.title')}</h6>
                            <div className="mb-3">
                                <div className="fw-medium">
                                    {t('paymentSection.appointmentInfo.date')}
                                </div>
                                <div className="form-plain-text">
                                    {formattedAppointmentInfo.date}
                                </div>
                            </div>

                            {/* Time Slots Section */}
                            {formattedAppointmentInfo.slots.length > 0 ? (
                                <div className="mb-3">
                                    <div className="fw-medium mb-2">
                                        {t('paymentSection.appointmentInfo.selectedSlots', {
                                            count: formattedAppointmentInfo.slots.length,
                                            duration: formattedAppointmentInfo.totalDuration,
                                        })}
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                        {formattedAppointmentInfo.slots.map((slot) => (
                                            <TimeSlotBadge
                                                key={`${slot.startTime}-${slot.endTime}`}
                                                startTime={slot.startTime}
                                                endTime={slot.endTime}
                                                minWidth="136px"
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-3">
                                    <div className="fw-medium">
                                        {t('paymentSection.appointmentInfo.time')}
                                    </div>
                                    <div className="form-plain-text text-warning">
                                        <i className="bi bi-exclamation-triangle me-1"></i>{' '}
                                        {t('paymentSection.appointmentInfo.timeNotSelected')}
                                    </div>
                                </div>
                            )}

                            {entityInfo?.name && (
                                <>
                                    {/* Hospital Booking Flow */}
                                    {shouldRenderHospitalBookingFlow() ? (
                                        <>
                                            <div className="mb-3">
                                                <div className="fw-medium">
                                                    {t('paymentSection.appointmentInfo.hospital')}
                                                </div>
                                                <div className="form-plain-text">
                                                    {entityInfo.name}
                                                </div>
                                            </div>
                                            {'selectedSpecialty' in entityInfo &&
                                                entityInfo.selectedSpecialty && (
                                                    <div className="mb-3">
                                                        <div className="fw-medium">
                                                            {t(
                                                                'paymentSection.appointmentInfo.specialty'
                                                            )}
                                                        </div>
                                                        <div className="form-plain-text">
                                                            {entityInfo.selectedSpecialty}
                                                        </div>
                                                    </div>
                                                )}
                                            {'selectedService' in entityInfo &&
                                                entityInfo.selectedService && (
                                                    <div className="mb-3">
                                                        <div className="fw-medium">
                                                            {t(
                                                                'paymentSection.appointmentInfo.service'
                                                            )}
                                                        </div>
                                                        <div className="form-plain-text">
                                                            {entityInfo.selectedService}
                                                        </div>
                                                    </div>
                                                )}
                                            {'selectedDoctor' in entityInfo &&
                                                entityInfo.selectedDoctor && (
                                                    <div className="mb-3">
                                                        <div className="fw-medium">
                                                            {t(
                                                                'paymentSection.appointmentInfo.doctor'
                                                            )}
                                                        </div>
                                                        <div className="form-plain-text">
                                                            {entityInfo.selectedDoctor}
                                                        </div>
                                                    </div>
                                                )}
                                        </>
                                    ) : (
                                        renderBookingEntityInfo()
                                    )}
                                </>
                            )}
                            {/* Show specialty booking payment note */}
                            {isSpecialtyBooking && paymentOption === 'no-payment' && (
                                <div className="pt-3 border-top">
                                    <div className="alert alert-success mb-0">
                                        <i
                                            className="isax isax-tick-circle me-2"
                                            aria-hidden="true"
                                        ></i>
                                        <strong>{t('paymentSection.specialtyPaymentTitle')}</strong>{' '}
                                        {t('paymentSection.specialtyPaymentNote')}
                                    </div>
                                </div>
                            )}

                            {/* Only show payment info if NOT no-payment option */}
                            {paymentOption !== 'no-payment' && (
                                <>
                                    <div className="pt-3 border-top booking-more-info">
                                        <h6 className="mb-3">
                                            {t('paymentSection.paymentInfo.title')}
                                        </h6>
                                        {renderPaymentAmountDetails()}

                                        {/* Discount Code Section */}
                                        {paymentOption === 'deposit' && !isSupplementaryPayment && (
                                            <div className="mt-3">
                                                <div className="discount-section">
                                                    <label
                                                        htmlFor="discountCodeInput"
                                                        className="form-label fw-medium"
                                                    >
                                                        <i
                                                            className="bi bi-tag me-2"
                                                            aria-hidden="true"
                                                        ></i>{' '}
                                                        {t('paymentSection.discount.label')}
                                                    </label>
                                                    {appliedDiscount ? (
                                                        <div className="alert alert-success d-flex justify-content-between align-items-center mb-0">
                                                            <div>
                                                                <i className="bi bi-check-circle me-2"></i>
                                                                <strong>
                                                                    {appliedDiscount.code}
                                                                </strong>{' '}
                                                                -{' '}
                                                                {t(
                                                                    'paymentSection.discount.discountAmount',
                                                                    {
                                                                        amount: formatCurrency(
                                                                            appliedDiscount.discountAmount
                                                                        ),
                                                                    }
                                                                )}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="btn-remove-discount"
                                                                onClick={handleRemoveDiscount}
                                                                title={t(
                                                                    'paymentSection.discount.removeTitle'
                                                                )}
                                                                aria-label={t(
                                                                    'paymentSection.discount.removeTitle'
                                                                )}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="input-group">
                                                            <input
                                                                id="discountCodeInput"
                                                                type="text"
                                                                className="form-control"
                                                                placeholder={t(
                                                                    'paymentSection.discount.placeholder'
                                                                )}
                                                                value={discountCode}
                                                                onChange={(e) =>
                                                                    setDiscountCode(
                                                                        e.target.value.toUpperCase()
                                                                    )
                                                                }
                                                                disabled={isValidatingDiscount}
                                                            />
                                                            <button
                                                                className="btn btn-apply-discount"
                                                                type="button"
                                                                onClick={handleValidateDiscount}
                                                                disabled={
                                                                    isValidatingDiscount ||
                                                                    !discountCode.trim()
                                                                }
                                                            >
                                                                {isValidatingDiscount ? (
                                                                    <>
                                                                        <output
                                                                            className="spinner-border spinner-border-sm me-2"
                                                                            aria-live="polite"
                                                                            aria-atomic="true"
                                                                        >
                                                                            <span className="visually-hidden">
                                                                                {t(
                                                                                    'paymentSection.discount.validating'
                                                                                )}
                                                                            </span>
                                                                        </output>{' '}
                                                                        {t(
                                                                            'paymentSection.discount.validating'
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i
                                                                            className="bi bi-check-circle-fill me-1"
                                                                            aria-hidden="true"
                                                                        ></i>{' '}
                                                                        {t(
                                                                            'paymentSection.discount.apply'
                                                                        )}
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {TOTAL_AMOUNT > 0 && (
                                        <div className="bg-primary d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between p-3 rounded">
                                            <h6 className="text-white">
                                                {isSupplementaryPayment
                                                    ? t(
                                                          'paymentSection.paymentInfo.supplementaryFinalAmount'
                                                      )
                                                    : t('paymentSection.paymentInfo.finalAmount')}
                                            </h6>
                                            <h6 className="text-white">
                                                {formatCurrency(FINAL_AMOUNT)} đ
                                            </h6>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </BookingSectionWrapper>
    );
};

export default PaymentSection;

// Add CSS styles for payment option cards
const styles = `
<style>
.payment-option-card {
    border: 2px solid #e9ecef;
    border-radius: 12px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    height: 100%;
    background: #fff;
}

.payment-option-card:hover {
    border-color: #007bff;
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
}

.payment-option-card.active {
    border-color: #007bff;
    background: linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%);
    box-shadow: 0 4px 16px rgba(0, 123, 255, 0.2);
}

.payment-option-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
}

.payment-option-header .form-check-label {
    font-size: 16px;
    color: #2c3e50;
    margin-bottom: 0;
}

.discount-badge {
    margin-left: 10px;
}

.discount-badge .badge {
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 20px;
}

.benefits-list {
    margin: 0;
}

.benefit-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-size: 14px;
    color: #495057;
}

.benefit-item:last-child {
    margin-bottom: 0;
}

.benefit-item i {
    font-size: 16px;
    flex-shrink: 0;
}

.price-info {
    border-top: 1px solid #e9ecef;
    padding-top: 12px;
}

.current-price {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.savings-info {
    text-align: center;
    font-size: 13px;
}

.payment-option-card.active .form-check-input:checked {
    background-color: #007bff;
    border-color: #007bff;
}

/* Apply Discount Button Styles */
.btn-apply-discount {
    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
    border: none;
    color: white;
    font-weight: 600;
    padding: 0.5rem 1.25rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 6px rgba(0, 123, 255, 0.3);
    white-space: nowrap;
}

.btn-apply-discount:hover:not(:disabled) {
    background: linear-gradient(135deg, #0056b3 0%, #004494 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
   
}

.btn-apply-discount:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 1px 3px rgba(0, 123, 255, 0.3);
    
}

.btn-apply-discount:disabled {
    background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
    cursor: not-allowed;
    opacity: 0.65;
    box-shadow: none;
    color: white !important;
}

.btn-apply-discount i {
    font-size: 14px;
}

/* Remove Discount Button Styles */
.btn-remove-discount {
    background: transparent;
    border: 2px solid #dc3545;
    color: #dc3545;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 400;
    line-height: 1;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;
    flex-shrink: 0;
}

.btn-remove-discount:hover {
    background: #dc3545;
    color: white;
    transform: scale(1.1) rotate(90deg);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}

.btn-remove-discount:active {
    transform: scale(0.95) rotate(90deg);
    box-shadow: 0 2px 6px rgba(220, 53, 69, 0.3);
}

.btn-remove-discount i {
    font-size: 14px;
    line-height: 1;
}





@media (max-width: 768px) {
    .payment-option-card {
        padding: 16px;
        margin-bottom: 16px;
    }
    
    .payment-option-header .form-check-label {
        font-size: 14px;
    }
    
    .benefit-item {
        font-size: 13px;
    }
}
</style>
`;

// Inject styles into document head
if (typeof document !== 'undefined') {
    const styleElement = document.createElement('div');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);
}
