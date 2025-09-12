import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    // Handle keyboard events và focus management
    useEffect(() => {
        if (!isOpen) return;

        // Save currently focused element
        previousActiveElement.current = document.activeElement as HTMLElement;

        // Focus modal
        if (modalRef.current) {
            modalRef.current.focus();
        }

        // Lock body scroll
        document.body.style.overflow = 'hidden';

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        const handleTabKey = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            const focusableElements = modalRef.current?.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            if (!focusableElements || focusableElements.length === 0) return;

            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            handleEscape(e);
            handleTabKey(e);
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';

            // Restore focus to previous element
            if (previousActiveElement.current) {
                previousActiveElement.current.focus();
            }
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const modalContent = (
        <div className={styles.modalOverlay}>
            <section
                ref={modalRef}
                className={styles.modalContent}
                aria-labelledby="modal-title"
                tabIndex={-1}
            >
                <div className={styles.modalHeader}>
                    <h4 id="modal-title">Lý do hủy lịch hẹn</h4>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Đóng modal"
                        type="button"
                    >
                        <i className="fa-solid fa-times" aria-hidden="true"></i>
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
                    <button
                        className="btn btn-secondary"
                        onClick={onClose}
                        type="button"
                        aria-label="Đóng modal"
                    >
                        Đóng
                    </button>
                </div>
            </section>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default CancelReasonModal;
