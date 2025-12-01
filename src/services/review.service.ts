import axiosInstance, { ApiResponse } from '@/configs/axios.config';
import {
    Review,
    ReviewsResponse,
    ReviewStatistics,
    ReviewsParams,
    CreateReviewRequest,
    UpdateReviewRequest,
    CreateReplyRequest,
    UpdateReplyRequest,
} from '@/types/review.types';

/**
 * Review Service
 * Handles all review-related API calls
 */
export class ReviewService {
    private static readonly BASE_PATH = '/Reviews';

    /**
     * Get reviews for a specific doctor
     * @param params - Query parameters including doctorId, page, pageSize
     * @returns Promise with reviews data
     */
    static async getDoctorReviews(params: ReviewsParams): Promise<ApiResponse<ReviewsResponse>> {
        const { doctorId, page = 1, pageSize = 10 } = params;
        const response = await axiosInstance.get<any, ApiResponse<ReviewsResponse>>(
            `${this.BASE_PATH}/doctor/${doctorId}`,
            {
                params: { page, pageSize },
            }
        );
        return response;
    }

    /**
     * Get review statistics for a specific doctor
     * @param doctorId - Doctor's ID
     * @returns Promise with statistics data
     */
    static async getDoctorStatistics(doctorId: string): Promise<ApiResponse<ReviewStatistics>> {
        const response = await axiosInstance.get<any, ApiResponse<ReviewStatistics>>(
            `${this.BASE_PATH}/doctor/${doctorId}/statistics`
        );
        return response;
    }

    /**
     * Get reviews for a specific service with pagination
     * GET /api/v1.0/Reviews/service/{serviceId}
     * @param params - Query parameters (serviceId, page, pageSize)
     * @returns Promise with paginated service reviews
     */
    static async getServiceReviews(params: {
        serviceId: string;
        page?: number;
        pageSize?: number;
    }): Promise<ApiResponse<{ reviews: Review[]; totalCount: number }>> {
        const { serviceId, page = 1, pageSize = 10 } = params;
        const response = await axiosInstance.get<
            any,
            ApiResponse<{ reviews: Review[]; totalCount: number }>
        >(`${this.BASE_PATH}/service/${serviceId}`, {
            params: { page, pageSize },
        });
        return response;
    }

    /**
     * Get review statistics for a specific service
     * GET /api/v1.0/Reviews/service/{serviceId}/statistics
     * @param serviceId - Service's ID
     * @returns Promise with statistics data
     */
    static async getServiceStatistics(serviceId: string): Promise<ApiResponse<ReviewStatistics>> {
        const response = await axiosInstance.get<any, ApiResponse<ReviewStatistics>>(
            `${this.BASE_PATH}/service/${serviceId}/statistics`
        );
        return response;
    }

    /**
     * Get reviews for a specific hospital with pagination and filtering
     * GET /api/v1.0/Reviews/hospital/{hospitalId}
     * @param params - Query parameters (hospitalId, page, pageSize, minRating)
     * @returns Promise with paginated hospital reviews
     */
    static async getHospitalReviews(params: {
        hospitalId: string;
        page?: number;
        pageSize?: number;
        minRating?: number;
    }): Promise<ApiResponse<ReviewsResponse>> {
        const { hospitalId, page = 1, pageSize = 10, minRating } = params;
        const queryParams: any = { page, pageSize };

        // Add minRating to query if provided
        if (minRating !== undefined) {
            queryParams.minRating = minRating;
        }

        const response = await axiosInstance.get<any, ApiResponse<ReviewsResponse>>(
            `${this.BASE_PATH}/hospital/${hospitalId}`,
            {
                params: queryParams,
            }
        );
        return response;
    }

    /**
     * Get review statistics for a specific hospital
     * GET /api/v1.0/Reviews/hospital/{hospitalId}/statistics
     * @param hospitalId - Hospital's ID
     * @returns Promise with statistics data
     */
    static async getHospitalStatistics(hospitalId: string): Promise<ApiResponse<ReviewStatistics>> {
        const response = await axiosInstance.get<any, ApiResponse<ReviewStatistics>>(
            `${this.BASE_PATH}/hospital/${hospitalId}/statistics`
        );
        return response;
    }

    /**
     * Create a new review (requires completed appointment with target doctor/service)
     * @param data - Review data with targetType (0 = DOCTOR, 1 = SERVICE)
     * @returns Promise with created review
     * @throws 400 - No appointment history with target
     * @throws 409 - Duplicate review (already reviewed this target)
     * @example
     * await ReviewService.createReview({
     *   patientId: 'uuid',
     *   targetType: TargetType.DOCTOR, // 0
     *   doctorId: 'uuid',
     *   rating: 5,
     *   comment: 'Great doctor!'
     * });
     */
    static async createReview(data: CreateReviewRequest): Promise<ApiResponse<any>> {
        const response = await axiosInstance.post<any, ApiResponse<any>>(`${this.BASE_PATH}`, data);
        return response;
    }

    /**
     * Update an existing review
     * @param data - Updated review data (id, rating, comment)
     * @returns Promise with updated review
     */
    static async updateReview(data: UpdateReviewRequest): Promise<ApiResponse<any>> {
        const response = await axiosInstance.put<any, ApiResponse<any>>(`${this.BASE_PATH}`, data);
        return response;
    }

    /**
     * Delete a review
     * @param reviewId - Review's ID
     * @returns Promise with deletion result
     */
    static async deleteReview(reviewId: string): Promise<ApiResponse<any>> {
        const response = await axiosInstance.delete<any, ApiResponse<any>>(
            `${this.BASE_PATH}/${reviewId}`
        );
        return response;
    }

    /**
     * Add a reply to a review
     * @param data - Reply data (reviewId, authorId, content)
     * @returns Promise with created reply
     */
    static async createReply(data: CreateReplyRequest): Promise<ApiResponse<any>> {
        const response = await axiosInstance.post<any, ApiResponse<any>>(
            `${this.BASE_PATH}/reply`,
            data
        );
        return response;
    }

    /**
     * Update a reply
     * PUT /api/v1.0/Reviews/reply
     * @param data - Updated reply data (reviewId, replyId, content)
     * @returns Promise with updated review containing the updated reply
     * @example
     * await ReviewService.updateReply({
     *     reviewId: "68b418439b59fcab6406e028",
     *     replyId: "68b4187d9b59fcab6406e02a",
     *     content: "Reply Update 1"
     * });
     */
    static async updateReply(data: UpdateReplyRequest): Promise<ApiResponse<any>> {
        const response = await axiosInstance.put<any, ApiResponse<any>>(
            `${this.BASE_PATH}/reply`,
            data
        );
        return response;
    }

    /**
     * Remove a reply from a review
     * @param reviewId - Review's ID
     * @param replyId - Reply's ID
     * @returns Promise with deletion result
     */
    static async deleteReply(reviewId: string, replyId: string): Promise<ApiResponse<any>> {
        const response = await axiosInstance.delete<any, ApiResponse<any>>(
            `${this.BASE_PATH}/${reviewId}/reply/${replyId}`
        );
        return response;
    }
}
