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
        name: 'Cardiology',
        image: '/src/assets/img/specialities/speciality-01.jpg',
        icon: '/src/assets/img/specialities/speciality-icon-01.svg',
        doctorCount: 254,
    },
    {
        id: 2,
        name: 'Orthopedics',
        image: '/src/assets/img/specialities/speciality-02.jpg',
        icon: '/src/assets/img/specialities/speciality-icon-02.svg',
        doctorCount: 151,
    },
    {
        id: 3,
        name: 'Neurology',
        image: '/src/assets/img/specialities/speciality-03.jpg',
        icon: '/src/assets/img/specialities/speciality-icon-03.svg',
        doctorCount: 176,
    },
    {
        id: 4,
        name: 'Pediatrics',
        image: '/src/assets/img/specialities/speciality-04.jpg',
        icon: '/src/assets/img/specialities/speciality-icon-04.svg',
        doctorCount: 124,
    },
    {
        id: 5,
        name: 'Psychiatry',
        image: '/src/assets/img/specialities/speciality-05.jpg',
        icon: '/src/assets/img/specialities/speciality-icon-05.svg',
        doctorCount: 112,
    },
    {
        id: 6,
        name: 'Endocrinology',
        image: '/src/assets/img/specialities/speciality-06.jpg',
        icon: '/src/assets/img/specialities/speciality-icon-06.svg',
        doctorCount: 104,
    },
    {
        id: 7,
        name: 'Pulmonology',
        image: '/src/assets/img/specialities/speciality-07.jpg',
        icon: '/src/assets/img/specialities/speciality-icon-07.svg',
        doctorCount: 41,
    },
    {
        id: 8,
        name: 'Urology',
        image: '/src/assets/img/specialities/speciality-08.jpg',
        icon: '/src/assets/img/specialities/speciality-icon-08.svg',
        doctorCount: 39,
    },
    {
        id: 9,
        name: 'Neurology',
        image: '/src/assets/img/specialities/speciality-03.jpg',
        icon: '/src/assets/img/specialities/speciality-icon-03.svg',
        doctorCount: 176,
    },
];

export const CAROUSEL_SPECIALTIES_BREAKPOINTS = {
    1280: {
        slidesPerView: 8, // desktops
    },
    1024: {
        slidesPerView: 6, // laptops
    },
    768: {
        slidesPerView: 5, // tablets
    },
    480: {
        slidesPerView: 4, // mobile
    },
    0: {
        slidesPerView: 3, // small mobile
    },
};

