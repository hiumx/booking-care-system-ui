import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from '../MedicalFacility.module.scss';

interface MedicalFacilityCardProps {
    name: string;
    location: string;
    imageSrc: string;
    linkTo: string;
}

const MedicalFacilityCard: React.FC<MedicalFacilityCardProps> = ({
    name,
    location,
    imageSrc,
    linkTo,
}) => {
    return (
        <div className={clsx('col-lg-3', 'col-md-6')}>
            <div className={clsx('card', 'hospital-item')}>
                <div className={clsx('card-body', 'text-center')}>
                    <Link to={linkTo} className={clsx('hospital-icon')}>
                        <img src={imageSrc} alt={name} />
                    </Link>
                    <h6 className="mb-1">
                        <Link to={linkTo} className={clsx(styles.ellipsis, styles.customLink)}>
                            {name}
                        </Link>
                    </h6>
                    <p className={clsx('mb-0', styles.ellipsis, styles.fs14)}>
                        <i className={clsx('isax', 'isax-location', 'me-2')}></i>
                        {location}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MedicalFacilityCard;
