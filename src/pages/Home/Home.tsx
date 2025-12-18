import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AOS from 'aos';
import { PATHS } from '@/routes/paths';
import MainLayout from '../../layouts/MainLayout';
import Banner from './components/Banner';
import HospitalCard from '@/components/HospitalCard';
import SectionItem from './components/SectionItem';
import SpecialtyCarouselItem from './components/SpecialtyCarouselItem';
import ServiceSection from './components/ServicesSection/ServiceSection';
import {
    CAROUSEL_SPECIALTIES_BREAKPOINTS,
    CAROUSEL_HOSPITALS_BREAKPOINTS,
    CAROUSEL_DOCTORS_BREAKPOINTS,
} from './Home.data';
import ListServiceTypeDoctor from './components/ListServiceTypeDoctor';
import InfoSection from './components/InfoSection';
import ArticleSection from './components/ArticleSection';
import FAQSection from './components/FAQSection';
import TestimonialSection from './components/TestimonialSection';
import BookusSection from './components/BookusSection';
import ReasonsSection from './components/ReasonsSection';
import HorizontalServicesSection from './components/HorizontalServicesSection';
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
import { createDoctorListItems } from '@/utils/doctor-list.utils';

const Home: React.FC = () => {
    const { t } = useTranslation('home');

    useEffect(() => {
        // Refresh AOS when Home component mounts to ensure animations work
        // Use setTimeout to ensure DOM is fully rendered
        const timer = setTimeout(() => {
            // Check if AOS is initialized before refreshing
            if (AOS !== undefined) {
                AOS.refresh();
            }
        }, 300);

        return () => clearTimeout(timer);
    }, []);
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

    // Use shared utility to create doctor list items
    const listDoctorItems = createDoctorListItems(allDoctors);

    return (
        <div>
            <MainLayout>
                {/* Banner */}
                <Banner />
                <ListServiceTypeDoctor />
                {/* List Specialties */}
                {shouldShowSpecialties ? (
                    <SectionItem
                        title={t('sections.specialties.title')}
                        desc={t('sections.specialties.desc')}
                        items={listSpecialtyItems}
                        breakpoints={CAROUSEL_SPECIALTIES_BREAKPOINTS}
                        viewAllTarget={PATHS.SPECIALTIES.ROOT}
                        viewAllText={t('sections.specialties.viewAll')}
                    />
                ) : (
                    <SpecialtiesEmptyState isLoading={isSpecialtiesLoading} />
                )}
                {/* List Hospitals */}
                {shouldShowHospitals ? (
                    <SectionItem
                        title={t('sections.hospitals.title')}
                        desc={t('sections.hospitals.desc')}
                        items={listHospitalItems}
                        breakpoints={CAROUSEL_HOSPITALS_BREAKPOINTS}
                        viewAllText={t('sections.hospitals.viewAll')}
                        viewAllTarget={PATHS.HOSPITAL.ROOT}
                        isBackgroundColor
                    />
                ) : (
                    <HospitalsEmptyState isLoading={isHospitalsLoading} />
                )}
                {/* List Doctors */}
                {shouldShowDoctors ? (
                    <SectionItem
                        title={t('sections.doctors.title')}
                        desc={t('sections.doctors.desc')}
                        items={listDoctorItems}
                        breakpoints={CAROUSEL_DOCTORS_BREAKPOINTS}
                        viewAllTarget={PATHS.DOCTOR.ROOT}
                        viewAllText={t('sections.doctors.viewAll')}
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
                {/* Horizontal Services Section */}
                <HorizontalServicesSection />
                {/* Reasons Section */}
                <ReasonsSection />
                {/* Bookus Section */}
                <BookusSection />
                {/* Testimonial Section */}
                <TestimonialSection />
                {/* FAQ Section */}
                <FAQSection />
                {/* Article Section */}
                <ArticleSection />
                {/* Info Section */}
                <InfoSection />
            </MainLayout>
        </div>
    );
};

export default Home;
