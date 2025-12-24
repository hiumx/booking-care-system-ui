import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ConfirmSection.module.scss';
import { PATHS } from '@/routes/paths';
import { useDoctorInfo } from '../../hooks';
import { useAppSelector } from '@/store/hooks';
import { selectSelectedDate, selectSelectedSlots } from '@/store/selectors/schedule.selectors';
import TimeSlotBadge from '../../components/TimeSlotBadge';
import client16 from '@/assets/img/clients/client-16.jpg';
import paymentQrIcon from '@/assets/img/icons/payment-qr.svg';

interface ConfirmSectionProps {
    handleGoBack: () => void;
}

const ConfirmSection: React.FC<ConfirmSectionProps> = ({ handleGoBack }) => {
    const { t, i18n } = useTranslation('booking');
    const doctor = useDoctorInfo();

    // Get selected date and time slots
    const selectedDate = useAppSelector(selectSelectedDate);
    const selectedSlots = useAppSelector(selectSelectedSlots);

    // Format date and time for display
    const formattedAppointmentInfo = useMemo(() => {
        const notSelected = t('confirmSection.notSelected');
        if (!selectedDate) {
            return {
                date: notSelected,
                dateTime: notSelected,
                slots: [],
                totalDuration: 0,
            };
        }

        const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
        const date = new Date(selectedDate);
        const formattedDate = date.toLocaleDateString(locale, {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });

        let formattedDateTime = formattedDate;
        let sortedSlots: typeof selectedSlots = [];
        let totalDuration = 0;

        if (selectedSlots && selectedSlots.length > 0) {
            // Sort slots by start time
            sortedSlots = [...selectedSlots].sort((a, b) => a.startTime.localeCompare(b.startTime));

            const firstSlot = sortedSlots[0];
            const lastSlot = sortedSlots[sortedSlots.length - 1];
            formattedDateTime = `${firstSlot.startTime} - ${lastSlot.endTime}, ${formattedDate}`;

            // Calculate total duration (assuming each slot is 30 minutes)
            totalDuration = sortedSlots.length * 30;
        }

        return {
            date: formattedDate,
            dateTime: formattedDateTime,
            slots: sortedSlots,
            totalDuration,
        };
    }, [selectedDate, selectedSlots, t, i18n.language]);

    return (
        <fieldset className="d-block">
            <div className="card booking-card">
                <div className="card-body booking-body pb-1">
                    <div className="row">
                        <div className="col-lg-8 d-flex">
                            <div className="flex-fill">
                                <div className="card ">
                                    <div className="card-header pt-3">
                                        <h5 className="d-flex align-items-center flex-wrap rpw-gap-2">
                                            <i className="isax isax-tick-circle5 text-success me-2"></i>
                                            {t('confirmSection.success')}
                                        </h5>
                                    </div>
                                    <div className="card-header d-flex align-items-center flex-wrap rpw-gap-2">
                                        <span className="avatar avatar-lg avatar-rounded me-2 flex-shrink-0">
                                            <img src={client16} alt="patient-avatar" />
                                        </span>
                                        <p className="mb-0">
                                            {t('confirmSection.message', {
                                                doctorName: doctor.name,
                                            })}
                                        </p>
                                    </div>
                                    <div className="card-body pb-1">
                                        <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between mb-3">
                                            <h6>{t('confirmSection.info.title')}</h6>
                                            <Link
                                                to={PATHS.DOCTOR.ROOT}
                                                className="btn btn-light rounded-pill"
                                            >
                                                <i className="isax isax-calendar me-1"></i>
                                                {t('confirmSection.info.reschedule')}
                                            </Link>
                                        </div>
                                        <div className="row">
                                            {/* Doctor Information */}
                                            {doctor?.name && (
                                                <>
                                                    <div className="col-md-6">
                                                        <div className="mb-3">
                                                            <div className="form-label">
                                                                {t('confirmSection.info.doctor')}
                                                            </div>
                                                            <div className="form-plain-text">
                                                                {doctor.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="mb-3">
                                                            <div className="form-label">
                                                                {t('confirmSection.info.specialty')}
                                                            </div>
                                                            <div className="form-plain-text">
                                                                {doctor.specialty ||
                                                                    t(
                                                                        'confirmSection.info.notUpdated'
                                                                    )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {/* Date */}
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <div className="form-label">
                                                        {t('confirmSection.info.date')}
                                                    </div>
                                                    <div className="form-plain-text">
                                                        {formattedAppointmentInfo.date}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Time Slots */}
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <div className="form-label">
                                                        {t('confirmSection.info.totalDuration')}
                                                    </div>
                                                    <div className="form-plain-text">
                                                        {formattedAppointmentInfo.totalDuration > 0
                                                            ? t(
                                                                  'confirmSection.info.durationFormat',
                                                                  {
                                                                      duration:
                                                                          formattedAppointmentInfo.totalDuration,
                                                                      count: formattedAppointmentInfo
                                                                          .slots.length,
                                                                  }
                                                              )
                                                            : t('confirmSection.notSelected')}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Time Slots Detail */}
                                            {formattedAppointmentInfo.slots.length > 0 && (
                                                <div className="col-md-12">
                                                    <div className="mb-3">
                                                        <div className="form-label mb-2">
                                                            {t('confirmSection.info.bookedSlots')}
                                                        </div>
                                                        <div className="d-flex flex-wrap gap-2">
                                                            {formattedAppointmentInfo.slots.map(
                                                                (slot) => (
                                                                    <TimeSlotBadge
                                                                        key={`${slot.startTime}-${slot.endTime}`}
                                                                        startTime={slot.startTime}
                                                                        endTime={slot.endTime}
                                                                        type="success"
                                                                        minWidth="136px"
                                                                    />
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Clinic Information */}
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="form-label">
                                                        {t('confirmSection.info.appointmentType')}
                                                    </label>
                                                    <div className="form-plain-text">
                                                        {t('confirmSection.info.inPerson')}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="form-label">
                                                        {t('confirmSection.info.location')}
                                                    </label>
                                                    <div className="form-plain-text">
                                                        {doctor.location ||
                                                            t(
                                                                'confirmSection.info.notUpdated'
                                                            )}{' '}
                                                        {doctor.location && (
                                                            <a
                                                                href="javascript:void(0);"
                                                                className="text-primary"
                                                            >
                                                                {t(
                                                                    'confirmSection.info.viewLocation'
                                                                )}
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-body d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between">
                                        <div>
                                            <h6 className="mb-1">
                                                {t('confirmSection.support.title')}
                                            </h6>
                                            <p className="mb-0">
                                                {t('confirmSection.support.description')}
                                            </p>
                                        </div>
                                        <a
                                            href="javascript:void(0);"
                                            className="btn btn-light rounded-pill"
                                        >
                                            <i className="isax isax-call5 me-1"></i>
                                            {t('confirmSection.support.callUs')}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 d-flex">
                            <div className="card flex-fill">
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div className="text-center">
                                        <h6 className="fs-14 mb-2">
                                            {t('confirmSection.qrCode.bookingId')}
                                        </h6>
                                        <span className="booking-id-badge mb-3">DCRA12565</span>
                                        <span className="d-block mb-3">
                                            <img src={paymentQrIcon} alt="" />
                                        </span>
                                        <p>{t('confirmSection.qrCode.scanDescription')}</p>
                                    </div>
                                    <div>
                                        <a
                                            href="javascript:void(0);"
                                            className="btn w-100 mb-3 btn-md btn-dark prev_btns inline-flex align-items-center rounded-pill"
                                        >
                                            {t('confirmSection.qrCode.addToCalendar')}
                                        </a>
                                        <Link
                                            to={PATHS.DOCTOR.ROOT}
                                            className="btn w-100 btn-md btn-primary-gradient next_btns inline-flex align-items-center rounded-pill"
                                        >
                                            {t('confirmSection.qrCode.newBooking')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div onClick={handleGoBack} className={styles.backToBookings}>
                    <i className="isax isax-arrow-left-2 me-1"></i>
                    {t('confirmSection.backToBookings')}
                </div>
            </div>
        </fieldset>
    );
};

export default ConfirmSection;
