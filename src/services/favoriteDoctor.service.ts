import axiosInstance from '@/configs/axios.config';
import { DoctorResponse } from '@/types/doctor.types';

// Favorite Doctors Response - reuse existing DoctorResponse
export interface FavoriteDoctorsData {
    doctors: DoctorResponse[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

export interface FavoriteDoctorsResponse {
    success: boolean;
    message: string;
    data: FavoriteDoctorsData;
    timestamp: string;
}

export interface GetFavoriteDoctorsParams {
    patientId: string;
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
}

// Types for toggle favorite request and response
export interface ToggleFavoriteRequest {
    patientId: string;
    doctorId: string;
}

export interface FavoriteRecord {
    id: string;
    patientId: string;
    doctorId: string;
    createdAt: string;
}

export interface ToggleFavoriteData {
    patientId: string;
    doctorId: string;
    isFavorited: boolean;
    action: 'Added' | 'Removed';
    favorite?: FavoriteRecord;
    timestamp: string;
}

export interface ToggleFavoriteResponse {
    success: boolean;
    message: string;
    data: ToggleFavoriteData;
    timestamp: string;
}

export class FavoriteDoctorService {
    /**
     * Lấy danh sách bác sĩ yêu thích của bệnh nhân
     */
    static async getFavoriteDoctors({
        patientId,
        pageNumber = 1,
        pageSize = 9,
        searchTerm,
    }: GetFavoriteDoctorsParams): Promise<FavoriteDoctorsData> {
        try {
            const params = new URLSearchParams({
                pageNumber: pageNumber.toString(),
                pageSize: pageSize.toString(),
            });

            if (searchTerm?.trim()) {
                params.append('searchTerm', searchTerm.trim());
            }

            const response: FavoriteDoctorsResponse = await axiosInstance.get(
                `/doctors/patient/${patientId}/favorites?${params.toString()}`
            );

            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch favorite doctors');
            }

            return response.data;
        } catch (error: any) {
            console.error('Error fetching favorite doctors:', error);
            throw new Error(error.message || 'Failed to fetch favorite doctors');
        }
    }

    /**
     * Toggle favorite status for a doctor
     */
    static async toggleFavorite({
        patientId,
        doctorId,
    }: ToggleFavoriteRequest): Promise<ToggleFavoriteData> {
        try {
            const response: ToggleFavoriteResponse = await axiosInstance.post('/Favorites/toggle', {
                patientId,
                doctorId,
            });

            if (!response.success) {
                throw new Error(response.message || 'Failed to toggle favorite status');
            }

            return response.data;
        } catch (error: any) {
            console.error('Error toggling favorite status:', error);
            throw new Error(error.message || 'Failed to toggle favorite status');
        }
    }
}

export default FavoriteDoctorService;
