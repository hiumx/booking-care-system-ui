import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { Skeleton } from '@mui/material';
import {
    setSelectedSpecialtyId,
    setSelectedServiceMedicalId,
    setSelectedDoctorId,
} from '@/store/slices/bookingSlice';
import { clearSelectedDoctor } from '@/store/slices/doctorSlice';
import { resetScheduleState } from '@/store/slices/schedule.slice';
import BookingSectionWrapper from '../../components/BookingSectionWrapper';
import {
    type BookingEntityInfo,
    type AppointmentInfo,
} from '../../components/BookingHeader/BookingHeader';
import { HospitalProfileResponse } from '@/types/hospital.types';
import clsx from 'clsx';
import styles from './SpecialtyServiceSection.module.scss';

// Constants
const INITIAL_DISPLAY_COUNT = 6;
const SEARCH_THRESHOLD = 6; // Show search when items > this number

interface SpecialtyServiceSectionProps {
    nextStep: () => void;
    prevStep: () => void;
    hospitalData: HospitalProfileResponse | null;
    isLoading: boolean;
}

type SelectionType = 'specialty' | 'service' | null;

const SpecialtyServiceSection: React.FC<SpecialtyServiceSectionProps> = ({
    nextStep,
    prevStep,
    hospitalData,
    isLoading,
}) => {
    const { t, i18n } = useTranslation('booking');
    const dispatch = useAppDispatch();
    const bookingState = useAppSelector((state) => state.booking);
    const scheduleState = useAppSelector((state) => state.schedule);

    // Format currency helper with locale support
    const formatCurrency = (amount: number) => {
        const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    // Helper to clear schedule data only if it has data (avoid unnecessary dispatches)
    const clearScheduleIfNeeded = () => {
        const hasScheduleData =
            scheduleState.selectedDate ||
            scheduleState.selectedSlots.length > 0 ||
            scheduleState.scheduleCategories.length > 0;
        if (hasScheduleData) {
            dispatch(resetScheduleState());
        }
    };

    const [selectionType, setSelectionType] = useState<SelectionType>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Search and display states
    const [specialtySearch, setSpecialtySearch] = useState('');
    const [serviceSearch, setServiceSearch] = useState('');
    const [showAllSpecialties, setShowAllSpecialties] = useState(false);
    const [showAllServices, setShowAllServices] = useState(false);

    // Initialize from Redux state
    useEffect(() => {
        if (bookingState.selectedSpecialtyId) {
            setSelectionType('specialty');
            setSelectedId(bookingState.selectedSpecialtyId);
        } else if (bookingState.selectedServiceMedicalId) {
            setSelectionType('service');
            setSelectedId(bookingState.selectedServiceMedicalId);
        }
    }, [bookingState.selectedSpecialtyId, bookingState.selectedServiceMedicalId]);

    // Filter specialties based on search
    const filteredSpecialties = useMemo(() => {
        if (!hospitalData?.specialties) return [];
        if (!specialtySearch.trim()) return hospitalData.specialties;
        const searchLower = specialtySearch.toLowerCase().trim();
        return hospitalData.specialties.filter((s) => s.name.toLowerCase().includes(searchLower));
    }, [hospitalData?.specialties, specialtySearch]);

    // Filter services based on search
    const filteredServices = useMemo(() => {
        if (!hospitalData?.serviceMedicals) return [];
        if (!serviceSearch.trim()) return hospitalData.serviceMedicals;
        const searchLower = serviceSearch.toLowerCase().trim();
        return hospitalData.serviceMedicals.filter((s) =>
            s.name.toLowerCase().includes(searchLower)
        );
    }, [hospitalData?.serviceMedicals, serviceSearch]);

    // Get displayed items (with show more logic)
    const displayedSpecialties = useMemo(() => {
        if (showAllSpecialties || specialtySearch.trim()) return filteredSpecialties;
        return filteredSpecialties.slice(0, INITIAL_DISPLAY_COUNT);
    }, [filteredSpecialties, showAllSpecialties, specialtySearch]);

    const displayedServices = useMemo(() => {
        if (showAllServices || serviceSearch.trim()) return filteredServices;
        return filteredServices.slice(0, INITIAL_DISPLAY_COUNT);
    }, [filteredServices, showAllServices, serviceSearch]);

    // Check if should show search
    const showSpecialtySearch = (hospitalData?.specialties?.length || 0) > SEARCH_THRESHOLD;
    const showServiceSearch = (hospitalData?.serviceMedicals?.length || 0) > SEARCH_THRESHOLD;

    // Check if should show "show more" button
    const hasMoreSpecialties =
        filteredSpecialties.length > INITIAL_DISPLAY_COUNT && !specialtySearch.trim();
    const hasMoreServices =
        filteredServices.length > INITIAL_DISPLAY_COUNT && !serviceSearch.trim();

    const handleSpecialtySelect = (specialtyId: string) => {
        if (selectionType === 'specialty' && selectedId === specialtyId) {
            // Deselect
            setSelectionType(null);
            setSelectedId(null);
            dispatch(setSelectedSpecialtyId(null));
        } else {
            // Check if switching from a different selection - clear schedule data
            if (selectedId && selectedId !== specialtyId) {
                clearScheduleIfNeeded();
            }
            setSelectionType('specialty');
            setSelectedId(specialtyId);
            dispatch(setSelectedSpecialtyId(specialtyId));
        }
    };

    const handleServiceSelect = (serviceId: string) => {
        if (selectionType === 'service' && selectedId === serviceId) {
            // Deselect
            setSelectionType(null);
            setSelectedId(null);
            dispatch(setSelectedServiceMedicalId(null));
        } else {
            // Check if switching from a different selection - clear schedule data
            if (selectedId && selectedId !== serviceId) {
                clearScheduleIfNeeded();
            }
            setSelectionType('service');
            setSelectedId(serviceId);
            dispatch(setSelectedServiceMedicalId(serviceId));
            // Clear any previously selected doctor when switching to service
            // (service booking doesn't require doctor selection)
            dispatch(setSelectedDoctorId(null));
            dispatch(clearSelectedDoctor());
        }
    };

    const canProceed = selectionType !== null && selectedId !== null;

    const handleNext = () => {
        if (canProceed) {
            nextStep();
        }
    };

    // Get selected item name for display
    const getSelectedItemName = (): string => {
        if (!hospitalData || !selectedId) return t('specialtyServiceSection.notSelected');

        if (selectionType === 'specialty') {
            const specialty = hospitalData.specialties?.find((s) => s.id === selectedId);
            return specialty?.name || t('specialtyServiceSection.notSelected');
        } else if (selectionType === 'service') {
            const service = hospitalData.serviceMedicals?.find((s) => s.id === selectedId);
            return service?.name || t('specialtyServiceSection.notSelected');
        }
        return t('specialtyServiceSection.notSelected');
    };

    // Build header info
    const hospitalInfo: BookingEntityInfo = {
        name: hospitalData?.name || t('specialtyServiceSection.loading'),
        subtitle: hospitalData?.address || '',
        location: hospitalData?.address || '',
        avatar: hospitalData?.avatarUrl || '/assets/img/hospital-placeholder.png',
        bookingType: 'service',
    };

    const getServiceType = () => {
        if (selectionType === 'specialty') return t('specialtyServiceSection.specialty');
        if (selectionType === 'service') return t('specialtyServiceSection.service');
        return t('specialtyServiceSection.notSelected');
    };

    const appointmentInfo: AppointmentInfo = {
        service: getSelectedItemName(),
        serviceType: getServiceType(),
        dateTime: t('specialtyServiceSection.notSelected'),
        appointmentType: t('specialtyServiceSection.notSelected'),
    };

    if (isLoading) {
        return (
            <div className="card booking-card mb-0">
                <div className="card-body">
                    {/* Header Skeleton */}
                    <div className="mb-4">
                        <Skeleton variant="text" width="40%" height={28} />
                        <Skeleton variant="text" width="60%" height={20} sx={{ mt: 1 }} />
                    </div>

                    {/* Specialty Section Skeleton */}
                    <div className="mb-4">
                        <Skeleton variant="text" width="30%" height={24} sx={{ mb: 2 }} />
                        <div className="row">
                            {[1, 2, 3, 4, 5, 6].map((index) => (
                                <div key={index} className="col-md-4 mb-3">
                                    <div className="card h-100">
                                        <div className="card-body p-3">
                                            <div className="d-flex align-items-center">
                                                <Skeleton
                                                    variant="circular"
                                                    width={40}
                                                    height={40}
                                                />
                                                <div className="ms-3 flex-grow-1">
                                                    <Skeleton
                                                        variant="text"
                                                        width="80%"
                                                        height={20}
                                                    />
                                                    <Skeleton
                                                        variant="text"
                                                        width="50%"
                                                        height={16}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Service Section Skeleton */}
                    <div>
                        <Skeleton variant="text" width="30%" height={24} sx={{ mb: 2 }} />
                        <div className="row">
                            {[1, 2, 3].map((index) => (
                                <div key={index} className="col-md-4 mb-3">
                                    <div className="card h-100">
                                        <div className="card-body p-3">
                                            <div className="d-flex align-items-center">
                                                <Skeleton
                                                    variant="rectangular"
                                                    width={50}
                                                    height={50}
                                                    sx={{ borderRadius: 1 }}
                                                />
                                                <div className="ms-3 flex-grow-1">
                                                    <Skeleton
                                                        variant="text"
                                                        width="70%"
                                                        height={20}
                                                    />
                                                    <Skeleton
                                                        variant="text"
                                                        width="40%"
                                                        height={16}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Helper function to render specialty empty state - extracted to avoid nested ternary
    const renderSpecialtyEmptyState = () => {
        if (specialtySearch.trim()) {
            return (
                <div className="col-12">
                    <div className={styles.noResults}>
                        <i className="isax isax-search-status" aria-hidden="true"></i>
                        <p className="mb-0">{t('specialtyServiceSection.noSpecialtyFound')}</p>
                    </div>
                </div>
            );
        }
        return (
            <div className="col-12">
                <p className="text-muted mb-0">{t('specialtyServiceSection.noSpecialties')}</p>
            </div>
        );
    };

    // Helper function to render service empty state - extracted to avoid nested ternary
    const renderServiceEmptyState = () => {
        if (serviceSearch.trim()) {
            return (
                <div className="col-12">
                    <div className={styles.noResults}>
                        <i className="isax isax-search-status" aria-hidden="true"></i>
                        <p className="mb-0">{t('specialtyServiceSection.noServiceFound')}</p>
                    </div>
                </div>
            );
        }
        return (
            <div className="col-12">
                <p className="text-muted mb-0">{t('specialtyServiceSection.noServices')}</p>
            </div>
        );
    };

    return (
        <BookingSectionWrapper
            doctor={hospitalInfo}
            appointment={appointmentInfo}
            nextStepTitle={t('specialtyServiceSection.nextStepTitle')}
            nextStep={handleNext}
            prevStep={prevStep}
            fieldsetId="specialty-service"
            isShowInfoHeader={false}
            disabled={!canProceed}
        >
            <div className="card mb-0">
                <div className="card-body pb-1">
                    {/* Specialty Selection */}
                    <div className="mb-4 pb-4 border-bottom">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="mb-0">
                                <i className="isax isax-hospital me-2" aria-hidden="true"></i>{' '}
                                {t('specialtyServiceSection.selectSpecialty')}
                            </h6>
                        </div>

                        {/* Search for specialties */}
                        {showSpecialtySearch && (
                            <div className={styles.searchWrapper}>
                                <i
                                    className={clsx('isax isax-search-normal-1', styles.searchIcon)}
                                ></i>
                                <input
                                    type="text"
                                    className={clsx('form-control', styles.searchInput)}
                                    placeholder={t('specialtyServiceSection.searchSpecialty')}
                                    value={specialtySearch}
                                    onChange={(e) => setSpecialtySearch(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="row">
                            {displayedSpecialties.length > 0
                                ? displayedSpecialties.map((specialty) => (
                                      <div key={specialty.id} className="col-lg-4 col-md-6 mb-3">
                                          <div
                                              role="button"
                                              tabIndex={0}
                                              className={clsx(
                                                  styles.serviceItem,
                                                  'service-item',
                                                  selectionType === 'specialty' &&
                                                      selectedId === specialty.id &&
                                                      'active'
                                              )}
                                              onClick={() => handleSpecialtySelect(specialty.id)}
                                              onKeyDown={(e) => {
                                                  if (e.key === 'Enter' || e.key === ' ') {
                                                      handleSpecialtySelect(specialty.id);
                                                  }
                                              }}
                                          >
                                              <input
                                                  id={`specialty-${specialty.id}`}
                                                  className="form-check-input ms-0 mt-0"
                                                  type="radio"
                                                  name="specialtyService"
                                                  checked={
                                                      selectionType === 'specialty' &&
                                                      selectedId === specialty.id
                                                  }
                                                  onChange={() =>
                                                      handleSpecialtySelect(specialty.id)
                                                  }
                                              />
                                              <label className="form-check-label ms-2 w-100">
                                                  <div className={styles.itemContent}>
                                                      {specialty.imageUrl ? (
                                                          <img
                                                              src={specialty.imageUrl}
                                                              alt={specialty.name}
                                                              className={styles.itemImage}
                                                          />
                                                      ) : (
                                                          <div
                                                              className={
                                                                  styles.itemImagePlaceholder
                                                              }
                                                          >
                                                              <i className="isax isax-hospital"></i>
                                                          </div>
                                                      )}
                                                      <div className={styles.itemInfo}>
                                                          <span className="service-title d-block mb-1">
                                                              {specialty.name}
                                                          </span>
                                                          {specialty.doctorCount !== undefined && (
                                                              <span className="fs-14 text-muted d-block">
                                                                  <i className="isax isax-user me-1"></i>
                                                                  {specialty.doctorCount}{' '}
                                                                  {t(
                                                                      'specialtyServiceSection.doctors'
                                                                  )}
                                                              </span>
                                                          )}
                                                      </div>
                                                  </div>
                                              </label>
                                          </div>
                                      </div>
                                  ))
                                : renderSpecialtyEmptyState()}
                        </div>

                        {/* Show more button for specialties */}
                        {hasMoreSpecialties && (
                            <div className="text-center mt-2">
                                <button
                                    type="button"
                                    className={styles.showMoreBtn}
                                    onClick={() => setShowAllSpecialties(!showAllSpecialties)}
                                >
                                    {showAllSpecialties ? (
                                        <>
                                            {t('specialtyServiceSection.collapse')}{' '}
                                            <i className="isax isax-arrow-up-2"></i>
                                        </>
                                    ) : (
                                        <>
                                            {t('specialtyServiceSection.showMore')} (
                                            {filteredSpecialties.length - INITIAL_DISPLAY_COUNT}){' '}
                                            <i className="isax isax-arrow-down-1"></i>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Service Medical Selection */}
                    <div>
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="mb-0">
                                <i className="isax isax-briefcase me-2" aria-hidden="true"></i>{' '}
                                {t('specialtyServiceSection.selectService')}
                            </h6>
                        </div>

                        {/* Search for services */}
                        {showServiceSearch && (
                            <div className={styles.searchWrapper}>
                                <i
                                    className={clsx('isax isax-search-normal-1', styles.searchIcon)}
                                ></i>
                                <input
                                    type="text"
                                    className={clsx('form-control', styles.searchInput)}
                                    placeholder={t('specialtyServiceSection.searchService')}
                                    value={serviceSearch}
                                    onChange={(e) => setServiceSearch(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="row">
                            {displayedServices.length > 0
                                ? displayedServices.map((service) => (
                                      <div key={service.id} className="col-lg-4 col-md-6 mb-3">
                                          <div
                                              role="button"
                                              tabIndex={0}
                                              className={clsx(
                                                  styles.serviceItem,
                                                  'service-item',
                                                  selectionType === 'service' &&
                                                      selectedId === service.id &&
                                                      'active'
                                              )}
                                              onClick={() => handleServiceSelect(service.id)}
                                              onKeyDown={(e) => {
                                                  if (e.key === 'Enter' || e.key === ' ') {
                                                      handleServiceSelect(service.id);
                                                  }
                                              }}
                                          >
                                              <input
                                                  id={`service-${service.id}`}
                                                  className="form-check-input ms-0 mt-0"
                                                  type="radio"
                                                  name="specialtyService"
                                                  checked={
                                                      selectionType === 'service' &&
                                                      selectedId === service.id
                                                  }
                                                  onChange={() => handleServiceSelect(service.id)}
                                              />
                                              <label className="form-check-label ms-2 w-100">
                                                  <div className={styles.itemContent}>
                                                      {service.imageUrl ? (
                                                          <img
                                                              src={service.imageUrl}
                                                              alt={service.name}
                                                              className={styles.itemImage}
                                                          />
                                                      ) : (
                                                          <div
                                                              className={
                                                                  styles.itemImagePlaceholder
                                                              }
                                                          >
                                                              <i className="isax isax-briefcase"></i>
                                                          </div>
                                                      )}
                                                      <div className={styles.itemInfo}>
                                                          <span className="service-title d-block mb-1">
                                                              {service.name}
                                                          </span>
                                                          <span className="fs-14 text-primary fw-medium d-block">
                                                              {formatCurrency(service.price)}
                                                          </span>
                                                      </div>
                                                  </div>
                                              </label>
                                          </div>
                                      </div>
                                  ))
                                : renderServiceEmptyState()}
                        </div>

                        {/* Show more button for services */}
                        {hasMoreServices && (
                            <div className="text-center mt-2">
                                <button
                                    type="button"
                                    className={styles.showMoreBtn}
                                    onClick={() => setShowAllServices(!showAllServices)}
                                >
                                    {showAllServices ? (
                                        <>
                                            {t('specialtyServiceSection.collapse')}{' '}
                                            <i className="isax isax-arrow-up-2"></i>
                                        </>
                                    ) : (
                                        <>
                                            {t('specialtyServiceSection.showMore')} (
                                            {filteredServices.length - INITIAL_DISPLAY_COUNT}){' '}
                                            <i className="isax isax-arrow-down-1"></i>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Selection hint */}
                    {!canProceed && (
                        <div className="alert alert-info mt-3 mb-0">
                            <i className="isax isax-info-circle me-2" aria-hidden="true"></i>{' '}
                            {t('specialtyServiceSection.selectionHint')}
                        </div>
                    )}
                </div>
            </div>
        </BookingSectionWrapper>
    );
};

export default SpecialtyServiceSection;
