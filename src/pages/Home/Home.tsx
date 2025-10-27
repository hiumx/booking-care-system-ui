import { buildPath, PATHS, replacePathParams } from '@/routes/paths';
import MainLayout from '../../layouts/MainLayout';
import Banner from './components/Banner';
import HospitalCard from '@/components/HospitalCard';
import SectionItem from './components/SectionItem';
import SpecialtyCarouselItem from './components/SpecialtyCarouselItem';
import DoctorCard from '@/components/DoctorCard';
import ServiceSection from './components/ServicesSection/ServiceSection';
import {
    CAROUSEL_SPECIALTIES_BREAKPOINTS,
    CAROUSEL_HOSPITALS_BREAKPOINTS,
    CAROUSEL_DOCTORS_BREAKPOINTS,
} from './Home.data';
import ListServiceCategories from './components/ListServiceCategories';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { getParentServiceCategoriesAsync } from '@/store/slices/medicalServiceSlice';
import { getSpecialtiesAsync } from '@/store/slices/specialtySlice';
import { getOptimizedHospitalListAsync } from '@/store/slices/hospitalSlice';
import { searchDoctorsAsync } from '@/store/slices/doctorSlice';
import { HospitalListOptimizedFilterRequest } from '@/types/hospital.types';
import { DoctorSearchParams } from '@/types/doctor.types';
import { selectSpecialties, selectSpecialtyLoading } from '@/store/selectors/specialty.selectors';
import { useEffect, useRef } from 'react';

