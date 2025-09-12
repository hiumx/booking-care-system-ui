import React, { useState } from 'react';
import { Appointment } from '../AppointmentTypes';
import CancelReasonModal from './components/CancelReasonModal';
import styles from './AppointmentDetail.module.scss';

interface AppointmentDetailProps {
    appointment: Appointment;
    onBack: () => void;
    onMessage: (appointment: Appointment) => void;
    onCancel: (appointment: Appointment) => void;
    onViewDoctorProfile: (appointment: Appointment) => void;
}

const AppointmentDetail: React.FC<AppointmentDetailProps> = ({
    appointment,
    onBack,
    onMessage,
    onCancel,
    onViewDoctorProfile,
}) => {
    const [isCancelReasonModalOpen, setIsCancelReasonModalOpen] = useState(false);
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'upcoming':
                return <span className="badge bg-primary">Sắp tới</span>;
            case 'completed':
                return <span className="badge bg-success">Hoàn thành</span>;
            case 'cancelled':
                return <span className="badge bg-danger">Đã hủy</span>;
            default:
                return <span className="badge bg-secondary">{status}</span>;
        }
    };

    const getAppointmentTypeIcon = (callType: string) => {
        switch (callType.toLowerCase()) {
            case 'cuộc gọi video':
                return <i className="isax isax-video5 text-green" aria-hidden="true"></i>;
            case 'cuộc gọi âm thanh':
                return <i className="isax isax-call5 text-green" aria-hidden="true"></i>;
            case 'chat':
                return <i className="isax isax-messages-25 text-green" aria-hidden="true"></i>;
            case 'direct visit':
            case 'khám trực tiếp':
                return <i className="isax isax-hospital5 text-green" aria-hidden="true"></i>;
            default:
                return <i className="isax isax-hospital5 text-green" aria-hidden="true"></i>;
        }
    };

    const handleShowCancelReason = () => {
        setIsCancelReasonModalOpen(true);
    };

    const handleCloseCancelReasonModal = () => {
        setIsCancelReasonModalOpen(false);
    };

    return (
        <div className={styles.appointmentDetailContainer}>
            {/* Dashboard Header */}
            <div className={styles.dashboardHeader}>
                <div className={styles.headerBack}>
                    <button
                        onClick={onBack}
                        className={styles.backArrow}
                        type="button"
                        aria-label="Quay lại danh sách lịch hẹn"
                    >
                        <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
                    </button>
                    <h3>Chi tiết lịch hẹn</h3>
                </div>
            </div>

            <div className={styles.appointmentDetailsWrap}>
                {/* Appointment Detail Card */}
                <div className={`${styles.appointmentWrap} ${styles.appointmentDetailCard}`}>
                    <ul>
                        <li>
                            <div className={styles.patientInformation}>
                                <button
                                    onClick={() => onViewDoctorProfile(appointment)}
                                    type="button"
                                    aria-label={`Xem thông tin ${appointment.doctorName}`}
                                >
                                    <img
                                        src={appointment.doctorImage}
                                        alt={`Ảnh đại diện của ${appointment.doctorName}`}
                                    />
                                </button>
                                <div className={styles.patientInfo}>
                                    <p>{appointment.appointmentNumber}</p>
                                    <h6>
                                        <button
                                            onClick={() => onViewDoctorProfile(appointment)}
                                            type="button"
                                            aria-label={`Xem thông tin chi tiết của ${appointment.doctorName}`}
                                        >
                                            {appointment.doctorName}
                                        </button>
                                    </h6>
                                    <div className={styles.mailInfoPatient}>
                                        <ul>
                                            <li>
                                                <i
                                                    className="isax isax-sms5"
                                                    aria-hidden="true"
                                                ></i>
                                                <a href={`mailto:${appointment.email}`}>
                                                    {appointment.email}
                                                </a>
                                            </li>
                                            <li>
                                                <i
                                                    className="isax isax-call5"
                                                    aria-hidden="true"
                                                ></i>
                                                {appointment.phone}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                {appointment.status === 'cancelled' && appointment.cancelReason && (
                                    <div className={styles.cancelReasonSection}>
                                        <button
                                            className={styles.cancelReasonButton}
                                            onClick={handleShowCancelReason}
                                            type="button"
                                            aria-label="Xem lý do hủy lịch hẹn"
                                        >
                                            <i
                                                className="isax isax-info-circle"
                                                aria-hidden="true"
                                            ></i>
                                            Xem lý do hủy
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>
                        <li className={styles.appointmentInfo}>
                            <div className={styles.personInfo}>
                                <p>Loại lịch hẹn</p>
                                <ul className={`d-flex ${styles.appointmentTypes}`}>
                                    <li>
                                        {getAppointmentTypeIcon(appointment.callType)}
                                        {appointment.callType}
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className={styles.appointmentAction}>
                            <div className={styles.detailBadgeInfo}>
                                {getStatusBadge(appointment.status)}
                            </div>
                            <div className={styles.consultFees}>
                                <h6>
                                    Phí tư vấn:{' '}
                                    {appointment.consultationFees
                                        ? `$${appointment.consultationFees}`
                                        : 'Miễn phí'}
                                </h6>
                            </div>
                            <ul>
                                <li>
                                    <button
                                        onClick={() => onMessage(appointment)}
                                        type="button"
                                        aria-label="Gửi tin nhắn cho bác sĩ"
                                    >
                                        <i className="isax isax-messages-25" aria-hidden="true"></i>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => onCancel(appointment)}
                                        type="button"
                                        aria-label="Hủy lịch hẹn"
                                    >
                                        <i
                                            className="isax isax-close-circle5"
                                            aria-hidden="true"
                                        ></i>
                                    </button>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <ul className={styles.detailCardBottomInfo}>
                        <li>
                            <h6>Ngày & Giờ hẹn</h6>
                            <span>{appointment.dateTime}</span>
                        </li>
                        <li>
                            <h6>Địa điểm phòng khám</h6>
                            <span>{appointment.clinicLocation || 'Phòng khám trực tuyến'}</span>
                        </li>
                        <li>
                            <h6>Địa điểm</h6>
                            <span>{appointment.location || 'Việt Nam'}</span>
                        </li>
                        <li>
                            <h6>Loại khám</h6>
                            <span>{appointment.visitType}</span>
                        </li>
                    </ul>
                </div>
                {/* /Appointment Detail Card */}

                {/* Recent Appointments */}
                <div className={styles.recentAppointments}>
                    <h5 className={styles.headText}>Lịch hẹn gần đây</h5>
                    {/* This section would typically show other appointments */}
                    <div className={styles.appointmentWrap}>
                        <div className={styles.noRecentAppointments}>
                            <p>Không có lịch hẹn gần đây nào khác.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancel Reason Modal */}
            <CancelReasonModal
                isOpen={isCancelReasonModalOpen}
                onClose={handleCloseCancelReasonModal}
                cancelReason={appointment.cancelReason || ''}
                appointmentNumber={appointment.appointmentNumber}
            />
        </div>
    );
};

export default AppointmentDetail;
