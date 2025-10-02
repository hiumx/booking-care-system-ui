import React, { useState } from 'react';
import clsx from 'clsx';

import Modal from '../Modal';
import { CardFormData } from '../../types/wallet.types';
import styles from '../../Wallet.module.scss';
import Button from '../../../../../components/Button';
interface EditCardModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditCardModal: React.FC<EditCardModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<CardFormData>({
        cardHolderName: 'Darren',
        cardNumber: '5396 5250 1908 1647',
        expireDate: '15-04-2026',
        cvv: '556',
        branch: 'london',
        markAsDefault: true,
    });

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Edit card form submitted:', formData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Card">
            <form onSubmit={handleSubmit}>
                <div className={clsx(styles.modalBody, 'modal-body pb-0')}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="editCardHolderName">
                            Card Holder Name <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            id="editCardHolderName"
                            name="cardHolderName"
                            className={styles.formControl}
                            value={formData.cardHolderName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="editCardNumber">
                            Card Number <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            id="editCardNumber"
                            name="cardNumber"
                            className={styles.formControl}
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="editExpireDate">
                            Expire Date <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.formIcon}>
                            <input
                                type="text"
                                id="editExpireDate"
                                name="expireDate"
                                className={styles.formControl}
                                value={formData.expireDate}
                                onChange={handleInputChange}
                                required
                            />
                            <span className={styles.icon}>
                                <i className="isax isax-calendar-1"></i>
                            </span>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="editCvv">
                            CVV <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            id="editCvv"
                            name="cvv"
                            className={styles.formControl}
                            value={formData.cvv}
                            onChange={handleInputChange}
                            maxLength={4}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="editBranch">
                            Branch <span className={styles.required}>*</span>
                        </label>
                        <select
                            id="editBranch"
                            name="branch"
                            className={styles.formSelect}
                            value={formData.branch}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select</option>
                            <option value="london">London</option>
                            <option value="newyork">New York</option>
                        </select>
                    </div>
                </div>
                <div className={clsx(styles.modalFooter, 'modal-footer')}>
                    <div className={styles.modalActions}>
                        <div className={styles.buttonGroup}>
                            <button type="button" className={styles.btnCancel} onClick={onClose}>
                                Cancel
                            </button>

                            <Button
                                text="Save Changes"
                                type="submit"
                                className={styles.btnPrimary}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default EditCardModal;
