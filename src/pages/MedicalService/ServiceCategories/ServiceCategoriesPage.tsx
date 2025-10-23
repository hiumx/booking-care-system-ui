import React, { useEffect } from 'react';
import clsx from 'clsx';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import ServiceCategoryCard from './components/ServiceCategoryCard';
import ErrorAlert from '@/components/common/ErrorAlert';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import InfoAlert from '@/components/common/InfoAlert';
import styles from './ServiceCategoriesPage.module.scss';
import { replacePathParams, PATHS } from '@/routes/paths';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

// 🔹 Constants
const serviceCategories = {
    title: 'Khám Chuyên Khoa',
};

// 🔹 Breadcrumb config sẽ được tạo trong component

const ServiceCategoriesPage: React.FC = () => {
    const { servicesparentId } = useParams<{ servicesparentId: string }>();

    // Get data from Redux store
    const { parentServiceCategories, isLoading, error } = useAppSelector(
        (state) => state.medicalService.serviceCategories
    );

    // Find the selected parent category and its children
    const selectedParentCategory = parentServiceCategories.find(
        (category) => category.id === servicesparentId
    );
    const childCategories = selectedParentCategory?.children || [];

    // Create breadcrumb config with dynamic title
    const breadcrumbData = {
        items: [
            { label: 'Trang chủ', path: '/', isActive: false },
            {
                label: 'Dịch Vụ Y Tế',
                path: PATHS.Service.ROOT,
                isActive: false,
            },
            {
                label: selectedParentCategory?.name || serviceCategories.title,
                isActive: true,
            },
        ],
        title: `Các Dịch Vụ Trong ${selectedParentCategory?.name || serviceCategories.title}`,
    };

    // Handle error
    useEffect(() => {
        if (error) {
            console.error('Error fetching service categories:', error);
        }
    }, [error]);

    const renderContent = () => {
        if (isLoading) {
            return <LoadingSpinner />;
        }

        if (error) {
            return (
                <ErrorAlert
                    message="Không thể tải danh sách chuyên khoa. Vui lòng thử lại sau."
                    onRetry={() => globalThis.location.reload()}
                />
            );
        }

        if (!selectedParentCategory) {
            return (
                <InfoAlert
                    type="warning"
                    title="Không tìm thấy!"
                    message="Không tìm thấy chuyên khoa được yêu cầu."
                />
            );
        }

        if (childCategories.length === 0) {
            return (
                <InfoAlert
                    type="info"
                    title="Thông báo!"
                    message="Chuyên khoa này chưa có dịch vụ con."
                />
            );
        }

        return (
            <div className={styles.grid}>
                {childCategories.map((service) => (
                    <ServiceCategoryCard
                        key={service.id}
                        name={service.name}
                        image={service.imageUrl}
                        link={replacePathParams(PATHS.Service.SERVICES, {
                            servicesparentId: servicesparentId!,
                            serviceschildId: service.id.toString(),
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

export default ServiceCategoriesPage;
