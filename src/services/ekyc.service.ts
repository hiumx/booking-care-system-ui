import axiosInstance, { ApiResponse } from '@/configs/axios.config';
import type {
    EkycOcrResult,
    EkycFaceMatchResult,
    EkycLivenessResult,
    EkycVerificationResponse,
} from '@/types/ekyc.types';

const EKYC_ENDPOINTS = {
    OCR: '/ekyc/ocr',
    FACE_MATCH: '/ekyc/face-match',
    LIVENESS: '/ekyc/liveness',
    VERIFY: '/ekyc/verify',
} as const;

/**
 * eKYC Service
 * Handles all eKYC-related API operations for identity verification
 */
export class EkycService {
    /**
     * Process ID card images using OCR
     */
    static async processIdCardOcr(
        frontImage: File,
        backImage: File
    ): Promise<ApiResponse<EkycOcrResult>> {
        try {
            const formData = new FormData();
            formData.append('FrontImage', frontImage);
            formData.append('BackImage', backImage);

            const response: any = await axiosInstance.post(EKYC_ENDPOINTS.OCR, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message,
            };
        } catch (error: any) {
            throw new Error(error.message || 'Không thể đọc thông tin CMND/CCCD');
        }
    }

    /**
     * Verify face match between selfie and ID card
     */
    static async verifyFaceMatch(
        selfieImage: File,
        idCardFrontImage: File
    ): Promise<ApiResponse<EkycFaceMatchResult>> {
        try {
            const formData = new FormData();
            formData.append('SelfieImage', selfieImage);
            formData.append('IdCardFrontImage', idCardFrontImage);

            const response: any = await axiosInstance.post(EKYC_ENDPOINTS.FACE_MATCH, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message,
            };
        } catch (error: any) {
            throw new Error(error.message || 'Không thể xác thực khuôn mặt');
        }
    }

    /**
     * Check liveness detection
     */
    static async checkLiveness(image: File): Promise<ApiResponse<EkycLivenessResult>> {
        try {
            const formData = new FormData();
            formData.append('Image', image);

            const response: any = await axiosInstance.post(EKYC_ENDPOINTS.LIVENESS, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message,
            };
        } catch (error: any) {
            throw new Error(error.message || 'Không thể kiểm tra liveness');
        }
    }

    /**
     * Complete eKYC verification (OCR + Face Match + Liveness)
     * @param idCardFrontImage - Front image of ID card
     * @param idCardBackImage - Back image of ID card
     * @param selfieImage - Selfie image for face matching
     * @param livenessVideo - Optional video for liveness detection (required by FPT.AI)
     */
    static async verifyIdentity(
        idCardFrontImage: File,
        idCardBackImage: File,
        selfieImage: File,
        livenessVideo?: File
    ): Promise<ApiResponse<EkycVerificationResponse>> {
        try {
            const formData = new FormData();
            formData.append('IdCardFrontImage', idCardFrontImage);
            formData.append('IdCardBackImage', idCardBackImage);
            formData.append('SelfieImage', selfieImage);
            if (livenessVideo) {
                formData.append('LivenessVideo', livenessVideo);
            }

            const response: any = await axiosInstance.post(EKYC_ENDPOINTS.VERIFY, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message,
            };
        } catch (error: any) {
            throw new Error(error.message || 'Xác thực danh tính thất bại');
        }
    }
}

// Export individual methods for convenience
export const { processIdCardOcr, verifyFaceMatch, checkLiveness, verifyIdentity } = EkycService;

export default EkycService;
