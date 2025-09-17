import React from 'react';
import clsx from 'clsx';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import ServiceTypeCard from './components/ServiceTypeCard';
import styles from './ServiceTypesPage.module.scss';
import { replacePathParams, PATHS } from '@/routes/paths';

// 🔹 Mock data (sau này có thể fetch từ API)
const serviceTypes = {
    title: 'Các Chuyên Khoa Trong Gói Khám',
    data: [
        { id: 1, name: 'Cơ Xương Khớp', image: '/placeholder-iu3nm.png' },
        { id: 2, name: 'Thần kinh', image: '/placeholder-k6snl.png' },
        { id: 3, name: 'Tiêu hóa', image: '/placeholder-teryf.png' },
        { id: 4, name: 'Tim mạch', image: '/placeholder-dn2tm.png' },
        { id: 5, name: 'Tai Mũi Họng', image: '/placeholder-f79tp.png' },
        { id: 6, name: 'Cột sống', image: '/placeholder-85358.png' },
        { id: 7, name: 'Y học Cổ truyền', image: '/placeholder-o17r3.png' },
        {
            id: 8,
            name: 'Châm cứu',
            image: '/acupuncture-needles-medical-icon-professional-oran.png',
        },
        { id: 9, name: 'Sản Phụ khoa', image: '/placeholder-xiagp.png' },
        { id: 10, name: 'Siêu âm thai', image: '/placeholder-eehfz.png' },
        { id: 11, name: 'Nhi khoa', image: '/placeholder-4yawi.png' },
        { id: 12, name: 'Da liễu', image: '/placeholder-s5ssn.png' },
    ],
};

// 🔹 Breadcrumb config
const breadcrumbData = {
    items: [
        { label: 'Trang chủ', path: '/', isActive: false },
        { label: serviceTypes.title, isActive: true },
    ],
    title: 'Các Dịch Vụ Trong ' + serviceTypes.title,
};

const ServiceTypesPage: React.FC = () => {
    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />

            <div className={clsx('content')}>
                <div className={clsx('container')}>
                    <div className={styles.grid}>
                        {serviceTypes.data.map((service) => (
                            <ServiceTypeCard
                                key={service.id}
                                id={service.id}
                                name={service.name}
                                image={service.image}
                                link={replacePathParams(PATHS.SPECIALTIES.PROFILE, {
                                    id: service.id,
                                })}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ServiceTypesPage;
