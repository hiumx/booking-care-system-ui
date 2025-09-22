import React, { useState, useRef } from 'react';
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

// Mock data based on database schema
const mockSpecialties = [
    {
        id: '1',
        name: 'Dị ứng - miễn dịch',
        icon: Shield,
        color: 'blue',
        status: 'ACTIVE',
    },
    {
        id: '2',
        name: 'Y học cổ truyền',
        icon: Activity,
        color: 'green',
        status: 'ACTIVE',
    },
    {
        id: '3',
        name: 'Lao - bệnh phổi',
        icon: Heart,
        color: 'red',
        status: 'ACTIVE',
    },
    {
        id: '4',
        name: 'Y học thể thao',
        icon: Brain,
        color: 'orange',
        status: 'ACTIVE',
    },
    {
        id: '5',
        name: 'Nhãn khoa',
        icon: Eye,
        color: 'purple',
        status: 'ACTIVE',
    },
    {
        id: '6',
        name: 'Tim mạch',
        icon: Stethoscope,
        color: 'pink',
        status: 'ACTIVE',
    },
    {
        id: '7',
        name: 'Dược học',
        icon: Pill,
        color: 'yellow',
        status: 'ACTIVE',
    },
    {
        id: '8',
        name: 'Tiêm chủng',
        icon: Syringe,
        color: 'indigo',
        status: 'ACTIVE',
    },
    {
        id: '9',
        name: 'Nhi khoa',
        icon: Baby,
        color: 'teal',
        status: 'ACTIVE',
    },
    {
        id: '10',
        name: 'Chấn thương chỉnh hình',
        icon: Bone,
        color: 'cyan',
        status: 'ACTIVE',
    },
];

const mockClinics = [
    {
        id: '1',
        name: 'Bệnh viện Chợ Rẫy',
        address: '201B Nguyễn Chí Thanh, Quận 5, TP.HCM',
        avatar_url:
            'https://images2.thanhnien.vn/528068263637045248/2023/8/18/img9538-16923539714192021645154.jpg',
        status: 'ACTIVE',
    },
    {
        id: '2',
        name: 'Bệnh viện Từ Dũ',
        address: '284 Cống Quỳnh, Quận 1, TP.HCM',
        avatar_url:
            'https://cdn.medpro.vn/medpro-production/medpro/topics/dat-lich-kham-benh-vien-Tu-Du-1.jpg',
        status: 'ACTIVE',
    },
    {
        id: '3',
        name: 'Bệnh viện Nhi Đồng 1',
        address: '341 Sư Vạn Hạnh, Quận 10, TP.HCM',
        avatar_url:
            'https://diadiemvietnam.vn/wp-content/uploads/2022/12/benh-vien-nhi-dong-1-750x422.jpg',
        status: 'ACTIVE',
    },
];

type SearchInputProps = {
    forceWrap?: boolean; // make inputs wrap into multiple rows regardless of screen size
    showSupportButton?: boolean; // show the booking support button next to search
};

const SearchInput: React.FC<SearchInputProps> = ({
    forceWrap = false,
    showSupportButton = false,
}) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);
    const [showClinicModal, setShowClinicModal] = useState(false);
    const [showAreaModal, setShowAreaModal] = useState(false);
    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
    const [selectedClinics, setSelectedClinics] = useState<string[]>([]);
    const [selectedArea, setSelectedArea] = useState<string>('');
    const dateInputRef = useRef<HTMLInputElement>(null);

    // Handle specialty modal
    const handleSpecialtyClick = () => {
        setShowSpecialtyModal(true);
    };

    const handleSpecialtyModalClose = () => {
        setShowSpecialtyModal(false);
    };

    const handleSpecialtyApply = (specialties: string[]) => {
        setSelectedSpecialties(specialties);
        setShowSpecialtyModal(false);
    };

    // Handle clinic modal
    const handleClinicClick = () => {
        setShowClinicModal(true);
    };

    const handleClinicModalClose = () => {
        setShowClinicModal(false);
    };

    const handleClinicApply = (clinics: string[]) => {
        setSelectedClinics(clinics);
        setShowClinicModal(false);
    };

    // Handle area modal
    const handleAreaClick = () => {
        setShowAreaModal(true);
    };

    const handleAreaModalClose = () => {
        setShowAreaModal(false);
    };

    const handleAreaApply = (areaDisplay: string) => {
        setSelectedArea(areaDisplay);
        setShowAreaModal(false);
    };

    // Handle date selection
    const handleDateChange = (value: Date | null) => {
        if (!value || isNaN(value.getTime())) return; // Ignore invalid dates
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
                    {/* First Row: Symptom Input */}
                    {/* <div className={clsx('search-row first-row', styles.firstRow)}>
                        <div
                            className={clsx(
                                'search-input search-calendar-line',
                                styles.symptomInput
                            )}
                        >
                            <i className="isax isax-note-25"></i>
                            <div className="mb-0">
                                <input
                                    type="text"
                                    className={clsx('form-control', styles.formControlCustom)}
                                    placeholder="Mô tả triệu chứng AI sẽ phân tích và giúp bạn tìm kiếm bác sĩ, chuyên khoa hoặc dịch vụ phù hợp ..."
                                />
                            </div>
                        </div>
                    </div> */}
                    {/* Second Row: Doctor, Specialty, Clinic, Location, Date, and Button */}
                    <div className={clsx('search-row second-row', styles.secondRow)}>
                        <div className={clsx('search-input search-map-line', styles.inputItem)}>
                            <i className="isax isax-profile-2user5"></i>
                            <div className="mb-0">
                                <input
                                    type="text"
                                    className={clsx('form-control', styles.formControlCustom)}
                                    placeholder="Nhập tên bác sĩ, chuyên gia"
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
                                                mockClinics.find((clinic) => clinic.id === id)?.name
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
                                                mockSpecialties.find((spec) => spec.id === id)?.name
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
                        {showSupportButton && (
                            <div className="form-support-btn">
                                <button
                                    className={clsx(
                                        'd-inline-flex align-items-center rounded-pill',
                                        styles.btnNoWrap,
                                        styles.supportBtn
                                    )}
                                    type="button"
                                >
                                    <i className="isax isax-call-calling5 me-2"></i>Hỗ trợ đặt lịch
                                </button>
                            </div>
                        )}
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
                    items={mockSpecialties
                        .filter((spec) => spec.status === 'ACTIVE')
                        .map((spec) => ({
                            id: spec.id,
                            name: spec.name,
                            icon: spec.icon,
                            color: spec.color,
                        }))}
                    title="Tìm theo chuyên khoa"
                />
                <Modal
                    isOpen={showClinicModal}
                    onClose={handleClinicModalClose}
                    onApply={handleClinicApply}
                    items={mockClinics
                        .filter((clinic) => clinic.status === 'ACTIVE')
                        .map((clinic) => ({
                            id: clinic.id,
                            name: clinic.name,
                            imageUrl: clinic.avatar_url,
                        }))}
                    title="Tìm theo cơ sở y tế"
                />
                <ModalArea
                    isOpen={showAreaModal}
                    onClose={handleAreaModalClose}
                    onApply={handleAreaApply}
                />
            </div>
        </div>
    );
};

export default SearchInput;
