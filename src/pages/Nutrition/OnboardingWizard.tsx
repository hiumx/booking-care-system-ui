import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb, { BreadcrumbItem } from '@/components/Breadcrumb/Breadcrumb';
import StepWizard from '@/components/StepWizard';
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
import './OnboardingWizard.scss';

const STEP_ITEMS = [
    { id: 1, title: 'Chỉ số cơ bản' },
    { id: 2, title: 'Mục tiêu' },
    { id: 3, title: 'Mức độ vận động' },
    { id: 4, title: 'Sở thích ăn uống' },
    { id: 5, title: 'Tình trạng sức khỏe' },
];

const OnboardingWizard: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateNutritionProfileDto>({
        heightCm: 170,
        weightKg: 65,
        activityLevel: 'Moderate',
        healthGoal: 'Maintenance',
        healthConditions: [],
        dietaryPreferences: {
            dietType: 'Regular',
            allergies: [],
            dislikes: [],
            preferredCuisines: ['Món Việt'],
        },
    });

    const totalSteps = 5;

    const handleNext = () => {
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
            navigate(PATHS.NUTRITION.DASHBOARD);
        } catch (error) {
            console.error('Error creating profile:', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    const updateFormData = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const updateDietaryPreferences = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            dietaryPreferences: {
                ...prev.dietaryPreferences,
                [field]: value,
            },
        }));
    };

    const toggleArrayItem = (array: string[], item: string) => {
        if (array.includes(item)) {
            return array.filter((i) => i !== item);
        }
        return [...array, item];
    };

    const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Trang chủ', path: PATHS.HOME },
        { label: 'Lộ trình Sức khỏe', path: PATHS.NUTRITION.DASHBOARD },
        { label: 'Thiết lập', isActive: true },
    ];

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbItems} title="Thiết lập Lộ trình Sức khỏe" />

            <section className="contact-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5 col-md-12">
                            <div className="section-inner-header contact-inner-header">
                                <h6>Lộ trình Sức khỏe</h6>
                                <h2>Thiết lập Lộ trình Sức khỏe</h2>
                                <p className="mt-3">
                                    Hoàn thành 5 bước đơn giản để nhận kế hoạch dinh dưỡng và tập
                                    luyện phù hợp với mục tiêu sức khỏe của bạn. Chúng tôi sẽ tạo lộ
                                    trình cá nhân hóa dựa trên thông tin bạn cung cấp.
                                </p>
                            </div>
                            <div className="card contact-card">
                                <div className="card-body">
                                    <div className="contact-icon">
                                        <i className="isax isax-health"></i>
                                    </div>
                                    <div className="contact-details">
                                        <h4>Chỉ số cơ bản</h4>
                                        <p>Chiều cao, cân nặng để tính toán chính xác</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card contact-card">
                                <div className="card-body">
                                    <div className="contact-icon">
                                        <i className="isax isax-flag"></i>
                                    </div>
                                    <div className="contact-details">
                                        <h4>Mục tiêu</h4>
                                        <p>Giảm cân, tăng cân hay duy trì</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card contact-card">
                                <div className="card-body">
                                    <div className="contact-icon">
                                        <i className="isax isax-activity"></i>
                                    </div>
                                    <div className="contact-details">
                                        <h4>Mức độ vận động</h4>
                                        <p>Mức độ hoạt động thể chất hàng ngày</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card contact-card">
                                <div className="card-body">
                                    <div className="contact-icon">
                                        <i className="isax isax-cake"></i>
                                    </div>
                                    <div className="contact-details">
                                        <h4>Sở thích ăn uống</h4>
                                        <p>Chế độ ăn, dị ứng và ẩm thực yêu thích</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card contact-card">
                                <div className="card-body">
                                    <div className="contact-icon">
                                        <i className="isax isax-heart"></i>
                                    </div>
                                    <div className="contact-details">
                                        <h4>Tình trạng sức khỏe</h4>
                                        <p>Bệnh lý và tình trạng cần lưu ý</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7 col-md-12 d-flex">
                            <div
                                className="card contact-form-card w-100"
                                style={{ backgroundColor: '#f6faff' }}
                            >
                                <div className="card-body">
                                    <StepWizard
                                        steps={STEP_ITEMS}
                                        currentStep={currentStep}
                                        className="mb-4"
                                    />

                                    <div className="wizard-content">
                                        {/* Step 1: Chỉ số cơ bản */}
                                        {currentStep === 1 && (
                                            <div className="step-content">
                                                <h2>
                                                    <i className="isax isax-info-circle"></i>
                                                    Chỉ số cơ bản
                                                </h2>
                                                <p className="step-description">
                                                    Cung cấp thông tin cơ bản để chúng tôi tính toán
                                                    chính xác. Tuổi và giới tính sẽ được lấy từ hồ
                                                    sơ của bạn.
                                                </p>

                                                <div className="form-group">
                                                    <label>Chiều cao (cm)</label>
                                                    <input
                                                        type="number"
                                                        value={formData.heightCm}
                                                        onChange={(e) =>
                                                            updateFormData(
                                                                'heightCm',
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                        min="100"
                                                        max="250"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label>Cân nặng (kg)</label>
                                                    <input
                                                        type="number"
                                                        value={formData.weightKg}
                                                        onChange={(e) =>
                                                            updateFormData(
                                                                'weightKg',
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                        min="30"
                                                        max="200"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Step 2: Mục tiêu */}
                                        {currentStep === 2 && (
                                            <div className="step-content">
                                                <h2>
                                                    <i className="isax isax-info-circle"></i>
                                                    Mục tiêu của bạn
                                                </h2>
                                                <p className="step-description">
                                                    Bạn muốn đạt được điều gì?
                                                </p>

                                                <div className="goal-options">
                                                    {HEALTH_GOAL_OPTIONS.map((goal) => (
                                                        <div
                                                            key={goal.value}
                                                            className={`goal-card ${formData.healthGoal === goal.value ? 'active' : ''}`}
                                                            onClick={() =>
                                                                updateFormData(
                                                                    'healthGoal',
                                                                    goal.value
                                                                )
                                                            }
                                                        >
                                                            <span className="goal-icon">
                                                                {goal.icon}
                                                            </span>
                                                            <span className="goal-label">
                                                                {goal.label}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Step 3: Mức độ vận động */}
                                        {currentStep === 3 && (
                                            <div className="step-content">
                                                <h2>
                                                    <i className="isax isax-info-circle"></i>
                                                    Mức độ vận động
                                                </h2>
                                                <p className="step-description">
                                                    Bạn thường vận động như thế nào?
                                                </p>

                                                <div className="activity-options">
                                                    {ACTIVITY_LEVEL_OPTIONS.map((activity) => (
                                                        <div
                                                            key={activity.value}
                                                            className={`activity-card ${formData.activityLevel === activity.value ? 'active' : ''}`}
                                                            onClick={() =>
                                                                updateFormData(
                                                                    'activityLevel',
                                                                    activity.value
                                                                )
                                                            }
                                                        >
                                                            <div className="activity-label">
                                                                {activity.label}
                                                            </div>
                                                            <div className="activity-description">
                                                                {activity.description}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Step 4: Sở thích ăn uống */}
                                        {currentStep === 4 && (
                                            <div className="step-content">
                                                <h2>
                                                    <i className="isax isax-info-circle"></i>
                                                    Sở thích ăn uống
                                                </h2>
                                                <p className="step-description">
                                                    Giúp chúng tôi tạo thực đơn phù hợp với bạn
                                                </p>

                                                <div className="form-group">
                                                    <label>Chế độ ăn</label>
                                                    <select
                                                        value={
                                                            formData.dietaryPreferences?.dietType
                                                        }
                                                        onChange={(e) =>
                                                            updateDietaryPreferences(
                                                                'dietType',
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        {DIET_TYPE_OPTIONS.map((diet) => (
                                                            <option
                                                                key={diet.value}
                                                                value={diet.value}
                                                            >
                                                                {diet.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="form-group">
                                                    <label>Dị ứng</label>
                                                    <div className="checkbox-group">
                                                        {COMMON_ALLERGIES.map((allergy) => (
                                                            <label
                                                                key={allergy}
                                                                className="checkbox-label"
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
                                                                                    ?.allergies ||
                                                                                    [],
                                                                                allergy
                                                                            )
                                                                        )
                                                                    }
                                                                />
                                                                <span>{allergy}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="form-group">
                                                    <label>Ẩm thực yêu thích</label>
                                                    <div className="checkbox-group">
                                                        {CUISINE_OPTIONS.map((cuisine) => (
                                                            <label
                                                                key={cuisine}
                                                                className="checkbox-label"
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
                                                                <span>{cuisine}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Step 5: Tình trạng sức khỏe */}
                                        {currentStep === 5 && (
                                            <div className="step-content">
                                                <h2>
                                                    <i className="isax isax-info-circle"></i>
                                                    Tình trạng sức khỏe
                                                </h2>
                                                <p className="step-description">
                                                    Bạn có bệnh lý nào cần lưu ý không?
                                                </p>

                                                <div className="checkbox-group">
                                                    {COMMON_HEALTH_CONDITIONS.map((condition) => (
                                                        <label
                                                            key={condition}
                                                            className="checkbox-label"
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
                                                                            formData.healthConditions ||
                                                                                [],
                                                                            condition
                                                                        )
                                                                    )
                                                                }
                                                            />
                                                            <span>{condition}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="wizard-footer">
                                        {currentStep > 1 && (
                                            <button
                                                className="btn btn-secondary"
                                                onClick={handleBack}
                                            >
                                                Quay lại
                                            </button>
                                        )}
                                        <button
                                            className="btn btn-primary"
                                            onClick={handleNext}
                                            disabled={loading}
                                        >
                                            {loading
                                                ? 'Đang xử lý...'
                                                : currentStep === totalSteps
                                                  ? 'Hoàn thành'
                                                  : 'Tiếp theo'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
};

export default OnboardingWizard;
