import { useState, useEffect } from 'react';
import { RefundHistory } from '../types/wallet.types';
import RefundHistoryService from '@/services/refundHistory.service';

export const useRefundHistory = (userId?: string) => {
    const [refundHistories, setRefundHistories] = useState<RefundHistory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRefundHistories = async () => {
        if (!userId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await RefundHistoryService.getRefundHistories(userId);
            setRefundHistories(response.refundHistories || []);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Failed to fetch refund histories';
            setError(errorMessage);
            setRefundHistories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRefundHistories();
    }, [userId]);

    return {
        refundHistories,
        loading,
        error,
        refetch: fetchRefundHistories,
    };
};
