import React, { useState } from 'react';
import clsx from 'clsx';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import SpecialityCard from './components/SpecialityCard';
import styles from './SpecialtiesList.module.scss';

import speciality01 from '@/assets/img/specialities/speciality-01.svg';
import speciality02 from '@/assets/img/specialities/speciality-02.svg';
import speciality03 from '@/assets/img/specialities/speciality-03.svg';

const SpecialtiesList: React.FC = () => {
    // Mock data for specialties aligned with database schema
    const images = [speciality01, speciality02, speciality03];
    const specialtyData = [
        {
            id: 1,
            name: 'Xương khớp',
            image_url: images[0],
            status: 'ACTIVE',
            created_at: '2025-01-01T00:00:00',
            updated_at: '2025-01-01T00:00:00',
        },
        {
            id: 2,
            name: 'Tim mạch',
            image_url: images[1],
            status: 'ACTIVE',
            created_at: '2025-01-01T00:00:00',
            updated_at: '2025-01-01T00:00:00',
        },
        {
            id: 3,
            name: 'Thần kinh',
            image_url: images[2],
            status: 'ACTIVE',
            created_at: '2025-01-01T00:00:00',
            updated_at: '2025-01-01T00:00:00',
        },
        {
            id: 4,
            name: 'Nhi khoa',
            image_url: images[0],
            status: 'ACTIVE',
            created_at: '2025-01-01T00:00:00',
            updated_at: '2025-01-01T00:00:00',
        },
        {
            id: 5,
            name: 'Da liễu',
            image_url: images[1],
            status: 'ACTIVE',
            created_at: '2025-01-01T00:00:00',
            updated_at: '2025-01-01T00:00:00',
        },
        {
            id: 6,
            name: 'Mắt',
            image_url: images[2],
            status: 'ACTIVE',
            created_at: '2025-01-01T00:00:00',
            updated_at: '2025-01-01T00:00:00',
        },
        {
            id: 7,
            name: 'Tiêu hóa',
            image_url: images[0],
            status: 'ACTIVE',
            created_at: '2025-01-01T00:00:00',
            updated_at: '2025-01-01T00:00:00',
        },
        {
            id: 8,
            name: 'Tiết niệu',
            image_url: images[1],
            status: 'ACTIVE',
            created_at: '2025-01-01T00:00offers:00',
            updated_at: '2025-01-01T00:00:00',
        },
        {
            id: 9,
            name: 'Ung bướu',
            image_url: images[2],
            status: 'ACTIVE',
            created_at: '2025-01-01T00:00:00',
            updated_at: '2025-01-01T00:00:00',
        },
        {
            id: 10,
            name: 'Nội tiết',
            image_url: images[0],
            status: 'ACTIVE',
            created_at: '2025-01-01T00:00:00',
            updated_at: '2025-01-01T00:00:00',
        },
        {
            id: 11,
            name: 'Thận học',
            image_url: images[1],
            status: 'ACTIVE',
            created_at: '2025-01-01T00:00:00',
            updated_at: '2025-01-01T00:00:00',
        },
        {
            id: 12,
            name: 'Hô hấp',
            image_url: images[2],
            status: 'ACTIVE',
            created_at: '2025-01-01T00:00:00',
            updated_at: '2025-01-01T00:00:00',
        },
        {
            id: 13,
            name: 'Cơ xương khớp',
            image_url: images[0],
            status: 'ACTIVE',
            created_at: '2025-01-01T00:00:00',
            updated_at: '2025-01-01T00:00:00',
        },
        {
            id: 14,
            name: 'Huyết học',
            image_url: images[1],
            status: 'ACTIVE',
            created_at: '2025-01-01T00:00:00',
            updated_at: '2025-01-01T00:00:00',
        },
        {
            id: 15,
            name: 'Dị ứng',
            image_url: images[2],
            status: 'ACTIVE',
            created_at: '2025-01-01T00:00:00',
            updated_at: '2025-01-01T00:00:00',
        },
        {
            id: 16,
            name: 'Miễn dịch học',
            image_url: images[0],
            status: 'ACTIVE',
            created_at: '2025-01-01T00:00:00',
            updated_at: '2025-01-01T00:00:00',
        },
        {
            id: 17,
            name: 'Tâm thần học',
            image_url: images[1],
            status: 'ACTIVE',
            created_at: '2025-01-01T00:00:00',
            updated_at: '2025-01-01T00:00:00',
        },
        {
            id: 18,
            name: 'Gây mê',
            image_url: images[2],
            status: 'ACTIVE',
            created_at: '2025-01-01T00:00:00',
            updated_at: '2025-01-01T00:00:00',
        },
        {
            id: 19,
            name: 'Chẩn đoán hình ảnh',
            image_url: images[0],
            status: 'ACTIVE',
            created_at: '2025-01-01T00:00:00',
            updated_at: '2025-01-01T00:00:00',
        },
        {
            id: 20,
            name: 'Bệnh lý học',
            image_url: images[1],
            status: 'ACTIVE',
            created_at: '2025-01-01T00:00:00',
            updated_at: '2025-01-01T00:00:00',
        },
    ];

    // Mock data for doctors to calculate doctorCount
    const doctors = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        specialty_id: Math.floor(Math.random() * 20) + 1, // Randomly assign specialty_id from 1 to 20
        account_id: i + 1,
        email: `doctor${i + 1}@example.com`,
        first_name: `Bác sĩ ${i + 1}`,
        last_name: 'Nguyễn',
        gender: ['MALE', 'FEMALE', 'OTHER'][Math.floor(Math.random() * 3)],
        created_at: '2025-01-01T00:00:00',
        updated_at: '2025-01-01T00:00:00',
    }));

    // Calculate doctorCount for each specialty
    const specialties = specialtyData.map((specialty) => ({
        ...specialty,
        doctorCount: doctors.filter((doctor) => doctor.specialty_id === specialty.id).length,
    }));

    // State for search
    const [search, setSearch] = useState('');

    // Filter data
    const filteredData = specialties.filter((item) => {
        const isSearchMatch =
            search === '' || item.name.toLowerCase().includes(search.toLowerCase());
        return item.status === 'ACTIVE' && isSearchMatch;
    });

    // Breadcrumb data
    const breadcrumbData = {
        items: [
            { label: 'Trang chủ', path: '/', isActive: false },
            { label: 'Chuyên khoa', isActive: true },
        ],
        title: 'Danh sách chuyên khoa',
    };

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
            <div className={clsx('content', 'speciality-content')}>
                <div className={clsx('container')}>
                    {/* Show Result */}
                    <div className={clsx('card')}>
                        <div className={clsx('card-body')}>
                            <div
                                className={clsx(
                                    'd-flex',
                                    'align-items-center',
                                    'justify-content-between',
                                    'result-wrap'
                                )}
                            >
                                <h5 className={clsx(styles.customh5)}>
                                    Hiển thị{' '}
                                    <span className={clsx(styles.resultCount)}>
                                        {filteredData.length}
                                    </span>{' '}
                                    chuyên khoa
                                </h5>
                                <div className={clsx('input-block', 'dash-search-input')}>
                                    <input
                                        type="text"
                                        className={clsx('form-control')}
                                        placeholder="Tìm kiếm chuyên khoa"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <span className={clsx('search-icon')}>
                                        <i className={clsx('isax', 'isax-search-normal')}></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /Show Result */}
                    <div className={clsx('all-specialities')}>
                        <div className={clsx('row')}>
                            {filteredData.map((speciality) => (
                                <SpecialityCard
                                    key={speciality.id}
                                    id={speciality.id}
                                    name={speciality.name}
                                    doctorCount={speciality.doctorCount}
                                    image_url={speciality.image_url}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default SpecialtiesList;
