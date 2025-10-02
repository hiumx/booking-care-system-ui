import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

import styles from '../Wallet.module.scss';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        if (isOpen) {
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '0px'; // Prevent layout shift
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className={clsx(styles.modalOverlay, { [styles.isOpen]: isOpen })}>
            <button
                className={styles.modalBackdrop}
                onClick={onClose}
                aria-label="Close modal"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'default',
                }}
            />
            <div
                className={clsx(
                    styles.modalDialog,
                    'custom-modals modal-dialog modal-dialog-centered'
                )}
            >
                <div className="modal-content">
                    <div className={clsx(styles.modalHeader, 'modal-header')}>
                        <h5 className={clsx(styles.modalTitle, 'modal-title')}>{title}</h5>
                        <button
                            type="button"
                            className={clsx(styles.closeButton, 'btn-close')}
                            onClick={onClose}
                            aria-label="Close"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
