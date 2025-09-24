import React, { useState } from 'react';
import { TabType, SearchResults, Doctor, Hospital, Service } from './components/types/booking';
import SearchBox from './components/SearchBox';
import TabNavigation from './components/TabNavigation';
import DoctorCard from './components/DoctorCard';
import HospitalCard from './components/HospitalCard';
import ServiceCard from './components/ServiceCard';
import EmptyState from './components/EmptyState';
import { Brain } from 'lucide-react';
import styles from './SmartBooking.module.scss';

// Mock data
const mockDoctors: Doctor[] = [
    {
        id: '1',
        name: 'BS. Nguyễn Văn Minh',
        avatar: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        specialty: 'Thần kinh học',
        experience: 15,
        rating: 4.8,
        reviewCount: 234,
        location: 'Bệnh viện Đại học Y Hà Nội',
        consultationFee: 300000,
        availableToday: true,
    },
    {
        id: '2',
        name: 'TS.BS Trần Thị Lan',
        avatar: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        specialty: 'Nội khoa tổng hợp',
        experience: 12,
        rating: 4.9,
        reviewCount: 156,
        location: 'Bệnh viện Bạch Mai',
        consultationFee: 250000,
        availableToday: false,
    },
];

const mockHospitals: Hospital[] = [
    {
        id: '1',
        name: 'Bệnh viện Đại học Y Hà Nội',
        logo: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        address: '1 Tôn Thất Tùng, Đống Đa, Hà Nội',
        rating: 4.7,
        reviewCount: 892,
        distance: '1.2 km',
        specialties: ['Thần kinh', 'Tim mạch', 'Nội khoa', 'Ngoại khoa'],
        emergency: true,
    },
    {
        id: '2',
        name: 'Bệnh viện Bạch Mai',
        logo: 'https://images.pexels.com/photos/668300/pexels-photo-668300.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        address: '78 Giải Phóng, Đống Đa, Hà Nội',
        rating: 4.6,
        reviewCount: 1234,
        distance: '2.8 km',
        specialties: ['Nội khoa', 'Ngoại khoa', 'Sản phụ khoa'],
        emergency: true,
    },
];

const mockServices: Service[] = [
    {
        id: '1',
        name: 'Khám thần kinh tổng hợp',
        description:
            'Khám và đánh giá toàn diện các vấn đề về thần kinh, bao gồm đau đầu, chóng mặt, rối loạn giấc ngủ',
        price: '200.000đ - 500.000đ',
        duration: '45 phút',
        category: 'Thần kinh',
        availability: 'Hôm nay',
    },
    {
        id: '2',
        name: 'Xét nghiệm máu tổng quát',
        description: 'Xét nghiệm máu cơ bản để kiểm tra tình trạng sức khỏe tổng quát',
        price: '150.000đ - 300.000đ',
        duration: '15 phút',
        category: 'Xét nghiệm',
        availability: 'Trong tuần',
    },
];

const SmartBooking: React.FC = () => {
    const [symptoms, setSymptoms] = useState('');
    const [activeTab, setActiveTab] = useState<TabType>('doctors');
    const [searchResults, setSearchResults] = useState<SearchResults>({
        doctors: [],
        hospitals: [],
        services: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (!symptoms.trim()) return;

        setIsLoading(true);
        setHasSearched(true);

        await new Promise((resolve) => setTimeout(resolve, 600));
        const results: SearchResults = {
            doctors: mockDoctors,
            hospitals: mockHospitals,
            services: mockServices,
        };

        setSearchResults(results);
        setIsLoading(false);
    };

    // Bỏ logic sắp xếp theo yêu cầu

    // Đã bỏ filters/location, loại bỏ các handler dư thừa

    const handleBookAppointment = (_id: string, _type: 'doctor' | 'hospital' | 'service') => {
        // Bỏ booking flow: không làm gì
    };

    const getResultCounts = () => ({
        doctors: searchResults.doctors.length,
        hospitals: searchResults.hospitals.length,
        services: searchResults.services.length,
    });

    // Bỏ getCurrentResults (không còn dùng)

    // renderContent không còn dùng -> loại bỏ

    return (
        <div
            className={`min-vh-100 py-5 px-3 ${styles.smartBooking}`}
            style={{
                background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 50%, #e3f2fd 100%)',
            }}
        >
            <div
                className={`container-fluid ${styles.searchContainer}`}
                style={{ maxWidth: '1400px' }}
            >
                {/* Header */}
                <div className={`text-center mb-5 ${styles.headerSection}`}>
                    <div className="d-flex align-items-center justify-content-center mb-4">
                        <div
                            className={`d-flex align-items-center justify-content-center rounded-circle me-3 ${styles.headerIcon}`}
                            style={{
                                width: '64px',
                                height: '64px',
                                background: 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)',
                            }}
                            role="img"
                            aria-label="AI Brain Icon"
                        >
                            <Brain size={32} className="text-white" />
                        </div>
                        <div className="text-start">
                            <h1 className="display-4 fw-bold text-dark mb-2">
                                Đặt lịch thông minh theo triệu chứng
                            </h1>
                            <p className="lead text-muted mb-0" style={{ maxWidth: '600px' }}>
                                Mô tả triệu chứng của bạn và để AI tìm bác sĩ, bệnh viện, dịch vụ y
                                tế phù hợp nhất
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search Box */}
                <SearchBox
                    symptoms={symptoms}
                    onSymptomsChange={setSymptoms}
                    onSearch={handleSearch}
                    isLoading={isLoading}
                />

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status" />
                    </div>
                )}

                {/* Bỏ AI Insights */}

                {/* Tab Navigation */}
                {hasSearched && !isLoading && (
                    <TabNavigation
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        resultCounts={getResultCounts()}
                    />
                )}

                {/* Bỏ header sắp xếp */}

                {/* Results */}
                {!isLoading && (
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-10">
                            {searchResults[activeTab].length > 0 ? (
                                <div
                                    className={`row g-4 ${styles.cardGrid}`}
                                    role="region"
                                    aria-label={`${searchResults[activeTab].length} kết quả tìm thấy cho ${activeTab}`}
                                >
                                    {searchResults[activeTab].map((item) => (
                                        <div key={item.id} className="col-12 col-md-6 col-lg-4">
                                            {activeTab === 'doctors' && (
                                                <DoctorCard
                                                    doctor={item as Doctor}
                                                    onBookAppointment={(id) =>
                                                        handleBookAppointment(id, 'doctor')
                                                    }
                                                />
                                            )}
                                            {activeTab === 'hospitals' && (
                                                <HospitalCard
                                                    hospital={item as Hospital}
                                                    onViewDetails={(id) =>
                                                        console.log('View details:', id)
                                                    }
                                                    onBookAppointment={(id) =>
                                                        handleBookAppointment(id, 'hospital')
                                                    }
                                                />
                                            )}
                                            {activeTab === 'services' && (
                                                <ServiceCard
                                                    service={item as Service}
                                                    onBookService={(id) =>
                                                        handleBookAppointment(id, 'service')
                                                    }
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    activeTab={activeTab}
                                    hasSearched={hasSearched}
                                    onAIAssist={() => {}}
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* Bỏ lịch sử tìm kiếm */}
            </div>
        </div>
    );
};

export default SmartBooking;
