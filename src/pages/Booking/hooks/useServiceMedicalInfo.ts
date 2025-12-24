import { useAppSelector } from '../../../store/hooks';
import { BookingEntityInfo } from '../components/BookingHeader/BookingHeader';

/**
 * Custom hook to get service medical info formatted for booking sections
 * This ensures consistent service medical data across all booking steps
 * Uses BookingEntityInfo interface for flexible display in BookingHeader
 */
export const useServiceMedicalInfo = (): BookingEntityInfo => {
    // Use selectedServiceWithHospital which contains full hospital info
    const selectedServiceWithHospital = useAppSelector(
        (state) => state.medicalService.serviceCategories.selectedServiceWithHospital
    );

    // Map service with hospital data from Redux to BookingEntityInfo format
    const serviceMedicalInfo: BookingEntityInfo = selectedServiceWithHospital
        ? {
              name: selectedServiceWithHospital.name,
              subtitle: selectedServiceWithHospital.hospital?.name || 'Bệnh viện',
              rating: selectedServiceWithHospital.reviewStatistics?.averageRating, // Services don't have ratings
              location: selectedServiceWithHospital.hospital?.address || 'Địa chỉ bệnh viện',
              avatar: selectedServiceWithHospital.imageUrl || '/assets/img/default-service.jpg',
              bookingType: 'service',
              price: selectedServiceWithHospital.price,
              duration: selectedServiceWithHospital.durationTime,
          }
        : ({} as BookingEntityInfo);

    return serviceMedicalInfo;
};
