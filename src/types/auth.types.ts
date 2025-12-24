import { Gender } from '@/enums/common.enums';

// Base request interface for email or phone validation
export interface EmailOrPhoneRequest {
    email?: string;
    phoneNumber?: string;
}

// Authentication Request DTOs
export interface LoginRequest extends EmailOrPhoneRequest {
    password: string;
}

export interface RegisterRequest {
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    gender: Gender;
    address: string;
    birthday: string;
    channel: 'email' | 'phone';
    purpose: 'REGISTER';
    proof?: string;
    issuedAt?: string;
}

// External Authentication Request DTOs
export interface GoogleLoginRequest {
    accessToken: string; // Changed from idToken to accessToken for modern OAuth flow
}

export interface FacebookLoginRequest {
    accessToken: string;
}

export interface ForgotPasswordRequest extends EmailOrPhoneRequest {
    deviceId?: string;
}

export interface ResetPasswordRequest {
    email: string;
    resetToken: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface ChangePasswordRequest {
    currentPassword?: string; // Optional for external login accounts
    newPassword: string;
    confirmNewPassword: string;
}

export interface ResetTokenRequest {
    phoneNumber: string;
    purpose: 'FORGOT_PASSWORD';
    proof: string;
    issuedAt: string;
}

// Authentication Response DTOs
export interface AuthResponse {
    message: string;
    token?: string;
}

// User interface (for front-end patients)
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
    role: 'patient' | 'doctor' | 'admin';
    isEmailVerified: boolean;
    birthday?: string;
    gender?: Gender;
    address?: string;
}

// Auth state types
export interface AuthState {
    roles: string[];
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    emailConfirmed: boolean;
    phoneConfirmed: boolean;
    hasExternalProvider: boolean;
    accessToken: string | null; // Store access token for SignalR authentication
}
