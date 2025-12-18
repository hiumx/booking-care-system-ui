import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import SpecialityCard from './components/SpecialityCard';
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
            <MainLayout>
                <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
                <div className={clsx('content', 'speciality-content')}>
                    <div className={clsx('container')}>
                        <div className={clsx('card')}>
                            <div className={clsx('card-body', 'text-center')}>
                                <div className="spinner-border">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <output className="mt-3">{t('list.loading')}</output>
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    // Error state
    if (error) {
        return (
            <MainLayout>
                <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
                <div className="content">
                    <div className="container">
                        <div className="text-center py-5">
                            <h4 className="fw-semibold mb-2">{t('list.error.title')}</h4>
                            <p className="text-muted mb-4">{t('list.error.message')}</p>
                            <button
                                className="btn btn-outline-primary px-4"
                                onClick={() => dispatch(getSpecialtiesAsync())}
                            >
                                {t('list.error.retry')}
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
                                <div className={clsx('input-block', 'dash-search-input')}>
                                    <input
                                        type="text"
                                        className={clsx('form-control')}
                                        placeholder={t('list.searchPlaceholder')}
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
