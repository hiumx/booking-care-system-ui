import React, { useEffect, useState, useRef } from 'react';
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
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { getParentServiceCategoriesAsync } from '@/store/slices/medicalServiceSlice';
import { MedicalServiceCategoriesService } from '@/services/medicalServiceCategories.service';
import { ServiceCategoryResponse } from '@/types/medicalService.types';

// 🔹 Constants
const serviceCategories = {
    title: 'Khám Chuyên Khoa',
};

// 🔹 Breadcrumb config sẽ được tạo trong component

const ServiceCategoriesPage: React.FC = () => {
    const { servicesparentId } = useParams<{ servicesparentId: string }>();
    const dispatch = useAppDispatch();

    // Get data from Redux store
    const { parentServiceCategories, isLoading, error } = useAppSelector(
        (state) => state.medicalService.serviceCategories
    );

    // Local state for children data from API (if Redux doesn't have it)
    const [childrenFromApi, setChildrenFromApi] = useState<ServiceCategoryResponse[]>([]);
    const [isLoadingChildren, setIsLoadingChildren] = useState(false);
    const [childrenError, setChildrenError] = useState<string | null>(null);
    const hasFetchedChildren = useRef<string | null>(null);

    // Fetch parent service categories if not already loaded
    useEffect(() => {
        if (parentServiceCategories.length === 0 && !isLoading) {
            dispatch(getParentServiceCategoriesAsync());
        }
    }, [dispatch, parentServiceCategories.length, isLoading]);

    // Find the selected parent category
    const selectedParentCategory = parentServiceCategories.find(
        (category) => category.id === servicesparentId
    );

    // Get children from Redux if available, otherwise use API data
    const childrenFromRedux = selectedParentCategory?.children || [];
    const childCategories = childrenFromRedux.length > 0 ? childrenFromRedux : childrenFromApi;

    // Reset children data when parentId changes
    useEffect(() => {
        if (servicesparentId && hasFetchedChildren.current !== servicesparentId) {
            setChildrenFromApi([]);
            setChildrenError(null);
        }
    }, [servicesparentId]);

    // Fetch children from API if Redux doesn't have children data
    useEffect(() => {
        if (
            servicesparentId &&
            selectedParentCategory &&
            childrenFromRedux.length === 0 &&
            !isLoading &&
            !isLoadingChildren &&
            hasFetchedChildren.current !== servicesparentId
        ) {
            hasFetchedChildren.current = servicesparentId;
            setIsLoadingChildren(true);
            setChildrenError(null);
            MedicalServiceCategoriesService.getServiceCategoryChildren(servicesparentId)
                .then((response) => {
                    setChildrenFromApi(response.data || []);
                    setIsLoadingChildren(false);
                })
                .catch((error) => {
                    setChildrenError(error.message || 'Failed to fetch children categories');
                    setIsLoadingChildren(false);
                    hasFetchedChildren.current = null; // Allow retry
                });
        }
    }, [
        servicesparentId,
        selectedParentCategory,
        childrenFromRedux.length,
        isLoading,
        isLoadingChildren,
    ]);

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
        // Show loading if fetching parent categories
        if (isLoading) {
            return <LoadingSpinner />;
        }

        // Show error if fetching parent categories failed
        if (error) {
            return (
                <ErrorAlert
                    message="Không thể tải danh sách chuyên khoa. Vui lòng thử lại sau."
                    onRetry={() => {
                        dispatch(getParentServiceCategoriesAsync());
                    }}
                />
            );
        }

        // Show loading if fetching children from API
        if (isLoadingChildren) {
            return <LoadingSpinner />;
        }

        // Show error if fetching children from API failed
        if (childrenError) {
            return (
                <ErrorAlert
                    message="Không thể tải danh sách dịch vụ con. Vui lòng thử lại sau."
                    onRetry={() => {
                        if (servicesparentId) {
                            hasFetchedChildren.current = null; // Reset to allow retry
                            setIsLoadingChildren(true);
                            setChildrenError(null);
                            MedicalServiceCategoriesService.getServiceCategoryChildren(
                                servicesparentId
                            )
                                .then((response) => {
                                    setChildrenFromApi(response.data || []);
                                    setIsLoadingChildren(false);
                                    hasFetchedChildren.current = servicesparentId;
                                })
                                .catch((error) => {
                                    setChildrenError(
                                        error.message || 'Failed to fetch children categories'
                                    );
                                    setIsLoadingChildren(false);
                                });
                        }
                    }}
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
