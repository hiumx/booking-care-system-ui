import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
    Discount,
    DiscountQueryParams,
    DiscountValidationResult,
} from '../../types/discount.types';
import { DiscountService } from '../../services/discount.service';

// State interface
export interface DiscountState {
    discounts: Discount[];
    currentDiscount: Discount | null;
    validationResult: DiscountValidationResult | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    loading: {
        discounts: boolean;
        currentDiscount: boolean;
        validation: boolean;
        stats: boolean;
        create: boolean;
        update: boolean;
        delete: boolean;
        bulkActions: boolean;
    };
    error: string | null;
    filters: DiscountQueryParams;
    appliedDiscount: {
        code: string;
        discount: Discount;
        validationResult: DiscountValidationResult;
    } | null;
}

// Initial state
const initialState: DiscountState = {
    discounts: [],
    currentDiscount: null,
    validationResult: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    },
    loading: {
        discounts: false,
        currentDiscount: false,
        validation: false,
        stats: false,
        create: false,
        update: false,
        delete: false,
        bulkActions: false,
    },
    error: null,
    filters: {},
    appliedDiscount: null,
};

// Async thunks
export const fetchDiscountByCode = createAsyncThunk(
    'discount/fetchDiscountByCode',
    async (code: string) => {
        const response = await DiscountService.getDiscountByCode(code);
        return response;
    }
);

export const validateDiscountCode = createAsyncThunk(
    'discount/validateDiscountCode',
    async ({
        code,
        context,
    }: {
        code: string;
        context: {
            hospitalId: string;
            totalAmount: number;
        };
    }) => {
        const result = await DiscountService.validateDiscount(code, context);
        return { code, result };
    }
);

export const fetchActiveDiscounts = createAsyncThunk(
    'discount/fetchActiveDiscounts',
    async (hospitalId: string) => {
        const discounts = await DiscountService.getActiveDiscounts(hospitalId);
        return discounts;
    }
);

export const calculateDiscountAmount = createAsyncThunk(
    'discount/calculateDiscountAmount',
    async (request: { code: string; originalAmount: number; hospitalId: string }) => {
        const result = await DiscountService.calculateDiscountAmount(request);
        return result;
    }
);

// Discount slice
const discountSlice = createSlice({
    name: 'discount',
    initialState,
    reducers: {
        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Set filters
        setFilters: (state, action: PayloadAction<DiscountQueryParams>) => {
            state.filters = action.payload;
        },

        // Clear filters
        clearFilters: (state) => {
            state.filters = {};
        },

        // Set current discount
        setCurrentDiscount: (state, action: PayloadAction<Discount | null>) => {
            state.currentDiscount = action.payload;
        },

        // Clear current discount
        clearCurrentDiscount: (state) => {
            state.currentDiscount = null;
        },

        // Clear validation result
        clearValidationResult: (state) => {
            state.validationResult = null;
        },

        // Set applied discount
        setAppliedDiscount: (
            state,
            action: PayloadAction<{
                code: string;
                discount: Discount;
                validationResult: DiscountValidationResult;
            } | null>
        ) => {
            state.appliedDiscount = action.payload;
        },

        // Clear applied discount
        clearAppliedDiscount: (state) => {
            state.appliedDiscount = null;
        },

        // Update discount in list
        updateDiscountInList: (state, action: PayloadAction<Discount>) => {
            const index = state.discounts.findIndex((d) => d.id === action.payload.id);
            if (index !== -1) {
                state.discounts[index] = action.payload;
            }
        },

        // Remove discount from list
        removeDiscountFromList: (state, action: PayloadAction<string>) => {
            state.discounts = state.discounts.filter((d) => d.id !== action.payload);
        },

        // Add discount to list
        addDiscountToList: (state, action: PayloadAction<Discount>) => {
            state.discounts.unshift(action.payload);
            state.pagination.total += 1;
        },
    },
    extraReducers: (builder) => {
        // Fetch discount by code
        builder
            .addCase(fetchDiscountByCode.pending, (state) => {
                state.loading.currentDiscount = true;
                state.error = null;
            })
            .addCase(fetchDiscountByCode.fulfilled, (state, action) => {
                state.loading.currentDiscount = false;
                state.currentDiscount = action.payload;
            })
            .addCase(fetchDiscountByCode.rejected, (state, action) => {
                state.loading.currentDiscount = false;
                state.error = action.error.message || 'Failed to fetch discount by code';
            });

        // Validate discount code
        builder
            .addCase(validateDiscountCode.pending, (state) => {
                state.loading.validation = true;
                state.error = null;
            })
            .addCase(validateDiscountCode.fulfilled, (state, action) => {
                state.loading.validation = false;
                state.validationResult = action.payload.result;
                // Store applied discount if validation was successful
                if (action.payload.result.isValid && action.payload.result.discount) {
                    state.appliedDiscount = {
                        code: action.payload.code,
                        discount: action.payload.result.discount,
                        validationResult: action.payload.result,
                    };
                }
            })
            .addCase(validateDiscountCode.rejected, (state, action) => {
                state.loading.validation = false;
                state.error = action.error.message || 'Failed to validate discount code';
                state.validationResult = null;
            });

        // Fetch active discounts
        builder
            .addCase(fetchActiveDiscounts.pending, (state) => {
                state.loading.discounts = true;
                state.error = null;
            })
            .addCase(fetchActiveDiscounts.fulfilled, (state, action) => {
                state.loading.discounts = false;
                state.discounts = action.payload;
            })
            .addCase(fetchActiveDiscounts.rejected, (state, action) => {
                state.loading.discounts = false;
                state.error = action.error.message || 'Failed to fetch active discounts';
            });

        // Calculate discount amount
        builder
            .addCase(calculateDiscountAmount.pending, (state) => {
                state.loading.validation = true;
                state.error = null;
            })
            .addCase(calculateDiscountAmount.fulfilled, (state) => {
                state.loading.validation = false;
            })
            .addCase(calculateDiscountAmount.rejected, (state, action) => {
                state.loading.validation = false;
                state.error = action.error.message || 'Failed to calculate discount amount';
            });
    },
});

// Export actions
export const {
    clearError,
    setFilters,
    clearFilters,
    setCurrentDiscount,
    clearCurrentDiscount,
    clearValidationResult,
    setAppliedDiscount,
    clearAppliedDiscount,
    updateDiscountInList,
    removeDiscountFromList,
    addDiscountToList,
} = discountSlice.actions;

// Export reducer
export default discountSlice.reducer;
