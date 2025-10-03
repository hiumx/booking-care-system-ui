import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import Modal from '../Modal';
import { BankDetails } from '../../types/wallet.types';
import styles from './OtherAccountsModal.module.scss';
import Button from '../../../../../components/Button';

interface OtherAccount extends BankDetails {
    id: string;
    isCurrent: boolean;
}

interface OtherAccountsModalProps {
    isOpen: boolean;
    onClose: () => void;
    accounts: OtherAccount[];
    onSetDefault: (accountId: string) => void;
    onDelete: (accountId: string) => void;
}

const OtherAccountsModal: React.FC<OtherAccountsModalProps> = ({
    isOpen,
    onClose,
    accounts,
    onSetDefault,
    onDelete,
}) => {
    const [showScrollIndicator, setShowScrollIndicator] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleSetDefault = (accountId: string) => {
        onSetDefault(accountId);
    };

    const handleDelete = (accountId: string) => {
        const account = accounts.find((acc) => acc.id === accountId);
        if (account?.isCurrent) {
            alert('Không thể xóa tài khoản đang được chọn làm mặc định');
            return;
        }

        if (confirm('Bạn có chắc chắn muốn xóa tài khoản này không?')) {
            onDelete(accountId);
        }
    };

    // Check if content is scrollable and handle scroll events
    useEffect(() => {
        const checkScrollable = () => {
            if (scrollContainerRef.current) {
                const { scrollHeight, clientHeight } = scrollContainerRef.current;
                setShowScrollIndicator(scrollHeight > clientHeight);
            }
        };

        const handleScroll = () => {
            if (scrollContainerRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
                const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5; // 5px threshold
                setShowScrollIndicator(!isAtBottom && scrollHeight > clientHeight);
            }
        };

        if (isOpen) {
            // Check after modal opens and content is rendered
            setTimeout(checkScrollable, 100);

            // Add scroll listener
            const scrollElement = scrollContainerRef.current;
            if (scrollElement) {
                scrollElement.addEventListener('scroll', handleScroll, { passive: true });
                return () => {
                    scrollElement.removeEventListener('scroll', handleScroll);
                };
            }
        }
    }, [isOpen, accounts]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Other Accounts"
            width="816px"
            maxWidth="90vw"
            minWidth="816px"
        >
            <div className={clsx(styles.modalBody, 'modal-body')}>
                <div
                    ref={scrollContainerRef}
                    className={clsx(styles.otherAccountsInfo, 'other-accounts-info')}
                >
                    <ul className={styles.accountsList}>
                        {accounts.map((account, index) => (
                            <motion.li
                                key={account.id}
                                className={styles.accountItem}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ul className="other-bank-info">
                                    <li className={styles.infoRow}>
                                        <h6 className={styles.infoLabel}>Name</h6>
                                        <span className={styles.infoValue}>{account.bankCode}</span>
                                    </li>
                                    <li className={styles.infoRow}>
                                        <h6 className={styles.infoLabel}>Account No</h6>
                                        <span className={styles.infoValue}>
                                            {account.accountNumber}
                                        </span>
                                    </li>
                                    <li className={styles.infoRow}>
                                        <h6 className={styles.infoLabel}>Name on Bank Account</h6>
                                        <span className={styles.infoValue}>
                                            {account.accountName}
                                        </span>
                                    </li>
                                    <li className={styles.actionButtons}>
                                        {account.isCurrent ? (
                                            <span className={styles.currentLabel}>Current</span>
                                        ) : (
                                            <button
                                                type="button"
                                                className={styles.setDefaultBtn}
                                                onClick={() => handleSetDefault(account.id)}
                                            >
                                                Set as default
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            className={clsx(styles.deleteBtn, {
                                                [styles.disabled]: account.isCurrent,
                                            })}
                                            onClick={() => handleDelete(account.id)}
                                            disabled={account.isCurrent}
                                            title={
                                                account.isCurrent
                                                    ? 'Cannot delete current account'
                                                    : 'Delete account'
                                            }
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </li>
                                </ul>
                            </motion.li>
                        ))}
                    </ul>

                    {accounts.length === 0 && (
                        <div className={styles.emptyState}>
                            <p>No other accounts found</p>
                        </div>
                    )}

                    {/* Scroll indicator */}
                    {showScrollIndicator && (
                        <div className={clsx(styles.scrollIndicator, styles.visible)}></div>
                    )}
                </div>
            </div>

            <div className={clsx(styles.modalFooter, 'modal-footer')}>
                <div className="text-end">
                    <Button text="Close" type="button" onClick={onClose} />
                </div>
            </div>
        </Modal>
    );
};

export default OtherAccountsModal;
