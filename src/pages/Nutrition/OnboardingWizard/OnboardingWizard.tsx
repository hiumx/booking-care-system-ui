import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
                    toast.warning(
                        'Vui lòng cập nhật thông tin cá nhân (ngày sinh và giới tính) để thiết lập hồ sơ dinh dưỡng!',
                        {
                            autoClose: 5000,
                        }
                    );
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
            let errorMessage = 'Vui lòng hoàn thành thông tin trước khi tiếp tục!';

            switch (currentStep) {
                case 1:
                    errorMessage = 'Vui lòng chọn giới tính và nhập chiều cao, cân nặng hợp lệ!';
                    break;
                case 2:
                    errorMessage = 'Vui lòng chọn mục tiêu sức khỏe của bạn!';
                    break;
                case 3:
                    errorMessage = 'Vui lòng chọn mức độ vận động của bạn!';
                    break;
                case 4:
                    errorMessage = 'Vui lòng chọn chế độ ăn và ít nhất 1 món ăn yêu thích!';
                    break;
                case 5:
                    errorMessage = 'Vui lòng chọn ít nhất 1 tình trạng sức khỏe!';
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
            toast.success('Tạo hồ sơ dinh dưỡng thành công!');
            navigate(PATHS.NUTRITION.DASHBOARD);
        } catch {
            console.error('Error occurred');
            toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
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
        { label: 'Trang chủ', path: PATHS.HOME },
        { label: 'Sức khỏe của bạn', path: PATHS.NUTRITION.DASHBOARD },
        { label: 'Thiết lập hồ sơ', isActive: true },
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
                        <h2>Sức khỏe của bạn AI</h2>
                        <p>Cá nhân hóa cho bạn</p>
                    </div>
                </div>
                <div className={styles.stepsList}>
                    {[
                        { id: 1, title: 'Chỉ số cơ bản', desc: 'Chiều cao, cân nặng' },
                        { id: 2, title: 'Mục tiêu', desc: 'Giảm cân, tăng cơ' },
                        { id: 3, title: 'Mức độ vận động', desc: 'Thói quen vận động' },
                        { id: 4, title: 'Sở thích ăn uống', desc: 'Chế độ ăn, dị ứng' },
                        { id: 5, title: 'Tình trạng sức khỏe', desc: 'Bệnh lý nền' },
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
                    <h3>Tại sao chúng tôi cần điều này?</h3>
                </div>
                <p className={styles.infoText}>
                    AI sử dụng dữ liệu của bạn để tạo ra lộ trình dinh dưỡng và tập luyện an toàn,
                    hiệu quả nhất phù hợp với mục tiêu sức khỏe.
                </p>
            </div>
        </aside>
    );

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbItems} title="Thiết lập hồ sơ dinh dưỡng" />
            <div className={styles.wizardContainer}>
                <div className={styles.wizardWrapper}>
                    <Sidebar />

                    <main className={styles.mainContent}>
                        <div className={styles.contentScroll}>
                            {/* Step 1: Chỉ số cơ bản */}
                            {currentStep === 1 && (
                                <div>
                                    <div className={styles.stepHeader}>
                                        <span className={styles.stepBadge}>Thiết lập hồ sơ</span>
                                        <h1 className={styles.stepTitle}>Chỉ số cơ thể của bạn</h1>
                                        <p className={styles.stepDescription}>
                                            Hãy cung cấp thông tin chính xác để AI có thể tính toán
                                            chỉ số BMI và nhu cầu dinh dưỡng hàng ngày dành riêng
                                            cho bạn.
                                        </p>
                                    </div>

                                    <div className={styles.formCard}>
                                        <div className={styles.formCardInner}>
                                            {/* Gender Selection */}
                                            <div className={styles.section}>
                                                <h2 className={styles.sectionTitle}>
                                                    Giới tính sinh học
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
                                                                Nam
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
                                                                Nữ
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
                                                                Khác
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
                                                        label="Tuổi"
                                                        type="number"
                                                        value={String(userAge || 25)}
                                                        disabled
                                                    />
                                                </div>

                                                <div className={styles.metricGroup}>
                                                    <Input
                                                        label="Chiều cao (cm)"
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
                                                        label="Cân nặng (kg)"
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
                                                    text="Quay lại"
                                                    type="button"
                                                    onClick={handleBack}
                                                    isDisabled={currentStep === 1}
                                                    className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                                                />
                                                <Button
                                                    text="Tiếp tục"
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
                                            Lộ trình cá nhân hóa
                                        </span>
                                        <h1 className={styles.stepTitle}>
                                            Mục tiêu sức khỏe chính của bạn là gì?
                                        </h1>
                                        <p className={styles.stepDescription}>
                                            AI của chúng tôi sẽ điều chỉnh kế hoạch dinh dưỡng và
                                            tập luyện dựa trên những gì bạn muốn đạt được.
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
                                                                'Tập trung vào thâm hụt calo, các bài tập đốt cháy mỡ và thói quen ăn uống bền vững.'}
                                                            {goal.value === 'MuscleGain' &&
                                                                'Các kế hoạch tập luyện tập trung vào phì đại cơ và khuyến nghị bữa ăn giàu protein.'}
                                                            {goal.value === 'Maintenance' &&
                                                                'Phương pháp cân bằng để giữ cơ thể năng động và tối ưu hóa dinh dưỡng.'}
                                                            {goal.value === 'HeartHealth' &&
                                                                'Tăng cường sức bền, sức khỏe tim mạch và sự dẻo dai qua các hoạt động aerobic.'}
                                                            {goal.value === 'Flexibility' &&
                                                                'Cải thiện độ linh hoạt, giảm căng cơ và tăng khả năng vận động của cơ thể.'}
                                                            {goal.value === 'Endurance' &&
                                                                'Nâng cao sức chịu đựng, tăng cường thể lực và khả năng hoạt động lâu dài.'}
                                                        </p>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>

                                        <div className={styles.wizardFooter}>
                                            <Button
                                                text="Quay lại"
                                                type="button"
                                                onClick={handleBack}
                                                className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                                            />
                                            <Button
                                                text="Tiếp tục"
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
                                        <span className={styles.stepBadge}>Bước 3/5</span>
                                        <h1 className={styles.stepTitle}>
                                            Bạn thường vận động ở mức nào?
                                        </h1>
                                        <p className={styles.stepDescription}>
                                            Mức độ vận động giúp chúng tôi tính toán chính xác lượng
                                            calo bạn đốt cháy mỗi ngày.
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
                                                text="Quay lại"
                                                type="button"
                                                onClick={handleBack}
                                                className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                                            />
                                            <Button
                                                text="Tiếp tục"
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
                                            Cá nhân hóa dinh dưỡng
                                        </span>
                                        <h1 className={styles.stepTitle}>
                                            Sở thích ăn uống của bạn
                                        </h1>
                                        <p className={styles.stepDescription}>
                                            Để AI thiết kế thực đơn phù hợp nhất, hãy chia sẻ với
                                            chúng tôi về thói quen và các hạn chế trong ăn uống của
                                            bạn.
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
                                                    Chế độ ăn hiện tại
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
                                                                            'Ăn đa dạng các loại thực phẩm'}
                                                                        {diet.value ===
                                                                            'Vegetarian' &&
                                                                            'Không thịt cá, có trứng sữa'}
                                                                        {diet.value === 'Vegan' &&
                                                                            'Hoàn toàn thực vật'}
                                                                        {diet.value === 'Keto' &&
                                                                            'Ít carb, nhiều chất béo'}
                                                                        {diet.value === 'LowCarb' &&
                                                                            'Hạn chế tinh bột'}
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
                                                    Dị ứng & Hạn chế
                                                </h2>
                                                <p className={styles.sectionSubtitle}>
                                                    Chọn những loại thực phẩm bạn bị dị ứng hoặc
                                                    không dung nạp:
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
                                                            Không dị ứng
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
                                                                    {allergy === 'Sữa' && '🥛'}
                                                                    {allergy === 'Trứng' && '🥚'}
                                                                    {allergy === 'Đậu nành' && '🫘'}
                                                                    {allergy === 'Lúa mì' && '🌾'}
                                                                    {allergy === 'Hạt' && '🌰'}
                                                                    {allergy === 'Cá' && '🐟'}
                                                                    {allergy === 'Tôm' && '🦐'}
                                                                    {allergy === 'Mè' && '🌱'}
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
                                                            title="Thêm dị ứng khác"
                                                        >
                                                            +
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <Input
                                                                type="text"
                                                                placeholder="Nhập dị ứng khác..."
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
                                                                title="Thêm"
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
                                                    Ẩm thực yêu thích
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
                                                            title="Thêm ẩm thực khác"
                                                        >
                                                            +
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <Input
                                                                type="text"
                                                                placeholder="Nhập ẩm thực khác..."
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
                                                                title="Thêm"
                                                            >
                                                                +
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div className={styles.wizardFooter}>
                                                <Button
                                                    text="Quay lại"
                                                    type="button"
                                                    onClick={handleBack}
                                                    className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                                                />
                                                <Button
                                                    text="Tiếp tục"
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
                                        <span className={styles.stepBadge}>Sức khỏe & Y tế</span>
                                        <h1 className={styles.stepTitle}>
                                            Bạn có tình trạng sức khỏe nào cần lưu ý không?
                                        </h1>
                                        <p className={styles.stepDescription}>
                                            AI sẽ dựa vào thông tin này để điều chỉnh cường độ tập
                                            luyện và thực đơn, đảm bảo an toàn tuyệt đối cho bạn.
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
                                                                'Sẵn sàng cho mọi cường độ tập luyện'}
                                                            {condition === 'Tiểu đường' &&
                                                                'Cần kiểm soát đường huyết'}
                                                            {condition === 'Huyết áp cao' &&
                                                                'Cần bài tập nhẹ nhàng'}
                                                            {condition === 'Cholesterol cao' &&
                                                                'Cần chế độ ăn lành mạnh'}
                                                            {condition === 'Bệnh tim' &&
                                                                'Cần kiểm soát nhịp tim'}
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
                                                            Khác
                                                        </h3>
                                                    </div>
                                                    <p className={styles.cardDescription}>
                                                        Thêm tình trạng sức khỏe khác
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
                                                            Tình trạng sức khỏe tùy chỉnh
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
                                                    placeholder="Nhập tình trạng sức khỏe khác..."
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
                                                    title="Thêm"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}

                                        <div className={styles.wizardFooter}>
                                            <Button
                                                text="Quay lại"
                                                type="button"
                                                onClick={handleBack}
                                                className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                                            />
                                            <Button
                                                text={loading ? 'Đang xử lý...' : 'Hoàn thành'}
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
