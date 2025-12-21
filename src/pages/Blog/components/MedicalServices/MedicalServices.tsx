import React, { useMemo } from 'react';
import styles from './MedicalServices.module.scss';
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

const MedicalServices: React.FC = () => {
    const { serviceTypes, isLoading } = useServiceType();

    const formattedServices = useMemo(() => {
        return (serviceTypes || []).map((serviceType, index) => ({
            id: serviceType.id,
            name: serviceType.name,
            image:
                serviceType.imageUrl ||
                SERVICE_TYPE_STYLES[index % SERVICE_TYPE_STYLES.length].icon,
            href: `${PATHS.DOCTOR.ROOT}?serviceTypeId=${serviceType.id}&pageNumber=1&pageSize=10`,
            bgColor: SERVICE_TYPE_STYLES[index % SERVICE_TYPE_STYLES.length].bgColor,
        }));
    }, [serviceTypes]);

    // Loading / empty state
    if (isLoading && (!serviceTypes || serviceTypes.length === 0)) {
        return (
            <div className={styles.youMedServices}>
                <div className={styles.logoSection}>
                    <h2 className={styles.logo}>Medcure</h2>
                    <p className={styles.description}>
                        Nền tảng đặt dịch vụ và sản phẩm y tế dành cho bạn và gia đình
                    </p>
                </div>
                <div className={styles.servicesList}>
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem' }}>
                        <div
                            className="spinner-border text-primary"
                            role="status"
                            aria-label="Đang tải"
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Nếu không có dữ liệu, không render section
    if (!serviceTypes || serviceTypes.length === 0) {
        return null;
    }

    return (
        <div className={styles.youMedServices}>
            <div className={styles.logoSection}>
                <h2 className={styles.logo}>Medcure</h2>
                <p className={styles.description}>
                    Nền tảng đặt dịch vụ và sản phẩm y tế dành cho bạn và gia đình
                </p>
            </div>

            <div className={styles.servicesList}>
                {formattedServices.map((service) => (
                    <Link key={service.id} to={service.href} className={styles.serviceItem}>
                        <div className={`list-icon ${service.bgColor} ${styles.serviceIcon}`}>
                            <img src={service.image} alt={service.name} />
                        </div>
                        <div className={styles.serviceInfo}>
                            <h3 className={styles.serviceName}>{service.name}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default MedicalServices;
