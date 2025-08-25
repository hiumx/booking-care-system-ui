import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SideBar from './components/SideBar';
import DoctorAppointmentBookingCard from '@/components/DoctorAppointmentBookingCard';
import Pagination from '@/components/Pagination';
import Select from '@/components/Select';
import styles from './DoctorList.module.scss';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import SearchResult from '@/pages/Doctor/SearchResult';
import browseCategorie from '@/assets/img/icons/browse-categorie.svg';

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
    doctorId: string;
    name: string;
    specialty: string;
    position: string;
    location: string;
    consultationTime: string;
    consultationFee: number;
    rating: number;
    available: boolean;
    image: string;
    bookCounts: number;
    yearsOfExperience: number;
    isFavorite: boolean;
    likeCounts: number;
    dislikeCounts: number;
}

const mockDoctors: Doctor[] = [
    {
        doctorId: '1',
        name: 'BS. Nguyễn Văn Minh',
        specialty: 'Tâm lý học',
        position: 'Bác sĩ Tâm lý Cao cấp',
        location: 'Quận 1, TP. Hồ Chí Minh',
        consultationTime: '09:00',
        consultationFee: 650000,
        rating: 5.0,
        available: true,
        image: docProfile01,
        bookCounts: 25,
        yearsOfExperience: 15,
        isFavorite: false,
        likeCounts: 20,
        dislikeCounts: 1,
    },
    {
        doctorId: '2',
        name: 'BS. Trần Thị Hồng',
        specialty: 'Nhi khoa',
        position: 'Chuyên gia Nhi khoa',
        location: 'Quận 3, TP. Hồ Chí Minh',
        consultationTime: '10:30',
        consultationFee: 400000,
        rating: 4.6,
        available: true,
        image: docProfile02,
        bookCounts: 30,
        yearsOfExperience: 8,
        isFavorite: true,
        likeCounts: 15,
        dislikeCounts: 2,
    },
    {
        doctorId: '3',
        name: 'BS. Lê Quang Vinh',
        specialty: 'Thần kinh',
        position: 'Trưởng khoa Thần kinh',
        location: 'Quận 7, TP. Hồ Chí Minh',
        consultationTime: '11:00',
        consultationFee: 500000,
        rating: 4.8,
        available: true,
        image: docProfile03,
        bookCounts: 18,
        yearsOfExperience: 12,
        isFavorite: false,
        likeCounts: 22,
        dislikeCounts: 0,
    },
    {
        doctorId: '4',
        name: 'BS. Phạm Thị Lan',
        specialty: 'Tim mạch',
        position: 'Bác sĩ Tim mạch Cao cấp',
        location: 'Quận 5, TP. Hồ Chí Minh',
        consultationTime: '14:00',
        consultationFee: 550000,
        rating: 4.8,
        available: true,
        image: docProfile04,
        bookCounts: 40,
        yearsOfExperience: 10,
        isFavorite: true,
        likeCounts: 25,
        dislikeCounts: 3,
    },
    {
        doctorId: '5',
        name: 'BS. Hoàng Văn Hùng',
        specialty: 'Thần kinh',
        position: 'Tư vấn Thần kinh',
        location: 'Quận Bình Thạnh, TP. Hồ Chí Minh',
        consultationTime: '15:30',
        consultationFee: 600000,
        rating: 4.2,
        available: true,
        image: docProfile05,
        bookCounts: 12,
        yearsOfExperience: 7,
        isFavorite: false,
        likeCounts: 10,
        dislikeCounts: 5,
    },
    {
        doctorId: '6',
        name: 'BS. Nguyễn Thành Đạt',
        specialty: 'Tim mạch',
        position: 'Chuyên gia Tim mạch',
        location: 'Quận 10, TP. Hồ Chí Minh',
        consultationTime: '08:00',
        consultationFee: 450000,
        rating: 4.2,
        available: true,
        image: docProfile06,
        bookCounts: 35,
        yearsOfExperience: 9,
        isFavorite: false,
        likeCounts: 18,
        dislikeCounts: 2,
    },
    {
        doctorId: '7',
        name: 'BS. Võ Thị Mai',
        specialty: 'Tâm lý học',
        position: 'Bác sĩ Tâm lý Lâm sàng',
        location: 'Quận Phú Nhuận, TP. Hồ Chí Minh',
        consultationTime: '13:00',
        consultationFee: 450000,
        rating: 4.7,
        available: true,
        image: docProfile07,
        bookCounts: 28,
        yearsOfExperience: 14,
        isFavorite: true,
        likeCounts: 30,
        dislikeCounts: 1,
    },
    {
        doctorId: '8',
        name: 'BS. Đặng Thị Thu',
        specialty: 'Nhi khoa',
        position: 'Tư vấn Nhi khoa',
        location: 'Quận Gò Vấp, TP. Hồ Chí Minh',
        consultationTime: 'Không có lịch',
        consultationFee: 750000,
        rating: 4.7,
        available: false,
        image: docProfile08,
        bookCounts: 22,
        yearsOfExperience: 11,
        isFavorite: false,
        likeCounts: 19,
        dislikeCounts: 4,
    },
    {
        doctorId: '9',
        name: 'BS. Trần Văn Long',
        specialty: 'Tâm lý học',
        position: 'Bác sĩ Tâm lý Cao cấp',
        location: 'Quận Tân Bình, TP. Hồ Chí Minh',
        consultationTime: '16:00',
        consultationFee: 480000,
        rating: 4.9,
        available: true,
        image: docProfile09,
        bookCounts: 15,
        yearsOfExperience: 13,
        isFavorite: false,
        likeCounts: 21,
        dislikeCounts: 0,
    },
    {
        doctorId: '10',
        name: 'BS. Nguyễn Thị Hương',
        specialty: 'Tiêu hóa',
        position: 'Chuyên gia Tiêu hóa',
        location: 'Quận 2, TP. Hồ Chí Minh',
        consultationTime: '09:30',
        consultationFee: 520000,
        rating: 5.0,
        available: true,
        image: docProfile10,
        bookCounts: 33,
        yearsOfExperience: 16,
        isFavorite: true,
        likeCounts: 28,
        dislikeCounts: 1,
    },
    {
        doctorId: '11',
        name: 'BS. Lê Văn Tâm',
        specialty: 'Tim mạch',
        position: 'Tư vấn Tim mạch',
        location: 'Quận Thủ Đức, TP. Hồ Chí Minh',
        consultationTime: 'Không có lịch',
        consultationFee: 360000,
        rating: 4.4,
        available: false,
        image: docProfile11,
        bookCounts: 10,
        yearsOfExperience: 6,
        isFavorite: false,
        likeCounts: 12,
        dislikeCounts: 3,
    },
    {
        doctorId: '12',
        name: 'BS. Hồ Thị Ngọc',
        specialty: 'Nhi khoa',
        position: 'Chuyên gia Nhi khoa',
        location: 'Quận 1, TP. Hồ Chí Minh',
        consultationTime: 'Không có lịch',
        consultationFee: 630000,
        rating: 4.2,
        available: false,
        image: docProfile12,
        bookCounts: 17,
        yearsOfExperience: 8,
        isFavorite: false,
        likeCounts: 14,
        dislikeCounts: 2,
    },
];

