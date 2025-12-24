import axiosInstance from '@/configs/axios.config';
import { ApiResponse, RefundHistoryResponse } from '@/pages/UserProfile/Wallet/types/wallet.types';

export class RefundHistoryService {
    /**
     * Get refund histories for a user (processable ones)
     */
    static async getRefundHistories(userId: string): Promise<RefundHistoryResponse> {
        try {
            const result: ApiResponse<RefundHistoryResponse> = await axiosInstance.get(
                `/refundHistories/user/${userId}/processable`
            );

            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch refund histories');
            }

            return result.data;
        } catch (error: any) {
            console.error('Error fetching refund histories:', error);
            throw new Error(error.message || 'Failed to fetch refund histories');
        }
    }

    /**
     * Get all refund histories for a user
     */
    static async getAllRefundHistories(userId: string): Promise<RefundHistoryResponse> {
        try {
            const result: ApiResponse<RefundHistoryResponse> = await axiosInstance.get(
                `/refundHistories/user/${userId}`
            );

            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch all refund histories');
            }

            return result.data;
        } catch (error: any) {
            console.error('Error fetching all refund histories:', error);
            throw new Error(error.message || 'Failed to fetch all refund histories');
        }
    }
}

export default RefundHistoryService;
