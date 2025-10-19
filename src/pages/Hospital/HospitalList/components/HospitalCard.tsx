import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from './HospitalCard.module.scss';

interface HospitalCardProps {
    id: string;
    name: string;
    address: string;
    avatar_url?: string;
}

const HospitalCard: React.FC<HospitalCardProps> = ({ id, name, address, avatar_url }) => {
    return (
        <div className={clsx('col-lg-3', 'col-md-6', 'mb-4')}>
            <div className={clsx('card', 'hospital-item', styles.hospitalCard)}>
                <div className={clsx('card-body', 'text-center', styles.hospitalCardBody)}>
                    <Link to={`/hospitals/${id}`} className={clsx('hospital-icon')}>
                        <img
                            src={avatar_url || '/default-hospital.png'}
                            alt={name}
                            className={styles.hospitalImage}
                        />
                    </Link>
                    <div>
                        <h6 className="mb-2">
                            <Link
                                to={`/hospitals/${id}`}
                                className={clsx(styles.hospitalName, styles.customLink)}
                            >
                                {name}
                            </Link>
                        </h6>
                        <p className={clsx('mb-0', styles.address)}>
                            <i className={clsx('isax', 'isax-location', styles.locationIcon)}></i>
                            {address}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HospitalCard;
