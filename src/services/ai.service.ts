import axiosInstance, { ApiResponse } from '@/configs/axios.config';

// Base API endpoint for AI service
// Backend route: /api/v{version}/symptoms/{everything}
const AI_ENDPOINTS = {
    BASE: '/symptoms',
    ANALYZE: '/symptoms/analyze',
    HEALTH: '/symptoms/health',
    SESSION: (sessionId: string) => `/symptoms/sessions/${sessionId}`,
    SAVE_SESSION: (sessionId: string) => `/symptoms/sessions/${sessionId}/save`,
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
    questionCount?: number; // Number of questions asked so far (0-3)
    disease?: DiseaseConclusion; // Disease conclusion (only when analysisComplete = true)
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
