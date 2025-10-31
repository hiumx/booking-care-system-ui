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
}

export enum RegistrationStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
}
