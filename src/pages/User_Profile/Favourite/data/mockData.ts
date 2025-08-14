export interface FavouriteDoctor {
    id: string;
    name: string;
    specialty: string;
    image: string;
    rating: number;
    numberOfReviews: number;
    level: string;
    location: string;
    experience: string;
    isVerified: boolean;
}

export const mockFavouriteDoctors: FavouriteDoctor[] = [
    {
        id: '1',
        name: 'Nguyễn Văn Biển',
        specialty: 'Tâm Lý',
        image: './src/assets/img/doctor-grid/doctor-list-01.jpg',
        rating: 5.0,
        numberOfReviews: 35,
        level: 'Tiến sĩ tâm lí học',
        location: 'Bệnh viện Đà Nẵng',
        experience: '15',
        isVerified: true,
    },
    {
        id: '2',
        name: 'Dr.Shanta Nesmith',
        specialty: 'DO - Oncology',
        image: './src/assets/img/doctor-grid/doctor-list-02.jpg',
        rating: 4.0,
        numberOfReviews: 35,
        level: '27 Mar 2024',
        location: 'Los Angeles, USA',
        experience: '16',
        isVerified: true,
    },
    {
        id: '3',
        name: 'Dr.John Ewel',
        specialty: 'MD - Orthopedics',
        image: './src/assets/img/doctor-grid/doctor-list-03.jpg',
        rating: 5.0,
        numberOfReviews: 35,
        level: '02 Apr 2024',
        location: 'Dallas, USA',
        experience: '17',
        isVerified: true,
    },
    {
        id: '4',
        name: 'Dr.Susan Fenimore',
        specialty: 'DO - Dermatology',
        image: './src/assets/img/doctor-grid/doctor-list-04.jpg',
        rating: 4.0,
        numberOfReviews: 35,
        level: '11 Apr 2024',
        location: 'Chicago, USA',
        experience: '18',
        isVerified: true,
    },
    {
        id: '5',
        name: 'Dr.Juliet Rios',
        specialty: 'MD - Neurology',
        image: './src/assets/img/doctor-grid/doctor-list-05.jpg',
        rating: 5.0,
        numberOfReviews: 35,
        level: '18 Apr 2024',
        location: 'Detroit, USA',
        experience: '19',
        isVerified: true,
    },
    {
        id: '6',
        name: 'Dr.Joseph Engels',
        specialty: 'MD - Pediatrics',
        image: './src/assets/img/doctor-grid/doctor-list-06.jpg',
        rating: 4.0,
        numberOfReviews: 35,
        level: '10 May 2024',
        location: 'Las Vegas, USA',
        experience: '20',
        isVerified: true,
    },
    {
        id: '7',
        name: 'Dr.Victoria Selzer',
        specialty: 'DO - Anesthesiology',
        image: './src/assets/img/doctor-grid/doctor-list-07.jpg',
        rating: 5.0,
        numberOfReviews: 35,
        level: '20 May 2024',
        location: 'Denver, USA',
        experience: '21',
        isVerified: true,
    },
    {
        id: '8',
        name: 'Dr.Benjamin Hedge',
        specialty: 'DO - Endocrinology',
        image: './src/assets/img/doctor-grid/doctor-list-02.jpg',
        rating: 4.0,
        numberOfReviews: 35,
        level: '24 May 2024',
        location: 'Miami, USA',
        experience: '22',
        isVerified: true,
    },
    {
        id: '9',
        name: 'Dr.Kristina Lepley',
        specialty: 'MD - Urology',
        image: './src/assets/img/doctor-grid/doctor-list-01.jpg',
        rating: 5.0,
        numberOfReviews: 35,
        level: '13 Jun 2024',
        location: 'San Jose, USA',
        experience: '23',
        isVerified: true,
    },
];
