import { toast } from 'react-toastify';
import { NavigateFunction } from 'react-router-dom';
import { AppointmentService } from '../services/appointment.service';
import { PATHS } from '../routes/paths';
import { CreateAppointmentRequest } from '../types/appointment.types';
import { AppointmentTime, AppointmentType } from '@/enums/appointment.enums';

/**
 * Utility function to load appointment data by ID
 */
export const loadAppointmentData = async (
    appointmentId: string,
    setAppointmentData: (data: any) => void,
    setIsLoading: (loading: boolean) => void,
    navigate: NavigateFunction
) => {
    if (!appointmentId) return;

    try {
        setIsLoading(true);
        const response = await AppointmentService.getAppointmentById(appointmentId);

        if (response.success && response.data) {
            setAppointmentData(response.data);
        } else {
            throw new Error('Không thể tải thông tin lịch hẹn');
        }
    } catch (error: any) {
        console.error('Error loading appointment:', error);
        toast.error(error.message || 'Không thể tải thông tin lịch hẹn');
        navigate(PATHS.HOME);
    } finally {
        setIsLoading(false);
    }
};

/**
 * Utility function to validate appointment parameters
 */
export const validateAppointmentParams = (
    appointmentId: string | null,
    rescheduleToken: string | null,
    navigate: NavigateFunction
): boolean => {
    if (!appointmentId || !rescheduleToken) {
        toast.error('Thông tin không hợp lệ');
        navigate(PATHS.HOME);
        return false;
    }
    return true;
};

/**
 * Utility function to format appointment time from timeId
 */
export const formatAppointmentTime = (timeId: string): string => {
    const timeRegex = /AT_(\d+)_(\d+)_(\d+)_(\d+)/;
    const timeMatch = timeRegex.exec(timeId);

    if (timeMatch) {
        const [, startHour, startMin, endHour, endMin] = timeMatch;
        return `${startHour.padStart(2, '0')}:${startMin.padStart(2, '0')} - ${endHour.padStart(2, '0')}:${endMin.padStart(2, '0')}`;
    }
    return 'N/A';
};

/**
 * Utility function to create appointment time ID from slot
 * Returns value matching backend AppointmentTime enum (e.g. AT_08_00_08_30)
 */
export const createAppointmentTimeId = (slot: {
    startTime: string;
    endTime: string;
}): AppointmentTime => {
    return `AT_${slot.startTime.replace(':', '_')}_${slot.endTime.replace(':', '_')}` as AppointmentTime;
};

/**
 * Get appointment date and time for reschedule
 * Returns from original appointment if skipDateTime, otherwise from schedule state
 */
export const getAppointmentDateTime = (
    skipDateTime: boolean,
    originalAppointment: any,
    scheduleState: {
        selectedDate: string | null;
        selectedSlots: Array<{ startTime: string; endTime: string }>;
    }
): { appointmentDate: string; appointmentTimeId: string } | null => {
    if (skipDateTime && originalAppointment) {
        // Use original appointment date/time (hospital already selected)
        return {
            appointmentDate: originalAppointment.appointmentDate,
            appointmentTimeId: originalAppointment.appointmentTimeId,
        };
    }

    // Use user-selected date/time
    if (!scheduleState.selectedDate || scheduleState.selectedSlots.length === 0) {
        return null;
    }

    const firstSlot = scheduleState.selectedSlots[0];
    return {
        appointmentDate: scheduleState.selectedDate,
        appointmentTimeId: createAppointmentTimeId(firstSlot),
    };
};

/**
 * Parameters for creating an appointment request
 */
export interface CreateAppointmentParams {
    patientId: string;
    patientAccountId?: string;
    doctorId: string;
    specialtyId: string | undefined;
    appointmentDate: string;
    appointmentTimeId: string;
    hospitalId: string | undefined;
    appointmentType: AppointmentType;
    symptoms: string;
    attachmentUrls: string[];
}

/**
 * Utility function to create appointment request object
 */
export const createAppointmentRequest = (
    params: CreateAppointmentParams
): CreateAppointmentRequest => {
    return {
        patientId: params.patientId,
        patientAccountId: params.patientAccountId,
        doctorId: params.doctorId,
        specialtyId: params.specialtyId,
        appointmentDate: params.appointmentDate,
        appointmentTimeId: params.appointmentTimeId,
        hospitalId: params.hospitalId,
        appointmentType: params.appointmentType || AppointmentType.IN_PERSON,
        symptoms: params.symptoms,
        attachmentUrls: params.attachmentUrls.join(','),
    };
};
