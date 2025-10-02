import React from 'react';

import { WalletBalance, BankDetails } from '../../types/wallet.types';
import styles from '../../Wallet.module.scss';

interface WalletSummaryProps {
    walletBalance: WalletBalance;
    bankDetails: BankDetails;
    onAddPayment: () => void;
    onEditDetails: () => void;
    onAddCards: () => void;
    onOtherAccounts: () => void;
}

const WalletSummary: React.FC<WalletSummaryProps> = ({
    walletBalance,
    bankDetails,
    onAddPayment,
    onEditDetails,
    onAddCards,
    onOtherAccounts,
}) => {
    return (
        <div className="account-details-box">
            <div className="row">
                <div className="col-xxl-7 col-lg-7">
                    <div className="account-payment-info">
                        <div className="row">
                            <div className="col-lg-6 col-md-6">
                                <div className="payment-amount">
                                    <h6>
                                        <i className="isa isax-wallet-25 text-warning"></i>Total
                                        Balance
                                    </h6>
                                    <span>{walletBalance.totalBalance}</span>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <div className="payment-amount">
                                    <h6>
                                        <i className="isax isax-document5 text-success"></i>Total
                                        Transaction
                                    </h6>
                                    <span>{walletBalance.totalTransaction}</span>
                                </div>
                            </div>
                        </div>
                        <div className="payment-request">
                            <span>Last Payment request : {walletBalance.lastPaymentRequest}</span>
                            <button
                                className="btn btn-md btn-primary-gradient rounded-pill"
                                onClick={onAddPayment}
                            >
                                Add Payment
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-5 col-lg-5">
                    <div className="bank-details-info">
                        <h3>Bank Details</h3>
                        <ul>
                            <li>
                                <h6>Bank Name</h6>
                                <h5>{bankDetails.bankName}</h5>
                            </li>
                            <li>
                                <h6>Account Number</h6>
                                <h5>{bankDetails.accountNumber}</h5>
                            </li>
                            <li>
                                <h6>Branch Name</h6>
                                <h5>{bankDetails.branchName}</h5>
                            </li>
                            <li>
                                <h6>Account Name</h6>
                                <h5>{bankDetails.accountName}</h5>
                            </li>
                        </ul>
                        <div className="edit-detail-link d-flex align-items-center justify-content-between w-100">
                            <div>
                                <button className={styles.linkButton} onClick={onEditDetails}>
                                    Edit Details
                                </button>
                                <button className={styles.linkButton} onClick={onAddCards}>
                                    Add Cards
                                </button>
                            </div>
                            <button className={styles.linkButton} onClick={onOtherAccounts}>
                                Other Accounts
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletSummary;
