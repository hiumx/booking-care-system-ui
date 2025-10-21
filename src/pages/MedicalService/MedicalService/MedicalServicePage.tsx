import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import ServiceCard from './components/ServiceCard';
import { replacePathParams, PATHS } from '@/routes/paths';
import { MedicalServiceCategoriesService } from '@/services/medicalServiceCategories.service';
import { ServiceCategoryParentsResponse } from '@/types/medicalService.types';

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
    const [parentServiceCategories, setParentServiceCategories] = useState<
        ServiceCategoryParentsResponse[]
    >([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const hasFetched = useRef(false);

    // Fetch data on component mount (only once)
    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchParentServiceCategories();
        }
    }, []);

    const fetchParentServiceCategories = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await MedicalServiceCategoriesService.getParentServiceCategories();
            setParentServiceCategories(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch parent service categories');
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    // Handle error
    useEffect(() => {
        if (error) {
            console.error('Error fetching service categories:', error);
            // You can add toast notification here if needed
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
                    <p>Không thể tải danh sách dịch vụ y tế. Vui lòng thử lại sau.</p>
                    <hr />
                    <button
                        className="btn btn-outline-danger"
                        onClick={() => {
                            clearError();
                            fetchParentServiceCategories();
                        }}
                    >
                        Thử lại
                    </button>
                </div>
            );
        }

        return (
            <div className="row">
                {parentServiceCategories.map((service) => (
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
