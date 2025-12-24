import React from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation('userProfile');
    const hasCardDetails = defaultAccount !== null;

    return (
        <div className={clsx(styles.accountDetailsBox, 'account-details-box')}>
            <div className="row">
                <div className="col-xxl-5 col-lg-5">
                    <div className={clsx(styles.bankDetailsInfo, 'bank-details-info')}>
                        <h3>{t('wallet.summary.title')}</h3>
                        <ul>
                            <li>
                                <h6>{t('wallet.summary.accountName')}</h6>
                                <h5>
                                    {(() => {
                                        if (loading) return t('wallet.summary.loading');
                                        return hasCardDetails
                                            ? defaultAccount.accountName
                                            : t('wallet.summary.notAdded');
                                    })()}
                                </h5>
                            </li>
                            <li>
                                <h6>{t('wallet.summary.accountNumber')}</h6>
                                <h5>
                                    {(() => {
                                        if (loading) return t('wallet.summary.loading');
                                        return hasCardDetails
                                            ? defaultAccount.accountNumber
                                            : t('wallet.summary.notAdded');
                                    })()}
                                </h5>
                            </li>
                            <li>
                                <h6>{t('wallet.summary.bankName')}</h6>
                                <h5>
                                    {(() => {
                                        if (loading) return t('wallet.summary.loading');
                                        return hasCardDetails
                                            ? defaultAccount.bankName
                                            : t('wallet.summary.notAdded');
                                    })()}
                                </h5>
                            </li>
                            <li>
                                <h6>{t('wallet.summary.bankCode')}</h6>
                                <h5>
                                    {(() => {
                                        if (loading) return t('wallet.summary.loading');
                                        if (hasCardDetails && defaultAccount.bankCode)
                                            return defaultAccount.bankCode;
                                        return t('wallet.summary.notAdded');
                                    })()}
                                </h5>
                            </li>
                        </ul>
                    </div>
                    <div className={clsx(styles.cardButton, 'bank-details-info')}>
                        <div className="edit-detail-link d-flex align-items-center w-80">
                            <div className={styles.buttonGroup}>
                                {hasCardDetails && (
                                    <button onClick={onEditDetails}>
                                        {t('wallet.summary.editDetails')}
                                    </button>
                                )}
                                <button onClick={onAddCard}>
                                    {t('wallet.summary.addBankAccount')}
                                </button>
                            </div>
                            <button onClick={onOtherAccounts}>
                                {t('wallet.summary.allBankAccounts')}{' '}
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
