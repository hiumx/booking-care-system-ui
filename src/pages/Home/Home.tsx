import { buildPath, PATHS, replacePathParams } from '@/routes/paths';
import MainLayout from '../../layouts/MainLayout';
import Banner from './components/Banner';
import ClinicCaroulselItem from './components/ClinicCaroulselItem';
import SectionItem from './components/SectionItem';
import SpecialtyCarouselItem from './components/SpecialtyCarouselItem';
import DoctorCarouselItem from './components/DoctorCarouselItem';
import {
    CAROUSEL_SPECIALTIES_BREAKPOINTS,
    CAROUSEL_CLINICS_BREAKPOINTS,
    LIST_CLINICS,
    LIST_SPECIALTIES,
    LIST_DOCTORS,
    CAROUSEL_DOCTORS_BREAKPOINTS,
} from './Home.data';

const Home: React.FC = () => {
    const listSpecialtyItems = LIST_SPECIALTIES.map((specialty) => (
        <SpecialtyCarouselItem
            key={specialty.id}
            imageSrc={specialty.image}
            iconSrc={specialty.icon}
            title={specialty.name}
            doctorCount={specialty.doctorCount}
        />
    ));

    const listClinicItems = LIST_CLINICS.map((clinic) => (
        <ClinicCaroulselItem
            key={clinic.id}
            clinic={{
                id: clinic.id.toString(),
                name: clinic.name,
                image: clinic.image,
                rating: clinic.rating,
                reviewCount: clinic.reviewCount,
                specialties: clinic.specialties,
                location: clinic.address,
                distance: clinic.distance,
                priceRange: clinic.priceRange || '$100-300',
                availableSlots: clinic.availableSlots || 0,
            }}
        />
    ));
    const listDoctorItems = LIST_DOCTORS.map((doctor) => (
        <DoctorCarouselItem
            key={doctor.id}
            image={doctor.image}
            name={doctor.name}
            specialty={doctor.specialty}
            location={doctor.location}
            rating={doctor.rating}
            fee={doctor.fee}
            consultationTime={doctor.consultationTime}
            profileLink={replacePathParams(buildPath(PATHS.DOCTOR.ROOT, PATHS.DOCTOR.PROFILE), {
                id: doctor.id,
            })}
            bookingLink={replacePathParams(PATHS.BOOKING.ROOT, { doctorId: doctor.id })}
            specialtiesLink={doctor.specialtiesLink}
        />
    ));
    return (
        <div>
            <MainLayout>
                {/* Banner */}
                <Banner />
                {/* List Specialties */}
                <SectionItem
                    title="Top Specialties"
                    desc="Highlighting the Care & Support"
                    items={listSpecialtyItems}
                    breakpoints={CAROUSEL_SPECIALTIES_BREAKPOINTS}
                    viewAllTarget={PATHS.SPECIALTIES.ROOT}
                    viewAllText="View All Specialties"
                />
                {/* List Clinics */}
                <SectionItem
                    title="Top Clinics"
                    desc="Explore Our Featured Clinics"
                    items={listClinicItems}
                    breakpoints={CAROUSEL_CLINICS_BREAKPOINTS}
                    viewAllText="View All Clinics"
                    viewAllTarget={PATHS.MEDICAL_FACILITY.ROOT}
                    isBackgroundColor
                />
                {/* List Doctors */}
                <SectionItem
                    title="Top Doctors"
                    desc="Meet Our Best Specialists"
                    items={listDoctorItems}
                    breakpoints={CAROUSEL_DOCTORS_BREAKPOINTS}
                    viewAllTarget={buildPath(PATHS.DOCTOR.ROOT, PATHS.DOCTOR.LIST)}
                    viewAllText="View All Doctors"
                />
            </MainLayout>
        </div>
    );
};

export default Home;
