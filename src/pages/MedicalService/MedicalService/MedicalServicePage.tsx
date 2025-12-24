import React, { useEffect } from 'react';
import clsx from 'clsx';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import ServiceCard from './components/ServiceCard';
import ErrorAlert from '@/components/common/ErrorAlert';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { getParentServiceCategoriesAsync } from '@/store/slices/medicalServiceSlice';
import { replacePathParams, PATHS } from '@/routes/paths';

// 🔹 Constants
const medicalServices = {
    title: 'Dịch Vụ Y Tế',
};

// 🔹 Breadcrumb config
const breadcrumbData = {
    items: [
        { label: 'Trang chủ', path: '/', isActive: false },
        { label: medicalServices.title, isActive: true },
    ],
    title: 'Danh Sách ' + medicalServices.title,
};

const MedicalServicePage: React.FC = () => {
    const dispatch = useAppDispatch();

    // Get data from Redux store
    const { parentServiceCategories, isLoading, error } = useAppSelector(
        (state) => state.medicalService.serviceCategories
    );

    // Fetch parent service categories if not already loaded
    useEffect(() => {
        if (parentServiceCategories.length === 0 && !isLoading) {
            dispatch(getParentServiceCategoriesAsync());
        }
    }, [dispatch, parentServiceCategories.length, isLoading]);

    // Handle error
    useEffect(() => {
        if (error) {
            console.error('Error fetching service categories:', error);
            // You can add toast notification here if needed
        }
    }, [error]);

    const renderContent = () => {
        if (isLoading) {
            return <LoadingSpinner />;
        }

        if (error) {
            return (
                <ErrorAlert
                    message="Không thể tải danh sách dịch vụ y tế. Vui lòng thử lại sau."
                    onRetry={() => {
                        dispatch(getParentServiceCategoriesAsync());
                    }}
                />
            );
        }

        return (
            <div className="row">
                {parentServiceCategories?.map((service) => (
                    <ServiceCard
                        key={service.id}
                        id={service.id}
                        name={service.name}
                        image={service.imageUrl}
                        servicecategories={service.children?.length || 0}
                        link={replacePathParams(PATHS.Service.CATEGORIES, {
                            servicesparentId: service.id,
                        })}
                    />
                ))}
            </div>
        );
    };

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />

            <div className={clsx('content')}>
                <div className={clsx('container')}>{renderContent()}</div>
            </div>
        </MainLayout>
    );
};

export default MedicalServicePage;
