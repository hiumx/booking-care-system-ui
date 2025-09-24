import { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './ServiceTypeCard.module.scss';

type ServiceTypeCardProps = {
    id: number;
    name: string;
    image: string;
    link?: string;
};

const ServiceTypeCard: FC<ServiceTypeCardProps> = ({ name, image, link = '#' }) => {
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

export default ServiceTypeCard;
