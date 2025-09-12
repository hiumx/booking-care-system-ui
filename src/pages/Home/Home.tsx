import MainLayout from '../../layouts/MainLayout';
import Banner from './components/Banner';
import SectionItem from './components/SectionItem';
import SpecialtyCarouselItem from './components/SpecialtyCarouselItem';
import DoctorCarouselItem from './components/DoctorCarouselItem';
import { CAROUSEL_SPECIALTIES_BREAKPOINTS, LIST_SPECIALTIES, LIST_DOCTORS } from './Home.data';

const Home: React.FC = () => {
    const listSpecialtyItems = LIST_SPECIALTIES.map((specialty) => (
        <SpecialtyCarouselItem
            imageSrc={specialty.image}
            iconSrc={specialty.icon}
            title={specialty.name}
            doctorCount={specialty.doctorCount}
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
            profileLink={`/doctor/${doctor.id}`}
            bookingLink={`/booking/${doctor.id}`}
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
                />
                {/* List Clinics */}
                <SectionItem
                    title="Top Clinics"
                    desc="Explore Our Featured Clinics"
                    items={listSpecialtyItems}
                    breakpoints={CAROUSEL_SPECIALTIES_BREAKPOINTS}
                />
                {/* List Doctors */}
                <SectionItem
                    title="Top Doctors"
                    desc="Meet Our Best Specialists"
                    items={listDoctorItems}
                    breakpoints={{
                        320: { slidesPerView: 1 },
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 4 },
                    }}
                />
                ;
            </MainLayout>
        </div>
    );
};

export default Home;
