import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import Select from '@/components/Select';
import HospitalCard from './components/MedicalFacilityCard';
import styles from './MedicalFacility.module.scss';

import hospital01 from '@/assets/img/hospitals/hospital-01.svg';
import hospital03 from '@/assets/img/hospitals/hospital-03.svg';
import hospital05 from '@/assets/img/hospitals/hospital-05.svg';
import browseCategorie from '@/assets/img/icons/browse-categorie.svg';
import locationIcon from '@/assets/img/icons/location.svg';

const MedicalFacility: React.FC = () => {
    const images = [hospital01, hospital03, hospital05];
    const facilities = [
        {
            name: 'Bệnh viện Bạch Mai',
            location: 'Hà Nội',
            type: 'Bệnh viện',
            imageSrc: images[0 % 3],
            linkTo: '/medical-facility/id',
        },
        {
            name: 'Phòng khám Đa khoa Hồng Ngọc',
            location: 'Hà Nội',
            type: 'Phòng khám',
            imageSrc: images[1 % 3],
            linkTo: '/medical-facility/id',
        },
        {
            name: 'Bệnh viện Chợ Rẫy',
            location: 'TP. Hồ Chí Minh',
            type: 'Bệnh viện',
            imageSrc: images[2 % 3],
            linkTo: '/medical-facility/id',
        },
        {
            name: 'Phòng khám Family Medical',
            location: 'TP. Hồ Chí Minh',
            type: 'Phòng khám',
            imageSrc: images[3 % 3],
            linkTo: '/medical-facility/id',
        },
        {
            name: 'Bệnh viện Đà Nẵng',
            location: 'Đà Nẵng',
            type: 'Bệnh viện',
            imageSrc: images[4 % 3],
            linkTo: '/medical-facility/id',
        },
        {
            name: 'Phòng khám Việt Pháp',
            location: 'Đà Nẵng',
            type: 'Phòng khám',
            imageSrc: images[5 % 3],
            linkTo: '/medical-facility/id',
        },
        {
            name: 'Bệnh viện Hải Phòng',
            location: 'Hải Phòng',
            type: 'Bệnh viện',
            imageSrc: images[6 % 3],
            linkTo: '/medical-facility/id',
        },
        {
            name: 'Phòng khám Đa khoa Hải Phòng',
            location: 'Hải Phòng',
            type: 'Phòng khám',
            imageSrc: images[7 % 3],
            linkTo: '/medical-facility/id',
        },
        {
            name: 'Bệnh viện Cần Thơ',
            location: 'Cần Thơ',
            type: 'Bệnh viện',
            imageSrc: images[8 % 3],
            linkTo: '/medical-facility/id',
        },
        {
            name: 'Phòng khám Tư nhân Cần Thơ',
            location: 'Cần Thơ',
            type: 'Phòng khám',
            imageSrc: images[9 % 3],
            linkTo: '/medical-facility/id',
        },
        {
            name: 'Bệnh viện Từ Dũ',
            location: 'TP. Hồ Chí Minh',
            type: 'Bệnh viện',
            imageSrc: images[10 % 3],
            linkTo: '/medical-facility/id',
        },
        {
            name: 'Phòng khám Nhi Đồng',
            location: 'Hà Nội',
            type: 'Phòng khám',
            imageSrc: images[11 % 3],
            linkTo: '/medical-facility/id',
        },
        {
            name: 'Bệnh viện Vinmec',
            location: 'Hà Nội',
            type: 'Bệnh viện',
            imageSrc: images[12 % 3],
            linkTo: '/medical-facility/id',
        },
        {
            name: 'Phòng khám Hoàn Mỹ',
            location: 'Đà Nẵng',
            type: 'Phòng khám',
            imageSrc: images[13 % 3],
            linkTo: '/medical-facility/id',
        },
        {
            name: 'Bệnh viện Quân Y',
            location: 'TP. Hồ Chí Minh',
            type: 'Bệnh viện',
            imageSrc: images[14 % 3],
            linkTo: '/medical-facility/id',
        },
        {
            name: 'Phòng khám Tư vấn Sức khỏe',
            location: 'Hải Phòng',
            type: 'Phòng khám',
            imageSrc: images[15 % 3],
            linkTo: '/medical-facility/id',
        },
        {
            name: 'Bệnh viện Đa khoa Quốc tế',
            location: 'Cần Thơ',
            type: 'Bệnh viện',
            imageSrc: images[16 % 3],
            linkTo: '/medical-facility/id',
        },
        {
            name: 'Phòng khám Chuyên khoa Mắt',
            location: 'Hà Nội',
            type: 'Phòng khám',
            imageSrc: images[17 % 3],
            linkTo: '/medical-facility/id',
        },
        {
            name: 'Bệnh viện Phụ sản',
            location: 'TP. Hồ Chí Minh',
            type: 'Bệnh viện',
            imageSrc: images[18 % 3],
            linkTo: '/medical-facility/id',
        },
        {
            name: 'Phòng khám Răng Hàm Mặt',
            location: 'Đà Nẵng',
            type: 'Phòng khám',
            imageSrc: images[19 % 3],
            linkTo: '/medical-facility/id',
        },
    ];

    // State for filtering and pagination
    const [location, setLocation] = useState('');
    const [type, setType] = useState('');
    const [search, setSearch] = useState('');
    const [visibleCount, setVisibleCount] = useState(5);

    // Filter data
    const filteredData = facilities.filter((item) => {
        return (
            (location === '' || item.location === location) &&
            (type === '' || item.type === type) &&
            (search === '' || item.name.toLowerCase().includes(search.toLowerCase()))
        );
    });

    // Displayed data
    const displayedData = filteredData.slice(0, visibleCount);

    // Load more handler
    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 5);
    };

    // Breadcrumb data
    const breadcrumbData = {
        items: [
            { label: 'Home', path: '/', isActive: false },
            { label: 'Cơ sở y tế', isActive: true },
        ],
        title: 'Cơ sở y tế',
    };

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
            <div className="content doctor-content">
                <div className="container">
                    {/* Show Result */}
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between result-wrap">
                                <h5>
                                    Hiển thị{' '}
                                    <span className={clsx(styles.resultCount)}>
                                        {filteredData.length}
                                    </span>{' '}
                                    cơ sở y tế cho bạn
                                </h5>
                                <div className="d-flex align-items-center gap-3">
                                    <Select
                                        title="Vị trí"
                                        value={location}
                                        onChange={setLocation}
                                        items={[
                                            { label: 'Hà Nội', value: 'Hà Nội' },
                                            { label: 'TP. Hồ Chí Minh', value: 'TP. Hồ Chí Minh' },
                                            { label: 'Đà Nẵng', value: 'Đà Nẵng' },
                                            { label: 'Hải Phòng', value: 'Hải Phòng' },
                                            { label: 'Cần Thơ', value: 'Cần Thơ' },
                                        ]}
                                        image={locationIcon}
                                    />
                                    <Select
                                        title="Loại cơ sở y tế"
                                        value={type}
                                        onChange={setType}
                                        items={[
                                            { label: 'Tất cả', value: 'Tất cả' },
                                            { label: 'Bệnh viện', value: 'Bệnh viện' },
                                            { label: 'Phòng khám', value: 'Phòng khám' },
                                        ]}
                                        image={browseCategorie}
                                    />
                                    <div className="input-block dash-search-input">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Tìm kiếm cơ sở y tế"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                        <span className="search-icon">
                                            <i className="isax isax-search-normal"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /Show Result */}
                    <div className="all-facilities">
                        <div className="row">
                            {displayedData.map((h, i) => (
                                <HospitalCard key={i} {...h} />
                            ))}
                        </div>
                        {visibleCount < filteredData.length && (
                            <div className="loader-item text-center">
                                <Link
                                    to="#"
                                    className="btn btn-primary d-inline-flex align-items-center"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleLoadMore();
                                    }}
                                >
                                    <i className="isax isax-d-cube-scan me-2"></i>Tải thêm{' '}
                                    {filteredData.length - visibleCount} cơ sở y tế
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default MedicalFacility;
