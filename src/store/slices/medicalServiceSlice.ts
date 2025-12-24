import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MedicalServiceService } from '@/services/medicalService.service';
import { MedicalServiceCategoriesService } from '@/services/medicalServiceCategories.service';
import {
    ServiceCategoryState,
    MedicalServiceState,
    ServiceCategoryQueryParams,
    MedicalServiceQueryParams,
    ServiceWithHospitalQueryParams,
    ServiceWithHospitalResponse,
} from '@/types/medicalService.types';

// Initial state for service categories
const initialServiceCategoryState: ServiceCategoryState = {
    serviceCategories: [],
    parentServiceCategories: [],
    selectedServiceCategory: null,
    servicesWithHospital: null,
    selectedServiceWithHospital: null, // Selected service for booking
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

// Initial state for medical services
const initialMedicalServiceState: MedicalServiceState = {
    medicalServices: [],
    selectedMedicalService: null,
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

// Combined initial state
const initialState = {
    serviceCategories: initialServiceCategoryState,
    medicalServices: initialMedicalServiceState,
};

// Async thunks for Service Categories
export const getParentServiceCategoriesAsync = createAsyncThunk(
    'medicalService/getParentServiceCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await MedicalServiceCategoriesService.getParentServiceCategories();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to get parent service categories');
        }
    }
);

export const getServiceCategoriesAsync = createAsyncThunk(
    'medicalService/getServiceCategories',
    async (params: ServiceCategoryQueryParams, { rejectWithValue }) => {
        try {
            const response = await MedicalServiceCategoriesService.getServiceCategories(params);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to get service categories');
        }
    }
);

export const getServiceCategoryByIdAsync = createAsyncThunk(
    'medicalService/getServiceCategoryById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await MedicalServiceCategoriesService.getServiceCategoryById(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to get service category');
        }
    }
);

export const getServicesWithHospitalAsync = createAsyncThunk(
    'medicalService/getServicesWithHospital',
    async (
        { categoryId, params }: { categoryId: string; params?: ServiceWithHospitalQueryParams },
        { rejectWithValue }
    ) => {
        try {
            const response = await MedicalServiceCategoriesService.getServicesWithHospital(
                categoryId,
                params
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch services with hospital');
        }
    }
);

// Async thunks for Medical Services
export const getMedicalServicesAsync = createAsyncThunk(
    'medicalService/getMedicalServices',
    async (params: MedicalServiceQueryParams, { rejectWithValue }) => {
        try {
            const response = await MedicalServiceService.getMedicalServices(params);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to get medical services');
        }
    }
);

export const getMedicalServiceByIdAsync = createAsyncThunk(
    'medicalService/getMedicalServiceById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await MedicalServiceService.getMedicalServiceById(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to get medical service');
        }
    }
);

// Async thunk to get service with hospital info by ID (for booking flow)
export const getServiceWithHospitalByIdAsync = createAsyncThunk(
    'medicalService/getServiceWithHospitalById',
    async (serviceId: string, { rejectWithValue }) => {
        try {
            const response =
                await MedicalServiceCategoriesService.getServiceWithHospitalById(serviceId);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to get service with hospital');
        }
    }
);

