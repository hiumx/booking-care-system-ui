import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Calendar from '@/components/Calendar';
import Modal from '@/components/Modal';
import ModalArea from '@/components/ModalArea';
import clsx from 'clsx';
import styles from './SearchInput.module.scss';
import { PATHS } from '@/routes/paths';
// Removed unused icon imports as we now use images from backend
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getAllHospitalsAsync } from '@/store/slices/hospitalSlice';
import { getSpecialtiesAsync } from '@/store/slices/specialtySlice';

// Removed specialtyIconMap as we now use images from backend

// Removed specialtyColorMap as we now use images from backend

type SearchInputProps = {
    forceWrap?: boolean; // make inputs wrap into multiple rows regardless of screen size
    onSearchChange?: (searchTerm: string) => void; // Callback for search term changes
    onSpecialtyFilter?: (specialtyId: string) => void; // Callback for single specialty filter (backward compatibility)
    onSpecialtyFilters?: (specialtyIds: string[]) => void; // Callback for multiple specialty filters
    onHospitalFilter?: (hospitalId: string) => void; // Callback for single hospital filter (backward compatibility)
    onHospitalFilters?: (hospitalIds: string[]) => void; // Callback for multiple hospital filters
    onAreaFilter?: (areaInfo: {
        provinceId?: string;
        districtId?: string;
        provinceName?: string;
        districtName?: string;
    }) => void; // Callback for area filter
    rescheduleHospitalId?: string | null; // Hospital ID from reschedule flow (Option 3)
    rescheduleSpecialtyId?: string | null; // Specialty ID from reschedule flow (Option 3)
};

