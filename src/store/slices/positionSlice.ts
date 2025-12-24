import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DoctorService } from '@/services/doctor.service';
import { PositionSimpleResponse } from '@/types/simple.types';

export interface PositionState {
    positions: PositionSimpleResponse[];
    isLoading: boolean;
    error: string | null;
}

const initialState: PositionState = {
    positions: [],
    isLoading: false,
    error: null,
};

// Async thunk để get positions
export const getPositionsAsync = createAsyncThunk(
    'position/getPositions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await DoctorService.getPositions();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to get positions');
        }
    }
);

const positionSlice = createSlice({
    name: 'position',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPositionsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getPositionsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.positions = action.payload;
                state.error = null;
            })
            .addCase(getPositionsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export default positionSlice.reducer;
