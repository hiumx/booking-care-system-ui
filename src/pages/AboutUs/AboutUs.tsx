import React from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import MainLayout from '@/layouts/MainLayout';
import { PATHS } from '@/routes/paths';
import AboutSection from './components/AboutSection';
import WhyChooseSection from './components/WhyChooseSection';
import WaySection from './components/WaySection';
import DoctorsSection from './components/DoctorsSection';
import TestimonialSection from '@/components/TestimonialSection';
import FAQSection from './components/FAQSection';

const AboutUs: React.FC = () => {
    return (
        <div>
            <MainLayout>
                <Breadcrumb
                    items={[
                        { label: 'Home', path: PATHS.HOME },
                        { label: 'Giới thiệu về chúng tôi', isActive: true },
                    ]}
                    title="Giới thiệu về chúng tôi"
                />

                <AboutSection />
                <WhyChooseSection />
                <WaySection />
                <DoctorsSection />
                <TestimonialSection />
                <FAQSection />
            </MainLayout>
        </div>
    );
};

export default AboutUs;
