export enum EkycStatus {
    NOT_STARTED = 'NOT_STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    VERIFIED = 'VERIFIED',
    FAILED = 'FAILED',
}

export interface EkycOcrResult {
    success: boolean;
    errorMessage?: string;
    errorCode?: string;
    idNumber?: string;
    fullName?: string;
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;
    placeOfOrigin?: string;
    placeOfResidence?: string;
    expiryDate?: string;
    issueDate?: string;
    issuedBy?: string;
    overallConfidence?: number;
    fieldConfidences?: Record<string, number>;
    documentType?: string;
}

export interface EkycFaceMatchResult {
    success: boolean;
    errorMessage?: string;
    errorCode?: string;
    isMatch: boolean;
    similarity: number;
    message?: string;
    threshold: number;
}

export interface EkycLivenessResult {
    success: boolean;
    errorMessage?: string;
    errorCode?: string;
    isLive: boolean;
    livenessScore: number;
    message?: string;
    threshold: number;
}

export interface EkycVerificationResponse {
    success: boolean;
    errorMessage?: string;
    status: EkycStatus;
    sessionId?: string;
    ocrResult?: EkycOcrResult;
    faceMatchResult?: EkycFaceMatchResult;
    livenessResult?: EkycLivenessResult;
    isVerified: boolean;
    verifiedAt?: string;
}

export interface EkycVerificationState {
    step: 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';
    sessionId?: string;
    ocrResult?: EkycOcrResult;
    faceMatchResult?: EkycFaceMatchResult;
    livenessResult?: EkycLivenessResult;
    isVerified: boolean;
    verifiedAt?: string;
    errorMessage?: string;
}

// Privacy-friendly: Only store verification status, not PII
export interface EkycFormData {
    ekycSessionId?: string;
    faceMatchScore?: number;
    livenessScore?: number;
    isVerified: boolean;
    // OCR data for display only (not stored in backend)
    idCardName?: string;
    idCardNumber?: string;
    idCardDob?: string;
    idCardAddress?: string;
}
