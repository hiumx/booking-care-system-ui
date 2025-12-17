import React from 'react';
import { Exercise } from '@/types/nutrition.types';
import './ExerciseCard.scss';

interface ExerciseCardProps {
    exercise: Exercise;
    index: number;
    isCompleted: boolean;
    onComplete: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
    exercise,
    index,
    isCompleted,
    onComplete,
}) => {
    return (
        <div className={`exercise-card ${isCompleted ? 'completed' : ''}`}>
            <div className="exercise-header">
                <div className="exercise-number">{index + 1}</div>
                <label className="checkbox-container">
                    <input type="checkbox" checked={isCompleted} onChange={onComplete} />
                    <span className="checkmark"></span>
                </label>
            </div>

            <div className="exercise-content">
                <h4 className="exercise-name">{exercise.nameVi}</h4>
                <p className="exercise-name-en">{exercise.nameEn}</p>

                <div className="exercise-details">
                    {exercise.sets > 0 && exercise.reps > 0 && (
                        <span className="detail-item">
                            🔢 {exercise.sets} sets × {exercise.reps} reps
                        </span>
                    )}
                    {exercise.durationMinutes > 0 && (
                        <span className="detail-item">⏱️ {exercise.durationMinutes} phút</span>
                    )}
                    {exercise.intensity && (
                        <span className={`intensity-badge ${exercise.intensity.toLowerCase()}`}>
                            {exercise.intensity === 'Low'
                                ? 'Nhẹ'
                                : exercise.intensity === 'Medium'
                                  ? 'Trung bình'
                                  : 'Cao'}
                        </span>
                    )}
                    {exercise.caloriesBurned && (
                        <span className="detail-item">🔥 {exercise.caloriesBurned} kcal</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExerciseCard;
