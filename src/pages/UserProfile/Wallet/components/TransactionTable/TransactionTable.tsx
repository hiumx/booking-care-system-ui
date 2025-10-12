import React from 'react';
import clsx from 'clsx';
import { Skeleton } from '@mui/material';

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

    // Format GUID to a shorter, readable form while keeping full id in tooltip
    const formatTransactionId = (id: string, prefixLen = 8, suffixLen = 4) => {
        if (!id) return '';
        if (id.length <= prefixLen + suffixLen + 3) return id;
        return `${id.slice(0, prefixLen)}...${id.slice(-suffixLen)}`;
    };
    // Loading state - Skeleton
    if (loading) {
        // Predefined widths to avoid Math.random() SonarQube warning and ensure consistent skeleton appearance
        const skeletonWidths = [
            { key: 'skeleton-row-1', id: 85, account: 120, reason: 150, date: 95, amount: 90 },
            { key: 'skeleton-row-2', id: 75, account: 110, reason: 140, date: 100, amount: 85 },
            { key: 'skeleton-row-3', id: 90, account: 115, reason: 135, date: 90, amount: 95 },
            { key: 'skeleton-row-4', id: 80, account: 125, reason: 145, date: 105, amount: 80 },
            { key: 'skeleton-row-5', id: 95, account: 105, reason: 130, date: 85, amount: 100 },
        ];

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
                                        {skeletonWidths.map((widths) => (
                                            <tr key={widths.key}>
                                                <td>
                                                    <Skeleton
                                                        variant="text"
                                                        width={widths.id}
                                                        height={20}
                                                        sx={{ bgcolor: 'grey.200' }}
                                                    />
                                                </td>
                                                <td>
                                                    <Skeleton
                                                        variant="text"
                                                        width={widths.account}
                                                        height={20}
                                                        sx={{ bgcolor: 'grey.200' }}
                                                    />
                                                </td>
                                                <td>
                                                    <Skeleton
                                                        variant="text"
                                                        width={widths.reason}
                                                        height={20}
                                                        sx={{ bgcolor: 'grey.200' }}
                                                    />
                                                </td>
                                                <td>
                                                    <Skeleton
                                                        variant="text"
                                                        width={widths.date}
                                                        height={20}
                                                        sx={{ bgcolor: 'grey.200' }}
                                                    />
                                                </td>
                                                <td>
                                                    <Skeleton
                                                        variant="text"
                                                        width={widths.amount}
                                                        height={20}
                                                        sx={{ bgcolor: 'grey.200' }}
                                                    />
                                                </td>
                                                <td>
                                                    <Skeleton
                                                        variant="rounded"
                                                        width={90}
                                                        height={28}
                                                        sx={{
                                                            bgcolor: 'grey.200',
                                                            borderRadius: '16px',
                                                        }}
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
