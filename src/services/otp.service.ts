import axiosInstance, { ApiResponse } from '@/configs/axios.config';
import { SendOtpRequest, VerifyOtpRequest, VerifyOtpResponse } from '@/types/otp.types';

// Base API endpoint for otp
const OTP_ENDPOINTS = {
    BASE: '/otp',
    SEND: '/otp/send',
    VERIFY: '/otp/verify',
    HEALTH: '/otp/health',
} as const;

export class OtpService {
    /**
     * Send OTP to email or phone number
     */
    static async sendOtp(request: SendOtpRequest): Promise<ApiResponse> {
        try {
            const response: any = await axiosInstance.post(OTP_ENDPOINTS.SEND, request);
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'OTP sent successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Gửi mã OTP thất bại. Vui lòng thử lại.');
        }
    }

    /**
     * Verify OTP code
     */
    static async verifyOtp(request: VerifyOtpRequest): Promise<ApiResponse<VerifyOtpResponse>> {
        try {
            const response: any = await axiosInstance.post(OTP_ENDPOINTS.VERIFY, request);
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'OTP verified successfully',
            };
        } catch (error: any) {
            throw new Error(
                error.message || 'Mã OTP không chính xác hoặc đã hết hạn. Vui lòng thử lại.'
            );
        }
    }
}
