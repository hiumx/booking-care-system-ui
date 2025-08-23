import React, { useState } from 'react';
import SideBar from './components/SideBar';
import DoctorCard from './components/DoctorCard';

// Import images
import docProfile01 from '@/assets/img/doctor-grid/doctor-grid-01.jpg';
import docProfile02 from '@/assets/img/doctor-grid/doctor-grid-02.jpg';
import docProfile03 from '@/assets/img/doctor-grid/doctor-grid-03.jpg';
import docProfile04 from '@/assets/img/doctor-grid/doctor-grid-04.jpg';
import docProfile05 from '@/assets/img/doctor-grid/doctor-grid-05.jpg';
import docProfile06 from '@/assets/img/doctor-grid/doctor-grid-06.jpg';
import docProfile07 from '@/assets/img/doctor-grid/doctor-grid-07.jpg';
import docProfile08 from '@/assets/img/doctor-grid/doctor-grid-08.jpg';
import docProfile09 from '@/assets/img/doctor-grid/doctor-grid-09.jpg';
import docProfile10 from '@/assets/img/doctor-grid/doctor-grid-10.jpg';
import docProfile11 from '@/assets/img/doctor-grid/doctor-grid-11.jpg';
import docProfile12 from '@/assets/img/doctor-grid/doctor-grid-12.jpg';

interface Doctor {
    id: string;
    name: string;
    specialty: string;
    location: string;
    consultationTime: string;
    consultationFee: number;
    rating: number;
    available: boolean;
    image: string; // Imported image module
    specialtyColor: string;
}

const mockDoctors: Doctor[] = [
    {
        id: '1',
        name: 'Dr. Michael Brown',
        specialty: 'Psychologist',
        location: 'Minneapolis, MN',
        consultationTime: '30 Min',
        consultationFee: 650,
        rating: 5.0,
        available: true,
        image: docProfile01,
        specialtyColor: 'indigo',
    },
    {
        id: '2',
        name: 'Dr. Nicholas Tello',
        specialty: 'Pediatrician',
        location: 'Ogden, IA',
        consultationTime: '60 Min',
        consultationFee: 400,
        rating: 4.6,
        available: true,
        image: docProfile02,
        specialtyColor: 'pink',
    },
    {
        id: '3',
        name: 'Dr. Harold Bryant',
        specialty: 'Neurologist',
        location: 'Winona, MS',
        consultationTime: '30 Min',
        consultationFee: 500,
        rating: 4.8,
        available: true,
        image: docProfile03,
        specialtyColor: 'teal',
    },
    {
        id: '4',
        name: 'Dr. Sandra Jones',
        specialty: 'Cardiologist',
        location: 'Beckley, WV',
        consultationTime: '30 Min',
        consultationFee: 550,
        rating: 4.8,
        available: true,
        image: docProfile04,
        specialtyColor: 'info',
    },
    {
        id: '5',
        name: 'Dr. Charles Scott',
        specialty: 'Neurologist',
        location: 'Hamshire, TX',
        consultationTime: '30 Min',
        consultationFee: 600,
        rating: 4.2,
        available: true,
        image: docProfile05,
        specialtyColor: 'teal',
    },
    {
        id: '6',
        name: 'Dr. Robert Thomas',
        specialty: 'Cardiologist',
        location: 'Oakland, CA',
        consultationTime: '30 Min',
        consultationFee: 450,
        rating: 4.2,
        available: true,
        image: docProfile06,
        specialtyColor: 'info',
    },
    {
        id: '7',
        name: 'Dr. Margaret Koller',
        specialty: 'Psychologist',
        location: 'Killeen, TX',
        consultationTime: '30 Min',
        consultationFee: 450,
        rating: 4.7,
        available: true,
        image: docProfile07,
        specialtyColor: 'indigo',
    },
    {
        id: '8',
        name: 'Dr. Cath Busick',
        specialty: 'Pediatrician',
        location: 'Schenectady, NY',
        consultationTime: '30 Min',
        consultationFee: 750,
        rating: 4.7,
        available: false,
        image: docProfile08,
        specialtyColor: 'pink',
    },
    {
        id: '9',
        name: 'Dr. Travis Barton',
        specialty: 'Psychologist',
        location: 'Metairie, LA',
        consultationTime: '60 Min',
        consultationFee: 480,
        rating: 4.9,
        available: true,
        image: docProfile09,
        specialtyColor: 'indigo',
    },
    {
        id: '10',
        name: 'Dr. Daisy Malcolm',
        specialty: 'Gastroenterology',
        location: 'Lexington, KY',
        consultationTime: '60 Min',
        consultationFee: 520,
        rating: 5.0,
        available: true,
        image: docProfile10,
        specialtyColor: 'danger',
    },
    {
        id: '11',
        name: 'Dr. Tyrone Patrick',
        specialty: 'Cardiologist',
        location: 'Clark Fork, ID',
        consultationTime: '30 Min',
        consultationFee: 360,
        rating: 4.4,
        available: false,
        image: docProfile11,
        specialtyColor: 'info',
    },
    {
        id: '12',
        name: 'Dr. Ann Bell',
        specialty: 'Pediatrician',
        location: 'Minneapolis, MN',
        consultationTime: '30 Min',
        consultationFee: 630,
        rating: 4.2,
        available: false,
        image: docProfile12,
        specialtyColor: 'pink',
    },
];

