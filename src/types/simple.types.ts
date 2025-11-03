// Simple Response DTOs for optimized API calls

// Specialty Simple Response DTO
export interface SpecialtySimpleResponse {
    id: string;
    name: string;
    imageUrl: string;
    doctorCount: number;
}

// Position Simple Response DTO
export interface PositionSimpleResponse {
    id: string;
    name: string;
    doctorCount: number;
}

// Language Simple Response DTO
export interface LanguageSimpleResponse {
    id: string;
    name: string;
}

// ServiceType Simple Response DTO
export interface ServiceTypeSimpleResponse {
    id: string;
    name: string;
    imageUrl?: string; // Icon URL from backend
}

// Hospital Simple Response DTO
export interface HospitalSimpleResponse {
    id: string;
    name: string;
    avatarUrl?: string;
}
