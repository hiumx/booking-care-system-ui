import React from 'react';
import { Search, Sparkles } from 'lucide-react';
import { TabType } from '../types/booking';

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
            <div className="text-center py-5">
                <div
                    className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                        width: '96px',
                        height: '96px',
                        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                    }}
                >
                    <Search size={48} className="text-primary" />
                </div>
                <h3 className="h4 fw-semibold text-dark mb-3">
                    Tìm kiếm thông minh theo triệu chứng
                </h3>
                <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '400px' }}>
                    Mô tả triệu chứng của bạn và để AI giúp tìm bác sĩ, bệnh viện và dịch vụ y tế
                    phù hợp nhất.
                </p>
                <button
                    onClick={onAIAssist}
                    className="btn btn-primary px-4 py-3 fw-semibold rounded-pill d-flex align-items-center mx-auto"
                    style={{
                        transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.backgroundColor = '#0b5ed7';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.backgroundColor = '#0d6efd';
                    }}
                >
                    <Sparkles size={20} className="me-2" />
                    <span>Thử gợi ý AI</span>
                </button>
            </div>
        );
    }

    return (
        <div className="text-center py-5">
            <div
                className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle"
                style={{
                    width: '96px',
                    height: '96px',
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                }}
            >
                <Search size={48} className="text-muted" />
            </div>
            <h3 className="h4 fw-semibold text-dark mb-3">
                Không tìm thấy {getTabLabel(activeTab)}
            </h3>
            <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '400px' }}>
                Thử mô tả triệu chứng chi tiết hơn hoặc sử dụng AI để gợi ý từ khóa phù hợp.
            </p>
            <button
                onClick={onAIAssist}
                className="btn btn-outline-primary px-4 py-3 fw-semibold rounded-pill d-flex align-items-center mx-auto"
                style={{
                    transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e3f2fd';
                    e.currentTarget.style.borderColor = '#0d6efd';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#0d6efd';
                }}
            >
                <Sparkles size={20} className="me-2" />
                <span>Gợi ý AI</span>
            </button>
        </div>
    );
};

export default EmptyState;
