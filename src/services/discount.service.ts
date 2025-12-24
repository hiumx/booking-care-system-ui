import axiosInstance from '../configs/axios.config';
import { Discount, DiscountValidationResult } from '../types/discount.types';
import { DiscountStatus } from '../enums/discount.enums';

// Base API endpoint for discounts
const DISCOUNT_ENDPOINTS = {
    BY_CODE: (code: string) => `/discounts/by-code/${code}`,
    HOSPITAL_ACTIVE: (hospitalId: string) => `/discounts/hospital/${hospitalId}/active`,
    VALIDATE: '/discounts/validate',
    CALCULATE: '/discounts/calculate',
} as const;

/**
 * Discount Service (Patient Side)
 * Handles discount validation and calculation for patients during booking
 */
export class DiscountService {
    /**
     * Get discount by code
     */
    static async getDiscountByCode(code: string): Promise<Discount | null> {
        try {
            const response: any = await axiosInstance.get(
                DISCOUNT_ENDPOINTS.BY_CODE(encodeURIComponent(code))
            );

            return response.data || response;
        } catch (error: any) {
            console.error('Failed to fetch discount:', error);
            return null;
        }
    }

    /**
     * Validate a discount code
     */
    static async validateDiscount(
        code: string,
        context: {
            hospitalId: string;
            totalAmount: number;
        }
    ): Promise<DiscountValidationResult> {
        try {
            const response: any = await axiosInstance.post(DISCOUNT_ENDPOINTS.VALIDATE, {
                code,
                hospitalId: context.hospitalId,
                totalAmount: context.totalAmount,
            });

            return response.data || response;
        } catch (error: any) {
            const validationResult: DiscountValidationResult = {
                isValid: false,
                discountAmount: 0,
                finalAmount: context.totalAmount,
                message:
                    error.response?.data?.message || error.message || 'Mã giảm giá không hợp lệ',
                errors: [error.message || 'Validation failed'],
            };
            const errorInstance = new Error(validationResult.message);
            // Attach validation result to error for caller to use
            (errorInstance as any).validationResult = validationResult;
            throw errorInstance;
        }
    }

    /**
     * Calculate discount amount without applying it
     */
    static async calculateDiscountAmount(request: {
        code: string;
        originalAmount: number;
        hospitalId: string;
    }): Promise<{
        discountAmount: number;
        finalAmount: number;
        originalAmount: number;
    }> {
        try {
            const response: any = await axiosInstance.post(DISCOUNT_ENDPOINTS.CALCULATE, request);

            return response.data || response;
        } catch {
            return {
                discountAmount: 0,
                finalAmount: request.originalAmount,
                originalAmount: request.originalAmount,
            };
        }
    }

    /**
     * Get active discounts for a hospital
     */
    static async getActiveDiscounts(hospitalId: string): Promise<Discount[]> {
        try {
            const response: any = await axiosInstance.get(
                DISCOUNT_ENDPOINTS.HOSPITAL_ACTIVE(hospitalId)
            );

            return response.data || response;
        } catch (error: any) {
            console.error('Failed to fetch active discounts:', error);
            return [];
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
            const discount = await this.getDiscountByCode(code);

            if (!discount) {
                return {
                    available: false,
                    message: 'Không tìm thấy mã giảm giá',
                };
            }

            const now = new Date();
            const startDate = new Date(discount.startDate);
            const endDate = new Date(discount.endDate);

            if (discount.status !== DiscountStatus.ACTIVE) {
                return {
                    available: false,
                    discount,
                    message: 'Mã giảm giá không còn hiệu lực',
                };
            }

            if (now < startDate) {
                return {
                    available: false,
                    discount,
                    message: 'Mã giảm giá chưa đến thời gian áp dụng',
                };
            }

            if (now > endDate) {
                return {
                    available: false,
                    discount,
                    message: 'Mã giảm giá đã hết hạn',
                };
            }

            if (discount.maxUses && discount.usesCount >= discount.maxUses) {
                return {
                    available: false,
                    discount,
                    message: 'Mã giảm giá đã hết lượt sử dụng',
                };
            }

            return {
                available: true,
                discount,
                message: 'Mã giảm giá hợp lệ',
            };
        } catch (error: any) {
            return {
                available: false,
                message: error.message || 'Không thể kiểm tra mã giảm giá',
            };
        }
    }
}

// Export individual methods for convenience
export const {
    getDiscountByCode,
    validateDiscount,
    calculateDiscountAmount,
    getActiveDiscounts,
    checkDiscountAvailability,
} = DiscountService;

// Default export
export default DiscountService;
