import { useAppSelector } from '../../../store/hooks';
import { DoctorInfo } from '../components/BookingHeader/BookingHeader';

/**
 * Custom hook to get service medical info formatted for booking sections
 * This ensures consistent service medical data across all booking steps
 * Reuses DoctorInfo interface for compatibility with existing UI components
 */
export const useServiceMedicalInfo = (): DoctorInfo => {
    const serviceMedicalId = useAppSelector((state) => state.schedule.selectedMedicalServiceId);

    // TODO: When service medical store is implemented, fetch from there
    // For now, return placeholder data
    const serviceMedicalInfo: DoctorInfo = serviceMedicalId
        ? {
              name: 'Dịch vụ y tế', // TODO: Get from service medical store
              specialty: 'Dịch vụ khám chữa bệnh',
              rating: 4.5,
              location: 'Địa chỉ bệnh viện',
              avatar: '/assets/img/default-avatar.jpg',
          }
        : (new Object() as DoctorInfo);

    return serviceMedicalInfo;
};
