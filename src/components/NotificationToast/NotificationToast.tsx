import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

import styles from './NotificationToast.module.scss';

interface NotificationToastProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    icon?: string;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
    isOpen,
    onClose,
    message,
    type = 'info',
    duration = 4000,
    icon,
}) => {
    useEffect(() => {
        if (isOpen && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isOpen, duration, onClose]);

    const getIcon = () => {
        if (icon) return icon;

        switch (type) {
            case 'success':
                return 'fa-solid fa-check-circle';
            case 'error':
                return 'fa-solid fa-times-circle';
            case 'warning':
                return 'fa-solid fa-exclamation-triangle';
            case 'info':
                return 'fa-solid fa-info-circle';
            default:
                return 'fa-solid fa-bell';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={clsx(styles.toast, styles[type])}
                    initial={{ opacity: 0, y: -100, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -100, scale: 0.8 }}
                    transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 24,
                    }}
                >
                    <div className={styles.content}>
                        <div className={clsx(styles.iconContainer, styles[type])}>
                            <i className={getIcon()}></i>
                        </div>
                        <span className={styles.message}>{message}</span>
                    </div>

                    <button className={styles.closeButton} onClick={onClose} type="button">
                        <i className="fa-solid fa-times"></i>
                    </button>

                    {duration > 0 && (
                        <motion.div
                            className={styles.progressBar}
                            initial={{ width: '100%' }}
                            animate={{ width: '0%' }}
                            transition={{ duration: duration / 1000, ease: 'linear' }}
                        />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NotificationToast;
