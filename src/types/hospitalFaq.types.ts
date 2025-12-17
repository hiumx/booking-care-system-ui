// Hospital FAQ DTOs
export interface HospitalFaqResponse {
    id: string;
    hospitalId: string;
    question: string;
    answer: string;
    createdBy: string;
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
}
