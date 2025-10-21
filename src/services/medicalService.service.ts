import axiosInstance, { ApiResponse } from '@/configs/axios.config';
import {
    MedicalServiceResponse,
    MedicalServiceListResponse,
    MedicalServiceQueryParams,
    ServiceCategoryResponse,
    ServiceCategoryListResponse,
    ServiceCategoryParentsResponse,
    ServiceCategoryQueryParams,
} from '@/types/medicalService.types';

// Base API endpoints for medical services
const MEDICAL_SERVICE_ENDPOINTS = {
    BASE: '/medical-services/services',
    HEALTH: '/medical-services/services/health',
    BY_ID: (id: string) => `/medical-services/services/${id}`,
} as const;

// Base API endpoints for service categories
const SERVICE_CATEGORY_ENDPOINTS = {
    BASE: '/medical-services/servicecategories',
    PARENTS: '/medical-services/servicecategories/parents',
    HEALTH: '/medical-services/servicecategories/health',
    BY_ID: (id: string) => `/medical-services/servicecategories/${id}`,
} as const;

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

/**
 * Service Category Service
 * Handles all service category-related API operations
 */
export class ServiceCategoryService {
    /**
     * Health check endpoint for service categories
     */
    static async healthCheck(): Promise<ApiResponse> {
        try {
            const response: any = await axiosInstance.get(SERVICE_CATEGORY_ENDPOINTS.HEALTH);
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message,
            };
        } catch (error: any) {
            throw new Error(error.message || 'Service category health check failed');
        }
    }

    /**
     * Get parent service categories (hierarchical structure)
     */
    static async getParentServiceCategories(): Promise<
        ApiResponse<ServiceCategoryParentsResponse>
    > {
        try {
            const response: any = await axiosInstance.get(SERVICE_CATEGORY_ENDPOINTS.PARENTS);
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message,
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to fetch parent service categories');
        }
    }

    /**
     * Get all service categories with pagination and filtering
     */
    static async getServiceCategories(
        params: ServiceCategoryQueryParams = {}
    ): Promise<ApiResponse<ServiceCategoryListResponse>> {
        try {
            const queryParams = new URLSearchParams();

            if (params.page) queryParams.append('page', params.page.toString());
            if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
            if (params.search) queryParams.append('search', params.search);
            if (params.status) queryParams.append('status', params.status.toString());

            const queryString = queryParams.toString();
            const url = queryString
                ? `${SERVICE_CATEGORY_ENDPOINTS.BASE}?${queryString}`
                : SERVICE_CATEGORY_ENDPOINTS.BASE;
            const response: any = await axiosInstance.get(url);

            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message,
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to fetch service categories');
        }
    }

    /**
     * Get service category by ID
     */
    static async getServiceCategoryById(id: string): Promise<ApiResponse<ServiceCategoryResponse>> {
        try {
            const response: any = await axiosInstance.get(SERVICE_CATEGORY_ENDPOINTS.BY_ID(id));
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message,
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to fetch service category');
        }
    }

    /**
     * Create new service category
     */
    static async createServiceCategory(
        categoryData: Partial<ServiceCategoryResponse>
    ): Promise<ApiResponse<ServiceCategoryResponse>> {
        try {
            const response: any = await axiosInstance.post(
                SERVICE_CATEGORY_ENDPOINTS.BASE,
                categoryData
            );
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Service category created successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to create service category');
        }
    }

    /**
     * Update service category
     */
    static async updateServiceCategory(
        id: string,
        categoryData: Partial<ServiceCategoryResponse>
    ): Promise<ApiResponse<ServiceCategoryResponse>> {
        try {
            const response: any = await axiosInstance.put(
                SERVICE_CATEGORY_ENDPOINTS.BY_ID(id),
                categoryData
            );
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Service category updated successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to update service category');
        }
    }

    /**
     * Delete service category
     */
    static async deleteServiceCategory(id: string): Promise<ApiResponse> {
        try {
            const response: any = await axiosInstance.delete(SERVICE_CATEGORY_ENDPOINTS.BY_ID(id));
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Service category deleted successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to delete service category');
        }
    }
}
