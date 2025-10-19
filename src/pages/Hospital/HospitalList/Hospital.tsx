import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import Select from '@/components/Select';
import HospitalCard from './components/HospitalCard';
import styles from './Hospital.module.scss';

import hospital01 from '@/assets/img/hospitals/hospital-01.svg';
import hospital03 from '@/assets/img/hospitals/hospital-03.svg';
import hospital05 from '@/assets/img/hospitals/hospital-05.svg';
import browseCategorie from '@/assets/img/icons/browse-categorie.svg';
import locationIcon from '@/assets/img/icons/location.svg';

const Hospital: React.FC = () => {
    // Mock data for 40 hospitals matching the hospitals table schema
    const images = [hospital01, hospital03, hospital05];
    const cities = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'];
    const hospitalTypes = ['Bệnh viện'];
    const baseNames = [
        'Bạch Mai',
        'Hồng Ngọc',
        'Chợ Rẫy',
        'Family Medical',
        'Đà Nẵng',
        'Việt Pháp',
        'Hải Phòng',
        'Cần Thơ',
        'Từ Dũ',
        'Nhi Đồng',
        'Vinmec',
        'Hoàn Mỹ',
        'Quân Y',
        'Tư vấn Sức khỏe',
        'Đa khoa Quốc tế',
        'Chuyên khoa Mắt',
        'Phụ sản',
        'Răng Hàm Mặt',
        'Tràng An',
        'Hồng Phúc',
    ];
    const hospitals = Array.from({ length: 40 }, (_, i) => ({
        id: i + 1,
        account_id: i + 1,
        name: `${hospitalTypes[0]} ${baseNames[i % baseNames.length]}${i >= baseNames.length ? ` ${Math.floor(i / baseNames.length) + 1}` : ''}`,
        address: `${Math.floor(Math.random() * 100) + 1} ${['Giải Phóng', 'Yên Ninh', 'Nguyễn Chí Thanh', 'Lê Duẩn', 'Hải Phòng', 'Trần Phú', 'Nguyễn Văn Cừ', 'Lý Thường Kiệt', 'Hùng Vương'][i % 9]}, ${cities[i % cities.length]}`,
        phone: `0${Math.floor(100000000 + Math.random() * 900000000)}`,
        email: `contact${i + 1}@${baseNames[i % baseNames.length].toLowerCase().replace(/\s/g, '')}.com`,
        description: `${hospitalTypes[0]} chất lượng cao tại ${cities[i % cities.length]}. Cung cấp dịch vụ y tế chuyên nghiệp và hiện đại.`,
        background_url: `https://example.com/images/hospital${i + 1}-bg.jpg`,
        avatar_url: images[i % images.length],
        status: 'ACTIVE',
        created_at: '2025-01-01T00:00:00',
        updated_at: '2025-01-01T00:00:00',
    }));

    // State for filtering and pagination
    const [location, setLocation] = useState('');
    const [type, setType] = useState('');
    const [search, setSearch] = useState('');
    const [visibleCount, setVisibleCount] = useState(5);

    // Derive unique locations from addresses
    const uniqueLocations = Array.from(
        new Set(
            hospitals.map((hospital) => {
                const city = hospital.address.split(',').pop()?.trim() || '';
                return city;
            })
        )
    ).map((city) => ({ label: city, value: city }));

    // Filter data - only show hospitals, remove clinic filtering
    const filteredData = hospitals.filter((item) => {
        const city = item.address.split(',').pop()?.trim() || '';
        const isLocationMatch = location === '' || city === location;
        const isTypeMatch = type === '' || item.name.includes('Bệnh viện');
        const isSearchMatch =
            search === '' || item.name.toLowerCase().includes(search.toLowerCase());
        return item.status === 'ACTIVE' && isLocationMatch && isTypeMatch && isSearchMatch;
    });

    // Displayed data
    const displayedData = filteredData.slice(0, visibleCount);

    // Load more handler
    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 10);
    };

    // Breadcrumb data
    const breadcrumbData = {
        items: [
            { label: 'Home', path: '/', isActive: false },
            { label: 'Bệnh viện', isActive: true },
        ],
        title: 'Bệnh viện',
    };

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
            <div className={clsx('content', 'doctor-content')}>
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
                                    Bệnh viện cho bạn
                                </h5>
                                <div className={clsx('d-flex', 'align-items-center', 'gap-3')}>
                                    <Select
                                        title="Vị trí"
                                        value={location}
                                        onChange={setLocation}
                                        items={[{ label: 'Tất cả', value: '' }, ...uniqueLocations]}
                                        image={locationIcon}
                                    />
                                    <Select
                                        title="Loại Bệnh viện"
                                        value={type}
                                        onChange={setType}
                                        items={[
                                            { label: 'Tất cả', value: '' },
                                            { label: 'Bệnh viện', value: 'Bệnh viện' },
                                        ]}
                                        image={browseCategorie}
                                    />
                                    <div className={clsx('input-block', 'dash-search-input')}>
                                        <input
                                            type="text"
                                            className={clsx('form-control')}
                                            placeholder="Tìm kiếm Bệnh viện"
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
                    </div>
                    {/* /Show Result */}
                    <div className={clsx('all-facilities')}>
                        <div className={clsx('row')}>
                            {displayedData.map((hospital) => (
                                <HospitalCard
                                    key={hospital.id}
                                    id={hospital.id}
                                    name={hospital.name}
                                    address={hospital.address}
                                    avatar_url={hospital.avatar_url}
                                />
                            ))}
                        </div>
                        {visibleCount < filteredData.length && (
                            <div className={clsx('loader-item', 'text-center')}>
                                <Link
                                    to="#"
                                    className={clsx(
                                        'btn',
                                        'btn-primary',
                                        'd-inline-flex',
                                        'align-items-center'
                                    )}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleLoadMore();
                                    }}
                                >
                                    <i className={clsx('isax', 'isax-d-cube-scan', 'me-2')}></i>
                                    Tải thêm {filteredData.length - visibleCount} Bệnh viện
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Hospital;
