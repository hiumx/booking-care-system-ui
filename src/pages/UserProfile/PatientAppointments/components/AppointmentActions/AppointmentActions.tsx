import React from 'react';
import clsx from 'clsx';

import { Appointment } from '../AppointmentTypes';
import styles from '../../PatientAppointments.module.scss';

interface AppointmentActionsProps {
    appointment: Appointment;
    onView?: (appointment: Appointment) => void;
    onMessage?: (appointment: Appointment) => void;
    onCancel?: (appointment: Appointment) => void;
    onAttend?: (appointment: Appointment) => void;
    onReschedule?: (appointment: Appointment) => void;
    onBookAgain?: (appointment: Appointment) => void;
    onViewDetails?: (appointment: Appointment) => void;
    onAddReview?: (appointment: Appointment) => void;
}

const AppointmentActions: React.FC<AppointmentActionsProps> = ({
    appointment,
    onMessage,
    onCancel,
    onAttend,
    onReschedule,
    onBookAgain,
    onViewDetails,
    onAddReview,
}) => {
    const handleOpenReviewModal = () => {
        onAddReview?.(appointment);
    };

    const renderActions = () => {
        switch (appointment.status) {
            case 'upcoming':
                return (
                    <>
                        <li className="appointment-action">
                            <ul>
                                <li>
                                    <button
                                        type="button"
                                        className={clsx(styles.btnIcon)}
                                        aria-label="Nhắn tin cho bác sĩ"
                                        onClick={() => onMessage?.(appointment)}
                                    >
                                        <i className="isax isax-messages-25"></i>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        className={clsx(styles.btnIcon)}
                                        aria-label="Hủy cuộc hẹn"
                                        onClick={() => onCancel?.(appointment)}
                                    >
                                        <i className="isax isax-close-circle5"></i>
                                    </button>
                                </li>
                            </ul>
                        </li>
                        <li className={clsx(styles.appointmentDetailBtn, 'appointment-detail-btn')}>
                            <button
                                type="button"
                                className="btn btn-md btn-primary-gradient"
                                onClick={() => onAttend?.(appointment)}
                            >
                                <i className="isax isax-calendar-tick5 me-1"></i> Tham gia
                            </button>
                        </li>
                    </>
                );
            case 'cancelled':
                return (
                    <li className={clsx(styles.appointmentDetailBtn, 'appointment-detail-btn')}>
                        <button
                            type="button"
                            className="btn btn-md btn-primary-gradient"
                            onClick={() => onReschedule?.(appointment)}
                        >
                            <i className="isax isax-calendar-tick5 me-1"></i> Đặt lại lịch
                        </button>
                    </li>
                );
            case 'completed':
                return (
                    <>
                        <li>
                            <button
                                type="button"
                                className={clsx(styles.btnLink, 'text-decoration-underline')}
                                onClick={handleOpenReviewModal}
                            >
                                Đánh giá
                            </button>
                        </li>
                        <li
                            className={clsx(
                                styles.appointmentDetailBtn,
                                'appointment-detail-btn d-flex align-items-center gap-3 flex-wrap'
                            )}
                        >
                            <button
                                type="button"
                                className="btn btn-md btn-dark"
                                onClick={() => onBookAgain?.(appointment)}
                            >
                                Đặt lại <i className="isax isax-arrow-right-3 ms-1"></i>
                            </button>
                            <button
                                type="button"
                                className="btn btn-md btn-primary-gradient"
                                onClick={() => onViewDetails?.(appointment)}
                            >
                                Xem chi tiết <i className="isax isax-arrow-right-3 ms-1"></i>
                            </button>
                        </li>
                    </>
                );
            default:
                return null;
        }
    };

    return <>{renderActions()}</>;
};

export default AppointmentActions;
