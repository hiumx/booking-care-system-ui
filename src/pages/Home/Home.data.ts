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
    },
];
