import axiosInstance, { ApiResponse } from '@/configs/axios.config';

// Base API endpoint for AI service
// Backend route: /api/v{version}/symptoms/{everything}
const AI_ENDPOINTS = {
    BASE: '/symptoms',
    ANALYZE: '/symptoms/analyze',
    HEALTH: '/symptoms/health',
    SESSION: (sessionId: string) => `/symptoms/sessions/${sessionId}`,
    SAVE_SESSION: (sessionId: string) => `/symptoms/sessions/${sessionId}/save`,
    LAB_RESULT_ANALYZE: '/lab-results/analyze',
    DERMATOLOGY_ANALYZE: '/dermatology/analyze',
} as const;

// Types
export interface ConversationMessage {
    role: 'user' | 'ai';
    content: string;
    timestamp?: Date | string;
}

export interface LocationContext {
    provinceId?: string;
    districtId?: string;
    displayName: string;
}

export interface SymptomAnalysisRequest {
    sessionId?: string; // GUID format
    userId?: string; // GUID format
    message: string;
    location?: LocationContext;
    conversationHistory?: ConversationMessage[];
}

export interface DiseaseMatch {
    name: string;
    confidence: number;
    description: string;
}

export interface FollowUpQuestion {
    question: string;
    purpose: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface SpecialtyMatch {
    specialtyId?: string;
    specialtyName: string;
    confidence: number;
    urgency: 'EMERGENCY' | 'URGENT' | 'NORMAL' | 'ROUTINE';
    reasons: string[];
}

export interface DoctorRecommendation {
    id: string;
    name: string;
    specialtyName: string;
    hospitalName: string;
    rating: number;
    yearOfExperience: number;
    serviceTypeName?: string;
    price?: string;
    recommendationScore: number;
    avatarUrl?: string;
}

export interface HospitalRecommendation {
    id: string;
    name: string;
    address: string;
    specialtyNames: string[];
    recommendationScore: number;
    imageUrl?: string;
}

export interface DiseaseConclusion {
    name: string;
    confidence: number; // 0-1
    reasons: string[];
}

export interface SymptomAnalysisResponse {
    sessionId: string;
    message: string;
    possibleDiseases: DiseaseMatch[];
    nextQuestions: FollowUpQuestion[];
    recommendedSpecialties: SpecialtyMatch[];
    recommendedDoctors: DoctorRecommendation[];
    recommendedHospitals: HospitalRecommendation[];
    generalAdvice: string[];
    analysisComplete: boolean;
    disclaimer: string;
    timestamp: string;
    questionCount?: number; // Number of questions in current round (1-3)
    currentRound?: number; // Current consultation round (1 or 2)
    maxQuestions?: number; // Maximum questions per round (always 3)
    disease?: DiseaseConclusion; // Disease conclusion (only when analysisComplete = true)
    canRequestMoreQuestions?: boolean; // Whether user can request more questions (true when round 1 && confidence < 90%)
}

export class AIService {
    /**
     * Health check for AI service
     */
    static async healthCheck(): Promise<ApiResponse> {
        try {
            const response: any = await axiosInstance.get(AI_ENDPOINTS.HEALTH);
            return {
                success: response.success ?? true,
                data: response.data || response,
                message: response.message || 'AI service is healthy',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Health check failed');
        }
    }

    /**
     * Analyze symptoms and get recommendations
     */
    static async analyzeSymptoms(
        request: SymptomAnalysisRequest
    ): Promise<ApiResponse<SymptomAnalysisResponse>> {
        try {
            const response: any = await axiosInstance.post(AI_ENDPOINTS.ANALYZE, request);

            return {
                success: response.success ?? true,
                data: response.data,
                message: response.message || 'Symptom analysis completed',
            };
        } catch (error: any) {
            console.error('Error analyzing symptoms:', error);
            throw new Error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to analyze symptoms. Please try again.'
            );
        }
    }

    /**
     * Get conversation session by ID
     */
    static async getSession(
        sessionId: string
    ): Promise<ApiResponse<{ sessionId: string; conversationHistory: ConversationMessage[] }>> {
        try {
            const response: any = await axiosInstance.get(AI_ENDPOINTS.SESSION(sessionId));
            return {
                success: response.success ?? true,
                data: response.data,
                message: response.message || 'Session retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to retrieve session');
        }
    }

