import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DoctorService } from '@/services/doctor.service';
import { SpecialtySimpleResponse } from '@/types/simple.types';

export interface SpecialtyState {
    specialties: SpecialtySimpleResponse[];
    isLoading: boolean;
    error: string | null;
}

const initialState: SpecialtyState = {
    specialties: [],
    isLoading: false,
    error: null,
};

// Async thunk để get specialties
export const getSpecialtiesAsync = createAsyncThunk(
    'specialty/getSpecialties',
    async (_, { rejectWithValue }) => {
        try {
            const response = await DoctorService.getSpecialties();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to get specialties');
        }
    }
);

const specialtySlice = createSlice({
    name: 'specialty',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSpecialtiesAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getSpecialtiesAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.specialties = action.payload;
                state.error = null;
            })
            .addCase(getSpecialtiesAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export default specialtySlice.reducer;
