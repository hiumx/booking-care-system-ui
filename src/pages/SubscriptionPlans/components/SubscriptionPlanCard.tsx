import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from './SubscriptionPlanCard.module.scss';

import priceIcon1 from '@/assets/img/icons/price-icon1.svg';
import priceIcon2 from '@/assets/img/icons/price-icon2.svg';
import priceIcon3 from '@/assets/img/icons/price-icon3.svg';

interface SubscriptionPlan {
    id: number;
    name: string;
    prices: { [key: string]: number };
    billing_cycles: ('MONTHLY' | 'QUARTERLY' | 'YEARLY')[];
    features: string[];
    status: 'ACTIVE' | 'INACTIVE';
    isPopular?: boolean;
}

interface SubscriptionPlanCardProps {
    plan: SubscriptionPlan;
}

const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({ plan }) => {
    const iconMap: { [key: string]: string } = {
        Basic: priceIcon1,
        Advanced: priceIcon2,
        Premium: priceIcon3,
    };

    const getBillingCycleText = (cycle: string) => {
        switch (cycle) {
            case 'MONTHLY':
                return 'tháng';
            case 'QUARTERLY':
                return 'quý';
            case 'YEARLY':
                return 'năm';
            default:
                return cycle;
        }
    };

    return (
        <div className="col-lg-4 col-sm-12" data-aos="fade-up">
            <div className={clsx(styles.card, 'card pricing-card', { active: plan.isPopular })}>
                <div className={clsx(styles.cardBody, 'card-body')}>
                    <div className="pricing-header">
                        <div className="pricing-header-info flex items-center">
                            <div className="pricing-icon">
                                <span>
                                    <img src={iconMap[plan.name] || priceIcon1} alt="biểu tượng" />
                                </span>
                            </div>
                            <div className="pricing-title">
                                <h4>
                                    {plan.name === 'Basic'
                                        ? 'Cơ bản'
                                        : plan.name === 'Advanced'
                                          ? 'Nâng cao'
                                          : 'Chuyên nghiệp'}
                                </h4>
                            </div>
                        </div>
                        {plan.isPopular && (
                            <div>
                                <span className="badge bg-green-500 text-white px-2 py-1 rounded">
                                    Phổ biến
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="pricing-info">
                        <div className="pricing-amount">
                            <h2>
                                {plan.billing_cycles.map((cycle) => (
                                    <div key={cycle}>
                                        {plan.prices[cycle]} triệu VNĐ{' '}
                                        <span>/{getBillingCycleText(cycle)}</span>
                                    </div>
                                ))}
                            </h2>
                            <h6>Những gì được bao gồm</h6>
                        </div>

                        <div className="pricing-list">
                            <ul className="list-disc pl-5">
                                {plan.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="pricing-btn">
                            <Link
                                to="/dang-nhap-email"
                                className={clsx(
                                    'btn btn-primary px-4 py-2 rounded-md text-white',
                                    'bg-blue-600 hover:bg-blue-700'
                                )}
                            >
                                Chọn Gói
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPlanCard;