    /**
     * Save conversation session
     */
    static async saveSession(sessionId: string, sessionData: any): Promise<ApiResponse> {
        try {
            const response: any = await axiosInstance.post(
                AI_ENDPOINTS.SAVE_SESSION(sessionId),
                sessionData
            );
            return {
                success: response.success ?? true,
                data: response.data,
                message: response.message || 'Session saved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to save session');
        }
    }

    /**
     * Get all conversation sessions for authenticated user
     * Backend will get userId from authentication token
     */
    static async getUserSessions(): Promise<ApiResponse<SessionSummary[]>> {
        try {
            const response: any = await axiosInstance.get(`${AI_ENDPOINTS.BASE}/sessions`);
            return {
                success: response.success ?? true,
                data: response.data || [],
                message: response.message || 'Sessions retrieved successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to retrieve sessions');
        }
    }

    /**
     * Delete a conversation session
     */
    static async deleteSession(sessionId: string): Promise<ApiResponse> {
        try {
            const response: any = await axiosInstance.delete(AI_ENDPOINTS.SESSION(sessionId));
            return {
                success: response.success ?? true,
                data: response.data,
                message: response.message || 'Session deleted successfully',
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to delete session');
        }
    }

    /**
     * Get conversation history for a session
     */
    static async getConversationHistory(
        sessionId: string
    ): Promise<ApiResponse<ConversationMessage[]>> {
        try {
            const response: any = await axiosInstance.get(
                `${AI_ENDPOINTS.BASE}/sessions/${sessionId}/history`
            );
            return {
                success: response.success ?? true,
                data: response.data || [],
                message: response.message || 'Conversation history retrieved successfully',
            };
        } catch (error: any) {
            console.error('Error loading conversation history:', error);
            throw new Error(error.message || 'Failed to load conversation history');
        }
    }

    /**
     * Analyze lab result image
     */
    static async analyzeLabResult(
        file: File,
        location?: LocationContext,
        sessionId?: string
    ): Promise<ApiResponse<import('@/types/ai.types').LabResultAnalysisResponse>> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            if (sessionId) {
                formData.append('sessionId', sessionId);
            }

            if (location) {
                formData.append('location.provinceId', location.provinceId || '');
                formData.append('location.districtId', location.districtId || '');
                formData.append('location.displayName', location.displayName);
            }

            const response: any = await axiosInstance.post(
                AI_ENDPOINTS.LAB_RESULT_ANALYZE,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            return {
                success: response.success ?? true,
                data: response.data,
                message: response.message || 'Lab result analyzed successfully',
            };
        } catch (error: any) {
            console.error('Error analyzing lab result:', error);
            throw new Error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to analyze lab result. Please try again.'
            );
        }
    }

    /**
     * Analyze dermatology image
     */
    static async analyzeDermatology(
        file: File,
        location?: LocationContext,
        sessionId?: string
    ): Promise<ApiResponse<import('@/types/ai.types').DermatologyAnalysisResponse>> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            if (sessionId) {
                formData.append('sessionId', sessionId);
            }

            if (location) {
                if (location.provinceId) {
                    formData.append('provinceId', location.provinceId);
                }
                if (location.districtId) {
                    formData.append('districtId', location.districtId);
                }
                formData.append('locationDisplayName', location.displayName);
            }

            const response: any = await axiosInstance.post(
                AI_ENDPOINTS.DERMATOLOGY_ANALYZE,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            return {
                success: response.success ?? true,
                data: response.data,
                message: response.message || 'Dermatology image analyzed successfully',
            };
        } catch (error: any) {
            console.error('Error analyzing dermatology image:', error);
            throw new Error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to analyze dermatology image. Please try again.'
            );
        }
    }
}

export interface SessionSummary {
    sessionId: string;
    userId?: string;
    title?: string;
    lastMessage?: string;
    createdAt: string;
    updatedAt: string;
    messageCount: number;
}
