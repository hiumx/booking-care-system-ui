import axiosInstance, { ApiResponse } from '@/configs/axios.config';
import { HospitalFaqResponse } from '@/types/hospitalFaq.types';

// Base API endpoints for hospital FAQ service
const HOSPITAL_FAQ_ENDPOINTS = {
    GET_BY_HOSPITAL: (hospitalId: string) => `/hospital-faqs/hospital/${hospitalId}`,
} as const;

/**
 * Hospital FAQ Service
 * Handles hospital FAQ-related API operations for user UI
 */
export class HospitalFaqService {
    /**
     * Get all FAQs for a specific hospital
     */
    static async getFaqsByHospitalId(
        hospitalId: string
    ): Promise<ApiResponse<HospitalFaqResponse[]>> {
        try {
            const response: any = await axiosInstance.get(
                HOSPITAL_FAQ_ENDPOINTS.GET_BY_HOSPITAL(hospitalId)
            );

            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Hospital FAQs retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to fetch hospital FAQs');
        }
    }
}
