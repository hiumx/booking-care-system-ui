import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import HospitalCard from './components/HospitalCard';
import ModalArea from '@/components/ModalArea';
import Modal from '@/components/Modal';
import { useAppDispatch } from '@/store/hooks';
import { getSpecialtiesAsync } from '@/store/slices/specialtySlice';
import styles from './HospitalList.module.scss';

import hospital01 from '@/assets/img/hospitals/hospital-01.svg';
import hospital03 from '@/assets/img/hospitals/hospital-03.svg';
import hospital05 from '@/assets/img/hospitals/hospital-05.svg';

const HospitalList: React.FC = () => {
    const dispatch = useAppDispatch();
    // const { specialties } = useAppSelector((state) => state.specialty); // Using mock data instead

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
    const [search, setSearch] = useState('');
    const [visibleCount, setVisibleCount] = useState(5);
    const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
    const [selectedAreaDisplay, setSelectedAreaDisplay] = useState('');
    const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);
    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

    // Mock specialties data
    const mockSpecialties = [
        {
            id: '1',
            name: 'Tim mạch',
            imageUrl: 'https://via.placeholder.com/40x40/FF6B6B/FFFFFF?text=❤️',
            color: '#FF6B6B',
        },
        {
            id: '2',
            name: 'Thần kinh',
            imageUrl: 'https://via.placeholder.com/40x40/4ECDC4/FFFFFF?text=🧠',
            color: '#4ECDC4',
        },
        {
            id: '3',
            name: 'Tiêu hóa',
            imageUrl: 'https://via.placeholder.com/40x40/45B7D1/FFFFFF?text=🫀',
            color: '#45B7D1',
        },
        {
            id: '4',
            name: 'Nhi khoa',
            imageUrl: 'https://via.placeholder.com/40x40/96CEB4/FFFFFF?text=👶',
            color: '#96CEB4',
        },
        {
            id: '5',
            name: 'Sản phụ khoa',
            imageUrl: 'https://via.placeholder.com/40x40/FFEAA7/FFFFFF?text=🤱',
            color: '#FFEAA7',
        },
        {
            id: '6',
            name: 'Mắt',
            imageUrl: 'https://via.placeholder.com/40x40/DDA0DD/FFFFFF?text=👁️',
            color: '#DDA0DD',
        },
        {
            id: '7',
            name: 'Tai mũi họng',
            imageUrl: 'https://via.placeholder.com/40x40/98D8C8/FFFFFF?text=👂',
            color: '#98D8C8',
        },
        {
            id: '8',
            name: 'Da liễu',
            imageUrl: 'https://via.placeholder.com/40x40/F7DC6F/FFFFFF?text=🦋',
            color: '#F7DC6F',
        },
        {
            id: '9',
            name: 'Xương khớp',
            imageUrl: 'https://via.placeholder.com/40x40/BB8FCE/FFFFFF?text=🦴',
            color: '#BB8FCE',
        },
        {
            id: '10',
            name: 'Ung bướu',
            imageUrl: 'https://via.placeholder.com/40x40/85C1E9/FFFFFF?text=🎗️',
            color: '#85C1E9',
        },
        {
            id: '11',
            name: 'Tâm thần',
            imageUrl: 'https://via.placeholder.com/40x40/F8C471/FFFFFF?text=🧘',
            color: '#F8C471',
        },
        {
            id: '12',
            name: 'Nội tiết',
            imageUrl: 'https://via.placeholder.com/40x40/82E0AA/FFFFFF?text=⚕️',
            color: '#82E0AA',
        },
    ];

    // Load specialties on component mount
    useEffect(() => {
        dispatch(getSpecialtiesAsync());
    }, [dispatch]);

    // Filter data - only show hospitals
    const filteredData = hospitals.filter((item) => {
        const city = item.address.split(',').pop()?.trim() || '';
        const isLocationMatch = location === '' || city === location;
        const isSearchMatch =
            search === '' || item.name.toLowerCase().includes(search.toLowerCase());
        return item.status === 'ACTIVE' && isLocationMatch && isSearchMatch;
    });

    // Displayed data
    const displayedData = filteredData.slice(0, visibleCount);

    // Load more handler
    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 10);
    };

    // Modal handlers
    const handleAreaSelect = (areaDisplay: string, locationId: string) => {
        setSelectedAreaDisplay(areaDisplay);
        setLocation(locationId);
        setIsAreaModalOpen(false);
    };

    const handleClearArea = () => {
        setSelectedAreaDisplay('');
        setLocation('');
    };

    // Specialty modal handlers
    const handleSpecialtyModalClose = () => {
        setShowSpecialtyModal(false);
    };

    const handleSpecialtyApply = (selectedItems: string[], _searchTerm: string) => {
        // _searchTerm is required by Modal interface but not used in this context
        setSelectedSpecialties(selectedItems);
        setShowSpecialtyModal(false);
    };

    const handleClearSpecialty = () => {
        setSelectedSpecialties([]);
    };

    // Prepare specialty items for modal (using mock data for now)
    const specialtyItems = mockSpecialties.map((specialty) => ({
        id: specialty.id,
        name: specialty.name,
        imageUrl: specialty.imageUrl,
        color: specialty.color,
    }));

    // Breadcrumb data
    const breadcrumbData = {
        items: [
            { label: 'Home', path: '/', isActive: false },
            { label: 'Danh sách bệnh viện', isActive: true },
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
                                    styles.resultWrap
                                )}
                            >
                                <h5 className={clsx(styles.customh5)}>
                                    Hiển thị{' '}
                                    <span className={clsx(styles.resultCount)}>
                                        {filteredData.length}
                                    </span>{' '}
                                    Bệnh viện cho bạn
                                </h5>
                                <div
                                    className={clsx(
                                        'd-flex',
                                        'align-items-center',
                                        'gap-3',
                                        styles.filtersContainer
                                    )}
                                >
                                    <div className={clsx(styles.buttonsRow)}>
                                        <div className={clsx('location-selector')}>
                                            <button
                                                className={clsx(styles.locationButton)}
                                                onClick={() => setIsAreaModalOpen(true)}
                                            >
                                                <i
                                                    className={clsx(
                                                        'fa-solid',
                                                        'fa-location-dot',
                                                        styles.locationIcon
                                                    )}
                                                ></i>
                                                <span className={styles.locationText}>
                                                    {selectedAreaDisplay || 'Chọn khu vực'}
                                                </span>
                                                {selectedAreaDisplay && (
                                                    <button
                                                        className={styles.clearButton}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleClearArea();
                                                        }}
                                                        aria-label="Xóa lựa chọn"
                                                    >
                                                        <i className="fa-solid fa-xmark"></i>
                                                    </button>
                                                )}
                                            </button>
                                        </div>
                                        <div className={clsx('specialty-selector')}>
                                            <button
                                                className={clsx(styles.specialtyButton)}
                                                onClick={() => setShowSpecialtyModal(true)}
                                            >
                                                <i
                                                    className={clsx(
                                                        'fa-solid',
                                                        'fa-briefcase-medical',
                                                        styles.specialtyIcon
                                                    )}
                                                ></i>
                                                <span className={styles.specialtyText}>
                                                    {selectedSpecialties.length > 0
                                                        ? `${selectedSpecialties.length} chuyên khoa`
                                                        : 'Chọn chuyên khoa'}
                                                </span>
                                                {selectedSpecialties.length > 0 && (
                                                    <button
                                                        className={styles.clearButton}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleClearSpecialty();
                                                        }}
                                                        aria-label="Xóa lựa chọn"
                                                    >
                                                        <i className="fa-solid fa-xmark"></i>
                                                    </button>
                                                )}
                                            </button>
                                        </div>
                                    </div>
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
            <ModalArea
                isOpen={isAreaModalOpen}
                onClose={() => setIsAreaModalOpen(false)}
                onApply={handleAreaSelect}
            />
            <Modal
                isOpen={showSpecialtyModal}
                onClose={handleSpecialtyModalClose}
                onApply={handleSpecialtyApply}
                items={specialtyItems}
                title="Tìm theo chuyên khoa"
                itemType="specialty"
            />
        </MainLayout>
    );
};

export default HospitalList;
