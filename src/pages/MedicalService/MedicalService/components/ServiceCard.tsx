import React from 'react';
import { Link } from 'react-router-dom';
import { buildPath, PATHS, replacePathParams } from '@/routes/paths';

interface ServiceCardProps {
    id: number;
    name: string;
    image: string;
    servicecategories: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ id, name, image, servicecategories }) => {
    const fullLink = replacePathParams(buildPath(PATHS.Service.CATEGORIES), {
        servicesparentId: id.toString(),
    });

    return (
        <div className="col-lg-4 col-md-6">
            <div className="card clinic-item">
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <Link to={fullLink} className="clinic-icon">
                            <img src={image} alt={name} />
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
