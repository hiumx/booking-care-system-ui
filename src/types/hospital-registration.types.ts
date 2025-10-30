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
