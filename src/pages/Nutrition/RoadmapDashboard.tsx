import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
            try {
                const profileData = await nutritionService.getProfile();
                setProfile(profileData);
            } catch (error: any) {
                if (error.response?.status === 404) {
                    navigate(PATHS.NUTRITION.ONBOARDING);
                    return;
                }
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
                    toast.warning('Bạn cần hoàn thành thông tin cá nhân trước!');
                    navigate(PATHS.NUTRITION.ONBOARDING);
                    return;
                }
            }

            const today = new Date();
            const dateStr = today.toISOString().split('T')[0];
            const planData = await nutritionService.generateDailyPlan(dateStr);

            if (selectedDate.toDateString() !== today.toDateString()) {
                setSelectedDate(today);
            }

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
                toast.warning('Bạn cần hoàn thành thông tin cá nhân trước!');
                navigate(PATHS.NUTRITION.ONBOARDING);
            } else {
                toast.error('Có lỗi xảy ra khi tạo kế hoạch. Vui lòng thử lại!');
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
            setHydrationGlasses(hydrationGlasses + 1);
            toast.success('Đã thêm 1 ly nước!');
        }
    };

    const handleCompleteMeal = async (mealIndex: number) => {
        if (!dailyPlan?.mealPlan) return;
        try {
            await nutritionService.completeMeal(dailyPlan.mealPlan.id, mealIndex);
            await loadData();
            toast.success('Đã hoàn thành bữa ăn!');
        } catch (error) {
            console.error('Error completing meal:', error);
            toast.error('Không thể cập nhật bữa ăn');
        }
    };

    const handleCompleteExercise = async (exerciseIndex: number) => {
        if (!dailyPlan?.workoutPlan) return;
        try {
            await nutritionService.completeExercise(dailyPlan.workoutPlan.id, exerciseIndex);
            await loadData();
            toast.success('Đã hoàn thành bài tập!');
        } catch (error) {
            console.error('Error completing exercise:', error);
            toast.error('Không thể cập nhật bài tập');
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
        const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        return days[date.getDay()];
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return { text: 'Chào buổi sáng', icon: 'wb_sunny' };
        if (hour >= 12 && hour < 14) return { text: 'Chào buổi trưa', icon: 'wb_sunny' };
        if (hour >= 14 && hour < 18) return { text: 'Chào buổi chiều', icon: 'wb_twilight' };
        if (hour >= 18 && hour < 22) return { text: 'Chào buổi tối', icon: 'nights_stay' };
        return { text: 'Chào bạn', icon: 'bedtime' };
    };

    const getUserName = () => {
        if (userProfile?.fullName) {
            // Get the last word of fullName (Vietnamese naming convention: last word is first name)
            const firstName = userProfile.fullName.split(' ').pop();
            return firstName || userProfile.fullName;
        }
        return 'bạn';
    };

    const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Trang chủ', path: PATHS.HOME },
        { label: 'Sức khỏe của bạn', isActive: true },
    ];

    if (loading) {
        return (
            <MainLayout>
                <Breadcrumb items={breadcrumbItems} title="Sức khỏe của bạn" />
                <NutritionSkeleton type="dashboard" />
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbItems} title="Sức khỏe của bạn" />

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
                            <h1>Chào bạn, {getUserName()}! 👋</h1>
                            <p>
                                Hôm nay bạn đã hoàn thành{' '}
                                <span className={styles.highlight}>
                                    {(dailyPlan?.completionPercentage || 0).toFixed(2)}%
                                </span>{' '}
                                kế hoạch.
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
                                                {isCurrentDay ? 'Nay' : getDayLabel(date)}
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
                                    <h3>Calories</h3>
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
                                                    Còn lại {Math.round(remaining)} kcal
                                                </p>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>

                            {/* Macros Breakdown */}
                            <div className={styles.macrosCard}>
                                <h3>Dinh dưỡng (Macros)</h3>
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
                                    <h3>Nước uống</h3>
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
                                    + Thêm ly nước (250ml)
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
                                            <h3>Thực đơn hôm nay</h3>
                                            <p>Đề xuất bởi Medcure AI</p>
                                        </div>
                                    </div>
                                    <button
                                        className={styles.detailBtn}
                                        onClick={handleNavigateToMealPlan}
                                    >
                                        Xem chi tiết
                                    </button>
                                </div>

                                <div className={styles.mealTimeline}>
                                    {!dailyPlan?.mealPlan ? (
                                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                                            <p>Chưa có kế hoạch cho ngày này</p>
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
                                                            Không thể tạo kế hoạch cho ngày trong
                                                            quá khứ
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
                                                            ? 'Đang tạo...'
                                                            : 'Tạo kế hoạch'}
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
                                            const mealTypeMap: { [key: string]: string } = {
                                                Breakfast: 'Bữa sáng',
                                                Lunch: 'Bữa trưa',
                                                Dinner: 'Bữa tối',
                                                Snack: 'Bữa phụ',
                                            };
                                            return (
                                                <div key={index} className={styles.mealItem}>
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
                                                                    {mealTypeMap[meal.mealType] ||
                                                                        meal.mealType}{' '}
                                                                    • {meal.mealTime}
                                                                </span>
                                                                <h4>{meal.recipe.nameVi}</h4>
                                                                {meal.recipe.descriptionVi && (
                                                                    <p>
                                                                        {meal.recipe.descriptionVi}
                                                                    </p>
                                                                )}
                                                                <div className={styles.mealTags}>
                                                                    <span>
                                                                        {Math.round(
                                                                            meal.recipe.nutrition
                                                                                .calories
                                                                        )}{' '}
                                                                        Kcal
                                                                    </span>
                                                                    {meal.recipe.nutrition
                                                                        .proteinG > 20 && (
                                                                        <span>Giàu protein</span>
                                                                    )}
                                                                    {meal.recipe.nutrition.fiberG &&
                                                                        meal.recipe.nutrition
                                                                            .fiberG > 5 && (
                                                                            <span>
                                                                                Giàu chất xơ
                                                                            </span>
                                                                        )}
                                                                </div>
                                                            </div>
                                                            <input
                                                                type="checkbox"
                                                                checked={isCompleted}
                                                                onChange={() =>
                                                                    handleCompleteMeal(index)
                                                                }
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
                                            <h3>Kế hoạch tập luyện</h3>
                                            <p>
                                                Mục tiêu:{' '}
                                                {profile?.healthGoal === 'WeightLoss'
                                                    ? 'Giảm cân'
                                                    : profile?.healthGoal === 'MuscleGain'
                                                      ? 'Tăng cơ'
                                                      : 'Duy trì sức khỏe'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        className={styles.startBtn}
                                        onClick={handleNavigateToWorkoutPlan}
                                    >
                                        Xem chi tiết
                                    </button>
                                </div>

                                <div className={styles.exerciseList}>
                                    {!dailyPlan?.workoutPlan ? (
                                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                                            <p>Chưa có kế hoạch tập luyện</p>
                                        </div>
                                    ) : (
                                        dailyPlan.workoutPlan.exercises.map((exercise, index) => {
                                            const isCompleted =
                                                dailyPlan.workoutPlan?.completedItems?.includes(
                                                    index
                                                ) || false;
                                            return (
                                                <div key={index} className={styles.exerciseItem}>
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
                                                        <h4>{exercise.nameVi}</h4>
                                                        <p>
                                                            {exercise.durationMinutes} phút •{' '}
                                                            {exercise.caloriesBurned || 0} kcal
                                                        </p>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={isCompleted}
                                                        onChange={() =>
                                                            handleCompleteExercise(index)
                                                        }
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
                                    <h3>Cân nặng</h3>
                                    <button
                                        className={styles.updateBtn}
                                        onClick={() => navigate(PATHS.NUTRITION.ONBOARDING)}
                                    >
                                        + Cập nhật
                                    </button>
                                </div>
                                <div className={styles.weightValue}>
                                    <span className={styles.weight}>
                                        {profile?.weightKg || 65.2}
                                    </span>
                                    <span className={styles.unit}>kg</span>
                                    <span className={styles.change}>{profile?.age || 25} tuổi</span>
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
                                        <p className={styles.streakLabel}>Chuỗi ngày</p>
                                        <h3 className={styles.streakValue}>
                                            {progressStats?.streakCount
                                                ? `${progressStats.streakCount} ngày`
                                                : 'Chưa bắt đầu'}
                                        </h3>
                                        <p className={styles.streakMessage}>
                                            {progressStats?.streakCount &&
                                            progressStats.streakCount > 0
                                                ? 'Bạn đang làm rất tốt! 🔥'
                                                : 'Hãy bắt đầu chuỗi ngày của bạn!'}
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
                                    <h3>AI Nhận xét</h3>
                                </div>
                                <p>
                                    "So với hôm qua, bạn đã nạp ít Protein hơn một chút. Hãy cố gắng
                                    hoàn thành món cá hồi vào bữa tối để đạt mục tiêu nhé!"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default RoadmapDashboard;
