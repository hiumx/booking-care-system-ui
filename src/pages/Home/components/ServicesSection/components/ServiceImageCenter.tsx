import React from 'react';

interface ServiceImageCenterProps {
    mainImage: string;
    imageOne: string;
    imageTwo: string;
}

const ServiceImageCenter: React.FC<ServiceImageCenterProps> = ({
    mainImage,
    imageOne,
    imageTwo,
}) => {
    return (
        <div className="services-img-col w-100">
            <div className="sec-img-center">
                <img src={mainImage} alt="Main" />
            </div>
            <div className="img-center img-center-one" data-aos="fade-down" data-aos-delay="500">
                <img src={imageOne} alt="Sub One" />
            </div>
            <div className="img-center img-center-two" data-aos="fade-up" data-aos-delay="800">
                <img src={imageTwo} alt="Sub Two" />
            </div>
        </div>
    );
};

export default ServiceImageCenter;
