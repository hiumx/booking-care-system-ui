import icon01 from '@/assets/img/icons/list-icon-01.svg';
import icon02 from '@/assets/img/icons/list-icon-02.svg';
import icon03 from '@/assets/img/icons/list-icon-03.svg';
import icon04 from '@/assets/img/icons/list-icon-04.svg';
import icon05 from '@/assets/img/icons/list-icon-05.svg';
import icon06 from '@/assets/img/icons/list-icon-06.svg';
import icon07 from '@/assets/img/icons/list-icon-07.svg';

export type Specialty = {
    id: number;
    name: string;
    image: string;
    icon: string;
    doctorCount: number;
};

export const LIST_SPECIALTIES: Specialty[] = [
    {
        id: 1,
        name: 'Tim mạch',
        image: '/src/assets/img/specialities/speciality-01.jpg',
        icon: '/src/assets/img/specialities/speciality-icon-01.svg',
        doctorCount: 254,
    },
    {
        id: 2,
        name: 'Chấn thương chỉnh hình',
        image: '/src/assets/img/specialities/speciality-02.jpg',
        icon: '/src/assets/img/specialities/speciality-icon-02.svg',
        doctorCount: 151,
    },
    {
        id: 3,
        name: 'Thần kinh',
        image: '/src/assets/img/specialities/speciality-03.jpg',
        icon: '/src/assets/img/specialities/speciality-icon-03.svg',
        doctorCount: 176,
    },
    {
        id: 4,
        name: 'Nhi khoa',
        image: '/src/assets/img/specialities/speciality-04.jpg',
        icon: '/src/assets/img/specialities/speciality-icon-04.svg',
        doctorCount: 124,
    },
    {
        id: 5,
        name: 'Tâm thần học',
        image: '/src/assets/img/specialities/speciality-05.jpg',
        icon: '/src/assets/img/specialities/speciality-icon-05.svg',
        doctorCount: 112,
    },
    {
        id: 6,
        name: 'Nội tiết',
        image: '/src/assets/img/specialities/speciality-06.jpg',
        icon: '/src/assets/img/specialities/speciality-icon-06.svg',
        doctorCount: 104,
    },
    {
        id: 7,
        name: 'Hô hấp',
        image: '/src/assets/img/specialities/speciality-07.jpg',
        icon: '/src/assets/img/specialities/speciality-icon-07.svg',
        doctorCount: 41,
    },
    {
        id: 8,
        name: 'Tiết niệu',
        image: '/src/assets/img/specialities/speciality-08.jpg',
        icon: '/src/assets/img/specialities/speciality-icon-08.svg',
        doctorCount: 39,
    },
    {
        id: 9,
        name: 'Thần kinh',
        image: '/src/assets/img/specialities/speciality-03.jpg',
        icon: '/src/assets/img/specialities/speciality-icon-03.svg',
        doctorCount: 176,
    },
];

export const CAROUSEL_SPECIALTIES_BREAKPOINTS = {
    1280: {
        slidesPerView: 8, // máy tính để bàn
    },
    1024: {
        slidesPerView: 6, // laptop
    },
    768: {
        slidesPerView: 5, // máy tính bảng
    },
    480: {
        slidesPerView: 4, // điện thoại
    },
    0: {
        slidesPerView: 3, // điện thoại nhỏ
    },
};

export const CAROUSEL_HOSPITALS_BREAKPOINTS = {
    1280: {
        slidesPerView: 4, // máy tính để bàn
    },
    1024: {
        slidesPerView: 3, // laptop
    },
    768: {
        slidesPerView: 2, // máy tính bảng
    },
    480: {
        slidesPerView: 2, // điện thoại
    },
    0: {
        slidesPerView: 1, // điện thoại nhỏ
    },
};

export const CAROUSEL_DOCTORS_BREAKPOINTS = {
    1204: {
        slidesPerView: 4,
    },
    1000: {
        slidesPerView: 3,
    },
    768: {
        slidesPerView: 2, // máy tính bảng
    },
    480: {
        slidesPerView: 2, // điện thoại
    },
    0: {
        slidesPerView: 1, // điện thoại nhỏ
    },
};

export type Clinic = {
    id: number;
    name: string;
    image: string;
    address: string;
    rating: number;
    reviewCount: number;
    distance?: string;
    specialties: string[];
    description?: string;
    priceRange?: string;
    availableSlots?: number;
    isVerified?: boolean;
};

