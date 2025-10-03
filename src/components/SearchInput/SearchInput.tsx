import React, { useState, useRef, useEffect } from 'react';
import Calendar from '@/components/Calendar';
import Modal from '@/components/Modal';
import ModalArea from './components/ModalArea';
import clsx from 'clsx';
import styles from './SearchInput.module.scss';
import {
    Shield,
    Activity,
    Heart,
    Brain,
    Eye,
    Stethoscope,
    Pill,
    Syringe,
    Baby,
    Bone,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getHospitalsAsync } from '@/store/slices/hospitalSlice';
import { getSpecialtiesAsync } from '@/store/slices/specialtySlice';

// Icon mapping for specialties
const specialtyIconMap: Record<string, any> = {
    'Dị ứng - miễn dịch': Shield,
    'Y học cổ truyền': Activity,
    'Lao - bệnh phổi': Heart,
    'Y học thể thao': Brain,
    'Nhãn khoa': Eye,
    'Tim mạch': Stethoscope,
    'Dược học': Pill,
    'Tiêm chủng': Syringe,
    'Nhi khoa': Baby,
    'Chấn thương chỉnh hình': Bone,
};

// Color mapping for specialties
const specialtyColorMap: Record<string, string> = {
    'Dị ứng - miễn dịch': 'blue',
    'Y học cổ truyền': 'green',
    'Lao - bệnh phổi': 'red',
    'Y học thể thao': 'orange',
    'Nhãn khoa': 'purple',
    'Tim mạch': 'pink',
    'Dược học': 'yellow',
    'Tiêm chủng': 'indigo',
    'Nhi khoa': 'teal',
    'Chấn thương chỉnh hình': 'cyan',
};

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
};

