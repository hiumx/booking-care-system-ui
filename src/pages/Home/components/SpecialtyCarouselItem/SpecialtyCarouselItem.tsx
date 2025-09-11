interface SpecialtyCarouselItemProps {
    imageSrc: string;
    iconSrc: string;
    title: string;
    doctorCount: number;
}

const SpecialtyCarouselItem: React.FC<SpecialtyCarouselItemProps> = ({
    imageSrc,
    iconSrc,
    title,
    doctorCount,
}) => {
    return (
        <div className="spaciality-item">
            <div className="spaciality-img">
                <img src={imageSrc} alt="img" />
                <span className="spaciality-icon">
                    <img src={iconSrc} alt="img" />
                </span>
            </div>
            <h6>
                <a href="doctor-grid.html">{title}</a>
            </h6>
            <p className="mb-0">{doctorCount} Doctors</p>
        </div>
    );
};

export default SpecialtyCarouselItem;
