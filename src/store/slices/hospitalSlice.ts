import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HospitalService } from '@/services/hospital.service';
import { HospitalState, HospitalFilterRequest, HospitalSearchParams } from '@/types/hospital.types';

// Initial state
const initialState: HospitalState = {
    hospitals: [],
    selectedHospital: null,
    isLoading: false,
    error: null,
    pagination: {
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0,
    },
    filters: {
        page: 1,
        pageSize: 10,
    },
};

// Async thunks
export const getHospitalsAsync = createAsyncThunk(
    'hospital/getHospitals',
    async (params: HospitalSearchParams, { rejectWithValue }) => {
        try {
            const filter: HospitalFilterRequest = {
                ...params,
                page: params.page || 1,
                pageSize: params.pageSize || 10,
            };
            const response = await HospitalService.getHospitals(filter);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to get hospitals');
        }
    }
);

export const getHospitalByIdAsync = createAsyncThunk(
    'hospital/getHospitalById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await HospitalService.getHospitalById(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to get hospital');
        }
    }
);

// Hospital slice
const hospitalSlice = createSlice({
    name: 'hospital',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedHospital: (state) => {
            state.selectedHospital = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                page: 1,
                pageSize: 10,
            };
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        clearHospitals: (state) => {
            state.hospitals = [];
            state.pagination = {
                page: 1,
                pageSize: 10,
                totalCount: 0,
                totalPages: 0,
            };
        },
    },
    extraReducers: (builder) => {
        builder
            // Get hospitals cases
            .addCase(getHospitalsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getHospitalsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hospitals = action.payload.hospitals;
                state.pagination = {
                    page: action.payload.page,
                    pageSize: action.payload.pageSize,
                    totalCount: action.payload.totalCount,
                    totalPages: action.payload.totalPages,
                };
                state.error = null;
            })
            .addCase(getHospitalsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Get hospital by ID cases
            .addCase(getHospitalByIdAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getHospitalByIdAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedHospital = action.payload;
                state.error = null;
            })
            .addCase(getHospitalByIdAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    clearError,
    clearSelectedHospital,
    setFilters,
    clearFilters,
    setPagination,
    clearHospitals,
} = hospitalSlice.actions;

export default hospitalSlice.reducer;