const breadcrumbData = {
    title: 'Danh sách bác sĩ',
    items: [
        { label: 'Trang chủ', path: '/', isActive: false },
        { label: 'Danh sách bác sĩ', isActive: true },
    ],
};

const DoctorList: React.FC = () => {
    const [sortOption, setSortOption] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const doctorsPerPage = 6;
    const patientId = '1';

    const sortOptions = [
        { label: 'Giá từ thấp đến cao', value: 'low-to-high' },
        { label: 'Giá từ cao đến thấp', value: 'high-to-low' },
    ];

    const totalPages = Math.ceil(mockDoctors.length / doctorsPerPage);

    const sortedDoctors = [...mockDoctors].sort((a, b) => {
        if (sortOption === 'low-to-high') {
            return a.consultationFee - b.consultationFee;
        } else if (sortOption === 'high-to-low') {
            return b.consultationFee - a.consultationFee;
        }
        return 0;
    });

    const indexOfLastDoctor = currentPage * doctorsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
    const currentDoctors = sortedDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
            <SearchResult />
            <div className="content mt-5">
                <div className="container">
                    <div className="row">
                        <SideBar />
                        <div className="col-xl-9">
                            <div className="card">
                                <div className="card-body">
                                    <div
                                        className={`${styles.filterContainer} d-flex align-items-center justify-content-between result-wrap`}
                                    >
                                        <h5 className={styles.h5Custom}>
                                            Hiển thị{' '}
                                            <span className="text-secondary">
                                                {mockDoctors.length}
                                            </span>{' '}
                                            Bác sĩ Dành Cho Bạn
                                        </h5>
                                        <div className="d-flex align-items-center gap-3">
                                            <Select
                                                title="Sắp xếp theo"
                                                value={sortOption}
                                                onChange={setSortOption}
                                                items={sortOptions}
                                                image={browseCategorie}
                                            />
                                            <Link
                                                to="/doctor-grid"
                                                className={`${styles.headIcon} ${styles.active}`}
                                            >
                                                <i className="isax isax-grid-7"></i>
                                            </Link>
                                            <Link to="/search-2" className={`${styles.headIcon}`}>
                                                <i className="isax isax-row-vertical"></i>
                                            </Link>
                                            <Link to="/map-list" className={`${styles.headIcon}`}>
                                                <i className="isax isax-location"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                {currentDoctors.map((doctor) => (
                                    <DoctorAppointmentBookingCard
                                        key={doctor.doctorId}
                                        doctorId={doctor.doctorId}
                                        patientId={patientId}
                                        name={doctor.name}
                                        specialty={doctor.specialty}
                                        position={doctor.position}
                                        bookCounts={doctor.bookCounts}
                                        rating={doctor.rating}
                                        location={doctor.location}
                                        yearsOfExperience={doctor.yearsOfExperience}
                                        fees={doctor.consultationFee}
                                        isFavorite={doctor.isFavorite}
                                        likeCounts={doctor.likeCounts}
                                        dislikeCounts={doctor.dislikeCounts}
                                        nextAvailableTime={
                                            doctor.available
                                                ? doctor.consultationTime
                                                : 'Không có lịch'
                                        }
                                        image={doctor.image}
                                    />
                                ))}
                                <div className="col-md-12">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                        showPrevNext={true}
                                        maxVisiblePages={5}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default DoctorList;
