import { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './ServiceCategoryCard.module.scss';

type ServiceCategoryCardProps = {
    name: string;
    image: string;
    link: string;
};

const ServiceCategoryCard: FC<ServiceCategoryCardProps> = ({ name, image, link = '#' }) => {
    return (
        <Link to={link} className={styles.card}>
            {/* Chỉ chứa ảnh */}
            <div className={styles.imageWrapper}>
                <img src={image} alt={name} />
            </div>

            {/* Chỉ chứa tên dịch vụ */}
            <div className={styles.nameWrapper}>
                <h3>{name}</h3>
            </div>
        </Link>
    );
};

export default ServiceCategoryCard;
