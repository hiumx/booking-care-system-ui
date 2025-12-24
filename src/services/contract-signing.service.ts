import axiosInstance, { ApiResponse } from '@/configs/axios.config';
import type {
    ValidateTokenResponse,
    SendOtpResponse,
    SignContractRequest,
    SignContractResponse,
} from '@/types/contract-signing.types';

// Contract Signing API endpoints
const CONTRACT_SIGNING_ENDPOINTS = {
    VALIDATE_TOKEN: '/contract-signing/validate-token',
    SEND_OTP: '/contract-signing/send-otp',
    SIGN: '/contract-signing/sign',
} as const;

/**
 * Contract Signing Service
 * Handles all contract signing-related API operations
 */
export class ContractSigningService {
    /**
     * Validate contract signing token
     */
    static async validateToken(token: string): Promise<ApiResponse<ValidateTokenResponse>> {
        try {
            const response: any = await axiosInstance.post(
                CONTRACT_SIGNING_ENDPOINTS.VALIDATE_TOKEN,
                {
                    token,
                }
            );
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Token validated successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to validate token');
        }
    }

    /**
     * Send OTP for contract signing verification
     */
    static async sendSigningOtp(token: string): Promise<ApiResponse<SendOtpResponse>> {
        try {
            const response: any = await axiosInstance.post(CONTRACT_SIGNING_ENDPOINTS.SEND_OTP, {
                token,
            });
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'OTP sent successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to send OTP');
        }
    }

    /**
     * Sign the contract
     */
    static async signContract(
        request: SignContractRequest
    ): Promise<ApiResponse<SignContractResponse>> {
        try {
            const response: any = await axiosInstance.post(
                CONTRACT_SIGNING_ENDPOINTS.SIGN,
                request
            );
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'Contract signed successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to sign contract');
        }
    }
}

// Export individual methods for backward compatibility
export const validateToken = ContractSigningService.validateToken;
export const sendSigningOtp = ContractSigningService.sendSigningOtp;
export const signContract = ContractSigningService.signContract;
