import { toast } from 'react-toastify';
import { NavigateFunction } from 'react-router-dom';
import { AppointmentService } from '../services/appointment.service';
import { PATHS } from '../routes/paths';
import { CreateAppointmentRequest } from '../types/appointment.types';
import { AppointmentType } from '../enums/appointment.enums';

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
 */
export const createAppointmentTimeId = (slot: { startTime: string; endTime: string }): string => {
    return `AT_${slot.startTime.replace(':', '_')}_${slot.endTime.replace(':', '_')}`;
};

/**
 * Utility function to create appointment request object
 */
export const createAppointmentRequest = (
    patientId: string,
    doctorId: string,
    specialtyId: string | undefined,
    appointmentDate: string,
    appointmentTimeId: string,
    hospitalId: string | undefined,
    appointmentType: AppointmentType,
    symptoms: string,
    attachmentUrls: string[]
): CreateAppointmentRequest => {
    return {
        patientId,
        doctorId,
        specialtyId,
        appointmentDate,
        appointmentTimeId,
        hospitalId,
        appointmentType: appointmentType || AppointmentType.IN_PERSON,
        symptoms,
        attachmentUrls: attachmentUrls.join(','),
    };
};
