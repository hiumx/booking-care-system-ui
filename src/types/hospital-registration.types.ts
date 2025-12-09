export interface HospitalRegistrationRequest {
    hospitalName: string;
    email: string;
    phone: string;
    address: string;
    licenseFile: File;
    businessCertificateFile: File;
    identityCardFile: File;
    taxCode: string;
}

export interface HospitalRegistrationResponse {
    id: string;
    hospitalName: string;
    email: string;
    phone: string;
    address: string;
    licenseFile: string;
    businessCertificateFile: string;
    identityCardFile: string;
    taxCode: string;
    status: RegistrationStatus;
    statusText: string;
    contractFile?: string;
    hospitalId?: string;
    reason?: string;
    createdAt: string;
    updatedAt: string;

    // eKYC Information
    ekycStatus?: EkycStatus;
    ekycStatusText?: string;
    ekycSessionId?: string;
    ekycVerifiedAt?: string;
    idCardNumber?: string;
    idCardName?: string;
    idCardDob?: string;
    idCardAddress?: string;
    faceMatchScore?: number;
    livenessScore?: number;
    idCardFrontImageUrl?: string;
    idCardBackImageUrl?: string;
    selfieImageUrl?: string;
}

export enum RegistrationStatus {
    PENDING = 'PENDING',
    CONTRACT_GENERATED = 'CONTRACT_GENERATED',
    CONTRACT_SIGNED = 'CONTRACT_SIGNED',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
}

export enum EkycStatus {
    NOT_STARTED = 'NOT_STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    VERIFIED = 'VERIFIED',
    FAILED = 'FAILED',
}
