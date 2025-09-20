import axiosInstance from '../configs/axios.config';
import {
    Discount,
    CreateDiscountRequest,
    UpdateDiscountRequest,
    DiscountQueryParams,
    DiscountResponse,
    DiscountListResponse,
    DiscountValidationResult,
    ApplyDiscountRequest,
    DiscountUsageStats,
} from '../types/discount.types';
import { DiscountStatus } from '../enums/discount.enums';

// Base API endpoint for discounts
const DISCOUNT_ENDPOINTS = {
    BASE: '/discounts',
    VALIDATE: '/discounts/validate',
    APPLY: '/discounts/apply',
    STATS: '/discounts/stats',
    BULK: '/discounts/bulk',
} as const;

/**
 * Discount Service
 * Handles all discount-related API operations
 */
export class DiscountService {
    /**
     * Get all discounts with optional filtering and pagination
     */
    static async getDiscounts(params?: DiscountQueryParams): Promise<DiscountListResponse> {
        try {
            const queryString = new URLSearchParams();

            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        queryString.append(key, String(value));
                    }
                });
            }

            const response: any = await axiosInstance.get(
                `${DISCOUNT_ENDPOINTS.BASE}?${queryString.toString()}`
            );

            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message,
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to fetch discounts');
        }
    }

    /**
     * Get a single discount by ID
     */
    static async getDiscountById(id: string): Promise<DiscountResponse> {
        try {
            const response: any = await axiosInstance.get(`${DISCOUNT_ENDPOINTS.BASE}/${id}`);

            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message,
            };
        } catch (error: any) {
            throw new Error(error.message || `Failed to fetch discount with ID: ${id}`);
        }
    }

    /**
     * Get discount by code
     */
    static async getDiscountByCode(code: string): Promise<DiscountResponse> {
        try {
            const response: any = await axiosInstance.get(
                `${DISCOUNT_ENDPOINTS.BASE}/code/${encodeURIComponent(code)}`
            );

            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message,
            };
        } catch (error: any) {
            throw new Error(error.message || `Failed to fetch discount with code: ${code}`);
        }
    }

    /**
     * Create a new discount
     */
    static async createDiscount(discountData: CreateDiscountRequest): Promise<DiscountResponse> {
        try {
            const response: any = await axiosInstance.post(DISCOUNT_ENDPOINTS.BASE, discountData);

            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Discount created successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to create discount');
        }
    }

    /**
     * Update an existing discount
     */
    static async updateDiscount(discountData: UpdateDiscountRequest): Promise<DiscountResponse> {
        try {
            const { id, ...updateData } = discountData;
            const response: any = await axiosInstance.put(
                `${DISCOUNT_ENDPOINTS.BASE}/${id}`,
                updateData
            );

            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Discount updated successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to update discount');
        }
    }

    /**
     * Delete a discount
     */
    static async deleteDiscount(id: string): Promise<{ success: boolean; message: string }> {
        try {
            const response: any = await axiosInstance.delete(`${DISCOUNT_ENDPOINTS.BASE}/${id}`);

            return {
                success: response.success ?? true,
                message: response.message || 'Discount deleted successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to delete discount');
        }
    }

    /**
     * Validate a discount code
     */
    static async validateDiscount(
        code: string,
        context: {
            clinicId: number;
            specialtyId?: number;
            doctorId?: number;
            amount: number;
        }
    ): Promise<DiscountValidationResult> {
        try {
            const response: any = await axiosInstance.post(DISCOUNT_ENDPOINTS.VALIDATE, {
                code,
                ...context,
            });

            return response.data || response;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to validate discount');
        }
    }

    /**
     * Apply a discount code
     */
    static async applyDiscount(request: ApplyDiscountRequest): Promise<DiscountValidationResult> {
        try {
            const response: any = await axiosInstance.post(DISCOUNT_ENDPOINTS.APPLY, request);

            return response.data || response;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to apply discount');
        }
    }

    /**
     * Get discount usage statistics
     */
    static async getDiscountStats(filters?: {
        clinicId?: number;
        startDate?: string;
        endDate?: string;
    }): Promise<DiscountUsageStats> {
        try {
            const queryString = new URLSearchParams();

            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        queryString.append(key, String(value));
                    }
                });
            }

            const response: any = await axiosInstance.get(
                `${DISCOUNT_ENDPOINTS.STATS}?${queryString.toString()}`
            );

            return response.data || response;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to fetch discount stats');
        }
    }

    /**
     * Bulk update discount status
     */
    static async bulkUpdateStatus(
        discountIds: string[],
        status: DiscountStatus
    ): Promise<{ success: boolean; message: string; updatedCount: number }> {
        try {
            const response: any = await axiosInstance.patch(`${DISCOUNT_ENDPOINTS.BULK}/status`, {
                discountIds,
                status,
            });

            return {
                success: response.success ?? true,
                message: response.message || 'Bulk status update completed',
                updatedCount: response.data?.updatedCount || response.updatedCount || 0,
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to update discount statuses');
        }
    }

    /**
     * Bulk delete discounts
     */
    static async bulkDeleteDiscounts(
        discountIds: string[]
    ): Promise<{ success: boolean; message: string; deletedCount: number }> {
        try {
            const response: any = await axiosInstance.delete(`${DISCOUNT_ENDPOINTS.BULK}/delete`, {
                data: { discountIds },
            });

            return {
                success: response.success ?? true,
                message: response.message || 'Bulk delete completed',
                deletedCount: response.data?.deletedCount || response.deletedCount || 0,
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to delete discounts in bulk');
        }
    }

    /**
     * Get active discounts for a specific context
     */
    static async getActiveDiscounts(context: {
        clinicId: string;
        specialtyId?: string;
        doctorId?: string;
    }): Promise<Discount[]> {
        try {
            const queryParams: DiscountQueryParams = {
                status: DiscountStatus.ACTIVE,
                clinicId: context.clinicId,
                ...(context.specialtyId && { specialtyId: context.specialtyId }),
                ...(context.doctorId && { doctorId: context.doctorId }),
                sortBy: 'amount',
                sortOrder: 'desc',
            };

            const result = await this.getDiscounts(queryParams);
            return result.data.discounts;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to fetch active discounts');
        }
    }

    /**
     * Check if a discount code is available and valid
     */
    static async checkDiscountAvailability(code: string): Promise<{
        available: boolean;
        discount?: Discount;
        message: string;
    }> {
        try {
            const result = await this.getDiscountByCode(code);
            const discount = result.data;

            if (!discount) {
                return {
                    available: false,
                    message: 'Discount code not found',
                };
            }

            const now = new Date();
            const startDate = new Date(discount.startDate);
            const endDate = new Date(discount.endDate);

            if (discount.status !== DiscountStatus.ACTIVE) {
                return {
                    available: false,
                    discount,
                    message: `Discount is ${discount.status.toString().toLowerCase()}`,
                };
            }

            if (now < startDate) {
                return {
                    available: false,
                    discount,
                    message: 'Discount is not yet active',
                };
            }

            if (now > endDate) {
                return {
                    available: false,
                    discount,
                    message: 'Discount has expired',
                };
            }

            if (discount.maxUses && discount.usesCount >= discount.maxUses) {
                return {
                    available: false,
                    discount,
                    message: 'Discount usage limit reached',
                };
            }

            return {
                available: true,
                discount,
                message: 'Discount is available',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to check discount availability');
        }
    }
}

// Export individual methods for convenience
export const {
    getDiscounts,
    getDiscountById,
    getDiscountByCode,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    validateDiscount,
    applyDiscount,
    getDiscountStats,
    bulkUpdateStatus,
    bulkDeleteDiscounts,
    getActiveDiscounts,
    checkDiscountAvailability,
} = DiscountService;

// Default export
export default DiscountService;
