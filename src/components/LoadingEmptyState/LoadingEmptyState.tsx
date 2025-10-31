import React from 'react';
import { useAppDispatch } from '@/store/hooks';
import { getSpecialtiesAsync } from '@/store/slices/specialtySlice';
import { getOptimizedHospitalListAsync } from '@/store/slices/hospitalSlice';
import { searchDoctorsAsync } from '@/store/slices/doctorSlice';
import { getParentServiceCategoriesAsync } from '@/store/slices/medicalServiceSlice';
import { HospitalListOptimizedFilterRequest } from '@/types/hospital.types';
import { DoctorSearchParams } from '@/types/doctor.types';

interface LoadingEmptyStateProps {
    isLoading: boolean;
    title: string;
    message: string;
    onRetry: () => void;
}

export const LoadingEmptyState: React.FC<LoadingEmptyStateProps> = ({
    isLoading,
    title,
    message,
    onRetry,
}) => {
    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: '200px' }}
        >
            {isLoading ? (
                <div className="spinner-border text-primary">
                    <span className="visually-hidden">Loading...</span>
                </div>
            ) : (
                <div className="container">
                    <div className="text-center py-5">
                        <h4 className="fw-semibold mb-2">{title}</h4>
                        <p className="text-muted mb-4">{message}</p>
                        <button className="btn btn-outline-primary px-4" onClick={onRetry}>
                            Thử lại
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Specialized components for each section
export const SpecialtiesEmptyState: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
    const dispatch = useAppDispatch();

    return (
        <LoadingEmptyState
            isLoading={isLoading}
            title="Chưa có chuyên khoa"
            message="Hiện chưa có chuyên khoa nào được cung cấp."
            onRetry={() => dispatch(getSpecialtiesAsync())}
        />
    );
};

export const HospitalsEmptyState: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
    const dispatch = useAppDispatch();

    const handleRetry = () => {
        const filter: HospitalListOptimizedFilterRequest = {
            page: 1,
            pageSize: 20,
            sortBy: 'Name',
            sortOrder: 'asc',
        };
        dispatch(getOptimizedHospitalListAsync(filter));
    };

    return (
        <LoadingEmptyState
            isLoading={isLoading}
            title="Chưa có bệnh viện nào!"
            message="Hiện chưa có bệnh viện nào được cung cấp."
            onRetry={handleRetry}
        />
    );
};

export const DoctorsEmptyState: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
    const dispatch = useAppDispatch();

    const handleRetry = () => {
        const params: DoctorSearchParams = {
            pageNumber: 1,
            pageSize: 20,
            sortBy: 'rating',
            sortOrder: 'desc',
        };
        dispatch(searchDoctorsAsync(params));
    };

    return (
        <LoadingEmptyState
            isLoading={isLoading}
            title="Chưa có bác sĩ nào!"
            message="Hiện chưa có bác sĩ nào được cung cấp."
            onRetry={handleRetry}
        />
    );
};

export const ServicesEmptyState: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
    const dispatch = useAppDispatch();

    return (
        <LoadingEmptyState
            isLoading={isLoading}
            title="Chưa có dịch vụ nào!"
            message="Chưa có dịch vụ nào được cung cấp."
            onRetry={() => dispatch(getParentServiceCategoriesAsync())}
        />
    );
};
