import React, { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { searchDoctorsAsync, clearDoctors } from '@/store/slices/doctorSlice';
import { DoctorSearchParams } from '@/types/doctor.types';
import { buildPath, PATHS, replacePathParams } from '@/routes/paths';
import { sortDoctorsByRating } from '@/utils/homeDataConverters';
import { Link } from 'react-router-dom';
import styles from './ExpertTeam.module.scss';
import Spinner from '@/components/Spinner';

const ExpertTeam: React.FC = () => {
    const dispatch = useAppDispatch();
    const hasFetched = useRef(false);
    const { doctors, isLoading } = useAppSelector((state) => state.doctor);

    // Fetch doctors if not already loaded
    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            dispatch(clearDoctors());
            const params: DoctorSearchParams = {
                pageNumber: 1,
                pageSize: 6, // Get top 6 doctors
                sortBy: 'rating',
                sortOrder: 'desc',
            };
            dispatch(searchDoctorsAsync(params));
        }
    }, [dispatch]);

    // Convert doctors to expert format
    const sortedDoctors = sortDoctorsByRating([...doctors]);
    const experts = sortedDoctors.slice(0, 6).map((doctor) => ({
        id: doctor.id,
        name: `${doctor.lastName} ${doctor.firstName}`,
        specialty: doctor.specialty?.name || 'Chuyên khoa',
        image: doctor.avatarUrl || '/default-doctor.png',
        href: replacePathParams(buildPath(PATHS.DOCTOR.ROOT, PATHS.DOCTOR.PROFILE), {
            id: doctor.id,
        }),
    }));

    return (
        <section className={styles.expertTeam}>
            <h2 className={styles.title}>Đội Ngũ Chuyên Gia</h2>

            <div className={styles.wrapper}>
                <div className={styles.contentGrid}>
                    {isLoading && (
                        <div className={styles.loadingContainer}>
                            <Spinner />
                        </div>
                    )}
                    {!isLoading && experts.length > 0 && (
                        <div className={styles.expertsGrid}>
                            {experts.map((ex) => (
                                <Link key={ex.id} to={ex.href} className={styles.expertItem}>
                                    <div className={styles.avatarBox}>
                                        <img src={ex.image} alt={ex.name} />
                                    </div>
                                    <div className={styles.info}>
                                        <h3 className={styles.name}>{ex.name}</h3>
                                        <p className={styles.specialty}>{ex.specialty}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                    {!isLoading && experts.length === 0 && (
                        <div className={styles.emptyState}>
                            <p>Chưa có thông tin đội ngũ chuyên gia</p>
                        </div>
                    )}

                    <aside className={styles.commitBlock}>
                        <p className={styles.commitText}>
                            Hội đồng tham vấn y khoa cùng đội ngũ biên tập viên là các bác sĩ, dược
                            sĩ đảm bảo nội dung chúng tôi cung cấp chính xác về mặt y khoa và cập
                            nhật những thông tin mới nhất.
                        </p>
                        <Link to={PATHS.DOCTOR.ROOT} className={styles.commitCta}>
                            Đội ngũ chuyên gia{' '}
                            <span className={styles.ctaIcon} aria-hidden="true">
                                →
                            </span>
                        </Link>
                    </aside>
                </div>
            </div>
        </section>
    );
};

export default ExpertTeam;
