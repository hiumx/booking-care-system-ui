import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import HospitalCard from './components/HospitalCard/HospitalCard';
import Pagination from './components/Pagination/Pagination';
import HeroSection from './components/HeroSection/HeroSection';
import { replacePathParams, PATHS, buildPath } from '@/routes/paths';
import SearchSection from './components/SearchSection/SearchSection';
import { getServicesWithHospitalAsync } from '@/store/slices/medicalServiceSlice';

// 🔹 Mock data fallback
const mockHospitalData = {
    specialtyName: 'Chuyên khoa Tiêu hóa',
    specialtyDescription:
        'Chuyên khoa Tiêu hóa cung cấp dịch vụ khám, chẩn đoán và điều trị toàn diện các bệnh lý liên quan đến dạ dày, ruột, gan, mật và tụy, giúp phát hiện sớm, phòng ngừa biến chứng và nâng cao sức khỏe tiêu hóa.',
    data: [],
};

const ServiceHospitalPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { servicesparentId, serviceschildId } = useParams<{
        servicesparentId: string;
        serviceschildId: string;
    }>();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    // Redux selectors
    const servicesData = useAppSelector(
        (state) => state.medicalService.serviceCategories.servicesWithHospital
    );
    const isLoading = useAppSelector((state) => state.medicalService.serviceCategories.isLoading);
    const error = useAppSelector((state) => state.medicalService.serviceCategories.error);

    // Fetch services data
    useEffect(() => {
        if (serviceschildId) {
            dispatch(
                getServicesWithHospitalAsync({
                    categoryId: serviceschildId,
                    params: {
                        page: currentPage,
                        pageSize: itemsPerPage,
                        includeInactive: false,
                    },
                })
            );
        }
    }, [dispatch, serviceschildId, currentPage, itemsPerPage]);

    // Use API data or fallback to mock data
    const hospitalData = servicesData
        ? {
              specialtyName: servicesData.serviceCategoryName,
              specialtyDescription: servicesData.serviceCategoryDescription,
              data: servicesData.services.map((service) => ({
                  hospital: {
                      id: service.hospital.id,
                      idservice: service.id,
                      image: service.imageUrl,
                      rating: 4.5, // Default rating since not in API
                      specialty: service.name,
                      available: service.status === ('ACTIVE' as any),
                      name: service.hospital.name,
                      location: service.hospital.address,
                      votes: { positive: 250, total: 300 }, // Default votes
                      experience: service.durationTime,
                      fees: service.price,
                      nextAvailable: '10:00 AM - 15 Oct, Tue', // Default time
                  },
              })),
          }
        : mockHospitalData;

    // 🔹 Breadcrumb config với params
    const breadcrumbData = {
        items: [
            { label: 'Trang chủ', path: '/', isActive: false },
            {
                label: 'Dịch Vụ Y Tế',
                path: replacePathParams(buildPath(PATHS.Service.ROOT), {}),
                isActive: false,
            },
            {
                label: servicesData?.parentCategoryName || 'Chuyên Khoa',
                path: replacePathParams(PATHS.Service.CATEGORIES, {
                    servicesparentId: servicesparentId!.toString(),
                }),
                isActive: false,
            },
            { label: hospitalData.specialtyName, isActive: true },
        ],
        title: 'Danh Sách Bệnh Viện Đăng Kí Dịch Vụ ' + hospitalData.specialtyName,
    };

    // Tính toán phân trang
    const totalPages =
        servicesData?.totalPages || Math.ceil(hospitalData.data.length / itemsPerPage);
    const currentHospitals = hospitalData.data;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Show loading state
    if (isLoading) {
        return (
            <MainLayout>
                <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
                <HeroSection
                    title={hospitalData.specialtyName}
                    description={hospitalData.specialtyDescription}
                />
                <SearchSection />
                <div className="content">
                    <div className="container">
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{ minHeight: '400px' }}
                        >
                            <div className="spinner-border text-primary">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    // Show error state
    if (error) {
        return (
            <MainLayout>
                <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />
                <HeroSection
                    title={hospitalData.specialtyName}
                    description={hospitalData.specialtyDescription}
                />
                <SearchSection />
                <div className="content">
                    <div className="container">
                        <div className="alert alert-danger" role="alert">
                            <h4 className="alert-heading">Lỗi!</h4>
                            <p>{error}</p>
                            <hr />
                            <button
                                className="btn btn-outline-danger"
                                onClick={() => globalThis.location.reload()}
                            >
                                Thử lại
                            </button>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

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
                                        {servicesData?.totalServices || hospitalData.data.length}
                                    </span>{' '}
                                    Services For You
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {currentHospitals.map((hospital) => (
                            <HospitalCard
                                key={hospital.hospital.id}
                                name={hospital.hospital.specialty} // Service name
                                location={hospital.hospital.location}
                                fees={hospital.hospital.fees}
                                rating={hospital.hospital.rating}
                                image={hospital.hospital.image}
                                nextAvailable={hospital.hospital.nextAvailable}
                                degrees={hospital.hospital.name} // Hospital name
                                votes={hospital.hospital.votes}
                                experience={hospital.hospital.experience} // Duration in minutes
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
