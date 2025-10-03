import React from 'react';
import clsx from 'clsx';

import { BankDetails } from '../../types/wallet.types';
import styles from './WalletSummary.module.scss';

import Button from '../../../../../components/Button';
interface WalletSummaryProps {
    bankDetails: BankDetails | null;
    onAddPayment: () => void;
}

const WalletSummary: React.FC<WalletSummaryProps> = ({ bankDetails, onAddPayment }) => {
    const hasCardDetails = bankDetails !== null;

    return (
        <div className={clsx(styles.accountDetailsBox, 'account-details-box')}>
            <div className="row">
                <div className="col-xxl-5 col-lg-5">
                    <div className={clsx(styles.bankDetailsInfo, 'bank-details-info')}>
                        <h3>Tài khoản của bạn</h3>
                        <ul>
                            <li>
                                <h6>Tên chủ tài khoản</h6>
                                <h5>
                                    {hasCardDetails ? bankDetails.accountName : 'Chưa được thêm'}
                                </h5>
                            </li>
                            <li>
                                <h6>Số tài khoản</h6>
                                <h5>
                                    {hasCardDetails ? bankDetails.accountNumber : 'Chưa được thêm'}
                                </h5>
                            </li>
                            <li>
                                <h6>Tên ngân hàng</h6>
                                <h5>{hasCardDetails ? bankDetails.bankName : 'Chưa được thêm'}</h5>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col-xxl-5 col-lg-5">
                    {' '}
                    <Button
                        text={hasCardDetails ? 'Cập nhật số tài khoản' : 'Thêm số tài khoản'}
                        type="submit"
                        onClick={onAddPayment}
                        className={styles.addCardButton}
                    />
                </div>
            </div>
        </div>
    );
};

export default WalletSummary;
