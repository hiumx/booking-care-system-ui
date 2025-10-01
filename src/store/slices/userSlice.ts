import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserService } from '@/services/user.service';
import { UserProfile, UserState, UpdateUserRequest } from '@/types/user.types';

const initialState: UserState = {
    profile: null,
    isLoading: false,
    error: null,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
    'user/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await UserService.getCurrentUserProfile();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.message || 'Failed to fetch user profile');
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'user/updateProfile',
    async (updateData: UpdateUserRequest, { rejectWithValue }) => {
        try {
            const response = await UserService.updateUserProfile(updateData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.message || 'Failed to update user profile');
        }
    }
);

// Slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUserProfile: (state) => {
            state.profile = null;
            state.error = null;
        },
        clearUserError: (state) => {
            state.error = null;
        },
        setUserProfile: (state, action: PayloadAction<UserProfile>) => {
            state.profile = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch user profile
            .addCase(fetchUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload;
                state.error = null;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update user profile
            .addCase(updateUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload;
                state.error = null;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearUserProfile, clearUserError, setUserProfile } = userSlice.actions;

export default userSlice.reducer;
