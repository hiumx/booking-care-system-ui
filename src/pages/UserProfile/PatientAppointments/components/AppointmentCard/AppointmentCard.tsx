import React from 'react';
import clsx from 'clsx';

import AppointmentActions from '../AppointmentActions/AppointmentActions';
import { Appointment } from '../AppointmentTypes';
import styles from '../../PatientAppointments.module.scss';

interface AppointmentCardProps {
    appointment: Appointment;
    onViewDoctorProfile?: (appointment: Appointment) => void;
    onView?: (appointment: Appointment) => void;
    onMessage?: (appointment: Appointment) => void;
    onCancel?: (appointment: Appointment) => void;
    onAttend?: (appointment: Appointment) => void;
    onReschedule?: (appointment: Appointment) => void;
    onBookAgain?: (appointment: Appointment) => void;
    onViewDetails?: (appointment: Appointment) => void;
    onAddReview?: (appointment: Appointment) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
    appointment,
    onViewDoctorProfile,
    onView,
    onMessage,
    onCancel,
    onAttend,
    onReschedule,
    onBookAgain,
    onViewDetails,
    onAddReview,
}) => {
    return (
        <div className={clsx(styles.appointmentWrap, 'appointment-wrap')}>
            <ul>
                <li>
                    <div className="patinet-information">
                        <button
                            type="button"
                            className={clsx(styles.btnLink, 'p-0')}
                            onClick={() => onViewDoctorProfile?.(appointment)}
                        >
                            <img
                                src={appointment.doctorImage}
                                alt={`${appointment.doctorName} profile`}
                            />
                        </button>
                        <div className="patient-info">
                            <p>{appointment.appointmentNumber}</p>
                            <h6>
                                <button
                                    type="button"
                                    className={clsx(styles.btnLink, styles.textStart, 'p-0')}
                                    onClick={() => onViewDoctorProfile?.(appointment)}
                                >
                                    {appointment.doctorName}
                                </button>
                            </h6>
                        </div>
                    </div>
                </li>
                <li className="appointment-info">
                    <p>
                        <i className="isax isax-clock5"></i>
                        {appointment.dateTime}
                    </p>
                    <ul className={clsx(styles.apponitmentTypes, 'd-flex apponitment-types')}>
                        <li>{appointment.visitType}</li>
                        <li>{appointment.callType}</li>
                    </ul>
                </li>
                {appointment.status !== 'completed' && (
                    <li className="mail-info-patient">
                        <ul>
                            <li>
                                <i className="isax isax-sms5"></i>
                                <a href={`mailto:${appointment.email}`}>{appointment.email}</a>
                            </li>
                            <li>
                                <i className="isax isax-call5"></i>
                                {appointment.phone}
                            </li>
                        </ul>
                    </li>
                )}

                <AppointmentActions
                    appointment={appointment}
                    onView={onView}
                    onMessage={onMessage}
                    onCancel={onCancel}
                    onAttend={onAttend}
                    onReschedule={onReschedule}
                    onBookAgain={onBookAgain}
                    onViewDetails={onViewDetails}
                    onAddReview={onAddReview}
                />
            </ul>
        </div>
    );
};

export default AppointmentCard;
