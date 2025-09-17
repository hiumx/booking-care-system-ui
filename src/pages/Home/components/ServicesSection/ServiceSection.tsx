import React, { useEffect } from 'react';
import SectionHeader from 'src/pages/Home/components/ServicesSection/components/SectionHeader';
import ServiceColumn from 'src/pages/Home/components/ServicesSection/components/ServiceColumn';
import ServiceImageCenter from 'src/pages/Home/components/ServicesSection/components/ServiceImageCenter';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface Service {
    id: number;
    name: string;
    image: string;
}

interface ServiceSectionProps {
    leftServices: Service[];
    rightServices: Service[];
}

const ServiceSection: React.FC<ServiceSectionProps> = ({ leftServices, rightServices }) => {
    useEffect(() => {
        AOS.init({
            duration: 800, // thời gian animation (ms)
            once: false, // false => mỗi lần scroll tới lại chạy lại animation
        });
    }, []);

    return (
        <section className="service-sec-fourteen">
            <div className="section-bg">
                <img src="/src/assets/img/bg/sercice-sec-bg.png" alt="Background" />
            </div>
            <div className="container">
                <SectionHeader
                    title="Our"
                    subtitle="More the quantity, higher the discount. Hurry, Buy Now!"
                    data-aos="fade-up"
                />
                <div className="row justify-content-center">
                    {/* Left services */}
                    <div className="col-lg-4 col-md-12 d-flex" data-aos="fade-right">
                        <ServiceColumn services={leftServices} />
                    </div>

                    {/* Center images */}
                    <div className="col-lg-4 col-md-6 d-flex" data-aos="zoom-in">
                        <ServiceImageCenter
                            mainImage="/src/assets/img/service/service-img.jpg"
                            imageOne="/src/assets/img/service/service-img-01.jpg"
                            imageTwo="/src/assets/img/service/service-img-02.jpg"
                        />
                    </div>

                    {/* Right services */}
                    <div className="col-lg-4 col-md-12 d-flex" data-aos="fade-left">
                        <ServiceColumn services={rightServices} reverse />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceSection;
