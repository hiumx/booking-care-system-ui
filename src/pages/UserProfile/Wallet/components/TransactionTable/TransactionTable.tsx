import React from 'react';
import clsx from 'clsx';

import { Transaction } from '../../types/wallet.types';

interface TransactionTableProps {
    transactions: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
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

    return (
        <div className="row">
            <div className="col-sm-12">
                <div className="account-detail-table">
                    <div className="custom-new-table">
                        <div className="table-responsive">
                            <table className="table table-center mb-0">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Account No</th>
                                        <th>Reason</th>
                                        <th>Debited / Credited On</th>
                                        <th>Amount</th>
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
