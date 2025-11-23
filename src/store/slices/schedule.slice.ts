import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
    DoctorDailySchedule,
    AvailableSlot,
    GetDoctorScheduleRequest,
    GetDoctorAvailableSlotsRequest,
    ScheduleCategory,
    GetServiceMedicalScheduleRequest,
    GetServiceMedicalAvailableSlotsRequest,
} from '../../types/schedule.types';
import { SchedulePatterns } from '../../enums/schedule.enums';
import { ScheduleService } from '../../services/schedule.service';

// State interface
export interface ScheduleState {
    // Current doctor schedule data
    currentSchedule: DoctorDailySchedule | null;
    availableSlots: AvailableSlot[];
    scheduleCategories: ScheduleCategory[];

    // Selected values
    selectedDate: string | null; // ISO date string
    selectedDoctorId: string | null;
    selectedMedicalServiceId: string | null;
    selectedSlot: AvailableSlot | null; // Keep for backward compatibility
    selectedSlots: AvailableSlot[]; // Multiple slots support

    // Loading states
    loading: {
        schedule: boolean;
        availableSlots: boolean;
    };

    // Error state
    error: string | null;

    // UI state
    isDateSelected: boolean;
    isSlotSelected: boolean;
}

// Initial state
const initialState: ScheduleState = {
    currentSchedule: null,
    availableSlots: [],
    scheduleCategories: [],
    selectedDate: null,
    selectedDoctorId: null,
    selectedMedicalServiceId: null,
    selectedSlot: null,
    selectedSlots: [], // Initialize empty array
    loading: {
        schedule: false,
        availableSlots: false,
    },
    error: null,
    isDateSelected: false,
    isSlotSelected: false,
};

// Async thunks
export const fetchDoctorSchedule = createAsyncThunk(
    'schedule/fetchDoctorSchedule',
    async (request: GetDoctorScheduleRequest, { rejectWithValue }) => {
        try {
            const response = await ScheduleService.getDoctorSchedule(request);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch doctor schedule');
        }
    }
);

export const fetchDoctorAvailableSlots = createAsyncThunk(
    'schedule/fetchDoctorAvailableSlots',
    async (request: GetDoctorAvailableSlotsRequest, { rejectWithValue }) => {
        try {
            const response = await ScheduleService.getDoctorAvailableSlots(request);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch available slots');
        }
    }
);

// Combined action to fetch both schedule and slots
export const fetchDoctorScheduleWithSlots = createAsyncThunk(
    'schedule/fetchDoctorScheduleWithSlots',
    async (request: GetDoctorScheduleRequest, { dispatch, rejectWithValue }) => {
        try {
            // Fetch schedule first
            const scheduleResponse = await dispatch(fetchDoctorSchedule(request)).unwrap();

            // Then fetch available slots
            const slotsResponse = await dispatch(fetchDoctorAvailableSlots(request)).unwrap();

            return {
                schedule: scheduleResponse,
                slots: slotsResponse,
            };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch doctor schedule and slots');
        }
    }
);

// Service Medical async thunks
export const fetchServiceMedicalSchedule = createAsyncThunk(
    'schedule/fetchServiceMedicalSchedule',
    async (request: GetServiceMedicalScheduleRequest, { rejectWithValue }) => {
        try {
            const response = await ScheduleService.getServiceMedicalSchedule(request);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch service medical schedule');
        }
    }
);

export const fetchServiceMedicalAvailableSlots = createAsyncThunk(
    'schedule/fetchServiceMedicalAvailableSlots',
    async (request: GetServiceMedicalAvailableSlotsRequest, { rejectWithValue }) => {
        try {
            const response = await ScheduleService.getServiceMedicalAvailableSlots(request);
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.message || 'Failed to fetch service medical available slots'
            );
        }
    }
);

