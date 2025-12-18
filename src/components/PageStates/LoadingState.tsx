import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';

interface BreadcrumbItem {
    label: string;
    path?: string;
    isActive?: boolean;
}

interface LoadingStateProps {
    message: string;
    breadcrumbItems?: BreadcrumbItem[];
    breadcrumbTitle?: string;
    showBreadcrumb?: boolean;
}

/**
 * Shared loading state component for list pages
 * Reduces code duplication across SpecialtiesList, DoctorProfile, etc.
 */
const LoadingState: React.FC<LoadingStateProps> = ({
    message,
    breadcrumbItems,
    breadcrumbTitle,
    showBreadcrumb = true,
}) => {
    return (
        <MainLayout>
            {showBreadcrumb && breadcrumbItems && breadcrumbTitle && (
                <Breadcrumb items={breadcrumbItems} title={breadcrumbTitle} />
            )}
            <div className="content">
                <div className="container">
                    <div className="text-center py-5">
                        <div className="spinner-border">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">{message}</p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default LoadingState;
