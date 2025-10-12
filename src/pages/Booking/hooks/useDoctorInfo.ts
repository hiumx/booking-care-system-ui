import { useAppSelector } from '../../../store/hooks';
import { selectSelectedDoctor } from '../../../store/selectors/doctor.selectors';
import { DoctorInfo } from '../components/BookingHeader/BookingHeader';

/**
 * Custom hook to get doctor info formatted for booking sections
 * This ensures consistent doctor data across all booking steps
 */
export const useDoctorInfo = (): DoctorInfo => {
    const selectedDoctor = useAppSelector(selectSelectedDoctor);

    // Map doctor data from Redux to DoctorInfo format
    const doctorInfo: DoctorInfo = selectedDoctor
        ? {
              name: `${selectedDoctor.firstName} ${selectedDoctor.lastName}`,
              specialty: selectedDoctor.specialty?.name || 'Chuyên khoa',
              rating: 4.5, // TODO: Get from reviews/ratings when available
              location: selectedDoctor.hospital?.name || selectedDoctor.address || 'Địa chỉ',
              avatar: selectedDoctor.avatarUrl || '/assets/img/default-avatar.jpg',
          }
        : (new Object() as DoctorInfo);

    return doctorInfo;
};