const Home: React.FC = () => {
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

    // Fallback images for specialties (random tuần tự cho imageSrc)
    const specialtyImages = [
        '/src/assets/img/specialities/speciality-01.jpg',
        '/src/assets/img/specialities/speciality-02.jpg',
        '/src/assets/img/specialities/speciality-03.jpg',
        '/src/assets/img/specialities/speciality-04.jpg',
        '/src/assets/img/specialities/speciality-05.jpg',
        '/src/assets/img/specialities/speciality-06.jpg',
        '/src/assets/img/specialities/speciality-07.jpg',
        '/src/assets/img/specialities/speciality-08.jpg',
    ];

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
                pageSize: 20, // Get 20 hospitals for home page
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
                pageSize: 20, // Get 20 doctors for home page
                sortBy: 'rating', // Sort by rating
                sortOrder: 'desc', // Highest rating first
            };
            dispatch(searchDoctorsAsync(params));
        }
    }, [dispatch, doctors.length]);

    // Convert API data to Service format
    const convertToServiceFormat = (categories: any[]) => {
        return categories.map((category) => ({
            id: category.id,
            name: category.name,
            image: category.imageUrl,
        }));
    };

    // Convert API specialties data to Home format
    const convertToSpecialtyFormat = (apiSpecialties: any[]) => {
        return apiSpecialties.map((specialty, index) => ({
            id: specialty.id,
            name: specialty.name,
            image: specialtyImages[index % specialtyImages.length], // Random từ fallback images
            icon: specialty.imageUrl, // Sử dụng imageUrl từ API làm icon
            doctorCount: specialty.doctorCount,
        }));
    };

    // Convert API hospital data to Home format
    const convertToHospitalFormat = (apiHospitals: any[]) => {
        return apiHospitals.map((hospital) => ({
            id: hospital.id,
            name: hospital.name,
            image: hospital.avatarUrl || '/default-hospital.png',
            specialties: hospital.specialties?.map((s: any) => s.name) || [],
            address: hospital.address,
            specialtyCount: hospital.totalSpecialties || hospital.specialties?.length || 0,
        }));
    };

    // Convert API doctor data to Home format
    const convertToDoctorFormat = (apiDoctors: any[]) => {
        return apiDoctors.map((doctor) => ({
            id: doctor.id,
            name: `${doctor.firstName} ${doctor.lastName}`, // Ghép firstName + lastName
            image: doctor.avatarUrl || '/default-doctor.png',
            specialty: doctor.specialty?.name || 'Chuyên khoa',
            hospitalName: doctor.hospital?.name || 'Bệnh viện', // Đổi từ location thành hospitalName
            rating: doctor.reviewStatistics?.averageRating || 0, // Sử dụng reviewStatistics.averageRating
            experience: `${doctor.yearsOfExperience || 0} năm kinh nghiệm`, // Số năm kinh nghiệm
            positionName: doctor.position?.name, // Position name
            serviceTypeName: doctor.prices?.[0]?.serviceTypeName, // Service type name (lấy service đầu tiên)
            amount: doctor.prices?.[0]?.amount, // Amount (lấy giá đầu tiên)
            specialtiesLink: `/doctors?specialtyId=${doctor.specialty?.id || ''}`,
        }));
    };

    // Sort doctors by rating (highest first)
    const sortDoctorsByRating = (doctors: any[]) => {
        return doctors.sort((a, b) => {
            const ratingA = a.reviewStatistics?.averageRating || 0;
            const ratingB = b.reviewStatistics?.averageRating || 0;
            return ratingB - ratingA; // Descending order (highest rating first)
        });
    };

    // Use Redux data only (no fallback to mock data)
    const allServices = convertToServiceFormat(parentServiceCategories);
    const allSpecialties = convertToSpecialtyFormat(specialties);
    const allHospitals = convertToHospitalFormat(optimizedHospitals);

    // Sort doctors by rating before converting to display format
    const sortedDoctors = sortDoctorsByRating([...doctors]); // Create a copy to avoid mutating original array
    const allDoctors = convertToDoctorFormat(sortedDoctors);

    const leftServices = allServices.slice(0, Math.ceil(allServices.length / 2));
    const rightServices = allServices.slice(Math.ceil(allServices.length / 2));

    // Show loading or empty state if no data
    const shouldShowServices = !isLoading && allServices.length > 0;
    const shouldShowSpecialties = !isSpecialtiesLoading && allSpecialties.length > 0;
    const shouldShowHospitals = !isHospitalsLoading && allHospitals.length > 0;
    const shouldShowDoctors = !isDoctorsLoading && allDoctors.length > 0;

    const listSpecialtyItems: { id: string | number; node: React.ReactNode }[] = allSpecialties.map(
        (specialty) => ({
            id: specialty.id,
            node: (
                <SpecialtyCarouselItem
                    key={specialty.id}
                    imageSrc={specialty.image}
                    iconSrc={specialty.icon}
                    title={specialty.name}
                    doctorCount={specialty.doctorCount}
                    specialtyId={specialty.id}
                />
            ),
        })
    );

    const listHospitalItems: { id: string | number; node: React.ReactNode }[] = allHospitals.map(
        (hospital) => ({
            id: hospital.id,
            node: (
                <HospitalCard
                    key={hospital.id}
                    clinic={{
                        id: hospital.id.toString(),
                        name: hospital.name,
                        image: hospital.image,
                        specialties: hospital.specialties,
                        location: hospital.address,
                        specialtyCount: hospital.specialtyCount,
                    }}
                />
            ),
        })
    );

    const listDoctorItems: { id: string | number; node: React.ReactNode }[] = allDoctors.map(
        (doctor) => ({
            id: doctor.id,
            node: (
                <DoctorCard
                    key={doctor.id}
                    image={doctor.image}
                    name={doctor.name}
                    specialty={doctor.specialty}
                    hospitalName={doctor.hospitalName} // Đổi từ location thành hospitalName
                    rating={doctor.rating}
                    experience={doctor.experience}
                    positionName={doctor.positionName}
                    serviceTypeName={doctor.serviceTypeName}
                    amount={doctor.amount}
                    profileLink={replacePathParams(
                        buildPath(PATHS.DOCTOR.ROOT, PATHS.DOCTOR.PROFILE),
                        {
                            id: doctor.id,
                        }
                    )}
                    bookingLink={replacePathParams(PATHS.BOOKING.ROOT, { doctorId: doctor.id })}
                    specialtiesLink={doctor.specialtiesLink}
                />
            ),
        })
    );

    return (
        <div>
            <MainLayout>
                {/* Banner */}
                <Banner />
                <ListServiceCategories />
                {/* List Specialties */}
                {shouldShowSpecialties ? (
                    <SectionItem
                        title="Chuyên khoa hàng đầu"
                        desc="Chăm sóc và hỗ trợ"
                        items={listSpecialtyItems}
                        breakpoints={CAROUSEL_SPECIALTIES_BREAKPOINTS}
                        viewAllTarget={PATHS.SPECIALTIES.ROOT}
                        viewAllText="Xem tất cả chuyên khoa"
                    />
                ) : (
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ minHeight: '200px' }}
                    >
                        {isSpecialtiesLoading ? (
                            <div className="spinner-border text-primary">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : (
                            <div className="container">
                                <div className="text-center py-5">
                                    <h4 className="fw-semibold mb-2">Chưa có chuyên khoa</h4>
                                    <p className="text-muted mb-4">
                                        Hiện chưa có chuyên khoa nào được cung cấp.
                                    </p>
                                    <button
                                        className="btn btn-outline-primary px-4"
                                        onClick={() => dispatch(getSpecialtiesAsync())}
                                    >
                                        Thử lại
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {/* List Hospitals */}
                {shouldShowHospitals ? (
                    <SectionItem
                        title="Bệnh viện hàng đầu"
                        desc="Khám phá các bệnh viện nổi bật"
                        items={listHospitalItems}
                        breakpoints={CAROUSEL_HOSPITALS_BREAKPOINTS}
                        viewAllText="Xem tất cả bệnh viện"
                        viewAllTarget={PATHS.HOSPITAL.ROOT}
                        isBackgroundColor
                    />
                ) : (
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ minHeight: '200px' }}
                    >
                        {isHospitalsLoading ? (
                            <div className="spinner-border text-primary">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : (
                            <div className="container">
                                <div className="text-center py-5">
                                    <h4 className="fw-semibold mb-2">Chưa có bệnh viện nào!</h4>
                                    <p className="text-muted mb-4">
                                        Hiện chưa có bệnh viện nào được cung cấp.
                                    </p>
                                    <button
                                        className="btn btn-outline-primary px-4"
                                        onClick={() => {
                                            const filter: HospitalListOptimizedFilterRequest = {
                                                page: 1,
                                                pageSize: 20,
                                                sortBy: 'Name',
                                                sortOrder: 'asc',
                                            };
                                            dispatch(getOptimizedHospitalListAsync(filter));
                                        }}
                                    >
                                        Thử lại
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {/* List Doctors */}
                {shouldShowDoctors ? (
                    <SectionItem
                        title="Bác sĩ hàng đầu"
                        desc="Gặp gỡ các bác sĩ giỏi nhất"
                        items={listDoctorItems}
                        breakpoints={CAROUSEL_DOCTORS_BREAKPOINTS}
                        viewAllTarget={PATHS.DOCTOR.ROOT}
                        viewAllText="Xem tất cả bác sĩ"
                    />
                ) : (
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ minHeight: '200px' }}
                    >
                        {isDoctorsLoading ? (
                            <div className="spinner-border text-primary">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : (
                            <div className="container">
                                <div className="text-center py-5">
                                    <h4 className="fw-semibold mb-2">Chưa có bác sĩ nào!</h4>
                                    <p className="text-muted mb-4">
                                        Hiện chưa có bác sĩ nào được cung cấp.
                                    </p>
                                    <button
                                        className="btn btn-outline-primary px-4"
                                        onClick={() => {
                                            const params: DoctorSearchParams = {
                                                pageNumber: 1,
                                                pageSize: 20,
                                                sortBy: 'rating',
                                                sortOrder: 'desc',
                                            };
                                            dispatch(searchDoctorsAsync(params));
                                        }}
                                    >
                                        Thử lại
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {/* Services Section */}
                {shouldShowServices ? (
                    <ServiceSection leftServices={leftServices} rightServices={rightServices} />
                ) : (
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
                                    <h4 className="fw-semibold mb-2">Chưa có dịch vụ nào!</h4>
                                    <p className="text-muted mb-4">
                                        Chưa có dịch vụ nào được cung cấp.
                                    </p>
                                    <button
                                        className="btn btn-outline-primary px-4"
                                        onClick={() => dispatch(getParentServiceCategoriesAsync())}
                                    >
                                        Thử lại
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </MainLayout>
        </div>
    );
};

export default Home;
