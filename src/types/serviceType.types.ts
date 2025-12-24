import { Status } from '../enums/common.enums';

// ServiceType Response DTOs
export interface ServiceTypeResponse {
    id: string;
    name: string;
    description?: string;
    status: Status;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceTypeListResponse {
    serviceTypes: ServiceTypeResponse[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

// ServiceType State
export interface ServiceTypeState {
    serviceTypes: ServiceTypeResponse[];
    isLoading: boolean;
    error: string | null;
}
