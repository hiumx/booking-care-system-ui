import React from 'react';
import clsx from 'clsx';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import ServiceCategoryCard from './components/ServiceCategoryCard';
import styles from './ServiceCategoriesPage.module.scss';
import { replacePathParams, PATHS } from '@/routes/paths';

// 🔹 Mock data (sau này có thể fetch từ API)
const serviceCategories = {
    title: 'Khám Chuyên Khoa',
    data: [
        { id: 1, name: 'Cơ Xương Khớp', image: '/src/assets/img/specialities/specialities-04.svg' },
        { id: 2, name: 'Thần kinh', image: '/src/assets/img/specialities/speciality-icon-03.svg' },
        { id: 3, name: 'Tiêu hóa', image: '/src/assets/img/specialities/speciality-04.svg' },
        { id: 4, name: 'Tim mạch', image: '/src/assets/img/specialities/speciality-icon-01.svg' },
        { id: 5, name: 'Khoa Sản', image: '/src/assets/img/specialities/speciality-icon-04.svg' },
        { id: 6, name: 'Cột sống', image: '/src/assets/img/specialities/speciality-icon-02.svg' },
        { id: 7, name: 'Đầu', image: '/src/assets/img/specialities/speciality-icon-05.svg' },
        {
            id: 8,
            name: 'Hô hấp',
            image: '/src/assets/img/specialities/speciality-icon-07.svg',
        },
        { id: 9, name: 'Thận', image: '/src/assets/img/specialities/speciality-icon-08.svg' },
    ],
};

// 🔹 Breadcrumb config
const breadcrumbData = {
    items: [
        { label: 'Trang chủ', path: '/', isActive: false },
        { label: serviceCategories.title, isActive: true },
    ],
    title: 'Các Dịch Vụ Trong ' + serviceCategories.title,
};

const ServiceCategoriesPage: React.FC = () => {
    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />

            <div className={clsx('content')}>
                <div className={clsx('container')}>
                    <div className={styles.grid}>
                        {serviceCategories.data.map((service) => (
                            <ServiceCategoryCard
                                key={service.id}
                                name={service.name}
                                image={service.image}
                                link={replacePathParams(PATHS.Service.HOSPITALS, {
                                    servicesparentId: service.id,
                                    serviceschildId: service.id,
                                })}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ServiceCategoriesPage;
