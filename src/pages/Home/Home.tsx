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
import ListServiceTypeDoctor from './components/ListServiceTypeDoctor';
import { useHomeData } from '@/hooks/useHomeData';
import {
    convertToServiceFormat,
    convertToSpecialtyFormat,
    convertToHospitalFormat,
    convertToDoctorFormat,
    sortDoctorsByRating,
} from '@/utils/homeDataConverters';
import {
    SpecialtiesEmptyState,
    HospitalsEmptyState,
    DoctorsEmptyState,
    ServicesEmptyState,
} from '@/components/LoadingEmptyState';

const Home: React.FC = () => {
    const {
        parentServiceCategories,
        isLoading,
        specialties,
        isSpecialtiesLoading,
        optimizedHospitals,
        isHospitalsLoading,
        doctors,
        isDoctorsLoading,
    } = useHomeData();

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
                <ListServiceTypeDoctor />
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
                    <SpecialtiesEmptyState isLoading={isSpecialtiesLoading} />
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
                    <HospitalsEmptyState isLoading={isHospitalsLoading} />
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
                    <DoctorsEmptyState isLoading={isDoctorsLoading} />
                )}
                {/* Services Section */}
                {shouldShowServices ? (
                    <ServiceSection leftServices={leftServices} rightServices={rightServices} />
                ) : (
                    <ServicesEmptyState isLoading={isLoading} />
                )}
            </MainLayout>
        </div>
    );
};

export default Home;
