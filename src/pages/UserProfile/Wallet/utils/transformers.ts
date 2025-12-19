import { RefundHistory, Transaction } from '../types/wallet.types';

/**
 * Transform RefundHistory to Transaction format for display in TransactionTable
 */
export const transformRefundHistoryToTransaction = (refundHistory: RefundHistory): Transaction => {
    // Format date
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    // Format amount as currency
    const formatAmount = (amount: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    // Map status
    const mapStatus = (status: string): 'completed' | 'pending' => {
        return status === 'COMPLETED' ? 'completed' : 'pending';
    };

    // Mask account number for privacy (show first 4 and last 4 digits)
    const maskAccountNumber = (accountNumber: string): string => {
        if (accountNumber.length <= 8) return accountNumber;
        const firstFour = accountNumber.slice(0, 4);
        const lastFour = accountNumber.slice(-4);
        const middle = 'X'.repeat(Math.min(accountNumber.length - 8, 8));
        return `${firstFour} ${middle} ${lastFour}`;
    };

    // Handle null bankAccount
    const accountNumber = refundHistory.bankAccount?.accountNumber || 'N/A';

    return {
        id: refundHistory.id,
        accountNo: accountNumber === 'N/A' ? accountNumber : maskAccountNumber(accountNumber),
        reason: refundHistory.refundReason || 'Không có lý do',
        date: formatDate(refundHistory.updatedAt),
        amount: formatAmount(refundHistory.refundAmount),
        status: mapStatus(refundHistory.status),
    };
};

/**
 * Transform multiple RefundHistory records to Transaction array
 */
export const transformRefundHistoriesToTransactions = (
    refundHistories: RefundHistory[]
): Transaction[] => {
    return refundHistories.map(transformRefundHistoryToTransaction);
};
