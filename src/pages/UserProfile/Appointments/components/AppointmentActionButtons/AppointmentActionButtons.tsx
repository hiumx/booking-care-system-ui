import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppointmentCardData, AppointmentUITab } from '@/types/appointment.types';

interface AppointmentActionButtonsProps {
    appointment: AppointmentCardData;
    status: AppointmentUITab;
    onReschedule?: (appointment: AppointmentCardData, action: 'SAME_DOCTOR' | 'NEW_DOCTOR') => void;
    onCancel?: (appointment: AppointmentCardData) => void;
    variant?: 'minimal' | 'full';
}

/**
 * Reusable component for rendering appointment action buttons
 * Supports both minimal (view only) and full (all actions) variants
 */
const AppointmentActionButtons: React.FC<AppointmentActionButtonsProps> = ({
    appointment,
    status,
    onReschedule,
    onCancel,
    variant = 'full',
}) => {
    const { t } = useTranslation('userProfile');

    // Minimal variant - only show view details button
    if (variant === 'minimal') {
        return (
            <li className="appointment-action">
                <ul>
                    <li>
                        <Link
                            to={`/user/profile?tab=appointment-detail&id=${encodeURIComponent(appointment.appointmentId)}&status=${status}`}
                            title={t('appointments.actions.viewDetail')}
                        >
                            <i className="isax isax-eye4"></i>
                        </Link>
                    </li>
                </ul>
            </li>
        );
    }

    // Check if this is a service appointment (no doctor, has service)
    const isServiceAppointment = !appointment.doctorInfo?.id && !!appointment.serviceInfo?.id;

    // Full variant - render actions based on status
    const renderActionButtons = () => {
        // Service appointments: only show view icon + cancel
        if (isServiceAppointment) {
            return (
                <>
                    <li>
                        <Link
                            to={`/user/profile?tab=appointment-detail&id=${encodeURIComponent(appointment.appointmentId)}&status=${status}`}
                            title={t('appointments.actions.viewDetail')}
                        >
                            <i className="isax isax-eye4"></i>
                        </Link>
                    </li>
                    {/* Cancel appointment */}
                    <li>
                        <Link
                            to="#"
                            title={t('appointments.actions.cancelAppointment')}
                            onClick={(e) => {
                                e.preventDefault();
                                onCancel?.(appointment);
                            }}
                        >
                            <i className="isax isax-close-circle5"></i>
                        </Link>
                    </li>
                </>
            );
        }

        // Doctor appointments: show all actions
        return (
            <>
                <li>
                    <Link
                        to={`/user/profile?tab=appointment-detail&id=${encodeURIComponent(appointment.appointmentId)}&status=${status}`}
                        title={t('appointments.actions.viewDetail')}
                    >
                        <i className="isax isax-eye4"></i>
                    </Link>
                </li>
                {/* Reschedule with same doctor - only show if has doctor */}
                {appointment.doctorInfo?.id && (
                    <>
                        <li>
                            <Link
                                to="#"
                                title={t('appointments.actions.rescheduleWithSameDoctor')}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onReschedule?.(appointment, 'SAME_DOCTOR');
                                }}
                            >
                                <i className="isax isax-calendar-edit"></i>
                            </Link>
                        </li>
                        {/* Choose new doctor */}
                        <li>
                            <Link
                                to="#"
                                title={t('appointments.actions.chooseNewDoctor')}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onReschedule?.(appointment, 'NEW_DOCTOR');
                                }}
                            >
                                <i className="isax isax-user-search"></i>
                            </Link>
                        </li>
                    </>
                )}

                {/* Cancel appointment */}
                <li>
                    <Link
                        to="#"
                        title={t('appointments.actions.cancelAppointment')}
                        onClick={(e) => {
                            e.preventDefault();
                            onCancel?.(appointment);
                        }}
                    >
                        <i className="isax isax-close-circle5"></i>
                    </Link>
                </li>
            </>
        );
    };

    const renderStatusBadge = () => {
        switch (status) {
            case 'cancelled':
                return (
                    <span className="badge badge-danger">
                        <i className="isax isax-close-circle me-1"></i>
                        {t('appointments.actions.statusCancelled')}
                    </span>
                );
            case 'completed':
                return (
                    <span className="badge badge-success">
                        <i className="isax isax-tick-circle me-1"></i>
                        {t('appointments.actions.statusCompleted')}
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <li className="appointment-action">
                <ul>{renderActionButtons()}</ul>
            </li>
            <li className="appointment-detail-btn">{renderStatusBadge()}</li>
        </>
    );
};

export default AppointmentActionButtons;
