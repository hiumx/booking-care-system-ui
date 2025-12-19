import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
        if (!workoutPlan || workoutPlan.exercises.length === 0) return 'Trung bình';

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

        if (count === 0) return 'Trung bình';

        const avgIntensity = totalIntensity / count;
        if (avgIntensity <= 1.5) return 'Nhẹ';
        if (avgIntensity <= 2.5) return 'Trung bình';
        return 'Cao';
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
                return 'Nhẹ';
            case 'medium':
                return 'Trung bình';
            case 'high':
                return 'Cao';
            default:
                return 'Trung bình';
        }
    };

    const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Trang chủ', path: PATHS.HOME },
        { label: 'Sức khỏe của bạn', path: PATHS.NUTRITION.DASHBOARD },
        { label: 'Kế hoạch tập luyện', isActive: true },
    ];

    if (loading) {
        return (
            <MainLayout>
                <Breadcrumb items={breadcrumbItems} title="Kế hoạch tập luyện" />
                <NutritionSkeleton type="workoutPlan" />
            </MainLayout>
        );
    }

    if (!workoutPlan) {
        return (
            <MainLayout>
                <Breadcrumb items={breadcrumbItems} title="Kế hoạch tập luyện" />
                <div className={styles.noData}>
                    <h2>Không có kế hoạch tập luyện cho ngày này</h2>
                    <button onClick={() => navigate(PATHS.NUTRITION.DASHBOARD)}>
                        Quay lại Dashboard
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
            <Breadcrumb items={breadcrumbItems} title="Kế hoạch tập luyện" />

            <div className={styles.workoutPlanDetail}>
                {/* Hero Header Section */}
                <section className={styles.heroSection}>
                    <div className={styles.heroContainer}>
                        <div className={styles.heroContent}>
                            <div className={styles.heroLeft}>
                                <span className={styles.badge}>Kế hoạch tập luyện AI</span>
                                <h1>Lộ trình tập luyện hàng ngày của bạn</h1>
                                <p>
                                    Theo dõi kế hoạch tập luyện cá nhân hóa được tạo bởi AI dựa trên
                                    mục tiêu sức khỏe của bạn. Duy trì nhất quán để đạt được thể
                                    trạng mục tiêu.
                                </p>
                            </div>

                            <div className={styles.calorieCard}>
                                <div className={styles.calorieItem}>
                                    <p className={styles.label}>Mục tiêu hàng ngày</p>
                                    <p className={styles.value}>
                                        {getTotalCalories()} <span>kcal</span>
                                    </p>
                                </div>
                                <div className={styles.divider}></div>
                                <div className={styles.calorieItem}>
                                    <p className={styles.label}>Đã đốt cháy</p>
                                    <p className={`${styles.value} ${styles.consumed}`}>
                                        {getCaloriesBurned()} <span>kcal</span>
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

                                        return isToday
                                            ? `Hôm nay, ${selectedDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' })}`
                                            : selectedDate.toLocaleDateString('vi-VN', {
                                                  weekday: 'long',
                                                  day: 'numeric',
                                                  month: 'short',
                                              });
                                    })()}
                                </h2>
                                <p onClick={() => navigate(PATHS.NUTRITION.DASHBOARD)}>
                                    Xem tổng quan tuần
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
                                                Sức mạnh & Linh hoạt
                                            </span>
                                            <h2>
                                                {workoutPlan.workoutType || 'Sức mạnh thượng thân'}
                                            </h2>
                                            <div className={styles.workoutMeta}>
                                                <span>
                                                    <span className="material-icons">timer</span>{' '}
                                                    {getTotalDuration()} phút
                                                </span>
                                                <span>
                                                    <span className="material-symbols-outlined">
                                                        local_fire_department
                                                    </span>{' '}
                                                    {getTotalCalories()} kcal
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
                                            <div className={styles.coachLabel}>Huấn luyện viên</div>
                                            <div className={styles.coachProfile}>
                                                <img
                                                    src="https://img.freepik.com/premium-psd/happy-robot-3d-ai-character-chat-bot-mascot-gpt-chatbot-icon-artificial-intelligence_95505-496.jpg?semt=ais_incoming&w=740&q=80"
                                                    alt="Coach"
                                                />
                                                <span>Medcure AI</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Recommendation */}
                                    <div className={styles.aiRecommendation}>
                                        <span className="material-symbols-outlined">
                                            auto_awesome
                                        </span>
                                        <div>
                                            <h4>Khuyến nghị từ AI</h4>
                                            <p>
                                                Kế hoạch tập hôm nay được tinh chỉnh linh hoạt nhằm
                                                cân bằng giữa hiệu quả luyện tập và khả năng phục
                                                hồi của cơ thể. Các bài tập được sắp xếp hợp lý để
                                                bạn duy trì cường độ cần thiết, đồng thời hạn chế áp
                                                lực không cần thiết, giúp bạn tiếp tục tiến bộ một
                                                cách bền vững.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Exercise List */}
                                    <div className={styles.exerciseSection}>
                                        <h3>Bài tập hôm nay</h3>

                                        <div className={styles.exerciseList}>
                                            {workoutPlan.exercises.map((exercise, index) => {
                                                const isCompleted =
                                                    workoutPlan.completedItems?.includes(index);

                                                return (
                                                    <div
                                                        key={index}
                                                        className={`${styles.exerciseItem} ${isCompleted ? styles.completed : ''}`}
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

                                                        <label className={styles.checkboxLabel}>
                                                            <input
                                                                type="checkbox"
                                                                checked={isCompleted}
                                                                onChange={() =>
                                                                    handleCompleteExercise(index)
                                                                }
                                                            />
                                                            <div className={styles.checkboxCustom}>
                                                                {isCompleted && (
                                                                    <span className="material-icons">
                                                                        check
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span>
                                                                {isCompleted
                                                                    ? 'Đã xong'
                                                                    : 'Đánh dấu xong'}
                                                            </span>
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Footer */}
                                        <div className={styles.workoutFooter}>
                                            <div className={styles.footerInfo}>
                                                Đã hoàn thành {completedCount}/{totalCount} bài tập
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Sidebar */}
                            <div className={styles.sidebar}>
                                {/* Weekly Progress */}
                                <div className={styles.progressCard}>
                                    <h3>Tiến độ tập luyện</h3>
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
                                            <span className={styles.label}>Đạt mục tiêu</span>
                                        </div>
                                    </div>
                                    <div className={styles.statsGrid}>
                                        <div className={styles.statBox}>
                                            <div className={styles.statValue}>
                                                {getCompletedExercisesCount()}
                                            </div>
                                            <div className={styles.statLabel}>Bài tập đã xong</div>
                                        </div>
                                        <div className={styles.statBox}>
                                            <div className={styles.statValue}>
                                                {formatCalories(getCaloriesBurned())}
                                            </div>
                                            <div className={styles.statLabel}>Calo đã đốt</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Upcoming Workouts */}
                                <div className={styles.upcomingCard}>
                                    <div className={styles.upcomingHeader}>
                                        <h3>Các bài giãn cơ sau buổi tập</h3>
                                    </div>
                                    <div className={styles.upcomingList}>
                                        <div className={styles.upcomingItem}>
                                            <div
                                                className={`${styles.upcomingContent} ${styles.purple}`}
                                            >
                                                <div className={styles.upcomingTitle}>
                                                    Giãn cơ mông & hông
                                                </div>
                                                <div className={styles.upcomingTime}>
                                                    Giảm áp lực hông, lưng dưới • 20–30 giây mỗi bên
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
