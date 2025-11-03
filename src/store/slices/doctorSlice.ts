import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DoctorService } from '@/services/doctor.service';
import { DoctorState, DoctorSearchParams } from '@/types/doctor.types';

// Initial state
const initialState: DoctorState = {
    doctors: [],
    selectedDoctor: null,
    isLoading: false,
    error: null,
    pagination: {
        pageNumber: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0,
    },
    filters: {
        pageNumber: 1,
        pageSize: 10,
    },
};

// Async thunks
export const getDoctorsAsync = createAsyncThunk(
    'doctor/getDoctors',
    async (params: DoctorSearchParams, { rejectWithValue }) => {
        try {
            const response = await DoctorService.getDoctors(params);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to get doctors');
        }
    }
);

export const getActiveDoctorsAsync = createAsyncThunk(
    'doctor/getActiveDoctors',
    async (params: DoctorSearchParams, { rejectWithValue }) => {
        try {
            const response = await DoctorService.getActiveDoctorsForPatients(params);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to get active doctors');
        }
    }
);

export const searchDoctorsAsync = createAsyncThunk(
    'doctor/searchDoctors',
    async (params: DoctorSearchParams, { rejectWithValue }) => {
        try {
            const response = await DoctorService.searchActiveDoctors(params);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to search doctors');
        }
    }
);

export const getDoctorByIdAsync = createAsyncThunk(
    'doctor/getDoctorById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await DoctorService.getDoctorById(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to get doctor');
        }
    }
);

export const getFeaturedDoctorsAsync = createAsyncThunk(
    'doctor/getFeaturedDoctors',
    async (_, { rejectWithValue }) => {
        try {
            const response = await DoctorService.getFeaturedActiveDoctors();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to get featured doctors');
        }
    }
);

export const filterDoctorsAsync = createAsyncThunk(
    'doctor/filterDoctors',
    async (params: DoctorSearchParams, { rejectWithValue }) => {
        try {
            const response = await DoctorService.filterDoctors(params);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to filter doctors');
        }
    }
);

// Doctor slice
const doctorSlice = createSlice({
    name: 'doctor',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedDoctor: (state) => {
            state.selectedDoctor = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                pageNumber: 1,
                pageSize: 10,
            };
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        clearDoctors: (state) => {
            state.doctors = [];
            state.pagination = {
                pageNumber: 1,
                pageSize: 10,
                totalCount: 0,
                totalPages: 0,
            };
        },
    },
    extraReducers: (builder) => {
        builder
            // Get doctors cases
            .addCase(getDoctorsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getDoctorsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.doctors = action.payload.doctors;
                state.pagination = {
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalCount: action.payload.totalCount,
                    totalPages: action.payload.totalPages,
                };
                state.error = null;
            })
            .addCase(getDoctorsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Get active doctors cases
            .addCase(getActiveDoctorsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getActiveDoctorsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.doctors = action.payload.doctors;
                state.pagination = {
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalCount: action.payload.totalCount,
                    totalPages: action.payload.totalPages,
                };
                state.error = null;
            })
            .addCase(getActiveDoctorsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Search doctors cases
            .addCase(searchDoctorsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                // Reset pagination to prevent showing stale totalCount
                state.pagination.totalCount = 0;
                state.pagination.totalPages = 0;
            })
            .addCase(searchDoctorsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.doctors = action.payload.doctors;
                state.pagination = {
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalCount: action.payload.totalCount,
                    totalPages: action.payload.totalPages,
                };
                state.error = null;
            })
            .addCase(searchDoctorsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Get doctor by ID cases
            .addCase(getDoctorByIdAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getDoctorByIdAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedDoctor = action.payload;
                state.error = null;
            })
            .addCase(getDoctorByIdAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Get featured doctors cases
            .addCase(getFeaturedDoctorsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getFeaturedDoctorsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.doctors = action.payload;
                state.error = null;
            })
            .addCase(getFeaturedDoctorsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Filter doctors cases
            .addCase(filterDoctorsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                // Reset pagination to prevent showing stale totalCount
                state.pagination.totalCount = 0;
                state.pagination.totalPages = 0;
            })
            .addCase(filterDoctorsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.doctors = action.payload.doctors;
                state.pagination = {
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalCount: action.payload.totalCount,
                    totalPages: action.payload.totalPages,
                };
                state.error = null;
            })
            .addCase(filterDoctorsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    clearError,
    clearSelectedDoctor,
    setFilters,
    clearFilters,
    setPagination,
    clearDoctors,
} = doctorSlice.actions;

export default doctorSlice.reducer;
