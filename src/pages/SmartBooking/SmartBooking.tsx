import React, { useState } from 'react';
import { TabType, SearchResults, Doctor, Hospital, Service } from '@/types/booking';
import SearchBox from './components/SearchBox';
import TabNavigation from './components/TabNavigation';
import DoctorCard from './components/DoctorCard';
import HospitalCard from './components/HospitalCard';
import ServiceCard from './components/ServiceCard';
import EmptyState from './components/EmptyState';
import { Brain, CalendarCheck, Sparkles, Stethoscope, ShieldCheck } from 'lucide-react';
import styles from './SmartBooking.module.scss';
import { motion } from 'framer-motion';

// Mock data
const mockDoctors: Doctor[] = [
    {
        id: '1',
        name: 'BS. Nguyễn Văn Minh',
        avatar: '/src/assets/img/doctors/doctor-01.jpg',
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
        avatar: '/src/assets/img/doctors/doctor-02.jpg',
        specialty: 'Nội khoa tổng hợp',
        experience: 12,
        rating: 4.9,
        reviewCount: 156,
        location: 'Bệnh viện Bạch Mai',
        consultationFee: 250000,
        availableToday: false,
    },
    {
        id: '3',
        name: 'BS. Lê Văn Hùng',
        avatar: '/src/assets/img/doctors/doctor-03.jpg',
        specialty: 'Tim mạch',
        experience: 18,
        rating: 4.7,
        reviewCount: 312,
        location: 'Bệnh viện Việt Đức',
        consultationFee: 350000,
        availableToday: true,
    },
    {
        id: '4',
        name: 'TS.BS Phạm Thị Mai',
        avatar: '/src/assets/img/doctors/doctor-04.jpg',
        specialty: 'Sản phụ khoa',
        experience: 14,
        rating: 4.9,
        reviewCount: 189,
        location: 'Bệnh viện Phụ sản Trung ương',
        consultationFee: 280000,
        availableToday: true,
    },
    {
        id: '5',
        name: 'BS. Hoàng Văn Đức',
        avatar: '/src/assets/img/doctors/doctor-05.jpg',
        specialty: 'Ngoại khoa',
        experience: 20,
        rating: 4.6,
        reviewCount: 267,
        location: 'Bệnh viện Chợ Rẫy',
        consultationFee: 400000,
        availableToday: false,
    },
    {
        id: '6',
        name: 'BS. Nguyễn Thị Hoa',
        avatar: '/src/assets/img/doctors/doctor-06.jpg',
        specialty: 'Nhi khoa',
        experience: 16,
        rating: 4.8,
        reviewCount: 198,
        location: 'Bệnh viện Nhi Trung ương',
        consultationFee: 220000,
        availableToday: true,
    },
    {
        id: '7',
        name: 'TS.BS Vũ Văn Nam',
        avatar: '/src/assets/img/doctors/doctor-07.jpg',
        specialty: 'Da liễu',
        experience: 13,
        rating: 4.7,
        reviewCount: 145,
        location: 'Bệnh viện Da liễu Trung ương',
        consultationFee: 180000,
        availableToday: true,
    },
    {
        id: '8',
        name: 'BS. Đặng Thị Linh',
        avatar: '/src/assets/img/doctors/doctor-08.jpg',
        specialty: 'Mắt',
        experience: 11,
        rating: 4.5,
        reviewCount: 123,
        location: 'Bệnh viện Mắt Trung ương',
        consultationFee: 200000,
        availableToday: false,
    },
    {
        id: '9',
        name: 'BS. Trần Văn Quang',
        avatar: '/src/assets/img/doctors/doctor-09.jpg',
        specialty: 'Tai mũi họng',
        experience: 17,
        rating: 4.8,
        reviewCount: 176,
        location: 'Bệnh viện Tai mũi họng Trung ương',
        consultationFee: 240000,
        availableToday: true,
    },
    {
        id: '10',
        name: 'TS.BS Lê Thị Thu',
        avatar: '/src/assets/img/doctors/doctor-11.jpg',
        specialty: 'Tâm thần',
        experience: 19,
        rating: 4.9,
        reviewCount: 201,
        location: 'Bệnh viện Tâm thần Trung ương',
        consultationFee: 320000,
        availableToday: true,
    },
];

