import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';

// Base selector
const selectDoctorState = (state: RootState) => state.doctor;

// Memoized selectors
export const selectDoctors = createSelector(
    [selectDoctorState],
    (doctorState) => doctorState.doctors
);

export const selectSelectedDoctor = createSelector(
    [selectDoctorState],
    (doctorState) => doctorState.selectedDoctor
);

export const selectDoctorLoading = createSelector(
    [selectDoctorState],
    (doctorState) => doctorState.isLoading
);

export const selectDoctorError = createSelector(
    [selectDoctorState],
    (doctorState) => doctorState.error
);

export const selectDoctorPagination = createSelector(
    [selectDoctorState],
    (doctorState) => doctorState.pagination
);

export const selectDoctorFilters = createSelector(
    [selectDoctorState],
    (doctorState) => doctorState.filters
);

// Selector to check if a specific doctor is loaded
export const selectIsDoctorLoaded = createSelector(
    [selectSelectedDoctor, (_state: RootState, doctorId: string) => doctorId],
    (selectedDoctor, doctorId) => selectedDoctor?.id === doctorId
);
