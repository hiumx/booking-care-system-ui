import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb, { BreadcrumbItem } from '@/components/Breadcrumb/Breadcrumb';
import NutritionSkeleton from '@/components/Loading/NutritionSkeleton';
import { nutritionService } from '@/services/nutrition.service';
import { MealPlan, NutritionProfile } from '@/types/nutrition.types';
import { PATHS } from '@/routes/paths';
import styles from './MealPlanDetail.module.scss';
const MealPlanDetail: React.FC = () => {
    const navigate = useNavigate();
    const { date } = useParams<{ date: string }>();
    const { t, i18n } = useTranslation('nutrition');
    const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
    const [profile, setProfile] = useState<NutritionProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    // Calculate consumed calories based on completed meals
    const calculateConsumedCalories = () => {
        if (!mealPlan) return 0;
        let totalConsumed = 0;
        mealPlan.meals.forEach((meal, index) => {
            if (mealPlan.completedItems?.includes(index)) {
                totalConsumed += meal.recipe.nutrition.calories;
            }
        });
        return totalConsumed;
    };
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
            const [profileData, dailyPlan] = await Promise.all([
                nutritionService.getProfile(),
                nutritionService.getDailyPlan(dateStr),
            ]);
            setProfile(profileData);
            setMealPlan(dailyPlan.mealPlan || null);
        } catch {
            console.error('Error loading meal plan');
        } finally {
            setLoading(false);
        }
    };
    const handleCompleteMeal = async (mealIndex: number) => {
        if (!mealPlan) return;
        try {
            const updatedMealPlan = await nutritionService.completeMeal(mealPlan.id, mealIndex);
            setMealPlan(updatedMealPlan);
        } catch {
            console.error('Error completing meal');
        }
    };
    const handleDateChange = (days: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + days);
        setSelectedDate(newDate);
        navigate(`/nutrition/meal-plan/${newDate.toISOString().split('T')[0]}`);
    };
    const getFallbackImage = (mealType: string) => {
        // Use Unsplash food images as fallback
        switch (mealType.toLowerCase()) {
            case 'breakfast':
            case 'bữa sáng':
                return 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400';
            case 'lunch':
            case 'bữa trưa':
                return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
            case 'dinner':
            case 'bữa tối':
                return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400';
            case 'snack':
            case 'bữa phụ':
                return 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400';
            default:
                return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
        }
    };

    const getMealTypeLabel = (mealType: string) => {
        switch (mealType.toLowerCase()) {
            case 'breakfast':
                return t('mealTypes.breakfast');
            case 'lunch':
                return t('mealTypes.lunch');
            case 'dinner':
                return t('mealTypes.dinner');
            case 'snack':
                return t('mealTypes.snack');
            default:
                return mealType;
        }
    };

    const getMealTime = (meal: any) => {
        // Use mealTime from API if available, otherwise fallback to default
        if (meal.mealTime) {
            return meal.mealTime;
        }
        // Fallback based on mealType
        switch (meal.mealType.toLowerCase()) {
            case 'breakfast':
                return '08:00';
            case 'lunch':
                return '12:30';
            case 'dinner':
                return '19:30';
            case 'snack':
                return '16:00';
            default:
                return '';
        }
    };
    const breadcrumbItems: BreadcrumbItem[] = [
        { label: t('breadcrumb.home'), path: PATHS.HOME },
        { label: t('breadcrumb.yourHealth'), path: PATHS.NUTRITION.DASHBOARD },
        { label: t('breadcrumb.mealPlanDetail'), isActive: true },
    ];
    if (loading) {
        return (
            <MainLayout>
                <Breadcrumb items={breadcrumbItems} title={t('mealPlanDetail.title')} />
                <NutritionSkeleton type="mealPlan" />
            </MainLayout>
        );
    }
    if (!mealPlan) {
        return (
            <MainLayout>
                <Breadcrumb items={breadcrumbItems} title={t('mealPlanDetail.title')} />
                <div className={styles.noData}>
                    <h2>{t('mealPlanDetail.noData')}</h2>
                    <button onClick={() => navigate(PATHS.NUTRITION.DASHBOARD)}>
                        {t('common.backToDashboard')}
                    </button>
                </div>
            </MainLayout>
        );
    }
    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbItems} title={t('mealPlanDetail.title')} />
            <div className={styles.mealPlanDetail}>
                {/* Hero Header Section */}
                <section className={styles.heroSection}>
                    <div className={styles.heroContainer}>
                        <div className={styles.heroContent}>
                            <div className={styles.heroLeft}>
                                <span className={styles.badge}>{t('mealPlanDetail.badge')}</span>
                                <h1>{t('mealPlanDetail.heroTitle')}</h1>
                                <p>{t('mealPlanDetail.heroDescription')}</p>
                            </div>
                            <div className={styles.calorieCard}>
                                <div className={styles.calorieItem}>
                                    <p className={styles.label}>{t('mealPlanDetail.dailyGoal')}</p>
                                    <p className={styles.value}>
                                        {profile?.targetCalories || 2100}{' '}
                                        <span>{t('common.kcal')}</span>
                                    </p>
                                </div>
                                <div className={styles.divider}></div>
                                <div className={styles.calorieItem}>
                                    <p className={styles.label}>{t('mealPlanDetail.consumed')}</p>
                                    <p className={`${styles.value} ${styles.consumed}`}>
                                        {calculateConsumedCalories()}{' '}
                                        <span>{t('common.kcal')}</span>
                                    </p>
                                </div>
                                <div className={styles.progressRing}>
                                    <span className={styles.percentage}>
                                        {Math.round(
                                            (calculateConsumedCalories() /
                                                (profile?.targetCalories || 2100)) *
                                                100
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
                        {/* Meals Timeline - Alternating Layout */}
                        <div className={styles.mealsTimeline}>
                            {mealPlan.meals.map((meal, index) => {
                                const isCompleted = mealPlan.completedItems?.includes(index);
                                const isLeft = index % 2 === 0;
                                return (
                                    <div key={index} className={styles.timelineRow}>
                                        {/* Left Side */}
                                        <div className={styles.leftSide}>
                                            {isLeft ? (
                                                <div
                                                    className={`${styles.mealCard} ${isCompleted ? styles.completed : ''}`}
                                                >
                                                    <div className={styles.mealImage}>
                                                        <img
                                                            src={
                                                                meal.recipe.imageUrl ||
                                                                getFallbackImage(meal.mealType)
                                                            }
                                                            alt={meal.recipe.nameVi}
                                                            onError={(e) => {
                                                                const target =
                                                                    e.target as HTMLImageElement;
                                                                target.src = getFallbackImage(
                                                                    meal.mealType
                                                                );
                                                            }}
                                                        />
                                                        <div className={styles.mealBadge}>
                                                            {getMealTypeLabel(meal.mealType)} •{' '}
                                                            {getMealTime(meal)}
                                                        </div>
                                                    </div>
                                                    <div className={styles.mealContent}>
                                                        <div className={styles.mealHeader}>
                                                            <h3>{meal.recipe.nameVi}</h3>
                                                            <span className={styles.calories}>
                                                                {meal.recipe.nutrition.calories}{' '}
                                                                kcal
                                                            </span>
                                                        </div>
                                                        <p className={styles.mealDescription}>
                                                            {meal.recipe.descriptionVi ||
                                                                meal.recipe.nameEn}
                                                        </p>
                                                        {meal.recipe.mainIngredients &&
                                                            meal.recipe.mainIngredients.length >
                                                                0 && (
                                                                <div className={styles.ingredients}>
                                                                    <span
                                                                        className={
                                                                            styles.ingredientsLabel
                                                                        }
                                                                    >
                                                                        Nguyên liệu chính:
                                                                    </span>
                                                                    <span
                                                                        className={
                                                                            styles.ingredientsList
                                                                        }
                                                                    >
                                                                        {meal.recipe.mainIngredients.join(
                                                                            ', '
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        <div className={styles.macros}>
                                                            <div className={styles.macroItem}>
                                                                <span className={styles.macroLabel}>
                                                                    Protein
                                                                </span>
                                                                <span className={styles.macroValue}>
                                                                    {meal.recipe.nutrition.proteinG}
                                                                    g
                                                                </span>
                                                            </div>
                                                            <div className={styles.macroItem}>
                                                                <span className={styles.macroLabel}>
                                                                    Carbs
                                                                </span>
                                                                <span className={styles.macroValue}>
                                                                    {meal.recipe.nutrition.carbsG}g
                                                                </span>
                                                            </div>
                                                            <div className={styles.macroItem}>
                                                                <span className={styles.macroLabel}>
                                                                    Fat
                                                                </span>
                                                                <span className={styles.macroValue}>
                                                                    {meal.recipe.nutrition.fatG}g
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <label className={styles.checkboxLabel}>
                                                            <input
                                                                type="checkbox"
                                                                checked={isCompleted}
                                                                onChange={() =>
                                                                    handleCompleteMeal(index)
                                                                }
                                                                className={styles.checkbox}
                                                            />
                                                            <span>
                                                                {t('mealPlanDetail.markAsEaten')}
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={styles.tipCard}>
                                                    <p>
                                                        "
                                                        {meal.recipe.benefitsVi ||
                                                            t('mealPlanDetail.defaultBenefit')}
                                                        "
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        {/* Center Timeline Dot */}
                                        <div className={styles.timelineCenter}>
                                            <div
                                                className={`${styles.timelineDot} ${isCompleted ? styles.completed : ''}`}
                                            ></div>
                                        </div>
                                        {/* Right Side */}
                                        <div className={styles.rightSide}>
                                            {!isLeft ? (
                                                <div
                                                    className={`${styles.mealCard} ${isCompleted ? styles.completed : ''}`}
                                                >
                                                    <div className={styles.mealImage}>
                                                        <img
                                                            src={
                                                                meal.recipe.imageUrl ||
                                                                getFallbackImage(meal.mealType)
                                                            }
                                                            alt={meal.recipe.nameVi}
                                                            onError={(e) => {
                                                                const target =
                                                                    e.target as HTMLImageElement;
                                                                target.src = getFallbackImage(
                                                                    meal.mealType
                                                                );
                                                            }}
                                                        />
                                                        <div className={styles.mealBadge}>
                                                            {getMealTypeLabel(meal.mealType)} •{' '}
                                                            {getMealTime(meal)}
                                                        </div>
                                                    </div>
                                                    <div className={styles.mealContent}>
                                                        <div className={styles.mealHeader}>
                                                            <h3>{meal.recipe.nameVi}</h3>
                                                            <span className={styles.calories}>
                                                                {meal.recipe.nutrition.calories}{' '}
                                                                kcal
                                                            </span>
                                                        </div>
                                                        <p className={styles.mealDescription}>
                                                            {meal.recipe.descriptionVi ||
                                                                meal.recipe.nameEn}
                                                        </p>
                                                        {meal.recipe.mainIngredients &&
                                                            meal.recipe.mainIngredients.length >
                                                                0 && (
                                                                <div className={styles.ingredients}>
                                                                    <span
                                                                        className={
                                                                            styles.ingredientsLabel
                                                                        }
                                                                    >
                                                                        Nguyên liệu chính:
                                                                    </span>
                                                                    <span
                                                                        className={
                                                                            styles.ingredientsList
                                                                        }
                                                                    >
                                                                        {meal.recipe.mainIngredients.join(
                                                                            ', '
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        <div className={styles.macros}>
                                                            <div className={styles.macroItem}>
                                                                <span className={styles.macroLabel}>
                                                                    Protein
                                                                </span>
                                                                <span className={styles.macroValue}>
                                                                    {meal.recipe.nutrition.proteinG}
                                                                    g
                                                                </span>
                                                            </div>
                                                            <div className={styles.macroItem}>
                                                                <span className={styles.macroLabel}>
                                                                    Carbs
                                                                </span>
                                                                <span className={styles.macroValue}>
                                                                    {meal.recipe.nutrition.carbsG}g
                                                                </span>
                                                            </div>
                                                            <div className={styles.macroItem}>
                                                                <span className={styles.macroLabel}>
                                                                    Fat
                                                                </span>
                                                                <span className={styles.macroValue}>
                                                                    {meal.recipe.nutrition.fatG}g
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <label className={styles.checkboxLabel}>
                                                            <input
                                                                type="checkbox"
                                                                checked={isCompleted}
                                                                onChange={() =>
                                                                    handleCompleteMeal(index)
                                                                }
                                                                className={styles.checkbox}
                                                            />
                                                            <span>
                                                                {t('mealPlanDetail.markAsEaten')}
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={styles.tipCard}>
                                                    <p>
                                                        "
                                                        {meal.recipe.benefitsVi ||
                                                            t('mealPlanDetail.defaultBenefit')}
                                                        "
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
};
export default MealPlanDetail;
