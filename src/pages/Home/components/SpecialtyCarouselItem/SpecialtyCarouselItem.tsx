import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import styles from './SpecialtyCarouselItem.module.scss';

interface SpecialtyCarouselItemProps {
    imageSrc: string;
    iconSrc: string;
    title: string;
    doctorCount: number;
    specialtyId: string;
}

const SpecialtyCarouselItem: React.FC<SpecialtyCarouselItemProps> = ({
    imageSrc,
    iconSrc,
    title,
    doctorCount,
    specialtyId,
}) => {
    return (
        <div className={clsx(styles.specialtyCarouselItemContainer, 'spaciality-item')}>
            <div className="spaciality-img">
                <img src={imageSrc} alt="img" />
                <span className="spaciality-icon">
                    <img src={iconSrc} alt="img" />
                </span>
            </div>
            <h6>
                <Link to={`${PATHS.HOSPITAL.ROOT}?specialtyId=${specialtyId}`}>{title}</Link>
            </h6>
            <p className="mb-0">{doctorCount} bác sĩ</p>
        </div>
    );
};

export default SpecialtyCarouselItem;