const mockHospitals: Hospital[] = [
    {
        id: '1',
        name: 'Bệnh viện Đại học Y Hà Nội',
        logo: '/src/assets/img/clinic/clinic-7.jpg',
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
        logo: '/src/assets/img/clinic/clinic-10.jpg',
        address: '78 Giải Phóng, Đống Đa, Hà Nội',
        rating: 4.6,
        reviewCount: 1234,
        distance: '2.8 km',
        specialties: ['Nội khoa', 'Ngoại khoa', 'Sản phụ khoa'],
        emergency: true,
    },
    {
        id: '3',
        name: 'Bệnh viện Việt Đức',
        logo: '/src/assets/img/clinic/clinic-11.jpg',
        address: '40 Tràng Thi, Hoàn Kiếm, Hà Nội',
        rating: 4.8,
        reviewCount: 756,
        distance: '3.1 km',
        specialties: ['Tim mạch', 'Ngoại khoa', 'Ung bướu'],
        emergency: true,
    },
    {
        id: '4',
        name: 'Bệnh viện Phụ sản Trung ương',
        logo: '/src/assets/img/clinic/clinic-12.jpg',
        address: '43 Tràng Thi, Hoàn Kiếm, Hà Nội',
        rating: 4.5,
        reviewCount: 634,
        distance: '2.9 km',
        specialties: ['Sản phụ khoa', 'Nhi khoa', 'Sinh sản'],
        emergency: false,
    },
    {
        id: '5',
        name: 'Bệnh viện Chợ Rẫy',
        logo: '/src/assets/img/clinic/clinic-7.jpg',
        address: '201B Nguyễn Chí Thanh, Quận 5, TP.HCM',
        rating: 4.9,
        reviewCount: 1456,
        distance: '4.2 km',
        specialties: ['Ngoại khoa', 'Tim mạch', 'Ung bướu', 'Nội khoa'],
        emergency: true,
    },
    {
        id: '6',
        name: 'Bệnh viện Nhi Trung ương',
        logo: '/src/assets/img/clinic/clinic-10.jpg',
        address: '18/879 La Thành, Đống Đa, Hà Nội',
        rating: 4.7,
        reviewCount: 523,
        distance: '1.8 km',
        specialties: ['Nhi khoa', 'Sản phụ khoa', 'Tim mạch nhi'],
        emergency: true,
    },
    {
        id: '7',
        name: 'Bệnh viện Da liễu Trung ương',
        logo: '/src/assets/img/clinic/clinic-10.jpg',
        address: '15A Phương Mai, Đống Đa, Hà Nội',
        rating: 4.4,
        reviewCount: 387,
        distance: '2.3 km',
        specialties: ['Da liễu', 'Thẩm mỹ', 'Dị ứng'],
        emergency: false,
    },
    {
        id: '8',
        name: 'Bệnh viện Mắt Trung ương',
        logo: '/src/assets/img/clinic/clinic-11.jpg',
        address: '85 Bà Triệu, Hai Bà Trưng, Hà Nội',
        rating: 4.6,
        reviewCount: 298,
        distance: '3.5 km',
        specialties: ['Mắt', 'Phẫu thuật mắt', 'Khúc xạ'],
        emergency: false,
    },
    {
        id: '9',
        name: 'Bệnh viện Tai mũi họng Trung ương',
        logo: '/src/assets/img/clinic/clinic-12.jpg',
        address: '78 Giải Phóng, Đống Đa, Hà Nội',
        rating: 4.5,
        reviewCount: 412,
        distance: '2.7 km',
        specialties: ['Tai mũi họng', 'Phẫu thuật TMH', 'Thính học'],
        emergency: false,
    },
    {
        id: '10',
        name: 'Bệnh viện Tâm thần Trung ương',
        logo: '/src/assets/img/clinic/clinic-10.jpg',
        address: '78 Giải Phóng, Đống Đa, Hà Nội',
        rating: 4.3,
        reviewCount: 156,
        distance: '4.1 km',
        specialties: ['Tâm thần', 'Tâm lý', 'Nghiện chất'],
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
    const [activeTab, setActiveTab] = useState<TabType>('all');
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

        const searchTerm = symptoms.toLowerCase().trim();
        if (searchTerm.length < 2) {
            setSearchResults({
                doctors: mockDoctors,
                hospitals: mockHospitals,
                services: mockServices,
            });
            setIsLoading(false);
            return;
        }

        const searchWords = searchTerm.split(/\s+/).filter(Boolean);

        const filteredDoctors = mockDoctors.filter((d) =>
            searchWords.some((word) =>
                `${d.name} ${d.specialty} ${d.location}`.toLowerCase().includes(word)
            )
        );

        const filteredHospitals = mockHospitals.filter((h) =>
            searchWords.some((word) =>
                `${h.name} ${h.address} ${h.specialties.join(' ')}`.toLowerCase().includes(word)
            )
        );

        const filteredServices = mockServices.filter((s) =>
            searchWords.some((word) =>
                `${s.name} ${s.description} ${s.category}`.toLowerCase().includes(word)
            )
        );

        setSearchResults({
            doctors: filteredDoctors,
            hospitals: filteredHospitals,
            services: filteredServices,
        });
        setIsLoading(false);
    };

    const handleBookAppointment = (_id: string, _type: 'doctor' | 'hospital' | 'service') => {};

    const getResultCounts = () => ({
        doctors: searchResults.doctors.length,
        hospitals: searchResults.hospitals.length,
        services: searchResults.services.length,
    });

    const getAllResults = () => {
        const allResults: Array<{
            id: string;
            type: 'doctor' | 'hospital' | 'service';
            data: Doctor | Hospital | Service;
        }> = [];
        searchResults.doctors.forEach((d) =>
            allResults.push({ id: d.id, type: 'doctor', data: d })
        );
        searchResults.hospitals.forEach((h) =>
            allResults.push({ id: h.id, type: 'hospital', data: h })
        );
        searchResults.services.forEach((s) =>
            allResults.push({ id: s.id, type: 'service', data: s })
        );
        return allResults;
    };

    return (
        <div className={styles.smartBooking}>
            <div className={styles.searchContainer}>
                {/* Header */}
                <div className={styles.headerSection}>
                    <motion.div
                        className={styles.headerWrapper}
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <motion.div
                            className={styles.headerIcon}
                            initial={{ scale: 0.7, rotate: -15 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                        >
                            <Brain size={40} className={styles.headerBrain} />
                        </motion.div>

                        <div className={styles.headerTitle}>
                            <h1>Đặt lịch thông minh theo triệu chứng</h1>
                        </div>
                    </motion.div>

                    {/* Features */}
                    <div className={styles.featuresRow}>
                        {[
                            {
                                icon: <Stethoscope size={22} />,
                                text: 'Hơn 500+ bác sĩ chuyên khoa',
                            },
                            { icon: <Sparkles size={22} />, text: 'AI gợi ý theo triệu chứng' },
                            { icon: <CalendarCheck size={22} />, text: 'Đặt lịch 24/7 dễ dàng' },
                            {
                                icon: <ShieldCheck size={22} />,
                                text: 'Thông tin & bảo mật an toàn',
                            },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                className={styles.featureItem}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 + i * 0.2 }}
                            >
                                <div className={styles.featureBox}>
                                    <span className={styles.featureIcon}>{feature.icon}</span>
                                    <span className={styles.featureText}>{feature.text}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Search Box */}
                <SearchBox
                    symptoms={symptoms}
                    onSymptomsChange={setSymptoms}
                    onSearch={handleSearch}
                    isLoading={isLoading}
                />

                {/* Loading */}
                {isLoading && (
                    <div className={styles.loadingWrapper}>
                        <div className={styles.spinner} />
                    </div>
                )}

                {/* Tabs */}
                {hasSearched && !isLoading && (
                    <TabNavigation
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        resultCounts={getResultCounts()}
                    />
                )}

                {/* Results */}
                {!isLoading && (
                    <div className={styles.resultsWrapper}>
                        {activeTab === 'all' ? (
                            getAllResults().length > 0 ? (
                                <div className={styles.cardGrid}>
                                    {getAllResults().map((item) => (
                                        <div
                                            key={`${item.type}-${item.id}`}
                                            className={styles.cardCol}
                                        >
                                            {item.type === 'doctor' && (
                                                <DoctorCard
                                                    image={(item.data as Doctor).avatar}
                                                    name={(item.data as Doctor).name}
                                                    specialty={(item.data as Doctor).specialty}
                                                    location={(item.data as Doctor).location}
                                                    rating={(item.data as Doctor).rating}
                                                    available={(item.data as Doctor).availableToday}
                                                    fee={(item.data as Doctor).consultationFee}
                                                    consultationTime="45 phút"
                                                    profileLink={`/doctor/${(item.data as Doctor).id}`}
                                                    bookingLink={`/booking/doctor/${(item.data as Doctor).id}`}
                                                    specialtiesLink={`/specialty/${(item.data as Doctor).specialty}`}
                                                />
                                            )}
                                            {item.type === 'hospital' && (
                                                <HospitalCard
                                                    clinic={{
                                                        id: (item.data as Hospital).id,
                                                        name: (item.data as Hospital).name,
                                                        image: (item.data as Hospital).logo,
                                                        rating: (item.data as Hospital).rating,
                                                        reviewCount: (item.data as Hospital)
                                                            .reviewCount,
                                                        specialties: (item.data as Hospital)
                                                            .specialties,
                                                        location: (item.data as Hospital).address,
                                                        distance: (item.data as Hospital).distance,
                                                        priceRange: '200.000đ - 500.000đ',
                                                        availableSlots: 5,
                                                    }}
                                                />
                                            )}
                                            {item.type === 'service' && (
                                                <ServiceCard
                                                    service={item.data as Service}
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
                            )
                        ) : searchResults[activeTab].length > 0 ? (
                            <div className={styles.cardGrid}>
                                {searchResults[activeTab].map((item) => (
                                    <div key={item.id} className={styles.cardCol}>
                                        {activeTab === 'doctors' && (
                                            <DoctorCard
                                                image={(item as Doctor).avatar}
                                                name={(item as Doctor).name}
                                                specialty={(item as Doctor).specialty}
                                                location={(item as Doctor).location}
                                                rating={(item as Doctor).rating}
                                                available={(item as Doctor).availableToday}
                                                fee={(item as Doctor).consultationFee}
                                                consultationTime="45 phút"
                                                profileLink={`/doctor/${(item as Doctor).id}`}
                                                bookingLink={`/booking/doctor/${(item as Doctor).id}`}
                                                specialtiesLink={`/specialty/${(item as Doctor).specialty}`}
                                            />
                                        )}
                                        {activeTab === 'hospitals' && (
                                            <HospitalCard
                                                clinic={{
                                                    id: (item as Hospital).id,
                                                    name: (item as Hospital).name,
                                                    image: (item as Hospital).logo,
                                                    rating: (item as Hospital).rating,
                                                    reviewCount: (item as Hospital).reviewCount,
                                                    specialties: (item as Hospital).specialties,
                                                    location: (item as Hospital).address,
                                                    distance: (item as Hospital).distance,
                                                    priceRange: '200.000đ - 500.000đ',
                                                    availableSlots: 5,
                                                }}
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
                )}
            </div>
        </div>
    );
};

export default SmartBooking;