export const LIST_HOSPITALS: Clinic[] = [
    {
        id: 1,
        name: 'Bệnh viện Chợ Rẫy',
        image: '/src/assets/img/features/feature-01.jpg',
        address: '201B Nguyễn Chí Thanh, Quận 5, TP. Hồ Chí Minh',
        rating: 4.7,
        reviewCount: 512,
        distance: '3.1 km',
        specialties: [
            'Tim mạch',
            'Thần kinh',
            'Chấn thương chỉnh hình',
            'Nội tiết',
            'Da liễu',
            'Nhi khoa',
        ],
        priceRange: '500.000 - 2.000.000 VNĐ',
        availableSlots: 10,
    },
    {
        id: 2,
        name: 'Bệnh viện Bạch Mai',
        image: '/src/assets/img/features/feature-02.jpg',
        address: '78 Giải Phóng, Đống Đa, Hà Nội',
        rating: 4.6,
        reviewCount: 430,
        distance: '2.8 km',
        specialties: ['Nhi khoa', 'Hô hấp', 'Nội tổng quát', 'Sản phụ khoa', 'Mắt'],
        priceRange: '400.000 - 1.500.000 VNĐ',
        availableSlots: 8,
    },
    {
        id: 3,
        name: 'Bệnh viện Đa khoa Quốc tế Vinmec',
        image: '/src/assets/img/features/feature-01.jpg',
        address: '458 Minh Khai, Hai Bà Trưng, Hà Nội',
        rating: 4.8,
        reviewCount: 320,
        distance: '4.0 km',
        specialties: [
            'Sản phụ khoa',
            'Nội tiết',
            'Tiêu hóa',
            'Tim mạch',
            'Thần kinh',
            'Da liễu',
            'Nhi khoa',
        ],
        priceRange: '800.000 - 3.000.000 VNĐ',
        availableSlots: 12,
    },
    {
        id: 4,
        name: 'Bệnh viện Đa khoa Hoàn Mỹ Sài Gòn',
        image: '/src/assets/img/features/feature-02.jpg',
        address: '60-60A Phan Xích Long, Phú Nhuận, TP. Hồ Chí Minh',
        rating: 4.5,
        reviewCount: 210,
        distance: '1.5 km',
        specialties: ['Khám tổng quát', 'Tiêm chủng', 'Da liễu', 'Nội tiết'],
        priceRange: '300.000 - 1.200.000 VNĐ',
        availableSlots: 7,
    },
    {
        id: 5,
        name: 'Bệnh viện Đại học Y Dược TP.HCM',
        image: '/src/assets/img/features/feature-03.jpg',
        address: '215 Hồng Bàng, Quận 5, TP. Hồ Chí Minh',
        rating: 4.9,
        reviewCount: 610,
        distance: '2.2 km',
        specialties: ['Tim mạch', 'Nội tiết', 'Chấn thương chỉnh hình', 'Thần kinh', 'Da liễu'],
        priceRange: '600.000 - 2.500.000 VNĐ',
        availableSlots: 15,
    },
    {
        id: 6,
        name: 'Bệnh viện Quốc tế CarePlus',
        image: '/src/assets/img/features/feature-04.jpg',
        address: 'CarePlus, 2 Phan Đăng Lưu, Bình Thạnh, TP. Hồ Chí Minh',
        rating: 4.4,
        reviewCount: 185,
        distance: '3.7 km',
        specialties: ['Nhi khoa', 'Tiêm chủng', 'Khám tổng quát'],
        priceRange: '350.000 - 1.800.000 VNĐ',
        availableSlots: 9,
    },
];

// -----------------------------
// Dữ liệu bác sĩ
// -----------------------------
export type Doctor = {
    id: number;
    name: string;
    image: string;
    specialty: string;
    location: string;
    rating: number;
    consultationTime: string;
    fee: number;
    available: boolean;
    profileLink: string;
    bookingLink: string;
    specialtiesLink: string;
};

