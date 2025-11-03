import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import HospitalCard, { HospitalCardSkeleton } from '@/components/HospitalCard';
import ModalArea from '@/components/ModalArea';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getSpecialtiesAsync } from '@/store/slices/specialtySlice';
import { getOptimizedHospitalListAsync } from '@/store/slices/hospitalSlice';
import { HospitalListOptimizedFilterRequest } from '@/types/hospital.types';
import styles from './HospitalList.module.scss';

// Precomputed stable keys for skeleton items to avoid using array index as key
const HOSPITAL_SKELETON_KEYS: string[] = [
    's-0',
    's-1',
    's-2',
    's-3',
    's-4',
    's-5',
    's-6',
    's-7',
    's-8',
    's-9',
    's-10',
    's-11',
];

const HospitalList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { specialties } = useAppSelector((state) => state.specialty);
    const { optimizedHospitals, isLoading, pagination } = useAppSelector((state) => state.hospital);
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize state from URL parameters
    const urlSpecialtyId = searchParams.get('specialtyId') || '';
    const urlProvinceId = searchParams.get('provinceId') || '';
    const urlDistrictId = searchParams.get('districtId') || '';
    const urlSearch = searchParams.get('search') || '';

    // State for filtering and pagination
    const [provinceId, setProvinceId] = useState<string>(urlProvinceId);
    const [districtId, setDistrictId] = useState<string>(urlDistrictId);
    const [search, setSearch] = useState(urlSearch);
    const [debouncedSearch, setDebouncedSearch] = useState(urlSearch);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
    const [selectedAreaDisplay, setSelectedAreaDisplay] = useState('');
    const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);
    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(
        urlSpecialtyId ? [urlSpecialtyId] : []
    );

    // Function to load hospitals with current filters
    const loadHospitals = useCallback(async () => {
        const filter: HospitalListOptimizedFilterRequest = {
            search: debouncedSearch || undefined,
            specialtyIds: selectedSpecialties.length > 0 ? selectedSpecialties : undefined,
            provinceId: provinceId || undefined,
            districtId: districtId || undefined,
            page: currentPage,
            pageSize: 12, // Increased page size for better grid display
            sortBy: 'Name',
            sortOrder: 'asc',
        };

        console.log('Loading hospitals with filter:', filter);
        dispatch(getOptimizedHospitalListAsync(filter));
    }, [debouncedSearch, selectedSpecialties, provinceId, districtId, currentPage, dispatch]);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [search]);

    // Update URL parameters when state changes
    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedSpecialties.length > 0) {
            params.set('specialtyId', selectedSpecialties[0]); // For simplicity, use first specialty
        }
        if (provinceId) {
            params.set('provinceId', provinceId);
        }
        if (districtId) {
            params.set('districtId', districtId);
        }
        if (debouncedSearch) {
            params.set('search', debouncedSearch);
        }

        setSearchParams(params, { replace: true });
    }, [selectedSpecialties, provinceId, districtId, debouncedSearch, setSearchParams]);

    // Load specialties and hospitals on component mount
    useEffect(() => {
        dispatch(getSpecialtiesAsync());
        loadHospitals();
    }, [dispatch, loadHospitals]);

    // Reload hospitals when filters change
    useEffect(() => {
        loadHospitals();
    }, [loadHospitals]);

    // Handle page change for pagination
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Modal handlers
    const handleAreaSelect = (areaDisplay: string, locationId: string, provinceId?: string) => {
        console.log('Area selected:', { areaDisplay, locationId, provinceId });

        // Parse area info from the display string and locationId
        let newProvinceId: string;
        let newDistrictId: string;
        let newProvinceName: string;
        let newDistrictName: string;

        if (areaDisplay.includes(' - ')) {
            // District selected: locationId is districtId, provinceId is provided
            const parts = areaDisplay.split(' - ');
            newProvinceName = parts[0] || '';
            newDistrictName = parts[1] || '';
            newDistrictId = locationId;
            newProvinceId = provinceId || '';
        } else {
            // Province selected: locationId is provinceId
            newProvinceName = areaDisplay;
            newProvinceId = locationId;
            newDistrictId = '';
            newDistrictName = '';
        }

        setSelectedAreaDisplay(areaDisplay);
        setProvinceId(newProvinceId);
        setDistrictId(newDistrictId);

        // Update URL with area params
        const newParams = new URLSearchParams(searchParams);
        if (newProvinceId) {
            newParams.set('provinceId', newProvinceId);
            if (newProvinceName) {
                newParams.set('provinceName', newProvinceName);
            }
        } else {
            newParams.delete('provinceId');
            newParams.delete('provinceName');
        }
        if (newDistrictId) {
            newParams.set('districtId', newDistrictId);
            if (newDistrictName) {
                newParams.set('districtName', newDistrictName);
            }
        } else {
            newParams.delete('districtId');
            newParams.delete('districtName');
        }
        newParams.set('page', '1');
        setSearchParams(newParams, { replace: true });

        setCurrentPage(1); // Reset to first page when filter changes
        setIsAreaModalOpen(false);
    };

    const handleClearArea = () => {
        setSelectedAreaDisplay('');
        setProvinceId('');
        setDistrictId('');

        // Update URL to remove area params
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('provinceId');
        newParams.delete('districtId');
        newParams.delete('provinceName');
        newParams.delete('districtName');
        newParams.set('page', '1');
        setSearchParams(newParams, { replace: true });

        setCurrentPage(1); // Reset to first page when filter changes
    };

    // Specialty modal handlers
    const handleSpecialtyModalClose = () => {
        setShowSpecialtyModal(false);
    };

    const handleSpecialtyApply = (selectedItems: string[], _searchTerm: string) => {
        // _searchTerm is required by Modal interface but not used in this context
        console.log('Specialties selected:', selectedItems);

        // If selectedItems is empty array, it means clear was called
        if (selectedItems.length === 0) {
            setSelectedSpecialties([]);
            setCurrentPage(1);
            setShowSpecialtyModal(false);

            // Update URL to remove specialtyId
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('specialtyId');
            newParams.set('page', '1');
            setSearchParams(newParams, { replace: true });
            return;
        }

        setSelectedSpecialties(selectedItems);
        setCurrentPage(1); // Reset to first page when filter changes
        setShowSpecialtyModal(false);

        // Update URL with specialtyId param
        const newParams = new URLSearchParams(searchParams);
        if (selectedItems.length > 0) {
            newParams.set('specialtyId', selectedItems[0]); // Use first specialty for URL
        } else {
            newParams.delete('specialtyId');
        }
        newParams.set('page', '1');
        setSearchParams(newParams, { replace: true });
    };

    const handleClearSpecialty = () => {
        setSelectedSpecialties([]);

        // Update URL to remove specialtyId
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('specialtyId');
        newParams.set('page', '1');
        setSearchParams(newParams, { replace: true });

        setCurrentPage(1); // Reset to first page when filter changes
    };

    // Prepare specialty items for modal
    const specialtyItems = specialties.map((specialty) => ({
        id: specialty.id,
        name: specialty.name,
        imageUrl: specialty.imageUrl,
    }));

    // Get specialty name from URL parameter
    const selectedSpecialtyName = urlSpecialtyId
        ? specialties.find((s) => s.id === urlSpecialtyId)?.name || ''
        : '';

    // Breadcrumb data
    const breadcrumbData = {
        items: [
            { label: 'Home', path: '/', isActive: false },
            { label: 'Danh sách bệnh viện', isActive: true },
        ],
        title: selectedSpecialtyName ? `Bệnh viện - ${selectedSpecialtyName}` : 'Bệnh viện',
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
                                <h6 className={clsx(styles.customh5)}>
                                    Hiển thị{' '}
                                    <span className={clsx(styles.resultCount)}>
                                        {pagination.totalCount}
                                    </span>{' '}
                                    Bệnh viện
                                    {(selectedAreaDisplay ||
                                        selectedSpecialties.length > 0 ||
                                        debouncedSearch) && (
                                        <span className="text-muted"> (đã lọc)</span>
                                    )}
                                </h6>
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
                                                    {provinceId && !districtId && (
                                                        <span className={styles.filterBadge}>
                                                            Tỉnh
                                                        </span>
                                                    )}
                                                    {districtId && (
                                                        <span className={styles.filterBadge}>
                                                            Quận/Huyện
                                                        </span>
                                                    )}
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
                                                        ? selectedSpecialtyName ||
                                                          `${selectedSpecialties.length} chuyên khoa`
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

                    {/* Active Filters Display */}
                    {(selectedAreaDisplay || selectedSpecialties.length > 0 || debouncedSearch) && (
                        <div className={clsx('card', 'mt-3')}>
                            <div className={clsx('card-body')}>
                                <div
                                    className={clsx(
                                        'd-flex',
                                        'align-items-center',
                                        'justify-content-between',
                                        'gap-3',
                                        'flex-wrap'
                                    )}
                                >
                                    <div
                                        className={clsx(
                                            'd-flex',
                                            'align-items-center',
                                            'gap-3',
                                            'flex-wrap'
                                        )}
                                    >
                                        <span className={clsx('text-muted', 'fw-bold')}>
                                            Bộ lọc đang áp dụng:
                                        </span>

                                        {selectedAreaDisplay && (
                                            <span
                                                className={clsx(
                                                    'badge',
                                                    'bg-primary',
                                                    'd-flex',
                                                    'align-items-center',
                                                    'gap-2'
                                                )}
                                            >
                                                <i className="fa-solid fa-location-dot"></i>
                                                {selectedAreaDisplay}
                                                <button
                                                    className="btn-close btn-close-white"
                                                    style={{ fontSize: '0.7em' }}
                                                    onClick={handleClearArea}
                                                    aria-label="Xóa bộ lọc khu vực"
                                                ></button>
                                            </span>
                                        )}

                                        {selectedSpecialties.length > 0 && (
                                            <span
                                                className={clsx(
                                                    'badge',
                                                    'bg-success',
                                                    'd-flex',
                                                    'align-items-center',
                                                    'gap-2'
                                                )}
                                            >
                                                <i className="fa-solid fa-briefcase-medical"></i>
                                                {selectedSpecialtyName ||
                                                    `${selectedSpecialties.length} chuyên khoa`}
                                                <button
                                                    className="btn-close btn-close-white"
                                                    style={{ fontSize: '0.7em' }}
                                                    onClick={handleClearSpecialty}
                                                    aria-label="Xóa bộ lọc chuyên khoa"
                                                ></button>
                                            </span>
                                        )}

                                        {debouncedSearch && (
                                            <span
                                                className={clsx(
                                                    'badge',
                                                    'bg-info',
                                                    'd-flex',
                                                    'align-items-center',
                                                    'gap-2'
                                                )}
                                            >
                                                <i className="fa-solid fa-search"></i>
                                                {debouncedSearch}
                                                <button
                                                    className="btn-close btn-close-white"
                                                    style={{ fontSize: '0.7em' }}
                                                    onClick={() => setSearch('')}
                                                    aria-label="Xóa tìm kiếm"
                                                ></button>
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        className={clsx('btn', 'btn-outline-primary', 'btn-sm')}
                                        onClick={() => {
                                            handleClearArea();
                                            handleClearSpecialty();
                                            setSearch('');
                                        }}
                                    >
                                        Xóa tất cả bộ lọc
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={clsx('all-facilities')}>
                        {isLoading ? (
                            <div className={clsx('row', 'g-4', styles.hospitalGrid)}>
                                {HOSPITAL_SKELETON_KEYS.map((key) => (
                                    <div key={key} className={styles.hospitalCard}>
                                        <HospitalCardSkeleton />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                {optimizedHospitals.length === 0 ? (
                                    <div className={clsx('text-center', 'py-5')}>
                                        <div className={clsx('mb-4')}>
                                            <i
                                                className="fa-solid fa-hospital text-muted"
                                                style={{ fontSize: '4rem' }}
                                            ></i>
                                        </div>
                                        <h4 className="text-muted mb-3">
                                            Không tìm thấy bệnh viện nào
                                        </h4>
                                        <p className="text-muted mb-4">
                                            {selectedAreaDisplay ||
                                            selectedSpecialties.length > 0 ||
                                            debouncedSearch
                                                ? 'Không có bệnh viện nào phù hợp với bộ lọc của bạn. Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm khác.'
                                                : 'Hiện tại chưa có bệnh viện nào trong hệ thống.'}
                                        </p>
                                        {(selectedAreaDisplay ||
                                            selectedSpecialties.length > 0 ||
                                            debouncedSearch) && (
                                            <button
                                                className={clsx('btn', 'btn-outline-primary')}
                                                onClick={() => {
                                                    handleClearArea();
                                                    handleClearSpecialty();
                                                    setSearch('');
                                                }}
                                            >
                                                <i className="fa-solid fa-times me-2"></i> Xóa tất
                                                cả bộ lọc
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <div className={clsx('row', 'g-4', styles.hospitalGrid)}>
                                            {optimizedHospitals.map((hospital) => {
                                                // Sort specialties to prioritize selected ones
                                                const sortedSpecialties =
                                                    hospital.specialties?.map((s) => s.name) || [];
                                                if (
                                                    selectedSpecialties.length > 0 &&
                                                    sortedSpecialties.length > 0
                                                ) {
                                                    // Get selected specialty names from the hospital's specialties
                                                    const selectedSpecialtyNames =
                                                        hospital.specialties
                                                            ?.filter((s) =>
                                                                selectedSpecialties.includes(s.id)
                                                            )
                                                            ?.map((s) => s.name) || [];

                                                    // Sort: selected specialties first, then others
                                                    sortedSpecialties.sort((a, b) => {
                                                        const aIsSelected =
                                                            selectedSpecialtyNames.includes(a);
                                                        const bIsSelected =
                                                            selectedSpecialtyNames.includes(b);

                                                        if (aIsSelected && !bIsSelected) return -1;
                                                        if (!aIsSelected && bIsSelected) return 1;
                                                        return 0;
                                                    });
                                                }

                                                return (
                                                    <div
                                                        key={hospital.id}
                                                        className={styles.hospitalCard}
                                                    >
                                                        <HospitalCard
                                                            clinic={{
                                                                id: hospital.id,
                                                                name: hospital.name,
                                                                image:
                                                                    hospital.avatarUrl ||
                                                                    '/default-hospital.png',
                                                                specialties: sortedSpecialties,
                                                                location: hospital.address,
                                                                specialtyCount:
                                                                    hospital.totalSpecialties || 0,
                                                            }}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {pagination.totalPages > 1 && (
                                            <div className={clsx('text-center', 'mt-4')}>
                                                <Pagination
                                                    currentPage={currentPage}
                                                    totalPages={pagination.totalPages}
                                                    onPageChange={handlePageChange}
                                                    showPrevNext={true}
                                                    maxVisiblePages={5}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <ModalArea
                isOpen={isAreaModalOpen}
                onClose={() => setIsAreaModalOpen(false)}
                onApply={handleAreaSelect}
                selectedProvinceId={provinceId}
                selectedDistrictId={districtId}
            />
            <Modal
                isOpen={showSpecialtyModal}
                onClose={handleSpecialtyModalClose}
                onApply={handleSpecialtyApply}
                items={specialtyItems}
                title="Tìm theo chuyên khoa"
                itemType="specialty"
                initialSelectedItems={selectedSpecialties}
            />
        </MainLayout>
    );
};

export default HospitalList;