const SearchInput: React.FC<SearchInputProps> = ({
    forceWrap = false,
    onSearchChange,
    onSpecialtyFilter,
    onSpecialtyFilters,
    onHospitalFilter,
    onHospitalFilters,
    onAreaFilter,
    rescheduleHospitalId,
    rescheduleSpecialtyId,
}) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { simpleHospitals } = useAppSelector((state) => state.hospital);
    const { specialties } = useAppSelector((state) => state.specialty);

    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);
    const [showClinicModal, setShowClinicModal] = useState(false);
    const [showAreaModal, setShowAreaModal] = useState(false);
    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
    const [selectedClinics, setSelectedClinics] = useState<string[]>([]);
    const [selectedArea, setSelectedArea] = useState<string>('');
    const [selectedAreaInfo, setSelectedAreaInfo] = useState<{
        provinceId?: string;
        districtId?: string;
        provinceName?: string;
        districtName?: string;
    }>({});
    const [doctorName, setDoctorName] = useState<string>('');
    const dateInputRef = useRef<HTMLInputElement>(null);

    // Track if component is on DoctorList page for syncing
    const isDoctorListPage = window.location.pathname.includes('/doctors');

    // Refs for auto-resize
    const doctorNameRef = useRef<HTMLDivElement>(null);
    const clinicRef = useRef<HTMLButtonElement>(null);
    const specialtyRef = useRef<HTMLButtonElement>(null);

    // Ref to track if reschedule filters have been initialized
    const rescheduleInitialized = useRef(false);

    // Load data on component mount
    useEffect(() => {
        // Load hospitals (optimized API)
        dispatch(getAllHospitalsAsync());

        // Load specialties
        dispatch(getSpecialtiesAsync());
    }, [dispatch]);

    // Handle reschedule parameters from URL (Option 3: Choose new doctor)
    // Initialize selected filters from reschedule params (for display only)
    // Only run ONCE when component mounts with reschedule params
    useEffect(() => {
        if (!rescheduleInitialized.current && (rescheduleHospitalId || rescheduleSpecialtyId)) {
            if (rescheduleHospitalId) {
                setSelectedClinics([rescheduleHospitalId]);
            }
            if (rescheduleSpecialtyId) {
                setSelectedSpecialties([rescheduleSpecialtyId]);
            }
            rescheduleInitialized.current = true;
        }
        // Note: Don't call onHospitalFilters/onSpecialtyFilters here
        // DoctorList already handles the filtering via its own useEffect
    }, [rescheduleHospitalId, rescheduleSpecialtyId]);

    // Sync search input with URL params when on DoctorList page
    useEffect(() => {
        if (isDoctorListPage) {
            const searchFromUrl = searchParams.get('search');
            const dateFromUrl = searchParams.get('date');
            const provinceIdFromUrl = searchParams.get('provinceId');
            const districtIdFromUrl = searchParams.get('districtId');
            const provinceNameFromUrl = searchParams.get('provinceName');
            const districtNameFromUrl = searchParams.get('districtName');
            const specialtyIdFromUrl = searchParams.get('specialtyId');
            const hospitalIdFromUrl = searchParams.get('hospitalId');

            // Sync doctor name from URL
            setDoctorName(searchFromUrl || '');
            // Update the contentEditable div
            setTimeout(() => {
                const contentEditableDiv = document.querySelector(
                    '[contenteditable="true"][data-placeholder="Nhập tên bác sĩ"]'
                );
                if (contentEditableDiv) {
                    contentEditableDiv.textContent = searchFromUrl || '';
                }
            }, 0);

            // Sync date from URL
            if (dateFromUrl) {
                try {
                    const parsedDate = new Date(dateFromUrl);
                    if (!isNaN(parsedDate.getTime())) {
                        setSelectedDate(parsedDate);
                    }
                } catch (e) {
                    console.error('Error parsing date from URL:', e);
                }
            }

            // Sync area from URL
            if (provinceIdFromUrl || districtIdFromUrl) {
                const areaInfo = {
                    provinceId: provinceIdFromUrl || undefined,
                    districtId: districtIdFromUrl || undefined,
                    provinceName: provinceNameFromUrl || undefined,
                    districtName: districtNameFromUrl || undefined,
                };
                setSelectedAreaInfo(areaInfo);

                // Build display text
                if (provinceNameFromUrl && districtNameFromUrl) {
                    setSelectedArea(`${provinceNameFromUrl} - ${districtNameFromUrl}`);
                } else if (provinceNameFromUrl) {
                    setSelectedArea(provinceNameFromUrl);
                }
            } else {
                // Clear area if not in URL
                setSelectedAreaInfo({});
                setSelectedArea('');
            }

            // Sync specialty from URL
            if (specialtyIdFromUrl) {
                setSelectedSpecialties([specialtyIdFromUrl]);
            } else {
                setSelectedSpecialties([]);
            }

            // Sync hospital from URL
            if (hospitalIdFromUrl) {
                setSelectedClinics([hospitalIdFromUrl]);
            } else {
                setSelectedClinics([]);
            }
        }
    }, [isDoctorListPage, searchParams]);

    // Auto-resize function
    const autoResize = (element: HTMLDivElement) => {
        element.style.height = 'auto';
        element.style.height = element.scrollHeight + 'px';
    };

    // Auto-resize on content change
    useEffect(() => {
        if (doctorNameRef.current) {
            autoResize(doctorNameRef.current);
        }
    }, [doctorName]);

    useEffect(() => {
        if (clinicRef.current) {
            // Button elements don't need auto-resize
        }
    }, [selectedClinics]);

    useEffect(() => {
        if (specialtyRef.current) {
            // Button elements don't need auto-resize
        }
    }, [selectedSpecialties]);

    // Helper function to check if hospital has selected specialties
    const hospitalHasSelectedSpecialties = (hospital: any, selectedSpecialties: string[]) => {
        if (!hospital.specialties || hospital.specialties.length === 0) {
            return true; // Include hospital if no specialty data available
        }

        return selectedSpecialties.some((selectedSpecialty) =>
            hospital.specialties.some(
                (hospitalSpecialty: any) => hospitalSpecialty.id === selectedSpecialty
            )
        );
    };

    // Helper function to check if specialty is available in selected hospitals
    const specialtyAvailableInSelectedHospitals = (specialty: any, selectedClinics: any[]) => {
        return selectedClinics.some((hospital) => {
            if (!hospital.specialties || hospital.specialties.length === 0) {
                return true; // Include specialty if no hospital specialty data available
            }

            return hospital.specialties.some(
                (hospitalSpecialty: any) => hospitalSpecialty.id === specialty.id
            );
        });
    };

    // Transform hospitals data for modal - filter based on area or specialty selection
    const getFilteredHospitals = () => {
        let filteredHospitals = simpleHospitals;

        // If area is selected first, filter hospitals by location
        if (selectedAreaInfo.provinceId || selectedAreaInfo.districtId) {
            // Filter hospitals by location (province or district)
            filteredHospitals = simpleHospitals.filter((hospital) => {
                // Check if hospital has location data and matches selected area
                if ((hospital as any).provinceId && selectedAreaInfo.provinceId) {
                    return (hospital as any).provinceId === selectedAreaInfo.provinceId;
                }
                if ((hospital as any).districtId && selectedAreaInfo.districtId) {
                    return (hospital as any).districtId === selectedAreaInfo.districtId;
                }
                return true; // Include hospital if no location data available
            });
        }

        // If specialty is selected first, filter hospitals that have doctors with those specialties
        if (selectedSpecialties.length > 0) {
            // Filter hospitals that have doctors with selected specialties
            filteredHospitals = filteredHospitals.filter((hospital) =>
                hospitalHasSelectedSpecialties(hospital, selectedSpecialties)
            );
        }

        return filteredHospitals;
    };

    // Transform specialties data for modal - filter based on hospital selection
    const getFilteredSpecialties = () => {
        let filteredSpecialties = specialties;

        // If hospital is selected first, filter specialties available in those hospitals
        if (selectedClinics.length > 0) {
            // Filter specialties available in selected hospitals
            filteredSpecialties = specialties.filter((specialty) =>
                specialtyAvailableInSelectedHospitals(specialty, selectedClinics)
            );
        }

        return filteredSpecialties;
    };

    const hospitalItems = getFilteredHospitals().map((hospital) => ({
        id: hospital.id,
        name: hospital.name,
        imageUrl: hospital.avatarUrl || '',
        address: '', // Simple response doesn't include address
    }));

    const specialtyItems = getFilteredSpecialties().map((specialty) => ({
        id: specialty.id,
        name: specialty.name,
        imageUrl: specialty.imageUrl,
    }));

    // Handle specialty modal
    const handleSpecialtyClick = () => {
        setShowSpecialtyModal(true);
    };

    const handleSpecialtyModalClose = () => {
        setShowSpecialtyModal(false);
    };

    const handleSpecialtyApply = (specialties: string[], _searchTerm: string) => {
        // If specialties is empty array, it means clear was called
        if (specialties.length === 0) {
            setSelectedSpecialties([]);
            setShowSpecialtyModal(false);

            // Call callback with empty array to clear filter
            if (onSpecialtyFilters) {
                onSpecialtyFilters([]);
            }
            return;
        }

        setSelectedSpecialties(specialties);
        setShowSpecialtyModal(false);

        // Call multiple specialty callback if available
        if (onSpecialtyFilters) {
            onSpecialtyFilters(specialties);
        }
        // Fallback to single specialty callback for backward compatibility
        else if (specialties.length > 0 && onSpecialtyFilter) {
            onSpecialtyFilter(specialties[0]);
        }
    };

    // Handle clinic modal
    const handleClinicClick = () => {
        setShowClinicModal(true);
    };

    const handleClinicModalClose = () => {
        setShowClinicModal(false);
    };

    const handleClinicApply = (clinics: string[], _searchTerm: string) => {
        // If clinics is empty array, it means clear was called
        if (clinics.length === 0) {
            setSelectedClinics([]);
            setShowClinicModal(false);

            // Call callback with empty array to clear filter
            if (onHospitalFilters) {
                onHospitalFilters([]);
            }
            return;
        }

        setSelectedClinics(clinics);
        setShowClinicModal(false);

        // Call multiple hospital callback if available
        if (onHospitalFilters) {
            onHospitalFilters(clinics);
        }
        // Fallback to single hospital callback for backward compatibility
        else if (clinics.length > 0 && onHospitalFilter) {
            onHospitalFilter(clinics[0]);
        }
    };

    // Handle area modal
    const handleAreaClick = () => {
        setShowAreaModal(true);
    };

    const handleAreaModalClose = () => {
        setShowAreaModal(false);
    };

    const handleAreaApply = (areaDisplay: string, locationId: string, provinceId?: string) => {
        // If both areaDisplay and locationId are empty, it means clear was called
        if (!areaDisplay && !locationId) {
            setSelectedArea('');
            setSelectedAreaInfo({});
            setShowAreaModal(false);

            // Call area filter callback with empty values to clear filter
            if (onAreaFilter) {
                onAreaFilter({});
            }
            return;
        }

        setSelectedArea(areaDisplay);

        // Parse area info from the display string and locationId
        const areaInfo = {
            // If areaDisplay contains ' - ', then locationId is districtId, otherwise it's provinceId
            provinceId: areaDisplay.includes(' - ') ? provinceId : locationId,
            districtId: areaDisplay.includes(' - ') ? locationId : undefined,
            provinceName: areaDisplay.includes(' - ') ? areaDisplay.split(' - ')[0] : areaDisplay,
            districtName: areaDisplay.includes(' - ') ? areaDisplay.split(' - ')[1] : '',
        };

        setSelectedAreaInfo(areaInfo);
        setShowAreaModal(false);

        // Call area filter callback
        if (onAreaFilter) {
            onAreaFilter(areaInfo);
        }
    };

    // Handle date selection
    const handleDateChange = (value: Date | null) => {
        if (!value || Number.isNaN(value.getTime())) return; // Ignore invalid dates
        setSelectedDate(value);
        setShowDatePicker(false);
    };

    // Format date for display
    const formatDate = (date: Date | null) => {
        if (!date) return '';
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };

    // Check if today's date is selected
    const today = new Date();
    const isTodaySelected = selectedDate
        ? selectedDate.getDate() === today.getDate() &&
          selectedDate.getMonth() === today.getMonth() &&
          selectedDate.getFullYear() === today.getFullYear()
        : false;

    // Handle form submit to navigate to DoctorList
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Build search params
        const params = new URLSearchParams();

        // Add search term if available
        if (doctorName.trim()) {
            params.set('search', doctorName.trim());
        }

        // Add specialty filter if available
        if (selectedSpecialties.length > 0) {
            // Use the first selected specialty for simplicity
            params.set('specialtyId', selectedSpecialties[0]);
        }

        // Add hospital filter if available
        if (selectedClinics.length > 0) {
            // Use the first selected clinic for simplicity
            params.set('hospitalId', selectedClinics[0]);
        }

        // Add area filter if available
        if (selectedAreaInfo.provinceId) {
            params.set('provinceId', selectedAreaInfo.provinceId);
        }
        if (selectedAreaInfo.districtId) {
            params.set('districtId', selectedAreaInfo.districtId);
        }
        if (selectedAreaInfo.provinceName) {
            params.set('provinceName', selectedAreaInfo.provinceName);
        }
        if (selectedAreaInfo.districtName) {
            params.set('districtName', selectedAreaInfo.districtName);
        }

        // Add date if selected
        if (selectedDate) {
            params.set('date', selectedDate.toISOString());
        }

        // Always add pagination params
        params.set('pageNumber', '1');
        params.set('pageSize', '10');

        // Navigate to DoctorList with params
        navigate(`${PATHS.DOCTOR.ROOT}?${params.toString()}`);
    };

    return (
        <div
            className={clsx(
                'bg-primary-gradient doctors-search-box',
                styles.doctorsSearchBoxCustom,
                styles.roundedPillCustom,
                forceWrap && styles.forceWrap
            )}
        >
            <div
                className={clsx(
                    styles.searchBoxOne,
                    styles.roundedPillCustom,
                    styles.customWidthSearch
                )}
            >
                <form onSubmit={handleSubmit}>
                    {/* Second Row: Doctor, Specialty, Clinic, Location, Date, and Button */}
                    <div className={clsx('search-row second-row', styles.secondRow)}>
                        <div className={clsx('search-input search-map-line', styles.inputItem)}>
                            <i className="isax isax-profile-2user5"></i>
                            <div className="mb-0">
                                <div
                                    ref={doctorNameRef}
                                    className={clsx(
                                        'form-control',
                                        styles.formControlCustom,
                                        styles.multiLineInput
                                    )}
                                    contentEditable
                                    suppressContentEditableWarning={true}
                                    data-placeholder="Nhập tên bác sĩ"
                                    onInput={(e) => {
                                        const text = e.currentTarget.textContent || '';
                                        setDoctorName(text);
                                        onSearchChange?.(text);
                                        autoResize(e.currentTarget);
                                    }}
                                    style={{ minHeight: '50px' }}
                                />
                            </div>
                        </div>
                        <div className={clsx('search-input search-map-line', styles.inputItem)}>
                            <i className="isax isax-hospital5 bficon"></i>
                            <div className="mb-0">
                                <button
                                    ref={clinicRef}
                                    type="button"
                                    className={clsx(
                                        'form-control',
                                        styles.formControlCustom,
                                        styles.multiLineInput
                                    )}
                                    data-placeholder="Chọn bệnh viện"
                                    onClick={handleClinicClick}
                                    aria-label="Chọn bệnh viện"
                                    style={{ minHeight: '50px', textAlign: 'left' }}
                                >
                                    {selectedClinics.length > 0
                                        ? selectedClinics
                                              .map(
                                                  (id) =>
                                                      hospitalItems.find(
                                                          (clinic) => clinic.id === id
                                                      )?.name
                                              )
                                              .filter(Boolean)
                                              .map((name) => (
                                                  <span key={name} className={styles.tag}>
                                                      {name}
                                                  </span>
                                              ))
                                        : null}
                                </button>
                            </div>
                        </div>
                        <div className={clsx('search-input search-map-line', styles.inputItem)}>
                            <i className="isax isax-health5"></i>
                            <div className="mb-0">
                                <button
                                    ref={specialtyRef}
                                    type="button"
                                    className={clsx(
                                        'form-control',
                                        styles.formControlCustom,
                                        styles.multiLineInput
                                    )}
                                    data-placeholder="Chọn chuyên khoa"
                                    onClick={handleSpecialtyClick}
                                    aria-label="Chọn chuyên khoa"
                                    style={{ minHeight: '50px', textAlign: 'left' }}
                                >
                                    {selectedSpecialties.length > 0
                                        ? selectedSpecialties
                                              .map(
                                                  (id) =>
                                                      specialtyItems.find((spec) => spec.id === id)
                                                          ?.name
                                              )
                                              .filter(Boolean)
                                              .map((name) => (
                                                  <span key={name} className={styles.tag}>
                                                      {name}
                                                  </span>
                                              ))
                                        : null}
                                </button>
                            </div>
                        </div>
                        <div className={clsx('search-input search-map-line', styles.inputItem)}>
                            <i className="isax isax-location5"></i>
                            <div className="mb-0">
                                <button
                                    type="button"
                                    className={clsx(
                                        'form-control',
                                        styles.formControlCustom,
                                        styles.multiLineInput
                                    )}
                                    data-placeholder="Chọn địa điểm"
                                    onClick={handleAreaClick}
                                    aria-label="Chọn địa điểm"
                                    style={{ minHeight: '50px', textAlign: 'left' }}
                                >
                                    {selectedArea ? (
                                        <span className={styles.tag}>{selectedArea}</span>
                                    ) : null}
                                </button>
                            </div>
                        </div>
                        <div
                            className={clsx('search-input search-calendar-line', styles.inputItem)}
                        >
                            <i
                                className="isax isax-calendar-tick5"
                                onClick={() => setShowDatePicker(!showDatePicker)}
                            ></i>
                            <div className="mb-0">
                                <input
                                    type="text"
                                    className="form-control datetimepicker"
                                    placeholder="Date"
                                    value={formatDate(selectedDate)}
                                    onClick={() => setShowDatePicker(!showDatePicker)}
                                    ref={dateInputRef}
                                    readOnly
                                />
                                <Calendar
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    minDate={new Date()}
                                    maxDate={
                                        new Date(
                                            today.getFullYear(),
                                            today.getMonth(),
                                            today.getDate() + 30
                                        )
                                    }
                                    anchorEl={dateInputRef.current}
                                    open={showDatePicker}
                                    onClose={() => setShowDatePicker(false)}
                                    isTodaySelected={isTodaySelected}
                                />
                            </div>
                        </div>
                        <div className="form-search-btn">
                            <button
                                className={clsx(
                                    'btn btn-primary d-inline-flex align-items-center rounded-pill',
                                    styles.btnNoWrap
                                )}
                                type="submit"
                            >
                                <i className="isax isax-search-normal-15 me-2"></i>Tìm kiếm
                            </button>
                        </div>
                    </div>
                </form>

                <Modal
                    isOpen={showSpecialtyModal}
                    onClose={handleSpecialtyModalClose}
                    onApply={handleSpecialtyApply}
                    items={specialtyItems}
                    title="Tìm theo chuyên khoa"
                    itemType="specialty"
                    initialSelectedItems={selectedSpecialties}
                />
                <Modal
                    isOpen={showClinicModal}
                    onClose={handleClinicModalClose}
                    onApply={handleClinicApply}
                    items={hospitalItems}
                    title="Tìm theo Bệnh viện"
                    itemType="hospital"
                    initialSelectedItems={selectedClinics}
                />
                <ModalArea
                    isOpen={showAreaModal}
                    onClose={handleAreaModalClose}
                    onApply={handleAreaApply}
                    selectedProvinceId={selectedAreaInfo.provinceId}
                    selectedDistrictId={selectedAreaInfo.districtId}
                />
            </div>
        </div>
    );
};

export default SearchInput;
