import { Status } from '../enums/common.enums';
import { PositionResponse } from './position.types';
import { SpecialtyResponse } from './specialty.types';
import { LanguageResponse } from './language.types';

// Doctor Response DTOs
export interface DoctorResponse {
    id: string;
    accountId: string;
    email: string;
    address?: string;
    firstName: string;
    lastName: string;
    gender?: string; // Backend returns string: 'MALE', 'FEMALE', 'OTHER'
    positionId?: string;
    specialtyId?: string;
    hospitalId?: string;
    bio?: string;
    yearsOfExperience: number;
    avatarUrl: string;
    createdAt: string;
    updatedAt: string;
    status: Status;

    // Navigation properties
    position?: PositionResponse;
    specialty?: SpecialtyResponse;
    prices: DoctorPriceResponse[];
    languages: LanguageResponse[];
    isFavorited: boolean;

    // Hospital information
    hospital?: HospitalBasicInfo;
    // Review statistics - can be detailed (with rating distribution) or basic (without)
    reviewStatistics?: DoctorReviewStatistics | DoctorReviewStatisticsBasic;
}

export interface DoctorPriceResponse {
    id: string;
    doctorId: string;
    serviceTypeId: string;
    serviceTypeName: string;
    amount: number;
    createdAt: string;
    updatedAt: string;
}

export interface DoctorListResponse {
    doctors: DoctorResponse[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

// DoctorDetailResponse is the same as DoctorResponse for now
// If additional fields are needed in the future, this can be extended
export type DoctorDetailResponse = DoctorResponse;

export interface DoctorBasicInfoResponse {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    position?: PositionResponse;
    specialty?: SpecialtyResponse;
    yearsOfExperience: number;
    averageRating: number;
    totalReviews: number;
}

// Hospital Basic Info (for doctor context)
export interface HospitalBasicInfo {
    id: string;
    name: string;
    address?: string;
    avatarUrl?: string;
}

// Doctor Review Statistics
export interface DoctorReviewStatistics {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
        fiveStar: number;
        fourStar: number;
        threeStar: number;
        twoStar: number;
        oneStar: number;
    };
}

export interface DoctorReviewStatisticsBasic {
    averageRating: number;
    totalReviews: number;
}

// Doctor Query and Filter Types
export interface DoctorQueryRequest {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
    specialtyId?: string;
    positionId?: string;
    hospitalId?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    maxRating?: number;
    gender?: Gender;
    languageIds?: string[];
    serviceTypeIds?: string[];
    sortBy?: 'name' | 'rating' | 'price' | 'experience' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

export interface DoctorAdvancedFilterRequest extends DoctorQueryRequest {
    // Additional advanced filter options
    hasAvailability?: boolean;
    isOnline?: boolean;
    location?: {
        latitude: number;
        longitude: number;
        radius: number; // in kilometers
    };
}

// Doctor Search Parameters (for UI)
export interface DoctorSearchParams {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
    specialtyFilter?: string;
    specialtyFilters?: string[]; // Support multiple specialty filters
    positionFilter?: string;
    positionFilters?: string[]; // Support multiple position filters
    hospitalFilter?: string;
    hospitalFilters?: string[]; // Support multiple hospital filters
    languageFilter?: string;
    languageFilters?: string[]; // Support multiple language filters
    languageIds?: string[]; // Explicit language IDs (preferred)
    serviceTypeFilter?: string;
    serviceTypeFilters?: string[]; // Support multiple service type filters
    priceRange?: {
        min: number;
        max?: number; // Optional - when undefined, means no upper limit
    };
    ratingFilter?: number;
    ratingFilters?: number[]; // Support multiple rating filters
    genderFilter?: Gender;
    genderFilters?: string[]; // Support multiple gender filters
    experienceRange?: { min: number; max: number }; // New slider format like price
    experienceFilter?: string; // Keep for backward compatibility
    experienceFilters?: { MinYears: number; MaxYears: number }[]; // Keep for backward compatibility
    areaFilter?: {
        provinceId?: string;
        districtId?: string;
        provinceName?: string;
        districtName?: string;
    }; // Area/location filter
    sortBy?: 'name' | 'rating' | 'price' | 'experience' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    patientId?: string;
}

// Doctor State
export interface DoctorState {
    doctors: DoctorResponse[];
    selectedDoctor: DoctorResponse | null;
    isLoading: boolean;
    error: string | null;
    pagination: {
        pageNumber: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
    };
    filters: {
        pageNumber: number;
        pageSize: number;
    };
}

// UI Specific Types for Doctor Cards
export interface FavouriteDoctor {
    id: string;
    name: string;
    specialty: string;
    image: string;
    rating: number;
    numberOfReviews: number;
    level: string;
    location: string;
    experience: string;
    isVerified: boolean;
}
