import React from 'react';
import { Skeleton, Stack } from '@mui/material';
import styles from './HospitalCard.module.scss';

const HospitalCardSkeleton: React.FC = () => {
    return (
        <div className={styles.clinicCarouselItem}>
            <div className={`card h-100 ${styles.clinicCard}`}>
                {/* Image Section Skeleton */}
                <div className={styles.clinicImageContainer}>
                    <Skeleton
                        variant="rectangular"
                        width="100%"
                        height="100%"
                        sx={{ borderRadius: '12px 12px 0 0' }}
                    />

                    {/* Overlay Elements Skeleton */}
                    <div className={styles.imageOverlay}>
                        <Skeleton
                            variant="rectangular"
                            width={60}
                            height={24}
                            sx={{ borderRadius: '6px' }}
                        />
                    </div>

                    {/* Specialty Count Indicator Skeleton */}
                    <div className={`${styles.specialtyIndicator} ${styles.skeletonIndicator}`}>
                        <Skeleton
                            variant="rectangular"
                            width={80}
                            height={32}
                            sx={{
                                borderRadius: '6px',
                                '&::after': {
                                    background:
                                        'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                                },
                            }}
                        />
                    </div>
                </div>

                {/* Card Body Skeleton */}
                <div className={`card-body ${styles.clinicBody}`}>
                    {/* Header Section Skeleton */}
                    <Skeleton variant="text" width="85%" height={28} sx={{ marginBottom: '8px' }} />

                    {/* Location Section Skeleton */}
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ marginBottom: '12px' }}
                    >
                        <Skeleton variant="circular" width={16} height={16} />
                        <Skeleton variant="text" width="70%" height={18} />
                    </Stack>

                    {/* Specialties Section Skeleton */}
                    <div className={styles.specialtiesSection}>
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ marginBottom: '8px' }}
                        >
                            <Skeleton variant="circular" width={16} height={16} />
                            <Skeleton variant="text" width={80} height={18} />
                        </Stack>

                        <div className={styles.specialtiesContainer}>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                <Skeleton
                                    variant="rectangular"
                                    width={80}
                                    height={24}
                                    sx={{ borderRadius: '12px' }}
                                />
                                <Skeleton
                                    variant="rectangular"
                                    width={70}
                                    height={24}
                                    sx={{ borderRadius: '12px' }}
                                />
                                <Skeleton
                                    variant="rectangular"
                                    width={90}
                                    height={24}
                                    sx={{ borderRadius: '12px' }}
                                />
                            </Stack>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HospitalCardSkeleton;
