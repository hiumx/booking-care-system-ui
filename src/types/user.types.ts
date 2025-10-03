import { Gender } from '@/enums/common.enums';

// User profile interface
export interface UserProfile {
    id: string;
    accountId: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone: string;
    avatarUrl?: string;
    gender: Gender;
    dateOfBirth: string;
    address: string;
    createdAt: string;
    updatedAt: string;
}

// User state interface for Redux
export interface UserState {
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null;
}

// Update user request interface
export interface UpdateUserRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    gender?: Gender;
    dateOfBirth?: string;
    address?: string;
    avatarUrl?: string;
}

// Helper function to get Vietnamese gender text
export const getGenderText = (gender: Gender | undefined): string => {
    if (gender === undefined || gender === null) return 'Chưa cập nhật';

    switch (gender) {
        case Gender.MALE:
            return 'Nam';
        case Gender.FEMALE:
            return 'Nữ';
        case Gender.OTHER:
            return 'Khác';
        default:
            return 'Chưa cập nhật';
    }
};
