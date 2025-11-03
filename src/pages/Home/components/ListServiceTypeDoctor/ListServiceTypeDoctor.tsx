import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useServiceType } from '@/hooks/useServiceType';
import { PATHS } from '@/routes/paths';
import icon01 from '@/assets/img/icons/list-icon-01.svg';
import icon02 from '@/assets/img/icons/list-icon-02.svg';
import icon03 from '@/assets/img/icons/list-icon-03.svg';
import icon04 from '@/assets/img/icons/list-icon-04.svg';
import icon05 from '@/assets/img/icons/list-icon-05.svg';
import icon06 from '@/assets/img/icons/list-icon-06.svg';
import icon07 from '@/assets/img/icons/list-icon-07.svg';

// Danh sách icons và màu nền để map với service types từ API
const SERVICE_TYPE_STYLES = [
    { icon: icon01, bgColor: 'bg-secondary' },
    { icon: icon02, bgColor: 'bg-primary' },
    { icon: icon03, bgColor: 'bg-pink' },
    { icon: icon04, bgColor: 'bg-cyan' },
    { icon: icon05, bgColor: 'bg-purple' },
    { icon: icon06, bgColor: 'bg-orange' },
    { icon: icon07, bgColor: 'bg-teal' },
];

const ListServiceTypeDoctor: React.FC = () => {
    const { serviceTypes, isLoading } = useServiceType();

    // Map service types từ API sang format UI với icons và colors
    const formattedServiceTypes = useMemo(() => {
        return serviceTypes.map((serviceType, index) => ({
            id: serviceType.id,
            name: serviceType.name,
            // Sử dụng imageUrl từ API, fallback về icon cố định nếu không có
            icon:
                serviceType.imageUrl ||
                SERVICE_TYPE_STYLES[index % SERVICE_TYPE_STYLES.length].icon,
            bgColor: SERVICE_TYPE_STYLES[index % SERVICE_TYPE_STYLES.length].bgColor,
            // Tạo link đến trang doctors với searchParams serviceTypeId
            to: `${PATHS.DOCTOR.ROOT}?serviceTypeId=${serviceType.id}&pageNumber=1&pageSize=10`,
        }));
    }, [serviceTypes]);

    // Hiển thị loading state
    if (isLoading && serviceTypes.length === 0) {
        return (
            <div className="list-section">
                <div className="container">
                    <div className="list-card card mb-0">
                        <div className="card-body">
                            <div
                                className="d-flex align-items-center justify-content-center"
                                style={{ minHeight: '120px' }}
                            >
                                <div className="spinner-border text-primary" aria-label="Đang tải">
                                    <span className="visually-hidden">Đang tải...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Không hiển thị gì nếu không có service types
    if (serviceTypes.length === 0) {
        return null;
    }

    return (
        <div className="list-section">
            <div className="container">
                <div className="list-card card mb-0">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-center justify-content-xl-between flex-wrap gap-4 list-wraps">
                            {formattedServiceTypes.map((service) => (
                                <Link
                                    key={service.id}
                                    to={service.to}
                                    className="list-item aos"
                                    data-aos="fade-up"
                                >
                                    <div className={`list-icon ${service.bgColor}`}>
                                        <img src={service.icon} alt="img" />
                                    </div>
                                    <h6>{service.name}</h6>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListServiceTypeDoctor;
