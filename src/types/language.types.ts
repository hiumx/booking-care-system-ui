import { Status } from '../enums/common.enums';

// Language Response DTOs
export interface LanguageResponse {
    id: string;
    name: string;
    code: string;
    description?: string;
    status: Status;
    createdAt: string;
    updatedAt: string;
}

export interface LanguageListResponse {
    languages: LanguageResponse[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

// Language State
export interface LanguageState {
    languages: LanguageResponse[];
    isLoading: boolean;
    error: string | null;
}
