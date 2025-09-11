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
