import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserService } from '@/services/user.service';
import { ChatService } from '@/services/chat.service';
import { UserProfile, UserState, UpdateUserRequest } from '@/types/user.types';

const initialState: UserState = {
    profile: null,
    isLoading: false,
    error: null,
    unreadMessageCount: 0,
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

export const fetchUnreadMessageCount = createAsyncThunk(
    'user/fetchUnreadMessageCount',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await ChatService.getTotalUnreadCount(userId);
            return response.data.totalUnreadCount;
        } catch (error: any) {
            return rejectWithValue(error?.message || 'Failed to fetch unread message count');
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
            state.unreadMessageCount = 0;
        },
        clearUserError: (state) => {
            state.error = null;
        },
        setUserProfile: (state, action: PayloadAction<UserProfile>) => {
            state.profile = action.payload;
        },
        setUnreadMessageCount: (state, action: PayloadAction<number>) => {
            state.unreadMessageCount = action.payload;
        },
        incrementUnreadMessageCount: (state) => {
            state.unreadMessageCount += 1;
        },
        decrementUnreadMessageCount: (state, action: PayloadAction<number>) => {
            state.unreadMessageCount = Math.max(0, state.unreadMessageCount - action.payload);
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
            })
            // Fetch unread message count
            .addCase(fetchUnreadMessageCount.fulfilled, (state, action) => {
                state.unreadMessageCount = action.payload;
            })
            .addCase(fetchUnreadMessageCount.rejected, (_state, action) => {
                console.error('Failed to fetch unread message count:', action.payload);
            });
    },
});

export const {
    clearUserProfile,
    clearUserError,
    setUserProfile,
    setUnreadMessageCount,
    incrementUnreadMessageCount,
    decrementUnreadMessageCount,
} = userSlice.actions;

export default userSlice.reducer;
