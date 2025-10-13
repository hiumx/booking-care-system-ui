import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppointmentType } from '@/enums/appointment.enums';

export interface BookingState {
    // Step 1: Date & Time
    selectedDate: string | null;
    selectedTimeSlots: Array<{ startTime: string; endTime: string }>;
    doctorId: string | null;

    // Step 2: Basic Info & Symptoms
    symptoms: string;
    attachmentUrls: string[];

    // Step 3: Payment (future)
    appointmentType: AppointmentType;

    // Created appointment ID
    createdAppointmentId: string | null;
}

const initialState: BookingState = {
    selectedDate: null,
    selectedTimeSlots: [],
    doctorId: null,
    symptoms: '',
    attachmentUrls: [],
    appointmentType: AppointmentType.IN_PERSON,
    createdAppointmentId: null,
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setBookingDate: (state, action: PayloadAction<string>) => {
            state.selectedDate = action.payload;
        },
        setBookingTimeSlots: (
            state,
            action: PayloadAction<Array<{ startTime: string; endTime: string }>>
        ) => {
            state.selectedTimeSlots = action.payload;
        },
        setBookingDoctorId: (state, action: PayloadAction<string>) => {
            state.doctorId = action.payload;
        },
        setBookingSymptoms: (state, action: PayloadAction<string>) => {
            state.symptoms = action.payload;
        },
        addAttachmentUrl: (state, action: PayloadAction<string>) => {
            state.attachmentUrls.push(action.payload);
        },
        removeAttachmentUrl: (state, action: PayloadAction<string>) => {
            state.attachmentUrls = state.attachmentUrls.filter((url) => url !== action.payload);
        },
        clearAttachmentUrls: (state) => {
            state.attachmentUrls = [];
        },
        setAppointmentType: (state, action: PayloadAction<AppointmentType>) => {
            state.appointmentType = action.payload;
        },
        setCreatedAppointmentId: (state, action: PayloadAction<string>) => {
            state.createdAppointmentId = action.payload;
        },
        clearBookingState: (state) => {
            Object.assign(state, initialState);
        },
    },
});

export const {
    setBookingDate,
    setBookingTimeSlots,
    setBookingDoctorId,
    setBookingSymptoms,
    addAttachmentUrl,
    removeAttachmentUrl,
    clearAttachmentUrls,
    setAppointmentType,
    setCreatedAppointmentId,
    clearBookingState,
} = bookingSlice.actions;

export default bookingSlice.reducer;
