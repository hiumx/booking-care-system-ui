import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb, { BreadcrumbItem } from '@/components/Breadcrumb/Breadcrumb';
import { nutritionService } from '@/services/nutrition.service';
import { DailyPlan, NutritionProfile, ProgressStats } from '@/types/nutrition.types';
import { PATHS } from '@/routes/paths';
import MealCard from './components/MealCard';
import ExerciseCard from './components/ExerciseCard';
import ProgressCircle from './components/ProgressCircle';
import MacroBar from './components/MacroBar';
import StreakBadge from './components/StreakBadge';
import WeeklyChart from './components/WeeklyChart';
import './RoadmapDashboard.scss';

const RoadmapDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<NutritionProfile | null>(null);
    const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
    const [progressStats, setProgressStats] = useState<ProgressStats | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        loadData();
    }, [selectedDate]);

    const loadData = async () => {
        try {
            setLoading(true);

            // Load profile
            try {
                console.log('Loading nutrition profile...');
                const profileData = await nutritionService.getProfile();
                console.log('Profile loaded successfully:', profileData);
                setProfile(profileData);
            } catch (error: any) {
                console.error('Error loading profile:', error);
                console.error('Error status:', error.response?.status);
                console.error('Error message:', error.response?.data?.message);

                if (error.response?.status === 404) {
                    // No profile found, redirect to onboarding
                    console.log('No profile found, redirecting to onboarding');
                    navigate(PATHS.NUTRITION.ONBOARDING);
                    return;
                }
                throw error;
            }

            // Load daily plan
            const dateStr = selectedDate.toISOString().split('T')[0];
            try {
                const planData = await nutritionService.getDailyPlan(dateStr);
                console.log('Daily plan loaded:', planData);
                setDailyPlan(planData);
            } catch (error: any) {
                console.log('No daily plan found for date:', dateStr);
                // If no plan exists, set null
                if (error.response?.status === 404) {
                    setDailyPlan(null);
                } else {
                    console.error('Error loading daily plan:', error);
                    setDailyPlan(null);
                }
            }

            // Load progress stats
            try {
                const statsData = await nutritionService.getProgressStats();
                setProgressStats(statsData);
            } catch (error: any) {
                console.error('Error loading progress stats:', error);
                // Continue even if stats fail
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

            // Kiểm tra profile trước
            if (!profile) {
                console.error('No profile in state, trying to reload...');

                // Thử load lại profile
                try {
                    const profileData = await nutritionService.getProfile();
                    console.log('Profile reloaded:', profileData);
                    setProfile(profileData);
                } catch (error: any) {
                    console.error('Failed to reload profile:', error);
                    alert('Bạn cần hoàn thành thông tin cá nhân trước!');
                    navigate(PATHS.NUTRITION.ONBOARDING);
                    return;
                }
            }

            // Luôn tạo plan cho hôm nay
            const today = new Date();
            const dateStr = today.toISOString().split('T')[0];

            console.log('Generating plan for today:', dateStr);
            const planData = await nutritionService.generateDailyPlan(dateStr);
            console.log('Plan generated successfully:', planData);
            console.log('Plan has mealPlan?', !!planData?.mealPlan);
            console.log('Plan has workoutPlan?', !!planData?.workoutPlan);
            console.log('MealPlan meals count:', planData?.mealPlan?.meals?.length);
            console.log('WorkoutPlan exercises count:', planData?.workoutPlan?.exercises?.length);

            // Chuyển về hôm nay nếu đang ở ngày khác
            if (selectedDate.toDateString() !== today.toDateString()) {
                console.log('Switching to today from:', selectedDate.toDateString());
                setSelectedDate(today);
            }

            console.log('Setting dailyPlan state with:', planData);
            setDailyPlan(planData);
            console.log('dailyPlan state updated');

            // Reload progress stats after generation
            try {
                const statsData = await nutritionService.getProgressStats();
                setProgressStats(statsData);
            } catch (error) {
                console.error('Error reloading progress stats:', error);
            }
        } catch (error: any) {
            console.error('Error generating plan:', error);

            // Kiểm tra nếu lỗi là do không có profile
            if (error.response?.data?.message?.includes('Nutrition profile not found')) {
                alert('Bạn cần hoàn thành thông tin cá nhân trước!');
                navigate(PATHS.NUTRITION.ONBOARDING);
            } else {
                alert('Có lỗi xảy ra khi tạo kế hoạch. Vui lòng thử lại!');
            }
        } finally {
            setGenerating(false);
        }
    };

    const handleCompleteMeal = async (mealPlanId: string, mealIndex: number) => {
        try {
            const updatedMealPlan = await nutritionService.completeMeal(mealPlanId, mealIndex);
            if (dailyPlan) {
                setDailyPlan({
                    ...dailyPlan,
                    mealPlan: updatedMealPlan,
                });
            }
            // Reload progress stats
            const statsData = await nutritionService.getProgressStats();
            setProgressStats(statsData);
        } catch (error) {
            console.error('Error completing meal:', error);
        }
    };

    const handleCompleteExercise = async (workoutPlanId: string, exerciseIndex: number) => {
        try {
            const updatedWorkoutPlan = await nutritionService.completeExercise(
                workoutPlanId,
                exerciseIndex
            );
            if (dailyPlan) {
                setDailyPlan({
                    ...dailyPlan,
                    workoutPlan: updatedWorkoutPlan,
                });
            }
            // Reload progress stats
            const statsData = await nutritionService.getProgressStats();
            setProgressStats(statsData);
        } catch (error) {
            console.error('Error completing exercise:', error);
        }
    };

    const handleDateChange = (days: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + days);
        setSelectedDate(newDate);
    };

    const isToday = selectedDate.toDateString() === new Date().toDateString();

    const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Trang chủ', path: PATHS.HOME },
        { label: 'Lộ trình Sức khỏe', isActive: true },
    ];

    if (loading) {
        return (
            <MainLayout>
                <Breadcrumb items={breadcrumbItems} title="Lộ trình Sức khỏe" />
                <div className="roadmap-dashboard loading">
                    <div className="spinner">Đang tải...</div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbItems} title="Lộ trình Sức khỏe" />
            <div className="roadmap-dashboard">
                <div className="dashboard-container">
                    {/* Header */}
                    <div className="dashboard-header">
                        <div className="greeting">
                            <h1>Chào {profile?.userId}, đây là kế hoạch hôm nay của bạn!</h1>
                            {progressStats && (
                                <StreakBadge streakCount={progressStats.streakCount} />
                            )}
                        </div>

                        <div className="date-selector">
                            <button onClick={() => handleDateChange(-1)}>←</button>
                            <span className="selected-date">
                                {selectedDate.toLocaleDateString('vi-VN', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                            <button onClick={() => handleDateChange(1)} disabled={!isToday}>
                                →
                            </button>
                        </div>

                        {dailyPlan && (
                            <ProgressCircle
                                percentage={dailyPlan.completionPercentage}
                                size={120}
                            />
                        )}
                    </div>

                    {/* No Plan State */}
                    {!dailyPlan && (
                        <div className="no-plan">
                            <div className="no-plan-content">
                                <h2>Chưa có kế hoạch cho ngày này</h2>
                                {isToday ? (
                                    <>
                                        <p>Tạo kế hoạch dinh dưỡng và tập luyện cho ngày hôm nay</p>
                                        <button
                                            className="btn btn-primary"
                                            onClick={handleGeneratePlan}
                                            disabled={generating}
                                        >
                                            {generating ? 'Đang tạo...' : '✨ Tạo kế hoạch'}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <p>Không có kế hoạch cho ngày này</p>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => setSelectedDate(new Date())}
                                        >
                                            📅 Về hôm nay
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Daily Overview */}
                    {dailyPlan && (
                        <>
                            <div className="daily-overview">
                                <h2>Tổng quan trong ngày</h2>
                                <div className="overview-cards">
                                    <div className="overview-card">
                                        <div className="card-icon">🍽️</div>
                                        <div className="card-content">
                                            <div className="card-label">Calories nạp vào</div>
                                            <div className="card-value">
                                                {dailyPlan.totalCaloriesConsumed} /{' '}
                                                {profile?.targetCalories} kcal
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overview-card">
                                        <div className="card-icon">🔥</div>
                                        <div className="card-content">
                                            <div className="card-label">Calories đốt cháy</div>
                                            <div className="card-value">
                                                {dailyPlan.totalCaloriesBurned} kcal
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {dailyPlan.mealPlan && profile && (
                                    <div className="macros-section">
                                        <h3>Dinh dưỡng đa lượng</h3>
                                        <MacroBar
                                            label="Protein"
                                            current={dailyPlan.mealPlan.totalProteinG}
                                            target={profile.targetProteinG}
                                            unit="g"
                                            color="#ff6b6b"
                                        />
                                        <MacroBar
                                            label="Carbs"
                                            current={dailyPlan.mealPlan.totalCarbsG}
                                            target={profile.targetCarbsG}
                                            unit="g"
                                            color="#4ecdc4"
                                        />
                                        <MacroBar
                                            label="Fat"
                                            current={dailyPlan.mealPlan.totalFatG}
                                            target={profile.targetFatG}
                                            unit="g"
                                            color="#ffe66d"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Meal Plan Section */}
                            {dailyPlan.mealPlan && (
                                <div className="meal-plan-section">
                                    <h2>🍽️ Thực đơn hôm nay</h2>
                                    <div className="meal-timeline">
                                        {dailyPlan.mealPlan.meals.map((meal, index) => (
                                            <MealCard
                                                key={index}
                                                meal={meal}
                                                index={index}
                                                isCompleted={
                                                    dailyPlan.mealPlan?.completedItems?.includes(
                                                        index
                                                    ) || false
                                                }
                                                onComplete={() =>
                                                    handleCompleteMeal(
                                                        dailyPlan.mealPlan!.id,
                                                        index
                                                    )
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Workout Plan Section */}
                            {dailyPlan.workoutPlan && (
                                <div className="workout-plan-section">
                                    <h2>💪 Kế hoạch tập luyện</h2>
                                    <div className="workout-info">
                                        <span className="workout-type">
                                            {dailyPlan.workoutPlan.workoutType}
                                        </span>
                                        <span className="workout-duration">
                                            {dailyPlan.workoutPlan.durationMinutes} phút
                                        </span>
                                    </div>
                                    <div className="exercise-list">
                                        {dailyPlan.workoutPlan.exercises.map((exercise, index) => (
                                            <ExerciseCard
                                                key={index}
                                                exercise={exercise}
                                                index={index}
                                                isCompleted={
                                                    dailyPlan.workoutPlan?.completedItems?.includes(
                                                        index
                                                    ) || false
                                                }
                                                onComplete={() =>
                                                    handleCompleteExercise(
                                                        dailyPlan.workoutPlan!.id,
                                                        index
                                                    )
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Weekly Progress */}
                            {progressStats && (
                                <div className="weekly-progress-section">
                                    <h2>📊 Tiến độ tuần</h2>
                                    <WeeklyChart
                                        weeklyCompletion={progressStats.weeklyCompletion}
                                    />
                                    <div className="progress-summary">
                                        <div className="summary-item">
                                            <span className="summary-label">
                                                Tỷ lệ hoàn thành TB:
                                            </span>
                                            <span className="summary-value">
                                                {progressStats.averageCompletionRate.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="summary-item">
                                            <span className="summary-label">Ngày hoàn thành:</span>
                                            <span className="summary-value">
                                                {progressStats.totalDaysCompleted} / 7 ngày
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default RoadmapDashboard;
