import React from 'react';
import clsx from 'clsx';

import { Transaction } from '../../types/wallet.types';

interface TransactionTableProps {
    transactions: Transaction[];
    loading?: boolean;
    error?: string | null;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, loading, error }) => {
    const renderStatusBadge = (status: string) => {
        const isCompleted = status === 'completed';
        return (
            <span
                className={clsx('badge inline-flex align-items-center', {
                    'badge-success-transparent': isCompleted,
                    'badge-warning-transparent': !isCompleted,
                })}
            >
                <i className="fa-solid fa-circle me-1 fs-5"></i>
                {isCompleted ? 'Completed' : 'Pending'}
            </span>
        );
    };

    const handleTransactionClick = (transactionId: string) => {
        console.log('Transaction clicked:', transactionId);
        // Handle transaction detail navigation here
    };

    // Loading state
    if (loading) {
        return (
            <div className="row">
                <div className="col-sm-12">
                    <div className="account-detail-table">
                        <div className="custom-new-table">
                            <div className="text-center p-4">
                                <div
                                    className="spinner-border text-primary"
                                    aria-hidden="true"
                                ></div>
                                <p className="mt-2 mb-0">Đang tải lịch sử giao dịch...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="row">
                <div className="col-sm-12">
                    <div className="account-detail-table">
                        <div className="custom-new-table">
                            <div className="text-center p-4">
                                <div className="alert alert-danger" role="alert">
                                    <i className="fa-solid fa-exclamation-triangle me-2"></i>
                                    {error}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Empty state
    if (!transactions || transactions.length === 0) {
        return (
            <div className="row">
                <div className="col-sm-12">
                    <div className="account-detail-table">
                        <div className="custom-new-table">
                            <div className="text-center p-4">
                                <div className="text-muted">
                                    <i className="fa-solid fa-receipt fa-3x mb-3 d-block"></i>
                                    <h5>Chưa có giao dịch nào</h5>
                                    <p>Lịch sử hoàn tiền của bạn sẽ được hiển thị tại đây.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="row">
            <div className="col-sm-12">
                <div className="account-detail-table">
                    <div className="custom-new-table">
                        <div className="table-responsive">
                            <table className="table table-center mb-0">
                                <thead>
                                    <tr>
                                        <th>Refund ID</th>
                                        <th>Account No</th>
                                        <th>Refund Reason</th>
                                        <th>Updated Date</th>
                                        <th>Refund Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td>
                                                <button
                                                    className="link-primary"
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        textDecoration: 'none',
                                                    }}
                                                    onClick={() =>
                                                        handleTransactionClick(transaction.id)
                                                    }
                                                >
                                                    {transaction.id}
                                                </button>
                                            </td>
                                            <td className="text-gray-9">{transaction.accountNo}</td>
                                            <td>{transaction.reason}</td>
                                            <td>{transaction.date}</td>
                                            <td>{transaction.amount}</td>
                                            <td>{renderStatusBadge(transaction.status)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionTable;
