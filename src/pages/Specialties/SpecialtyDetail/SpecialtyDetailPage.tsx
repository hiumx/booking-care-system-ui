import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import styles from './SpecialtyDetailPage.module.scss';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import { DoctorAppointmentBookingCard } from '@/pages/Doctor/DoctorList/components/DoctorAppointmentBookingCard';
import HospitalCard from '@/components/HospitalCard';
import { PATHS } from '@/routes/paths';
import SpecialtySidebar from './components/SpecialtySidebar';
import ModalArea from '@/components/ModalArea';
import Pagination from '@/components/Pagination';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { getSpecialtiesAsync } from '@/store/slices/specialtySlice';
import { DoctorService } from '@/services/doctor.service';
import { HospitalService } from '@/services/hospital.service';
import { DoctorResponse, DoctorListResponse } from '@/types/doctor.types';
import { HospitalListOptimizedResponse } from '@/types/hospital.types';
import { toast } from 'react-toastify';

type TabType = 'doctor' | 'hospital';

const SpecialtyDetailPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { id: specialtyId } = useParams<{ id: string }>();

    const [activeTab, setActiveTab] = useState<TabType>('doctor');
    const [doctorsLoading, setDoctorsLoading] = useState(false);
    const [hospitalsLoading, setHospitalsLoading] = useState(false);

    // Data states
    const [doctors, setDoctors] = useState<DoctorResponse[]>([]);
    const [hospitals, setHospitals] = useState<HospitalListOptimizedResponse[]>([]);
    const [doctorsPagination, setDoctorsPagination] = useState({
        totalCount: 0,
        totalPages: 0,
        pageNumber: 1,
        pageSize: 10,
    });
    const [hospitalsPagination, setHospitalsPagination] = useState({
        totalCount: 0,
        totalPages: 0,
        page: 1,
        pageSize: 10,
    });

    // Filter states
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [provinceId, setProvinceId] = useState<string>('');
    const [districtId, setDistrictId] = useState<string>('');
    const [selectedAreaDisplay, setSelectedAreaDisplay] = useState('');
    const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // Items per page

    // Get specialties for modal and selected specialty
    const specialties = useAppSelector((state) => state.specialty.specialties);
    const specialtiesLoading = useAppSelector((state) => state.specialty.isLoading);
    const selectedSpecialty = specialties.find((s) => s.id === specialtyId);

    // Get current user for patientId
    const currentUserProfile = useAppSelector((state: any) => state.user?.profile);
    const patientId = currentUserProfile?.id;

    // Fetch specialties if not loaded
    useEffect(() => {
        if (specialties.length === 0 && !specialtiesLoading) {
            dispatch(getSpecialtiesAsync());
        }
    }, [dispatch, specialties.length, specialtiesLoading]);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Fetch doctors when filters change (only when doctor tab is active)
    useEffect(() => {
        if (!specialtyId || activeTab !== 'doctor') return;

        const fetchDoctors = async () => {
            setDoctorsLoading(true);
            try {
                const response = await DoctorService.filterDoctors({
                    specialtyFilter: specialtyId,
                    searchTerm: debouncedSearch || undefined,
                    areaFilter:
                        provinceId || districtId
                            ? {
                                  provinceId: provinceId || undefined,
                                  districtId: districtId || undefined,
                              }
                            : undefined,
                    pageNumber: currentPage,
                    pageSize: pageSize,
                });

                if (response.success && response.data) {
                    const data = response.data as DoctorListResponse;
                    setDoctors(data.doctors || []);
                    setDoctorsPagination({
                        totalCount: data.totalCount || 0,
                        totalPages: data.totalPages || 0,
                        pageNumber: data.pageNumber || currentPage,
                        pageSize: data.pageSize || pageSize,
                    });
                }
            } catch (error: any) {
                console.error('Error fetching doctors:', error);
                toast.error('Không thể tải danh sách bác sĩ. Vui lòng thử lại.');
                setDoctors([]);
            } finally {
                setDoctorsLoading(false);
            }
        };

        fetchDoctors();
    }, [specialtyId, debouncedSearch, provinceId, districtId, currentPage, pageSize, activeTab]);

    // Fetch hospitals when filters change (only when hospital tab is active)
    useEffect(() => {
        if (!specialtyId || activeTab !== 'hospital') return;

        const fetchHospitals = async () => {
            setHospitalsLoading(true);
            try {
                const response = await HospitalService.getOptimizedHospitalList({
                    specialtyIds: [specialtyId],
                    search: debouncedSearch || undefined,
                    provinceId: provinceId || undefined,
                    districtId: districtId || undefined,
                    page: currentPage,
                    pageSize: pageSize,
                });

                if (response.success && response.data) {
                    setHospitals(response.data.hospitals || []);
                    setHospitalsPagination({
                        totalCount: response.data.totalCount || 0,
                        totalPages: response.data.totalPages || 0,
                        page: response.data.page || currentPage,
                        pageSize: response.data.pageSize || pageSize,
                    });
                }
            } catch (error: any) {
                console.error('Error fetching hospitals:', error);
                toast.error('Không thể tải danh sách bệnh viện. Vui lòng thử lại.');
                setHospitals([]);
            } finally {
                setHospitalsLoading(false);
            }
        };

        fetchHospitals();
    }, [specialtyId, debouncedSearch, provinceId, districtId, currentPage, pageSize, activeTab]);

    // Area modal handlers
    const handleAreaSelect = (areaDisplay: string, locationId: string, provinceId?: string) => {
        let newProvinceId: string;
        let newDistrictId: string;

        if (areaDisplay.includes(' - ')) {
            // District selected
            newDistrictId = locationId;
            newProvinceId = provinceId || '';
        } else {
            // Province selected
            newProvinceId = locationId;
            newDistrictId = '';
        }

        setSelectedAreaDisplay(areaDisplay);
        setProvinceId(newProvinceId);
        setDistrictId(newDistrictId);
        setIsAreaModalOpen(false);
    };

    const handleClearArea = () => {
        setSelectedAreaDisplay('');
        setProvinceId('');
        setDistrictId('');
    };

    // Count results from API pagination
    const doctorsCount = doctorsPagination.totalCount;
    const hospitalsCount = hospitalsPagination.totalCount;
    const doctorsTotalPages = doctorsPagination.totalPages;
    const hospitalsTotalPages = hospitalsPagination.totalPages;

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, provinceId, districtId, activeTab]);

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const breadcrumbData = {
        items: [
            { label: 'Trang chủ', path: '/', isActive: false },
            { label: 'Chuyên khoa', path: PATHS.SPECIALTIES.ROOT, isActive: false },
            { label: selectedSpecialty?.name || 'Chuyên khoa', isActive: true },
        ],
        title: selectedSpecialty?.name || 'Chuyên khoa',
    };

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
            <div className="content">
                <div className="container">
                    <div className={styles.specialtyDetailContainer}>
                        <div className="row">
                            {/* Left: List Cards (8.5 columns) */}
                            <div className={styles.leftColumn}>
                                <div className={styles.contentSection}>
                                    {/* Tabs */}
                                    <div className={styles.tabsContainer}>
                                        <button
                                            className={clsx(styles.tab, {
                                                [styles.active]: activeTab === 'doctor',
                                            })}
                                            onClick={() => setActiveTab('doctor')}
                                        >
                                            Bác sĩ
                                        </button>
                                        <button
                                            className={clsx(styles.tab, {
                                                [styles.active]: activeTab === 'hospital',
                                            })}
                                            onClick={() => setActiveTab('hospital')}
                                        >
                                            Bệnh viện
                                        </button>
                                    </div>

                                    {/* Filter/Search Section */}
                                    <div className={clsx('card', 'mb-3')}>
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
                                                        {activeTab === 'doctor'
                                                            ? doctorsCount
                                                            : hospitalsCount}
                                                    </span>{' '}
                                                    {activeTab === 'doctor'
                                                        ? 'bác sĩ'
                                                        : 'bệnh viện'}
                                                    {(selectedAreaDisplay || debouncedSearch) && (
                                                        <span className="text-muted">
                                                            {' '}
                                                            (đã lọc)
                                                        </span>
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
                                                                className={clsx(
                                                                    styles.locationButton
                                                                )}
                                                                onClick={() =>
                                                                    setIsAreaModalOpen(true)
                                                                }
                                                            >
                                                                <i
                                                                    className={clsx(
                                                                        'fa-solid',
                                                                        'fa-location-dot',
                                                                        styles.locationIcon
                                                                    )}
                                                                ></i>
                                                                <span
                                                                    className={styles.locationText}
                                                                >
                                                                    {selectedAreaDisplay ||
                                                                        'Chọn khu vực'}
                                                                    {provinceId && !districtId && (
                                                                        <span
                                                                            className={
                                                                                styles.filterBadge
                                                                            }
                                                                        >
                                                                            Tỉnh
                                                                        </span>
                                                                    )}
                                                                    {districtId && (
                                                                        <span
                                                                            className={
                                                                                styles.filterBadge
                                                                            }
                                                                        >
                                                                            Quận/Huyện
                                                                        </span>
                                                                    )}
                                                                </span>
                                                                {selectedAreaDisplay && (
                                                                    <button
                                                                        className={
                                                                            styles.clearButton
                                                                        }
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
                                                    </div>
                                                    <div
                                                        className={clsx(
                                                            'input-block',
                                                            'dash-search-input'
                                                        )}
                                                    >
                                                        <input
                                                            type="text"
                                                            className={clsx('form-control')}
                                                            placeholder={
                                                                activeTab === 'doctor'
                                                                    ? 'Tìm kiếm Bác sĩ'
                                                                    : 'Tìm kiếm Bệnh viện'
                                                            }
                                                            value={search}
                                                            onChange={(e) =>
                                                                setSearch(e.target.value)
                                                            }
                                                        />
                                                        <span className={clsx('search-icon')}>
                                                            <i
                                                                className={clsx(
                                                                    'isax',
                                                                    'isax-search-normal'
                                                                )}
                                                            ></i>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Active Filters Display */}
                                    {(selectedAreaDisplay || debouncedSearch) && (
                                        <div className={clsx('card', 'mb-3')}>
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
                                                            'gap-2',
                                                            'flex-wrap'
                                                        )}
                                                    >
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
                                                                    aria-label="Xóa khu vực"
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
                                                        className={clsx(
                                                            'btn',
                                                            'btn-outline-primary',
                                                            'btn-sm'
                                                        )}
                                                        onClick={() => {
                                                            handleClearArea();
                                                            setSearch('');
                                                        }}
                                                    >
                                                        Xóa tất cả bộ lọc
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Tab Content */}
                                    <div className={styles.tabContent}>
                                        {activeTab === 'doctor' && (
                                            <div className={styles.cardsList}>
                                                {doctorsLoading ? (
                                                    <div className="text-center py-5">
                                                        <div className="spinner-border text-primary">
                                                            <span className="visually-hidden">
                                                                Loading...
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : doctors.length > 0 ? (
                                                    doctors.map((doctor) => (
                                                        <DoctorAppointmentBookingCard
                                                            key={doctor.id}
                                                            doctorId={doctor.id}
                                                            patientId={patientId}
                                                            name={`${doctor.lastName} ${doctor.firstName}`}
                                                            specialty={
                                                                doctor.specialty?.name ||
                                                                'Chưa cập nhật'
                                                            }
                                                            position={
                                                                doctor.position?.name ||
                                                                'Chưa cập nhật'
                                                            }
                                                            prices={
                                                                doctor.prices?.map((price) => ({
                                                                    id: price.id,
                                                                    serviceTypeId:
                                                                        price.serviceTypeId,
                                                                    serviceTypeName:
                                                                        price.serviceTypeName,
                                                                    amount: price.amount,
                                                                })) || []
                                                            }
                                                            rating={
                                                                doctor.reviewStatistics
                                                                    ?.averageRating || 0
                                                            }
                                                            location={
                                                                doctor.hospital?.name ||
                                                                doctor.address ||
                                                                'Chưa cập nhật'
                                                            }
                                                            yearsOfExperience={
                                                                doctor.yearsOfExperience
                                                            }
                                                            isFavorite={doctor.isFavorited || false}
                                                            languages={doctor.languages || []}
                                                            image={
                                                                doctor.avatarUrl ||
                                                                '/default-doctor.png'
                                                            }
                                                        />
                                                    ))
                                                ) : (
                                                    <div className={styles.emptyState}>
                                                        <div className={styles.emptyStateIcon}>
                                                            <i className="fa-solid fa-user-doctor"></i>
                                                        </div>
                                                        <h4 className={styles.emptyStateTitle}>
                                                            Không tìm thấy bác sĩ nào
                                                        </h4>
                                                        <p className={styles.emptyStateDescription}>
                                                            Vui lòng thử lại với từ khóa khác hoặc
                                                            bộ lọc khác.
                                                        </p>
                                                        {(debouncedSearch ||
                                                            provinceId ||
                                                            districtId) && (
                                                            <button
                                                                className={clsx(
                                                                    'btn',
                                                                    'btn-outline-primary',
                                                                    'btn-sm',
                                                                    styles.clearFiltersButton
                                                                )}
                                                                onClick={() => {
                                                                    handleClearArea();
                                                                    setSearch('');
                                                                }}
                                                            >
                                                                Xóa tất cả bộ lọc
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                                {/* Pagination for Doctors */}
                                                {doctorsTotalPages > 1 && (
                                                    <div
                                                        className={clsx(
                                                            'text-center',
                                                            styles.paginationWrapper
                                                        )}
                                                    >
                                                        <Pagination
                                                            currentPage={currentPage}
                                                            totalPages={doctorsTotalPages}
                                                            onPageChange={handlePageChange}
                                                            showPrevNext={true}
                                                            maxVisiblePages={5}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {activeTab === 'hospital' && (
                                            <div className={styles.cardsList}>
                                                {hospitalsLoading ? (
                                                    <div className="text-center py-5">
                                                        <div className="spinner-border text-primary">
                                                            <span className="visually-hidden">
                                                                Loading...
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : hospitals.length > 0 ? (
                                                    <div className="row">
                                                        {hospitals.map((hospital) => (
                                                            <div
                                                                key={hospital.id}
                                                                className="col-md-6 mb-4"
                                                            >
                                                                <HospitalCard
                                                                    clinic={{
                                                                        id: hospital.id,
                                                                        name: hospital.name,
                                                                        image:
                                                                            hospital.avatarUrl ||
                                                                            '/default-hospital.png',
                                                                        specialties:
                                                                            hospital.specialties?.map(
                                                                                (s) => s.name
                                                                            ) || [],
                                                                        location: hospital.address,
                                                                        specialtyCount:
                                                                            hospital.totalSpecialties ||
                                                                            0,
                                                                    }}
                                                                    showBookingButton={true}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className={styles.emptyState}>
                                                        <div className={styles.emptyStateIcon}>
                                                            <i className="fa-solid fa-hospital"></i>
                                                        </div>
                                                        <h4 className={styles.emptyStateTitle}>
                                                            Không tìm thấy bệnh viện nào
                                                        </h4>
                                                        <p className={styles.emptyStateDescription}>
                                                            Vui lòng thử lại với từ khóa khác hoặc
                                                            bộ lọc khác.
                                                        </p>
                                                        {(debouncedSearch ||
                                                            provinceId ||
                                                            districtId) && (
                                                            <button
                                                                className={clsx(
                                                                    'btn',
                                                                    'btn-outline-primary',
                                                                    'btn-sm',
                                                                    styles.clearFiltersButton
                                                                )}
                                                                onClick={() => {
                                                                    handleClearArea();
                                                                    setSearch('');
                                                                }}
                                                            >
                                                                Xóa tất cả bộ lọc
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                                {/* Pagination for Hospitals */}
                                                {hospitalsTotalPages > 1 && (
                                                    <div
                                                        className={clsx(
                                                            'text-center',
                                                            styles.paginationWrapper
                                                        )}
                                                    >
                                                        <Pagination
                                                            currentPage={currentPage}
                                                            totalPages={hospitalsTotalPages}
                                                            onPageChange={handlePageChange}
                                                            showPrevNext={true}
                                                            maxVisiblePages={5}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Banner & Map (3.5 columns) */}
                            <div className={styles.rightColumn}>
                                <SpecialtySidebar />
                            </div>
                        </div>
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
        </MainLayout>
    );
};

export default SpecialtyDetailPage;
