import React, { useEffect } from 'react';
import SubscriptionPlanCard from '@/pages/SubscriptionPlans/components/SubscriptionPlanCard';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface SubscriptionPlan {
    id: number;
    name: string;
    prices: { [key: string]: number };
    billing_cycles: ('MONTHLY' | 'QUARTERLY' | 'YEARLY')[];
    features: string[];
    status: 'ACTIVE' | 'INACTIVE';
    isPopular?: boolean;
}

interface BreadcrumbItem {
    label: string;
    path?: string;
    isActive?: boolean;
}

const SubscriptionPlans: React.FC = () => {
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    const breadcrumbData = {
        title: 'Gói Đăng Ký',
        items: [
            { label: 'Trang chủ', path: '/' },
            { label: 'Gói Đăng Ký', isActive: true },
        ] as BreadcrumbItem[],
    };

    const plans: SubscriptionPlan[] = [
        {
            id: 1,
            name: 'Basic',
            prices: {
                MONTHLY: 1.2,
                QUARTERLY: 3.0,
                YEARLY: 11.0,
            },
            billing_cycles: ['MONTHLY', 'QUARTERLY', 'YEARLY'],
            features: [
                'Hiển thị thông tin cơ sở y tế và dịch vụ cơ bản trên nền tảng',
                'Quản lý tối đa 5 bác sĩ',
                'Quản lý tối đa 3 chuyên khoa',
                'Hỗ trợ quản lý lịch hẹn trực tuyến',
                'Gửi nhắc nhở tự động cho bệnh nhân (Email/SMS cơ bản)',
                'Tư vấn y tế từ xa giới hạn 20 lượt/tháng',
            ],
            status: 'ACTIVE',
        },
        {
            id: 2,
            name: 'Advanced',
            prices: {
                MONTHLY: 3.8,
                QUARTERLY: 10.0,
                YEARLY: 36.0,
            },
            billing_cycles: ['MONTHLY', 'QUARTERLY', 'YEARLY'],
            features: [
                'Bao gồm toàn bộ tính năng của gói Cơ bản',
                'Quản lý tối đa 20 bác sĩ',
                'Quản lý tối đa 10 chuyên khoa',
                'Hiển thị ưu tiên trong kết quả tìm kiếm',
                'Tư vấn y tế từ xa không giới hạn',
                'Quản lý & thống kê lịch sử đặt hẹn (theo tháng/quý)',
                'Hỗ trợ kênh trao đổi trực tuyến giữa bệnh nhân & nhân viên y tế',
            ],
            status: 'ACTIVE',
            isPopular: true,
        },
        {
            id: 3,
            name: 'Premium',
            prices: {
                MONTHLY: 7.5,
                QUARTERLY: 20.0,
                YEARLY: 72.0,
            },
            billing_cycles: ['MONTHLY', 'QUARTERLY', 'YEARLY'],
            features: [
                'Bao gồm toàn bộ tính năng của gói Nâng cao',
                'Không giới hạn số lượng bác sĩ & chuyên khoa',
                'Được hiển thị nổi bật nhất trong kết quả tìm kiếm',
                'Trang hồ sơ bệnh viện chuyên biệt (thương hiệu, banner, hình ảnh/video)',
                'Báo cáo nâng cao (doanh thu, lượt khám)',
                'Hỗ trợ khách hàng VIP 24/7',
            ],
            status: 'ACTIVE',
        },
    ];

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />

            <section className="pricing-section doc-plan py-12 bg-gray-100">
                <div className="container mx-auto px-4">
                    <div className="row">
                        <div className="col-md-12 text-center" data-aos="fade-up">
                            <div className="section-header-one">
                                <h2 className="section-title text-3xl font-bold mb-8">
                                    Gói Đăng Ký
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center align-items-center">
                        {plans
                            .filter((plan) => plan.status === 'ACTIVE')
                            .map((plan) => (
                                <SubscriptionPlanCard key={plan.id} plan={plan} />
                            ))}
                    </div>
                </div>
            </section>
        </MainLayout>
    );
};

export default SubscriptionPlans;
