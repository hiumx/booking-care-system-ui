import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from '../SpecialtiesList.module.scss';

interface SpecialityCardProps {
    id: number;
    name: string;
    doctorCount: number;
    image_url: string;
}

const SpecialityCard: React.FC<SpecialityCardProps> = ({ id, name, doctorCount, image_url }) => {
    return (
        <div className={clsx('col-lg-3', 'col-sm-6')}>
            <div className={clsx('card', 'speciality-item')}>
                <div className={clsx('card-body', 'p-3')}>
                    <div
                        className={clsx('d-flex', 'align-items-center', 'justify-content-between')}
                    >
                        <div className={clsx('d-flex', 'align-items-center')}>
                            <Link to={`speciality/${id}`} className={clsx('speciality-icon')}>
                                <img src={image_url} alt={name} />
                            </Link>
                            <div className={clsx('ms-3')}>
                                <h6 className="mb-1">
                                    <Link
                                        to={`speciality/${id}`}
                                        className={clsx(styles.customLink)}
                                    >
                                        {name}
                                    </Link>
                                </h6>
                                <p className={clsx('fs-14', 'mb-0')}>{doctorCount} Bác sĩ</p>
                            </div>
                        </div>
                        <Link to={`speciality/${id}`} className={clsx('link-icon')}>
                            <i className={clsx('isax', 'isax-arrow-right-3')}></i>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpecialityCard;
