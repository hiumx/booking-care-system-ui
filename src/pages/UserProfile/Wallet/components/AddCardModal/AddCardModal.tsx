import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import Modal from '../Modal';
import BankSelect from '../BankSelect';
import NotificationToast from '@/components/NotificationToast';
import { BankAccount, CreateBankAccountRequest } from '../../types/wallet.types';
import { Bank } from '../../types/bank.types';
import { BankAccountValidator, BankAccountValidation } from '../../utils/bankAccountValidator';
import styles from '../../Wallet.module.scss';
import Button from '@/components/Button';

interface AddCardFormData {
    cardHolderName: string;
    cardNumber: string;
    bankName: string;
    bankCode: string;
    isDefault: boolean;
}

interface AddCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CreateBankAccountRequest) => Promise<void>;
    onSuccess?: (message: string) => void;
    existingData?: BankAccount | null;
    mode?: 'add' | 'edit';
    userId: string;
    loading?: boolean;
}

const AddCardModal: React.FC<AddCardModalProps> = ({
    isOpen,
    onClose,
    onSave,
    onSuccess,
    existingData,
    mode = 'add',
    userId,
    loading = false,
}) => {
    const [formData, setFormData] = useState<AddCardFormData>({
        cardHolderName: '',
        cardNumber: '',
        bankName: '',
        bankCode: '',
        isDefault: false,
    });
    const [validation, setValidation] = useState<BankAccountValidation | null>(null);
    const [showValidationToast, setShowValidationToast] = useState(false);
    const [validationMessage, setValidationMessage] = useState('');

    // Validate form data
    const validateForm = () => {
        const validationResult: BankAccountValidation = {
            bankCode: BankAccountValidator.validateBankCode(formData.bankCode),
            bankName: BankAccountValidator.validateBankName(formData.bankName),
            accountNumber: BankAccountValidator.validateAccountNumber(formData.cardNumber),
            accountName: BankAccountValidator.validateAccountName(formData.cardHolderName),
            isValid: true,
        };

        // Check if required validations pass (only accountNumber and accountName need user input validation)
        validationResult.isValid =
            validationResult.bankCode.isValid &&
            validationResult.bankName.isValid &&
            validationResult.accountNumber.isValid &&
            validationResult.accountName.isValid;

        setValidation(validationResult);

        if (!validationResult.isValid) {
            // Show first error message from user input fields only
            const firstError = [validationResult.accountNumber, validationResult.accountName].find(
                (rule) => !rule.isValid
            );

            setValidationMessage(firstError?.message || 'Vui lòng kiểm tra lại thông tin');
            return false;
        }

        setValidationMessage('');
        return true;
    };

    // Helper function to get error for specific field
    const getFieldError = (fieldName: keyof BankAccountValidation) => {
        if (!validation || fieldName === 'isValid') return null;
        const fieldValidation = validation[fieldName];
        if (typeof fieldValidation === 'object' && 'isValid' in fieldValidation) {
            return !fieldValidation.isValid ? fieldValidation.message : null;
        }
        return null;
    };

    // Helper function to check if field has error
    const hasFieldError = (fieldName: keyof BankAccountValidation) => {
        return getFieldError(fieldName) !== null;
    };

    // Pre-populate form with existing data when editing
    useEffect(() => {
        if (existingData && isOpen) {
            setFormData({
                cardHolderName: existingData.accountName || '',
                cardNumber: existingData.accountNumber || '',
                bankName: existingData.bankName || '',
                bankCode: existingData.bankCode || '',
                isDefault: existingData.isDefault || false,
            });
        } else if (isOpen) {
            // Reset form when opening for new card
            setFormData({
                cardHolderName: '',
                cardNumber: '',
                bankName: '',
                bankCode: '',
                isDefault: false,
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

        // Clear validation message when user starts typing
        if (validationMessage) {
            setValidationMessage('');
        }
    };

    const handleInputBlur = () => {
        // Validate current field on blur
        const validationResult: BankAccountValidation = {
            bankCode: BankAccountValidator.validateBankCode(formData.bankCode),
            bankName: BankAccountValidator.validateBankName(formData.bankName),
            accountNumber: BankAccountValidator.validateAccountNumber(formData.cardNumber),
            accountName: BankAccountValidator.validateAccountName(formData.cardHolderName),
            isValid: true,
        };

        validationResult.isValid =
            validationResult.bankCode.isValid &&
            validationResult.bankName.isValid &&
            validationResult.accountNumber.isValid &&
            validationResult.accountName.isValid;

        setValidation(validationResult);
    };

    const handleBankChange = (bankCode: string, bank?: Bank) => {
        setFormData((prev) => ({
            ...prev,
            bankName: bank?.name || bankCode,
            bankCode: bankCode,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form using validator
        if (!validateForm()) {
            setShowValidationToast(true);
            return;
        }

        try {
            const requestData: CreateBankAccountRequest = {
                userId,
                bankCode: formData.bankCode,
                bankName: formData.bankName,
                accountNumber: formData.cardNumber,
                accountName: formData.cardHolderName,
                isDefault: formData.isDefault,
            };

            await onSave(requestData);

            // Notify parent about success and close modal immediately
            const successMessage =
                mode === 'edit'
                    ? 'Cập nhật thông tin tài khoản thành công!'
                    : 'Thêm tài khoản ngân hàng thành công!';

            onSuccess?.(successMessage);
            onClose();
        } catch (error) {
            console.error('Error saving bank account:', error);
            // Handle error - you might want to show an error toast
        }
    };

    const handleClose = () => {
        // Reset form data when closing
        setFormData({
            cardHolderName: '',
            cardNumber: '',
            bankName: '',
            bankCode: '',
            isDefault: false,
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
                            className={`${styles.formControl} ${hasFieldError('accountName') ? styles.formControlError : ''}`}
                            value={formData.cardHolderName}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            required
                            whileFocus={{
                                scale: 1.02,
                                transition: { duration: 0.2 },
                            }}
                        />
                        {getFieldError('accountName') && (
                            <span className={styles.errorText}>{getFieldError('accountName')}</span>
                        )}
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="cardNumber">
                            Số tài khoản <span className={styles.required}>*</span>
                        </label>
                        <motion.input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            className={`${styles.formControl} ${hasFieldError('accountNumber') ? styles.formControlError : ''}`}
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            placeholder="1234567890123456"
                            required
                            whileFocus={{
                                scale: 1.02,
                                transition: { duration: 0.2 },
                            }}
                        />
                        {getFieldError('accountNumber') && (
                            <span className={styles.errorText}>
                                {getFieldError('accountNumber')}
                            </span>
                        )}
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
                    {mode === 'add' && (
                        <div className={styles.formGroup}>
                            <div className={styles.checkboxGroup}>
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    name="isDefault"
                                    checked={formData.isDefault}
                                    onChange={handleInputChange}
                                    className={styles.checkboxInput}
                                />
                                <label htmlFor="isDefault" className={styles.checkboxLabel}>
                                    Đặt làm tài khoản mặc định
                                </label>
                            </div>
                        </div>
                    )}
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
                                text={loading ? 'Đang xử lý...' : submitButtonText}
                                type="submit"
                                className={styles.btnPrimary}
                                isDisabled={loading}
                            />
                        </div>
                    </div>
                </div>
            </form>

            {/* Validation Toast */}
            <NotificationToast
                isOpen={showValidationToast}
                onClose={() => setShowValidationToast(false)}
                message={validationMessage || 'Vui lòng điền đầy đủ thông tin bắt buộc'}
                type="warning"
                icon="fa-solid fa-exclamation-triangle"
                duration={4000}
            />
        </Modal>
    );
};

export default AddCardModal;