// Helper function to group slots into categories
const groupSlotsIntoCategories = (slots: AvailableSlot[]): ScheduleCategory[] => {
    const grouped = ScheduleService.groupSlotsByPeriod(slots);

    const categories: ScheduleCategory[] = [];

    if (grouped.morning.length > 0) {
        const morningCategory = {
            title: 'Buổi sáng (8:00 - 12:00)',
            pattern: SchedulePatterns.MORNING,
            timeSlots: grouped.morning.map((slot) => ({
                startTime: slot.startTime,
                endTime: slot.endTime,
            })),
        };
        categories.push(morningCategory);
    }

    if (grouped.afternoon.length > 0) {
        const afternoonCategory = {
            title: 'Buổi chiều (12:00 - 17:00)',
            pattern: SchedulePatterns.AFTERNOON,
            timeSlots: grouped.afternoon.map((slot) => ({
                startTime: slot.startTime,
                endTime: slot.endTime,
            })),
        };
        categories.push(afternoonCategory);
    }

    if (grouped.evening.length > 0) {
        const eveningCategory = {
            title: 'Buổi tối (17:00 - 21:00)',
            pattern: SchedulePatterns.EVENING,
            timeSlots: grouped.evening.map((slot) => ({
                startTime: slot.startTime,
                endTime: slot.endTime,
            })),
        };
        categories.push(eveningCategory);
    }
    return categories;
};

