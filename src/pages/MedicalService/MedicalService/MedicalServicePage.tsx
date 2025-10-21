import React from 'react';
import clsx from 'clsx';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import ServiceCard from './components/ServiceCard';

// 🔹 Mock data (sau này có thể fetch từ API)
const medicalServices = {
    title: 'Dịch Vụ Y Tế',
    data: [
        {
            id: 1,
            name: 'Y tá tại nhà',
            image: '/src/assets/img/service/service-doctor-01.jpg',
            servicecategories: 10,
        },
        {
            id: 2,
            name: 'Hỗ trợ di chuyển',
            image: '/src/assets/img/service/service-doctor-02.jpg',
            servicecategories: 10,
        },
        {
            id: 3,
            name: 'Vật lý trị liệu',
            image: '/src/assets/img/service/service-doctor-03.jpg',
            servicecategories: 10,
        },
        {
            id: 4,
            name: 'Thiết bị y tế',
            image: '/src/assets/img/service/service-doctor-04.jpg',
            servicecategories: 10,
        },
        {
            id: 5,
            name: 'Nhân viên chăm sóc chuyên nghiệp',
            image: '/src/assets/img/service/service-doctor-05.jpg',
            servicecategories: 10,
        },
        {
            id: 6,
            name: 'Xét nghiệm y khoa',
            image: '/src/assets//img/service/service-doctor-06.jpg',
            servicecategories: 10,
        },
        {
            id: 7,
            name: 'Tư vấn bác sĩ',
            image: '/src/assets/img/service/service-doctor-07.jpg',
            servicecategories: 10,
        },
        {
            id: 8,
            name: 'Chăm sóc mẹ và bé',
            image: '/src/assets/img/service/service-doctor-08.jpg',
            servicecategories: 10,
        },
        {
            id: 9,
            name: 'Tiêm chủng',
            image: '/src/assets/img/service/service-doctor-09.jpg',
            servicecategories: 10,
        },
        {
            id: 10,
            name: 'Tư vấn từ xa',
            image: '/src/assets/img/service/service-doctor-10.jpg',
            servicecategories: 10,
        },
    ],
};

// 🔹 Breadcrumb config
const breadcrumbData = {
    items: [
        { label: 'Trang chủ', path: '/', isActive: false },
        { label: medicalServices.title, isActive: true },
    ],
    title: 'Danh Sách ' + medicalServices.title,
};

const MedicalServicePage: React.FC = () => {
    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />

            <div className={clsx('content')}>
                <div className={clsx('container')}>
                    <div className="row">
                        {medicalServices.data.map((service) => (
                            <ServiceCard
                                key={service.id}
                                id={service.id}
                                name={service.name}
                                image={service.image}
                                servicecategories={service.servicecategories}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default MedicalServicePage;
