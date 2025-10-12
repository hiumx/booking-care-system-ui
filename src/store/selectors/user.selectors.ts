import { RootState } from '../index';

// User profile selectors
export const selectUserProfile = (state: RootState) => state.user.profile;
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserError = (state: RootState) => state.user.error;

// Specific user info selectors
export const selectUserFirstName = (state: RootState) => state.user.profile?.firstName || '';
export const selectUserLastName = (state: RootState) => state.user.profile?.lastName || '';
export const selectUserFullName = (state: RootState) => state.user.profile?.fullName || '';
export const selectUserEmail = (state: RootState) => state.user.profile?.email || '';
export const selectUserPhone = (state: RootState) => state.user.profile?.phone || '';
export const selectUserGender = (state: RootState) => state.user.profile?.gender;
export const selectUserDateOfBirth = (state: RootState) => state.user.profile?.dateOfBirth || '';
export const selectUserAddress = (state: RootState) => state.user.profile?.address || '';
export const selectUserAvatarUrl = (state: RootState) => state.user.profile?.avatarUrl;
