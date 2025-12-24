import { toast } from 'react-toastify';
import { AppointmentService } from '@/services/appointment.service';
import { AppointmentStatus } from '@/enums/appointment.enums';
import { AppointmentCardData } from '@/types/appointment.types';

/**
 * Handle reschedule click (lazy token generation for Options 1 & 3)
 * Generates a reschedule token and redirects to appropriate page
 */
export const handleRescheduleAction = async (
    appointment: AppointmentCardData,
    action: 'SAME_DOCTOR' | 'NEW_DOCTOR',
    patientId: string
): Promise<void> => {
    if (!patientId) {
        toast.error('Không tìm thấy thông tin người dùng');
        return;
    }

    // Validate status
    if (
        appointment.status !== AppointmentStatus.PENDING &&
        appointment.status !== AppointmentStatus.CONFIRMED
    ) {
        toast.warning('Chỉ có thể đổi lịch hẹn ở trạng thái Chờ xử lý hoặc Sắp tới');
        return;
    }

    try {
        // Call API to generate reschedule token
        const response = await AppointmentService.generateRescheduleToken({
            appointmentId: appointment.appointmentId,
            rescheduleAction: action,
            patientId: patientId,
        });

        if (response.success && response.data) {
            const actionText =
                action === 'SAME_DOCTOR' ? 'đổi lịch với cùng bác sĩ' : 'chọn bác sĩ mới';
            toast.success(`Token đã được tạo! Đang chuyển hướng để ${actionText}...`);

            // Navigate to the redirect URL
            setTimeout(() => {
                globalThis.location.href = response.data.redirectUrl;
            }, 1000);
        } else {
            throw new Error(response.message || 'Không thể tạo token đổi lịch');
        }
    } catch (error: any) {
        console.error('Error generating reschedule token:', error);
        toast.error(error.message || 'Không thể tạo token đổi lịch. Vui lòng thử lại.');
    }
};
