import React from 'react';
import { Skeleton } from '@mui/material';
import styles from './NutritionSkeleton.module.scss';

interface NutritionSkeletonProps {
    type: 'dashboard' | 'onboarding' | 'mealPlan' | 'workoutPlan';
}

const NutritionSkeleton: React.FC<NutritionSkeletonProps> = ({ type }) => {
    if (type === 'dashboard') {
        return (
            <div className={styles.dashboardSkeleton}>
                {/* Hero Section */}
                <div className={styles.heroSection}>
                    <div className={styles.heroContent}>
                        <div className={styles.heroLeft}>
                            <Skeleton
                                variant="rectangular"
                                width={120}
                                height={24}
                                sx={{ borderRadius: '20px', mb: 1 }}
                            />
                            <Skeleton variant="text" width="60%" height={32} />
                            <Skeleton variant="text" width="40%" height={20} />
                        </div>
                        <Skeleton
                            variant="rectangular"
                            width={200}
                            height={100}
                            sx={{ borderRadius: '12px' }}
                        />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className={styles.statsGrid}>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={styles.statCard}>
                            <Skeleton variant="circular" width={48} height={48} />
                            <div className={styles.statContent}>
                                <Skeleton variant="text" width="80%" height={24} />
                                <Skeleton variant="text" width="60%" height={20} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className={styles.contentGrid}>
                    <div className={styles.mainColumn}>
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={300}
                            sx={{ borderRadius: '16px', mb: 2 }}
                        />
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={200}
                            sx={{ borderRadius: '16px' }}
                        />
                    </div>
                    <div className={styles.sideColumn}>
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={250}
                            sx={{ borderRadius: '16px', mb: 2 }}
                        />
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={180}
                            sx={{ borderRadius: '16px' }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'onboarding') {
        return (
            <div className={styles.onboardingSkeleton}>
                <div className={styles.wizardContainer}>
                    {/* Progress Steps */}
                    <div className={styles.progressSteps}>
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} variant="circular" width={40} height={40} />
                        ))}
                    </div>

                    {/* Form Content */}
                    <div className={styles.formContent}>
                        <Skeleton variant="text" width="60%" height={36} sx={{ mb: 2 }} />
                        <Skeleton variant="text" width="80%" height={20} sx={{ mb: 4 }} />

                        {[1, 2, 3].map((i) => (
                            <div key={i} className={styles.formField}>
                                <Skeleton variant="text" width={120} height={20} sx={{ mb: 1 }} />
                                <Skeleton
                                    variant="rectangular"
                                    width="100%"
                                    height={48}
                                    sx={{ borderRadius: '8px' }}
                                />
                            </div>
                        ))}

                        <div className={styles.buttonGroup}>
                            <Skeleton
                                variant="rectangular"
                                width={120}
                                height={44}
                                sx={{ borderRadius: '8px' }}
                            />
                            <Skeleton
                                variant="rectangular"
                                width={120}
                                height={44}
                                sx={{ borderRadius: '8px' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'mealPlan') {
        return (
            <div className={styles.mealPlanSkeleton}>
                {/* Hero Section */}
                <div className={styles.heroSection}>
                    <div className={styles.heroContent}>
                        <div className={styles.heroLeft}>
                            <Skeleton
                                variant="rectangular"
                                width={150}
                                height={24}
                                sx={{ borderRadius: '20px', mb: 1 }}
                            />
                            <Skeleton variant="text" width="70%" height={32} />
                            <Skeleton variant="text" width="90%" height={20} />
                        </div>
                        <Skeleton
                            variant="rectangular"
                            width={250}
                            height={100}
                            sx={{ borderRadius: '12px' }}
                        />
                    </div>
                </div>

                {/* Date Navigation */}
                <div className={styles.dateNav}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="text" width={200} height={32} />
                    <Skeleton variant="circular" width={40} height={40} />
                </div>

                {/* Meal Cards */}
                <div className={styles.mealTimeline}>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={styles.mealRow}>
                            <Skeleton variant="circular" width={24} height={24} />
                            <div className={styles.mealCard}>
                                <Skeleton
                                    variant="rectangular"
                                    width={160}
                                    height={200}
                                    sx={{ borderRadius: '12px' }}
                                />
                                <div className={styles.mealContent}>
                                    <Skeleton
                                        variant="text"
                                        width="80%"
                                        height={24}
                                        sx={{ mb: 1 }}
                                    />
                                    <Skeleton
                                        variant="text"
                                        width="100%"
                                        height={20}
                                        sx={{ mb: 1 }}
                                    />
                                    <Skeleton
                                        variant="text"
                                        width="60%"
                                        height={20}
                                        sx={{ mb: 2 }}
                                    />
                                    <div className={styles.macros}>
                                        <Skeleton
                                            variant="rectangular"
                                            width={60}
                                            height={20}
                                            sx={{ borderRadius: '4px' }}
                                        />
                                        <Skeleton
                                            variant="rectangular"
                                            width={60}
                                            height={20}
                                            sx={{ borderRadius: '4px' }}
                                        />
                                        <Skeleton
                                            variant="rectangular"
                                            width={60}
                                            height={20}
                                            sx={{ borderRadius: '4px' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (type === 'workoutPlan') {
        return (
            <div className={styles.workoutPlanSkeleton}>
                {/* Hero Section */}
                <div className={styles.heroSection}>
                    <div className={styles.heroContent}>
                        <div className={styles.heroLeft}>
                            <Skeleton
                                variant="rectangular"
                                width={150}
                                height={24}
                                sx={{ borderRadius: '20px', mb: 1 }}
                            />
                            <Skeleton variant="text" width="70%" height={32} />
                            <Skeleton variant="text" width="90%" height={20} />
                        </div>
                        <Skeleton
                            variant="rectangular"
                            width={250}
                            height={100}
                            sx={{ borderRadius: '12px' }}
                        />
                    </div>
                </div>

                {/* Date Navigation */}
                <div className={styles.dateNav}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="text" width={200} height={32} />
                    <Skeleton variant="circular" width={40} height={40} />
                </div>

                {/* Content Grid */}
                <div className={styles.contentGrid}>
                    <div className={styles.mainColumn}>
                        <div className={styles.workoutCard}>
                            <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
                            <Skeleton
                                variant="rectangular"
                                width="100%"
                                height={80}
                                sx={{ borderRadius: '12px', mb: 2 }}
                            />

                            {[1, 2, 3].map((i) => (
                                <div key={i} className={styles.exerciseItem}>
                                    <Skeleton
                                        variant="rectangular"
                                        width={64}
                                        height={64}
                                        sx={{ borderRadius: '12px' }}
                                    />
                                    <div className={styles.exerciseInfo}>
                                        <Skeleton variant="text" width="70%" height={24} />
                                        <Skeleton variant="text" width="90%" height={20} />
                                        <div className={styles.badges}>
                                            <Skeleton
                                                variant="rectangular"
                                                width={60}
                                                height={24}
                                                sx={{ borderRadius: '12px' }}
                                            />
                                            <Skeleton
                                                variant="rectangular"
                                                width={60}
                                                height={24}
                                                sx={{ borderRadius: '12px' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.sideColumn}>
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={250}
                            sx={{ borderRadius: '16px', mb: 2 }}
                        />
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={200}
                            sx={{ borderRadius: '16px' }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default NutritionSkeleton;
