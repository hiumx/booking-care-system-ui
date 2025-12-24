import axiosInstance, { ApiResponse } from '@/configs/axios.config';
import {
    AppointmentResponse,
    AppointmentListResponse,
    AppointmentQueryRequest,
    CreateAppointmentRequest,
    UpdateAppointmentStatusRequest,
    RescheduleSameDoctorRequest,
    ConfirmNewDoctorRequest,
    RequestRefundRequest,
    RescheduleResponse,
} from '@/types/appointment.types';

// Base API endpoints for appointments
const APPOINTMENT_ENDPOINTS = {
    BASE: '/appointments',
    HEALTH: '/appointments/health',
    PATIENT: '/appointments/patient',
    CANCEL_APPOINTMENT: (id: string) => `/appointments/cancel/${id}`,
    RESCHEDULE_SAME_DOCTOR: (id: string) => `/appointments/${id}/reschedule-same-doctor`,
    CONFIRM_NEW_DOCTOR: (id: string) => `/appointments/${id}/confirm-new-doctor`,
    REQUEST_REFUND: (id: string) => `/appointments/${id}/request-refund`,
    CHOOSE_NEW_DOCTOR: (id: string) => `/appointments/${id}/choose-new-doctor`,
    GENERATE_RESCHEDULE_TOKEN: (id: string) => `/appointments/${id}/generate-reschedule-token`,
    STATUS: (id: string) => `/appointments/status/${id}`,
    BY_ID: (id: string) => `/appointments/${id}`,
    UPLOAD_ATTACHMENT: '/attachment/upload',
    DELETE_ATTACHMENT: '/attachment',
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
     * Get appointment by ID for patient with enriched data
     * Includes doctor, service, and hospital information via gRPC
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

    /**
     * Upload appointment attachment
     */
    static async uploadAttachment(file: File): Promise<ApiResponse<{ fileUrl: string }>> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response: any = await axiosInstance.post(
                APPOINTMENT_ENDPOINTS.UPLOAD_ATTACHMENT,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            return {
                success: response.success ?? true,
                data: response.data,
                message: response.message || 'Attachment uploaded successfully',
                errors: response.errors,
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to upload attachment');
        }
    }

    /**
     * Delete appointment attachment
     */
    static async deleteAttachment(fileUrl: string): Promise<ApiResponse<void>> {
        try {
            const response: any = await axiosInstance.delete(
                APPOINTMENT_ENDPOINTS.DELETE_ATTACHMENT,
                {
                    params: { fileUrl },
                }
            );

            return {
                success: response.success ?? true,
                data: response.data,
                message: response.message || 'Attachment deleted successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to delete attachment');
        }
    }

    /**
     * Cancel an appointment (Patient)
     * Returns reschedule options for staff cancellations
     * Refund percentage depends on cancellation time:
     * - >= 24 hours before: 100% refund
     * - 12-24 hours before: 50% refund
     * - < 12 hours before: 0% refund
     */
    static async cancelAppointment(
        appointmentId: string,
        cancellationReason: string,
        cancelledByPatientId?: string
    ): Promise<ApiResponse<RescheduleResponse>> {
        try {
            const response: any = await axiosInstance.post(
                APPOINTMENT_ENDPOINTS.CANCEL_APPOINTMENT(appointmentId),
                {
                    appointmentId,
                    cancellationReason,
                    cancelledByPatientId,
                }
            );

            return {
                success: response.success ?? true,
                data: response.data,
                message: response.message || 'Appointment cancelled successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to cancel appointment');
        }
    }

    /**
     * Reschedule appointment with same doctor (Option 1)
     */
    static async rescheduleSameDoctor(
        request: RescheduleSameDoctorRequest
    ): Promise<ApiResponse<void>> {
        try {
            const response: any = await axiosInstance.post(
                APPOINTMENT_ENDPOINTS.RESCHEDULE_SAME_DOCTOR(request.appointmentId),
                request
            );

            return {
                success: response.success ?? true,
                data: response.data,
                message: response.message || 'Appointment rescheduled successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to reschedule appointment');
        }
    }

    /**
     * Confirm new doctor assignment (Option 2)
     */
    static async confirmNewDoctor(request: ConfirmNewDoctorRequest): Promise<ApiResponse<void>> {
        try {
            const response: any = await axiosInstance.post(
                APPOINTMENT_ENDPOINTS.CONFIRM_NEW_DOCTOR(request.appointmentId),
                request
            );

            return {
                success: response.success ?? true,
                data: response.data,
                message: response.message || 'New doctor confirmed successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to confirm new doctor');
        }
    }

    /**
     * Request refund for cancelled appointment (Option 4)
     * Sends request to Payment Service via Appointment Service
     */
    static async requestRefund(request: RequestRefundRequest): Promise<ApiResponse<void>> {
        try {
            const response: any = await axiosInstance.post(
                APPOINTMENT_ENDPOINTS.REQUEST_REFUND(request.appointmentId),
                request
            );

            return {
                success: response.success ?? true,
                data: response.data,
                message: response.message || 'Refund request submitted successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to request refund');
        }
    }

    /**
     * Choose new doctor (Option 3)
     * Patient selects a different doctor from same hospital + specialty
     * Handles 3 scenarios: same price, higher price, lower price
     */
    static async chooseNewDoctor(request: {
        appointmentId: string;
        rescheduleToken: string;
        newDoctorId: string;
        newAppointmentDate: string;
        newAppointmentTimeId: string;
        doctorPriceId: string;
        isStaffAssigned: boolean;
    }): Promise<
        ApiResponse<{
            appointmentId: string;
            action: 'direct_update' | 'payment_required' | 'refund_created';
            originalPrice: number;
            newPrice: number;
            priceDifference: number;
            paymentUrl?: string;
            refundRequestId?: string;
            message: string;
        }>
    > {
        try {
            const response: any = await axiosInstance.post(
                APPOINTMENT_ENDPOINTS.CHOOSE_NEW_DOCTOR(request.appointmentId),
                request
            );

            return {
                success: response.success ?? true,
                data: response.data,
                message: response.message || 'Request processed successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to choose new doctor');
        }
    }

    /**
     * Generate reschedule token without cancelling appointment (lazy token generation)
     * Used when patient clicks reschedule/choose new doctor button
     */
    static async generateRescheduleToken(request: {
        appointmentId: string;
        rescheduleAction: 'SAME_DOCTOR' | 'NEW_DOCTOR';
        patientId: string;
    }): Promise<
        ApiResponse<{
            rescheduleToken: string;
            tokenExpiry: string;
            redirectUrl: string;
            message: string;
        }>
    > {
        try {
            const response: any = await axiosInstance.post(
                APPOINTMENT_ENDPOINTS.GENERATE_RESCHEDULE_TOKEN(request.appointmentId),
                request
            );
            return {
                success: response.success ?? true,
                data: response.data,
                message: response.message || 'Token generated successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to generate reschedule token');
        }
    }
}

// Export individual methods for convenience
export const {
    healthCheck,
    createAppointment,
    generateRescheduleToken,
    getAppointmentById,
    getAppointmentsByPatient,
    updateAppointmentStatus,
    uploadAttachment,
    deleteAttachment,
    cancelAppointment,
    rescheduleSameDoctor,
    confirmNewDoctor,
    requestRefund,
    chooseNewDoctor,
} = AppointmentService;

// Export types
export type { RescheduleOptions } from '@/types/appointment.types';

// Default export
export default AppointmentService;
