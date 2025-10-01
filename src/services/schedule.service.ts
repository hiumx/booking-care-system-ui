import axiosInstance from '../configs/axios.config';
import {
    DoctorScheduleResponse,
    DoctorScheduleListResponse,
    AvailableSlotsResponse,
    GetDoctorScheduleRequest,
    GetDoctorAvailableSlotsRequest,
    ScheduleQueryParams,
    AvailableSlot,
} from '../types/schedule.types';

// Base API endpoints for schedules
const SCHEDULE_ENDPOINTS = {
    DOCTOR_SCHEDULE: '/schedules/doctor-schedule',
    AVAILABLE_SLOTS: '/schedules/doctor-schedule/{doctorId}/available-slots',
    DOCTOR_SCHEDULE_EXCEPTION: '/schedules/doctor-schedule-exception',
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
            console.log('API Request URL:', fullUrl);

            const response: any = await axiosInstance.get(fullUrl);
            console.log('API Raw Response:', response);

            const result = {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message,
            };
            console.log('API Processed Response:', result);

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
        console.log('Grouping slots by period:', slots);

        const morning = slots.filter((slot) => {
            const hour = parseInt(slot.startTime.split(':')[0]);
            return hour >= 8 && hour < 12;
        });

        console.log('Morning slots:', morning);

        const afternoon = slots.filter((slot) => {
            const hour = parseInt(slot.startTime.split(':')[0]);
            return hour >= 12 && hour < 17;
        });

        console.log('Afternoon slots:', afternoon);

        const evening = slots.filter((slot) => {
            const hour = parseInt(slot.startTime.split(':')[0]);
            return hour >= 17 && hour <= 21;
        });

        return {
            morning,
            afternoon,
            evening,
        };
    }
}
