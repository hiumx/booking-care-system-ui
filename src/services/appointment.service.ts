import axiosInstance, { ApiResponse } from '@/configs/axios.config';
import {
    AppointmentResponse,
    AppointmentListResponse,
    AppointmentQueryRequest,
    CreateAppointmentRequest,
    UpdateAppointmentStatusRequest,
} from '@/types/appointment.types';

// Base API endpoints for appointments
const APPOINTMENT_ENDPOINTS = {
    BASE: '/appointments',
    HEALTH: '/appointments/health',
    PATIENT: '/appointments/patient',
    STATUS: (id: string) => `/appointments/status/${id}`,
    BY_ID: (id: string) => `/appointments/${id}`,
} as const;

/**
 * Appointment Service
 * Handles all appointment-related API operations
 */
export class AppointmentService {
    /**
     * Health check endpoint
     */
    static async healthCheck(): Promise<ApiResponse> {
        try {
            const response: any = await axiosInstance.get(APPOINTMENT_ENDPOINTS.HEALTH);
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message,
            };
        } catch (error: any) {
            throw new Error(error.message || 'Appointment service health check failed');
        }
    }

    /**
     * Create a new appointment
     */
    static async createAppointment(request: CreateAppointmentRequest): Promise<ApiResponse<void>> {
        try {
            const response: any = await axiosInstance.post(APPOINTMENT_ENDPOINTS.BASE, request);
            return {
                success: response.success ?? true,
                data: response.data,
                message: response.message || 'Appointment created successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to create appointment');
        }
    }

    /**
     * Get appointment by ID
     */
    static async getAppointmentById(id: string): Promise<ApiResponse<AppointmentResponse>> {
        try {
            const response: any = await axiosInstance.get(APPOINTMENT_ENDPOINTS.BY_ID(id));
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Appointment retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to get appointment');
        }
    }

    /**
     * Get appointments by patient with filtering and pagination
     * Uses POST method as specified in the controller with [FromBody]
     */
    static async getAppointmentsByPatient(
        query: AppointmentQueryRequest
    ): Promise<ApiResponse<AppointmentListResponse>> {
        try {
            const response: any = await axiosInstance.post(APPOINTMENT_ENDPOINTS.PATIENT, query);
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Patient appointments retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to get patient appointments');
        }
    }

    /**
     * Update appointment status
     */
    static async updateAppointmentStatus(
        request: UpdateAppointmentStatusRequest
    ): Promise<ApiResponse<void>> {
        try {
            const response: any = await axiosInstance.put(
                APPOINTMENT_ENDPOINTS.STATUS(request.id),
                request
            );
            return {
                success: response.success ?? true,
                data: response.data,
                message: response.message || 'Appointment status updated successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to update appointment status');
        }
    }
}

// Export individual methods for convenience
export const {
    healthCheck,
    createAppointment,
    getAppointmentById,
    getAppointmentsByPatient,
    updateAppointmentStatus,
} = AppointmentService;

// Default export
export default AppointmentService;
