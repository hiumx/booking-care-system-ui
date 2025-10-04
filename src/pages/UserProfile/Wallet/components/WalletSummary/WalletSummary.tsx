import React from 'react';
import clsx from 'clsx';

import { BankDetails } from '../../types/wallet.types';
import styles from './WalletSummary.module.scss';

interface WalletSummaryProps {
    bankDetails: BankDetails | null;
    onAddCard: () => void;
    onEditDetails: () => void;
    onOtherAccounts: () => void;
    accountsCount?: number;
}

const WalletSummary: React.FC<WalletSummaryProps> = ({
    bankDetails,
    onAddCard,
    onEditDetails,
    onOtherAccounts,
    accountsCount = 0,
}) => {
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
                            <li>
                                <h6>Chi nhánh</h6>
                                <h5>
                                    {hasCardDetails && bankDetails.bankCode
                                        ? bankDetails.bankCode
                                        : 'Chưa được thêm'}
                                </h5>
                            </li>
                        </ul>
                    </div>
                    <div className={clsx(styles.cardButton, 'bank-details-info')}>
                        <div className="edit-detail-link d-flex align-items-center w-80">
                            <div className={styles.buttonGroup}>
                                {hasCardDetails && (
                                    <button onClick={onEditDetails}>Edit Details</button>
                                )}
                                <button onClick={onAddCard}>Add Cards</button>
                            </div>
                            <button onClick={onOtherAccounts}>
                                Other Accounts {accountsCount > 0 && `(${accountsCount})`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletSummary;
