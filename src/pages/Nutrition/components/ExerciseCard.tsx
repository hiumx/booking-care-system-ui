import React from 'react';
import { useTranslation } from 'react-i18next';
import { Exercise } from '@/types/nutrition.types';
import styles from './ExerciseCard.module.scss';

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
    const { t } = useTranslation('nutrition');

    const getIntensityLabel = (intensity: string) => {
        switch (intensity.toLowerCase()) {
            case 'low':
                return t('intensity.low');
            case 'medium':
                return t('intensity.medium');
            case 'high':
                return t('intensity.high');
            default:
                return intensity;
        }
    };

    return (
        <div className={`${styles['exercise-card']} ${isCompleted ? styles.completed : ''}`}>
            <div className={styles['exercise-header']}>
                <div className={styles['exercise-number']}>{index + 1}</div>
                <label className={styles['checkbox-container']}>
                    <input type="checkbox" checked={isCompleted} onChange={onComplete} />
                    <span className={styles.checkmark}></span>
                </label>
            </div>

            <div className={styles['exercise-content']}>
                <h4 className={styles['exercise-name']}>{exercise.nameVi}</h4>
                <p className={styles['exercise-name-en']}>{exercise.nameEn}</p>

                <div className={styles['exercise-details']}>
                    {exercise.sets > 0 && exercise.reps > 0 && (
                        <span className={styles['detail-item']}>
                            🔢 {exercise.sets} {t('common.sets')} × {exercise.reps}{' '}
                            {t('common.reps')}
                        </span>
                    )}
                    {exercise.durationMinutes > 0 && (
                        <span className={styles['detail-item']}>
                            ⏱️ {exercise.durationMinutes} {t('common.minutes')}
                        </span>
                    )}
                    {exercise.intensity && (
                        <span
                            className={`${styles['intensity-badge']} ${styles[exercise.intensity.toLowerCase()]}`}
                        >
                            {getIntensityLabel(exercise.intensity)}
                        </span>
                    )}
                    {exercise.caloriesBurned && (
                        <span className={styles['detail-item']}>
                            🔥 {exercise.caloriesBurned} {t('common.kcal')}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExerciseCard;
