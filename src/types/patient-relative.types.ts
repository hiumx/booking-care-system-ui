// ============================================
// Patient Relative Types
// ============================================

import { Gender } from '@/enums/common.enums';

export enum Relationship {
    PARENT = 1,
    CHILD = 2,
    SPOUSE = 3,
    SIBLING = 4,
    GRANDPARENT = 5,
    GRANDCHILD = 6,
    OTHER = 99,
}

export const RelationshipLabels: Record<Relationship, string> = {
    [Relationship.PARENT]: 'Cha/Mẹ',
    [Relationship.CHILD]: 'Con',
    [Relationship.SPOUSE]: 'Vợ/Chồng',
    [Relationship.SIBLING]: 'Anh/Chị/Em',
    [Relationship.GRANDPARENT]: 'Ông/Bà',
    [Relationship.GRANDCHILD]: 'Cháu',
    [Relationship.OTHER]: 'Khác',
};

// Full response from API
export interface PatientRelativeResponse {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    fullName: string;
    gender: Gender;
    genderDisplay: string;
    dateOfBirth: string;
    age: number;
    phone?: string;
    relationship: Relationship;
    relationshipDisplay: string;
    healthInsuranceNumber?: string;
    identityNumber?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

// Lightweight response for dropdown/selection
export interface PatientRelativeBasicResponse {
    id: string;
    fullName: string;
    relationship: Relationship;
    relationshipDisplay: string;
    dateOfBirth: string;
    age: number;
}

// Request to create a new relative
export interface CreatePatientRelativeRequest {
    firstName: string;
    lastName: string;
    gender: Gender;
    dateOfBirth: string;
    phone?: string;
    relationship: Relationship;
    healthInsuranceNumber?: string;
    identityNumber?: string;
    notes?: string;
}

// Request to update an existing relative
export interface UpdatePatientRelativeRequest {
    firstName: string;
    lastName: string;
    gender: Gender;
    dateOfBirth: string;
    phone?: string;
    relationship: Relationship;
    healthInsuranceNumber?: string;
    identityNumber?: string;
    notes?: string;
}
