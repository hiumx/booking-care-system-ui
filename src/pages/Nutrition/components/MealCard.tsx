import React from 'react';
import { useTranslation } from 'react-i18next';
import { Meal } from '@/types/nutrition.types';
import styles from './MealCard.module.scss';

interface MealCardProps {
    meal: Meal;
    index: number;
    isCompleted: boolean;
    onComplete: () => void;
}

const MealCard: React.FC<MealCardProps> = ({ meal, isCompleted, onComplete }) => {
    const { t } = useTranslation('nutrition');

    const getMealIcon = (mealType: string) => {
        switch (mealType.toLowerCase()) {
            case 'breakfast':
                return '🌅';
            case 'lunch':
                return '☀️';
            case 'dinner':
                return '🌙';
            case 'snack':
                return '🍎';
            default:
                return '🍽️';
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

    return (
        <div className={`${styles['meal-card']} ${isCompleted ? styles.completed : ''}`}>
            <div className={styles['meal-header']}>
                <div className={styles['meal-type']}>
                    <span className={styles['meal-icon']}>{getMealIcon(meal.mealType)}</span>
                    <span className={styles['meal-label']}>{getMealTypeLabel(meal.mealType)}</span>
                </div>
                <label className={styles['checkbox-container']}>
                    <input type="checkbox" checked={isCompleted} onChange={onComplete} />
                    <span className={styles.checkmark}></span>
                </label>
            </div>

            <div className={styles['meal-content']}>
                <h3 className={styles['meal-name']}>{meal.recipe.nameVi}</h3>
                <p className={styles['meal-name-en']}>{meal.recipe.nameEn}</p>

                <div className={styles['meal-info']}>
                    <span className={styles['info-item']}>
                        ⏱️ {meal.recipe.prepTimeMinutes + meal.recipe.cookTimeMinutes}{' '}
                        {t('common.minutes')}
                    </span>
                    <span className={styles['info-item']}>
                        🍽️ {meal.recipe.servings} {t('common.servings')}
                    </span>
                </div>

                <div className={styles['nutrition-info']}>
                    <div className={styles['nutrition-item']}>
                        <span className={styles['nutrition-label']}>{t('common.calories')}</span>
                        <span className={styles['nutrition-value']}>
                            {meal.recipe.nutrition.calories} {t('common.kcal')}
                        </span>
                    </div>
                    <div className={styles['nutrition-item']}>
                        <span className={styles['nutrition-label']}>{t('common.protein')}</span>
                        <span className={styles['nutrition-value']}>
                            {meal.recipe.nutrition.proteinG}g
                        </span>
                    </div>
                    <div className={styles['nutrition-item']}>
                        <span className={styles['nutrition-label']}>{t('common.carbs')}</span>
                        <span className={styles['nutrition-value']}>
                            {meal.recipe.nutrition.carbsG}g
                        </span>
                    </div>
                    <div className={styles['nutrition-item']}>
                        <span className={styles['nutrition-label']}>{t('common.fat')}</span>
                        <span className={styles['nutrition-value']}>
                            {meal.recipe.nutrition.fatG}g
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MealCard;
