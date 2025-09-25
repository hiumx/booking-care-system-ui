import React, { useState } from 'react';
import { Service } from '@/types/booking';
import { Clock, DollarSign, Calendar, Tag, Star, Shield, Zap, CheckCircle } from 'lucide-react';
import styles from './ServiceCard.module.scss';

export interface ServiceCardProps {
    service: Service;
    onBookService: (serviceId: string) => void;
    className?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBookService, className }) => {
    const [showDetails, setShowDetails] = useState(false);

    const getServiceFeatures = () => [
        { icon: Shield, text: 'Bảo hiểm', available: true },
        { icon: Zap, text: 'Kết quả nhanh', available: true },
        { icon: CheckCircle, text: 'Chính xác', available: true },
        { icon: Star, text: 'Chất lượng cao', available: true },
    ];

    const getAvailabilityColor = (availability: string) => {
        if (availability.includes('hôm nay')) return 'success';
        if (availability.includes('tuần')) return 'warning';
        return 'info';
    };

    const serviceFeatures = getServiceFeatures();
    const availabilityColor = getAvailabilityColor(service.availability);

    return (
        <div className={`${styles.card} ${className || ''}`}>
            <div className="position-relative">
                <img
                    src={'/src/assets/img/service/service-img-02.jpg'}
                    alt={service.name}
                    className={styles.cardImg}
                />
                <div className={styles.categoryBadge}>
                    <Tag size={12} className="me-1" />
                    {service.category}
                </div>
            </div>

            <div className={styles.cardBody}>
                <div className="d-flex align-items-start justify-content-between mb-4">
                    <div className="flex-grow-1">
                        <h5 className="card-title mb-2 text-dark fw-bold fs-5">{service.name}</h5>
                        <p
                            className="text-muted small mb-3"
                            style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: '1.4',
                            }}
                        >
                            {service.description}
                        </p>
                    </div>
                </div>

                {/* Service Details */}
                <div className="mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center text-muted small">
                            <DollarSign size={16} className="me-2" />
                            <span className="fw-medium">Giá dịch vụ</span>
                        </div>
                        <span className="h5 text-primary fw-bold mb-0">{service.price}</span>
                    </div>

                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center text-muted small">
                            <Clock size={16} className="me-2" />
                            <span className="fw-medium">Thời gian</span>
                        </div>
                        <span className="small fw-semibold">{service.duration}</span>
                    </div>

                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center text-muted small">
                            <Calendar size={16} className="me-2" />
                            <span className="fw-medium">Có thể đặt</span>
                        </div>
                        <span className={`small fw-semibold text-${availabilityColor}`}>
                            {service.availability}
                        </span>
                    </div>
                </div>

                {/* Service Features */}
                <div className="mb-4">
                    <p className="small fw-medium text-muted mb-2">Đặc điểm:</p>
                    <div className="d-flex flex-wrap gap-2">
                        {serviceFeatures.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className={`d-flex align-items-center px-2 py-1 rounded-pill small ${
                                        feature.available
                                            ? 'bg-success bg-opacity-10 text-success'
                                            : 'bg-light text-muted'
                                    }`}
                                >
                                    <Icon size={12} className="me-1" />
                                    <span>{feature.text}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-2">
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className={`btn btn-outline-primary btn-sm rounded-pill px-3 ${styles.btnOutlinePrimary}`}
                        style={{ fontSize: '12px' }}
                    >
                        Chi tiết
                    </button>
                    <button
                        onClick={() => onBookService(service.id)}
                        className={`btn btn-dark flex-fill py-2 fw-semibold rounded-pill d-inline-flex align-items-center justify-content-center ${styles.btnDark}`}
                    >
                        <Calendar size={16} className="me-2" />
                        <span>Đặt ngay</span>
                    </button>
                </div>

                {/* Expandable Details */}
                <div className={`${styles.expandDetails} ${showDetails ? styles.show : ''}`}>
                    <div className="border-top pt-3 mt-3">
                        <div className="row g-3">
                            <div className="col-6">
                                <div className="text-center p-2 bg-light rounded-3">
                                    <p className="small text-muted mb-1">Độ chính xác</p>
                                    <p className="fw-semibold mb-0">99.9%</p>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="text-center p-2 bg-light rounded-3">
                                    <p className="small text-muted mb-1">Thời gian chờ</p>
                                    <p className="fw-semibold mb-0">15 phút</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
