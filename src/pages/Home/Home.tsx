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
    LIST_HOSPITALS,
    LIST_SPECIALTIES,
    LIST_DOCTORS,
    CAROUSEL_DOCTORS_BREAKPOINTS,
} from './Home.data';
import ListServiceCategories from './components/ListServiceCategories';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { getParentServiceCategoriesAsync } from '@/store/slices/medicalServiceSlice';
import { useEffect, useRef } from 'react';

const Home: React.FC = () => {
    const dispatch = useAppDispatch();
    const hasFetched = useRef(false);

    // Get service categories from Redux store
    const { parentServiceCategories, isLoading } = useAppSelector(
        (state) => state.medicalService.serviceCategories
    );

    // Fetch parent service categories if not already loaded
    useEffect(() => {
        if (!hasFetched.current && parentServiceCategories.length === 0) {
            hasFetched.current = true;
            dispatch(getParentServiceCategoriesAsync());
        }
    }, [dispatch, parentServiceCategories.length]);

    // Convert API data to Service format
    const convertToServiceFormat = (categories: any[]) => {
        return categories.map((category) => ({
            id: category.id,
            name: category.name,
            image: category.imageUrl,
        }));
    };

    // Use Redux data only (no fallback to mock data)
    const allServices = convertToServiceFormat(parentServiceCategories);

    const leftServices = allServices.slice(0, Math.ceil(allServices.length / 2));
    const rightServices = allServices.slice(Math.ceil(allServices.length / 2));

    // Show loading or empty state if no data
    const shouldShowServices = !isLoading && allServices.length > 0;

    const listSpecialtyItems: { id: string | number; node: React.ReactNode }[] =
        LIST_SPECIALTIES.map((specialty) => ({
            id: specialty.id,
            node: (
                <SpecialtyCarouselItem
                    key={specialty.id}
                    imageSrc={specialty.image}
                    iconSrc={specialty.icon}
                    title={specialty.name}
                    doctorCount={specialty.doctorCount}
                />
            ),
        }));

    const listHospitalItems: { id: string | number; node: React.ReactNode }[] = LIST_HOSPITALS.map(
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
                        distance: hospital.distance,
                        specialtyCount: hospital.specialties?.length || 0,
                    }}
                />
            ),
        })
    );

    const listDoctorItems: { id: string | number; node: React.ReactNode }[] = LIST_DOCTORS.map(
        (doctor) => ({
            id: doctor.id,
            node: (
                <DoctorCard
                    key={doctor.id}
                    image={doctor.image}
                    name={doctor.name}
                    specialty={doctor.specialty}
                    location={doctor.location}
                    rating={doctor.rating}
                    fee={doctor.fee}
                    consultationTime={doctor.consultationTime}
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
                <SectionItem
                    title="Chuyên khoa hàng đầu"
                    desc="Chăm sóc và hỗ trợ"
                    items={listSpecialtyItems}
                    breakpoints={CAROUSEL_SPECIALTIES_BREAKPOINTS}
                    viewAllTarget={PATHS.SPECIALTIES.ROOT}
                    viewAllText="Xem tất cả chuyên khoa"
                />
                {/* List Hospitals */}
                <SectionItem
                    title="Bệnh viện hàng đầu"
                    desc="Khám phá các bệnh viện nổi bật"
                    items={listHospitalItems}
                    breakpoints={CAROUSEL_HOSPITALS_BREAKPOINTS}
                    viewAllText="Xem tất cả bệnh viện"
                    viewAllTarget={PATHS.HOSPITAL.ROOT}
                    isBackgroundColor
                />
                {/* List Doctors */}
                <SectionItem
                    title="Bác sĩ hàng đầu"
                    desc="Gặp gỡ các chuyên gia giỏi nhất"
                    items={listDoctorItems}
                    breakpoints={CAROUSEL_DOCTORS_BREAKPOINTS}
                    viewAllTarget={PATHS.DOCTOR.ROOT}
                    viewAllText="Xem tất cả bác sĩ"
                />
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
                            <div className="alert alert-info">
                                <h4 className="alert-heading">Thông báo!</h4>
                                <p>Chưa có dịch vụ nào được cung cấp.</p>
                            </div>
                        )}
                    </div>
                )}
            </MainLayout>
        </div>
    );
};

export default Home;
