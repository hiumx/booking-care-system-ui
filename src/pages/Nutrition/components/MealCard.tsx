import React from 'react';
import { Meal } from '@/types/nutrition.types';
import './MealCard.scss';

interface MealCardProps {
    meal: Meal;
    index: number;
    isCompleted: boolean;
    onComplete: () => void;
}

const MealCard: React.FC<MealCardProps> = ({ meal, isCompleted, onComplete }) => {
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
                return 'Bữa sáng';
            case 'lunch':
                return 'Bữa trưa';
            case 'dinner':
                return 'Bữa tối';
            case 'snack':
                return 'Bữa phụ';
            default:
                return mealType;
        }
    };

    return (
        <div className={`meal-card ${isCompleted ? 'completed' : ''}`}>
            <div className="meal-header">
                <div className="meal-type">
                    <span className="meal-icon">{getMealIcon(meal.mealType)}</span>
                    <span className="meal-label">{getMealTypeLabel(meal.mealType)}</span>
                </div>
                <label className="checkbox-container">
                    <input type="checkbox" checked={isCompleted} onChange={onComplete} />
                    <span className="checkmark"></span>
                </label>
            </div>

            <div className="meal-content">
                <h3 className="meal-name">{meal.recipe.nameVi}</h3>
                <p className="meal-name-en">{meal.recipe.nameEn}</p>

                <div className="meal-info">
                    <span className="info-item">
                        ⏱️ {meal.recipe.prepTimeMinutes + meal.recipe.cookTimeMinutes} phút
                    </span>
                    <span className="info-item">🍽️ {meal.recipe.servings} người</span>
                </div>

                <div className="nutrition-info">
                    <div className="nutrition-item">
                        <span className="nutrition-label">Calories</span>
                        <span className="nutrition-value">
                            {meal.recipe.nutrition.calories} kcal
                        </span>
                    </div>
                    <div className="nutrition-item">
                        <span className="nutrition-label">Protein</span>
                        <span className="nutrition-value">{meal.recipe.nutrition.proteinG}g</span>
                    </div>
                    <div className="nutrition-item">
                        <span className="nutrition-label">Carbs</span>
                        <span className="nutrition-value">{meal.recipe.nutrition.carbsG}g</span>
                    </div>
                    <div className="nutrition-item">
                        <span className="nutrition-label">Fat</span>
                        <span className="nutrition-value">{meal.recipe.nutrition.fatG}g</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MealCard;
