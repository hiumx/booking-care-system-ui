import React, { useState } from 'react';
import clsx from 'clsx';

import Modal from '../Modal';
import { CardFormData } from '../../types/wallet.types';
import styles from '../../Wallet.module.scss';
import Button from '../../../../../components/Button';
interface AddCardModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddCardModal: React.FC<AddCardModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<CardFormData>({
        cardHolderName: '',
        cardNumber: '',
        expireDate: '',
        cvv: '',
        branch: '',
        markAsDefault: false,
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
        console.log('Add card form submitted:', formData);
        onClose();
    };

    const handleClose = () => {
        // Reset form data when closing
        setFormData({
            cardHolderName: '',
            cardNumber: '',
            expireDate: '',
            cvv: '',
            branch: '',
            markAsDefault: false,
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Add Card">
            <form onSubmit={handleSubmit}>
                <div className={clsx(styles.modalBody, 'modal-body pb-0')}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="cardHolderName">
                            Card Holder Name <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            id="cardHolderName"
                            name="cardHolderName"
                            className={styles.formControl}
                            value={formData.cardHolderName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="cardNumber">
                            Card Number <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            className={styles.formControl}
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="expireDate">
                            Expire Date <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.formIcon}>
                            <input
                                type="text"
                                id="expireDate"
                                name="expireDate"
                                className={styles.formControl}
                                value={formData.expireDate}
                                onChange={handleInputChange}
                                placeholder="MM/YY"
                                required
                            />
                            <span className={styles.icon}>
                                <i className="isax isax-calendar-1"></i>
                            </span>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="cvv">
                            CVV <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            className={styles.formControl}
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            maxLength={4}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="branch">
                            Branch <span className={styles.required}>*</span>
                        </label>
                        <select
                            id="branch"
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
                            <button
                                type="button"
                                className={styles.btnCancel}
                                onClick={handleClose}
                            >
                                Cancel
                            </button>

                            <Button text="Add Card" type="submit" className={styles.btnPrimary} />
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default AddCardModal;
