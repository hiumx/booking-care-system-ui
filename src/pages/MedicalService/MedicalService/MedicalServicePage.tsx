import React, { useEffect } from 'react';
import clsx from 'clsx';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import ServiceCard from './components/ServiceCard';
import ErrorAlert from '@/components/common/ErrorAlert';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useApiCall } from '@/hooks/useApiCall';
import { replacePathParams, PATHS } from '@/routes/paths';
import { MedicalServiceCategoriesService } from '@/services/medicalServiceCategories.service';

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
    const {
        data: parentServiceCategories,
        isLoading,
        error,
        execute,
        clearError,
    } = useApiCall(
        async () => {
            const response = await MedicalServiceCategoriesService.getParentServiceCategories();
            return response.data;
        },
        { immediate: true }
    );

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
                        clearError();
                        execute();
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
