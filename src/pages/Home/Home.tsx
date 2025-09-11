import MainLayout from '../../layouts/MainLayout';
import Banner from './components/Banner';
import SectionItem from './components/SectionItem';
import SpecialtyCarouselItem from './components/SpecialtyCarouselItem';
import { CAROUSEL_SPECIALTIES_BREAKPOINTS, LIST_SPECIALTIES } from './Home.data';

const Home: React.FC = () => {
    const listSpecialtyItems = LIST_SPECIALTIES.map((specialty) => (
        <SpecialtyCarouselItem
            imageSrc={specialty.image}
            iconSrc={specialty.icon}
            title={specialty.name}
            doctorCount={specialty.doctorCount}
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
            </MainLayout>
        </div>
    );
};

export default Home;
