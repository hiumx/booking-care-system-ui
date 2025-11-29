/**
 * Contract Signing Types
 * Types for hospital contract signing flow
 */

export interface ValidateTokenRequest {
    token: string;
}

export interface ContractSigningInfo {
    registrationId: string;
    hospitalName: string;
    representativeName: string;
    representativeEmail: string;
    contractDraftUrl: string;
    contractNumber: string;
    expiresAt: string;
}

export interface ValidateTokenResponse {
    isValid: boolean;
    errorMessage?: string;
    contractInfo?: ContractSigningInfo;
}

export interface SendOtpRequest {
    token: string;
}

export interface SendOtpResponse {
    success: boolean;
    message: string;
}

export interface SignContractRequest {
    token: string;
    signatureBase64: string;
    otpCode: string;
}

export interface SignContractResponse {
    success: boolean;
    message: string;
    signedContractUrl?: string;
    signedAt?: string;
}