export const LIST_DOCTORS: Doctor[] = [
    {
        id: 1,
        name: 'BS. John Smith',
        image: '/src/assets/img/doctors/doctor-01.jpg',
        specialty: 'Bác sĩ Tim mạch',
        location: 'New York, Mỹ',
        rating: 4.9,
        consultationTime: '30 Phút',
        fee: 650,
        available: true,
        profileLink: '/doctor/1',
        bookingLink: '/booking/1',
        specialtiesLink: '/specialties/tim-mach',
    },
    {
        id: 2,
        name: 'BS. Sarah Johnson',
        image: '/src/assets/img/doctors/doctor-02.jpg',
        specialty: 'Bác sĩ Phẫu thuật Chấn thương chỉnh hình',
        location: 'Los Angeles, Mỹ',
        rating: 4.7,
        consultationTime: '45 Phút',
        fee: 550,
        available: true,
        profileLink: '/doctor/2',
        bookingLink: '/booking/2',
        specialtiesLink: '/specialties/chan-thuong-chinh-hinh',
    },
    {
        id: 3,
        name: 'BS. Nguyễn Văn Minh',
        image: '/src/assets/img/doctors/doctor-03.jpg',
        specialty: 'Bác sĩ Thần kinh',
        location: 'Chicago, Mỹ',
        rating: 4.8,
        consultationTime: '30 Phút',
        fee: 500,
        available: true,
        profileLink: '/doctor/3',
        bookingLink: '/booking/3',
        specialtiesLink: '/specialties/than-kinh',
    },
    {
        id: 4,
        name: 'BS. Emily Davis',
        image: '/src/assets/img/doctors/doctor-04.jpg',
        specialty: 'Bác sĩ Nhi khoa',
        location: 'Houston, Mỹ',
        rating: 4.6,
        consultationTime: '60 Phút',
        fee: 400,
        available: false,
        profileLink: '/doctor/4',
        bookingLink: '/booking/4',
        specialtiesLink: '/specialties/nhi-khoa',
    },
    {
        id: 5,
        name: 'BS. James Wilson',
        image: '/src/assets/img/doctors/doctor-05.jpg',
        specialty: 'Bác sĩ Tâm thần học',
        location: 'Boston, Mỹ',
        rating: 4.5,
        consultationTime: '30 Phút',
        fee: 600,
        available: true,
        profileLink: '/doctor/5',
        bookingLink: '/booking/5',
        specialtiesLink: '/specialties/tam-than-hoc',
    },
    {
        id: 6,
        name: 'BS. Sophia Martinez',
        image: '/src/assets/img/doctors/doctor-06.jpg',
        specialty: 'Bác sĩ Nội tiết',
        location: 'San Francisco, Mỹ',
        rating: 4.9,
        consultationTime: '45 Phút',
        fee: 700,
        available: true,
        profileLink: '/doctor/6',
        bookingLink: '/booking/6',
        specialtiesLink: '/specialties/noi-tiet',
    },
];

// -----------------------------
// Dữ liệu phần dịch vụ
// -----------------------------
export type Service = {
    id: number;
    name: string;
    image: string;
};

export const LIST_SERVICES: Service[] = [
    {
        id: 1,
        name: 'Y tá tại nhà',
        image: '/src/assets/img/service/service-doctor-01.jpg',
    },
    {
        id: 2,
        name: 'Hỗ trợ di chuyển',
        image: '/src/assets/img/service/service-doctor-02.jpg',
    },
    {
        id: 3,
        name: 'Vật lý trị liệu',
        image: '/src/assets/img/service/service-doctor-03.jpg',
    },
    {
        id: 4,
        name: 'Thiết bị y tế',
        image: '/src/assets/img/service/service-doctor-04.jpg',
    },
    {
        id: 5,
        name: 'Nhân viên chăm sóc chuyên nghiệp',
        image: '/src/assets/img/service/service-doctor-05.jpg',
    },
    {
        id: 6,
        name: 'Xét nghiệm y khoa',
        image: '/src/assets//img/service/service-doctor-06.jpg',
    },
    {
        id: 7,
        name: 'Tư vấn bác sĩ',
        image: '/src/assets/img/service/service-doctor-07.jpg',
    },
    {
        id: 8,
        name: 'Chăm sóc mẹ và bé',
        image: '/src/assets/img/service/service-doctor-08.jpg',
    },
    {
        id: 9,
        name: 'Tiêm chủng',
        image: '/src/assets/img/service/service-doctor-09.jpg',
    },
    {
        id: 10,
        name: 'Tư vấn từ xa',
        image: '/src/assets/img/service/service-doctor-10.jpg',
    },
];

// -----------------------------
// Dữ liệu danh mục dịch vụ
// -----------------------------
export type ServiceCategory = {
    id: number;
    href: string;
    icon: string;
    bgColor: string;
    text: string;
};

export const LIST_SERVICE_CATEGORIES: ServiceCategory[] = [
    {
        id: 1,
        href: '/doctors',
        icon: icon01,
        bgColor: 'bg-secondary',
        text: 'Đặt lịch hẹn',
    },
    {
        id: 2,
        href: '/doctors',
        icon: icon02,
        bgColor: 'bg-primary',
        text: 'Tư vấn trực tuyến',
    },
    {
        id: 3,
        href: '/medical-facility',
        icon: icon03,
        bgColor: 'bg-pink',
        text: 'Bệnh viện',
    },
    {
        id: 4,
        href: '/doctors',
        icon: icon04,
        bgColor: 'bg-cyan',
        text: 'Chăm sóc sức khỏe',
    },
    {
        id: 5,
        href: '/doctors',
        icon: icon05,
        bgColor: 'bg-purple',
        text: 'Tiêm chủng',
    },
    {
        id: 6,
        href: '/doctors',
        icon: icon06,
        bgColor: 'bg-orange',
        text: 'Xét nghiệm y khoa',
    },
    {
        id: 7,
        href: '/doctors',
        icon: icon07,
        bgColor: 'bg-teal',
        text: 'Chăm sóc tại nhà',
    },
];
