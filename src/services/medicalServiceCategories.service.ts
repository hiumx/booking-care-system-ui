// src/services/medicalServiceCategories.service.ts

import axiosInstance, { ApiResponse } from '@/configs/axios.config';
import {
    ServiceCategoryResponse,
    ServiceCategoryListResponse,
    ServiceCategoryParentsResponse,
    ServiceCategoryQueryParams,
    ServiceWithHospitalListResponse,
    ServiceWithHospitalQueryParams,
} from '@/types/medicalService.types';

// Base API endpoints for service categories
const SERVICE_CATEGORY_ENDPOINTS = {
    BASE: '/medical-services/servicecategories',
    PARENTS: '/medical-services/servicecategories/parents',
    HEALTH: '/medical-services/servicecategories/health',
    BY_ID: (id: string) => `/medical-services/servicecategories/${id}`,
    CHILDREN: (parentId: string) => `/medical-services/servicecategories/${parentId}/children`,
    SERVICES_WITH_HOSPITAL: (categoryId: string) =>
        `/medical-services/services/category/${categoryId}/with-hospital`,
} as const;

/**
 * Medical Service Categories Service
 * Handles all service category-related API operations
 */
export class MedicalServiceCategoriesService {
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
        ApiResponse<ServiceCategoryParentsResponse[]>
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
            if (params.parentId !== undefined) {
                queryParams.append('parentId', params.parentId?.toString() || '');
            }

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
     * Get children of a parent service category
     */
    static async getServiceCategoryChildren(
        parentId: string,
        includeInactive: boolean = false
    ): Promise<ApiResponse<ServiceCategoryResponse[]>> {
        try {
            const queryParams = new URLSearchParams();
            if (includeInactive) {
                queryParams.append('includeInactive', 'true');
            }

            const queryString = queryParams.toString();
            const url = queryString
                ? `${SERVICE_CATEGORY_ENDPOINTS.CHILDREN(parentId)}?${queryString}`
                : SERVICE_CATEGORY_ENDPOINTS.CHILDREN(parentId);

            const response: any = await axiosInstance.get(url);
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message,
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to fetch service category children');
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

    /**
     * Get services with hospital by category ID
     */
    static async getServicesWithHospital(
        categoryId: string,
        params?: ServiceWithHospitalQueryParams
    ): Promise<ApiResponse<ServiceWithHospitalListResponse>> {
        try {
            const queryParams = new URLSearchParams();

            if (params?.page) queryParams.append('page', params.page.toString());
            if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
            if (params?.includeInactive !== undefined) {
                queryParams.append('includeInactive', params.includeInactive.toString());
            }
            if (params?.searchTerm) {
                queryParams.append('searchTerm', params.searchTerm);
            }
            if (params?.hospitalIds && params.hospitalIds.length > 0) {
                queryParams.append('hospitalIds', params.hospitalIds.join(','));
            }
            if (params?.provinceId) {
                queryParams.append('provinceId', params.provinceId);
            }
            if (params?.districtId) {
                queryParams.append('districtId', params.districtId);
            }

            const url = `${SERVICE_CATEGORY_ENDPOINTS.SERVICES_WITH_HOSPITAL(categoryId)}?${queryParams.toString()}`;
            const response: any = await axiosInstance.get(url);

            // API trả về trực tiếp data, không wrap trong response.data
            const apiData = response.data || response;

            return {
                success: true,
                data: apiData,
                message: 'Services with hospital retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || 'Failed to fetch services with hospital'
            );
        }
    }
}

export default MedicalServiceCategoriesService;
