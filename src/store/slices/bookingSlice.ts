import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppointmentType } from '@/enums/appointment.enums';

// Booking flow type
export type BookingFlowType = 'doctor' | 'service' | 'hospital';

export interface BookingState {
    // Booking flow type
    bookingFlowType: BookingFlowType | null;

    // Hospital booking specific - Step 1: Specialty/Service Selection
    hospitalId: string | null;
    selectedSpecialtyId: string | null;
    selectedServiceMedicalId: string | null; // Service of hospital (not doctor service)

    // Hospital booking specific - Step 2: Appointment Type & Doctor
    selectedDoctorId: string | null; // Optional doctor selection for hospital booking

    // Common - Date & Time
    selectedDate: string | null;
    selectedTimeSlots: Array<{ startTime: string; endTime: string }>;
    doctorId: string | null; // For doctor booking flow

    // Common - Basic Info & Symptoms
    symptoms: string;
    attachmentUrls: string[];

    // Booking for relative (optional)
    relativeId: string | null;
    isBookingForRelative: boolean;

    // Common - Payment
    appointmentType: AppointmentType;

    // Created appointment ID
    createdAppointmentId: string | null;
}

const initialState: BookingState = {
    bookingFlowType: null,
    hospitalId: null,
    selectedSpecialtyId: null,
    selectedServiceMedicalId: null,
    selectedDoctorId: null,
    selectedDate: null,
    selectedTimeSlots: [],
    doctorId: null,
    symptoms: '',
    attachmentUrls: [],
    relativeId: null,
    isBookingForRelative: false,
    appointmentType: AppointmentType.IN_PERSON,
    createdAppointmentId: null,
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        // Set booking flow type
        setBookingFlowType: (state, action: PayloadAction<BookingFlowType>) => {
            state.bookingFlowType = action.payload;
        },

        // Hospital booking actions
        setHospitalId: (state, action: PayloadAction<string>) => {
            state.hospitalId = action.payload;
        },
        setSelectedSpecialtyId: (state, action: PayloadAction<string | null>) => {
            state.selectedSpecialtyId = action.payload;
            // Clear service when specialty is selected
            if (action.payload) {
                state.selectedServiceMedicalId = null;
            }
        },
        setSelectedServiceMedicalId: (state, action: PayloadAction<string | null>) => {
            state.selectedServiceMedicalId = action.payload;
            // Clear specialty when service is selected
            if (action.payload) {
                state.selectedSpecialtyId = null;
            }
        },
        setSelectedDoctorId: (state, action: PayloadAction<string | null>) => {
            state.selectedDoctorId = action.payload;
        },

        // Common actions
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
        setCreatedAppointmentId: (state, action: PayloadAction<string | null>) => {
            // Handle empty string as null for consistency
            state.createdAppointmentId = action.payload || null;
        },
        setBookingRelative: (
            state,
            action: PayloadAction<{ relativeId: string | null; isBookingForRelative: boolean }>
        ) => {
            state.relativeId = action.payload.relativeId;
            state.isBookingForRelative = action.payload.isBookingForRelative;
        },
        clearBookingState: (state) => {
            Object.assign(state, initialState);
        },
    },
});

export const {
    setBookingFlowType,
    setHospitalId,
    setSelectedSpecialtyId,
    setSelectedServiceMedicalId,
    setSelectedDoctorId,
    setBookingDate,
    setBookingTimeSlots,
    setBookingDoctorId,
    setBookingSymptoms,
    addAttachmentUrl,
    removeAttachmentUrl,
    clearAttachmentUrls,
    setAppointmentType,
    setCreatedAppointmentId,
    setBookingRelative,
    clearBookingState,
} = bookingSlice.actions;

export default bookingSlice.reducer;
