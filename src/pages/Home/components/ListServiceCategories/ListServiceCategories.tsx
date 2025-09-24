import React from 'react';
import { LIST_SERVICE_CATEGORIES } from '../../Home.data';

const ListServiceCategories: React.FC = () => {
    return (
        <div className="list-section">
            <div className="container">
                <div className="list-card card mb-0">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-center justify-content-xl-between flex-wrap gap-4 list-wraps">
                            {LIST_SERVICE_CATEGORIES.map((service) => (
                                <a
                                    key={service.id}
                                    href={service.href}
                                    className="list-item aos"
                                    data-aos="fade-up"
                                >
                                    <div className={`list-icon ${service.bgColor}`}>
                                        <img src={service.icon} alt="img" />
                                    </div>
                                    <h6>{service.text}</h6>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListServiceCategories;
