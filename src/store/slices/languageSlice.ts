import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DoctorService } from '@/services/doctor.service';
import { LanguageState } from '@/types/language.types';

const initialState: LanguageState = {
    languages: [],
    isLoading: false,
    error: null,
};

// Async thunk để get languages
export const getLanguagesAsync = createAsyncThunk(
    'language/getLanguages',
    async (_, { rejectWithValue }) => {
        try {
            const response = await DoctorService.getLanguages();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to get languages');
        }
    }
);

const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getLanguagesAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getLanguagesAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.languages = action.payload;
                state.error = null;
            })
            .addCase(getLanguagesAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export default languageSlice.reducer;
