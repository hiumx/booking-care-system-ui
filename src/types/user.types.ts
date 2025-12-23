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

// Example mock JSON data for UserProfile
export const mockUserProfile: UserProfile = {
    id: '1',
    accountId: 'acc_123',
    firstName: 'Nguyen',
    lastName: 'Van A',
    fullName: 'Nguyen Van A',
    email: 'nguyenvana@example.com',
    phone: '0901234567',
    avatarUrl: 'https://example.com/avatar.jpg',
    gender: Gender.MALE,
    dateOfBirth: '1990-01-01',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-06-10T12:00:00Z',
};

// User state interface for Redux
export interface UserState {
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null;
    unreadMessageCount: number;
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

// Helper function to get gender translation key
export const getGenderTranslationKey = (gender: Gender | undefined): string => {
    if (gender === undefined || gender === null) return 'gender.notUpdated';

    switch (gender) {
        case Gender.MALE:
            return 'gender.male';
        case Gender.FEMALE:
            return 'gender.female';
        case Gender.OTHER:
            return 'gender.other';
        default:
            return 'gender.notUpdated';
    }
};
