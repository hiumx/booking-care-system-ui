import React from 'react';
import clsx from 'clsx';

import { BankAccount } from '../../types/wallet.types';
import styles from './WalletSummary.module.scss';

interface WalletSummaryProps {
    defaultAccount: BankAccount | null;
    onAddCard: () => void;
    onEditDetails: () => void;
    onOtherAccounts: () => void;
    accountsCount?: number;
    loading?: boolean;
}

const WalletSummary: React.FC<WalletSummaryProps> = ({
    defaultAccount,
    onAddCard,
    onEditDetails,
    onOtherAccounts,
    accountsCount = 0,
    loading = false,
}) => {
    const hasCardDetails = defaultAccount !== null;

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
                                    {(() => {
                                        if (loading) return 'Đang tải...';
                                        return hasCardDetails
                                            ? defaultAccount.accountName
                                            : 'Chưa được thêm';
                                    })()}
                                </h5>
                            </li>
                            <li>
                                <h6>Số tài khoản</h6>
                                <h5>
                                    {(() => {
                                        if (loading) return 'Đang tải...';
                                        return hasCardDetails
                                            ? defaultAccount.accountNumber
                                            : 'Chưa được thêm';
                                    })()}
                                </h5>
                            </li>
                            <li>
                                <h6>Tên ngân hàng</h6>
                                <h5>
                                    {(() => {
                                        if (loading) return 'Đang tải...';
                                        return hasCardDetails
                                            ? defaultAccount.bankName
                                            : 'Chưa được thêm';
                                    })()}
                                </h5>
                            </li>
                            <li>
                                <h6>Mã ngân hàng</h6>
                                <h5>
                                    {(() => {
                                        if (loading) return 'Đang tải...';
                                        if (hasCardDetails && defaultAccount.bankCode)
                                            return defaultAccount.bankCode;
                                        return 'Chưa được thêm';
                                    })()}
                                </h5>
                            </li>
                        </ul>
                    </div>
                    <div className={clsx(styles.cardButton, 'bank-details-info')}>
                        <div className="edit-detail-link d-flex align-items-center w-80">
                            <div className={styles.buttonGroup}>
                                {hasCardDetails && (
                                    <button onClick={onEditDetails}>Chỉnh sửa chi tiết</button>
                                )}
                                <button onClick={onAddCard}>Thêm tài khoản ngân hàng</button>
                            </div>
                            <button onClick={onOtherAccounts}>
                                Tất cả các tài khoản ngân hàng{' '}
                                {accountsCount > 0 && `(${accountsCount})`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletSummary;
