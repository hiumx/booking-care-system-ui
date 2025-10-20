import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import HospitalCard from '@/components/HospitalCard';
import ModalArea from '@/components/ModalArea';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getSpecialtiesAsync } from '@/store/slices/specialtySlice';
import { getOptimizedHospitalListAsync } from '@/store/slices/hospitalSlice';
import { HospitalListOptimizedFilterRequest } from '@/types/hospital.types';
import styles from './HospitalList.module.scss';

const HospitalList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { specialties } = useAppSelector((state) => state.specialty);
    const { optimizedHospitals, isLoading, pagination } = useAppSelector((state) => state.hospital);

    // State for filtering and pagination
    const [provinceId, setProvinceId] = useState<string>('');
    const [districtId, setDistrictId] = useState<string>('');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
    const [selectedAreaDisplay, setSelectedAreaDisplay] = useState('');
    const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);
    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

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
        setSelectedAreaDisplay(areaDisplay);

        // Parse area info from the display string and locationId
        if (areaDisplay.includes(' - ')) {
            // District selected: locationId is districtId, provinceId is provided
            setDistrictId(locationId);
            setProvinceId(provinceId || '');
        } else {
            // Province selected: locationId is provinceId
            setProvinceId(locationId);
            setDistrictId('');
        }

        setCurrentPage(1); // Reset to first page when filter changes
        setIsAreaModalOpen(false);
    };

    const handleClearArea = () => {
        setSelectedAreaDisplay('');
        setProvinceId('');
        setDistrictId('');
        setCurrentPage(1); // Reset to first page when filter changes
    };

    // Specialty modal handlers
    const handleSpecialtyModalClose = () => {
        setShowSpecialtyModal(false);
    };

    const handleSpecialtyApply = (selectedItems: string[], _searchTerm: string) => {
        // _searchTerm is required by Modal interface but not used in this context
        console.log('Specialties selected:', selectedItems);
        setSelectedSpecialties(selectedItems);
        setCurrentPage(1); // Reset to first page when filter changes
        setShowSpecialtyModal(false);
    };

    const handleClearSpecialty = () => {
        setSelectedSpecialties([]);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    // Prepare specialty items for modal
    const specialtyItems = specialties.map((specialty) => ({
        id: specialty.id,
        name: specialty.name,
        imageUrl: specialty.imageUrl,
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
                                        {pagination.totalCount}
                                    </span>{' '}
                                    Bệnh viện
                                    {(selectedAreaDisplay ||
                                        selectedSpecialties.length > 0 ||
                                        debouncedSearch) && (
                                        <span className="text-muted"> (đã lọc)</span>
                                    )}
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
                                                {selectedSpecialties.length} chuyên khoa
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
                                                <i className="fa-solid fa-search"></i>"
                                                {debouncedSearch}"
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
                            <div className={clsx('text-center', 'py-5')}>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-2">
                                    {selectedAreaDisplay ||
                                    selectedSpecialties.length > 0 ||
                                    debouncedSearch
                                        ? 'Đang lọc danh sách bệnh viện...'
                                        : 'Đang tải danh sách bệnh viện...'}
                                </p>
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
                                                <i className="fa-solid fa-times me-2"></i>
                                                Xóa tất cả bộ lọc
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
            />
        </MainLayout>
    );
};

export default HospitalList;
