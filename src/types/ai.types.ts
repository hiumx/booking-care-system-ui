export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    suggestions?: Suggestion[];
    questionCount?: number; // Number of questions asked so far (0-3)
    disease?: DiseaseConclusion; // Disease conclusion (only when analysisComplete = true)
    analysisComplete?: boolean; // Whether the analysis is complete
    fileAttachment?: FileAttachment; // File attachment (for lab results)
    labResult?: LabResultAnalysis; // Lab result analysis
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

export interface ChatHistory {
    id: string;
    title: string;
    lastMessage: string;
    lastMessageTime: string;
    avatar: string;
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
