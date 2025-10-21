import React, { useEffect } from 'react';
import clsx from 'clsx';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import ServiceCategoryCard from './components/ServiceCategoryCard';
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
            return (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: '200px' }}
                >
                    <div className="spinner-border text-primary">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Lỗi!</h4>
                    <p>Không thể tải danh sách chuyên khoa. Vui lòng thử lại sau.</p>
                    <hr />
                    <button
                        className="btn btn-outline-danger"
                        onClick={() => globalThis.location.reload()}
                    >
                        Thử lại
                    </button>
                </div>
            );
        }

        if (!selectedParentCategory) {
            return (
                <div className="alert alert-warning" role="alert">
                    <h4 className="alert-heading">Không tìm thấy!</h4>
                    <p>Không tìm thấy chuyên khoa được yêu cầu.</p>
                </div>
            );
        }

        if (childCategories.length === 0) {
            return (
                <div className="alert alert-info" role="alert">
                    <h4 className="alert-heading">Thông báo!</h4>
                    <p>Chuyên khoa này chưa có dịch vụ con.</p>
                </div>
            );
        }

        return (
            <div className={styles.grid}>
                {childCategories.map((service) => (
                    <ServiceCategoryCard
                        key={service.id}
                        name={service.name}
                        image={service.imageUrl}
                        link={replacePathParams(PATHS.Service.HOSPITALS, {
                            servicesparentId: servicesparentId!,
                            serviceschildId: service.id,
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
