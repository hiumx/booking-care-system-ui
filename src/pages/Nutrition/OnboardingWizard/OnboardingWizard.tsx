import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb, { BreadcrumbItem } from '@/components/Breadcrumb/Breadcrumb';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { nutritionService } from '@/services/nutrition.service';
import {
    ACTIVITY_LEVEL_OPTIONS,
    COMMON_ALLERGIES,
    COMMON_HEALTH_CONDITIONS,
    CUISINE_OPTIONS,
    CreateNutritionProfileDto,
    DIET_TYPE_OPTIONS,
    HEALTH_GOAL_OPTIONS,
} from '@/types/nutrition.types';
import { PATHS } from '@/routes/paths';
import { RootState } from '@/store';
import styles from './OnboardingWizard.module.scss';

const OnboardingWizard: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('nutrition');
    const userProfile = useSelector((state: RootState) => state.user.profile);
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateNutritionProfileDto>({
        heightCm: 0,
        weightKg: 0,
        activityLevel: '',
        healthGoal: '',
        healthConditions: [],
        dietaryPreferences: {
            dietType: 'Regular',
            allergies: [],
            dislikes: [],
            preferredCuisines: ['Món Việt'],
        },
    });

    // Calculate age from dateOfBirth
    const calculateAge = (dateOfBirth: string): number => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const userAge = userProfile?.dateOfBirth ? calculateAge(userProfile.dateOfBirth) : null;

    const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'other'>('male');
    const [customAllergy, setCustomAllergy] = useState('');
    const [customCuisine, setCustomCuisine] = useState('');
    const [customHealthCondition, setCustomHealthCondition] = useState('');
    const [showCustomAllergy, setShowCustomAllergy] = useState(false);
    const [showCustomCuisine, setShowCustomCuisine] = useState(false);
    const [showCustomHealthCondition, setShowCustomHealthCondition] = useState(false);
    const [hasCheckedProfile, setHasCheckedProfile] = useState(false);

    // Store all custom items that have been added (even if unchecked)
    const [allCustomAllergies, setAllCustomAllergies] = useState<string[]>([]);
    const [allCustomCuisines, setAllCustomCuisines] = useState<string[]>([]);
    const [allCustomHealthConditions, setAllCustomHealthConditions] = useState<string[]>([]);

    // Load existing nutrition profile if available
    useEffect(() => {
        const loadExistingProfile = async () => {
            try {
                const existingProfile = await nutritionService.getProfile();
                if (existingProfile) {
                    // Pre-fill form with existing data
                    setFormData({
                        heightCm: existingProfile.heightCm,
                        weightKg: existingProfile.weightKg,
                        activityLevel: existingProfile.activityLevel,
                        healthGoal: existingProfile.healthGoal,
                        healthConditions: existingProfile.healthConditions || [],
                        dietaryPreferences: existingProfile.dietaryPreferences || {
                            dietType: 'Regular',
                            allergies: [],
                            dislikes: [],
                            preferredCuisines: ['Món Việt'],
                        },
                    });

                    // Extract custom items (items not in predefined lists)
                    const customAllergies = (
                        existingProfile.dietaryPreferences?.allergies || []
                    ).filter((item) => !COMMON_ALLERGIES.includes(item));
                    const customCuisines = (
                        existingProfile.dietaryPreferences?.preferredCuisines || []
                    ).filter((item) => !CUISINE_OPTIONS.includes(item));
                    const customHealthConds = (existingProfile.healthConditions || []).filter(
                        (item) => !COMMON_HEALTH_CONDITIONS.includes(item)
                    );

                    setAllCustomAllergies(customAllergies);
                    setAllCustomCuisines(customCuisines);
                    setAllCustomHealthConditions(customHealthConds);

                    // Set gender based on user profile
                    if (userProfile?.gender) {
                        const genderStr = String(userProfile.gender).toLowerCase();
                        if (
                            genderStr === 'male' ||
                            genderStr === 'female' ||
                            genderStr === 'other'
                        ) {
                            setSelectedGender(genderStr as 'male' | 'female' | 'other');
                        }
                    }
                }
            } catch {
                // No existing profile, continue with empty form
                console.log('No existing nutrition profile found');
            }
        };

        loadExistingProfile();
    }, [userProfile]);

    // Kiểm tra user profile khi component mount (chỉ chạy 1 lần sau khi userProfile được load)
    useEffect(() => {
        // Wait for userProfile to be loaded and only check once
        if (!hasCheckedProfile && userProfile) {
            // Add a small delay to ensure userProfile is fully loaded
            const timer = setTimeout(() => {
                setHasCheckedProfile(true);

                console.log('[OnboardingWizard] Checking user profile:', {
                    fullProfile: userProfile,
                    dateOfBirth: userProfile?.dateOfBirth,
                    gender: userProfile?.gender,
                });

                // Only redirect if missing required info
                // Note: gender can be 0 (Male enum value), so check for null/undefined explicitly
                const hasDateOfBirth = !!userProfile?.dateOfBirth;
                const hasGender = userProfile?.gender !== null && userProfile?.gender !== undefined;

                if (!hasDateOfBirth || !hasGender) {
                    console.log(
                        '[OnboardingWizard] Missing required info, redirecting to profile settings'
                    );
                    toast.warning(t('onboarding.toast.updateProfileFirst'), {
                        autoClose: 5000,
                    });
                    navigate('/user/profile?tab=settings');
                } else {
                    console.log(
                        '[OnboardingWizard] User profile is complete, staying on onboarding page'
                    );
                }
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [userProfile, hasCheckedProfile, navigate]);

    const totalSteps = 5;

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                // Bắt buộc: giới tính, chiều cao, cân nặng hợp lệ
                return (
                    !!selectedGender &&
                    formData.heightCm >= 100 &&
                    formData.heightCm <= 250 &&
                    formData.weightKg >= 30 &&
                    formData.weightKg <= 200
                );
            case 2:
                // Bắt buộc: phải chọn mục tiêu sức khỏe
                return !!formData.healthGoal;
            case 3:
                // Bắt buộc: phải chọn mức độ vận động
                return !!formData.activityLevel;
            case 4:
                // Bắt buộc: phải chọn chế độ ăn, ít nhất 1 món ăn yêu thích
                return (
                    !!formData.dietaryPreferences?.dietType &&
                    !!formData.dietaryPreferences?.preferredCuisines &&
                    formData.dietaryPreferences.preferredCuisines.length > 0
                );
            case 5:
                // Bắt buộc: phải chọn ít nhất 1 tình trạng sức khỏe (có thể là "Bình thường")
                return !!formData.healthConditions && formData.healthConditions.length > 0;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (!validateStep(currentStep)) {
            let errorMessage = t('onboarding.validation.completeInfo');

            switch (currentStep) {
                case 1:
                    errorMessage = t('onboarding.validation.selectGenderHeightWeight');
                    break;
                case 2:
                    errorMessage = t('onboarding.validation.selectHealthGoal');
                    break;
                case 3:
                    errorMessage = t('onboarding.validation.selectActivityLevel');
                    break;
                case 4:
                    errorMessage = t('onboarding.validation.selectDietAndCuisine');
                    break;
                case 5:
                    errorMessage = t('onboarding.validation.selectHealthCondition');
                    break;
            }

            toast.warning(errorMessage);
            return;
        }

        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await nutritionService.createOrUpdateProfile(formData);
            toast.success(t('onboarding.toast.success'));
            navigate(PATHS.NUTRITION.DASHBOARD);
        } catch {
            console.error('Error occurred');
            toast.error(t('onboarding.toast.error'));
        } finally {
            setLoading(false);
        }
    };

    const updateFormData = (field: string, value: string | number | string[]) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const updateDietaryPreferences = (field: string, value: string | string[]) => {
        setFormData((prev) => ({
            ...prev,
            dietaryPreferences: {
                ...prev.dietaryPreferences,
                [field]: value,
            },
        }));
    };

    const toggleArrayItem = (array: string[], item: string) => {
        // Special logic for health conditions
        // If selecting "Bình thường", clear all other conditions
        if (item === 'Bình thường') {
            if (array.includes(item)) {
                return array.filter((i) => i !== item);
            }
            return ['Bình thường'];
        }

        // If selecting any other condition, remove "Bình thường" first
        const filteredArray = array.filter((i) => i !== 'Bình thường');

        if (filteredArray.includes(item)) {
            return filteredArray.filter((i) => i !== item);
        }
        return [...filteredArray, item];
    };

    const handleAddCustomAllergy = () => {
        if (customAllergy.trim()) {
            const newAllergy = customAllergy.trim();
            // Add to allCustomAllergies if not already there
            if (!allCustomAllergies.includes(newAllergy)) {
                setAllCustomAllergies([...allCustomAllergies, newAllergy]);
            }
            // Add to active allergies
            updateDietaryPreferences('allergies', [
                ...(formData.dietaryPreferences?.allergies || []),
                newAllergy,
            ]);
            setCustomAllergy('');
            setShowCustomAllergy(false);
        }
    };

    const handleAddCustomCuisine = () => {
        if (customCuisine.trim()) {
            const newCuisine = customCuisine.trim();
            // Add to allCustomCuisines if not already there
            if (!allCustomCuisines.includes(newCuisine)) {
                setAllCustomCuisines([...allCustomCuisines, newCuisine]);
            }
            // Add to active cuisines
            updateDietaryPreferences('preferredCuisines', [
                ...(formData.dietaryPreferences?.preferredCuisines || []),
                newCuisine,
            ]);
            setCustomCuisine('');
            setShowCustomCuisine(false);
        }
    };

    const handleAddCustomHealthCondition = () => {
        if (customHealthCondition.trim()) {
            const newCondition = customHealthCondition.trim();
            // Add to allCustomHealthConditions if not already there
            if (!allCustomHealthConditions.includes(newCondition)) {
                setAllCustomHealthConditions([...allCustomHealthConditions, newCondition]);
            }
            // Add to active health conditions
            updateFormData('healthConditions', [
                ...(formData.healthConditions || []),
                newCondition,
            ]);
            setCustomHealthCondition('');
            setShowCustomHealthCondition(false);
        }
    };

    const getStepClass = (step: number) => {
        if (step < currentStep) return 'completed';
        if (step === currentStep) return 'current';
        return 'upcoming';
    };

    // Breadcrumb items
    const breadcrumbItems: BreadcrumbItem[] = [
        { label: t('breadcrumb.home'), path: PATHS.HOME },
        { label: t('breadcrumb.yourHealth'), path: PATHS.NUTRITION.DASHBOARD },
        { label: t('breadcrumb.profileSetup'), isActive: true },
    ];

    // Sidebar component
    const Sidebar = () => (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.sidebarIcon}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                    </div>
                    <div className={styles.sidebarTitle}>
                        <h2>{t('onboarding.sidebarTitle')}</h2>
                        <p>{t('onboarding.sidebarSubtitle')}</p>
                    </div>
                </div>
                <div className={styles.stepsList}>
                    {[
                        {
                            id: 1,
                            title: t('onboarding.steps.basicMetrics.title'),
                            desc: t('onboarding.steps.basicMetrics.desc'),
                        },
                        {
                            id: 2,
                            title: t('onboarding.steps.goals.title'),
                            desc: t('onboarding.steps.goals.desc'),
                        },
                        {
                            id: 3,
                            title: t('onboarding.steps.activityLevel.title'),
                            desc: t('onboarding.steps.activityLevel.desc'),
                        },
                        {
                            id: 4,
                            title: t('onboarding.steps.dietaryPreferences.title'),
                            desc: t('onboarding.steps.dietaryPreferences.desc'),
                        },
                        {
                            id: 5,
                            title: t('onboarding.steps.healthConditions.title'),
                            desc: t('onboarding.steps.healthConditions.desc'),
                        },
                    ].map((step) => (
                        <div key={step.id} className={styles.stepItem}>
                            <div
                                className={`${styles.stepNumber} ${styles[getStepClass(step.id)]}`}
                            >
                                {step.id < currentStep ? (
                                    <svg fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    step.id
                                )}
                            </div>
                            <div
                                className={`${styles.stepContent} ${styles[getStepClass(step.id)]}`}
                            >
                                <h3>{step.title}</h3>
                                <p>{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.infoCard}>
                <div className={styles.infoHeader}>
                    <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                    </svg>
                    <h3>{t('onboarding.whyWeNeedThis')}</h3>
                </div>
                <p className={styles.infoText}>{t('onboarding.whyWeNeedThisText')}</p>
            </div>
        </aside>
    );

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbItems} title={t('onboarding.title')} />
            <div className={styles.wizardContainer}>
                <div className={styles.wizardWrapper}>
                    <Sidebar />

                    <main className={styles.mainContent}>
                        <div className={styles.contentScroll}>
                            {/* Step 1: Chỉ số cơ bản */}
                            {currentStep === 1 && (
                                <div>
                                    <div className={styles.stepHeader}>
                                        <span className={styles.stepBadge}>
                                            {t('onboarding.step1.badge')}
                                        </span>
                                        <h1 className={styles.stepTitle}>
                                            {t('onboarding.step1.title')}
                                        </h1>
                                        <p className={styles.stepDescription}>
                                            {t('onboarding.step1.description')}
                                        </p>
                                    </div>

                                    <div className={styles.formCard}>
                                        <div className={styles.formCardInner}>
                                            {/* Gender Selection */}
                                            <div className={styles.section}>
                                                <h2 className={styles.sectionTitle}>
                                                    {t('onboarding.step1.biologicalGender')}
                                                </h2>
                                                <div className={styles.genderGrid}>
                                                    <label
                                                        className={`${styles.genderCard} ${selectedGender === 'male' ? styles.selected : ''} ${styles.disabled}`}
                                                        style={{
                                                            cursor: 'not-allowed',
                                                            opacity: 0.6,
                                                        }}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="gender"
                                                            value="male"
                                                            checked={selectedGender === 'male'}
                                                            disabled
                                                        />
                                                        <div className={styles.genderContent}>
                                                            <div className={styles.genderIcon}>
                                                                ♂
                                                            </div>
                                                            <div className={styles.genderLabel}>
                                                                {t('onboarding.step1.male')}
                                                            </div>
                                                            <div className={styles.genderCheckbox}>
                                                                <div
                                                                    className={styles.checkDot}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label
                                                        className={`${styles.genderCard} ${selectedGender === 'female' ? styles.selected : ''} ${styles.disabled}`}
                                                        style={{
                                                            cursor: 'not-allowed',
                                                            opacity: 0.6,
                                                        }}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="gender"
                                                            value="female"
                                                            checked={selectedGender === 'female'}
                                                            disabled
                                                        />
                                                        <div className={styles.genderContent}>
                                                            <div className={styles.genderIcon}>
                                                                ♀
                                                            </div>
                                                            <div className={styles.genderLabel}>
                                                                {t('onboarding.step1.female')}
                                                            </div>
                                                            <div className={styles.genderCheckbox}>
                                                                <div
                                                                    className={styles.checkDot}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label
                                                        className={`${styles.genderCard} ${selectedGender === 'other' ? styles.selected : ''} ${styles.disabled}`}
                                                        style={{
                                                            cursor: 'not-allowed',
                                                            opacity: 0.6,
                                                        }}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="gender"
                                                            value="other"
                                                            checked={selectedGender === 'other'}
                                                            disabled
                                                        />
                                                        <div className={styles.genderContent}>
                                                            <div className={styles.genderIcon}>
                                                                ⚧
                                                            </div>
                                                            <div className={styles.genderLabel}>
                                                                {t('onboarding.step1.other')}
                                                            </div>
                                                            <div className={styles.genderCheckbox}>
                                                                <div
                                                                    className={styles.checkDot}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Body Metrics */}
                                            <div className={styles.metricsRow}>
                                                <div className={styles.metricGroup}>
                                                    <Input
                                                        label={t('onboarding.step1.age')}
                                                        type="number"
                                                        value={String(userAge || 25)}
                                                        disabled
                                                    />
                                                </div>

                                                <div className={styles.metricGroup}>
                                                    <Input
                                                        label={t('onboarding.step1.height')}
                                                        type="number"
                                                        value={String(formData.heightCm)}
                                                        onChange={(e) =>
                                                            updateFormData(
                                                                'heightCm',
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                        min="100"
                                                        max="250"
                                                        placeholder="170"
                                                    />
                                                </div>

                                                <div className={styles.metricGroup}>
                                                    <Input
                                                        label={t('onboarding.step1.weight')}
                                                        type="number"
                                                        value={String(formData.weightKg)}
                                                        onChange={(e) =>
                                                            updateFormData(
                                                                'weightKg',
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                        min="30"
                                                        max="200"
                                                        placeholder="60"
                                                    />
                                                </div>
                                            </div>

                                            <div className={styles.wizardFooter}>
                                                <Button
                                                    text={t('onboarding.buttons.back')}
                                                    type="button"
                                                    onClick={handleBack}
                                                    isDisabled={currentStep === 1}
                                                    className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                                                />
                                                <Button
                                                    text={t('onboarding.buttons.next')}
                                                    type="button"
                                                    onClick={handleNext}
                                                    className={styles.btnPrimary}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Mục tiêu */}
                            {currentStep === 2 && (
                                <div>
                                    <div className={styles.stepHeader}>
                                        <span className={styles.stepBadge}>
                                            {t('onboarding.step2.badge')}
                                        </span>
                                        <h1 className={styles.stepTitle}>
                                            {t('onboarding.step2.title')}
                                        </h1>
                                        <p className={styles.stepDescription}>
                                            {t('onboarding.step2.description')}
                                        </p>
                                    </div>

                                    <div className={styles.optionsWrapper}>
                                        <div className={styles.optionsGrid}>
                                            {HEALTH_GOAL_OPTIONS.map((goal) => (
                                                <label
                                                    key={goal.value}
                                                    className={styles.optionCard}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="goal"
                                                        value={goal.value}
                                                        checked={formData.healthGoal === goal.value}
                                                        onChange={() =>
                                                            updateFormData('healthGoal', goal.value)
                                                        }
                                                    />
                                                    <div className={styles.cardContent}>
                                                        <div className={styles.cardHeader}>
                                                            <span className={styles.cardIcon}>
                                                                {goal.icon}
                                                            </span>
                                                            <div className={styles.cardCheckbox}>
                                                                <div
                                                                    className={styles.checkDot}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                        <h3 className={styles.cardTitle}>
                                                            {goal.label}
                                                        </h3>
                                                        <p className={styles.cardDescription}>
                                                            {goal.value === 'WeightLoss' &&
                                                                t(
                                                                    'onboarding.step2.goals.weightLoss'
                                                                )}
                                                            {goal.value === 'MuscleGain' &&
                                                                t(
                                                                    'onboarding.step2.goals.muscleGain'
                                                                )}
                                                            {goal.value === 'Maintenance' &&
                                                                t(
                                                                    'onboarding.step2.goals.maintenance'
                                                                )}
                                                            {goal.value === 'HeartHealth' &&
                                                                t(
                                                                    'onboarding.step2.goals.heartHealth'
                                                                )}
                                                            {goal.value === 'Flexibility' &&
                                                                t(
                                                                    'onboarding.step2.goals.flexibility'
                                                                )}
                                                            {goal.value === 'Endurance' &&
                                                                t(
                                                                    'onboarding.step2.goals.endurance'
                                                                )}
                                                        </p>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>

                                        <div className={styles.wizardFooter}>
                                            <Button
                                                text={t('onboarding.buttons.back')}
                                                type="button"
                                                onClick={handleBack}
                                                className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                                            />
                                            <Button
                                                text={t('onboarding.buttons.next')}
                                                type="button"
                                                onClick={handleNext}
                                                className={styles.btnPrimary}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Mức độ vận động */}
                            {currentStep === 3 && (
                                <div>
                                    <div className={styles.stepHeader}>
                                        <span className={styles.stepBadge}>
                                            {t('onboarding.step3.badge')}
                                        </span>
                                        <h1 className={styles.stepTitle}>
                                            {t('onboarding.step3.title')}
                                        </h1>
                                        <p className={styles.stepDescription}>
                                            {t('onboarding.step3.description')}
                                        </p>
                                    </div>

                                    <div className={styles.optionsWrapper}>
                                        <div className={styles.optionsGrid}>
                                            {ACTIVITY_LEVEL_OPTIONS.map((activity) => (
                                                <label
                                                    key={activity.value}
                                                    className={styles.optionCard}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="activity"
                                                        value={activity.value}
                                                        checked={
                                                            formData.activityLevel ===
                                                            activity.value
                                                        }
                                                        onChange={() =>
                                                            updateFormData(
                                                                'activityLevel',
                                                                activity.value
                                                            )
                                                        }
                                                    />
                                                    <div className={styles.cardContent}>
                                                        <div className={styles.cardHeader}>
                                                            <span className={styles.cardIcon}>
                                                                {activity.label.split(' ')[0]}
                                                            </span>
                                                            <div className={styles.cardCheckbox}>
                                                                <div
                                                                    className={styles.checkDot}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                        <h3 className={styles.cardTitle}>
                                                            {activity.label
                                                                .split(' ')
                                                                .slice(1)
                                                                .join(' ')}
                                                        </h3>
                                                        <p className={styles.cardDescription}>
                                                            {activity.description}
                                                        </p>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>

                                        <div className={styles.wizardFooter}>
                                            <Button
                                                text={t('onboarding.buttons.back')}
                                                type="button"
                                                onClick={handleBack}
                                                className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                                            />
                                            <Button
                                                text={t('onboarding.buttons.next')}
                                                type="button"
                                                onClick={handleNext}
                                                className={styles.btnPrimary}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Sở thích ăn uống */}
                            {currentStep === 4 && (
                                <div>
                                    <div className={styles.stepHeader}>
                                        <span className={styles.stepBadge}>
                                            {t('onboarding.step4.badge')}
                                        </span>
                                        <h1 className={styles.stepTitle}>
                                            {t('onboarding.step4.title')}
                                        </h1>
                                        <p className={styles.stepDescription}>
                                            {t('onboarding.step4.description')}
                                        </p>
                                    </div>

                                    <div className={styles.formCard}>
                                        <div className={styles.formCardInner}>
                                            <div className={styles.section}>
                                                <h2 className={styles.sectionTitle}>
                                                    <svg
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                                        />
                                                    </svg>
                                                    {t('onboarding.step4.currentDiet')}
                                                </h2>
                                                <div className={styles.dietGrid}>
                                                    {DIET_TYPE_OPTIONS.map((diet) => (
                                                        <label
                                                            key={diet.value}
                                                            className={styles.dietCard}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="diet"
                                                                value={diet.value}
                                                                checked={
                                                                    formData.dietaryPreferences
                                                                        ?.dietType === diet.value
                                                                }
                                                                onChange={() =>
                                                                    updateDietaryPreferences(
                                                                        'dietType',
                                                                        diet.value
                                                                    )
                                                                }
                                                            />
                                                            <div className={styles.dietContent}>
                                                                <div className={styles.dietHeader}>
                                                                    <span
                                                                        className={styles.dietEmoji}
                                                                    >
                                                                        {diet.value === 'Regular' &&
                                                                            '🍖'}
                                                                        {diet.value ===
                                                                            'Vegetarian' && '🥗'}
                                                                        {diet.value === 'Vegan' &&
                                                                            '🌱'}
                                                                        {diet.value === 'Keto' &&
                                                                            '🥑'}
                                                                        {diet.value === 'LowCarb' &&
                                                                            '🥩'}
                                                                    </span>
                                                                    <div
                                                                        className={
                                                                            styles.dietCheckbox
                                                                        }
                                                                    >
                                                                        <div
                                                                            className={
                                                                                styles.checkDot
                                                                            }
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h3
                                                                        className={styles.dietTitle}
                                                                    >
                                                                        {diet.label}
                                                                    </h3>
                                                                    <p className={styles.dietDesc}>
                                                                        {diet.value === 'Regular' &&
                                                                            t(
                                                                                'onboarding.step4.dietDescriptions.regular'
                                                                            )}
                                                                        {diet.value ===
                                                                            'Vegetarian' &&
                                                                            t(
                                                                                'onboarding.step4.dietDescriptions.vegetarian'
                                                                            )}
                                                                        {diet.value === 'Vegan' &&
                                                                            t(
                                                                                'onboarding.step4.dietDescriptions.vegan'
                                                                            )}
                                                                        {diet.value === 'Keto' &&
                                                                            t(
                                                                                'onboarding.step4.dietDescriptions.keto'
                                                                            )}
                                                                        {diet.value === 'LowCarb' &&
                                                                            t(
                                                                                'onboarding.step4.dietDescriptions.lowCarb'
                                                                            )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className={styles.sectionDivider}></div>

                                            <div className={styles.section}>
                                                <h2 className={styles.sectionTitle}>
                                                    <svg
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                        />
                                                    </svg>
                                                    {t('onboarding.step4.allergiesTitle')}
                                                </h2>
                                                <p className={styles.sectionSubtitle}>
                                                    {t('onboarding.step4.allergiesSubtitle')}
                                                </p>
                                                <div className={styles.pillsContainer}>
                                                    <label className={styles.pill}>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                !formData.dietaryPreferences
                                                                    ?.allergies ||
                                                                formData.dietaryPreferences
                                                                    .allergies.length === 0
                                                            }
                                                            onChange={() => {
                                                                if (
                                                                    formData.dietaryPreferences
                                                                        ?.allergies &&
                                                                    formData.dietaryPreferences
                                                                        .allergies.length > 0
                                                                ) {
                                                                    updateDietaryPreferences(
                                                                        'allergies',
                                                                        []
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                        <span className={styles.pillContent}>
                                                            <span className={styles.pillEmoji}>
                                                                ✅
                                                            </span>
                                                            {t('onboarding.step4.noAllergy')}
                                                        </span>
                                                    </label>
                                                    {COMMON_ALLERGIES.map((allergy) => (
                                                        <label
                                                            key={allergy}
                                                            className={styles.pill}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.dietaryPreferences?.allergies?.includes(
                                                                    allergy
                                                                )}
                                                                onChange={() =>
                                                                    updateDietaryPreferences(
                                                                        'allergies',
                                                                        toggleArrayItem(
                                                                            formData
                                                                                .dietaryPreferences
                                                                                ?.allergies || [],
                                                                            allergy
                                                                        )
                                                                    )
                                                                }
                                                            />
                                                            <span className={styles.pillContent}>
                                                                <span className={styles.pillEmoji}>
                                                                    {allergy === 'Hải sản' && '🦐'}
                                                                    {allergy === 'Đậu phộng' &&
                                                                        '🥜'}
                                                                    {allergy === 'Sữa' && '�'}
                                                                    {allergy === 'Trứng' && '🥚'}
                                                                    {allergy === 'Đậu nành' && '🫘'}
                                                                    {allergy === 'Lúa mì' && '🌾'}
                                                                    {allergy === 'Hạt' && '🌰'}
                                                                    {allergy === 'Cá' && '🐟'}
                                                                    {allergy === 'Tôm' && '🦐'}
                                                                    {allergy === 'Mè' && '�'}
                                                                </span>
                                                                {allergy}
                                                            </span>
                                                        </label>
                                                    ))}
                                                    {allCustomAllergies.map((allergy) => (
                                                        <label
                                                            key={allergy}
                                                            className={styles.pill}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.dietaryPreferences?.allergies?.includes(
                                                                    allergy
                                                                )}
                                                                onChange={() =>
                                                                    updateDietaryPreferences(
                                                                        'allergies',
                                                                        toggleArrayItem(
                                                                            formData
                                                                                .dietaryPreferences
                                                                                ?.allergies || [],
                                                                            allergy
                                                                        )
                                                                    )
                                                                }
                                                            />
                                                            <span className={styles.pillContent}>
                                                                <span className={styles.pillEmoji}>
                                                                    ✨
                                                                </span>
                                                                {allergy}
                                                            </span>
                                                        </label>
                                                    ))}
                                                    {!showCustomAllergy ? (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setShowCustomAllergy(true)
                                                            }
                                                            className={styles.btnAddIcon}
                                                            title={t(
                                                                'onboarding.step4.addOtherAllergy'
                                                            )}
                                                        >
                                                            +
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <Input
                                                                type="text"
                                                                placeholder={t(
                                                                    'onboarding.step4.enterOtherAllergy'
                                                                )}
                                                                value={customAllergy}
                                                                onChange={(e) =>
                                                                    setCustomAllergy(e.target.value)
                                                                }
                                                                wrapperClassName={
                                                                    styles.customInputInline
                                                                }
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={handleAddCustomAllergy}
                                                                className={styles.btnAddIcon}
                                                                title={t('onboarding.step4.add')}
                                                            >
                                                                +
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div className={styles.sectionDivider}></div>

                                            <div className={styles.section}>
                                                <h2 className={styles.sectionTitle}>
                                                    <svg
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                                                        />
                                                    </svg>
                                                    {t('onboarding.step4.favoriteCuisine')}
                                                </h2>
                                                <div className={styles.pillsContainer}>
                                                    {CUISINE_OPTIONS.map((cuisine) => (
                                                        <label
                                                            key={cuisine}
                                                            className={styles.pill}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.dietaryPreferences?.preferredCuisines?.includes(
                                                                    cuisine
                                                                )}
                                                                onChange={() =>
                                                                    updateDietaryPreferences(
                                                                        'preferredCuisines',
                                                                        toggleArrayItem(
                                                                            formData
                                                                                .dietaryPreferences
                                                                                ?.preferredCuisines ||
                                                                                [],
                                                                            cuisine
                                                                        )
                                                                    )
                                                                }
                                                            />
                                                            <span className={styles.pillContent}>
                                                                {cuisine}
                                                            </span>
                                                        </label>
                                                    ))}
                                                    {allCustomCuisines.map((cuisine) => (
                                                        <label
                                                            key={cuisine}
                                                            className={styles.pill}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.dietaryPreferences?.preferredCuisines?.includes(
                                                                    cuisine
                                                                )}
                                                                onChange={() =>
                                                                    updateDietaryPreferences(
                                                                        'preferredCuisines',
                                                                        toggleArrayItem(
                                                                            formData
                                                                                .dietaryPreferences
                                                                                ?.preferredCuisines ||
                                                                                [],
                                                                            cuisine
                                                                        )
                                                                    )
                                                                }
                                                            />
                                                            <span className={styles.pillContent}>
                                                                <span className={styles.pillEmoji}>
                                                                    ✨
                                                                </span>
                                                                {cuisine}
                                                            </span>
                                                        </label>
                                                    ))}
                                                    {!showCustomCuisine ? (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setShowCustomCuisine(true)
                                                            }
                                                            className={styles.btnAddIcon}
                                                            title={t(
                                                                'onboarding.step4.addOtherCuisine'
                                                            )}
                                                        >
                                                            +
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <Input
                                                                type="text"
                                                                placeholder={t(
                                                                    'onboarding.step4.enterOtherCuisine'
                                                                )}
                                                                value={customCuisine}
                                                                onChange={(e) =>
                                                                    setCustomCuisine(e.target.value)
                                                                }
                                                                wrapperClassName={
                                                                    styles.customInputInline
                                                                }
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={handleAddCustomCuisine}
                                                                className={styles.btnAddIcon}
                                                                title={t('onboarding.step4.add')}
                                                            >
                                                                +
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div className={styles.wizardFooter}>
                                                <Button
                                                    text={t('onboarding.buttons.back')}
                                                    type="button"
                                                    onClick={handleBack}
                                                    className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                                                />
                                                <Button
                                                    text={t('onboarding.buttons.next')}
                                                    type="button"
                                                    onClick={handleNext}
                                                    className={styles.btnPrimary}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 5: Tình trạng sức khỏe */}
                            {currentStep === 5 && (
                                <div>
                                    <div className={styles.stepHeader}>
                                        <span className={styles.stepBadge}>
                                            {t('onboarding.step5.badge')}
                                        </span>
                                        <h1 className={styles.stepTitle}>
                                            {t('onboarding.step5.title')}
                                        </h1>
                                        <p className={styles.stepDescription}>
                                            {t('onboarding.step5.description')}
                                        </p>
                                    </div>

                                    <div className={styles.optionsWrapper}>
                                        <div className={styles.optionsGrid}>
                                            {COMMON_HEALTH_CONDITIONS.map((condition) => (
                                                <label
                                                    key={condition}
                                                    className={styles.optionCard}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.healthConditions?.includes(
                                                            condition
                                                        )}
                                                        onChange={() =>
                                                            updateFormData(
                                                                'healthConditions',
                                                                toggleArrayItem(
                                                                    formData.healthConditions || [],
                                                                    condition
                                                                )
                                                            )
                                                        }
                                                    />
                                                    <div className={styles.cardContent}>
                                                        <div className={styles.cardHeader}>
                                                            <span className={styles.cardIcon}>
                                                                {condition === 'Bình thường' &&
                                                                    '😊'}
                                                                {condition === 'Tiểu đường' && '🩸'}
                                                                {condition === 'Huyết áp cao' &&
                                                                    '❤️'}
                                                                {condition === 'Cholesterol cao' &&
                                                                    '⚡'}
                                                                {condition === 'Bệnh tim' && '💓'}
                                                            </span>
                                                            <div className={styles.cardCheckbox}>
                                                                <div
                                                                    className={styles.checkDot}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                        <h3 className={styles.cardTitle}>
                                                            {condition}
                                                        </h3>
                                                        <p className={styles.cardDescription}>
                                                            {condition === 'Bình thường' &&
                                                                t(
                                                                    'onboarding.step5.conditionDescriptions.normal'
                                                                )}
                                                            {condition === 'Tiểu đường' &&
                                                                t(
                                                                    'onboarding.step5.conditionDescriptions.diabetes'
                                                                )}
                                                            {condition === 'Huyết áp cao' &&
                                                                t(
                                                                    'onboarding.step5.conditionDescriptions.highBloodPressure'
                                                                )}
                                                            {condition === 'Cholesterol cao' &&
                                                                t(
                                                                    'onboarding.step5.conditionDescriptions.highCholesterol'
                                                                )}
                                                            {condition === 'Bệnh tim' &&
                                                                t(
                                                                    'onboarding.step5.conditionDescriptions.heartDisease'
                                                                )}
                                                        </p>
                                                    </div>
                                                </label>
                                            ))}
                                            <label
                                                className={styles.optionCard}
                                                onClick={() => setShowCustomHealthCondition(true)}
                                            >
                                                <div className={styles.cardContent}>
                                                    <div className={styles.cardHeader}>
                                                        <h3 className={styles.cardTitle}>
                                                            <span className={styles.cardIcon}>
                                                                ➕
                                                            </span>
                                                            {t('onboarding.step5.other')}
                                                        </h3>
                                                    </div>
                                                    <p className={styles.cardDescription}>
                                                        {t('onboarding.step5.addOtherCondition')}
                                                    </p>
                                                </div>
                                            </label>
                                            {allCustomHealthConditions.map((condition) => (
                                                <label
                                                    key={condition}
                                                    className={styles.optionCard}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.healthConditions?.includes(
                                                            condition
                                                        )}
                                                        onChange={() =>
                                                            updateFormData(
                                                                'healthConditions',
                                                                toggleArrayItem(
                                                                    formData.healthConditions || [],
                                                                    condition
                                                                )
                                                            )
                                                        }
                                                    />
                                                    <div className={styles.cardContent}>
                                                        <div className={styles.cardHeader}>
                                                            <h3 className={styles.cardTitle}>
                                                                <span className={styles.cardIcon}>
                                                                    ✨
                                                                </span>
                                                                {condition}
                                                            </h3>
                                                            <div className={styles.cardCheckbox}>
                                                                <div
                                                                    className={styles.checkDot}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                        <p className={styles.cardDescription}>
                                                            {t('onboarding.step5.customCondition')}
                                                        </p>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>

                                        {showCustomHealthCondition && (
                                            <div
                                                className={styles.customInputGroupInline}
                                                style={{ marginBottom: '24px' }}
                                            >
                                                <Input
                                                    type="text"
                                                    placeholder={t(
                                                        'onboarding.step5.enterOtherCondition'
                                                    )}
                                                    value={customHealthCondition}
                                                    onChange={(e) =>
                                                        setCustomHealthCondition(e.target.value)
                                                    }
                                                    wrapperClassName={styles.customInputInline}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAddCustomHealthCondition}
                                                    className={styles.btnAddIcon}
                                                    title={t('onboarding.step4.add')}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}

                                        <div className={styles.wizardFooter}>
                                            <Button
                                                text={t('onboarding.buttons.back')}
                                                type="button"
                                                onClick={handleBack}
                                                className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                                            />
                                            <Button
                                                text={
                                                    loading
                                                        ? `${t('onboarding.buttons.submit')}...`
                                                        : t('onboarding.buttons.submit')
                                                }
                                                type="button"
                                                onClick={handleNext}
                                                isDisabled={loading}
                                                className={styles.btnPrimary}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </MainLayout>
    );
};

export default OnboardingWizard;
