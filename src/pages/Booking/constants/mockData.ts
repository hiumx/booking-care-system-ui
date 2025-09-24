import { DoctorInfo, AppointmentInfo } from '../components/BookingHeader/BookingHeader';

export const mockDoctorInfo: DoctorInfo = {
    name: 'BS. Nguyễn Văn Minh',
    specialty: 'Bác sĩ Tâm lý Cao cấp',
    rating: 5.0,
    location: 'Quận 1, TP. Hồ Chí Minh',
    avatar: '/src/assets/img/clients/client-15.jpg',
};

export const mockAppointmentInfo: AppointmentInfo = {
    service: 'Tim mạch (30 phút)',
    serviceType: 'Siêu âm tim',
    dateTime: '10:00 - 11:00, 15 Tháng 10',
    appointmentType: 'Phòng khám (Wellness Path)',
};
