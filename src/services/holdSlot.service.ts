import axiosInstance from '@/configs/axios.config';
import {
    HoldSlotRequest,
    ReleaseSlotRequest,
    HoldSlotResponse,
    HoldSlotTargetType,
} from '@/types/holdSlot.types';
import { AppointmentTime } from '@/enums/appointment.enums';

// Base API endpoints for hold slot operations
const HOLD_SLOT_ENDPOINTS = {
    HOLD: '/schedules/hold-slot/hold',
    RELEASE: '/schedules/hold-slot/release',
    REMAINING_TIME: '/schedules/hold-slot/remaining-time',
    RELEASE_ALL: '/schedules/hold-slot/release-all',
} as const;

/**
 * Hold Slot Service
 * Handles all hold slot related API operations
 */
export class HoldSlotService {
    /**
     * Hold a slot for 5 minutes
     */
    static async holdSlot(request: HoldSlotRequest): Promise<HoldSlotResponse> {
        try {
            const response: any = await axiosInstance.post(HOLD_SLOT_ENDPOINTS.HOLD, request);

            return {
                success: response.success ?? true,
                message: response.message || 'Đã giữ chỗ thành công',
                holdSlot: response.data?.holdSlot,
                remainingSeconds: response.data?.remainingSeconds || 300,
            };
        } catch (error: any) {
            console.error('Hold slot error:', error);

            // Handle specific error cases
            if (error.response?.status === 400) {
                return {
                    success: false,
                    message:
                        error.response.data?.message || 'Khung giờ này đã được người khác chọn',
                    remainingSeconds: 0,
                };
            }

            throw new Error(error.message || 'Không thể giữ chỗ');
        }
    }

    /**
     * Release a held slot
     */
    static async releaseSlot(request: ReleaseSlotRequest): Promise<boolean> {
        try {
            const response: any = await axiosInstance.post(HOLD_SLOT_ENDPOINTS.RELEASE, request);
            return response.success ?? true;
        } catch (error: any) {
            console.error('Release slot error:', error);
            throw new Error(error.message || 'Không thể hủy giữ chỗ');
        }
    }

    /**
     * Get remaining time for a held slot
     */
    static async getRemainingTime(
        targetId: string,
        targetType: HoldSlotTargetType,
        date: string,
        appointmentTimeId: AppointmentTime
    ): Promise<number> {
        try {
            const params = new URLSearchParams({
                targetId,
                targetType: targetType.toString(),
                date,
                appointmentTimeId: appointmentTimeId.toString(),
            });

            const response: any = await axiosInstance.get(
                `${HOLD_SLOT_ENDPOINTS.REMAINING_TIME}?${params.toString()}`
            );

            return response.data?.remainingSeconds || 0;
        } catch (error: any) {
            console.error('Get remaining time error:', error);
            return 0; // Return 0 if error (slot not held or expired)
        }
    }

    /**
     * Release all held slots for current user
     */
    static async releaseAllSlots(): Promise<number> {
        try {
            const response: any = await axiosInstance.post(HOLD_SLOT_ENDPOINTS.RELEASE_ALL);
            return response.data?.releasedCount || 0;
        } catch (error: any) {
            console.error('Release all slots error:', error);
            throw new Error(error.message || 'Không thể hủy tất cả slot đang giữ');
        }
    }

    /**
     * Helper method to format date for API calls
     */
    static formatDateForApi(date: Date): string {
        return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
    }

    /**
     * Helper method to convert simple start time (HH:mm) or full enum string (AT_...) to AppointmentTime
     */
    static timeToAppointmentTime(timeString: string): AppointmentTime {
        // If already in enum format, return as-is
        if (timeString.startsWith('AT_')) {
            return timeString as AppointmentTime;
        }

        switch (timeString) {
            case '08:00':
                return AppointmentTime.AT_08_00_08_30;
            case '08:30':
                return AppointmentTime.AT_08_30_09_00;
            case '09:00':
                return AppointmentTime.AT_09_00_09_30;
            case '09:30':
                return AppointmentTime.AT_09_30_10_00;
            case '10:00':
                return AppointmentTime.AT_10_00_10_30;
            case '10:30':
                return AppointmentTime.AT_10_30_11_00;
            case '11:00':
                return AppointmentTime.AT_11_00_11_30;
            case '11:30':
                return AppointmentTime.AT_11_30_12_00;
            case '13:00':
                return AppointmentTime.AT_13_00_13_30;
            case '13:30':
                return AppointmentTime.AT_13_30_14_00;
            case '14:00':
                return AppointmentTime.AT_14_00_14_30;
            case '14:30':
                return AppointmentTime.AT_14_30_15_00;
            case '15:00':
                return AppointmentTime.AT_15_00_15_30;
            case '15:30':
                return AppointmentTime.AT_15_30_16_00;
            case '16:00':
                return AppointmentTime.AT_16_00_16_30;
            case '16:30':
                return AppointmentTime.AT_16_30_17_00;
            case '17:00':
                return AppointmentTime.AT_17_00_17_30;
            case '17:30':
                return AppointmentTime.AT_17_30_18_00;
            case '18:00':
                return AppointmentTime.AT_18_00_18_30;
            case '18:30':
                return AppointmentTime.AT_18_30_19_00;
            case '19:00':
                return AppointmentTime.AT_19_00_19_30;
            case '19:30':
                return AppointmentTime.AT_19_30_20_00;
            case '20:00':
                return AppointmentTime.AT_20_00_20_30;
            case '20:30':
                return AppointmentTime.AT_20_30_21_00;
            case '21:00':
                return AppointmentTime.AT_21_00_21_30;
            case '21:30':
                return AppointmentTime.AT_21_30_22_00;
            case '22:00':
                return AppointmentTime.AT_22_00_22_30;
            case '22:30':
                return AppointmentTime.AT_22_30_23_00;
            default:
                throw new Error(`Unsupported time slot: ${timeString}`);
        }
    }
}
