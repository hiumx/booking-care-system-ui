import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import styles from './ServiceSearchInput.module.scss';
import Modal from '@/components/Modal';
import ModalArea from '@/components/ModalArea';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getAllHospitalsAsync } from '@/store/slices/hospitalSlice';

type ServiceSearchInputProps = {
    onSearchChange?: (searchTerm: string) => void;
    onHospitalFilter?: (hospitalId: string) => void;
    onAreaFilter?: (areaInfo: {
        provinceId?: string;
        districtId?: string;
        provinceName?: string;
        districtName?: string;
    }) => void;
};

const ServiceSearchInput: React.FC<ServiceSearchInputProps> = ({
    onSearchChange,
    onHospitalFilter,
    onAreaFilter,
}) => {
    const dispatch = useAppDispatch();
    const { simpleHospitals } = useAppSelector((state) => state.hospital);

    const [showHospitalModal, setShowHospitalModal] = useState(false);
    const [showAreaModal, setShowAreaModal] = useState(false);
    const [selectedHospital, setSelectedHospital] = useState<string>('');
    const [selectedArea, setSelectedArea] = useState<string>('');
    const [serviceName, setServiceName] = useState<string>('');

    // Load hospitals on mount
    useEffect(() => {
        dispatch(getAllHospitalsAsync());
    }, [dispatch]);

    // Handle hospital selection
    const handleHospitalSelect = (hospitalId: string) => {
        const hospital = simpleHospitals.find((h) => h.id === hospitalId);
        if (hospital) {
            setSelectedHospital(hospital.name);
            setShowHospitalModal(false);

            if (onHospitalFilter) {
                onHospitalFilter(hospitalId);
            }
        }
    };

    // Handle area selection
    const handleAreaSelect = (areaDisplay: string, locationId: string, provinceId?: string) => {
        // Parse area info from the display string and locationId
        // If areaDisplay contains ' - ', then locationId is districtId, otherwise it's provinceId
        const hasDistrict = areaDisplay.includes(' - ');
        const areaInfo = {
            provinceId: hasDistrict ? provinceId : locationId,
            districtId: hasDistrict ? locationId : undefined,
            provinceName: hasDistrict ? areaDisplay.split(' - ')[0] : areaDisplay,
            districtName: hasDistrict ? areaDisplay.split(' - ')[1] : undefined,
        };

        setSelectedArea(areaDisplay);
        setShowAreaModal(false);

        if (onAreaFilter) {
            onAreaFilter(areaInfo);
        }
    };

    // Clear filters
    const clearServiceName = () => {
        setServiceName('');
        if (onSearchChange) {
            onSearchChange('');
        }
    };

    const clearHospital = () => {
        setSelectedHospital('');
        if (onHospitalFilter) {
            onHospitalFilter('');
        }
    };

    const clearArea = () => {
        setSelectedArea('');
        if (onAreaFilter) {
            onAreaFilter({});
        }
    };

    // Handle service name change
    const handleServiceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setServiceName(value);
        if (onSearchChange) {
            onSearchChange(value);
        }
    };

    return (
        <div className={clsx('bg-primary-gradient', 'doctors-search-box', styles.searchBoxCustom)}>
            <div className={clsx(styles.searchBoxOne)}>
                <form>
                    <div className={clsx('row', 'g-3', 'align-items-center')}>
                        {/* Service Name Input */}
                        <div className={clsx('col-12', 'col-lg-4')}>
                            <div className={clsx('form-group', 'mb-0', styles.searchInput)}>
                                <label htmlFor="serviceName" className={styles.label}>
                                    <i className={clsx('fa-solid', 'fa-magnifying-glass')} /> Tên
                                    dịch vụ
                                </label>
                                <input
                                    id="serviceName"
                                    type="text"
                                    className={clsx('form-control', styles.input)}
                                    placeholder="VD: Khám tổng quát, nội soi..."
                                    value={serviceName}
                                    onChange={handleServiceNameChange}
                                />
                                {serviceName && (
                                    <button
                                        type="button"
                                        className={styles.clearBtn}
                                        onClick={clearServiceName}
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Hospital Select */}
                        <div className={clsx('col-12', 'col-lg-4')}>
                            <div className={clsx('form-group', 'mb-0', styles.searchInput)}>
                                <label htmlFor="hospital" className={styles.label}>
                                    <i className={clsx('fa-solid', 'fa-hospital')} /> Bệnh viện
                                </label>
                                <button
                                    id="hospital"
                                    type="button"
                                    className={clsx('form-control', styles.selectBtn)}
                                    onClick={() => setShowHospitalModal(true)}
                                >
                                    <span className={selectedHospital ? '' : styles.placeholder}>
                                        {selectedHospital || 'Chọn bệnh viện'}
                                    </span>
                                </button>
                                {selectedHospital && (
                                    <button
                                        type="button"
                                        className={styles.clearBtn}
                                        onClick={clearHospital}
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Area Select */}
                        <div className={clsx('col-12', 'col-lg-4')}>
                            <div className={clsx('form-group', 'mb-0', styles.searchInput)}>
                                <label htmlFor="area" className={styles.label}>
                                    <i className={clsx('fa-solid', 'fa-location-dot')} /> Địa chỉ
                                </label>
                                <button
                                    id="area"
                                    type="button"
                                    className={clsx('form-control', styles.selectBtn)}
                                    onClick={() => setShowAreaModal(true)}
                                >
                                    <span className={selectedArea ? '' : styles.placeholder}>
                                        {selectedArea || 'Chọn khu vực'}
                                    </span>
                                </button>
                                {selectedArea && (
                                    <button
                                        type="button"
                                        className={styles.clearBtn}
                                        onClick={clearArea}
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Hospital Selection Modal */}
            <Modal
                title="Chọn Bệnh Viện"
                isOpen={showHospitalModal}
                onClose={() => setShowHospitalModal(false)}
                onApply={(selectedItems, _searchTerm) => {
                    if (selectedItems.length > 0) {
                        handleHospitalSelect(selectedItems[0]);
                    } else {
                        clearHospital();
                    }
                }}
                items={simpleHospitals.map((hospital) => ({
                    id: hospital.id,
                    name: hospital.name,
                    imageUrl: hospital.avatarUrl || '',
                }))}
                itemType="hospital"
                initialSelectedItems={
                    selectedHospital
                        ? [simpleHospitals.find((h) => h.name === selectedHospital)?.id || '']
                        : []
                }
            />

            {/* Area Selection Modal */}
            <ModalArea
                isOpen={showAreaModal}
                onClose={() => setShowAreaModal(false)}
                onApply={handleAreaSelect}
                selectedProvinceId={undefined}
                selectedDistrictId={undefined}
            />
        </div>
    );
};

export default ServiceSearchInput;
