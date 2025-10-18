import { useState, useEffect } from 'react';
import { Skeleton } from '@mui/material';
import DoctorCard from './components/DoctorCard';
import Pagination from '@/components/Pagination';
import FavoriteDoctorService from '@/services/favoriteDoctor.service';
import { DoctorResponse, FavouriteDoctor } from '@/types/doctor.types';
import { Status } from '@/enums/common.enums';

// Skeleton component for doctor card
const DoctorCardSkeleton = () => (
    <div className="col-md-6 col-lg-4 d-flex">
        <div className="card doctor-card w-100">
            <div className="card-body">
                <div className="doctor-widget-one">
                    <div className="doc-info-left">
                        <div className="doctor-img">
                            <Skeleton variant="circular" width={80} height={80} />
                        </div>
                        <div className="doc-info-cont">
                            <Skeleton variant="text" width="80%" height={24} />
                            <Skeleton variant="text" width="60%" height={20} />
                            <div className="rating">
                                <Skeleton variant="text" width="50%" height={16} />
                            </div>
                            <div className="clinic-details">
                                <Skeleton variant="text" width="70%" height={16} />
                                <Skeleton variant="text" width="50%" height={16} />
                            </div>
                        </div>
                    </div>
                    <div className="doc-info-right">
                        <div className="clinic-booking">
                            <Skeleton variant="rectangular" width={80} height={32} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

interface FavouriteProps {
    patientId?: string;
}

const Favourite: React.FC<FavouriteProps> = ({ patientId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [doctors, setDoctors] = useState<DoctorResponse[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const itemsPerPage = 9; // API default page size

    // Fetch favorite doctors
    const fetchFavoriteDoctors = async (page: number = 1, search: string = '') => {
        if (!patientId) {
            setError('Patient ID is required to load favorite doctors');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await FavoriteDoctorService.getFavoriteDoctors({
                patientId,
                pageNumber: page,
                pageSize: itemsPerPage,
                searchTerm: search || undefined,
            });

            setDoctors(response.doctors);
            setTotalPages(response.totalPages);
            setTotalCount(response.totalCount);
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra khi tải danh sách bác sĩ yêu thích');
            console.error('Error fetching favorite doctors:', err);
        } finally {
            setLoading(false);
        }
    };

    // Load data on component mount and when dependencies change
    useEffect(() => {
        if (patientId) {
            fetchFavoriteDoctors(currentPage, searchTerm);
        }
    }, [currentPage, searchTerm, patientId]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Reset to first page when search term changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        setCurrentPage(1);
    };

    // Convert API response to match UI interface
    const convertToUIDoctor = (apiDoctor: DoctorResponse): FavouriteDoctor => {
        return {
            id: apiDoctor.id,
            name: `${apiDoctor.firstName} ${apiDoctor.lastName}`,
            specialty: apiDoctor.specialty?.name || 'Không xác định',
            image: apiDoctor.avatarUrl,
            rating: apiDoctor.reviewStatistics?.averageRating || 0,
            numberOfReviews: apiDoctor.reviewStatistics?.totalReviews || 0,
            level: apiDoctor.position?.name || 'Không xác định',
            location: apiDoctor.hospital?.name || 'Không xác định',
            experience: apiDoctor.yearsOfExperience.toString(),
            isVerified: apiDoctor.status === Status.ACTIVE,
        };
    };

    // Handle favorite change - remove doctor from list if unfavorited
    const handleFavoriteChange = (doctorId: string, isFavorited: boolean) => {
        if (!isFavorited) {
            // Remove doctor from list when unfavorited
            setDoctors((prev) => prev.filter((doc) => doc.id !== doctorId));
            setTotalCount((prev) => Math.max(0, prev - 1));
        }
    };

    // Early return if no patientId
    if (!patientId) {
        return (
            <div className="text-center my-4">
                <p>Vui lòng đăng nhập để xem danh sách bác sĩ yêu thích.</p>
            </div>
        );
    }

    return (
        <>
            <div className="dashboard-header">
                <h3>Danh sách bác sĩ yêu thích ({totalCount})</h3>
                <ul className="header-list-btns">
                    <li>
                        <div className="input-block dash-search-input">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tìm kiếm"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <span className="search-icon">
                                <i className="isax isax-search-normal"></i>
                            </span>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="row">
                    {Array.from({ length: itemsPerPage }, (_, index) => (
                        <DoctorCardSkeleton key={index} />
                    ))}
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {/* No data state */}
            {!loading && !error && doctors.length === 0 && (
                <div className="text-center my-4">
                    <p>Không tìm thấy bác sĩ yêu thích nào.</p>
                </div>
            )}

            {/* Favourites */}
            {!loading && !error && doctors.length > 0 && (
                <div className="row">
                    {doctors.map((doctor: DoctorResponse) => (
                        <div key={doctor.id} className="col-md-6 col-lg-4 d-flex">
                            <DoctorCard
                                doctor={convertToUIDoctor(doctor)}
                                patientId={patientId}
                                onFavoriteChange={handleFavoriteChange}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
                <div className="col-md-12">
                    <div className="d-flex justify-content-center mt-4">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            showPrevNext={true}
                            maxVisiblePages={5}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default Favourite;
