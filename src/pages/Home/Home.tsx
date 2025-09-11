import MainLayout from '../../layouts/MainLayout';
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
                <SectionItem
                    items={listSpecialtyItems}
                    breakpoints={CAROUSEL_SPECIALTIES_BREAKPOINTS}
                />
            </MainLayout>
        </div>
    );
};

export default Home;
