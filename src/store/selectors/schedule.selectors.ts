import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Base selector
const selectScheduleState = (state: RootState) => state.schedule;

// Schedule data selectors
export const selectCurrentSchedule = createSelector(
    selectScheduleState,
    (schedule) => schedule.currentSchedule
);

export const selectAvailableSlots = createSelector(
    selectScheduleState,
    (schedule) => schedule.availableSlots
);

export const selectScheduleCategories = createSelector(
    selectScheduleState,
    (schedule) => schedule.scheduleCategories
);

// Selection state selectors
export const selectSelectedDate = createSelector(
    selectScheduleState,
    (schedule) => schedule.selectedDate
);

export const selectSelectedDoctorId = createSelector(
    selectScheduleState,
    (schedule) => schedule.selectedDoctorId
);

export const selectSelectedMedicalServiceId = createSelector(
    selectScheduleState,
    (schedule) => schedule.selectedMedicalServiceId
);

export const selectSelectedSlot = createSelector(
    selectScheduleState,
    (schedule) => schedule.selectedSlot
);

export const selectSelectedSlots = createSelector(
    selectScheduleState,
    (schedule) => schedule.selectedSlots
);

// Loading state selectors
export const selectScheduleLoading = createSelector(
    selectScheduleState,
    (schedule) => schedule.loading.schedule
);

export const selectAvailableSlotsLoading = createSelector(
    selectScheduleState,
    (schedule) => schedule.loading.availableSlots
);

export const selectIsAnyScheduleLoading = createSelector(
    selectScheduleState,
    (schedule) => schedule.loading.schedule || schedule.loading.availableSlots
);

// Error selector
export const selectScheduleError = createSelector(
    selectScheduleState,
    (schedule) => schedule.error
);

// UI state selectors
export const selectIsDateSelected = createSelector(
    selectScheduleState,
    (schedule) => schedule.isDateSelected
);

export const selectIsSlotSelected = createSelector(
    selectScheduleState,
    (schedule) => schedule.isSlotSelected
);

// Combined selectors
export const selectCanFetchSchedule = createSelector(
    [selectSelectedDate, selectSelectedDoctorId],
    (selectedDate, selectedDoctorId) => Boolean(selectedDate && selectedDoctorId)
);

export const selectScheduleBookingReady = createSelector(
    [selectIsDateSelected, selectIsSlotSelected, selectSelectedSlot],
    (isDateSelected, isSlotSelected, selectedSlot) =>
        isDateSelected && isSlotSelected && selectedSlot?.isAvailable
);

// Computed selectors
export const selectAvailableSlotCount = createSelector(
    selectAvailableSlots,
    (slots) => slots.filter((slot) => slot.isAvailable && !slot.isBlocked).length
);
