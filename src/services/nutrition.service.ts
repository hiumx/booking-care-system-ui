import axiosInstance from '@/configs/axios.config';
import {
    CreateNutritionProfileDto,
    DailyPlan,
    HealthMetrics,
    MealPlan,
    NutritionProfile,
    ProgressStats,
    WorkoutPlan,
} from '@/types/nutrition.types';

const API_BASE = '';

export const nutritionService = {
    // Nutrition Profile
    getProfile: async (): Promise<NutritionProfile> => {
        const response = await axiosInstance.get(`${API_BASE}/nutrition-profiles/me`);
        console.log('[Nutrition Service] getProfile response:', response);
        return response.data; // ← Axios interceptor đã unwrap response.data
    },

    createOrUpdateProfile: async (data: CreateNutritionProfileDto): Promise<NutritionProfile> => {
        const response = await axiosInstance.post(`${API_BASE}/nutrition-profiles`, data);
        return response.data; // ← Axios interceptor đã unwrap
    },

    calculateMetrics: async (data: CreateNutritionProfileDto): Promise<HealthMetrics> => {
        const response = await axiosInstance.post(
            `${API_BASE}/nutrition-profiles/calculate-metrics`,
            data
        );
        return response.data; // ← Axios interceptor đã unwrap
    },

    // Daily Plan
    getDailyPlan: async (date?: string): Promise<DailyPlan> => {
        const params = date ? `?date=${date}` : '';
        const response = await axiosInstance.get(`${API_BASE}/daily-plans${params}`);
        return response.data; // ← Axios interceptor đã unwrap
    },

    generateDailyPlan: async (date?: string): Promise<DailyPlan> => {
        const params = date ? `?date=${date}` : '';
        const response = await axiosInstance.post(`${API_BASE}/daily-plans/generate${params}`);
        console.log('[Nutrition Service] generateDailyPlan response:', response);
        return response.data; // ← Axios interceptor đã unwrap
    },

    // Meal Plan
    getMealPlan: async (date: string): Promise<MealPlan> => {
        const response = await axiosInstance.get(`${API_BASE}/meal-plans?date=${date}`);
        return response.data; // ← Axios interceptor đã unwrap
    },

    getTodayMealPlan: async (): Promise<MealPlan> => {
        const response = await axiosInstance.get(`${API_BASE}/meal-plans/today`);
        return response.data; // ← Axios interceptor đã unwrap
    },

    generateMealPlan: async (date?: string): Promise<MealPlan> => {
        const params = date ? `?date=${date}` : '';
        const response = await axiosInstance.post(`${API_BASE}/meal-plans/generate${params}`);
        return response.data; // ← Axios interceptor đã unwrap
    },

    completeMeal: async (id: string, itemIndex: number): Promise<MealPlan> => {
        const response = await axiosInstance.post(`${API_BASE}/meal-plans/${id}/complete`, {
            itemIndex,
        });
        return response.data; // ← Axios interceptor đã unwrap
    },

    // Workout Plan
    getWorkoutPlan: async (date: string): Promise<WorkoutPlan> => {
        const response = await axiosInstance.get(`${API_BASE}/workout-plans?date=${date}`);
        return response.data; // ← Axios interceptor đã unwrap
    },

    getTodayWorkoutPlan: async (): Promise<WorkoutPlan> => {
        const response = await axiosInstance.get(`${API_BASE}/workout-plans/today`);
        return response.data; // ← Axios interceptor đã unwrap
    },

    generateWorkoutPlan: async (date?: string): Promise<WorkoutPlan> => {
        const params = date ? `?date=${date}` : '';
        const response = await axiosInstance.post(`${API_BASE}/workout-plans/generate${params}`);
        return response.data; // ← Axios interceptor đã unwrap
    },

    completeExercise: async (id: string, itemIndex: number): Promise<WorkoutPlan> => {
        const response = await axiosInstance.post(`${API_BASE}/workout-plans/${id}/complete`, {
            itemIndex,
        });
        return response.data; // ← Axios interceptor đã unwrap
    },

    // Progress
    getProgressStats: async (): Promise<ProgressStats> => {
        const response = await axiosInstance.get(`${API_BASE}/progress/stats`);
        return response.data; // ← Axios interceptor đã unwrap
    },
};