const SearchInput: React.FC<SearchInputProps> = ({
    forceWrap = false,
    onSearchChange,
    onSpecialtyFilter,
    onSpecialtyFilters,
    onHospitalFilter,
    onHospitalFilters,
    onAreaFilter,
}) => {
    const dispatch = useAppDispatch();
    const { hospitals } = useAppSelector((state) => state.hospital);
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

    // Load data on component mount
    useEffect(() => {
        // Load hospitals
        dispatch(getHospitalsAsync({ page: 1, pageSize: 100 }));

        // Load specialties
        dispatch(getSpecialtiesAsync());
    }, [dispatch]);

    // Transform hospitals data for modal - filter based on area or specialty selection
    const getFilteredHospitals = () => {
        let filteredHospitals = hospitals;

        // If area is selected first, filter hospitals by location
        if (selectedAreaInfo.provinceId || selectedAreaInfo.districtId) {
            // TODO: Add location-based filtering when hospital location data is available
            // For now, return all hospitals (will be implemented with backend support)
            filteredHospitals = hospitals;
        }

        // If specialty is selected first, filter hospitals that have doctors with those specialties
        if (selectedSpecialties.length > 0) {
            // TODO: Add specialty-based hospital filtering when doctor-hospital-specialty relationship is available
            // For now, return all hospitals (will be implemented with backend support)
            filteredHospitals = hospitals;
        }

        return filteredHospitals;
    };

    // Transform specialties data for modal - filter based on hospital selection
    const getFilteredSpecialties = () => {
        let filteredSpecialties = specialties;

        // If hospital is selected first, filter specialties available in those hospitals
        if (selectedClinics.length > 0) {
            // TODO: Add hospital-based specialty filtering when doctor-hospital-specialty relationship is available
            // For now, return all specialties (will be implemented with backend support)
            filteredSpecialties = specialties;
        }

        return filteredSpecialties;
    };

    const hospitalItems = getFilteredHospitals().map((hospital) => ({
        id: hospital.id,
        name: hospital.name,
        imageUrl: hospital.avatarUrl || '',
        address: hospital.address,
    }));

    const specialtyItems = getFilteredSpecialties().map((specialty) => ({
        id: specialty.id,
        name: specialty.name,
        icon: specialtyIconMap[specialty.name] || Shield,
        color: specialtyColorMap[specialty.name] || 'blue',
    }));

    // Handle specialty modal
    const handleSpecialtyClick = () => {
        setShowSpecialtyModal(true);
    };

    const handleSpecialtyModalClose = () => {
        setShowSpecialtyModal(false);
    };

    const handleSpecialtyApply = (specialties: string[]) => {
        console.log('SearchInput: handleSpecialtyApply called with:', specialties);
        setSelectedSpecialties(specialties);
        setShowSpecialtyModal(false);

        // Call multiple specialty callback if available
        if (onSpecialtyFilters) {
            console.log('SearchInput: calling onSpecialtyFilters with:', specialties);
            onSpecialtyFilters(specialties);
        }
        // Fallback to single specialty callback for backward compatibility
        else if (specialties.length > 0 && onSpecialtyFilter) {
            console.log('SearchInput: calling onSpecialtyFilter with:', specialties[0]);
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

    const handleClinicApply = (clinics: string[]) => {
        console.log('SearchInput: handleClinicApply called with:', clinics);
        setSelectedClinics(clinics);
        setShowClinicModal(false);

        // Call multiple hospital callback if available
        if (onHospitalFilters) {
            console.log('SearchInput: calling onHospitalFilters with:', clinics);
            onHospitalFilters(clinics);
        }
        // Fallback to single hospital callback for backward compatibility
        else if (clinics.length > 0 && onHospitalFilter) {
            console.log('SearchInput: calling onHospitalFilter with:', clinics[0]);
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

    const handleAreaApply = (areaDisplay: string, locationId: string) => {
        console.log('SearchInput: handleAreaApply called with:', areaDisplay, locationId);
        setSelectedArea(areaDisplay);

        // Parse area info from the display string and locationId
        const areaInfo = {
            // If areaDisplay contains ' - ', then locationId is districtId, otherwise it's provinceId
            provinceId: areaDisplay.includes(' - ') ? undefined : locationId,
            districtId: areaDisplay.includes(' - ') ? locationId : undefined,
            provinceName: areaDisplay.includes(' - ') ? areaDisplay.split(' - ')[0] : areaDisplay,
            districtName: areaDisplay.includes(' - ') ? areaDisplay.split(' - ')[1] : '',
        };

        setSelectedAreaInfo(areaInfo);
        setShowAreaModal(false);

        // Call area filter callback
        if (onAreaFilter) {
            console.log('SearchInput: calling onAreaFilter with:', areaInfo);
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
                <form action="#">
                    {/* Second Row: Doctor, Specialty, Clinic, Location, Date, and Button */}
                    <div className={clsx('search-row second-row', styles.secondRow)}>
                        <div className={clsx('search-input search-map-line', styles.inputItem)}>
                            <i className="isax isax-profile-2user5"></i>
                            <div className="mb-0">
                                <input
                                    type="text"
                                    className={clsx('form-control', styles.formControlCustom)}
                                    placeholder="Nhập tên bác sĩ"
                                    value={doctorName}
                                    onChange={(e) => {
                                        console.log(
                                            'SearchInput: doctor name changed to:',
                                            e.target.value
                                        );
                                        setDoctorName(e.target.value);
                                        onSearchChange?.(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className={clsx('search-input search-map-line', styles.inputItem)}>
                            <i className="isax isax-hospital5 bficon"></i>
                            <div className="mb-0">
                                <input
                                    type="text"
                                    className={clsx('form-control', styles.formControlCustom)}
                                    placeholder="Chọn cơ sở y tế"
                                    onClick={handleClinicClick}
                                    readOnly
                                    value={selectedClinics
                                        .map(
                                            (id) =>
                                                hospitalItems.find((clinic) => clinic.id === id)
                                                    ?.name
                                        )
                                        .filter(Boolean)
                                        .join(', ')}
                                />
                            </div>
                        </div>
                        <div className={clsx('search-input search-map-line', styles.inputItem)}>
                            <i className="isax isax-health5"></i>
                            <div className="mb-0">
                                <input
                                    type="text"
                                    className={clsx('form-control', styles.formControlCustom)}
                                    placeholder="Chọn chuyên khoa"
                                    onClick={handleSpecialtyClick}
                                    readOnly
                                    value={selectedSpecialties
                                        .map(
                                            (id) =>
                                                specialtyItems.find((spec) => spec.id === id)?.name
                                        )
                                        .filter(Boolean)
                                        .join(', ')}
                                />
                            </div>
                        </div>
                        <div className={clsx('search-input search-map-line', styles.inputItem)}>
                            <i className="isax isax-location5"></i>
                            <div className="mb-0">
                                <input
                                    type="text"
                                    className={clsx('form-control', styles.formControlCustom)}
                                    placeholder="Chọn địa điểm"
                                    onClick={handleAreaClick}
                                    readOnly
                                    value={selectedArea}
                                />
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
                />
                <Modal
                    isOpen={showClinicModal}
                    onClose={handleClinicModalClose}
                    onApply={handleClinicApply}
                    items={hospitalItems}
                    title="Tìm theo cơ sở y tế"
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
