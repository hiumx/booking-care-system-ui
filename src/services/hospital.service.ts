// src/services/hospital.service.ts

import axiosInstance, { ApiResponse } from '@/configs/axios.config';
import {
    HospitalListResponse,
    HospitalDetailResponse,
    HospitalSearchParams,
} from '@/types/hospital.types';

// Base API endpoint for hospital service
const HOSPITAL_ENDPOINTS = {
    BASE: '/hospitals',
    HEALTH: '/hospitals/health',
    GET_HOSPITAL: (id: string) => `/hospitals/${id}`,
    GET_HOSPITALS: '/hospitals',
} as const;

export class HospitalService {
    /**
     * Health check for hospital service
     */
    static async healthCheck(): Promise<ApiResponse> {
        try {
            const response: any = await axiosInstance.get(HOSPITAL_ENDPOINTS.HEALTH);
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Hospital service is healthy',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Health check failed');
        }
    }

    /**
     * Get hospital by ID
     */
    static async getHospitalById(id: string): Promise<ApiResponse<HospitalDetailResponse>> {
        try {
            const response: any = await axiosInstance.get(HOSPITAL_ENDPOINTS.GET_HOSPITAL(id));
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Hospital retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to get hospital');
        }
    }

    /**
     * Get all hospitals with filtering and pagination
     */
    static async getHospitals(
        params?: HospitalSearchParams
    ): Promise<ApiResponse<HospitalListResponse>> {
        try {
            const response: any = await axiosInstance.get(HOSPITAL_ENDPOINTS.GET_HOSPITALS, {
                params,
            });
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Hospitals retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to retrieve hospitals');
        }
    }
}

// Export individual methods for convenience
export const { healthCheck, getHospitalById, getHospitals } = HospitalService;

// Default export
export default HospitalService;
