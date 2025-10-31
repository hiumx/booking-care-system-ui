import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { getParentServiceCategoriesAsync } from '@/store/slices/medicalServiceSlice';
import { getSpecialtiesAsync } from '@/store/slices/specialtySlice';
import { getOptimizedHospitalListAsync } from '@/store/slices/hospitalSlice';
import { searchDoctorsAsync } from '@/store/slices/doctorSlice';
import { HospitalListOptimizedFilterRequest } from '@/types/hospital.types';
import { DoctorSearchParams } from '@/types/doctor.types';
import { selectSpecialties, selectSpecialtyLoading } from '@/store/selectors/specialty.selectors';

export const useHomeData = () => {
    const dispatch = useAppDispatch();
    const hasFetched = useRef(false);
    const hasFetchedSpecialties = useRef(false);
    const hasFetchedHospitals = useRef(false);
    const hasFetchedDoctors = useRef(false);

    // Get service categories from Redux store
    const { parentServiceCategories, isLoading } = useAppSelector(
        (state) => state.medicalService.serviceCategories
    );

    // Get specialties from Redux store
    const specialties = useAppSelector(selectSpecialties);
    const isSpecialtiesLoading = useAppSelector(selectSpecialtyLoading);

    // Get hospitals from Redux store
    const { optimizedHospitals, isLoading: isHospitalsLoading } = useAppSelector(
        (state) => state.hospital
    );

    // Get doctors from Redux store
    const { doctors, isLoading: isDoctorsLoading } = useAppSelector((state) => state.doctor);

    // Fetch parent service categories if not already loaded
    useEffect(() => {
        if (!hasFetched.current && parentServiceCategories.length === 0) {
            hasFetched.current = true;
            dispatch(getParentServiceCategoriesAsync());
        }
    }, [dispatch, parentServiceCategories.length]);

    // Fetch specialties if not already loaded
    useEffect(() => {
        if (!hasFetchedSpecialties.current && specialties.length === 0) {
            hasFetchedSpecialties.current = true;
            dispatch(getSpecialtiesAsync());
        }
    }, [dispatch, specialties.length]);

    // Fetch hospitals if not already loaded
    useEffect(() => {
        if (!hasFetchedHospitals.current && optimizedHospitals.length === 0) {
            hasFetchedHospitals.current = true;
            const filter: HospitalListOptimizedFilterRequest = {
                page: 1,
                pageSize: 20,
                sortBy: 'Name',
                sortOrder: 'asc',
            };
            dispatch(getOptimizedHospitalListAsync(filter));
        }
    }, [dispatch, optimizedHospitals.length]);

    // Fetch doctors if not already loaded
    useEffect(() => {
        if (!hasFetchedDoctors.current && doctors.length === 0) {
            hasFetchedDoctors.current = true;
            const params: DoctorSearchParams = {
                pageNumber: 1,
                pageSize: 20,
                sortBy: 'rating',
                sortOrder: 'desc',
            };
            dispatch(searchDoctorsAsync(params));
        }
    }, [dispatch, doctors.length]);

    return {
        parentServiceCategories,
        isLoading,
        specialties,
        isSpecialtiesLoading,
        optimizedHospitals,
        isHospitalsLoading,
        doctors,
        isDoctorsLoading,
        dispatch,
    };
};
