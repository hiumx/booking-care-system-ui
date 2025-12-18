import { Link, useParams, useNavigate } from 'react-router-dom';
import { useMemo, useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import { PATHS } from '@/routes/paths';
import TimeSlotBadge from '../Booking/components/TimeSlotBadge';
import styles from './BookingConfirmation.module.scss';
import clsx from 'clsx';
import { AppointmentService } from '@/services/appointment.service';
import { AppointmentResponse } from '@/types/appointment.types';
import { toast } from 'react-toastify';
import Spinner from '@/components/Spinner';
import { QRCodeSVG } from 'qrcode.react';
import medicalServiceIcon from '@/assets/img/icons/medal-icon.svg';
import specialtyIcon from '@/assets/img/specialities/speciality-icon-01.svg';
import client16 from '@/assets/img/clients/client-16.jpg';

const BookingConfirmation: React.FC = () => {
    const { t } = useTranslation('booking');
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const navigate = useNavigate();

    const [appointment, setAppointment] = useState<AppointmentResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const hasShownToast = useRef(false);

    // Fetch appointment data
    useEffect(() => {
        const fetchAppointment = async () => {
            if (!appointmentId) {
                toast.error(t('confirmation.toast.appointmentNotFound'));
                navigate(PATHS.HOME);
                return;
            }

            try {
                setLoading(true);
                const response = await AppointmentService.getAppointmentById(appointmentId);

                if (response.success && response.data) {
                    setAppointment(response.data);
                } else {
                    throw new Error(response.message || t('confirmation.toast.loadError'));
                }
            } catch (error: any) {
                console.error('Error fetching appointment:', error);
                toast.error(error.message || t('confirmation.toast.loadError'));
                navigate(PATHS.HOME);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointment();
    }, [appointmentId, navigate, t]);

    // Determine booking type based on appointment data
    const isServiceMedicalBooking = useMemo(() => {
        return !!appointment?.serviceInfo && !appointment?.doctorInfo;
    }, [appointment]);

    // Specialty booking: hospital assigns doctor mode (has specialty but no doctor yet)
    const isSpecialtyBooking = useMemo(() => {
        return (
            !!appointment?.specialtyInfo && !appointment?.doctorInfo && !appointment?.serviceInfo
        );
    }, [appointment]);

    // Show success toast when appointment is loaded
    useEffect(() => {
        if (appointment && !hasShownToast.current) {
            hasShownToast.current = true;
            const message = isSpecialtyBooking
                ? t('confirmation.toast.successSpecialty')
                : t('confirmation.toast.successPayment');
            toast.success(message);
        }
    }, [appointment, isSpecialtyBooking, t]);

    // Format appointment info from API data
    const formattedAppointmentInfo = useMemo(() => {
        if (!appointment) {
            return {
                date: t('confirmation.loading'),
                dateTime: t('confirmation.loading'),
                timeSlot: null,
                doctor: null,
                service: null,
                hospital: null,
                specialty: null,
            };
        }

        // Format appointment date
        const date = new Date(appointment.appointmentDate);
        const formattedDate = date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });

        // Parse time from appointmentTimeId (format: AT_11_00_11_30)
        let timeSlot = null;
        if (appointment.appointmentTimeId) {
            const timeMatch = appointment.appointmentTimeId.match(/AT_(\d+)_(\d+)_(\d+)_(\d+)/);
            if (timeMatch) {
                const [, startHour, startMin, endHour, endMin] = timeMatch;
                const startTime = `${startHour.padStart(2, '0')}:${startMin.padStart(2, '0')}`;
                const endTime = `${endHour.padStart(2, '0')}:${endMin.padStart(2, '0')}`;
                timeSlot = { startTime, endTime };
            }
        }

        return {
            date: formattedDate,
            dateTime: timeSlot
                ? `${timeSlot.startTime} - ${timeSlot.endTime}, ${formattedDate}`
                : formattedDate,
            timeSlot,
            doctor: appointment.doctorInfo,
            service: appointment.serviceInfo,
            hospital: appointment.hospitalInfo,
            specialty: appointment.specialtyInfo,
        };
    }, [appointment]);

    // Helper functions to extract nested ternaries
    const getAvatarSrc = () => {
        if (isServiceMedicalBooking) {
            return formattedAppointmentInfo.service?.imageUrl || medicalServiceIcon;
        }
        if (isSpecialtyBooking) {
            return (
                formattedAppointmentInfo.specialty?.imageUrl ||
                formattedAppointmentInfo.hospital?.avatarUrl ||
                specialtyIcon
            );
        }
        return formattedAppointmentInfo.doctor?.avatarUrl || client16;
    };

    const getAvatarAlt = () => {
        if (isServiceMedicalBooking) return 'service-avatar';
        if (isSpecialtyBooking) return 'specialty-avatar';
        return 'doctor-avatar';
    };

    // Get booking type label for breadcrumb
    const getBookingTypeLabel = () => {
        if (isServiceMedicalBooking) return t('confirmation.breadcrumb.medicalService');
        if (isSpecialtyBooking) return t('confirmation.breadcrumb.specialtyBooking');
        return t('confirmation.breadcrumb.doctorBooking');
    };

    const getBookingTypePath = () => {
        if (isServiceMedicalBooking) return PATHS.Service.ROOT;
        if (isSpecialtyBooking) return PATHS.HOSPITAL.ROOT;
        return PATHS.DOCTOR.ROOT;
    };

    // Helper function to render confirmation message - extracted from nested ternary
    const renderConfirmationMessage = () => {
        if (isServiceMedicalBooking) {
            const serviceName =
                formattedAppointmentInfo.service?.name ||
                t('confirmation.breadcrumb.medicalService');
            return (
                <span
                    dangerouslySetInnerHTML={{
                        __html: t('confirmation.message.service', { serviceName }),
                    }}
                />
            );
        }
        if (isSpecialtyBooking) {
            const specialtyName =
                formattedAppointmentInfo.specialty?.name || t('confirmation.info.specialty');
            return (
                <span
                    dangerouslySetInnerHTML={{
                        __html: t('confirmation.message.specialty', { specialtyName }),
                    }}
                />
            );
        }
        const position = formattedAppointmentInfo.doctor?.positionName || '';
        const doctorName =
            formattedAppointmentInfo.doctor?.fullName || t('confirmation.info.doctor');
        return (
            <span
                dangerouslySetInnerHTML={{
                    __html: t('confirmation.message.doctor', { position, doctorName }),
                }}
            />
        );
    };

    // Breadcrumb configuration - dynamic based on booking type
    const breadcrumbItems = [
        { label: t('confirmation.breadcrumb.home'), path: PATHS.HOME },
        {
            label: getBookingTypeLabel(),
            path: getBookingTypePath(),
        },
        { label: t('confirmation.breadcrumb.title'), isActive: true },
    ];

    // Show loading spinner while fetching data
    if (loading) {
        return (
            <MainLayout>
                <Breadcrumb items={breadcrumbItems} title={t('confirmation.breadcrumb.title')} />
                <div
                    className="container d-flex justify-content-center align-items-center"
                    style={{ minHeight: '400px' }}
                >
                    <Spinner />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbItems} title={t('confirmation.breadcrumb.title')} />

            <div className={clsx(styles.container, 'container')}>
                <div className="row">
                    <div className="col-12">
                        <fieldset className="d-block">
                            <div className="card booking-card">
                                <div className="card-body booking-body pb-1">
                                    <div className="row">
                                        <div className="col-lg-8 d-flex">
                                            <div className="flex-fill">
                                                <div className="card ">
                                                    <div className="card-header pt-3">
                                                        <h5 className="d-flex align-items-center flex-wrap rpw-gap-2">
                                                            <i className="isax isax-tick-circle5 text-success me-2"></i>{' '}
                                                            {t('confirmation.success')}
                                                        </h5>
                                                    </div>
                                                    <div className="card-header d-flex align-items-center flex-wrap rpw-gap-2">
                                                        <span className="avatar avatar-lg avatar-rounded me-2 flex-shrink-0">
                                                            <img
                                                                src={getAvatarSrc()}
                                                                alt={getAvatarAlt()}
                                                            />
                                                        </span>
                                                        <p className="mb-0">
                                                            {renderConfirmationMessage()}{' '}
                                                            <span
                                                                dangerouslySetInnerHTML={{
                                                                    __html: t(
                                                                        'confirmation.message.arriveEarly'
                                                                    ),
                                                                }}
                                                            />
                                                        </p>
                                                    </div>
                                                    <div className="card-body pb-1">
                                                        <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-3">
                                                            <h6>{t('confirmation.info.title')}</h6>
                                                            <Link
                                                                to={PATHS.DOCTOR.ROOT}
                                                                className="btn btn-light rounded-pill"
                                                            >
                                                                <i className="isax isax-calendar me-1"></i>{' '}
                                                                {t('confirmation.info.reschedule')}
                                                            </Link>
                                                        </div>
                                                        <div className="row">
                                                            {/* Doctor Information - only show for doctor booking */}
                                                            {!isServiceMedicalBooking &&
                                                                !isSpecialtyBooking &&
                                                                formattedAppointmentInfo.doctor && (
                                                                    <>
                                                                        <div className="col-md-6">
                                                                            <div className="mb-3">
                                                                                <div className="form-label">
                                                                                    {t(
                                                                                        'confirmation.info.doctor'
                                                                                    )}
                                                                                </div>
                                                                                <div className="form-plain-text">
                                                                                    {
                                                                                        formattedAppointmentInfo
                                                                                            .doctor
                                                                                            .positionName
                                                                                    }{' '}
                                                                                    {
                                                                                        formattedAppointmentInfo
                                                                                            .doctor
                                                                                            .fullName
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <div className="mb-3">
                                                                                <div className="form-label">
                                                                                    {t(
                                                                                        'confirmation.info.specialty'
                                                                                    )}
                                                                                </div>
                                                                                <div className="form-plain-text">
                                                                                    {formattedAppointmentInfo
                                                                                        .doctor
                                                                                        .specialtyName ||
                                                                                        t(
                                                                                            'confirmation.info.notUpdated'
                                                                                        )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}

                                                            {/* Specialty Information - only show for specialty booking (hospital assigns doctor) */}
                                                            {isSpecialtyBooking &&
                                                                formattedAppointmentInfo.specialty && (
                                                                    <>
                                                                        <div className="col-md-6">
                                                                            <div className="mb-3">
                                                                                <div className="form-label">
                                                                                    {t(
                                                                                        'confirmation.info.specialty'
                                                                                    )}
                                                                                </div>
                                                                                <div className="form-plain-text">
                                                                                    {
                                                                                        formattedAppointmentInfo
                                                                                            .specialty
                                                                                            .name
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <div className="mb-3">
                                                                                <div className="form-label">
                                                                                    {t(
                                                                                        'confirmation.info.doctor'
                                                                                    )}
                                                                                </div>
                                                                                <div className="form-plain-text text-warning">
                                                                                    <i className="isax isax-timer me-1"></i>{' '}
                                                                                    {t(
                                                                                        'confirmation.info.waitingAssignment'
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}

                                                            {/* Service Information - only show for service medical booking */}
                                                            {isServiceMedicalBooking &&
                                                                formattedAppointmentInfo.service && (
                                                                    <>
                                                                        <div className="col-md-6">
                                                                            <div className="mb-3">
                                                                                <div className="form-label">
                                                                                    {t(
                                                                                        'confirmation.info.service'
                                                                                    )}
                                                                                </div>
                                                                                <div className="form-plain-text">
                                                                                    {
                                                                                        formattedAppointmentInfo
                                                                                            .service
                                                                                            .name
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <div className="mb-3">
                                                                                <div className="form-label">
                                                                                    {t(
                                                                                        'confirmation.info.servicePrice'
                                                                                    )}
                                                                                </div>
                                                                                <div className="form-plain-text">
                                                                                    {formattedAppointmentInfo.service.price?.toLocaleString(
                                                                                        'vi-VN'
                                                                                    )}{' '}
                                                                                    VNĐ
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}

                                                            {/* Date */}
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <div className="form-label">
                                                                        {t(
                                                                            'confirmation.info.date'
                                                                        )}
                                                                    </div>
                                                                    <div className="form-plain-text">
                                                                        {
                                                                            formattedAppointmentInfo.date
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Time Slot */}
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <div className="form-label">
                                                                        {t(
                                                                            'confirmation.info.time'
                                                                        )}
                                                                    </div>
                                                                    <div className="form-plain-text">
                                                                        {formattedAppointmentInfo.timeSlot
                                                                            ? `${formattedAppointmentInfo.timeSlot.startTime} - ${formattedAppointmentInfo.timeSlot.endTime}`
                                                                            : t(
                                                                                  'confirmation.info.noTimeInfo'
                                                                              )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Time Slot Badge */}
                                                            {formattedAppointmentInfo.timeSlot && (
                                                                <div className="col-md-12">
                                                                    <div className="mb-3">
                                                                        <div className="form-label mb-2">
                                                                            {t(
                                                                                'confirmation.info.bookedSlot'
                                                                            )}
                                                                        </div>
                                                                        <div className="d-flex flex-wrap gap-2">
                                                                            <TimeSlotBadge
                                                                                startTime={
                                                                                    formattedAppointmentInfo
                                                                                        .timeSlot
                                                                                        .startTime
                                                                                }
                                                                                endTime={
                                                                                    formattedAppointmentInfo
                                                                                        .timeSlot
                                                                                        .endTime
                                                                                }
                                                                                type="success"
                                                                                minWidth="136px"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Appointment Type - show for doctor and specialty booking */}
                                                            {!isServiceMedicalBooking && (
                                                                <div className="col-md-6">
                                                                    <div className="mb-3">
                                                                        <div className="form-label">
                                                                            {t(
                                                                                'confirmation.info.appointmentType'
                                                                            )}
                                                                        </div>
                                                                        <div className="form-plain-text">
                                                                            {appointment?.appointmentType ===
                                                                            'IN_PERSON'
                                                                                ? t(
                                                                                      'confirmation.info.inPerson'
                                                                                  )
                                                                                : t(
                                                                                      'confirmation.info.online'
                                                                                  )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Hospital Information */}
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <div className="form-label">
                                                                        {t(
                                                                            'confirmation.info.location'
                                                                        )}
                                                                    </div>
                                                                    <div className="form-plain-text">
                                                                        {formattedAppointmentInfo
                                                                            .hospital?.name ||
                                                                            t(
                                                                                'confirmation.info.notUpdated'
                                                                            )}
                                                                        <br />
                                                                        <small className="text-muted">
                                                                            {
                                                                                formattedAppointmentInfo
                                                                                    .hospital
                                                                                    ?.address
                                                                            }
                                                                        </small>
                                                                        {formattedAppointmentInfo
                                                                            .hospital?.address && (
                                                                            <div>
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-link p-0 text-primary"
                                                                                    onClick={() => {
                                                                                        /* Show map */
                                                                                    }}
                                                                                >
                                                                                    {t(
                                                                                        'confirmation.info.viewLocation'
                                                                                    )}
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Specialty Booking Alert - waiting for doctor assignment */}
                                                {isSpecialtyBooking && (
                                                    <div className="card border-warning">
                                                        <div className="card-body">
                                                            <div className="d-flex align-items-start">
                                                                <i className="isax isax-info-circle text-warning me-3 mt-1"></i>
                                                                <div>
                                                                    <h6 className="mb-1 text-warning">
                                                                        {t(
                                                                            'confirmation.specialtyAlert.title'
                                                                        )}
                                                                    </h6>
                                                                    <p
                                                                        className="mb-0 text-muted"
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: t(
                                                                                'confirmation.specialtyAlert.message',
                                                                                {
                                                                                    specialtyName:
                                                                                        formattedAppointmentInfo
                                                                                            .specialty
                                                                                            ?.name,
                                                                                }
                                                                            ),
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="card">
                                                    <div className="card-body d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between">
                                                        <div>
                                                            <h6 className="mb-1">
                                                                {t('confirmation.support.title')}
                                                            </h6>
                                                            <p className="mb-0">
                                                                {t(
                                                                    'confirmation.support.description'
                                                                )}
                                                            </p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="btn btn-light rounded-pill"
                                                            onClick={() => {
                                                                if (
                                                                    formattedAppointmentInfo
                                                                        .hospital?.phone
                                                                ) {
                                                                    window.open(
                                                                        `tel:${formattedAppointmentInfo.hospital.phone}`
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            <i className="isax isax-call5 me-1"></i>{' '}
                                                            {t('confirmation.support.callUs')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 d-flex">
                                            <div className="card flex-fill">
                                                <div className="card-body d-flex flex-column justify-content-between">
                                                    <div className="text-center">
                                                        <h6 className="fs-14 mb-2">
                                                            {t('confirmation.qrCode.bookingId')}
                                                        </h6>
                                                        <span className="booking-id-badge mb-3">
                                                            {appointmentId
                                                                ?.substring(0, 8)
                                                                .toUpperCase() || 'LOADING'}
                                                        </span>
                                                        <span className="d-block mb-3">
                                                            <QRCodeSVG
                                                                value={`${globalThis.location.origin}/user/profile?tab=appointment-detail&id=${appointmentId}&status=${isSpecialtyBooking ? 'waiting' : 'upcoming'}`}
                                                                size={150}
                                                                level="M"
                                                                marginSize={4}
                                                                bgColor="#ffffff"
                                                                fgColor="#000000"
                                                            />
                                                        </span>
                                                        <p>
                                                            {t(
                                                                'confirmation.qrCode.scanDescription'
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <button
                                                            type="button"
                                                            className="btn w-100 mb-3 btn-md btn-dark prev_btns inline-flex align-items-center rounded-pill"
                                                            onClick={() => {
                                                                /* Add to calendar */
                                                            }}
                                                        >
                                                            {t('confirmation.qrCode.addToCalendar')}
                                                        </button>
                                                        <Link
                                                            to={getBookingTypePath()}
                                                            className="btn w-100 btn-md btn-primary-gradient next_btns inline-flex align-items-center rounded-pill"
                                                        >
                                                            {t('confirmation.qrCode.newBooking')}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default BookingConfirmation;