// Medical Service Slice
const medicalServiceSlice = createSlice({
    name: 'medicalService',
    initialState,
    reducers: {
        // Service Category reducers
        clearServiceCategoryError: (state) => {
            state.serviceCategories.error = null;
        },
        clearSelectedServiceCategory: (state) => {
            state.serviceCategories.selectedServiceCategory = null;
        },
        setServiceCategoryFilters: (state, action) => {
            state.serviceCategories.filters = {
                ...state.serviceCategories.filters,
                ...action.payload,
            };
        },
        clearServiceCategoryFilters: (state) => {
            state.serviceCategories.filters = {
                page: 1,
                pageSize: 10,
            };
        },
        clearServiceCategories: (state) => {
            state.serviceCategories.serviceCategories = [];
            state.serviceCategories.parentServiceCategories = [];
            state.serviceCategories.pagination = {
                page: 1,
                pageSize: 10,
                totalCount: 0,
                totalPages: 0,
            };
        },
        // Set selected service with hospital for booking
        setSelectedServiceWithHospital: (
            state,
            action: { payload: ServiceWithHospitalResponse | null }
        ) => {
            state.serviceCategories.selectedServiceWithHospital = action.payload;
        },
        clearSelectedServiceWithHospital: (state) => {
            state.serviceCategories.selectedServiceWithHospital = null;
        },
        // Medical Service reducers
        clearMedicalServiceError: (state) => {
            state.medicalServices.error = null;
        },
        clearSelectedMedicalService: (state) => {
            state.medicalServices.selectedMedicalService = null;
        },
        setMedicalServiceFilters: (state, action) => {
            state.medicalServices.filters = { ...state.medicalServices.filters, ...action.payload };
        },
        clearMedicalServiceFilters: (state) => {
            state.medicalServices.filters = {
                page: 1,
                pageSize: 10,
            };
        },
        clearMedicalServices: (state) => {
            state.medicalServices.medicalServices = [];
            state.medicalServices.pagination = {
                page: 1,
                pageSize: 10,
                totalCount: 0,
                totalPages: 0,
            };
        },
    },
    extraReducers: (builder) => {
        builder
            // Get parent service categories cases
            .addCase(getParentServiceCategoriesAsync.pending, (state) => {
                state.serviceCategories.isLoading = true;
                state.serviceCategories.error = null;
            })
            .addCase(getParentServiceCategoriesAsync.fulfilled, (state, action) => {
                state.serviceCategories.isLoading = false;
                state.serviceCategories.parentServiceCategories = action.payload;
                state.serviceCategories.error = null;
            })
            .addCase(getParentServiceCategoriesAsync.rejected, (state, action) => {
                state.serviceCategories.isLoading = false;
                state.serviceCategories.error = action.payload as string;
            })
            // Get service categories cases
            .addCase(getServiceCategoriesAsync.pending, (state) => {
                state.serviceCategories.isLoading = true;
                state.serviceCategories.error = null;
            })
            .addCase(getServiceCategoriesAsync.fulfilled, (state, action) => {
                state.serviceCategories.isLoading = false;
                state.serviceCategories.serviceCategories = action.payload.serviceCategories;
                state.serviceCategories.pagination = {
                    page: action.payload.page,
                    pageSize: action.payload.pageSize,
                    totalCount: action.payload.totalCount,
                    totalPages: action.payload.totalPages,
                };
                state.serviceCategories.error = null;
            })
            .addCase(getServiceCategoriesAsync.rejected, (state, action) => {
                state.serviceCategories.isLoading = false;
                state.serviceCategories.error = action.payload as string;
            })
            // Get service category by ID cases
            .addCase(getServiceCategoryByIdAsync.pending, (state) => {
                state.serviceCategories.isLoading = true;
                state.serviceCategories.error = null;
            })
            .addCase(getServiceCategoryByIdAsync.fulfilled, (state, action) => {
                state.serviceCategories.isLoading = false;
                state.serviceCategories.selectedServiceCategory = action.payload;
                state.serviceCategories.error = null;
            })
            .addCase(getServiceCategoryByIdAsync.rejected, (state, action) => {
                state.serviceCategories.isLoading = false;
                state.serviceCategories.error = action.payload as string;
            })
            // Get services with hospital cases
            .addCase(getServicesWithHospitalAsync.pending, (state) => {
                state.serviceCategories.isLoading = true;
                state.serviceCategories.error = null;
            })
            .addCase(getServicesWithHospitalAsync.fulfilled, (state, action) => {
                state.serviceCategories.isLoading = false;
                state.serviceCategories.servicesWithHospital = action.payload;
                state.serviceCategories.error = null;
            })
            .addCase(getServicesWithHospitalAsync.rejected, (state, action) => {
                state.serviceCategories.isLoading = false;
                state.serviceCategories.error = action.payload as string;
            })
            // Get medical services cases
            .addCase(getMedicalServicesAsync.pending, (state) => {
                state.medicalServices.isLoading = true;
                state.medicalServices.error = null;
            })
            .addCase(getMedicalServicesAsync.fulfilled, (state, action) => {
                state.medicalServices.isLoading = false;
                state.medicalServices.medicalServices = action.payload.medicalServices;
                state.medicalServices.pagination = {
                    page: action.payload.page,
                    pageSize: action.payload.pageSize,
                    totalCount: action.payload.totalCount,
                    totalPages: action.payload.totalPages,
                };
                state.medicalServices.error = null;
            })
            .addCase(getMedicalServicesAsync.rejected, (state, action) => {
                state.medicalServices.isLoading = false;
                state.medicalServices.error = action.payload as string;
            })
            // Get medical service by ID cases
            .addCase(getMedicalServiceByIdAsync.pending, (state) => {
                state.medicalServices.isLoading = true;
                state.medicalServices.error = null;
            })
            .addCase(getMedicalServiceByIdAsync.fulfilled, (state, action) => {
                state.medicalServices.isLoading = false;
                state.medicalServices.selectedMedicalService = action.payload;
                state.medicalServices.error = null;
            })
            .addCase(getMedicalServiceByIdAsync.rejected, (state, action) => {
                state.medicalServices.isLoading = false;
                state.medicalServices.error = action.payload as string;
            })
            // Get service with hospital by ID cases (for booking flow)
            .addCase(getServiceWithHospitalByIdAsync.pending, (state) => {
                state.serviceCategories.isLoading = true;
                state.serviceCategories.error = null;
            })
            .addCase(getServiceWithHospitalByIdAsync.fulfilled, (state, action) => {
                state.serviceCategories.isLoading = false;
                state.serviceCategories.selectedServiceWithHospital = action.payload;
                state.serviceCategories.error = null;
            })
            .addCase(getServiceWithHospitalByIdAsync.rejected, (state, action) => {
                state.serviceCategories.isLoading = false;
                state.serviceCategories.error = action.payload as string;
            });
    },
});

export const {
    // Service Category actions
    clearServiceCategoryError,
    clearSelectedServiceCategory,
    setServiceCategoryFilters,
    clearServiceCategoryFilters,
    clearServiceCategories,
    setSelectedServiceWithHospital,
    clearSelectedServiceWithHospital,
    // Medical Service actions
    clearMedicalServiceError,
    clearSelectedMedicalService,
    setMedicalServiceFilters,
    clearMedicalServiceFilters,
    clearMedicalServices,
} = medicalServiceSlice.actions;

export default medicalServiceSlice.reducer;
