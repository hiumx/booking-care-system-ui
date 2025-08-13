export interface FavouriteDoctor {
    id: string;
    name: string;
    specialty: string;
    image: string;
    rating: number;
    nextAvailability: string;
    location: string;
    lastBookDate: string;
    isVerified: boolean;
}

export const mockFavouriteDoctors: FavouriteDoctor[] = [
    {
        id: '1',
        name: 'Dr.Edalin Hendry',
        specialty: 'MD - Cardiology',
        image: './src/assets/img/doctor-grid/doctor-list-01.jpg',
        rating: 5.0,
        nextAvailability: '23 Mar 2024',
        location: 'Newyork, USA',
        lastBookDate: '21 Jan 2023',
        isVerified: true,
    },
    {
        id: '2',
        name: 'Dr.Shanta Nesmith',
        specialty: 'DO - Oncology',
        image: './src/assets/img/doctor-grid/doctor-list-02.jpg',
        rating: 4.0,
        nextAvailability: '27 Mar 2024',
        location: 'Los Angeles, USA',
        lastBookDate: '18 Jan 2023',
        isVerified: true,
    },
    {
        id: '3',
        name: 'Dr.John Ewel',
        specialty: 'MD - Orthopedics',
        image: './src/assets/img/doctor-grid/doctor-list-03.jpg',
        rating: 5.0,
        nextAvailability: '02 Apr 2024',
        location: 'Dallas, USA',
        lastBookDate: '28 Jan 2023',
        isVerified: true,
    },
    {
        id: '4',
        name: 'Dr.Susan Fenimore',
        specialty: 'DO - Dermatology',
        image: './src/assets/img/doctor-grid/doctor-list-04.jpg',
        rating: 4.0,
        nextAvailability: '11 Apr 2024',
        location: 'Chicago, USA',
        lastBookDate: '08 Feb 2023',
        isVerified: true,
    },
    {
        id: '5',
        name: 'Dr.Juliet Rios',
        specialty: 'MD - Neurology',
        image: './src/assets/img/doctor-grid/doctor-list-05.jpg',
        rating: 5.0,
        nextAvailability: '18 Apr 2024',
        location: 'Detroit, USA',
        lastBookDate: '16 Feb 2023',
        isVerified: true,
    },
    {
        id: '6',
        name: 'Dr.Joseph Engels',
        specialty: 'MD - Pediatrics',
        image: './src/assets/img/doctor-grid/doctor-list-06.jpg',
        rating: 4.0,
        nextAvailability: '10 May 2024',
        location: 'Las Vegas, USA',
        lastBookDate: '08 Mar 2023',
        isVerified: true,
    },
    {
        id: '7',
        name: 'Dr.Victoria Selzer',
        specialty: 'DO - Anesthesiology',
        image: './src/assets/img/doctor-grid/doctor-list-07.jpg',
        rating: 5.0,
        nextAvailability: '20 May 2024',
        location: 'Denver, USA',
        lastBookDate: '18 Mar 2023',
        isVerified: true,
    },
    {
        id: '8',
        name: 'Dr.Benjamin Hedge',
        specialty: 'DO - Endocrinology',
        image: './src/assets/img/doctor-grid/doctor-list-02.jpg',
        rating: 4.0,
        nextAvailability: '24 May 2024',
        location: 'Miami, USA',
        lastBookDate: '21 Mar 2023',
        isVerified: true,
    },
    {
        id: '9',
        name: 'Dr.Kristina Lepley',
        specialty: 'MD - Urology',
        image: './src/assets/img/doctor-grid/doctor-list-01.jpg',
        rating: 5.0,
        nextAvailability: '13 Jun 2024',
        location: 'San Jose, USA',
        lastBookDate: '10 Apr 2023',
        isVerified: true,
    },
];
