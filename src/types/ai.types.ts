// Nutrition types (defined first to avoid forward reference)
export interface DietaryPreferences {
    isVegetarian: boolean;
    isVegan: boolean;
    isKeto: boolean;
    isLowCarb: boolean;
    isGlutenFree: boolean;
    isDairyFree: boolean;
    allergies: string[];
}

export interface NutritionProfile {
    id: string;
    userId: string;
    heightCm: number;
    weightKg: number;
    bmi: number;
    activityLevel: string;
    healthGoal: string;
    targetCalories: number;
    targetProteinG: number;
    targetCarbsG: number;
    targetFatG: number;
    healthConditions?: string[];
    dietaryPreferences?: DietaryPreferences;
}

// REMOVED: Ingredient interface - not needed anymore

export interface NutritionInfo {
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    fiberG?: number;
}

export interface Recipe {
    nameVi: string;
    nameEn: string;
    // SIMPLIFIED - removed: descriptionVi, descriptionEn, difficultyLevel, ingredients, instructionsVi, instructionsEn
    prepTimeMinutes: number;
    cookTimeMinutes: number;
    servings: number;
    nutrition: NutritionInfo;
}

export interface Meal {
    mealType: string;
    recipe: Recipe;
}

export interface MealPlan {
    id: string;
    date: string;
    totalCalories: number;
    totalProteinG: number;
    totalCarbsG: number;
    totalFatG: number;
    meals: Meal[];
}

export interface Exercise {
    nameVi: string;
    nameEn: string;
    durationMinutes: number;
    sets: number; // Number of sets
    reps: number; // Repetitions per set
    intensity?: string; // "Low", "Medium", "High"
    caloriesBurned?: number;
    // SIMPLIFIED - removed: instructionsVi, instructionsEn
}

export interface WorkoutPlan {
    id: string;
    date: string;
    workoutType: string;
    durationMinutes: number;
    estimatedCaloriesBurned: number;
    exercises: Exercise[];
}

export interface NutritionCompletionData {
    profile: NutritionProfile;
    mealPlan: MealPlan;
    workoutPlan: WorkoutPlan;
}

export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    suggestions?: Suggestion[];
    questionCount?: number; // Number of questions in current round (1-3)
    currentRound?: number; // Current consultation round (1 or 2)
    maxQuestions?: number; // Maximum questions per round (always 3)
    disease?: DiseaseConclusion; // Disease conclusion (only when analysisComplete = true)
    analysisComplete?: boolean; // Whether the analysis is complete
    canRequestMoreQuestions?: boolean; // Whether user can request more questions (true when round 1 && confidence < 90%)
    fileAttachment?: FileAttachment; // File attachment (for lab results)
    labResult?: LabResultAnalysis; // Lab result analysis

    // Nutrition conversation fields
    nutritionStep?: number; // Current step in nutrition conversation (1-6)
    nutritionTotalSteps?: number; // Total steps in nutrition conversation (always 6)
    nutritionComplete?: boolean; // Whether nutrition conversation is complete
    nutritionData?: NutritionCompletionData; // Nutrition data when conversation is complete
}

// File attachment
export interface FileAttachment {
    fileName: string;
    fileUrl: string;
    fileType: string;
}

// Lab result analysis
export interface LabResultAnalysis {
    normalIndicators: LabIndicator[];
    abnormalIndicators: AbnormalLabIndicator[];
}

// Lab indicator
export interface LabIndicator {
    name: string;
    value: string;
    unit: string;
    referenceRange: string;
}

// Abnormal lab indicator
export interface AbnormalLabIndicator extends LabIndicator {
    explanation: string;
    advice: string;
    possibleDiagnosis: string;
    recommendedSpecialties?: string[];
}

// Disease conclusion with confidence and reasoning
export interface DiseaseConclusion {
    name: string;
    confidence: number; // 0-1
    reasons: string[];
}

export interface Doctor {
    id: string;
    name: string;
    specialtyName: string;
    hospitalName: string;
    rating: number;
    yearOfExperience: number;
    serviceTypeName?: string;
    price?: string;
    avatarUrl?: string;
    serviceOptions?: DoctorServiceOption[];
}

export interface DoctorServiceOption {
    serviceTypeId?: string;
    serviceTypeName: string;
    price?: string;
}

export interface Hospital {
    id: string;
    name: string;
    address: string;
    specialtyId: string[];
    specialtyName: string[];
    imageUrl?: string;
}

export interface Suggestion {
    type: 'doctor' | 'hospital';
    doctor?: Doctor;
    hospital?: Hospital;
}

export enum ConversationType {
    SYMPTOM_ANALYSIS = 0,
    LAB_RESULT_ANALYSIS = 1,
    MEDICAL_IMAGE_ANALYSIS = 2,
}

export interface ChatHistory {
    id: string;
    title: string;
    lastMessage: string;
    lastMessageTime: string;
    avatar: string;
    conversationType: ConversationType;
}

// Lab result analysis response from API
export interface LabResultAnalysisResponse {
    sessionId: string;
    message?: string;
    imageUrl: string;
    extractedText: string;
    normalIndicators: LabIndicator[];
    abnormalIndicators: AbnormalLabIndicator[];
    recommendedDoctors: Doctor[];
    recommendedHospitals: Hospital[];
    disclaimer: string;
    timestamp: string;
}

// Dermatology analysis response from API
export interface DermatologyAnalysisResponse {
    sessionId: string;
    imageUrl: string;
    diagnosis: SkinConditionDiagnosis;
    malignancyRisk: MalignancyAssessment;
    generalAdvice: string[];
    biopsyRecommended: boolean;
    biopsyReason?: string;
    recommendedDoctors: Doctor[];
    recommendedHospitals: Hospital[];
    disclaimer: string;
    timestamp: string;
    message?: string; // Optional formatted message from backend
}

// Skin condition diagnosis
export interface SkinConditionDiagnosis {
    conditionName: string;
    confidence: number; // 0-1
    severity?: string; // Mild, Moderate, Severe
    icdCode?: string;
}

// Malignancy assessment
export interface MalignancyAssessment {
    suspicionLevel: number; // 0-1
    riskCategory: string; // Low, Medium, High
    urgencyLevel?: string; // NORMAL, URGENT
    riskFactors: string[];
}
