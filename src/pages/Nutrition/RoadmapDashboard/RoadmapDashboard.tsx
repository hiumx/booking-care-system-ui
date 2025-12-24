import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb, { BreadcrumbItem } from '@/components/Breadcrumb/Breadcrumb';
import NutritionSkeleton from '@/components/Loading/NutritionSkeleton';
import { nutritionService } from '@/services/nutrition.service';
import { DailyPlan, NutritionProfile, ProgressStats } from '@/types/nutrition.types';
import { PATHS } from '@/routes/paths';
import { RootState } from '@/store';
import styles from './RoadmapDashboard.module.scss';

const RoadmapDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation('nutrition');
    const userProfile = useSelector((state: RootState) => state.user.profile);
    const [profile, setProfile] = useState<NutritionProfile | null>(null);
    const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
    const [progressStats, setProgressStats] = useState<ProgressStats | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [weekDates, setWeekDates] = useState<Date[]>([]);
    const [hydrationGlasses, setHydrationGlasses] = useState(0);

    useEffect(() => {
        generateWeekDates();
        loadData();
    }, [selectedDate]);

    const generateWeekDates = () => {
        const dates: Date[] = [];
        const startDate = new Date(selectedDate);
        startDate.setDate(startDate.getDate() - 2);

        for (let i = 0; i < 5; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            dates.push(date);
        }
        setWeekDates(dates);
    };

    const loadData = async () => {
        try {
            setLoading(true);

            // Check profile first - redirect if not found
            try {
                const profileData = await nutritionService.getProfile();
                if (!profileData) {
                    navigate(PATHS.NUTRITION.ONBOARDING);
                    return;
                }
                setProfile(profileData);
            } catch (error: any) {
                if (error.response?.status === 404) {
                    navigate(PATHS.NUTRITION.ONBOARDING);
                    return;
                }
                // For other errors, still redirect to onboarding
                navigate(PATHS.NUTRITION.ONBOARDING);
                return;
            }

            const dateStr = selectedDate.toISOString().split('T')[0];
            try {
                const planData = await nutritionService.getDailyPlan(dateStr);
                setDailyPlan(planData);
                if (planData.hydrationPlan) {
                    setHydrationGlasses(planData.hydrationPlan.completedGlasses || 0);
                }
            } catch {
                setDailyPlan(null);
            }

            try {
                const statsData = await nutritionService.getProgressStats();
                setProgressStats(statsData);
            } catch (error: any) {
                console.error('Error loading progress stats:', error);
            }
        } catch (error: any) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGeneratePlan = async () => {
        try {
            setGenerating(true);
            if (!profile) {
                try {
                    const profileData = await nutritionService.getProfile();
                    setProfile(profileData);
                } catch {
                    toast.warning(t('dashboard.toast.profileRequired'));
                    navigate(PATHS.NUTRITION.ONBOARDING);
                    return;
                }
            }

            // Use selectedDate instead of today
            const dateStr = selectedDate.toISOString().split('T')[0];
            const planData = await nutritionService.generateDailyPlan(dateStr);

            // Don't change selectedDate - keep it as is
            setDailyPlan(planData);

            try {
                const statsData = await nutritionService.getProgressStats();
                setProgressStats(statsData);
            } catch (error) {
                console.error('Error reloading progress stats:', error);
            }
        } catch (error: any) {
            console.error('Error generating plan:', error);
            if (error.response?.data?.message?.includes('Nutrition profile not found')) {
                toast.warning(t('dashboard.toast.profileRequired'));
                navigate(PATHS.NUTRITION.ONBOARDING);
            } else {
                toast.error(t('dashboard.toast.generateError'));
            }
        } finally {
            setGenerating(false);
        }
    };

    const handleDateChange = (days: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + days);
        setSelectedDate(newDate);
    };

    const handleSelectDate = (date: Date) => {
        setSelectedDate(date);
    };

    const handleAddWater = () => {
        if (!dailyPlan?.hydrationPlan) return;
        const maxGlasses = dailyPlan.hydrationPlan.recommendedGlasses;
        if (hydrationGlasses < maxGlasses) {
            const newGlasses = hydrationGlasses + 1;
            setHydrationGlasses(newGlasses);

            // Update dailyPlan state to reflect new water intake (250ml = 0.25L per glass)
            setDailyPlan((prev) => {
                if (!prev?.hydrationPlan) return prev;
                return {
                    ...prev,
                    hydrationPlan: {
                        ...prev.hydrationPlan,
                        completedGlasses: newGlasses,
                        currentIntakeLiters: newGlasses * 0.25,
                    },
                };
            });
        }
    };

    const handleCompleteMeal = async (mealIndex: number) => {
        if (!dailyPlan?.mealPlan) return;
        try {
            await nutritionService.completeMeal(dailyPlan.mealPlan.id, mealIndex);

            // Update local state instead of reloading everything
            setDailyPlan((prev) => {
                if (!prev?.mealPlan) return prev;

                const completedItems = prev.mealPlan.completedItems || [];
                const isCompleted = completedItems.includes(mealIndex);

                const newCompletedItems = isCompleted
                    ? completedItems.filter((i) => i !== mealIndex)
                    : [...completedItems, mealIndex];

                // Recalculate completion percentage
                const totalItems =
                    (prev.mealPlan.meals?.length || 0) + (prev.workoutPlan?.exercises?.length || 0);
                const completedCount =
                    newCompletedItems.length + (prev.workoutPlan?.completedItems?.length || 0);
                const newCompletionPercentage =
                    totalItems > 0 ? (completedCount / totalItems) * 100 : 0;

                return {
                    ...prev,
                    mealPlan: {
                        ...prev.mealPlan,
                        completedItems: newCompletedItems,
                    },
                    completionPercentage: newCompletionPercentage,
                };
            });
        } catch (error) {
            console.error('Error completing meal:', error);
            toast.error(t('dashboard.toast.updateMealError'));
        }
    };

    const handleCompleteExercise = async (exerciseIndex: number) => {
        if (!dailyPlan?.workoutPlan) return;
        try {
            await nutritionService.completeExercise(dailyPlan.workoutPlan.id, exerciseIndex);

            // Update local state instead of reloading everything
            setDailyPlan((prev) => {
                if (!prev?.workoutPlan) return prev;

                const completedItems = prev.workoutPlan.completedItems || [];
                const isCompleted = completedItems.includes(exerciseIndex);

                const newCompletedItems = isCompleted
                    ? completedItems.filter((i) => i !== exerciseIndex)
                    : [...completedItems, exerciseIndex];

                // Recalculate completion percentage
                const totalItems =
                    (prev.mealPlan?.meals?.length || 0) + (prev.workoutPlan.exercises?.length || 0);
                const completedCount =
                    (prev.mealPlan?.completedItems?.length || 0) + newCompletedItems.length;
                const newCompletionPercentage =
                    totalItems > 0 ? (completedCount / totalItems) * 100 : 0;

                return {
                    ...prev,
                    workoutPlan: {
                        ...prev.workoutPlan,
                        completedItems: newCompletedItems,
                    },
                    completionPercentage: newCompletionPercentage,
                };
            });
        } catch (error) {
            console.error('Error completing exercise:', error);
            toast.error(t('dashboard.toast.updateExerciseError'));
        }
    };

    const handleNavigateToMealPlan = () => {
        const dateStr = selectedDate.toISOString().split('T')[0];
        navigate(`/nutrition/meal-plan/${dateStr}`);
    };

    const handleNavigateToWorkoutPlan = () => {
        const dateStr = selectedDate.toISOString().split('T')[0];
        navigate(`/nutrition/workout-plan/${dateStr}`);
    };

    const getDayLabel = (date: Date) => {
        const dayIndex = date.getDay();
        const dayKeys = [
            'sunday',
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
        ];
        return t(`weekDays.${dayKeys[dayIndex]}`);
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12)
            return { text: t('dashboard.greeting.morning'), icon: 'wb_sunny' };
        if (hour >= 12 && hour < 14)
            return { text: t('dashboard.greeting.noon'), icon: 'wb_sunny' };
        if (hour >= 14 && hour < 18)
            return { text: t('dashboard.greeting.afternoon'), icon: 'wb_twilight' };
        if (hour >= 18 && hour < 22)
            return { text: t('dashboard.greeting.evening'), icon: 'nights_stay' };
        return { text: t('dashboard.greeting.default'), icon: 'bedtime' };
    };

    const getUserName = () => {
        if (userProfile?.fullName) {
            // Get the last word of fullName (Vietnamese naming convention: last word is first name)
            const firstName = userProfile.fullName.split(' ').pop();
            return firstName || userProfile.fullName;
        }
        return i18n.language === 'vi' ? 'bạn' : 'there';
    };

    const breadcrumbItems: BreadcrumbItem[] = [
        { label: t('breadcrumb.home'), path: PATHS.HOME },
        { label: t('breadcrumb.yourHealth'), isActive: true },
    ];

    if (loading) {
        return (
            <MainLayout>
                <Breadcrumb items={breadcrumbItems} title={t('dashboard.title')} />
                <NutritionSkeleton type="dashboard" />
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbItems} title={t('dashboard.title')} />

            <div className={styles.dashboard}>
                <div className={styles.container}>
                    {/* Dashboard Header */}
                    <section className={styles.dashboardHeader}>
                        <div className={styles.greeting}>
                            <div className={styles.greetingIcon}>
                                <span className="material-symbols-outlined">
                                    {getGreeting().icon}
                                </span>
                                <span>{getGreeting().text}</span>
                            </div>
                            <h1>{t('dashboard.welcomeMessage', { name: getUserName() })}</h1>
                            <p>
                                {i18n.language === 'vi' ? (
                                    <>
                                        Hôm nay bạn đã hoàn thành{' '}
                                        <span className={styles.highlight}>
                                            {(dailyPlan?.completionPercentage || 0).toFixed(2)}%
                                        </span>{' '}
                                        kế hoạch.
                                    </>
                                ) : (
                                    <>
                                        Today you have completed{' '}
                                        <span className={styles.highlight}>
                                            {(dailyPlan?.completionPercentage || 0).toFixed(2)}%
                                        </span>{' '}
                                        of your plan.
                                    </>
                                )}
                            </p>
                        </div>

                        {/* Date Navigator */}
                        <div className={styles.dateNavigator}>
                            <button onClick={() => handleDateChange(-1)} className={styles.navBtn}>
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <div className={styles.dateList}>
                                {weekDates.map((date, index) => {
                                    const isSelected =
                                        date.toDateString() === selectedDate.toDateString();
                                    const isCurrentDay =
                                        date.toDateString() === new Date().toDateString();
                                    return (
                                        <div
                                            key={index}
                                            className={`${styles.dateItem} ${isSelected ? styles.active : ''}`}
                                            onClick={() => handleSelectDate(date)}
                                        >
                                            <span className={styles.dayLabel}>
                                                {isCurrentDay
                                                    ? t('common.today')
                                                    : getDayLabel(date)}
                                            </span>
                                            <span className={styles.dayNumber}>
                                                {date.getDate()}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <button onClick={() => handleDateChange(1)} className={styles.navBtn}>
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </section>

                    {/* 3 Column Layout */}
                    <div className={styles.gridLayout}>
                        {/* Left Column: Nutrition & Stats */}
                        <div className={styles.leftColumn}>
                            {/* Calories Card */}
                            <div className={styles.caloriesCard}>
                                <div className={styles.cardHeader}>
                                    <h3>{t('dashboard.calories')}</h3>
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ color: '#ff9f43' }}
                                    >
                                        local_fire_department
                                    </span>
                                </div>
                                <div className={styles.calorieRing}>
                                    {(() => {
                                        // Calculate consumed calories from completed meals only
                                        let consumed = 0;
                                        if (dailyPlan?.mealPlan) {
                                            const completedItems =
                                                dailyPlan.mealPlan.completedItems || [];
                                            consumed = dailyPlan.mealPlan.meals
                                                .filter((_, index) =>
                                                    completedItems.includes(index)
                                                )
                                                .reduce(
                                                    (sum, meal) =>
                                                        sum + meal.recipe.nutrition.calories,
                                                    0
                                                );
                                        }
                                        const target = profile?.targetCalories || 2000;
                                        const percentage = Math.min((consumed / target) * 100, 100);
                                        const remaining = Math.max(target - consumed, 0);
                                        return (
                                            <>
                                                <div
                                                    className={styles.ringOuter}
                                                    style={{
                                                        background: `conic-gradient(#19c3e6 ${percentage}%, #ecfdf5 0)`,
                                                    }}
                                                >
                                                    <div className={styles.ringInner}>
                                                        <span className={styles.value}>
                                                            {Math.round(consumed)}
                                                        </span>
                                                        <span className={styles.target}>
                                                            / {target}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className={styles.remaining}>
                                                    {t('dashboard.remaining', {
                                                        calories: Math.round(remaining),
                                                    })}
                                                </p>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>

                            {/* Macros Breakdown */}
                            <div className={styles.macrosCard}>
                                <h3>{t('dashboard.macros')}</h3>
                                <div className={styles.macrosList}>
                                    {(() => {
                                        // Calculate macros from completed meals only
                                        let carbsConsumed = 0;
                                        let proteinConsumed = 0;
                                        let fatConsumed = 0;

                                        if (dailyPlan?.mealPlan) {
                                            const completedItems =
                                                dailyPlan.mealPlan.completedItems || [];
                                            const completedMeals = dailyPlan.mealPlan.meals.filter(
                                                (_, index) => completedItems.includes(index)
                                            );
                                            carbsConsumed = completedMeals.reduce(
                                                (sum, meal) => sum + meal.recipe.nutrition.carbsG,
                                                0
                                            );
                                            proteinConsumed = completedMeals.reduce(
                                                (sum, meal) => sum + meal.recipe.nutrition.proteinG,
                                                0
                                            );
                                            fatConsumed = completedMeals.reduce(
                                                (sum, meal) => sum + meal.recipe.nutrition.fatG,
                                                0
                                            );
                                        }

                                        const carbsTarget = profile?.targetCarbsG || 250;
                                        const carbsPercent = Math.min(
                                            (carbsConsumed / carbsTarget) * 100,
                                            100
                                        );

                                        const proteinTarget = profile?.targetProteinG || 150;
                                        const proteinPercent = Math.min(
                                            (proteinConsumed / proteinTarget) * 100,
                                            100
                                        );

                                        const fatTarget = profile?.targetFatG || 65;
                                        const fatPercent = Math.min(
                                            (fatConsumed / fatTarget) * 100,
                                            100
                                        );

                                        return (
                                            <>
                                                {/* Carbs */}
                                                <div className={styles.macroItem}>
                                                    <div
                                                        className={styles.macroIcon}
                                                        style={{
                                                            background: `conic-gradient(#3b82f6 ${carbsPercent}%, #dbeafe 0)`,
                                                        }}
                                                    >
                                                        <div
                                                            className={styles.macroIconInner}
                                                        ></div>
                                                    </div>
                                                    <div className={styles.macroInfo}>
                                                        <div className={styles.macroLabel}>
                                                            <span>Carbs</span>
                                                            <span>{carbsPercent.toFixed(2)}%</span>
                                                        </div>
                                                        <div className={styles.macroBar}>
                                                            <div
                                                                className={styles.macroFill}
                                                                style={{
                                                                    width: `${carbsPercent}%`,
                                                                    background: '#3b82f6',
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Protein */}
                                                <div className={styles.macroItem}>
                                                    <div
                                                        className={styles.macroIcon}
                                                        style={{
                                                            background: `conic-gradient(#a855f7 ${proteinPercent}%, #f3e8ff 0)`,
                                                        }}
                                                    >
                                                        <div
                                                            className={styles.macroIconInner}
                                                        ></div>
                                                    </div>
                                                    <div className={styles.macroInfo}>
                                                        <div className={styles.macroLabel}>
                                                            <span>Protein</span>
                                                            <span>
                                                                {proteinPercent.toFixed(2)}%
                                                            </span>
                                                        </div>
                                                        <div className={styles.macroBar}>
                                                            <div
                                                                className={styles.macroFill}
                                                                style={{
                                                                    width: `${proteinPercent}%`,
                                                                    background: '#a855f7',
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Fat */}
                                                <div className={styles.macroItem}>
                                                    <div
                                                        className={styles.macroIcon}
                                                        style={{
                                                            background: `conic-gradient(#eab308 ${fatPercent}%, #fef9c3 0)`,
                                                        }}
                                                    >
                                                        <div
                                                            className={styles.macroIconInner}
                                                        ></div>
                                                    </div>
                                                    <div className={styles.macroInfo}>
                                                        <div className={styles.macroLabel}>
                                                            <span>Fat</span>
                                                            <span>{fatPercent.toFixed(2)}%</span>
                                                        </div>
                                                        <div className={styles.macroBar}>
                                                            <div
                                                                className={styles.macroFill}
                                                                style={{
                                                                    width: `${fatPercent}%`,
                                                                    background: '#eab308',
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>

                            {/* Hydration */}
                            <div className={styles.hydrationCard}>
                                <div className={styles.hydrationHeader}>
                                    <h3>{t('dashboard.hydration.title')}</h3>
                                    <span className={styles.hydrationTarget}>
                                        {dailyPlan?.hydrationPlan
                                            ? `${dailyPlan.hydrationPlan.currentIntakeLiters.toFixed(1)}L / ${dailyPlan.hydrationPlan.targetWaterLiters}L`
                                            : '0L / 2L'}
                                    </span>
                                </div>
                                <div className={styles.waterDrops}>
                                    {Array.from({ length: 8 }).map((_, index) => (
                                        <span
                                            key={index}
                                            className={`material-symbols-outlined ${styles.waterDropIcon} ${index < hydrationGlasses ? styles.filled : styles.empty}`}
                                        >
                                            water_drop
                                        </span>
                                    ))}
                                </div>
                                <button className={styles.addWaterBtn} onClick={handleAddWater}>
                                    {t('dashboard.hydration.addWater')}
                                </button>
                            </div>
                        </div>

                        {/* Center Column: Meal Timeline & Workout */}
                        <div className={styles.centerColumn}>
                            {/* Meal Timeline */}
                            <div className={styles.mealTimelineCard}>
                                <div className={styles.sectionHeader}>
                                    <div className={styles.headerLeft}>
                                        <div
                                            className={styles.iconBox}
                                            style={{ background: '#d1fae5' }}
                                        >
                                            <span
                                                className="material-symbols-outlined"
                                                style={{ color: '#059669' }}
                                            >
                                                restaurant_menu
                                            </span>
                                        </div>
                                        <div>
                                            <h3>{t('dashboard.mealPlan.title')}</h3>
                                            <p>{t('dashboard.mealPlan.recommendedBy')}</p>
                                        </div>
                                    </div>
                                    <button
                                        className={styles.detailBtn}
                                        onClick={handleNavigateToMealPlan}
                                    >
                                        {t('dashboard.mealPlan.viewDetail')}
                                    </button>
                                </div>

                                <div className={styles.mealTimeline}>
                                    {!dailyPlan?.mealPlan ? (
                                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                                            <p>{t('dashboard.mealPlan.noMealPlan')}</p>
                                            {(() => {
                                                const today = new Date();
                                                today.setHours(0, 0, 0, 0);
                                                const selected = new Date(selectedDate);
                                                selected.setHours(0, 0, 0, 0);
                                                const isPastDate = selected < today;

                                                if (isPastDate) {
                                                    return (
                                                        <p
                                                            style={{
                                                                color: '#6b7280',
                                                                marginTop: '1rem',
                                                            }}
                                                        >
                                                            {t(
                                                                'dashboard.mealPlan.cannotGeneratePast'
                                                            )}
                                                        </p>
                                                    );
                                                }

                                                return (
                                                    <button
                                                        className={styles.startBtn}
                                                        onClick={handleGeneratePlan}
                                                        disabled={generating}
                                                        style={{
                                                            marginTop: '1rem',
                                                            background:
                                                                'linear-gradient(135deg, #19c3e6 0%, #0ea5e9 100%)',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '12px 24px',
                                                            borderRadius: '10px',
                                                            fontSize: '14px',
                                                            fontWeight: 600,
                                                            cursor: 'pointer',
                                                            boxShadow:
                                                                '0 4px 12px rgba(25, 195, 230, 0.3)',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                        }}
                                                    >
                                                        <span
                                                            className="material-symbols-outlined"
                                                            style={{ fontSize: '20px' }}
                                                        >
                                                            auto_awesome
                                                        </span>
                                                        {generating
                                                            ? t('dashboard.generating')
                                                            : t('dashboard.generatePlan')}
                                                    </button>
                                                );
                                            })()}
                                        </div>
                                    ) : (
                                        dailyPlan.mealPlan.meals.map((meal, index) => {
                                            const isCompleted =
                                                dailyPlan.mealPlan?.completedItems?.includes(
                                                    index
                                                ) || false;
                                            const getMealType = (mealType: string) => {
                                                const typeMap: { [key: string]: string } = {
                                                    Breakfast: 'breakfast',
                                                    Lunch: 'lunch',
                                                    Dinner: 'dinner',
                                                    Snack: 'snack',
                                                };
                                                return t(
                                                    `mealTypes.${typeMap[mealType] || 'breakfast'}`
                                                );
                                            };
                                            return (
                                                <div
                                                    key={index}
                                                    className={styles.mealItem}
                                                    onClick={() => handleCompleteMeal(index)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <div className={styles.mealImage}>
                                                        <img
                                                            src={
                                                                meal.recipe.imageUrl ||
                                                                'https://via.placeholder.com/48'
                                                            }
                                                            alt={meal.recipe.nameVi}
                                                        />
                                                    </div>
                                                    <div className={styles.mealContent}>
                                                        <div className={styles.mealInfo}>
                                                            <div>
                                                                <span className={styles.mealType}>
                                                                    {getMealType(meal.mealType)} •{' '}
                                                                    {meal.mealTime}
                                                                </span>
                                                                <h4>
                                                                    {i18n.language === 'vi'
                                                                        ? meal.recipe.nameVi
                                                                        : meal.recipe.nameEn ||
                                                                          meal.recipe.nameVi}
                                                                </h4>
                                                                {meal.recipe.descriptionVi && (
                                                                    <p>
                                                                        {i18n.language === 'vi'
                                                                            ? meal.recipe
                                                                                  .descriptionVi
                                                                            : meal.recipe
                                                                                  .descriptionEn ||
                                                                              meal.recipe
                                                                                  .descriptionVi}
                                                                    </p>
                                                                )}
                                                                <div className={styles.mealTags}>
                                                                    <span>
                                                                        {Math.round(
                                                                            meal.recipe.nutrition
                                                                                .calories
                                                                        )}{' '}
                                                                        {t('common.kcal')}
                                                                    </span>
                                                                    {meal.recipe.nutrition
                                                                        .proteinG > 20 && (
                                                                        <span>
                                                                            {t(
                                                                                'dashboard.mealPlan.richProtein'
                                                                            )}
                                                                        </span>
                                                                    )}
                                                                    {meal.recipe.nutrition.fiberG &&
                                                                        meal.recipe.nutrition
                                                                            .fiberG > 5 && (
                                                                            <span>
                                                                                {t(
                                                                                    'dashboard.mealPlan.richFiber'
                                                                                )}
                                                                            </span>
                                                                        )}
                                                                </div>
                                                            </div>
                                                            <input
                                                                type="checkbox"
                                                                checked={isCompleted}
                                                                onChange={(e) => {
                                                                    e.stopPropagation();
                                                                    handleCompleteMeal(index);
                                                                }}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className={styles.mealCheckbox}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Workout Plan */}
                            <div className={styles.workoutCard}>
                                <div className={styles.sectionHeader}>
                                    <div className={styles.headerLeft}>
                                        <div
                                            className={styles.iconBox}
                                            style={{ background: '#fed7aa' }}
                                        >
                                            <span
                                                className="material-symbols-outlined"
                                                style={{ color: '#ea580c' }}
                                            >
                                                fitness_center
                                            </span>
                                        </div>
                                        <div>
                                            <h3>{t('dashboard.workoutPlan.title')}</h3>
                                            <p>
                                                {t('dashboard.workoutPlan.goal')}:{' '}
                                                {profile?.healthGoal
                                                    ? t(
                                                          `dashboard.healthGoals.${profile.healthGoal}`
                                                      )
                                                    : t('dashboard.healthGoals.Maintenance')}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        className={styles.startBtn}
                                        onClick={handleNavigateToWorkoutPlan}
                                    >
                                        {t('dashboard.workoutPlan.viewDetail')}
                                    </button>
                                </div>

                                <div className={styles.exerciseList}>
                                    {!dailyPlan?.workoutPlan ? (
                                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                                            <p>{t('dashboard.workoutPlan.noWorkoutPlan')}</p>
                                        </div>
                                    ) : (
                                        dailyPlan.workoutPlan.exercises.map((exercise, index) => {
                                            const isCompleted =
                                                dailyPlan.workoutPlan?.completedItems?.includes(
                                                    index
                                                ) || false;
                                            return (
                                                <div
                                                    key={index}
                                                    className={styles.exerciseItem}
                                                    onClick={() => handleCompleteExercise(index)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <div className={styles.exerciseIcon}>
                                                        {exercise.imageUrl ? (
                                                            <img
                                                                src={exercise.imageUrl}
                                                                alt={exercise.nameVi}
                                                                style={{
                                                                    width: '80px',
                                                                    height: '80px',
                                                                    borderRadius: '8px',
                                                                    objectFit: 'cover',
                                                                }}
                                                            />
                                                        ) : (
                                                            <span className="material-symbols-outlined">
                                                                fitness_center
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className={styles.exerciseInfo}>
                                                        <h4>
                                                            {i18n.language === 'vi'
                                                                ? exercise.nameVi
                                                                : exercise.nameEn ||
                                                                  exercise.nameVi}
                                                        </h4>
                                                        <p>
                                                            {exercise.durationMinutes}{' '}
                                                            {t('dashboard.workoutPlan.minutes')} •{' '}
                                                            {exercise.caloriesBurned || 0}{' '}
                                                            {t('common.kcal')}
                                                        </p>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={isCompleted}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            handleCompleteExercise(index);
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className={styles.exerciseCheckbox}
                                                    />
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Insights & Trends */}
                        <div className={styles.rightColumn}>
                            {/* Weight Chart */}
                            <div className={styles.weightCard}>
                                <div className={styles.weightHeader}>
                                    <h3>{t('dashboard.weight.title')}</h3>
                                    <button
                                        className={styles.updateBtn}
                                        onClick={() => navigate(PATHS.NUTRITION.ONBOARDING)}
                                    >
                                        {t('dashboard.weight.update')}
                                    </button>
                                </div>
                                <div className={styles.weightValue}>
                                    <span className={styles.weight}>
                                        {profile?.weightKg || 65.2}
                                    </span>
                                    <span className={styles.unit}>
                                        {t('dashboard.weight.unit')}
                                    </span>
                                    <span className={styles.change}>
                                        {profile?.age || 25} {t('dashboard.weight.age')}
                                    </span>
                                </div>
                                <div className={styles.weightChart}>
                                    {[60, 58, 62, 55, 59, 57, 54].map((height, index) => (
                                        <div
                                            key={index}
                                            className={`${styles.chartBar} ${index === 6 ? styles.active : ''}`}
                                            style={{ height: `${height}%` }}
                                        ></div>
                                    ))}
                                </div>
                                <div className={styles.chartLabels}>
                                    {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(
                                        (day, index) => (
                                            <span key={index}>{day}</span>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Streak Card */}
                            <div className={styles.streakCard}>
                                <div className={styles.streakContent}>
                                    <div>
                                        <p className={styles.streakLabel}>
                                            {t('dashboard.streak.title')}
                                        </p>
                                        <h3 className={styles.streakValue}>
                                            {progressStats?.streakCount
                                                ? t('dashboard.streak.days', {
                                                      count: progressStats.streakCount,
                                                  })
                                                : t('dashboard.streak.notStarted')}
                                        </h3>
                                        <p className={styles.streakMessage}>
                                            {progressStats?.streakCount &&
                                            progressStats.streakCount > 0
                                                ? t('dashboard.streak.keepGoing')
                                                : t('dashboard.streak.startNow')}
                                        </p>
                                    </div>
                                    <div className={styles.streakIcon}>
                                        <span
                                            className={`material-symbols-outlined ${styles.fireIcon}`}
                                        >
                                            local_fire_department
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* AI Insight */}
                            <div className={styles.aiInsightCard}>
                                <div className={styles.aiHeader}>
                                    <span className={`material-symbols-outlined ${styles.aiIcon}`}>
                                        auto_awesome
                                    </span>
                                    <h3>{t('dashboard.aiInsight.title')}</h3>
                                </div>
                                <p>{t('dashboard.aiInsight.defaultMessage')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default RoadmapDashboard;
