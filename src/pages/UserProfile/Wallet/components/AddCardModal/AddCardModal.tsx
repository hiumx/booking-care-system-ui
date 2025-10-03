import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import Modal from '../Modal';
import BankSelect from '../BankSelect';
import NotificationToast from '../../../../../components/NotificationToast';
import { CardFormData, BankDetails } from '../../types/wallet.types';
import { Bank } from '../../types/bank.types';
import styles from '../../Wallet.module.scss';
import Button from '../../../../../components/Button';
interface AddCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CardFormData) => void;
    existingData?: BankDetails | null;
    mode?: 'add' | 'edit';
}

const AddCardModal: React.FC<AddCardModalProps> = ({
    isOpen,
    onClose,
    onSave,
    existingData,
    mode = 'add',
}) => {
    const [formData, setFormData] = useState<CardFormData>({
        cardHolderName: '',
        cardNumber: '',
        bankName: '',
        bankCode: '',
    });
    const [showValidationToast, setShowValidationToast] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    // Pre-populate form with existing data when editing
    useEffect(() => {
        if (existingData && isOpen) {
            setFormData({
                cardHolderName: existingData.accountName || '',
                cardNumber: existingData.accountNumber || '',
                bankName: existingData.bankName || '',
                bankCode: existingData.bankCode || '',
            });
        } else if (isOpen) {
            // Reset form when opening for new card
            setFormData({
                cardHolderName: '',
                cardNumber: '',
                bankName: '',
                bankCode: '',
            });
        }
    }, [existingData, isOpen, mode]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleBankChange = (bankCode: string, bank?: Bank) => {
        setFormData((prev) => ({
            ...prev,
            bankName: bank?.shortName || bankCode,
            bankCode: bankCode,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (
            !formData.cardHolderName ||
            !formData.cardNumber ||
            !formData.bankName ||
            !formData.bankCode
        ) {
            setShowValidationToast(true);
            return;
        }

        onSave(formData);
        setShowSuccessToast(true);

        // Close modal after showing success toast
        setTimeout(() => {
            onClose();
        }, 1500);
    };

    const handleClose = () => {
        // Reset form data when closing
        setFormData({
            cardHolderName: '',
            cardNumber: '',
            bankName: '',
            bankCode: '',
        });
        onClose();
    };

    const isEditing = mode === 'edit' || (existingData !== null && existingData !== undefined);
    const modalTitle = isEditing ? 'Cập nhật số tài khoản' : 'Thêm số tài khoản';
    const submitButtonText = isEditing ? 'Cập nhật số tài khoản' : 'Thêm số tài khoản';

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={modalTitle} width="500px">
            <form onSubmit={handleSubmit}>
                <div className={clsx(styles.modalBody, 'modal-body pb-0')}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="cardHolderName">
                            Tên chủ tài khoản <span className={styles.required}>*</span>
                        </label>
                        <motion.input
                            type="text"
                            id="cardHolderName"
                            name="cardHolderName"
                            className={styles.formControl}
                            value={formData.cardHolderName}
                            onChange={handleInputChange}
                            required
                            whileFocus={{
                                scale: 1.02,
                                transition: { duration: 0.2 },
                            }}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="cardNumber">
                            Số tài khoản <span className={styles.required}>*</span>
                        </label>
                        <motion.input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            className={styles.formControl}
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            required
                            whileFocus={{
                                scale: 1.02,
                                transition: { duration: 0.2 },
                            }}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="branch">
                            Ngân hàng <span className={styles.required}>*</span>
                        </label>
                        <BankSelect
                            id="branch"
                            value={formData.bankCode}
                            onChange={handleBankChange}
                            placeholder="Chọn ngân hàng của bạn"
                            className={styles.formSelect}
                            required={true}
                        />
                    </div>
                </div>
                <div className={clsx(styles.modalFooter, 'modal-footer')}>
                    <div className={styles.modalActions}>
                        <div className={styles.buttonGroup}>
                            <button
                                type="button"
                                className={styles.btnCancel}
                                onClick={handleClose}
                            >
                                Huỷ
                            </button>

                            <Button
                                text={submitButtonText}
                                type="submit"
                                className={styles.btnPrimary}
                            />
                        </div>
                    </div>
                </div>
            </form>

            {/* Validation Toast */}
            <NotificationToast
                isOpen={showValidationToast}
                onClose={() => setShowValidationToast(false)}
                message="Vui lòng điền đầy đủ thông tin bắt buộc"
                type="warning"
                icon="fa-solid fa-exclamation-triangle"
                duration={4000}
            />

            {/* Success Toast */}
            <NotificationToast
                isOpen={showSuccessToast}
                onClose={() => setShowSuccessToast(false)}
                message={
                    isEditing ? 'Cập nhật tài khoản thành công!' : 'Thêm tài khoản thành công!'
                }
                type="success"
                icon="fa-solid fa-check-circle"
                duration={1500}
            />
        </Modal>
    );
};

export default AddCardModal;