// Schedule slice
const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        // Set selected date
        setSelectedDate: (state, action: PayloadAction<string>) => {
            state.selectedDate = action.payload;
            state.isDateSelected = true;
            // Reset slot selection when date changes
            state.selectedSlot = null;
            state.selectedSlots = [];
            state.isSlotSelected = false;
        },

        // Set selected doctor
        setSelectedDoctor: (state, action: PayloadAction<string>) => {
            state.selectedDoctorId = action.payload;
            // Reset schedule data when doctor changes
            state.currentSchedule = null;
            state.availableSlots = [];
            state.scheduleCategories = [];
            state.selectedSlot = null;
            state.selectedSlots = [];
            state.isSlotSelected = false;
        },

        // Set selected medical service
        setSelectedMedicalService: (state, action: PayloadAction<string>) => {
            state.selectedMedicalServiceId = action.payload;
            // Reset schedule data when service changes
            state.currentSchedule = null;
            state.availableSlots = [];
            state.scheduleCategories = [];
            state.selectedSlot = null;
            state.selectedSlots = []; // Clear multiple slots too
            state.isSlotSelected = false;
        },

        // Set selected slot (single - for backward compatibility)
        setSelectedSlot: (state, action: PayloadAction<AvailableSlot>) => {
            state.selectedSlot = action.payload;
            state.selectedSlots = [action.payload]; // Also update array
            state.isSlotSelected = true;
        },

        // Toggle slot selection (single slot only - replaces previous selection)
        toggleSlotSelection: (state, action: PayloadAction<AvailableSlot>) => {
            const slot = action.payload;

            // Check if clicking the same slot that's already selected
            const isSameSlot =
                state.selectedSlot !== null &&
                state.selectedSlot.startTime === slot.startTime &&
                state.selectedSlot.endTime === slot.endTime;

            if (isSameSlot) {
                // Unselect if clicking the same slot
                state.selectedSlots = [];
                state.selectedSlot = null;
                state.isSlotSelected = false;
            } else {
                // Replace with new slot (only allow 1 slot per booking)
                state.selectedSlots = [slot];
                state.selectedSlot = slot;
                state.isSlotSelected = true;
            }
        },

        // Set multiple slots at once
        setSelectedSlots: (state, action: PayloadAction<AvailableSlot[]>) => {
            state.selectedSlots = action.payload;
            if (action.payload.length > 0) {
                state.selectedSlot = action.payload[action.payload.length - 1];
                state.isSlotSelected = true;
            } else {
                state.selectedSlot = null;
                state.isSlotSelected = false;
            }
        },

        // Clear selected slot
        clearSelectedSlot: (state) => {
            state.selectedSlot = null;
            state.selectedSlots = [];
            state.isSlotSelected = false;
        },

        // Clear all selections
        clearSelections: (state) => {
            state.selectedDate = null;
            state.selectedDoctorId = null;
            state.selectedMedicalServiceId = null;
            state.selectedSlot = null;
            state.selectedSlots = [];
            state.isDateSelected = false;
            state.isSlotSelected = false;
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Reset schedule state
        resetScheduleState: (state) => {
            Object.assign(state, initialState);
        },
    },
    extraReducers: (builder) => {
        // Fetch doctor schedule
        builder
            .addCase(fetchDoctorSchedule.pending, (state) => {
                state.loading.schedule = true;
                state.error = null;
            })
            .addCase(fetchDoctorSchedule.fulfilled, (state, action) => {
                state.loading.schedule = false;
                state.currentSchedule = action.payload.data;
                state.error = null;
            })
            .addCase(fetchDoctorSchedule.rejected, (state, action) => {
                state.loading.schedule = false;
                state.error = action.payload as string;
                state.currentSchedule = null;
            });

        // Fetch available slots
        builder
            .addCase(fetchDoctorAvailableSlots.pending, (state) => {
                state.loading.availableSlots = true;
                state.error = null;
            })
            .addCase(fetchDoctorAvailableSlots.fulfilled, (state, action) => {
                state.loading.availableSlots = false;
                state.availableSlots = action.payload.data;
                state.scheduleCategories = groupSlotsIntoCategories(action.payload.data);
                state.error = null;
            })
            .addCase(fetchDoctorAvailableSlots.rejected, (state, action) => {
                state.loading.availableSlots = false;
                state.error = action.payload as string;
                state.availableSlots = [];
                state.scheduleCategories = [];
            });

        // Fetch schedule with slots
        builder
            .addCase(fetchDoctorScheduleWithSlots.pending, (state) => {
                state.loading.schedule = true;
                state.loading.availableSlots = true;
                state.error = null;
            })
            .addCase(fetchDoctorScheduleWithSlots.fulfilled, (state) => {
                state.loading.schedule = false;
                state.loading.availableSlots = false;
                state.error = null;
            })
            .addCase(fetchDoctorScheduleWithSlots.rejected, (state, action) => {
                state.loading.schedule = false;
                state.loading.availableSlots = false;
                state.error = action.payload as string;
            });

        // Fetch service medical schedule
        builder
            .addCase(fetchServiceMedicalSchedule.pending, (state) => {
                state.loading.schedule = true;
                state.error = null;
            })
            .addCase(fetchServiceMedicalSchedule.fulfilled, (state, action) => {
                state.loading.schedule = false;
                state.currentSchedule = action.payload.data as any; // Will be service medical schedule
                state.error = null;
            })
            .addCase(fetchServiceMedicalSchedule.rejected, (state, action) => {
                state.loading.schedule = false;
                state.error = action.payload as string;
                state.currentSchedule = null;
            });

        // Fetch service medical available slots
        builder
            .addCase(fetchServiceMedicalAvailableSlots.pending, (state) => {
                state.loading.availableSlots = true;
                state.error = null;
            })
            .addCase(fetchServiceMedicalAvailableSlots.fulfilled, (state, action) => {
                state.loading.availableSlots = false;
                state.availableSlots = action.payload.data;
                state.scheduleCategories = groupSlotsIntoCategories(action.payload.data);
                state.error = null;
            })
            .addCase(fetchServiceMedicalAvailableSlots.rejected, (state, action) => {
                state.loading.availableSlots = false;
                state.error = action.payload as string;
                state.availableSlots = [];
                state.scheduleCategories = [];
            });
    },
});

// Export actions
export const {
    setSelectedDate,
    setSelectedDoctor,
    setSelectedMedicalService,
    setSelectedSlot,
    toggleSlotSelection,
    setSelectedSlots,
    clearSelectedSlot,
    clearSelections,
    clearError,
    resetScheduleState,
} = scheduleSlice.actions;

// Export reducer
export default scheduleSlice.reducer;
