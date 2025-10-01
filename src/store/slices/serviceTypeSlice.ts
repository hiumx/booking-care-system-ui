import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DoctorService } from '@/services/doctor.service';
import { ServiceTypeState } from '@/types/serviceType.types';

const initialState: ServiceTypeState = {
    serviceTypes: [],
    isLoading: false,
    error: null,
};

// Async thunk để get service types
export const getServiceTypesAsync = createAsyncThunk(
    'serviceType/getServiceTypes',
    async (_, { rejectWithValue }) => {
        try {
            const response = await DoctorService.getServiceTypes();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to get service types');
        }
    }
);

const serviceTypeSlice = createSlice({
    name: 'serviceType',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getServiceTypesAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getServiceTypesAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.serviceTypes = action.payload;
                state.error = null;
            })
            .addCase(getServiceTypesAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export default serviceTypeSlice.reducer;
