export interface SendOtpRequest {
    email?: string;
    phone?: string;
    purpose: 'REGISTER' | 'FORGOT_PASSWORD';
    deviceId?: string;
}

export interface VerifyOtpRequest {
    email?: string;
    phone?: string;
    otp: string;
    purpose: 'REGISTER' | 'FORGOT_PASSWORD';
}

export interface VerifyOtpResponse {
    proof: string;
    issuedAt: string; // Keep as string to preserve precision of C# long ticks
}
