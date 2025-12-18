import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';

interface BreadcrumbItem {
    label: string;
    path?: string;
    isActive?: boolean;
}

interface ErrorStateProps {
    title: string;
    message: string;
    actionText: string;
    actionLink?: string;
    onAction?: () => void;
    breadcrumbItems?: BreadcrumbItem[];
    breadcrumbTitle?: string;
}

/**
 * Shared error state component for list pages
 * Reduces code duplication across SpecialtiesList, DoctorProfile, HospitalList
 */
const ErrorState: React.FC<ErrorStateProps> = ({
    title,
    message,
    actionText,
    actionLink,
    onAction,
    breadcrumbItems,
    breadcrumbTitle,
}) => {
    return (
        <MainLayout>
            {breadcrumbItems && breadcrumbTitle && (
                <Breadcrumb items={breadcrumbItems} title={breadcrumbTitle} />
            )}
            <div className="content">
                <div className="container">
                    <div className="text-center py-5">
                        <h4 className="fw-semibold mb-2">{title}</h4>
                        <p className="text-muted mb-4">{message}</p>
                        {actionLink ? (
                            <Link to={actionLink} className="btn btn-outline-primary px-4">
                                {actionText}
                            </Link>
                        ) : (
                            <button className="btn btn-outline-primary px-4" onClick={onAction}>
                                {actionText}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ErrorState;
