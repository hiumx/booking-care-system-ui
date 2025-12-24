import { FC } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from './ServiceCategoryCard.module.scss';

type ServiceCategoryCardProps = {
    name: string;
    image: string;
    link: string;
    description?: string;
};

const ServiceCategoryCard: FC<ServiceCategoryCardProps> = ({
    name,
    image,
    link = '#',
    description,
}) => {
    return (
        <div className={styles.cardWrapper}>
            <Link to={link} className={clsx('card', styles.card)}>
                <div className={clsx('card-body', styles.cardBody)}>
                    <div className={styles.cardContent}>
                        {/* Icon/Image Section */}
                        <Link to={link} className={styles.iconWrapper}>
                            <img src={image} alt={name} className={styles.icon} />
                        </Link>

                        {/* Text Content */}
                        <div className={styles.textContent}>
                            <h6 className={clsx('mb-1', styles.title)}>
                                <Link to={link} className={styles.titleLink}>
                                    {name}
                                </Link>
                            </h6>
                            {description && (
                                <p className={clsx('fs-14', 'mb-0', styles.description)}>
                                    {description}
                                </p>
                            )}
                        </div>

                        {/* Arrow Icon */}
                        <Link to={link} className={styles.arrowIcon}>
                            <i className={clsx('isax', 'isax-arrow-right-3')}></i>
                        </Link>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ServiceCategoryCard;
