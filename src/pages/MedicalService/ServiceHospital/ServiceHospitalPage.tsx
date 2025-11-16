import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import HospitalCard from './components/HospitalCard/HospitalCard';
import Pagination from './components/Pagination/Pagination';
import HeroSection from './components/HeroSection/HeroSection';
import { replacePathParams, PATHS, buildPath } from '@/routes/paths';
import SearchInput from '@/components/SearchInput';
import {
    getServicesWithHospitalAsync,
    getServiceCategoryByIdAsync,
} from '@/store/slices/medicalServiceSlice';
import styles from './ServiceHospitalPage.module.scss';

// 🔹 Mock data fallback
const mockHospitalData = {
    specialtyName: 'Chuyên khoa Tiêu hóa',
    specialtyDescription:
        'Chuyên khoa Tiêu hóa cung cấp dịch vụ khám, chẩn đoán và điều trị toàn diện các bệnh lý liên quan đến dạ dày, ruột, gan, mật và tụy, giúp phát hiện sớm, phòng ngừa biến chứng và nâng cao sức khỏe tiêu hóa.',
    data: [],
};

const ServiceHospitalPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { servicesparentId, serviceschildId } = useParams<{
        servicesparentId: string;
        serviceschildId: string;
    }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const itemsPerPage = 4;

    // Initialize filters from URL params
    const searchTermFromUrl = searchParams.get('searchTerm') || '';
    const hospitalIdFromUrl = searchParams.get('hospitalId') || '';
    const hospitalIdsFromUrl = searchParams.getAll('hospitalIds');
    const provinceIdFromUrl = searchParams.get('provinceId') || '';
    const districtIdFromUrl = searchParams.get('districtId') || '';
    const provinceNameFromUrl = searchParams.get('provinceName') || '';
    const districtNameFromUrl = searchParams.get('districtName') || '';
    const pageFromUrl = searchParams.get('page');

    // Filter states (used for API calls) - initialize from URL params
    const [searchTerm, setSearchTerm] = useState<string>(searchTermFromUrl);
    const [hospitalFilter, setHospitalFilter] = useState<string>(hospitalIdFromUrl);
    const [hospitalFilters, setHospitalFilters] = useState<string[]>(hospitalIdsFromUrl);
    const [areaFilter, setAreaFilter] = useState<
        | {
              provinceId?: string;
              districtId?: string;
              provinceName?: string;
              districtName?: string;
          }
        | undefined
    >(
        provinceIdFromUrl || districtIdFromUrl
            ? {
                  provinceId: provinceIdFromUrl || undefined,
                  districtId: districtIdFromUrl || undefined,
                  provinceName: provinceNameFromUrl || undefined,
                  districtName: districtNameFromUrl || undefined,
              }
            : undefined
    );
    const [currentPage, setCurrentPage] = useState<number>(
        pageFromUrl ? Number.parseInt(pageFromUrl, 10) : 1
    );

    // Debounced search term for API calls (to avoid calling API on every keystroke)
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTermFromUrl);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Ref to track if URL filters have been initialized
    const hasInitializedUrlFilters = useRef(false);
    // Ref to track if category info has been fetched
    const hasFetchedCategoryInfo = useRef(false);

    // Redux selectors - separate category info and services list
    const categoryInfo = useAppSelector(
        (state) => state.medicalService.serviceCategories.selectedServiceCategory
    );
    const servicesData = useAppSelector(
        (state) => state.medicalService.serviceCategories.servicesWithHospital
    );
    // Loading states - separate for category and services
    const isLoadingCategory = useAppSelector(
        (state) =>
            state.medicalService.serviceCategories.isLoading &&
            !state.medicalService.serviceCategories.servicesWithHospital
    );
    const error = useAppSelector((state) => state.medicalService.serviceCategories.error);

    // Helper function to update URL params
    const updateURLParams = (
        updates: Record<string, string | number | undefined | null | string[]>
    ) => {
        const newParams = new URLSearchParams(searchParams);

        // Always ensure page is present
        const defaultParams = {
            page: currentPage,
        };

        // Merge defaults with updates
        const allUpdates = { ...defaultParams, ...updates };

        for (const [key, value] of Object.entries(allUpdates)) {
            if (Array.isArray(value)) {
                // Handle array values (like hospitalIds)
                newParams.delete(key);
                for (const item of value) {
                    if (item) {
                        newParams.append(key, item);
                    }
                }
            } else if (value !== undefined && value !== null && String(value) !== '') {
                newParams.set(key, String(value));
            } else {
                newParams.delete(key);
            }
        }

        setSearchParams(newParams, { replace: true });
    };

    // Fetch category info ONCE when component mounts (for hero section)
    useEffect(() => {
        if (serviceschildId && !hasFetchedCategoryInfo.current) {
            dispatch(getServiceCategoryByIdAsync(serviceschildId));
            hasFetchedCategoryInfo.current = true;
        }
    }, [dispatch, serviceschildId]);

    // Initialize filters from URL params on mount and sync when URL changes (e.g., browser back/forward)
    useEffect(() => {
        if (serviceschildId) {
            // Read URL params
            const currentSearchTerm = searchParams.get('searchTerm') || '';
            const currentHospitalId = searchParams.get('hospitalId') || '';
            const currentHospitalIds = searchParams.getAll('hospitalIds');
            const currentProvinceId = searchParams.get('provinceId') || '';
            const currentDistrictId = searchParams.get('districtId') || '';
            const currentProvinceName = searchParams.get('provinceName') || '';
            const currentDistrictName = searchParams.get('districtName') || '';
            const currentPageFromUrl = searchParams.get('page');

            // Update active filter states from URL params (used for API)
            setSearchTerm((prev) => {
                if (prev !== currentSearchTerm) {
                    return currentSearchTerm;
                }
                return prev;
            });
            setHospitalFilter((prev) => {
                if (prev !== currentHospitalId) {
                    return currentHospitalId;
                }
                return prev;
            });
            setHospitalFilters((prev) => {
                const currentIdsStr = JSON.stringify(currentHospitalIds);
                const prevIdsStr = JSON.stringify(prev);
                if (currentIdsStr !== prevIdsStr) {
                    return currentHospitalIds;
                }
                return prev;
            });

            if (currentProvinceId || currentDistrictId) {
                const newAreaFilter = {
                    provinceId: currentProvinceId || undefined,
                    districtId: currentDistrictId || undefined,
                    provinceName: currentProvinceName || undefined,
                    districtName: currentDistrictName || undefined,
                };
                setAreaFilter((prev) => {
                    // Compare individual fields instead of JSON.stringify to avoid issues with key order
                    if (
                        prev?.provinceId !== newAreaFilter.provinceId ||
                        prev?.districtId !== newAreaFilter.districtId ||
                        prev?.provinceName !== newAreaFilter.provinceName ||
                        prev?.districtName !== newAreaFilter.districtName
                    ) {
                        return newAreaFilter;
                    }
                    return prev;
                });
            } else {
                setAreaFilter((prev) => {
                    if (prev) {
                        return undefined;
                    }
                    return prev;
                });
            }

            if (currentPageFromUrl) {
                const pageNum = Number.parseInt(currentPageFromUrl, 10);
                setCurrentPage((prev) => {
                    if (prev !== pageNum) {
                        return pageNum;
                    }
                    return prev;
                });
            }

            // Also sync debouncedSearchTerm from URL
            setDebouncedSearchTerm(currentSearchTerm);

            hasInitializedUrlFilters.current = true;
        }
    }, [serviceschildId, searchParams]);

    // Debounce searchTerm - update debouncedSearchTerm after 300ms of no typing (same as DoctorList)
    useEffect(() => {
        // Clear existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout to update debouncedSearchTerm after 300ms
        searchTimeoutRef.current = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        // Cleanup timeout on unmount
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchTerm]);

    // Update URL when debouncedSearchTerm changes (after debounce, like DoctorList)
    // Only update if hasInitializedUrlFilters to avoid updating during initial sync
    useEffect(() => {
        if (hasInitializedUrlFilters.current) {
            updateURLParams({
                searchTerm: debouncedSearchTerm || null,
                page: currentPage,
            });
        }
    }, [debouncedSearchTerm, currentPage]);

    // Fetch services data with filters (real-time search like DoctorList)
    useEffect(() => {
        if (serviceschildId && hasInitializedUrlFilters.current) {
            // Build hospitalIds array from single filter or multiple filters
            const hospitalIds: string[] = [];
            if (hospitalFilter) {
                hospitalIds.push(hospitalFilter);
            }
            if (hospitalFilters.length > 0) {
                hospitalIds.push(...hospitalFilters);
            }
            // Remove duplicates
            const uniqueHospitalIds = Array.from(new Set(hospitalIds));

            // Debug: Log area filter values
            console.log('🔍 Fetching services with filters:', {
                provinceId: areaFilter?.provinceId,
                districtId: areaFilter?.districtId,
                provinceName: areaFilter?.provinceName,
                districtName: areaFilter?.districtName,
                areaFilter: areaFilter,
            });

            dispatch(
                getServicesWithHospitalAsync({
                    categoryId: serviceschildId,
                    params: {
                        page: currentPage,
                        pageSize: itemsPerPage,
                        includeInactive: false,
                        searchTerm: debouncedSearchTerm || undefined,
                        hospitalIds: uniqueHospitalIds.length > 0 ? uniqueHospitalIds : undefined,
                        provinceId: areaFilter?.provinceId,
                        districtId: areaFilter?.districtId,
                    },
                })
            );
        }
    }, [
        dispatch,
        serviceschildId,
        currentPage,
        itemsPerPage,
        debouncedSearchTerm,
        hospitalFilter,
        hospitalFilters,
        areaFilter,
    ]);

    // Use API data or fallback to mock data
    // Category info from selectedServiceCategory (fetched once), services from servicesWithHospital
    const hospitalData = categoryInfo
        ? {
              specialtyName: categoryInfo.name,
              specialtyDescription: categoryInfo.description || '',
              data:
                  servicesData?.services.map((service) => ({
                      hospital: {
                          id: service.hospital.id,
                          idservice: service.id,
                          image: service.imageUrl,
                          rating: 4.5, // Default rating since not in API
                          specialty: service.name,
                          available: service.status === ('ACTIVE' as any),
                          name: service.hospital.name,
                          location: service.hospital.address,
                          votes: { positive: 250, total: 300 }, // Default votes
                          experience: service.durationTime,
                          fees: service.price,
                          nextAvailable: '10:00 AM - 15 Oct, Tue', // Default time
                      },
                  })) || [],
          }
        : mockHospitalData;

    // 🔹 Breadcrumb config với params
    const breadcrumbData = {
        items: [
            { label: 'Trang chủ', path: '/', isActive: false },
            {
                label: 'Dịch Vụ Y Tế',
                path: replacePathParams(buildPath(PATHS.Service.ROOT), {}),
                isActive: false,
            },
            {
                label: servicesData?.parentCategoryName || categoryInfo?.name || 'Chuyên Khoa',
                path: replacePathParams(PATHS.Service.CATEGORIES, {
                    servicesparentId: servicesparentId!.toString(),
                }),
                isActive: false,
            },
            { label: hospitalData.specialtyName, isActive: true },
        ],
        title: 'Danh Sách Bệnh Viện Đăng Kí Dịch Vụ ' + hospitalData.specialtyName,
    };

    // Callback functions for SearchInput - real-time search like DoctorList
    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1); // Reset to first page when searching
        // Don't update URL immediately - wait for debounce to prevent sync loop
    };

    const handleHospitalFilter = (hospitalId: string) => {
        setHospitalFilter(hospitalId);
        setHospitalFilters([]); // Clear multiple hospital filters when using single filter
        setCurrentPage(1);
        // Update URL params immediately
        updateURLParams({
            hospitalId: hospitalId || null,
            hospitalIds: null, // Clear multiple hospital IDs when using single filter
            page: 1,
        });
    };

    const handleHospitalFilters = (hospitalIds: string[]) => {
        setHospitalFilters(hospitalIds);
        setHospitalFilter(''); // Clear single hospital filter when using multiple filters
        setCurrentPage(1);
        // Update URL params immediately
        updateURLParams({
            hospitalId: null, // Clear single hospital ID when using multiple filters
            hospitalIds: hospitalIds.length > 0 ? hospitalIds : null,
            page: 1,
        });
    };

    const handleAreaFilter = (areaInfo: {
        provinceId?: string;
        districtId?: string;
        provinceName?: string;
        districtName?: string;
    }) => {
        console.log('📍 handleAreaFilter called with:', areaInfo);
        setAreaFilter(areaInfo);
        setCurrentPage(1);
        // Update URL params immediately
        updateURLParams({
            provinceId: areaInfo?.provinceId || null,
            districtId: areaInfo?.districtId || null,
            provinceName: areaInfo?.provinceName || null,
            districtName: areaInfo?.districtName || null,
            page: 1,
        });
    };

    // Server-side filtering - no client-side filtering needed
    // Data is already filtered by the backend
    // Ensure we only use the services from the API response (respect pagination)
    // Safeguard: Limit displayed services to match totalServices or pageSize to prevent display issues
    let currentHospitals = hospitalData.data;
    if (servicesData && servicesData.totalServices > 0) {
        const maxExpectedServices = Math.min(
            servicesData.pageSize,
            servicesData.totalServices - (servicesData.page - 1) * servicesData.pageSize
        );
        // If we have more services than expected, limit to expected count
        if (currentHospitals.length > maxExpectedServices) {
            console.warn(
                `⚠️ Limiting displayed services from ${currentHospitals.length} to ${maxExpectedServices} to match API totalServices`
            );
            currentHospitals = currentHospitals.slice(0, maxExpectedServices);
        }
    }
    const totalPages = servicesData?.totalPages || 1;

    // Debug: Log data to check for discrepancies
    useEffect(() => {
        if (servicesData) {
            const servicesCount = servicesData.services?.length || 0;
            const expectedCount = Math.min(
                servicesData.pageSize,
                servicesData.totalServices - (servicesData.page - 1) * servicesData.pageSize
            );

            const hasDiscrepancy = servicesCount !== expectedCount;
            let discrepancyMessage = '✅ OK';
            if (hasDiscrepancy) {
                discrepancyMessage = `⚠️ Mismatch: Expected ${expectedCount}, got ${servicesCount}`;
            }
            console.log('Services Data Debug:', {
                totalServices: servicesData.totalServices,
                servicesCount: servicesCount,
                expectedCount: expectedCount,
                page: servicesData.page,
                pageSize: servicesData.pageSize,
                totalPages: servicesData.totalPages,
                discrepancy: discrepancyMessage,
            });
            console.log('Current Hospitals Count:', currentHospitals.length);

            // Log if there's a mismatch
            if (servicesCount !== expectedCount && servicesCount > 0) {
                console.warn('⚠️ API returned different number of services than expected!', {
                    expected: expectedCount,
                    actual: servicesCount,
                    services: servicesData.services,
                });
            }
        }
    }, [servicesData, currentHospitals.length]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Update URL params
        updateURLParams({
            page: page,
        });
    };

    // Show loading state
    // Show loading only when fetching category info (initial load)
    if (isLoadingCategory && !categoryInfo) {
        return (
            <MainLayout>
                <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
                <HeroSection
                    title={hospitalData.specialtyName}
                    description={hospitalData.specialtyDescription}
                />
                <div className={`content ${styles.contentWrapper}`}>
                    <div className="container">
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{ minHeight: '400px' }}
                        >
                            <div className="spinner-border text-primary">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    // Show error state
    if (error) {
        return (
            <MainLayout>
                <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
                <HeroSection
                    title={hospitalData.specialtyName}
                    description={hospitalData.specialtyDescription}
                />
                <div className={`content ${styles.contentWrapper}`}>
                    <div className="container">
                        <div className="alert alert-danger" role="alert">
                            <h4 className="alert-heading">Lỗi!</h4>
                            <p>{error}</p>
                            <hr />
                            <button
                                className="btn btn-outline-danger"
                                onClick={() => globalThis.location.reload()}
                            >
                                Thử lại
                            </button>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
            <HeroSection
                title={hospitalData.specialtyName}
                description={hospitalData.specialtyDescription}
            />
            <div className={`content ${styles.contentWrapper}`}>
                <div className={styles.searchWrapper}>
                    <div className="container">
                        <SearchInput
                            hideSpecialty={true}
                            hideDate={true}
                            searchPlaceholder="Nhập tên dịch vụ"
                            onSearchChange={handleSearchChange}
                            onHospitalFilter={handleHospitalFilter}
                            onHospitalFilters={handleHospitalFilters}
                            onAreaFilter={handleAreaFilter}
                        />
                    </div>
                </div>
                <div className={'container'}>
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <div className="mb-4">
                                <h3>
                                    Hiển thị{' '}
                                    <span className="text-secondary">
                                        {servicesData?.totalServices || 0}
                                    </span>{' '}
                                    Dịch vụ Cho Bạn
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {currentHospitals.map((hospital) => (
                            <HospitalCard
                                key={hospital.hospital.idservice} // Use service ID as key, not hospital ID
                                name={hospital.hospital.specialty} // Service name
                                location={hospital.hospital.location}
                                fees={hospital.hospital.fees}
                                rating={hospital.hospital.rating}
                                image={hospital.hospital.image}
                                nextAvailable={hospital.hospital.nextAvailable}
                                degrees={hospital.hospital.name} // Hospital name
                                votes={hospital.hospital.votes}
                                experience={hospital.hospital.experience} // Duration in minutes
                                available={hospital.hospital.available}
                                linkDetail={replacePathParams(PATHS.Service.DETAIL, {
                                    servicesparentId: servicesparentId!.toString(),
                                    serviceschildId: serviceschildId!.toString(),
                                    servicesId: hospital.hospital.idservice,
                                })}
                                linkBooking={replacePathParams(PATHS.BOOKING.ROOT, {
                                    doctorId: hospital.hospital.idservice,
                                })}
                                linkProfileHospital={replacePathParams(PATHS.HOSPITAL.DETAIL, {
                                    id: hospital.hospital.id,
                                })}
                            />
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default ServiceHospitalPage;
