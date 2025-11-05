import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getServiceTypesAsync } from '@/store/slices/serviceTypeSlice';
import { RootState } from '@/store';

/**
 * Hook để quản lý service types từ Doctor Service API
 */
export const useServiceType = () => {
    const dispatch = useAppDispatch();

    // Lấy dữ liệu từ Redux store
    const { serviceTypes, isLoading, error } = useAppSelector(
        (state: RootState) => state.serviceType
    );

    // Fetch service types khi component mount
    useEffect(() => {
        if (serviceTypes.length === 0 && !isLoading) {
            dispatch(getServiceTypesAsync());
        }
    }, [dispatch, serviceTypes.length, isLoading]);

    return {
        serviceTypes,
        isLoading,
        error,
        refetch: () => dispatch(getServiceTypesAsync()),
    };
};
