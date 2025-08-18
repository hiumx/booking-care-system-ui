import React from 'react';
import SectionHeader from './components/SectionHeader';
import ServiceColumn from './components/ServiceColumn';
import ServiceImageCenter from './components/ServiceImageCenter';

const ServiceSection: React.FC = () => {
    const leftServices = [
        {
            title: 'Nurse at Home',
            image: './src/assets/img/service/service-doctor-01.jpg',
            link: 'search-2.html',
        },
        {
            title: 'Mobility Assistance',
            image: './src/assets/img/service/service-doctor-02.jpg',
            link: 'search-2.html',
        },
        {
            title: 'Physiotherapy',
            image: './src/assets/img/service/service-doctor-03.jpg',
            link: 'search-2.html',
        },
        {
            title: 'Medical Equipment',
            image: './src/assets/img/service/service-doctor-04.jpg',
            link: 'search-2.html',
        },
        {
            title: 'Trained Attendants',
            image: './src/assets/img/service/service-doctor-05.jpg',
            link: 'search-2.html',
        },
    ];

    const rightServices = [
        {
            title: 'Lab Tests',
            image: './src/assets/img/service/service-doctor-06.jpg',
            link: 'search-2.html',
        },
        {
            title: 'Doctor Consultation',
            image: './src/assets/img/service/service-doctor-07.jpg',
            link: 'search-2.html',
        },
        {
            title: 'Mother & Baby Care',
            image: './src/assets/img/service/service-doctor-08.jpg',
            link: 'search-2.html',
        },
        {
            title: 'Vaccination',
            image: './src/assets/img/service/service-doctor-09.jpg',
            link: 'search-2.html',
        },
        {
            title: 'Tele Consultation',
            image: './src/assets/img/service/service-doctor-10.jpg',
            link: 'search-2.html',
        },
    ];

    return (
        <section className="service-sec-fourteen">
            <div className="section-bg">
                <img src="./src/assets/img/bg/sercice-sec-bg.png" alt="Background" />
            </div>
            <div className="container">
                <SectionHeader
                    title="Our"
                    subtitle="More the quantity, higher the discount. Hurry, Buy Now!"
                />
                <div className="row justify-content-center">
                    <div className="col-lg-4 col-md-12 d-flex">
                        <ServiceColumn services={leftServices} />
                    </div>
                    <div className="col-lg-4 col-md-6 d-flex">
                        <ServiceImageCenter
                            mainImage="./src/assets/img/service/service-img.jpg"
                            imageOne="./src/assets/img/service/service-img-01.jpg"
                            imageTwo="./src/assets/img/service/service-img-02.jpg"
                        />
                    </div>
                    <div className="col-lg-4 col-md-12 d-flex">
                        <ServiceColumn services={rightServices} reverse />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceSection;
