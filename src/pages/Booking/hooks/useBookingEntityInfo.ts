import { useParams } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store';
import { useDoctorInfo } from './useDoctorInfo';
import { useServiceMedicalInfo } from './useServiceMedicalInfo';
import { useHospitalBookingInfo } from './useHospitalBookingInfo';

/**
 * Custom hook to determine booking type and get appropriate entity info
 * Centralizes booking type detection logic to avoid code duplication
 */
export const useBookingEntityInfo = () => {
    const { serviceMedicalId, hospitalId } = useParams<{
        serviceMedicalId?: string;
        hospitalId?: string;
    }>();

    // Get booking flow type from Redux (supports both URL params and programmatic booking)
    const bookingFlowType = useAppSelector((state: RootState) => state.booking.bookingFlowType);

    // Determine booking type - check Redux first, then fall back to URL params
    const isServiceMedicalBooking = bookingFlowType === 'service' || !!serviceMedicalId;
    const isHospitalBooking = bookingFlowType === 'hospital' || !!hospitalId;

    // Get entity info based on booking type (already fetched in DateTimeSection)
    const doctorInfo = useDoctorInfo();
    const serviceMedicalInfo = useServiceMedicalInfo();
    const hospitalBookingInfo = useHospitalBookingInfo();

    const getEntityInfo = () => {
        if (isHospitalBooking) return hospitalBookingInfo;
        if (isServiceMedicalBooking) return serviceMedicalInfo;
        return doctorInfo;
    };

    return {
        entityInfo: getEntityInfo(),
        isServiceMedicalBooking,
        isHospitalBooking,
        bookingFlowType,
    };
};
