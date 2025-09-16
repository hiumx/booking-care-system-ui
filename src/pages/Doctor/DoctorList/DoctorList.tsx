import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SideBar from './components/SideBar';
import {
    DoctorAppointmentBookingCard,
    DoctorAppointmentBookingCardSkeleton,
} from './components/DoctorAppointmentBookingCard';
import Pagination from '@/components/Pagination';
import Select from '@/components/Select';
import styles from './DoctorList.module.scss';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import browseCategorie from '@/assets/img/icons/browse-categorie.svg';
import SearchInput from '@/components/SearchInput';

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
    {
        doctorId: '13',
        name: 'BS. Nguyễn Văn Hùng',
        specialty: 'Da liễu',
        position: 'Chuyên gia Da liễu',
        location: 'Quận Hoàn Kiếm, Hà Nội',
        consultationTime: '10:00',
        consultationFee: 550000,
        rating: 4.9,
        available: true,
        image: docProfile01,
        bookCounts: 20,
        yearsOfExperience: 10,
        isFavorite: true,
        likeCounts: 23,
        dislikeCounts: 1,
    },
    {
        doctorId: '14',
        name: 'BS. Trần Thị Mai',
        specialty: 'Mắt',
        position: 'Bác sĩ Nhãn khoa',
        location: 'Quận Ba Đình, Hà Nội',
        consultationTime: '14:30',
        consultationFee: 450000,
        rating: 4.7,
        available: true,
        image: docProfile02,
        bookCounts: 15,
        yearsOfExperience: 9,
        isFavorite: false,
        likeCounts: 18,
        dislikeCounts: 2,
    },
    {
        doctorId: '15',
        name: 'BS. Phạm Văn Nam',
        specialty: 'Tai mũi họng',
        position: 'Chuyên gia Tai mũi họng',
        location: 'Quận Hải Châu, Đà Nẵng',
        consultationTime: '09:00',
        consultationFee: 400000,
        rating: 4.6,
        available: true,
        image: docProfile03,
        bookCounts: 22,
        yearsOfExperience: 7,
        isFavorite: false,
        likeCounts: 20,
        dislikeCounts: 0,
    },
    {
        doctorId: '16',
        name: 'BS. Lê Thị Hạnh',
        specialty: 'Nội tiết',
        position: 'Tư vấn Nội tiết',
        location: 'Quận Thanh Khê, Đà Nẵng',
        consultationTime: 'Không có lịch',
        consultationFee: 500000,
        rating: 4.5,
        available: false,
        image: docProfile04,
        bookCounts: 12,
        yearsOfExperience: 8,
        isFavorite: true,
        likeCounts: 15,
        dislikeCounts: 3,
    },
    {
        doctorId: '17',
        name: 'BS. Võ Văn An',
        specialty: 'Chỉnh hình',
        position: 'Bác sĩ Chỉnh hình',
        location: 'Quận Cẩm Lệ, Đà Nẵng',
        consultationTime: '11:30',
        consultationFee: 600000,
        rating: 4.8,
        available: true,
        image: docProfile05,
        bookCounts: 28,
        yearsOfExperience: 12,
        isFavorite: false,
        likeCounts: 25,
        dislikeCounts: 2,
    },
    {
        doctorId: '18',
        name: 'BS. Nguyễn Thị Lan',
        specialty: 'Phổi',
        position: 'Chuyên gia Hô hấp',
        location: 'Quận 4, TP. Hồ Chí Minh',
        consultationTime: '15:00',
        consultationFee: 480000,
        rating: 4.7,
        available: true,
        image: docProfile06,
        bookCounts: 19,
        yearsOfExperience: 11,
        isFavorite: true,
        likeCounts: 22,
        dislikeCounts: 1,
    },
    {
        doctorId: '19',
        name: 'BS. Trần Văn Hòa',
        specialty: 'Tâm lý học',
        position: 'Bác sĩ Tâm lý',
        location: 'Quận Cầu Giấy, Hà Nội',
        consultationTime: '13:30',
        consultationFee: 700000,
        rating: 4.9,
        available: true,
        image: docProfile07,
        bookCounts: 30,
        yearsOfExperience: 15,
        isFavorite: false,
        likeCounts: 28,
        dislikeCounts: 0,
    },
    {
        doctorId: '20',
        name: 'BS. Phạm Thị Hồng',
        specialty: 'Nhi khoa',
        position: 'Tư vấn Nhi khoa',
        location: 'Quận Hai Bà Trưng, Hà Nội',
        consultationTime: 'Không có lịch',
        consultationFee: 420000,
        rating: 4.3,
        available: false,
        image: docProfile08,
        bookCounts: 14,
        yearsOfExperience: 6,
        isFavorite: false,
        likeCounts: 10,
        dislikeCounts: 4,
    },
    {
        doctorId: '21',
        name: 'BS. Nguyễn Văn Bình',
        specialty: 'Tim mạch',
        position: 'Chuyên gia Tim mạch',
        location: 'Quận 9, TP. Hồ Chí Minh',
        consultationTime: '10:00',
        consultationFee: 510000,
        rating: 4.6,
        available: true,
        image: docProfile09,
        bookCounts: 24,
        yearsOfExperience: 10,
        isFavorite: true,
        likeCounts: 20,
        dislikeCounts: 2,
    },
    {
        doctorId: '22',
        name: 'BS. Lê Thị Thu',
        specialty: 'Tiêu hóa',
        position: 'Bác sĩ Tiêu hóa',
        location: 'Quận Hồng Bàng, Hải Phòng',
        consultationTime: '14:00',
        consultationFee: 470000,
        rating: 4.5,
        available: true,
        image: docProfile10,
        bookCounts: 18,
        yearsOfExperience: 9,
        isFavorite: false,
        likeCounts: 16,
        dislikeCounts: 1,
    },
    {
        doctorId: '23',
        name: 'BS. Trần Văn Tuấn',
        specialty: 'Da liễu',
        position: 'Chuyên gia Da liễu',
        location: 'Quận Lê Chân, Hải Phòng',
        consultationTime: 'Không có lịch',
        consultationFee: 530000,
        rating: 4.7,
        available: false,
        image: docProfile11,
        bookCounts: 16,
        yearsOfExperience: 11,
        isFavorite: false,
        likeCounts: 19,
        dislikeCounts: 3,
    },
    {
        doctorId: '24',
        name: 'BS. Phạm Thị Ngọc',
        specialty: 'Mắt',
        position: 'Bác sĩ Nhãn khoa',
        location: 'Quận 6, TP. Hồ Chí Minh',
        consultationTime: '12:00',
        consultationFee: 490000,
        rating: 4.8,
        available: true,
        image: docProfile12,
        bookCounts: 21,
        yearsOfExperience: 13,
        isFavorite: true,
        likeCounts: 24,
        dislikeCounts: 1,
    },
    {
        doctorId: '25',
        name: 'BS. Nguyễn Văn Quang',
        specialty: 'Tai mũi họng',
        position: 'Tư vấn Tai mũi họng',
        location: 'Quận Ninh Kiều, Cần Thơ',
        consultationTime: '09:30',
        consultationFee: 450000,
        rating: 4.6,
        available: true,
        image: docProfile01,
        bookCounts: 20,
        yearsOfExperience: 8,
        isFavorite: false,
        likeCounts: 17,
        dislikeCounts: 2,
    },
    {
        doctorId: '26',
        name: 'BS. Lê Thị Minh',
        specialty: 'Nội tiết',
        position: 'Chuyên gia Nội tiết',
        location: 'Quận Bình Thủy, Cần Thơ',
        consultationTime: '15:00',
        consultationFee: 510000,
        rating: 4.7,
        available: true,
        image: docProfile02,
        bookCounts: 22,
        yearsOfExperience: 10,
        isFavorite: true,
        likeCounts: 20,
        dislikeCounts: 1,
    },
    {
        doctorId: '27',
        name: 'BS. Trần Văn Hùng',
        specialty: 'Chỉnh hình',
        position: 'Bác sĩ Chỉnh hình',
        location: 'Quận Đống Đa, Hà Nội',
        consultationTime: 'Không có lịch',
        consultationFee: 600000,
        rating: 4.5,
        available: false,
        image: docProfile03,
        bookCounts: 15,
        yearsOfExperience: 9,
        isFavorite: false,
        likeCounts: 18,
        dislikeCounts: 3,
    },
    {
        doctorId: '28',
        name: 'BS. Phạm Thị Lan',
        specialty: 'Phổi',
        position: 'Tư vấn Hô hấp',
        location: 'Quận 11, TP. Hồ Chí Minh',
        consultationTime: '10:30',
        consultationFee: 470000,
        rating: 4.6,
        available: true,
        image: docProfile04,
        bookCounts: 19,
        yearsOfExperience: 8,
        isFavorite: false,
        likeCounts: 16,
        dislikeCounts: 2,
    },
    {
        doctorId: '29',
        name: 'BS. Nguyễn Văn Long',
        specialty: 'Tâm lý học',
        position: 'Bác sĩ Tâm lý Lâm sàng',
        location: 'Quận Thanh Xuân, Hà Nội',
        consultationTime: '13:00',
        consultationFee: 650000,
        rating: 4.9,
        available: true,
        image: docProfile05,
        bookCounts: 25,
        yearsOfExperience: 14,
        isFavorite: true,
        likeCounts: 22,
        dislikeCounts: 1,
    },
    {
        doctorId: '30',
        name: 'BS. Trần Thị Hương',
        specialty: 'Nhi khoa',
        position: 'Chuyên gia Nhi khoa',
        location: 'Quận Liên Chiểu, Đà Nẵng',
        consultationTime: 'Không có lịch',
        consultationFee: 480000,
        rating: 4.4,
        available: false,
        image: docProfile06,
        bookCounts: 17,
        yearsOfExperience: 7,
        isFavorite: false,
        likeCounts: 15,
        dislikeCounts: 3,
    },
    {
        doctorId: '31',
        name: 'BS. Lê Văn Hòa',
        specialty: 'Tim mạch',
        position: 'Bác sĩ Tim mạch',
        location: 'Quận 8, TP. Hồ Chí Minh',
        consultationTime: '11:00',
        consultationFee: 520000,
        rating: 4.7,
        available: true,
        image: docProfile07,
        bookCounts: 23,
        yearsOfExperience: 11,
        isFavorite: true,
        likeCounts: 20,
        dislikeCounts: 2,
    },
    {
        doctorId: '32',
        name: 'BS. Phạm Thị Minh',
        specialty: 'Tiêu hóa',
        position: 'Tư vấn Tiêu hóa',
        location: 'Quận Ngô Quyền, Hải Phòng',
        consultationTime: '14:30',
        consultationFee: 490000,
        rating: 4.6,
        available: true,
        image: docProfile08,
        bookCounts: 20,
        yearsOfExperience: 9,
        isFavorite: false,
        likeCounts: 18,
        dislikeCounts: 1,
    },
    {
        doctorId: '33',
        name: 'BS. Nguyễn Văn Tâm',
        specialty: 'Da liễu',
        position: 'Bác sĩ Da liễu',
        location: 'Quận Cái Răng, Cần Thơ',
        consultationTime: 'Không có lịch',
        consultationFee: 470000,
        rating: 4.5,
        available: false,
        image: docProfile09,
        bookCounts: 16,
        yearsOfExperience: 8,
        isFavorite: false,
        likeCounts: 17,
        dislikeCounts: 2,
    },
    {
        doctorId: '34',
        name: 'BS. Trần Thị Ngọc',
        specialty: 'Mắt',
        position: 'Chuyên gia Nhãn khoa',
        location: 'Quận Tây Hồ, Hà Nội',
        consultationTime: '09:00',
        consultationFee: 510000,
        rating: 4.8,
        available: true,
        image: docProfile10,
        bookCounts: 22,
        yearsOfExperience: 12,
        isFavorite: true,
        likeCounts: 21,
        dislikeCounts: 1,
    },
    {
        doctorId: '35',
        name: 'BS. Lê Văn Quang',
        specialty: 'Tai mũi họng',
        position: 'Bác sĩ Tai mũi họng',
        location: 'Quận Sơn Trà, Đà Nẵng',
        consultationTime: '12:00',
        consultationFee: 460000,
        rating: 4.7,
        available: true,
        image: docProfile11,
        bookCounts: 19,
        yearsOfExperience: 10,
        isFavorite: false,
        likeCounts: 20,
        dislikeCounts: 2,
    },
    {
        doctorId: '36',
        name: 'BS. Phạm Thị Hạnh',
        specialty: 'Nội tiết',
        position: 'Tư vấn Nội tiết',
        location: 'Quận 12, TP. Hồ Chí Minh',
        consultationTime: 'Không có lịch',
        consultationFee: 480000,
        rating: 4.4,
        available: false,
        image: docProfile12,
        bookCounts: 15,
        yearsOfExperience: 7,
        isFavorite: false,
        likeCounts: 16,
        dislikeCounts: 3,
    },
    {
        doctorId: '37',
        name: 'BS. Nguyễn Văn An',
        specialty: 'Chỉnh hình',
        position: 'Chuyên gia Chỉnh hình',
        location: 'Quận Long Biên, Hà Nội',
        consultationTime: '10:30',
        consultationFee: 550000,
        rating: 4.9,
        available: true,
        image: docProfile01,
        bookCounts: 24,
        yearsOfExperience: 13,
        isFavorite: true,
        likeCounts: 22,
        dislikeCounts: 1,
    },
    {
        doctorId: '38',
        name: 'BS. Trần Thị Lan',
        specialty: 'Phổi',
        position: 'Bác sĩ Hô hấp',
        location: 'Quận Kiến An, Hải Phòng',
        consultationTime: '14:00',
        consultationFee: 470000,
        rating: 4.6,
        available: true,
        image: docProfile02,
        bookCounts: 20,
        yearsOfExperience: 9,
        isFavorite: false,
        likeCounts: 18,
        dislikeCounts: 2,
    },
    {
        doctorId: '39',
        name: 'BS. Lê Văn Long',
        specialty: 'Tâm lý học',
        position: 'Bác sĩ Tâm lý Cao cấp',
        location: 'Quận Thốt Nốt, Cần Thơ',
        consultationTime: 'Không có lịch',
        consultationFee: 600000,
        rating: 4.8,
        available: false,
        image: docProfile03,
        bookCounts: 17,
        yearsOfExperience: 12,
        isFavorite: false,
        likeCounts: 19,
        dislikeCounts: 3,
    },
    {
        doctorId: '40',
        name: 'BS. Phạm Thị Hương',
        specialty: 'Nhi khoa',
        position: 'Chuyên gia Nhi khoa',
        location: 'Quận Nam Từ Liêm, Hà Nội',
        consultationTime: '11:00',
        consultationFee: 520000,
        rating: 4.7,
        available: true,
        image: docProfile04,
        bookCounts: 21,
        yearsOfExperience: 10,
        isFavorite: true,
        likeCounts: 20,
        dislikeCounts: 1,
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
    const [isLoading, setIsLoading] = useState(true);

    const doctorsPerPage = 10; // Cập nhật thành 10 bác sĩ mỗi trang
    const patientId = '1';
    const skeletonKeys = Array.from({ length: 10 }, (_, i) => `skeleton-${i}`);

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

    useEffect(() => {
        // Simulate loading delay
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 400);

        return () => clearTimeout(timer);
    }, []);

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
            <SearchInput />
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
                                            <span className={styles.spanCustom}>
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
                                {isLoading
                                    ? skeletonKeys.map((key) => (
                                          <div className="col-md-12 mb-4" key={key}>
                                              <DoctorAppointmentBookingCardSkeleton />
                                          </div>
                                      ))
                                    : currentDoctors.map((doctor) => (
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
