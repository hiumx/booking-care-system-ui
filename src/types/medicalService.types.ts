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

// Service with Hospital Response DTOs
export interface HospitalResponse {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    avatarUrl: string;
}

export interface ServiceWithHospitalResponse {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    hospitalId: string;
    serviceCategoryId: string;
    durationTime: number;
    status: Status;
    parentCategoryName: string;
    hospital: HospitalResponse;
}

export interface ServiceWithHospitalListResponse {
    serviceCategoryId: string;
    serviceCategoryName: string;
    serviceCategoryDescription: string;
    parentCategoryName: string;
    totalServices: number;
    page: number;
    pageSize: number;
    totalPages: number;
    services: ServiceWithHospitalResponse[];
}

export interface ServiceWithHospitalQueryParams {
    page?: number;
    pageSize?: number;
    includeInactive?: boolean;
}

// State interfaces
export interface ServiceCategoryState {
    serviceCategories: ServiceCategoryResponse[];
    parentServiceCategories: ServiceCategoryParentsResponse[];
    selectedServiceCategory: ServiceCategoryResponse | null;
    servicesWithHospital: ServiceWithHospitalListResponse | null;
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
