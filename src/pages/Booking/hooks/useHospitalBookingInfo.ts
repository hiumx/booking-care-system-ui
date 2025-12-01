import { useAppSelector } from '../../../store/hooks';
import { BookingEntityInfo } from '../components/BookingHeader/BookingHeader';

/**
 * Custom hook to get hospital booking info formatted for booking sections
 * This ensures consistent hospital data across all booking steps in hospital booking flow
 * Uses BookingEntityInfo interface for flexible display in BookingHeader
 */
export const useHospitalBookingInfo = (): BookingEntityInfo => {
    // Get booking state for selected specialty/service and doctor
    const bookingState = useAppSelector((state) => state.booking);

    // Get hospital data from hospital slice
    const selectedHospital = useAppSelector((state) => state.hospital.selectedHospital);

    // Get selected doctor info if available
    const selectedDoctor = useAppSelector((state) => state.doctor.selectedDoctor);

    // Find selected specialty name
    const selectedSpecialtyName = selectedHospital?.specialties?.find(
        (s) => s.id === bookingState.selectedSpecialtyId
    )?.name;

    // Find selected service name
    const selectedServiceName = selectedHospital?.serviceMedicals?.find(
        (s) => s.id === bookingState.selectedServiceMedicalId
    )?.name;

    // Get selected doctor name if available
    const selectedDoctorName = selectedDoctor
        ? `${selectedDoctor.lastName} ${selectedDoctor.firstName}`
        : bookingState.selectedDoctorId
          ? 'Bác sĩ được chọn'
          : undefined;

    // Map hospital data from Redux to BookingEntityInfo format
    const hospitalBookingInfo: BookingEntityInfo = selectedHospital
        ? {
              name: selectedHospital.name,
              subtitle: selectedHospital.address || 'Địa chỉ bệnh viện',
              rating: undefined, // Hospital rating if available
              location: selectedHospital.address || 'Địa chỉ',
              avatar: selectedHospital.avatarUrl || '/assets/img/default-hospital.jpg',
              bookingType: 'hospital',
              // Additional fields for hospital booking
              selectedSpecialty: selectedSpecialtyName,
              selectedService: selectedServiceName,
              selectedDoctor: selectedDoctorName,
          }
        : ({} as BookingEntityInfo);

    return hospitalBookingInfo;
};
