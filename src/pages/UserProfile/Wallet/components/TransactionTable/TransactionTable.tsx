import React from 'react';
import clsx from 'clsx';

import { Transaction } from '../../types/wallet.types';
import styles from './TransactionTable.module.scss';

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

    // Format GUID to a shorter, readable form while keeping full id in tooltip
    const formatTransactionId = (id: string, prefixLen = 8, suffixLen = 4) => {
        if (!id) return '';
        if (id.length <= prefixLen + suffixLen + 3) return id;
        return `${id.slice(0, prefixLen)}...${id.slice(-suffixLen)}`;
    };
    // Loading state - Skeleton
    if (loading) {
        const skeletonRows = Array.from({ length: 5 }, (_, i) => `skeleton-row-${i}`);
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
                                            <th>Số tài khoản</th>
                                            <th>Lý do hoàn tiền</th>
                                            <th>Cập nhật vào lúc</th>
                                            <th>Số tiền hoàn trả</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {skeletonRows.map((rowId) => (
                                            <tr key={rowId}>
                                                <td>
                                                    <div
                                                        className={clsx(
                                                            styles.skeleton,
                                                            styles.skeletonText
                                                        )}
                                                        style={{
                                                            height: 20,
                                                            width: `${Math.random() * 30 + 70}px`,
                                                        }}
                                                    />
                                                </td>
                                                <td>
                                                    <div
                                                        className={clsx(
                                                            styles.skeleton,
                                                            styles.skeletonText
                                                        )}
                                                        style={{
                                                            height: 20,
                                                            width: `${Math.random() * 40 + 90}px`,
                                                        }}
                                                    />
                                                </td>
                                                <td>
                                                    <div
                                                        className={clsx(
                                                            styles.skeleton,
                                                            styles.skeletonText
                                                        )}
                                                        style={{
                                                            height: 20,
                                                            width: `${Math.random() * 60 + 100}px`,
                                                        }}
                                                    />
                                                </td>
                                                <td>
                                                    <div
                                                        className={clsx(
                                                            styles.skeleton,
                                                            styles.skeletonText
                                                        )}
                                                        style={{
                                                            height: 20,
                                                            width: `${Math.random() * 20 + 85}px`,
                                                        }}
                                                    />
                                                </td>
                                                <td>
                                                    <div
                                                        className={clsx(
                                                            styles.skeleton,
                                                            styles.skeletonText
                                                        )}
                                                        style={{
                                                            height: 20,
                                                            width: `${Math.random() * 30 + 70}px`,
                                                        }}
                                                    />
                                                </td>
                                                <td>
                                                    <div
                                                        className={clsx(
                                                            styles.skeleton,
                                                            styles.skeletonBadge
                                                        )}
                                                        style={{ height: 28, width: 90 }}
                                                    />
                                                </td>
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
                                        <th>ID</th>
                                        <th>Số tài khoản</th>
                                        <th>Lý do hoàn tiền</th>
                                        <th>Cập nhật vào lúc</th>
                                        <th>Số tiền hoàn trả</th>
                                        <th>Trạng thái</th>
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
                                                    {formatTransactionId(transaction.id)}
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
