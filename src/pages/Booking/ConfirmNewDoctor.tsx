import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import BookingLayout from '@/layouts/BookingLayout';
import { AppointmentService } from '@/services/appointment.service';
import { DoctorService } from '@/services/doctor.service';
import { AppointmentResponse } from '@/types/appointment.types';
import { DoctorResponse } from '@/types/doctor.types';
import { PATHS } from '@/routes/paths';
import styles from './Booking.module.scss';
import clsx from 'clsx';
import FullScreenSpinner from '@/components/FullScreenSpinner';
import { formatAppointmentTime } from '@/utils/appointment-utils';
import client16 from '@/assets/img/clients/client-16.jpg';

/**
 * ConfirmNewDoctor Page - Option 2
 * Hospital assigns new doctor, patient confirms
 * After confirmation, redirect to ChooseNewDoctor for price comparison (skip DateTimeSection)
 */
const ConfirmNewDoctor: React.FC = () => {
    const [isConfirming, setIsConfirming] = useState(false);
    const [appointmentData, setAppointmentData] = useState<AppointmentResponse | null>(null);
    const [newDoctor, setNewDoctor] = useState<DoctorResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Price comparison state
    const [priceDifference, setPriceDifference] = useState<{
        type: 'equal' | 'higher' | 'lower' | 'none';
        amount: number;
    } | null>(null);

    const navigate = useNavigate();
    const { t, i18n } = useTranslation('booking');
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const [searchParams] = useSearchParams();

    const rescheduleToken = searchParams.get('token');
    const newDoctorId = searchParams.get('newDoctorId');

    // Calculate price difference between original and new doctor
    const calculatePriceDifference = () => {
        if (!appointmentData || !newDoctor) return;

        const originalPrice = appointmentData.consultationFees || 0;
        const newDoctorFullPrice = newDoctor.prices?.[0]?.amount || 0;
        const newPrice = newDoctorFullPrice * 0.3;

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

    useEffect(() => {
        if (!appointmentId || !rescheduleToken || !newDoctorId) {
            toast.error(t('confirmNewDoctor.toast.invalidInfo'));
            navigate(PATHS.HOME);
            return;
        }

        loadData();
    }, [appointmentId, newDoctorId]);

    useEffect(() => {
        if (appointmentData && newDoctor) {
            calculatePriceDifference();
        }
    }, [appointmentData, newDoctor]);

    const loadData = async () => {
        try {
            setIsLoading(true);

            const appointmentResponse = await AppointmentService.getAppointmentById(appointmentId!);
            if (!appointmentResponse.success || !appointmentResponse.data) {
                throw new Error(t('confirmNewDoctor.toast.loadAppointmentError'));
            }
            setAppointmentData(appointmentResponse.data);

            const doctorResponse = await DoctorService.getDoctorById(newDoctorId!);
            if (!doctorResponse.success || !doctorResponse.data) {
                throw new Error(t('confirmNewDoctor.toast.loadDoctorError'));
            }
            setNewDoctor(doctorResponse.data);
        } catch (error: unknown) {
            console.error('Error loading data:', error);
            const errorMessage =
                error instanceof Error ? error.message : t('confirmNewDoctor.toast.loadError');
            toast.error(errorMessage);
            navigate(PATHS.HOME);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = async () => {
        if (!appointmentId || !rescheduleToken || !newDoctorId) {
            toast.error(t('confirmNewDoctor.toast.invalidInfo'));
            return;
        }

        if (!appointmentData || !newDoctor) {
            toast.error(t('confirmNewDoctor.toast.notEnoughInfo'));
            return;
        }

        setIsConfirming(true);

        try {
            const newAppointmentDate = appointmentData.appointmentDate;
            const newAppointmentTimeId = appointmentData.appointmentTimeId;
            const doctorPriceId = newDoctor.prices?.[0]?.id || '';

            const response = await AppointmentService.chooseNewDoctor({
                appointmentId,
                rescheduleToken,
                newDoctorId,
                newAppointmentDate,
                newAppointmentTimeId,
                doctorPriceId,
                isStaffAssigned: true,
            });

            if (response.success && response.data) {
                const { action } = response.data;

                if (action === 'direct_update') {
                    toast.success(t('confirmNewDoctor.toast.updateSuccess'));
                    navigate(PATHS.BOOKING.CONFIRMATION.replace(':appointmentId', appointmentId));
                } else if (action === 'payment_required') {
                    toast.info(t('confirmNewDoctor.toast.paymentRequired'));
                    navigate(
                        `${PATHS.BOOKING.CHOOSE_NEW_DOCTOR.replace(':doctorId', newDoctorId)}?rescheduleFor=${appointmentId}&token=${rescheduleToken}&skipDateTime=true&isStaffAssigned=true&newDoctorId=${newDoctorId}`
                    );
                } else if (action === 'refund_created') {
                    toast.success(t('confirmNewDoctor.toast.refundSuccess'));
                    navigate(PATHS.BOOKING.CONFIRMATION.replace(':appointmentId', appointmentId));
                }
            } else {
                throw new Error(response.message || t('confirmNewDoctor.toast.updateError'));
            }
        } catch (error: unknown) {
            console.error('Error in handleConfirm:', error);
            const errorMessage =
                error instanceof Error ? error.message : t('confirmNewDoctor.toast.error');
            toast.error(errorMessage);
        } finally {
            setIsConfirming(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        const locale = i18n.language === 'en' ? 'en-US' : 'vi-VN';
        return new Date(dateString).toLocaleDateString(locale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
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
                                    message={t('confirmNewDoctor.loading')}
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
                            {/* Page Title */}
                            <div className="text-center mb-4">
                                <h4 className="fw-bold mb-2">{t('confirmNewDoctor.title')}</h4>
                                <p className="text-muted mb-0">{t('confirmNewDoctor.subtitle')}</p>
                            </div>

                            <div className="row g-4">
                                {/* Left Column - Original Appointment */}
                                <div className="col-lg-6">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h6 className="card-title mb-3">
                                                <i className="isax isax-calendar-1 me-2 text-muted"></i>{' '}
                                                {t('confirmNewDoctor.currentAppointment.title')}
                                            </h6>

                                            {/* Original Doctor */}
                                            <div className="d-flex align-items-center mb-3">
                                                <img
                                                    src={
                                                        appointmentData?.doctorInfo?.avatarUrl ||
                                                        client16
                                                    }
                                                    alt="doctor"
                                                    className="rounded-circle me-3"
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                                <div>
                                                    <p className="mb-0 fw-medium">
                                                        {appointmentData?.doctorInfo?.positionName}{' '}
                                                        {appointmentData?.doctorInfo?.fullName ||
                                                            t(
                                                                'confirmNewDoctor.currentAppointment.doctor'
                                                            )}
                                                    </p>
                                                    <small className="text-muted">
                                                        {appointmentData?.doctorInfo
                                                            ?.specialtyName ||
                                                            t(
                                                                'confirmNewDoctor.currentAppointment.notUpdated'
                                                            )}
                                                    </small>
                                                </div>
                                            </div>

                                            <hr />

                                            {/* Appointment Details */}
                                            <div className="row g-3">
                                                <div className="col-6">
                                                    <small className="text-muted d-block mb-1">
                                                        {t(
                                                            'confirmNewDoctor.currentAppointment.date'
                                                        )}
                                                    </small>
                                                    <p className="mb-0 fw-medium">
                                                        {formatDate(
                                                            appointmentData?.appointmentDate || ''
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="col-6">
                                                    <small className="text-muted d-block mb-1">
                                                        {t(
                                                            'confirmNewDoctor.currentAppointment.time'
                                                        )}
                                                    </small>
                                                    <p className="mb-0 fw-medium">
                                                        {formatAppointmentTime(
                                                            appointmentData?.appointmentTimeId || ''
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="col-12">
                                                    <small className="text-muted d-block mb-1">
                                                        {t(
                                                            'confirmNewDoctor.currentAppointment.location'
                                                        )}
                                                    </small>
                                                    <p className="mb-0 fw-medium">
                                                        {appointmentData?.hospitalInfo?.name ||
                                                            t(
                                                                'confirmNewDoctor.currentAppointment.notUpdated'
                                                            )}
                                                    </p>
                                                </div>
                                                <div className="col-12">
                                                    <small className="text-muted d-block mb-1">
                                                        {t(
                                                            'confirmNewDoctor.currentAppointment.depositPaid'
                                                        )}
                                                    </small>
                                                    <p className="mb-0 fw-medium text-primary">
                                                        {formatPrice(
                                                            appointmentData?.consultationFees || 0
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - New Doctor */}
                                <div className="col-lg-6">
                                    <div className="card h-100 border-primary">
                                        <div className="card-body">
                                            <h6 className="card-title mb-3">
                                                <i className="isax isax-user-tick me-2 text-primary"></i>{' '}
                                                {t('confirmNewDoctor.newDoctor.title')}
                                            </h6>

                                            {newDoctor && (
                                                <>
                                                    {/* New Doctor Info */}
                                                    <div className="d-flex align-items-center mb-3">
                                                        <img
                                                            src={newDoctor.avatarUrl || client16}
                                                            alt="new doctor"
                                                            className="rounded-circle me-3"
                                                            style={{
                                                                width: '50px',
                                                                height: '50px',
                                                                objectFit: 'cover',
                                                            }}
                                                        />
                                                        <div>
                                                            <p className="mb-0 fw-medium">
                                                                {newDoctor.position?.name}{' '}
                                                                {newDoctor.lastName}{' '}
                                                                {newDoctor.firstName}
                                                            </p>
                                                            <small className="text-muted">
                                                                {newDoctor.specialty?.name}
                                                            </small>
                                                        </div>
                                                    </div>

                                                    <hr />

                                                    {/* New Doctor Details */}
                                                    <div className="row g-3">
                                                        <div className="col-6">
                                                            <small className="text-muted d-block mb-1">
                                                                {t(
                                                                    'confirmNewDoctor.newDoctor.hospital'
                                                                )}
                                                            </small>
                                                            <p className="mb-0 fw-medium">
                                                                {newDoctor.hospital?.name}
                                                            </p>
                                                        </div>
                                                        <div className="col-6">
                                                            <small className="text-muted d-block mb-1">
                                                                {t(
                                                                    'confirmNewDoctor.newDoctor.experience'
                                                                )}
                                                            </small>
                                                            <p className="mb-0 fw-medium">
                                                                {newDoctor.yearsOfExperience}{' '}
                                                                {t(
                                                                    'confirmNewDoctor.newDoctor.years'
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className="col-12">
                                                            <small className="text-muted d-block mb-1">
                                                                {t(
                                                                    'confirmNewDoctor.newDoctor.newDeposit'
                                                                )}
                                                            </small>
                                                            <p className="mb-0 fw-medium text-primary">
                                                                {formatPrice(
                                                                    (newDoctor.prices?.[0]
                                                                        ?.amount || 0) * 0.3
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Price Difference Notice */}
                            {priceDifference && priceDifference.type !== 'none' && (
                                <div className="card mt-4">
                                    <div className="card-body py-3">
                                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                            <div className="d-flex align-items-center">
                                                {priceDifference.type === 'higher' && (
                                                    <>
                                                        <i className="isax isax-arrow-up-3 text-warning me-2"></i>
                                                        <span>
                                                            {t(
                                                                'confirmNewDoctor.priceDifference.higher'
                                                            )}{' '}
                                                            <strong className="text-warning">
                                                                {formatPrice(
                                                                    priceDifference.amount
                                                                )}
                                                            </strong>{' '}
                                                            {t(
                                                                'confirmNewDoctor.priceDifference.higherNote'
                                                            )}
                                                        </span>
                                                    </>
                                                )}
                                                {priceDifference.type === 'lower' && (
                                                    <>
                                                        <i className="isax isax-arrow-down-2 text-success me-2"></i>
                                                        <span>
                                                            {t(
                                                                'confirmNewDoctor.priceDifference.lower'
                                                            )}{' '}
                                                            <strong className="text-success">
                                                                {formatPrice(
                                                                    priceDifference.amount
                                                                )}
                                                            </strong>{' '}
                                                            {t(
                                                                'confirmNewDoctor.priceDifference.lowerNote'
                                                            )}
                                                        </span>
                                                    </>
                                                )}
                                                {priceDifference.type === 'equal' && (
                                                    <>
                                                        <i className="isax isax-tick-circle text-primary me-2"></i>
                                                        <span>
                                                            {t(
                                                                'confirmNewDoctor.priceDifference.equal'
                                                            )}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="d-flex justify-content-end gap-3 mt-4">
                                <button
                                    type="button"
                                    className="btn btn-primary-gradient d-inline-flex align-items-center rounded-pill px-4"
                                    onClick={handleConfirm}
                                    disabled={isConfirming}
                                >
                                    {isConfirming ? (
                                        <>
                                            <output
                                                className="spinner-border spinner-border-sm me-2"
                                                aria-hidden="true"
                                            ></output>{' '}
                                            {t('confirmNewDoctor.actions.processing')}
                                        </>
                                    ) : (
                                        <>
                                            <i className="isax isax-tick-circle me-2"></i>
                                            {priceDifference?.type === 'higher'
                                                ? t('confirmNewDoctor.actions.confirmAndPay')
                                                : t('confirmNewDoctor.actions.confirmNewDoctor')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BookingLayout>
    );
};

export default ConfirmNewDoctor;
