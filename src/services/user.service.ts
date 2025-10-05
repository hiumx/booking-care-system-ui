import axiosInstance, { ApiResponse } from '@/configs/axios.config';
import { UserProfile, UpdateUserRequest } from '@/types/user.types';

// Base API endpoints for users
const USER_ENDPOINTS = {
    BASE: '/users',
    PROFILE: '/users/profile',
    HEALTH: '/users/health',
} as const;

/**
 * User Service
 * Handles all user-related API operations
 */
export class UserService {
    /**
     * Health check endpoint
     */
    static async healthCheck(): Promise<ApiResponse> {
        try {
            const response: any = await axiosInstance.get(USER_ENDPOINTS.HEALTH);
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message,
            };
        } catch (error: any) {
            throw new Error(error.message || 'User service health check failed');
        }
    }

    /**
     * Get current user profile (uses JWT token from axios interceptor)
     */
    static async getCurrentUserProfile(): Promise<ApiResponse<UserProfile>> {
        try {
            const response: any = await axiosInstance.get(USER_ENDPOINTS.PROFILE);
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'User profile retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to get user profile');
        }
    }

    /**
     * Update current user profile
     */
    static async updateUserProfile(
        updateData: UpdateUserRequest
    ): Promise<ApiResponse<UserProfile>> {
        try {
            const response: any = await axiosInstance.put(USER_ENDPOINTS.PROFILE, updateData);
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'User profile updated successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to update user profile');
        }
    }

    /**
     * Get user by ID (admin only)
     */
    static async getUserById(id: string): Promise<ApiResponse<UserProfile>> {
        try {
            const response: any = await axiosInstance.get(`${USER_ENDPOINTS.BASE}/${id}`);
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'User retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to get user');
        }
    }

    /**
     * Update user by ID (admin only)
     */
    static async updateUser(
        id: string,
        updateData: UpdateUserRequest
    ): Promise<ApiResponse<UserProfile>> {
        try {
            const response: any = await axiosInstance.put(
                `${USER_ENDPOINTS.BASE}/${id}`,
                updateData
            );
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'User updated successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to update user');
        }
    }
}

// Export individual methods for convenience
export const { healthCheck, getCurrentUserProfile, updateUserProfile } = UserService;

// Default export
export default UserService;
