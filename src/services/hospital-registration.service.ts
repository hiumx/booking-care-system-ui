import axiosInstance, { ApiResponse } from '@/configs/axios.config';
import type { HospitalRegistrationResponse } from '@/types/hospital-registration.types';

const HOSPITAL_REGISTRATION_ENDPOINTS = {
    SUBMIT: '/hospital-registrations/submit',
} as const;

export class HospitalRegistrationService {
    /**
     * Submit a new hospital partnership registration
     */
    static async submitRegistration(
        formData: FormData
    ): Promise<ApiResponse<HospitalRegistrationResponse>> {
        try {
            const response: any = await axiosInstance.post(
                HOSPITAL_REGISTRATION_ENDPOINTS.SUBMIT,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Đơn đăng ký đã được gửi thành công',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Có lỗi xảy ra khi gửi đơn đăng ký');
        }
    }
}

export const { submitRegistration } = HospitalRegistrationService;

export default HospitalRegistrationService;