export const CAROUSEL_CLINICS_BREAKPOINTS = {
    1280: {
        slidesPerView: 4, // desktops
    },
    1024: {
        slidesPerView: 3, // laptops
    },
    768: {
        slidesPerView: 2, // tablets
    },
    480: {
        slidesPerView: 2, // mobile
    },
    0: {
        slidesPerView: 1, // small mobile
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
        slidesPerView: 2, // tablets
    },
    480: {
        slidesPerView: 2, // mobile
    },
    0: {
        slidesPerView: 1, // small mobile
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

export const LIST_CLINICS: Clinic[] = [
    {
        id: 1,
        name: 'Bệnh viện Chợ Rẫy',
        image: '/src/assets/img/features/feature-01.jpg',
        address: '201B Nguyễn Chí Thanh, Quận 5, TP. Hồ Chí Minh',
        rating: 4.7,
        reviewCount: 512,
        distance: '3.1 km',
        specialties: ['Tim mạch', 'Thần kinh', 'Chấn thương chỉnh hình'],
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
        specialties: ['Nhi khoa', 'Hô hấp', 'Nội tổng quát'],
        priceRange: '400.000 - 1.500.000 VNĐ',
        availableSlots: 8,
    },
    {
        id: 3,
        name: 'Phòng khám Đa khoa Quốc tế Vinmec',
        image: '/src/assets/img/features/feature-01.jpg',
        address: '458 Minh Khai, Hai Bà Trưng, Hà Nội',
        rating: 4.8,
        reviewCount: 320,
        distance: '4.0 km',
        specialties: ['Sản phụ khoa', 'Nội tiết', 'Tiêu hóa'],
        priceRange: '800.000 - 3.000.000 VNĐ',
        availableSlots: 12,
    },
    {
        id: 4,
        name: 'Phòng khám Đa khoa Hoàn Mỹ Sài Gòn',
        image: '/src/assets/img/features/feature-02.jpg',
        address: '60-60A Phan Xích Long, Phú Nhuận, TP. Hồ Chí Minh',
        rating: 4.5,
        reviewCount: 210,
        distance: '1.5 km',
        specialties: ['Khám tổng quát', 'Tiêm chủng', 'Da liễu'],
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
        specialties: ['Tim mạch', 'Nội tiết', 'Chấn thương chỉnh hình'],
        priceRange: '600.000 - 2.500.000 VNĐ',
        availableSlots: 15,
    },
    {
        id: 6,
        name: 'Phòng khám Quốc tế CarePlus',
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
// Doctor mock data
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
        name: 'Dr. John Smith',
        image: '/src/assets/img/doctors/doctor-01.jpg',
        specialty: 'Cardiologist',
        location: 'New York, USA',
        rating: 4.9,
        consultationTime: '30 Min',
        fee: 650,
        available: true,
        profileLink: '/doctor/1',
        bookingLink: '/booking/1',
        specialtiesLink: '/specialties/cardiology',
    },
    {
        id: 2,
        name: 'Dr. Sarah Johnson',
        image: '/src/assets/img/doctors/doctor-02.jpg',
        specialty: 'Orthopedic Surgeon',
        location: 'Los Angeles, USA',
        rating: 4.7,
        consultationTime: '45 Min',
        fee: 550,
        available: true,
        profileLink: '/doctor/2',
        bookingLink: '/booking/2',
        specialtiesLink: '/specialties/orthopedics',
    },
    {
        id: 3,
        name: 'Dr. Michael Brown',
        image: '/src/assets/img/doctors/doctor-03.jpg',
        specialty: 'Neurologist',
        location: 'Chicago, USA',
        rating: 4.8,
        consultationTime: '30 Min',
        fee: 500,
        available: true,
        profileLink: '/doctor/3',
        bookingLink: '/booking/3',
        specialtiesLink: '/specialties/neurology',
    },
    {
        id: 4,
        name: 'Dr. Emily Davis',
        image: '/src/assets/img/doctors/doctor-04.jpg',
        specialty: 'Pediatrician',
        location: 'Houston, USA',
        rating: 4.6,
        consultationTime: '60 Min',
        fee: 400,
        available: false,
        profileLink: '/doctor/4',
        bookingLink: '/booking/4',
        specialtiesLink: '/specialties/pediatrics',
    },
    {
        id: 5,
        name: 'Dr. James Wilson',
        image: '/src/assets/img/doctors/doctor-05.jpg',
        specialty: 'Psychiatrist',
        location: 'Boston, USA',
        rating: 4.5,
        consultationTime: '30 Min',
        fee: 600,
        available: true,
        profileLink: '/doctor/5',
        bookingLink: '/booking/5',
        specialtiesLink: '/specialties/psychiatry',
    },
    {
        id: 6,
        name: 'Dr. Sophia Martinez',
        image: '/src/assets/img/doctors/doctor-06.jpg',
        specialty: 'Endocrinologist',
        location: 'San Francisco, USA',
        rating: 4.9,
        consultationTime: '45 Min',
        fee: 700,
        available: true,
        profileLink: '/doctor/6',
        bookingLink: '/booking/6',
        specialtiesLink: '/specialties/endocrinology',
    },
];

// -----------------------------
// Services Section Data
// -----------------------------

export type Service = {
    id: number;
    name: string;
    image: string;
};

export const LIST_SERVICES: Service[] = [
    {
        id: 1,
        name: 'Nurse at Home',
        image: '/src/assets/img/service/service-doctor-01.jpg',
    },
    {
        id: 2,
        name: 'Mobility Assistance',
        image: '/src/assets/img/service/service-doctor-02.jpg',
    },
    {
        id: 3,
        name: 'Physiotherapy',
        image: '/src/assets/img/service/service-doctor-03.jpg',
    },
    {
        id: 4,
        name: 'Medical Equipment',
        image: '/src/assets/img/service/service-doctor-04.jpg',
    },
    {
        id: 5,
        name: 'Trained Attendants',
        image: '/src/assets/img/service/service-doctor-05.jpg',
    },
    {
        id: 6,
        name: 'Lab Tests',
        image: '/src/assets//img/service/service-doctor-06.jpg',
    },
    {
        id: 7,
        name: 'Doctor Consultation',
        image: '/src/assets/img/service/service-doctor-07.jpg',
    },
    {
        id: 8,
        name: 'Mother & Baby Care',
        image: '/src/assets/img/service/service-doctor-08.jpg',
    },
    {
        id: 9,
        name: 'Vaccination',
        image: '/src/assets/img/service/service-doctor-09.jpg',
    },
    {
        id: 10,
        name: 'Tele Consultation',
        image: '/src/assets/img/service/service-doctor-10.jpg',
    },
];
