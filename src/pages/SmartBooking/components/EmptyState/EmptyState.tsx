import React from 'react';
import { Search, Sparkles } from 'lucide-react';
import { TabType } from '@/types/booking';
import styles from './EmptyState.module.scss';

interface EmptyStateProps {
    activeTab: TabType;
    hasSearched: boolean;
    onAIAssist: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ activeTab, hasSearched, onAIAssist }) => {
    const getTabLabel = (tab: TabType) => {
        switch (tab) {
            case 'doctors':
                return 'bác sĩ';
            case 'hospitals':
                return 'bệnh viện';
            case 'services':
                return 'dịch vụ y tế';
            default:
                return 'kết quả';
        }
    };

    if (!hasSearched) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.iconWrapperPrimary}>
                    <Search size={48} className={styles.iconPrimary} />
                </div>
                <h3 className={styles.title}>Tìm kiếm thông minh theo triệu chứng</h3>
                <p className={styles.description}>
                    Mô tả triệu chứng của bạn và để AI giúp tìm bác sĩ, bệnh viện và dịch vụ y tế
                    phù hợp nhất.
                </p>
            </div>
        );
    }

    return (
        <div className={styles.emptyState}>
            <div className={styles.iconWrapperSecondary}>
                <Search size={48} className={styles.iconSecondary} />
            </div>
            <h3 className={styles.title}>Không tìm thấy {getTabLabel(activeTab)}</h3>
            <p className={styles.description}>
                Thử mô tả triệu chứng chi tiết hơn hoặc sử dụng AI để gợi ý từ khóa phù hợp.
            </p>
            <button onClick={onAIAssist} className={styles.aiButton}>
                <Sparkles size={20} className="me-2" />
                <span>Gợi ý AI</span>
            </button>
        </div>
    );
};

export default EmptyState;
