import { Status } from '../enums/common.enums';

// Position Response DTOs
export interface PositionResponse {
    id: string;
    name: string;
    description?: string;
    status: Status;
    doctorCount: number; // Số bác sĩ có position này
    createdAt: string;
    updatedAt: string;
}

export interface PositionListResponse {
    positions: PositionResponse[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

// Position State
export interface PositionState {
    positions: PositionResponse[];
    isLoading: boolean;
    error: string | null;
}
