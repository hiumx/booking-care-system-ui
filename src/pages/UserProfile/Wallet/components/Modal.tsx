import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

    // Animation variants
    const modalVariants = {
        initial: {
            opacity: 0,
            scale: 0.9,
            y: -20,
        },
        animate: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: 'spring' as const,
                stiffness: 300,
                damping: 25,
            },
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            y: -20,
            transition: {
                duration: 0.2,
            },
        },
    };

    const overlayVariants = {
        initial: {
            opacity: 0,
        },
        animate: {
            opacity: 1,
            transition: {
                duration: 0.3,
            },
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.2,
            },
        },
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={styles.modalOverlay}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={overlayVariants}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1050,
                    }}
                >
                    <motion.button
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
                        whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
                    />
                    <motion.div
                        className={clsx(
                            styles.modalDialog,
                            'custom-modals modal-dialog modal-dialog-centered'
                        )}
                        variants={modalVariants}
                        style={{
                            background: 'white',
                            borderRadius: '12px',
                            maxWidth: '500px',
                            width: '90%',
                            maxHeight: '90vh',
                            overflow: 'hidden',
                            boxShadow:
                                '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(0, 0, 0, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                    >
                        <div className="modal-content">
                            <div className={clsx(styles.modalHeader, 'modal-header')}>
                                <h5 className={clsx(styles.modalTitle, 'modal-title')}>{title}</h5>
                                <motion.button
                                    type="button"
                                    className={clsx(styles.closeButton, 'btn-close')}
                                    onClick={onClose}
                                    aria-label="Close"
                                    whileHover={{
                                        scale: 1.1,
                                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </motion.button>
                            </div>
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default Modal;
