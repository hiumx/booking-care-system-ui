// Nutrition Types
export interface NutritionProfile {
    id: string;
    userId: string;
    age: number;
    gender: string;
    heightCm: number;
    weightKg: number;
    bmi: number;
    bmr: number;
    tdee: number;
    activityLevel: string;
    healthGoal: string;
    targetCalories: number;
    targetProteinG: number;
    targetCarbsG: number;
    targetFatG: number;
    healthConditions?: string[];
    dietaryPreferences?: DietaryPreferences;
    streakCount: number;
    lastCompletedDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface DietaryPreferences {
    dietType?: string; // "Regular", "Vegetarian", "Vegan", "Keto", "LowCarb"
    allergies?: string[];
    dislikes?: string[];
    preferredCuisines?: string[];
}

export interface CreateNutritionProfileDto {
    heightCm: number;
    weightKg: number;
    activityLevel: string;
    healthGoal: string;
    healthConditions?: string[];
    dietaryPreferences?: DietaryPreferences;
}

export interface HealthMetrics {
    bmi: number;
    bmr: number;
    tdee: number;
    targetCalories: number;
    targetProteinG: number;
    targetCarbsG: number;
    targetFatG: number;
    bmiCategory: string;
}

export interface MealPlan {
    id: string;
    userId: string;
    date: string;
    totalCalories: number;
    totalProteinG: number;
    totalCarbsG: number;
    totalFatG: number;
    meals: Meal[];
    completedItems?: number[];
    isFullyCompleted: boolean;
    generatedAt: string;
}

export interface Meal {
    mealType: string; // "Breakfast", "Lunch", "Dinner", "Snack"
    recipe: Recipe;
}

export interface Recipe {
    nameVi: string;
    nameEn: string;
    prepTimeMinutes: number;
    cookTimeMinutes: number;
    servings: number;
    nutrition: NutritionInfo;
}

export interface NutritionInfo {
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    fiberG?: number;
}

export interface WorkoutPlan {
    id: string;
    userId: string;
    date: string;
    workoutType: string;
    durationMinutes: number;
    estimatedCaloriesBurned: number;
    exercises: Exercise[];
    completedItems?: number[];
    isFullyCompleted: boolean;
    generatedAt: string;
}

export interface Exercise {
    nameVi: string;
    nameEn: string;
    durationMinutes: number;
    sets: number;
    reps: number;
    intensity?: string;
    caloriesBurned?: number;
}

export interface DailyPlan {
    date: string;
    mealPlan?: MealPlan;
    workoutPlan?: WorkoutPlan;
    completionPercentage: number;
    totalCaloriesConsumed: number;
    totalCaloriesBurned: number;
}

export interface ProgressStats {
    streakCount: number;
    lastCompletedDate?: string;
    weeklyCompletion: DailyCompletion[];
    averageCompletionRate: number;
    totalDaysCompleted: number;
}

export interface DailyCompletion {
    date: string;
    completionPercentage: number;
    isFullyCompleted: boolean;
}

// Enums
export enum ActivityLevel {
    Sedentary = 'Sedentary',
    Light = 'Light',
    Moderate = 'Moderate',
    Active = 'Active',
    VeryActive = 'VeryActive',
}

export enum HealthGoal {
    WeightLoss = 'WeightLoss',
    MuscleGain = 'MuscleGain',
    Maintenance = 'Maintenance',
    HeartHealth = 'HeartHealth',
}

export enum DietType {
    Regular = 'Regular',
    Vegetarian = 'Vegetarian',
    Vegan = 'Vegan',
    Keto = 'Keto',
    LowCarb = 'LowCarb',
}

export enum Gender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other',
}

// Constants
export const ACTIVITY_LEVEL_OPTIONS = [
    {
        value: ActivityLevel.Sedentary,
        label: '🛋️ Ít vận động',
        description: 'Văn phòng, ngồi nhiều',
    },
    { value: ActivityLevel.Light, label: '🚶 Nhẹ nhàng', description: 'Tập 1-3 ngày/tuần' },
    { value: ActivityLevel.Moderate, label: '🏃 Trung bình', description: 'Tập 3-5 ngày/tuần' },
    { value: ActivityLevel.Active, label: '🏋️ Năng động', description: 'Tập 6-7 ngày/tuần' },
    { value: ActivityLevel.VeryActive, label: '🏅 Vận động viên', description: 'Tập 2 lần/ngày' },
];

export const HEALTH_GOAL_OPTIONS = [
    { value: HealthGoal.WeightLoss, label: '📉 Giảm cân', icon: '📉' },
    { value: HealthGoal.MuscleGain, label: '💪 Tăng cơ', icon: '💪' },
    { value: HealthGoal.Maintenance, label: '🧘 Duy trì sức khỏe', icon: '🧘' },
    { value: HealthGoal.HeartHealth, label: '❤️ Cải thiện tim mạch', icon: '❤️' },
];

export const DIET_TYPE_OPTIONS = [
    { value: DietType.Regular, label: 'Ăn thường' },
    { value: DietType.Vegetarian, label: 'Ăn chay' },
    { value: DietType.Vegan, label: 'Thuần chay' },
    { value: DietType.Keto, label: 'Keto' },
    { value: DietType.LowCarb, label: 'Low-carb' },
];

export const COMMON_ALLERGIES = [
    'Hải sản',
    'Đậu phộng',
    'Sữa',
    'Trứng',
    'Đậu nành',
    'Lúa mì',
    'Hạt',
];

export const COMMON_HEALTH_CONDITIONS = [
    'Tiểu đường',
    'Huyết áp cao',
    'Đau dạ dày',
    'Cholesterol cao',
    'Bệnh tim',
    'Không có',
];

export const CUISINE_OPTIONS = ['Món Việt', 'Món Âu', 'Món Á', 'Món Nhật', 'Món Hàn'];
