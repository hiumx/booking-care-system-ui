import { Status } from '../enums/common.enums';

// Service Category Response DTOs
export interface ServiceCategoryResponse {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    parentId: string | null;
    status: Status;
    children?: ServiceCategoryResponse[];
}

export interface ServiceCategoryListResponse {
    serviceCategories: ServiceCategoryResponse[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// Parent Service Categories Response (hierarchical structure)
export interface ServiceCategoryParentsResponse extends ServiceCategoryResponse {
    children: ServiceCategoryResponse[];
}

// Medical Service Response DTOs
export interface MedicalServiceResponse {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    serviceCategoryId: string;
    status: Status;
    createdAt: string;
    updatedAt: string;
}

export interface MedicalServiceListResponse {
    medicalServices: MedicalServiceResponse[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// Query Parameters
export interface ServiceCategoryQueryParams {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: Status;
    parentId?: string | null;
}

export interface MedicalServiceQueryParams {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: Status;
    serviceCategoryId?: string;
}

// State interfaces
export interface ServiceCategoryState {
    serviceCategories: ServiceCategoryResponse[];
    parentServiceCategories: ServiceCategoryParentsResponse[];
    selectedServiceCategory: ServiceCategoryResponse | null;
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

export interface MedicalServiceState {
    medicalServices: MedicalServiceResponse[];
    selectedMedicalService: MedicalServiceResponse | null;
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
