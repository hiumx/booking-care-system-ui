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
    LIST_SERVICES,
} from './Home.data';
import ListServiceCategories from './components/ListServiceCategories';

const Home: React.FC = () => {
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
                        rating: hospital.rating,
                        reviewCount: hospital.reviewCount,
                        specialties: hospital.specialties,
                        location: hospital.address,
                        distance: hospital.distance,
                        priceRange: hospital.priceRange || '$100-300',
                        availableSlots: hospital.availableSlots || 0,
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
    const leftServices = LIST_SERVICES.slice(0, 5); // 0 -> 4
    const rightServices = LIST_SERVICES.slice(5, 10); // 5 -> 9
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
                <ServiceSection leftServices={leftServices} rightServices={rightServices} />
            </MainLayout>
        </div>
    );
};

export default Home;
