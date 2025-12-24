import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import SpecialityCard from './components/SpecialityCard';
import { LoadingState, ErrorState, SearchInput } from '@/components/PageStates';
import styles from './SpecialtiesList.module.scss';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getSpecialtiesAsync } from '@/store/slices/specialtySlice';
import {
    selectSpecialties,
    selectSpecialtyLoading,
    selectSpecialtyError,
} from '@/store/selectors/specialty.selectors';

import speciality01 from '@/assets/img/specialities/speciality-01.svg';
import speciality02 from '@/assets/img/specialities/speciality-02.svg';
import speciality03 from '@/assets/img/specialities/speciality-03.svg';

const SpecialtiesList: React.FC = () => {
    const { t } = useTranslation('specialty');

    // Redux state management
    const dispatch = useAppDispatch();
    const specialties = useAppSelector(selectSpecialties);
    const isLoading = useAppSelector(selectSpecialtyLoading);
    const error = useAppSelector(selectSpecialtyError);

    // Fallback images for specialties without imageUrl
    const fallbackImages = [speciality01, speciality02, speciality03];

    // Fetch specialties on component mount
    useEffect(() => {
        dispatch(getSpecialtiesAsync());
    }, [dispatch]);

    // Transform API data to match component expectations
    const transformedSpecialties = specialties.map((specialty, index) => ({
        id: specialty.id,
        name: specialty.name,
        image_url: specialty.imageUrl || fallbackImages[index % fallbackImages.length],
        status: 'ACTIVE',
        created_at: '2025-01-01T00:00:00',
        updated_at: '2025-01-01T00:00:00',
        doctorCount: specialty.doctorCount,
    }));

    // State for search
    const [search, setSearch] = useState('');

    // Filter data
    const filteredData = transformedSpecialties.filter((item) => {
        const isSearchMatch =
            search === '' || item.name.toLowerCase().includes(search.toLowerCase());
        return item.status === 'ACTIVE' && isSearchMatch;
    });

    // Breadcrumb data
    const breadcrumbData = {
        items: [
            { label: t('breadcrumb.home'), path: '/', isActive: false },
            { label: t('breadcrumb.specialties'), isActive: true },
        ],
        title: t('list.title'),
    };

    // Loading state
    if (isLoading) {
        return (
            <LoadingState
                message={t('list.loading')}
                breadcrumbItems={breadcrumbData.items}
                breadcrumbTitle={breadcrumbData.title}
            />
        );
    }

    // Error state
    if (error) {
        return (
            <ErrorState
                title={t('list.error.title')}
                message={t('list.error.message')}
                actionText={t('list.error.retry')}
                onAction={() => dispatch(getSpecialtiesAsync())}
                breadcrumbItems={breadcrumbData.items}
                breadcrumbTitle={breadcrumbData.title}
            />
        );
    }

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
            <div className={clsx('content', 'speciality-content')}>
                <div className={clsx('container')}>
                    {/* Show Result */}
                    <div className={clsx('card')}>
                        <div className={clsx('card-body')}>
                            <div
                                className={clsx(
                                    'd-flex',
                                    'align-items-center',
                                    'justify-content-between',
                                    'result-wrap'
                                )}
                            >
                                <h5 className={clsx(styles.customh5)}>
                                    {t('list.showing')}{' '}
                                    <span className={clsx(styles.resultCount)}>
                                        {filteredData.length}
                                    </span>{' '}
                                    {t('list.specialties')}
                                </h5>
                                <SearchInput
                                    value={search}
                                    onChange={setSearch}
                                    placeholder={t('list.searchPlaceholder')}
                                />
                            </div>
                        </div>
                    </div>
                    {/* /Show Result */}
                    <div className={clsx('all-specialities')}>
                        <div className={clsx('row')}>
                            {filteredData.map((speciality) => (
                                <SpecialityCard
                                    key={speciality.id}
                                    id={speciality.id}
                                    name={speciality.name}
                                    doctorCount={speciality.doctorCount}
                                    image_url={speciality.image_url}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default SpecialtiesList;
