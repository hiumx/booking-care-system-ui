import React from 'react';
import { useTranslation } from 'react-i18next';
import Breadcrumb from '@/components/Breadcrumb';
import MainLayout from '@/layouts/MainLayout';
import { PATHS } from '@/routes/paths';
import AboutSection from './components/AboutSection';
import WhyChooseSection from './components/WhyChooseSection';
import WaySection from './components/WaySection';
import TestimonialSection from '@/components/TestimonialSection';
import FAQSection from './components/FAQSection';
import SectionItem from '@/pages/Home/components/SectionItem';
import { CAROUSEL_DOCTORS_BREAKPOINTS } from '@/pages/Home/Home.data';
import { useHomeData } from '@/hooks/useHomeData';
import { convertToDoctorFormat, sortDoctorsByRating } from '@/utils/homeDataConverters';
import { DoctorsEmptyState } from '@/components/LoadingEmptyState';
import { createDoctorListItems } from '@/utils/doctor-list.utils';

const AboutUs: React.FC = () => {
    const { t } = useTranslation('about');
    const { doctors, isDoctorsLoading } = useHomeData();

    // Sort doctors by rating and convert to display format
    const sortedDoctors = sortDoctorsByRating([...doctors]);
    const allDoctors = convertToDoctorFormat(sortedDoctors);
    const shouldShowDoctors = !isDoctorsLoading && allDoctors.length > 0;

    // Use shared utility to create doctor list items
    const listDoctorItems = createDoctorListItems(allDoctors);

    return (
        <div>
            <MainLayout>
                <Breadcrumb
                    items={[
                        { label: t('breadcrumb.home'), path: PATHS.HOME },
                        { label: t('breadcrumb.aboutUs'), isActive: true },
                    ]}
                    title={t('title')}
                />

                <AboutSection />
                <WhyChooseSection />
                <WaySection />

                {/* List Doctors */}
                {shouldShowDoctors ? (
                    <SectionItem
                        title={t('doctors.title')}
                        desc={t('doctors.desc')}
                        items={listDoctorItems}
                        breakpoints={CAROUSEL_DOCTORS_BREAKPOINTS}
                        viewAllTarget={PATHS.DOCTOR.ROOT}
                        viewAllText={t('doctors.viewAll')}
                    />
                ) : (
                    <DoctorsEmptyState isLoading={isDoctorsLoading} />
                )}

                <TestimonialSection />
                <FAQSection />
            </MainLayout>
        </div>
    );
};

export default AboutUs;
