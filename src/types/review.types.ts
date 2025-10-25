// Review Types for Booking Care System

export interface ReviewAuthorInfo {
    accountId: string;
    email: string;
    fullName: string;
    avatarUrl: string;
    role: 'Patient' | 'Doctor' | 'Admin';
    found: boolean;
}

export interface ReviewPatientInfo {
    userId: string;
    email: string;
    fullName: string;
    avatarUrl: string;
    found: boolean;
}

export interface ReviewReply {
    id: string;
    authorId: string;
    authorInfo: ReviewAuthorInfo;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface Review {
    id: string;
    patientId: string;
    patientInfo: ReviewPatientInfo;
    doctorId: string;
    serviceId: string | null;
    rating: number;
    comment: string;
    replies: ReviewReply[];
    createdAt: string;
    updatedAt: string;
}

export interface ReviewsResponse {
    reviews: Review[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface RatingDistribution {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
}

export interface ReviewStatistics {
    targetId: string;
    averageRating: number;
    totalReviews: number;
    ratingDistribution: RatingDistribution;
}

export interface ReviewsParams {
    doctorId: string;
    page?: number;
    pageSize?: number;
}

// Target Type Enum: 0 = DOCTOR, 1 = SERVICE
export enum TargetType {
    DOCTOR = 0,
    SERVICE = 1,
}

export interface CreateReviewRequest {
    patientId: string;
    targetType: TargetType; // 0 = DOCTOR, 1 = SERVICE
    doctorId?: string;
    serviceId?: string;
    rating: number;
    comment: string;
}

export interface UpdateReviewRequest {
    id: string;
    rating: number;
    comment: string;
}

export interface CreateReplyRequest {
    reviewId: string;
    authorId: string;
    content: string;
}

export interface UpdateReplyRequest {
    reviewId: string;
    replyId: string;
    content: string;
}
