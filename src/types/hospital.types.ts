import { Status } from '../enums/common.enums';
import { HospitalSimpleResponse } from './simple.types';

// Hospital Response DTOs
export interface HospitalResponse {
    id: string;
    accountId: string;
    name: string;
    address: string;
    phone?: string;
    email: string;
    description: string;
    backgroundUrl?: string;
    avatarUrl?: string;
    status: Status;
    createdAt: string;
    updatedAt: string;
    specialties?: HospitalSpecialtyResponse[];
    images?: HospitalImageResponse[];
    currentSubscription?: HospitalSubscriptionResponse;
}

export interface HospitalSpecialtyResponse {
    specialtyId: string;
    specialtyName?: string;
}

export interface HospitalListResponse {
    hospitals: HospitalResponse[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// Optimized Hospital List Response DTOs
export interface HospitalListOptimizedResponse {
    id: string;
    name: string;
    address: string;
    avatarUrl?: string;
    specialties?: HospitalSpecialtyOptimizedResponse[];
    totalSpecialties: number;
}

export interface HospitalSpecialtyOptimizedResponse {
    id: string;
    name: string;
    imageUrl?: string;
}

export interface HospitalListOptimizedPaginatedResponse {
    hospitals: HospitalListOptimizedResponse[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface HospitalDetailResponse extends HospitalResponse {
    subscriptionHistory?: HospitalSubscriptionResponse[];
}

// Hospital Profile (get by id) - trimmed fields for UI
export interface HospitalProfileResponse {
    id: string;
    accountId: string;
    name: string;
    address: string;
    phone?: string;
    email: string;
    description: string;
    backgroundUrl?: string;
    avatarUrl?: string;
    images: Array<{ id: string; imageUrl: string }>;
    specialties: Array<{ id: string; name: string; imageUrl?: string; doctorCount?: number }>;
    serviceMedicals: HospitalServiceMedicalResponse[];
    serviceTypes: HospitalServiceTypeResponse[];
}

// Service Medical Response
export interface HospitalServiceMedicalResponse {
    id: string;
    name: string;
    imageUrl?: string;
    price: number;
}

// Service Type Response
export interface HospitalServiceTypeResponse {
    id: string;
    name: string;
    imageUrl?: string;
    doctorCount: number;
}

// Hospital Image Response DTOs
export interface HospitalImageResponse {
    id: string;
    hospitalId: string;
    s3Key: string;
    imageUrl: string;
    description?: string;
    createdAt: string;
}

export interface HospitalImageListResponse {
    hospitalImages: HospitalImageResponse[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// Hospital Subscription Response DTOs
export interface HospitalSubscriptionResponse {
    id: string;
    hospitalId: string;
    subscriptionPlanId: string;
    subscriptionPlanName: string;
    startDate: string;
    endDate: string;
    status: Status;
    createdAt: string;
    updatedAt: string;
}

export interface HospitalSubscriptionListResponse {
    subscriptions: HospitalSubscriptionResponse[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// Subscription Plan Response DTOs
export interface SubscriptionPlanResponse {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number; // in days
    features: string[];
    status: Status;
    createdAt: string;
    updatedAt: string;
}

export interface SubscriptionPlanListResponse {
    subscriptionPlans: SubscriptionPlanResponse[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// Hospital Filter and Query Types
export interface HospitalFilterRequest {
    page?: number;
    pageSize?: number;
    searchTerm?: string;
    specialtyIds?: string[];
    location?: {
        latitude: number;
        longitude: number;
        radius: number; // in kilometers
    };
    sortBy?: 'name' | 'createdAt' | 'rating';
    sortOrder?: 'asc' | 'desc';
}

// Optimized Hospital List Filter Request
export interface HospitalListOptimizedFilterRequest {
    search?: string;
    specialtyIds?: string[]; // Keep as string[] for frontend, will be converted to Guid[] in backend
    provinceId?: string;
    districtId?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: string;
}

// Hospital Search Parameters (for UI)
export interface HospitalSearchParams {
    page?: number;
    pageSize?: number;
    searchTerm?: string;
    specialtyFilter?: string;
    locationFilter?: {
        latitude: number;
        longitude: number;
        radius: number;
    };
    sortBy?: 'name' | 'createdAt' | 'rating';
    sortOrder?: 'asc' | 'desc';
}

// Hospital State
export interface HospitalState {
    hospitals: HospitalResponse[];
    simpleHospitals: HospitalSimpleResponse[]; // For optimized API
    optimizedHospitals: HospitalListOptimizedResponse[]; // For optimized list API
    selectedHospital: HospitalProfileResponse | null;
    isLoading: boolean;
    error: string | null;
    pagination: {
        page: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
    };
    filters: {
        page: number;
        pageSize: number;
    };
}
