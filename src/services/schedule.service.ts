import axiosInstance from '../configs/axios.config';
import {
    DoctorScheduleResponse,
    DoctorScheduleListResponse,
    AvailableSlotsResponse,
    GetDoctorScheduleRequest,
    GetDoctorAvailableSlotsRequest,
    ScheduleQueryParams,
    AvailableSlot,
    GetServiceMedicalScheduleRequest,
    GetServiceMedicalAvailableSlotsRequest,
    ServiceMedicalScheduleResponse,
    ServiceMedicalAvailableSlotsResponse,
    GetSpecialtyAvailableSlotsRequest,
    SpecialtyAvailableSlotsApiResponse,
} from '../types/schedule.types';

// Base API endpoints for schedules
const SCHEDULE_ENDPOINTS = {
    DOCTOR_SCHEDULE: '/schedules/doctor-schedule',
    AVAILABLE_SLOTS: '/schedules/doctor-schedule/{doctorId}/available-slots',
    DOCTOR_SCHEDULE_EXCEPTION: '/schedules/doctor-schedule-exception',
    // Service Medical endpoints
    SERVICE_MEDICAL_SCHEDULE: '/schedules/service-medical-schedules',
    SERVICE_MEDICAL_AVAILABLE_SLOTS:
        '/schedules/service-medical-schedules/{serviceMedicalId}/available-slots',
    SERVICE_MEDICAL_SCHEDULE_EXCEPTION: '/schedules/service-medical-schedule-exceptions',
    // Specialty Schedule endpoints (for "hospital assigns doctor" mode)
    SPECIALTY_AVAILABLE_SLOTS:
        '/schedules/specialty-schedules/{hospitalId}/specialties/{specialtyId}/available-slots',
} as const;

/**
 * Schedule Service
 * Handles all schedule-related API operations
 */
export class ScheduleService {
    /**
     * Get doctor schedule for a specific date
     */
    static async getDoctorSchedule(
        request: GetDoctorScheduleRequest
    ): Promise<DoctorScheduleResponse> {
        try {
            const queryParams = new URLSearchParams({
                date: request.date,
                ...(request.medicalServiceId && { medicalServiceId: request.medicalServiceId }),
            });

            const response: any = await axiosInstance.get(
                `${SCHEDULE_ENDPOINTS.DOCTOR_SCHEDULE}/${request.doctorId}?${queryParams.toString()}`
            );

            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message,
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to fetch doctor schedule');
        }
    }

    /**
     * Get available slots for a doctor on a specific date
     */
    static async getDoctorAvailableSlots(
        request: GetDoctorAvailableSlotsRequest
    ): Promise<AvailableSlotsResponse> {
        try {
            const queryParams = new URLSearchParams({
                date: request.date,
                ...(request.medicalServiceId && { medicalServiceId: request.medicalServiceId }),
            });

            const endpoint = SCHEDULE_ENDPOINTS.AVAILABLE_SLOTS.replace(
                '{doctorId}',
                request.doctorId
            );
            const fullUrl = `${endpoint}?${queryParams.toString()}`;

            const response: any = await axiosInstance.get(fullUrl);

            const result = {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message,
            };

            return result;
        } catch (error: any) {
            console.error('API Error:', error);
            throw new Error(error.message || 'Failed to fetch available slots');
        }
    }

    /**
     * Get doctor schedules with filtering and pagination
     */
    static async getDoctorSchedules(
        params?: ScheduleQueryParams
    ): Promise<DoctorScheduleListResponse> {
        try {
            const queryString = new URLSearchParams();

            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        queryString.append(key, String(value));
                    }
                });
            }

            const response: any = await axiosInstance.get(
                `${SCHEDULE_ENDPOINTS.DOCTOR_SCHEDULE}?${queryString.toString()}`
            );

            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message,
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to fetch doctor schedules');
        }
    }

    /**
     * Helper method to format date for API calls
     */
    static formatDateForApi(date: Date): string {
        return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
    }

    /**
     * Helper method to group slots by time periods
     */
    static groupSlotsByPeriod(slots: AvailableSlot[]) {
        const morning = slots.filter((slot) => {
            const hour = Number.parseInt(slot.startTime.split(':')[0]);
            return hour >= 8 && hour < 12;
        });

        const afternoon = slots.filter((slot) => {
            const hour = Number.parseInt(slot.startTime.split(':')[0]);
            return hour >= 12 && hour < 17;
        });

        const evening = slots.filter((slot) => {
            const hour = Number.parseInt(slot.startTime.split(':')[0]);
            return hour >= 17 && hour <= 21;
        });

        return {
            morning,
            afternoon,
            evening,
        };
    }

    /**
     * Get service medical schedule for a specific date
     */
    static async getServiceMedicalSchedule(
        request: GetServiceMedicalScheduleRequest
    ): Promise<ServiceMedicalScheduleResponse> {
        try {
            const queryParams = new URLSearchParams({
                date: request.date,
            });

            const response: any = await axiosInstance.get(
                `${SCHEDULE_ENDPOINTS.SERVICE_MEDICAL_SCHEDULE}/${request.serviceMedicalId}?${queryParams.toString()}`
            );

            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message,
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to fetch service medical schedule');
        }
    }

    /**
     * Get available slots for a service medical on a specific date
     */
    static async getServiceMedicalAvailableSlots(
        request: GetServiceMedicalAvailableSlotsRequest
    ): Promise<ServiceMedicalAvailableSlotsResponse> {
        try {
            const queryParams = new URLSearchParams({
                date: request.date,
            });

            const endpoint = SCHEDULE_ENDPOINTS.SERVICE_MEDICAL_AVAILABLE_SLOTS.replace(
                '{serviceMedicalId}',
                request.serviceMedicalId
            );
            const fullUrl = `${endpoint}?${queryParams.toString()}`;

            const response: any = await axiosInstance.get(fullUrl);

            const result = {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message,
            };

            return result;
        } catch (error: any) {
            console.error('API Error:', error);
            throw new Error(error.message || 'Failed to fetch service medical available slots');
        }
    }

    /**
     * Get available slots for a specialty on a specific date (for "hospital assigns doctor" mode)
     * Returns aggregated slots with capacity information
     */
    static async getSpecialtyAvailableSlots(
        request: GetSpecialtyAvailableSlotsRequest
    ): Promise<SpecialtyAvailableSlotsApiResponse> {
        try {
            const queryParams = new URLSearchParams({
                date: request.date,
                appointmentType: request.appointmentType,
            });

            const url = SCHEDULE_ENDPOINTS.SPECIALTY_AVAILABLE_SLOTS.replace(
                '{hospitalId}',
                request.hospitalId
            ).replace('{specialtyId}', request.specialtyId);

            const response: any = await axiosInstance.get(`${url}?${queryParams.toString()}`);

            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message,
            };
        } catch (error: any) {
            console.error('API Error:', error);
            throw new Error(error.message || 'Failed to fetch specialty available slots');
        }
    }
}
