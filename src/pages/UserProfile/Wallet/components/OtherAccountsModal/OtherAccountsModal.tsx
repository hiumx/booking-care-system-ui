import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import Modal from '../Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { BankAccount } from '../../types/wallet.types';
import styles from './OtherAccountsModal.module.scss';
import Button from '@/components/Button';

interface OtherAccountsModalProps {
    isOpen: boolean;
    onClose: () => void;
    accounts: BankAccount[];
    onSetDefault: (accountId: string) => void;
    onDelete: (accountId: string) => void;
    loading?: boolean;
}

const OtherAccountsModal: React.FC<OtherAccountsModalProps> = ({
    isOpen,
    onClose,
    accounts,
    onSetDefault,
    onDelete,
    loading = false,
}) => {
    const [showScrollIndicator, setShowScrollIndicator] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showCannotDeleteAlert, setShowCannotDeleteAlert] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleSetDefault = (accountId: string) => {
        onSetDefault(accountId);
    };

    const handleDelete = (accountId: string) => {
        const account = accounts.find((acc) => acc.id === accountId);
        if (account?.isDefault) {
            setShowCannotDeleteAlert(true);
            return;
        }

        setAccountToDelete(accountId);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (accountToDelete) {
            onDelete(accountToDelete);
        }
        setAccountToDelete(null);
    };

    const handleCloseDeleteConfirm = () => {
        setShowDeleteConfirm(false);
        setAccountToDelete(null);
    };

    const handleCloseCannotDeleteAlert = () => {
        setShowCannotDeleteAlert(false);
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
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Tất cả các tài khoản ngân hàng"
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
                                            <h6 className={styles.infoLabel}>Tên ngân hàng</h6>
                                            <span className={styles.infoValue}>
                                                {account.bankCode}
                                            </span>
                                        </li>
                                        <li className={styles.infoRow}>
                                            <h6 className={styles.infoLabel}>Số tài khoản</h6>
                                            <span className={styles.infoValue}>
                                                {account.accountNumber}
                                            </span>
                                        </li>
                                        <li className={styles.infoRow}>
                                            <h6 className={styles.infoLabel}>Tên tài khoản</h6>
                                            <span className={styles.infoValue}>
                                                {account.accountName}
                                            </span>
                                        </li>
                                        <li className={styles.actionButtons}>
                                            {account.isDefault ? (
                                                <span className={styles.currentLabel}>
                                                    Mặc định
                                                </span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className={styles.setDefaultBtn}
                                                    onClick={() => handleSetDefault(account.id)}
                                                    disabled={loading}
                                                >
                                                    {loading ? 'Đang xử lý...' : 'Đặt làm mặc định'}
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                className={clsx(styles.deleteBtn, {
                                                    [styles.disabled]: account.isDefault || loading,
                                                })}
                                                onClick={() => handleDelete(account.id)}
                                                disabled={account.isDefault || loading}
                                                title={
                                                    account.isDefault
                                                        ? 'Không thể xóa tài khoản mặc định'
                                                        : 'Xóa tài khoản'
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
                                <p>Không tìm thấy tài khoản ngân hàng</p>
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
                        <Button text="Đóng" type="button" onClick={onClose} />
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Dialog - Outside Modal for proper centering */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={handleCloseDeleteConfirm}
                onConfirm={handleConfirmDelete}
                title="Xóa tài khoản"
                message="Bạn có chắc chắn muốn xóa tài khoản này không? Hành động này không thể hoàn tác."
                confirmText="Xóa"
                cancelText="Hủy"
                type="danger"
                icon="fa-solid fa-trash"
            />

            {/* Cannot Delete Alert - Outside Modal for proper centering */}
            <ConfirmDialog
                isOpen={showCannotDeleteAlert}
                onClose={handleCloseCannotDeleteAlert}
                onConfirm={handleCloseCannotDeleteAlert}
                title="Không thể xóa"
                message="Không thể xóa tài khoản đang được chọn làm mặc định. Vui lòng chọn tài khoản khác làm mặc định trước khi xóa."
                confirmText="Đã hiểu"
                cancelText=""
                type="warning"
                icon="fa-solid fa-exclamation-triangle"
            />
        </>
    );
};

export default OtherAccountsModal;
