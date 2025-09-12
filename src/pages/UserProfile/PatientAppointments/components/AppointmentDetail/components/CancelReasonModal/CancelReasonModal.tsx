import React from 'react';
import styles from './CancelReasonModal.module.scss';

interface CancelReasonModalProps {
    isOpen: boolean;
    onClose: () => void;
    cancelReason: string;
    appointmentNumber: string;
}

const CancelReasonModal: React.FC<CancelReasonModalProps> = ({
    isOpen,
    onClose,
    cancelReason,
    appointmentNumber,
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h4>Lý do hủy lịch hẹn</h4>
                    <button className={styles.closeButton} onClick={onClose}>
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.appointmentInfo}>
                        <p>
                            <strong>Mã lịch hẹn:</strong> {appointmentNumber}
                        </p>
                    </div>

                    <div className={styles.reasonSection}>
                        <h6>Lý do hủy:</h6>
                        <div className={styles.reasonContent}>{cancelReason}</div>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className="btn btn-secondary" onClick={onClose}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelReasonModal;
