import { Status } from '../enums/common.enums';

// Specialty Response DTOs
export interface SpecialtyResponse {
    id: string;
    name: string;
    description?: string;
    imageUrl: string;
    status: Status;
    createdAt: string;
    updatedAt: string;
}

export interface SpecialtyListResponse {
    specialties: SpecialtyResponse[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

// Specialty State
export interface SpecialtyState {
    specialties: SpecialtyResponse[];
    isLoading: boolean;
    error: string | null;
}