const DoctorList: React.FC = () => {
    const [sortOption, setSortOption] = useState('Price (Low to High)');

    return (
        <div className="content mt-5">
            <div className="container">
                <div className="row">
                    <SideBar />
                    <div className="col-xl-9">
                        <div className="row align-items-center">
                            <div className="col-md-6">
                                <div className="mb-4">
                                    <h3>
                                        Showing{' '}
                                        <span className="text-secondary">{mockDoctors.length}</span>{' '}
                                        Doctors For You
                                    </h3>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center justify-content-end mb-4">
                                    <div className="doctor-filter-availability me-2">
                                        <p>Availability</p>
                                        <div className="status-toggle status-tog">
                                            <input
                                                type="checkbox"
                                                id="status_6"
                                                className="check"
                                            />
                                            <label htmlFor="status_6" className="checktoggle">
                                                checkbox
                                            </label>
                                        </div>
                                    </div>
                                    <div className="dropdown header-dropdown me-2">
                                        <a
                                            className="dropdown-toggle sort-dropdown"
                                            data-bs-toggle="dropdown"
                                            href="javascript:void(0);"
                                            aria-expanded="false"
                                        >
                                            <span>Sort By</span>
                                            {sortOption}
                                        </a>
                                        <div className="dropdown-menu dropdown-menu-end">
                                            <a
                                                href="javascript:void(0);"
                                                className="dropdown-item"
                                                onClick={() => setSortOption('Price (Low to High)')}
                                            >
                                                Price (Low to High)
                                            </a>
                                            <a
                                                href="javascript:void(0);"
                                                className="dropdown-item"
                                                onClick={() => setSortOption('Price (High to Low)')}
                                            >
                                                Price (High to Low)
                                            </a>
                                        </div>
                                    </div>
                                    <a
                                        href="doctor-grid.html"
                                        className="btn btn-sm head-icon active me-2"
                                    >
                                        <i className="isax isax-grid-7"></i>
                                    </a>
                                    <a href="search-2.html" className="btn btn-sm head-icon me-2">
                                        <i className="isax isax-row-vertical"></i>
                                    </a>
                                    <a href="map-list.html" className="btn btn-sm head-icon">
                                        <i className="isax isax-location"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            {mockDoctors
                                .sort((a, b) =>
                                    sortOption === 'Price (Low to High)'
                                        ? a.consultationFee - b.consultationFee
                                        : b.consultationFee - a.consultationFee
                                )
                                .map((doctor) => (
                                    <DoctorCard key={doctor.id} doctor={doctor} />
                                ))}
                            <div className="col-md-12">
                                <div className="text-center mb-4">
                                    <a
                                        href="login.html"
                                        className="btn btn-md btn-primary-gradient d-inline-flex align-items-center rounded-pill"
                                    >
                                        <i className="isax isax-d-cube-scan5 me-2"></i>
                                        Load More 425 Doctors
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorList;
