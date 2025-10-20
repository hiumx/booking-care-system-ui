import React, { useState } from 'react';
import clsx from 'clsx';
import { TabType, SearchResults, Doctor, Hospital, Service } from '@/types/booking';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import SearchBox from './components/SearchBox';
import TabNavigation from './components/TabNavigation';
import DoctorCard from '@/components/DoctorCard';
import HospitalCard, { HospitalCardSkeleton } from '@/components/HospitalCard';
import ServiceCard from '@/components/ServiceCard';
import EmptyState from './components/EmptyState';
import { Brain, CalendarCheck, Sparkles, Stethoscope, ShieldCheck } from 'lucide-react';
import styles from './SmartBooking.module.scss';
import { motion } from 'framer-motion';
import { mockDoctors, mockHospitals, mockServices } from './smart-booking.mock';

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

    // removed All tab aggregate helper

    // Breadcrumb data
    const breadcrumbData = {
        items: [
            { label: 'Home', path: '/', isActive: false },
            { label: 'Hỗ trợ đặt lịch', isActive: true },
        ],
        title: 'Hỗ trợ đặt lịch',
    };

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
            <div className={clsx('smart-booking-content')}>
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
                                    {
                                        icon: <Sparkles size={22} />,
                                        text: 'AI gợi ý theo triệu chứng',
                                    },
                                    {
                                        icon: <CalendarCheck size={22} />,
                                        text: 'Đặt lịch 24/7 dễ dàng',
                                    },
                                    {
                                        icon: <ShieldCheck size={22} />,
                                        text: 'Thông tin & bảo mật an toàn',
                                    },
                                ].map((feature, i) => (
                                    <motion.div
                                        key={feature.text}
                                        className={styles.featureItem}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 + i * 0.2 }}
                                    >
                                        <div className={styles.featureBox}>
                                            <span className={styles.featureIcon}>
                                                {feature.icon}
                                            </span>
                                            <span className={styles.featureText}>
                                                {feature.text}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Search Box */}
                        <div className={styles.content90}>
                            <SearchBox
                                symptoms={symptoms}
                                onSymptomsChange={setSymptoms}
                                onSearch={handleSearch}
                                isLoading={isLoading}
                            />
                        </div>

                        {/* Loading */}
                        {isLoading && (
                            <div className={styles.content90}>
                                <div
                                    className={`${styles.cardGrid} ${activeTab === 'services' ? styles.services : ''}`}
                                >
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <div key={`skeleton-${index}`} className={styles.cardCol}>
                                            {activeTab === 'hospitals' ? (
                                                <HospitalCardSkeleton />
                                            ) : (
                                                <div className={styles.skeletonCard}>
                                                    <div className={styles.skeletonImage} />
                                                    <div className={styles.skeletonContent}>
                                                        <div className={styles.skeletonTitle} />
                                                        <div className={styles.skeletonSubtitle} />
                                                        <div className={styles.skeletonText} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tabs */}
                        {hasSearched && (
                            <div className={styles.content90}>
                                <TabNavigation
                                    activeTab={activeTab}
                                    onTabChange={setActiveTab}
                                    resultCounts={getResultCounts()}
                                />
                            </div>
                        )}

                        {/* Results */}
                        {!isLoading && (
                            <div className={`${styles.resultsWrapper} ${styles.content90}`}>
                                {searchResults[activeTab].length > 0 ? (
                                    <div
                                        className={`${styles.cardGrid} ${activeTab === 'services' ? styles.services : ''}`}
                                    >
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
                                                            specialties: (item as Hospital)
                                                                .specialties,
                                                            location: (item as Hospital).address,
                                                            distance: (item as Hospital).distance,
                                                            specialtyCount:
                                                                (item as Hospital).specialties
                                                                    ?.length || 0,
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
            </div>
        </MainLayout>
    );
};

export default SmartBooking;
