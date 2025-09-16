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
            <div className={styles.imageWrapper}>
                <img src={image || '/placeholder.svg'} alt={name} />
                <div className={styles.overlay}>
                    <h3>{name}</h3>
                </div>
            </div>
        </Link>
    );
};

export default ServiceTypeCard;
