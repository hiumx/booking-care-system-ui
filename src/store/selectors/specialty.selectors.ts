import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

// Basic selectors
export const selectSpecialtyState = (state: RootState) => state.specialty;
export const selectSpecialties = (state: RootState) => state.specialty.specialties;
export const selectSpecialtyLoading = (state: RootState) => state.specialty.isLoading;
export const selectSpecialtyError = (state: RootState) => state.specialty.error;

// Memoized selectors
export const selectSpecialtiesCount = createSelector(
    [selectSpecialties],
    (specialties) => specialties.length
);

export const selectSpecialtyById = createSelector(
    [selectSpecialties, (_, id: string) => id],
    (specialties, id) => specialties.find((specialty) => specialty.id === id)
);

export const selectSpecialtiesByName = createSelector(
    [selectSpecialties, (_, name: string) => name],
    (specialties, name) =>
        specialties.filter((specialty) => specialty.name.toLowerCase().includes(name.toLowerCase()))
);

export const selectSpecialtiesWithImages = createSelector([selectSpecialties], (specialties) =>
    specialties.filter((specialty) => specialty.imageUrl)
);

export const selectSpecialtiesWithoutImages = createSelector([selectSpecialties], (specialties) =>
    specialties.filter((specialty) => !specialty.imageUrl)
);
