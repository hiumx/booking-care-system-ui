// src/services/doctor.service.ts

import axiosInstance, { ApiResponse } from '@/configs/axios.config';
import {
    DoctorResponse,
    DoctorListResponse,
    DoctorDetailResponse,
    DoctorSearchParams,
} from '@/types/doctor.types';
// Removed unused imports for performance optimization
import {
    SpecialtySimpleResponse,
    PositionSimpleResponse,
    LanguageSimpleResponse,
    ServiceTypeSimpleResponse,
} from '@/types/simple.types';

// Base API endpoint for doctor service
const DOCTOR_ENDPOINTS = {
    BASE: '/doctors',
    HEALTH: '/doctors/health',
    GET_DOCTOR: (id: string) => `/doctors/${id}`,
    GET_DOCTORS: '/doctors',
    GET_SPECIALTIES: '/specialties/all',
    GET_ACTIVE_DOCTORS: '/doctors/patients/active',
    SEARCH_ACTIVE_DOCTORS: '/doctors/patients/search',
    GET_FEATURED_DOCTORS: '/doctors/patients/featured',
    FILTER_DOCTORS: '/doctors/filter',
} as const;

export class DoctorService {
    /**
     * Health check for doctor service
     */
    static async healthCheck(): Promise<ApiResponse> {
        try {
            const response: any = await axiosInstance.get(DOCTOR_ENDPOINTS.HEALTH);
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Doctor service is healthy',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Health check failed');
        }
    }

    /**
     * Get doctor by ID
     */
    static async getDoctorById(id: string): Promise<ApiResponse<DoctorDetailResponse>> {
        try {
            const response: any = await axiosInstance.get(DOCTOR_ENDPOINTS.GET_DOCTOR(id));
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Doctor retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to get doctor');
        }
    }

    /**
     * Get all doctors with filtering and pagination
     */
    static async getDoctors(params: DoctorSearchParams): Promise<ApiResponse<DoctorListResponse>> {
        try {
            const response: any = await axiosInstance.get(DOCTOR_ENDPOINTS.GET_DOCTORS, {
                params,
            });
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Doctors retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to retrieve doctors');
        }
    }

    /**
     * Get all specialties (optimized for performance)
     */
    static async getSpecialties(): Promise<ApiResponse<SpecialtySimpleResponse[]>> {
        try {
            const response: any = await axiosInstance.get(DOCTOR_ENDPOINTS.GET_SPECIALTIES);
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Specialties retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to retrieve specialties');
        }
    }

    /**
     * Get all positions (optimized for performance)
     */
    static async getPositions(): Promise<ApiResponse<PositionSimpleResponse[]>> {
        try {
            const response: any = await axiosInstance.get('/positions/all');
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Positions retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to retrieve positions');
        }
    }

    /**
     * Get all languages (optimized for performance)
     */
    static async getLanguages(): Promise<ApiResponse<LanguageSimpleResponse[]>> {
        try {
            const response: any = await axiosInstance.get('/languages/all');
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Languages retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to retrieve languages');
        }
    }

    /**
     * Get all service types (optimized for performance)
     */
    static async getServiceTypes(): Promise<ApiResponse<ServiceTypeSimpleResponse[]>> {
        try {
            const response: any = await axiosInstance.get('/servicetypes/all');
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Service types retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to retrieve service types');
        }
    }

    /**
     * Get active doctors for patients
     */
    static async getActiveDoctorsForPatients(
        params?: DoctorSearchParams
    ): Promise<ApiResponse<DoctorListResponse>> {
        try {
            const queryParams = params
                ? {
                      ...(params.searchTerm && { searchTerm: params.searchTerm }),
                      ...(params.specialtyFilter && { specialtyId: params.specialtyFilter }),
                      ...(params.hospitalFilter && { hospitalId: params.hospitalFilter }),
                      ...(params.positionFilter && { positionId: params.positionFilter }),
                      ...(params.languageFilter && { language: params.languageFilter }),
                      ...(params.serviceTypeFilter && { serviceType: params.serviceTypeFilter }),
                      ...(params.ratingFilter && { minRating: params.ratingFilter }),
                      ...(params.genderFilter !== undefined && { gender: params.genderFilter }),
                      ...(params.priceRange && {
                          minPrice: params.priceRange.min,
                          maxPrice: params.priceRange.max,
                      }),
                      ...(params.patientId && { patientId: params.patientId }),
                      ...(params.pageNumber && { pageNumber: params.pageNumber }),
                      ...(params.pageSize && { pageSize: params.pageSize }),
                  }
                : {};

            const response: any = await axiosInstance.get(DOCTOR_ENDPOINTS.GET_ACTIVE_DOCTORS, {
                params: queryParams,
            });
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Active doctors retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to get active doctors for patients');
        }
    }

    /**
     * Helper function to add basic filters to query params
     */
    private static addBasicFilters(
        params: DoctorSearchParams,
        queryParams: Record<string, any>
    ): void {
        const basicFilters = [
            { key: 'searchTerm', value: params.searchTerm },
            { key: 'specialtyId', value: params.specialtyFilter },
            { key: 'hospitalId', value: params.hospitalFilter },
            { key: 'positionId', value: params.positionFilter },
            { key: 'language', value: params.languageFilter },
            { key: 'serviceType', value: params.serviceTypeFilter },
            { key: 'minRating', value: params.ratingFilter },
            {
                key: 'gender',
                value: params.genderFilter ?? undefined,
            },
            { key: 'patientId', value: params.patientId },
            { key: 'pageNumber', value: params.pageNumber },
            { key: 'pageSize', value: params.pageSize },
            { key: 'sortBy', value: params.sortBy },
            { key: 'sortOrder', value: params.sortOrder },
        ];

        for (const filter of basicFilters) {
            if (filter.value) {
                queryParams[filter.key] = filter.value;
            }
        }
    }

    /**
     * Helper function to add array filters to query params
     */
    private static addArrayFilters(
        params: DoctorSearchParams,
        queryParams: Record<string, any>
    ): void {
        const arrayFilters = [
            { key: 'positionIds', value: params.positionFilters },
            { key: 'languages', value: params.languageFilters },
            { key: 'serviceTypes', value: params.serviceTypeFilters },
            { key: 'minRatings', value: params.ratingFilters },
            { key: 'genders', value: params.genderFilters },
            { key: 'experienceRanges', value: params.experienceFilters },
        ];

        for (const filter of arrayFilters) {
            if (filter.value && filter.value.length > 0) {
                queryParams[filter.key] = filter.value;
            }
        }
    }

    /**
     * Helper function to add object filters to query params
     */
    private static addObjectFilters(
        params: DoctorSearchParams,
        queryParams: Record<string, any>
    ): void {
        if (params.experienceFilter) {
            queryParams.experienceFilter = params.experienceFilter;
        }

        if (params.priceRange) {
            queryParams.minPrice = params.priceRange.min;
            queryParams.maxPrice = params.priceRange.max;
        }
    }

    /**
     * Helper function to build query parameters for search
     */
    private static buildSearchQueryParams(params: DoctorSearchParams): Record<string, any> {
        const queryParams: Record<string, any> = {};

        this.addBasicFilters(params, queryParams);
        this.addArrayFilters(params, queryParams);
        this.addObjectFilters(params, queryParams);

        return queryParams;
    }

    /**
     * Search active doctors by name, specialty, or location for patients
     */
    static async searchActiveDoctors(
        params: DoctorSearchParams
    ): Promise<ApiResponse<DoctorListResponse>> {
        try {
            const queryParams = this.buildSearchQueryParams(params);

            const response: any = await axiosInstance.get(DOCTOR_ENDPOINTS.SEARCH_ACTIVE_DOCTORS, {
                params: queryParams,
            });
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Search results retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to search active doctors');
        }
    }

    /**
     * Advanced filter doctors with multiple criteria
     */
    static async filterDoctors(
        params: DoctorSearchParams
    ): Promise<ApiResponse<DoctorListResponse>> {
        try {
            const filterRequest = {
                searchTerm: params.searchTerm,
                specialtyId: params.specialtyFilter,
                specialtyIds: params.specialtyFilters, // Add multiple specialty support
                positionId: params.positionFilter,
                positionIds: params.positionFilters,
                gender: params.genderFilter,
                genders: params.genderFilters,
                minYearsOfExperience: params.experienceRange?.min,
                maxYearsOfExperience: params.experienceRange?.max,
                experienceRanges: params.experienceFilters, // Keep for backward compatibility
                minPrice: params.priceRange?.min,
                maxPrice: params.priceRange?.max,
                hospitalId: params.hospitalFilter,
                ProvinceId: params.areaFilter?.provinceId, // Use PascalCase for backend
                DistrictId: params.areaFilter?.districtId, // Use PascalCase for backend
                hospitalIds: params.hospitalFilters, // Add multiple hospital support
                serviceType: params.serviceTypeFilter,
                serviceTypes: params.serviceTypeFilters,
                language: params.languageFilter,
                languages: params.languageFilters,
                minRating: params.ratingFilter,
                minRatings: params.ratingFilters,
                sortBy: params.sortBy,
                sortOrder: params.sortOrder,
                pageNumber: params.pageNumber || 1,
                pageSize: params.pageSize || 10,
            };

            console.log(
                'Frontend: ExperienceRanges being sent:',
                JSON.stringify(params.experienceFilters, null, 2)
            );
            console.log(
                'Frontend: AreaFilter being sent:',
                JSON.stringify(params.areaFilter, null, 2)
            );
            console.log('Frontend: ProvinceId being sent:', params.areaFilter?.provinceId);
            console.log('Frontend: DistrictId being sent:', params.areaFilter?.districtId);
            console.log(
                'Frontend: FilterRequest being sent:',
                JSON.stringify(filterRequest, null, 2)
            );
            const response: any = await axiosInstance.post(
                DOCTOR_ENDPOINTS.FILTER_DOCTORS,
                filterRequest
            );
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Doctors filtered successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to filter doctors');
        }
    }

    /**
     * Get featured active doctors for patients
     */
    static async getFeaturedActiveDoctors(): Promise<ApiResponse<DoctorResponse[]>> {
        try {
            const response: any = await axiosInstance.get(DOCTOR_ENDPOINTS.GET_FEATURED_DOCTORS);
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Featured doctors retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to get featured doctors');
        }
    }
}

// Export individual methods for convenience
export const {
    healthCheck,
    getDoctorById,
    getDoctors,
    getSpecialties,
    getPositions,
    getLanguages,
    getServiceTypes,
    getActiveDoctorsForPatients,
    searchActiveDoctors,
    getFeaturedActiveDoctors,
} = DoctorService;

// Default export
export default DoctorService;
