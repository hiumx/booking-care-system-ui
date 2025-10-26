import axiosInstance, { ApiResponse } from '@/configs/axios.config';
import {
    MedicalServiceResponse,
    MedicalServiceListResponse,
    MedicalServiceQueryParams,
} from '@/types/medicalService.types';

// Base API endpoints for medical services
const MEDICAL_SERVICE_ENDPOINTS = {
    BASE: '/medical-services/services',
    HEALTH: '/medical-services/services/health',
    BY_ID: (id: string) => `/medical-services/services/${id}`,
} as const;

// Service category endpoints are now handled by MedicalServiceCategoriesService

/**
 * Medical Service Service
 * Handles all medical service-related API operations
 */
export class MedicalServiceService {
    /**
     * Health check endpoint for medical services
     */
    static async healthCheck(): Promise<ApiResponse> {
        try {
            const response: any = await axiosInstance.get(MEDICAL_SERVICE_ENDPOINTS.HEALTH);
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message,
            };
        } catch (error: any) {
            throw new Error(error.message || 'Medical service health check failed');
        }
    }

    /**
     * Get all medical services with pagination and filtering
     */
    static async getMedicalServices(
        params: MedicalServiceQueryParams = {}
    ): Promise<ApiResponse<MedicalServiceListResponse>> {
        try {
            const queryParams = new URLSearchParams();

            if (params.page) queryParams.append('page', params.page.toString());
            if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
            if (params.search) queryParams.append('search', params.search);
            if (params.status) queryParams.append('status', params.status.toString());

            const queryString = queryParams.toString();
            const url = queryString
                ? `${MEDICAL_SERVICE_ENDPOINTS.BASE}?${queryString}`
                : MEDICAL_SERVICE_ENDPOINTS.BASE;
            const response: any = await axiosInstance.get(url);

            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message,
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to fetch medical services');
        }
    }

    /**
     * Get medical service by ID
     */
    static async getMedicalServiceById(id: string): Promise<ApiResponse<MedicalServiceResponse>> {
        try {
            const response: any = await axiosInstance.get(MEDICAL_SERVICE_ENDPOINTS.BY_ID(id));
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message,
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to fetch medical service');
        }
    }

    /**
     * Create new medical service
     */
    static async createMedicalService(
        serviceData: Partial<MedicalServiceResponse>
    ): Promise<ApiResponse<MedicalServiceResponse>> {
        try {
            const response: any = await axiosInstance.post(
                MEDICAL_SERVICE_ENDPOINTS.BASE,
                serviceData
            );
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Medical service created successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to create medical service');
        }
    }

    /**
     * Update medical service
     */
    static async updateMedicalService(
        id: string,
        serviceData: Partial<MedicalServiceResponse>
    ): Promise<ApiResponse<MedicalServiceResponse>> {
        try {
            const response: any = await axiosInstance.put(
                MEDICAL_SERVICE_ENDPOINTS.BY_ID(id),
                serviceData
            );
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Medical service updated successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to update medical service');
        }
    }

    /**
     * Delete medical service
     */
    static async deleteMedicalService(id: string): Promise<ApiResponse> {
        try {
            const response: any = await axiosInstance.delete(MEDICAL_SERVICE_ENDPOINTS.BY_ID(id));
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Medical service deleted successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to delete medical service');
        }
    }
}

// ServiceCategoryService has been moved to medicalServiceCategories.service.ts
// Import it from there to avoid duplication
export { MedicalServiceCategoriesService as ServiceCategoryService } from './medicalServiceCategories.service';
