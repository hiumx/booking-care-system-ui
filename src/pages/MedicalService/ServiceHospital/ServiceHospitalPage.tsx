import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import HospitalCard from './components/HospitalCard/HospitalCard';
import Pagination from './components/Pagination/Pagination';
import HeroSection from './components/HeroSection/HeroSection';
import { replacePathParams, PATHS, buildPath } from '@/routes/paths';
import SearchSection from './components/SearchSection/SearchSection';

// 🔹 Mock data cho danh sách bệnh viện theo chuyên khoa
const hospitalData = {
    idservice: 1,
    title: 'Bệnh Viện',
    specialtyName: 'Chuyên khoa Tiêu hóa',
    specialtyDescription:
        'Chuyên khoa Tiêu hóa cung cấp dịch vụ khám, chẩn đoán và điều trị toàn diện các bệnh lý liên quan đến dạ dày, ruột, gan, mật và tụy, giúp phát hiện sớm, phòng ngừa biến chứng và nâng cao sức khỏe tiêu hóa.',
    data: [
        {
            hospital: {
                id: 1,
                idservice: 1,
                image: '/src/assets/img/doctor-grid/doctor-list-01.jpg',
                rating: 4.8,
                specialty: 'Neurologist',
                specialtyColor: 'text-teal',
                available: true,
                name: 'Bệnh Viện Đa KHoa Đà Nẵng',
                degrees: 'MBBS, DNB - Neurology',
                location: 'Đà Nẵng, Việt Nam',
                languages: ['English', 'French'],
                votes: { positive: 252, total: 287 },
                experience: 20,
                fees: 600,
                nextAvailable: '10:00 AM - 15 Oct, Tue',
            },
        },
        {
            hospital: {
                id: 2,
                idservice: 2,
                image: '/src/assets/img/doctor-grid/doctor-list-02.jpg',
                rating: 4.3,
                specialty: 'Cardiologist',
                specialtyColor: 'text-info',
                available: false,
                name: 'Bệnh Viện Đa KHoa Hà Nội',
                degrees: 'MBBS, MD - Cardiology',
                location: 'Hà Nội, Việt Nam',
                languages: ['English', 'Spanish'],
                votes: { positive: 270, total: 300 },
                experience: 30,
                fees: 450,
                nextAvailable: '11:00 AM - 19 Oct, Sat',
            },
        },
    ],
};

// 🔹 Breadcrumb config sẽ được tạo trong component để sử dụng params

const ServiceHospitalPage: React.FC = () => {
    const { servicesparentId, serviceschildId } = useParams<{
        servicesparentId: string;
        serviceschildId: string;
    }>();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    // 🔹 Breadcrumb config với params
    const breadcrumbData = {
        items: [
            { label: 'Trang chủ', path: '/', isActive: false },
            {
                label: 'Dịch Vụ Y Tế',
                path: replacePathParams(buildPath(PATHS.Service.CATEGORIES), {
                    servicesparentId: servicesparentId!.toString(),
                }),
                isActive: false,
            },
            { label: hospitalData.specialtyName, isActive: true },
        ],
        title: 'Danh Sách Bệnh Viện Đăng Kí Dịch Vụ ' + hospitalData.specialtyName,
    };

    // Tính toán phân trang
    const totalPages = Math.ceil(hospitalData.data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentHospitals = hospitalData.data.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
            <HeroSection
                title={hospitalData.specialtyName}
                description={hospitalData.specialtyDescription}
            />
            <SearchSection />
            <div className={'content'}>
                <div className={'container'}>
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <div className="mb-4">
                                <h3>
                                    Showing{' '}
                                    <span className="text-secondary">
                                        {hospitalData.data.length}
                                    </span>{' '}
                                    Hospitals For You
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {currentHospitals.map((hospital) => (
                            <HospitalCard
                                key={hospital.hospital.id}
                                name={hospital.hospital.name}
                                location={hospital.hospital.location}
                                fees={hospital.hospital.fees}
                                rating={hospital.hospital.rating}
                                image={hospital.hospital.image}
                                nextAvailable={hospital.hospital.nextAvailable}
                                degrees={hospital.hospital.degrees}
                                languages={hospital.hospital.languages}
                                votes={hospital.hospital.votes}
                                experience={hospital.hospital.experience}
                                available={hospital.hospital.available}
                                linkDetail={replacePathParams(PATHS.Service.DETAIL, {
                                    servicesparentId: servicesparentId!.toString(),
                                    serviceschildId: serviceschildId!.toString(),
                                    servicesId: hospital.hospital.idservice,
                                })}
                                linkBooking={replacePathParams(PATHS.BOOKING.ROOT, {
                                    doctorId: hospital.hospital.idservice,
                                })}
                                linkProfileHospital={replacePathParams(PATHS.HOSPITAL.DETAIL, {
                                    id: hospital.hospital.id,
                                })}
                            />
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default ServiceHospitalPage;
