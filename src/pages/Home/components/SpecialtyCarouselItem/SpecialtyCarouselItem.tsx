import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { PATHS, replacePathParams } from '@/routes/paths';
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
    const detailUrl = replacePathParams(PATHS.SPECIALTIES.DETAIL, { id: specialtyId });

    return (
        <Link
            to={detailUrl}
            className={clsx(styles.specialtyCarouselItemContainer, 'spaciality-item')}
            aria-label={`Xem chi tiết chuyên khoa ${title}`}
        >
            <div className="spaciality-img">
                <img src={imageSrc} alt={title} />
                <span className="spaciality-icon">
                    <img src={iconSrc} alt={`Icon ${title}`} />
                </span>
            </div>
            <h6>{title}</h6>
            <p className="mb-0">{doctorCount} bác sĩ</p>
        </Link>
    );
};

export default SpecialtyCarouselItem;
