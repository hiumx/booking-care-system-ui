import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    AppointmentCardData,
    AppointmentUITab,
    getAppointmentTypeIcon,
    getDisplayName,
    getDisplayAvatar,
    getDisplaySpecialty,
    getDisplayLabel,
} from '@/types/appointment.types';
import AppointmentActionButtons from '../AppointmentActionButtons/AppointmentActionButtons';
import PatientInfoDisplay from '../PatientInfoDisplay';
import {
    formatAppointmentDate,
    getAppointmentTypeText,
    getAppointmentTypeIconColor,
} from '../../utils/appointment-format.utils';

interface AppointmentGridCardProps {
    appointment: AppointmentCardData;
    status: AppointmentUITab;
    onCancel?: (appointment: AppointmentCardData) => void;
    onReschedule?: (appointment: AppointmentCardData, action: 'SAME_DOCTOR' | 'NEW_DOCTOR') => void;
    onReview?: (appointment: AppointmentCardData) => void;
}

const AppointmentGridCard: React.FC<AppointmentGridCardProps> = ({
    appointment,
    status,
    onCancel,
    onReschedule,
    onReview: _onReview,
}) => {
    const { t, i18n } = useTranslation('userProfile');

    // Get display values using helper functions (priority: Doctor > Service > Hospital)
    const displayName = getDisplayName(appointment);
    const displayAvatar = getDisplayAvatar(appointment);
    const displaySpecialty = getDisplaySpecialty(appointment);
    const displayLabel = getDisplayLabel(appointment);

    // Format date using shared utility
    const formattedDate = formatAppointmentDate(appointment.appointmentDate, i18n.language);

    const renderActionButtons = () => {
        // Use AppointmentActionButtons component for waiting and upcoming status
        if (status === 'waiting' || status === 'upcoming') {
            return (
                <li className="appointment-action">
                    <AppointmentActionButtons
                        appointment={appointment}
                        status={status}
                        variant="full"
                        onReschedule={onReschedule}
                        onCancel={onCancel}
                    />
                </li>
            );
        }

        // Handle other status cases
        switch (status) {
            case 'cancelled':
            case 'completed':
                return (
                    <li className="appointment-detail-btn">
                        <Link
                            to={`/user/profile?tab=appointment-detail&id=${encodeURIComponent(appointment.appointmentId)}&status=${status}`}
                            className="start-link w-100"
                        >
                            {t('appointments.card.viewDetail')}
                        </Link>
                    </li>
                );
            default:
                return null;
        }
    };

    return (
        <div className="col-xl-4 col-lg-6 col-md-12 d-flex">
            <div className="appointment-wrap appointment-grid-wrap">
                <ul>
                    <li>
                        <div className="appointment-grid-head">
                            <PatientInfoDisplay
                                appointmentId={appointment.appointmentId}
                                status={status}
                                displayAvatar={displayAvatar}
                                displayName={displayName}
                                displayLabel={displayLabel}
                                isNew={appointment.isNew}
                                displaySpecialty={displaySpecialty}
                                showSpecialty={true}
                                useFallbackImage={true}
                            />
                            <div className="grid-user-msg">
                                <span
                                    className={getAppointmentTypeIconColor(
                                        appointment.appointmentType
                                    )}
                                    title={getAppointmentTypeText(appointment.appointmentType, t)}
                                >
                                    <Link to="#">
                                        <i
                                            className={getAppointmentTypeIcon(
                                                appointment.appointmentType
                                            )}
                                        ></i>
                                    </Link>
                                </span>
                            </div>
                        </div>
                    </li>
                    <li className="appointment-info">
                        <p>
                            <i className="isax isax-calendar5"></i> {formattedDate}
                        </p>
                        <p>
                            <i className="isax isax-clock5"></i> {appointment.appointmentTime}
                        </p>
                    </li>
                    {renderActionButtons()}
                </ul>
            </div>
        </div>
    );
};

export default AppointmentGridCard;
