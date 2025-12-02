import axiosInstance, { ApiResponse } from '@/configs/axios.config';
import {
    PatientRelativeResponse,
    PatientRelativeBasicResponse,
    CreatePatientRelativeRequest,
    UpdatePatientRelativeRequest,
} from '@/types/patient-relative.types';

// Base API endpoints for patient relatives
const PATIENT_RELATIVE_ENDPOINTS = {
    BASE: '/patient-relatives',
    BASIC: '/patient-relatives/basic',
    BY_ID: (id: string) => `/patient-relatives/${id}`,
} as const;

/**
 * Patient Relative Service
 * Handles all patient relative (family members) API operations
 */
export class PatientRelativeService {
    /**
     * Get all relatives for the current user
     */
    static async getMyRelatives(): Promise<ApiResponse<PatientRelativeResponse[]>> {
        try {
            const response: any = await axiosInstance.get(PATIENT_RELATIVE_ENDPOINTS.BASE);
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Relatives retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to get relatives');
        }
    }

    /**
     * Get all relatives for dropdown/selection (lightweight)
     */
    static async getMyRelativesBasic(): Promise<ApiResponse<PatientRelativeBasicResponse[]>> {
        try {
            const response: any = await axiosInstance.get(PATIENT_RELATIVE_ENDPOINTS.BASIC);
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Relatives retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to get relatives');
        }
    }

    /**
     * Get a specific relative by ID
     */
    static async getRelativeById(id: string): Promise<ApiResponse<PatientRelativeResponse>> {
        try {
            const response: any = await axiosInstance.get(PATIENT_RELATIVE_ENDPOINTS.BY_ID(id));
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Relative retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to get relative');
        }
    }

    /**
     * Create a new relative
     */
    static async createRelative(
        request: CreatePatientRelativeRequest
    ): Promise<ApiResponse<PatientRelativeResponse>> {
        try {
            const response: any = await axiosInstance.post(
                PATIENT_RELATIVE_ENDPOINTS.BASE,
                request
            );
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Relative created successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to create relative');
        }
    }

    /**
     * Update an existing relative
     */
    static async updateRelative(
        id: string,
        request: UpdatePatientRelativeRequest
    ): Promise<ApiResponse<PatientRelativeResponse>> {
        try {
            const response: any = await axiosInstance.put(
                PATIENT_RELATIVE_ENDPOINTS.BY_ID(id),
                request
            );
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Relative updated successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to update relative');
        }
    }

    /**
     * Delete a relative
     */
    static async deleteRelative(id: string): Promise<ApiResponse<boolean>> {
        try {
            const response: any = await axiosInstance.delete(PATIENT_RELATIVE_ENDPOINTS.BY_ID(id));
            return {
                success: response.success ?? true,
                data: response.data ?? true,
                message: response.message || 'Relative deleted successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to delete relative');
        }
    }
}

// Export individual methods for convenience
export const {
    getMyRelatives,
    getMyRelativesBasic,
    getRelativeById,
    createRelative,
    updateRelative,
    deleteRelative,
} = PatientRelativeService;

// Default export
export default PatientRelativeService;
