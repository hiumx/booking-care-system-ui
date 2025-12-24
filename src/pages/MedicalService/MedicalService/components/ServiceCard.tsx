import React from 'react';
import { Link } from 'react-router-dom';
import { buildPath, PATHS, replacePathParams } from '@/routes/paths';
import styles from './ServiceCard.module.scss';

interface ServiceCardProps {
    id: string | number;
    name: string;
    image: string;
    servicecategories: number;
    link?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ id, name, image, servicecategories, link }) => {
    const fullLink =
        link ||
        replacePathParams(buildPath(PATHS.Service.CATEGORIES), {
            servicesparentId: id.toString(),
        });

    return (
        <div className="col-lg-4 col-md-6">
            <div className="card clinic-item">
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <Link to={fullLink} className={`clinic-icon ${styles.cardImageWrapper}`}>
                            <img src={image} alt={name} className={styles.cardImage} />
                        </Link>
                        <div className="ms-3">
                            <h6 className="mb-1">
                                <Link to={fullLink}>{name}</Link>
                            </h6>
                            <div className="d-flex align-items-center flex-wrap clinic-location gap-2">
                                <p className="fs-14 mb-0">có {servicecategories} loại dịch vụ</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
