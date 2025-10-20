// src/services/hospital.service.ts

import axiosInstance, { ApiResponse } from '@/configs/axios.config';
import {
    HospitalListResponse,
    HospitalDetailResponse,
    HospitalSearchParams,
    HospitalListOptimizedPaginatedResponse,
    HospitalListOptimizedFilterRequest,
} from '@/types/hospital.types';
import { HospitalSimpleResponse } from '@/types/simple.types';

// Base API endpoint for hospital service
const HOSPITAL_ENDPOINTS = {
    BASE: '/hospitals',
    HEALTH: '/hospitals/health',
    GET_HOSPITAL: (id: string) => `/hospitals/${id}`,
    GET_HOSPITALS: '/hospitals',
    GET_ALL_HOSPITALS: '/hospitals/all',
    GET_OPTIMIZED_LIST: '/hospitals/list',
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

    /**
     * Get all hospitals (optimized for performance)
     */
    static async getAllHospitals(): Promise<ApiResponse<HospitalSimpleResponse[]>> {
        try {
            const response: any = await axiosInstance.get(HOSPITAL_ENDPOINTS.GET_ALL_HOSPITALS);
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Hospitals retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to retrieve hospitals');
        }
    }

    /**
     * Get optimized hospital list with essential fields, filters, and pagination
     */
    static async getOptimizedHospitalList(
        params?: HospitalListOptimizedFilterRequest
    ): Promise<ApiResponse<HospitalListOptimizedPaginatedResponse>> {
        try {
            console.log('Sending hospital list request with params:', params);

            // Convert specialtyIds from string[] to individual query parameters
            const requestParams: any = { ...params };
            if (params?.specialtyIds && params.specialtyIds.length > 0) {
                // Remove specialtyIds from params and add individual parameters
                delete requestParams.specialtyIds;
                for (const [index, id] of params.specialtyIds.entries()) {
                    requestParams[`specialtyIds[${index}]`] = id;
                }
            }

            const response: any = await axiosInstance.get(HOSPITAL_ENDPOINTS.GET_OPTIMIZED_LIST, {
                params: requestParams,
            });
            console.log('Hospital list response:', response);
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Optimized hospital list retrieved successfully',
            };
        } catch (error: any) {
            console.error('Hospital list request error:', error);
            throw new Error(error.message || 'Failed to retrieve optimized hospital list');
        }
    }
}

// Export individual methods for convenience
export const {
    healthCheck,
    getHospitalById,
    getHospitals,
    getAllHospitals,
    getOptimizedHospitalList,
} = HospitalService;

// Default export
export default HospitalService;
