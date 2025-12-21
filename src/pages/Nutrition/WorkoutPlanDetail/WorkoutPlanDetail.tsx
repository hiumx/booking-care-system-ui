import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb, { BreadcrumbItem } from '@/components/Breadcrumb/Breadcrumb';
import NutritionSkeleton from '@/components/Loading/NutritionSkeleton';
import { nutritionService } from '@/services/nutrition.service';
import { WorkoutPlan } from '@/types/nutrition.types';
import { PATHS } from '@/routes/paths';
import styles from './WorkoutPlanDetail.module.scss';

const WorkoutPlanDetail: React.FC = () => {
    const navigate = useNavigate();
    const { date } = useParams<{ date: string }>();
    const { t, i18n } = useTranslation('nutrition');
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    useEffect(() => {
        // Update selectedDate from URL param
        if (date) {
            setSelectedDate(new Date(date));
        }
        loadData();
    }, [date]);

    const loadData = async () => {
        try {
            setLoading(true);
            const dateStr = date || new Date().toISOString().split('T')[0];

            const dailyPlan = await nutritionService.getDailyPlan(dateStr);
            setWorkoutPlan(dailyPlan.workoutPlan || null);
        } catch {
            console.error('Error loading workout plan');
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteExercise = async (exerciseIndex: number) => {
        if (!workoutPlan) return;

        try {
            const updatedWorkoutPlan = await nutritionService.completeExercise(
                workoutPlan.id,
                exerciseIndex
            );
            setWorkoutPlan(updatedWorkoutPlan);
        } catch {
            console.error('Error completing exercise');
        }
    };

    // Calculate completed exercises count
    const getCompletedExercisesCount = () => {
        if (!workoutPlan) return 0;
        return workoutPlan.completedItems?.length || 0;
    };

    // Calculate total calories burned from completed exercises
    const getCaloriesBurned = () => {
        if (!workoutPlan) return 0;

        let totalCalories = 0;
        workoutPlan.exercises.forEach((exercise, index) => {
            if (workoutPlan.completedItems?.includes(index)) {
                totalCalories += exercise.caloriesBurned || 0;
            }
        });

        return totalCalories;
    };

    // Format calories for display (e.g., 1200 -> 1.2k)
    const formatCalories = (calories: number) => {
        if (calories >= 1000) {
            return `${(calories / 1000).toFixed(1)}k`;
        }
        return calories.toString();
    };

    // Calculate total duration from all exercises
    const getTotalDuration = () => {
        if (!workoutPlan) return 0;

        let totalDuration = 0;
        workoutPlan.exercises.forEach((exercise) => {
            totalDuration += exercise.durationMinutes || 0;
        });

        return totalDuration || workoutPlan.durationMinutes; // Fallback to plan duration
    };

    // Calculate total calories from all exercises
    const getTotalCalories = () => {
        if (!workoutPlan) return 0;

        let totalCalories = 0;
        workoutPlan.exercises.forEach((exercise) => {
            totalCalories += exercise.caloriesBurned || 0;
        });

        return totalCalories || workoutPlan.estimatedCaloriesBurned; // Fallback to plan calories
    };

    const handleDateChange = (days: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + days);
        setSelectedDate(newDate);
        navigate(`/nutrition/workout-plan/${newDate.toISOString().split('T')[0]}`);
    };

    // Get average intensity level
    const getAverageIntensity = () => {
        if (!workoutPlan || workoutPlan.exercises.length === 0) return t('intensity.medium');

        const intensityMap: { [key: string]: number } = {
            low: 1,
            medium: 2,
            high: 3,
        };

        let totalIntensity = 0;
        let count = 0;

        workoutPlan.exercises.forEach((exercise) => {
            if (exercise.intensity) {
                totalIntensity += intensityMap[exercise.intensity.toLowerCase()] || 2;
                count++;
            }
        });

        if (count === 0) return t('intensity.medium');

        const avgIntensity = totalIntensity / count;
        if (avgIntensity <= 1.5) return t('intensity.low');
        if (avgIntensity <= 2.5) return t('intensity.medium');
        return t('intensity.high');
    };

    const getIntensityColor = (intensity?: string) => {
        switch (intensity?.toLowerCase()) {
            case 'low':
                return '#10b981';
            case 'medium':
                return '#f59e0b';
            case 'high':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    const getIntensityLabel = (intensity?: string) => {
        switch (intensity?.toLowerCase()) {
            case 'low':
                return t('intensity.low');
            case 'medium':
                return t('intensity.medium');
            case 'high':
                return t('intensity.high');
            default:
                return t('intensity.medium');
        }
    };

    const breadcrumbItems: BreadcrumbItem[] = [
        { label: t('breadcrumb.home'), path: PATHS.HOME },
        { label: t('breadcrumb.yourHealth'), path: PATHS.NUTRITION.DASHBOARD },
        { label: t('breadcrumb.workoutPlanDetail'), isActive: true },
    ];

    if (loading) {
        return (
            <MainLayout>
                <Breadcrumb items={breadcrumbItems} title={t('workoutPlanDetail.title')} />
                <NutritionSkeleton type="workoutPlan" />
            </MainLayout>
        );
    }

    if (!workoutPlan) {
        return (
            <MainLayout>
                <Breadcrumb items={breadcrumbItems} title={t('workoutPlanDetail.title')} />
                <div className={styles.noData}>
                    <h2>{t('workoutPlanDetail.noData')}</h2>
                    <button onClick={() => navigate(PATHS.NUTRITION.DASHBOARD)}>
                        {t('common.backToDashboard')}
                    </button>
                </div>
            </MainLayout>
        );
    }

    const completedCount = workoutPlan.completedItems?.length || 0;
    const totalCount = workoutPlan.exercises.length;
    const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbItems} title={t('workoutPlanDetail.title')} />

            <div className={styles.workoutPlanDetail}>
                {/* Hero Header Section */}
                <section className={styles.heroSection}>
                    <div className={styles.heroContainer}>
                        <div className={styles.heroContent}>
                            <div className={styles.heroLeft}>
                                <span className={styles.badge}>{t('workoutPlanDetail.badge')}</span>
                                <h1>{t('workoutPlanDetail.heroTitle')}</h1>
                                <p>{t('workoutPlanDetail.heroDescription')}</p>
                            </div>

                            <div className={styles.calorieCard}>
                                <div className={styles.calorieItem}>
                                    <p className={styles.label}>
                                        {t('workoutPlanDetail.dailyGoal')}
                                    </p>
                                    <p className={styles.value}>
                                        {getTotalCalories()} <span>{t('common.kcal')}</span>
                                    </p>
                                </div>
                                <div className={styles.divider}></div>
                                <div className={styles.calorieItem}>
                                    <p className={styles.label}>{t('workoutPlanDetail.burned')}</p>
                                    <p className={`${styles.value} ${styles.consumed}`}>
                                        {getCaloriesBurned()} <span>{t('common.kcal')}</span>
                                    </p>
                                </div>
                                <div className={styles.progressRing}>
                                    <span className={styles.percentage}>
                                        {Math.round(
                                            (getCaloriesBurned() / (getTotalCalories() || 1)) * 100
                                        )}
                                        %
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content Section */}
                <section className={styles.mainSection}>
                    <div className={styles.container}>
                        {/* Date Navigation */}
                        <div className={styles.dateNav}>
                            <button className={styles.navBtn} onClick={() => handleDateChange(-1)}>
                                <span className="material-icons">chevron_left</span>
                            </button>
                            <div className={styles.dateDisplay}>
                                <h2>
                                    {(() => {
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        const selected = new Date(selectedDate);
                                        selected.setHours(0, 0, 0, 0);
                                        const isToday = selected.getTime() === today.getTime();
                                        const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';

                                        return isToday
                                            ? `${t('common.today')}, ${selectedDate.toLocaleDateString(locale, { day: 'numeric', month: 'short' })}`
                                            : selectedDate.toLocaleDateString(locale, {
                                                  weekday: 'long',
                                                  day: 'numeric',
                                                  month: 'short',
                                              });
                                    })()}
                                </h2>
                                <p onClick={() => navigate(PATHS.NUTRITION.DASHBOARD)}>
                                    {t('common.viewWeekOverview')}
                                </p>
                            </div>
                            <button className={styles.navBtn} onClick={() => handleDateChange(1)}>
                                <span className="material-icons">chevron_right</span>
                            </button>
                        </div>

                        {/* Main Grid Layout */}
                        <div className={styles.gridLayout}>
                            {/* Left Column - Main Content */}
                            <div className={styles.mainContent}>
                                {/* Workout Card */}
                                <div className={styles.workoutCard}>
                                    <div className={styles.workoutHeader}>
                                        <div>
                                            <span className={styles.categoryBadge}>
                                                {t('workoutPlanDetail.categoryBadge')}
                                            </span>
                                            <h2>
                                                {workoutPlan.workoutType ||
                                                    t('workoutPlanDetail.defaultWorkoutType')}
                                            </h2>
                                            <div className={styles.workoutMeta}>
                                                <span>
                                                    <span className="material-icons">timer</span>{' '}
                                                    {getTotalDuration()} {t('common.minutes')}
                                                </span>
                                                <span>
                                                    <span className="material-symbols-outlined">
                                                        local_fire_department
                                                    </span>{' '}
                                                    {getTotalCalories()} {t('common.kcal')}
                                                </span>
                                                <span>
                                                    <span className="material-icons">
                                                        fitness_center
                                                    </span>{' '}
                                                    {getAverageIntensity()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={styles.coachInfo}>
                                            <div className={styles.coachLabel}>
                                                {t('workoutPlanDetail.coach')}
                                            </div>
                                            <div className={styles.coachProfile}>
                                                <img
                                                    src="https://img.freepik.com/premium-psd/happy-robot-3d-ai-character-chat-bot-mascot-gpt-chatbot-icon-artificial-intelligence_95505-496.jpg?semt=ais_incoming&w=740&q=80"
                                                    alt="Coach"
                                                />
                                                <span>{t('workoutPlanDetail.aiCoach')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Recommendation */}
                                    <div className={styles.aiRecommendation}>
                                        <span className="material-symbols-outlined">
                                            auto_awesome
                                        </span>
                                        <div>
                                            <h4>{t('workoutPlanDetail.aiRecommendation')}</h4>
                                            <p>{t('workoutPlanDetail.aiRecommendationText')}</p>
                                        </div>
                                    </div>

                                    {/* Exercise List */}
                                    <div className={styles.exerciseSection}>
                                        <h3>{t('workoutPlanDetail.todayExercises')}</h3>

                                        <div className={styles.exerciseList}>
                                            {workoutPlan.exercises.map((exercise, index) => {
                                                const isCompleted =
                                                    workoutPlan.completedItems?.includes(index);

                                                return (
                                                    <div
                                                        key={index}
                                                        className={`${styles.exerciseItem} ${isCompleted ? styles.completed : ''}`}
                                                        onClick={() =>
                                                            handleCompleteExercise(index)
                                                        }
                                                    >
                                                        <div className={styles.exerciseImage}>
                                                            <img
                                                                src={
                                                                    exercise.imageUrl ||
                                                                    `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150`
                                                                }
                                                                alt={exercise.nameVi}
                                                            />
                                                            {exercise.videoUrl && (
                                                                <div className={styles.playOverlay}>
                                                                    <a
                                                                        href={exercise.videoUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        <span className="material-icons">
                                                                            play_circle
                                                                        </span>
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className={styles.exerciseInfo}>
                                                            <h4>{exercise.nameVi}</h4>
                                                            <p>
                                                                {exercise.descriptionVi ||
                                                                    exercise.nameEn}
                                                            </p>
                                                            {exercise.targetMuscles && (
                                                                <div
                                                                    className={styles.targetMuscles}
                                                                >
                                                                    <span className="material-icons">
                                                                        fitness_center
                                                                    </span>
                                                                    <span>
                                                                        {exercise.targetMuscles}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <div className={styles.exerciseMeta}>
                                                                <span className={styles.metaBadge}>
                                                                    {exercise.sets} Sets
                                                                </span>
                                                                <span className={styles.metaBadge}>
                                                                    {exercise.reps} Reps
                                                                </span>
                                                                {exercise.intensity && (
                                                                    <span
                                                                        className={styles.metaBadge}
                                                                        style={{
                                                                            background:
                                                                                getIntensityColor(
                                                                                    exercise.intensity
                                                                                ),
                                                                            color: '#fff',
                                                                        }}
                                                                    >
                                                                        {getIntensityLabel(
                                                                            exercise.intensity
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div
                                                            className={styles.checkboxWrapper}
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={isCompleted}
                                                                onChange={() =>
                                                                    handleCompleteExercise(index)
                                                                }
                                                                className={styles.checkbox}
                                                                id={`exercise-checkbox-${index}`}
                                                            />
                                                            <label
                                                                htmlFor={`exercise-checkbox-${index}`}
                                                                className={styles.checkboxLabel}
                                                            >
                                                                <span className={styles.checkmark}>
                                                                    {isCompleted && (
                                                                        <span className="material-icons">
                                                                            check
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Footer */}
                                        <div className={styles.workoutFooter}>
                                            <div className={styles.footerInfo}>
                                                {t('workoutPlanDetail.completedExercises', {
                                                    completed: completedCount,
                                                    total: totalCount,
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Sidebar */}
                            <div className={styles.sidebar}>
                                {/* Weekly Progress */}
                                <div className={styles.progressCard}>
                                    <h3>{t('workoutPlanDetail.trainingProgress')}</h3>
                                    <div className={styles.progressRing}>
                                        <svg viewBox="0 0 100 100">
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="40"
                                                fill="none"
                                                stroke="#e5e7eb"
                                                strokeWidth="8"
                                            />
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="40"
                                                fill="none"
                                                stroke="#0ea5e9"
                                                strokeWidth="8"
                                                strokeDasharray={`${completionPercentage * 2.51} 251`}
                                                strokeLinecap="round"
                                                transform="rotate(-90 50 50)"
                                            />
                                        </svg>
                                        <div className={styles.progressText}>
                                            <span className={styles.percentage}>
                                                {Math.round(completionPercentage)}%
                                            </span>
                                            <span className={styles.label}>
                                                {t('workoutPlanDetail.goalAchieved')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.statsGrid}>
                                        <div className={styles.statBox}>
                                            <div className={styles.statValue}>
                                                {getCompletedExercisesCount()}
                                            </div>
                                            <div className={styles.statLabel}>
                                                {t('workoutPlanDetail.exercisesDone')}
                                            </div>
                                        </div>
                                        <div className={styles.statBox}>
                                            <div className={styles.statValue}>
                                                {formatCalories(getCaloriesBurned())}
                                            </div>
                                            <div className={styles.statLabel}>
                                                {t('workoutPlanDetail.caloriesBurned')}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Upcoming Workouts */}
                                <div className={styles.upcomingCard}>
                                    <div className={styles.upcomingHeader}>
                                        <h3>{t('workoutPlanDetail.postWorkoutStretches')}</h3>
                                    </div>
                                    <div className={styles.upcomingList}>
                                        <div className={styles.upcomingItem}>
                                            <div
                                                className={`${styles.upcomingContent} ${styles.purple}`}
                                            >
                                                <div className={styles.upcomingTitle}>
                                                    {t('workoutPlanDetail.gluteHipStretch')}
                                                </div>
                                                <div className={styles.upcomingTime}>
                                                    {t('workoutPlanDetail.gluteHipStretchDesc')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.upcomingItem}>
                                            <div
                                                className={`${styles.upcomingContent} ${styles.blue}`}
                                            >
                                                <div className={styles.upcomingTitle}>
                                                    Giãn lưng dưới
                                                </div>
                                                <div className={styles.upcomingTime}>
                                                    Nên làm sau deadlift, squat • 30 giây
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.upcomingItem}>
                                            <div
                                                className={`${styles.upcomingContent} ${styles.orange}`}
                                            >
                                                <div className={styles.upcomingTitle}>
                                                    Giãn ngực & vai
                                                </div>
                                                <div className={styles.upcomingTime}>
                                                    Chống gù vai sau tập đẩy, push-up • 20–30 giây
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.upcomingItem}>
                                            <div
                                                className={`${styles.upcomingContent} ${styles.purple}`}
                                            >
                                                <div className={styles.upcomingTitle}>Giãn cổ</div>
                                                <div className={styles.upcomingTime}>
                                                    Giảm mỏi cổ vai gáy • 10–15 giây mỗi hướng
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.upcomingItem}>
                                            <div
                                                className={`${styles.upcomingContent} ${styles.blue}`}
                                            >
                                                <div className={styles.upcomingTitle}>
                                                    Giãn cơ tay sau
                                                </div>
                                                <div className={styles.upcomingTime}>
                                                    Sau tập tay, vai, ngực • 20–30 giây mỗi bên
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.upcomingItem}>
                                            <div
                                                className={`${styles.upcomingContent} ${styles.orange}`}
                                            >
                                                <div className={styles.upcomingTitle}>
                                                    Giãn cơ đùi trước
                                                </div>
                                                <div className={styles.upcomingTime}>
                                                    Giảm căng cơ đùi sau squat, chạy bộ • 20–30 giây
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Hydration Card */}
                                <div className={styles.hydrationCard}>
                                    <span className="material-icons">water_drop</span>
                                    <h3>Lượng nước uống</h3>
                                    <p>Bạn đang làm rất tốt!</p>
                                    <div className={styles.hydrationValue}>
                                        <span className={styles.current}>1.5</span>
                                        <span className={styles.target}>/ 2.5 L</span>
                                    </div>
                                    <div className={styles.hydrationProgress}>
                                        <div
                                            className={styles.hydrationBar}
                                            style={{ width: '60%' }}
                                        ></div>
                                    </div>
                                    <button className={styles.addWaterBtn}>
                                        <span className="material-icons">add</span>
                                        Thêm nước
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
};

export default WorkoutPlanDetail;
