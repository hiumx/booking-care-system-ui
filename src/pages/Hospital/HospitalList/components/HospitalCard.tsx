import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from './HospitalCard.module.scss';

interface HospitalCardProps {
    id: number;
    name: string;
    address: string;
    avatar_url: string;
}

const HospitalCard: React.FC<HospitalCardProps> = ({ id, name, address, avatar_url }) => {
    return (
        <div className={clsx('col-lg-3', 'col-md-6')}>
            <div className={clsx('card', 'hospital-item')}>
                <div className={clsx('card-body', 'text-center')}>
                    <Link to={`/hospitals/${id}`} className={clsx('hospital-icon')}>
                        <img src={avatar_url} alt={name} />
                    </Link>
                    <h6 className="mb-1">
                        <Link
                            to={`/hospitals/${id}`}
                            className={clsx(styles.ellipsis, styles.customLink)}
                        >
                            {name}
                        </Link>
                    </h6>
                    <p className={clsx('mb-0', styles.ellipsis, styles.address)}>
                        <i className={clsx('isax', 'isax-location', 'me-2')}></i>
                        {address}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HospitalCard;
