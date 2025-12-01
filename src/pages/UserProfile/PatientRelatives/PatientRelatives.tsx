import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { Skeleton } from '@mui/material';
import { PatientRelativeService } from '@/services/patientRelative.service';
import {
    PatientRelativeResponse,
    CreatePatientRelativeRequest,
    UpdatePatientRelativeRequest,
    Relationship,
    RelationshipLabels,
} from '@/types/patient-relative.types';
import Input from '@/components/Input';
import DateInput from '@/components/DateInput';
import { usePhoneInput } from '@/hooks/usePhoneInput';
import { AuthService } from '@/services/auth.service';
import styles from './PatientRelatives.module.scss';
import { Gender } from '@/enums/common.enums';

interface GenderOption {
    value: Gender;
    label: string;
}

interface RelationshipOption {
    value: Relationship;
    label: string;
}

interface RelativeFormData {
    firstName: string;
    lastName: string;
    gender: Gender;
    dateOfBirth: string;
    relationship: Relationship;
    healthInsuranceNumber: string;
    identityNumber: string;
    notes: string;
}

const initialFormData: RelativeFormData = {
    firstName: '',
    lastName: '',
    gender: Gender.MALE,
    dateOfBirth: '',
    relationship: Relationship.PARENT,
    healthInsuranceNumber: '',
    identityNumber: '',
    notes: '',
};

// Custom styles for react-select
const customSelectStyles = {
    control: (base: any) => ({
        ...base,
        minHeight: '46px',
        borderColor: '#e9ecef',
        '&:hover': { borderColor: '#0d6efd' },
    }),
    option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isSelected ? '#0d6efd' : state.isFocused ? '#e9ecef' : 'white',
    }),
};

const PatientRelatives: React.FC = () => {
    const { t } = useTranslation(['userProfile', 'common']);

    // Use phone input hook
    const { phone, handlePhoneChange, handlePhonePaste, handlePhoneKeyDown, setPhoneValue } =
        usePhoneInput();

    const [relatives, setRelatives] = useState<PatientRelativeResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingRelative, setEditingRelative] = useState<PatientRelativeResponse | null>(null);
    const [formData, setFormData] = useState<RelativeFormData>(initialFormData);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Validation error states
    const [firstNameError, setFirstNameError] = useState<string>('');
    const [lastNameError, setLastNameError] = useState<string>('');
    const [dateOfBirthError, setDateOfBirthError] = useState<string>('');
    const [phoneError, setPhoneError] = useState<string>('');
    const [identityNumberError, setIdentityNumberError] = useState<string>('');

    // Gender options
    const genderOptions: GenderOption[] = [
        { value: Gender.MALE, label: t('patientRelatives.gender.male', 'Nam') },
        { value: Gender.FEMALE, label: t('patientRelatives.gender.female', 'Nữ') },
        { value: Gender.OTHER, label: t('patientRelatives.gender.other', 'Khác') },
    ];

    // Relationship options
    const relationshipOptions: RelationshipOption[] = [
        { value: Relationship.PARENT, label: RelationshipLabels[Relationship.PARENT] },
        { value: Relationship.CHILD, label: RelationshipLabels[Relationship.CHILD] },
        { value: Relationship.SPOUSE, label: RelationshipLabels[Relationship.SPOUSE] },
        { value: Relationship.SIBLING, label: RelationshipLabels[Relationship.SIBLING] },
        { value: Relationship.GRANDPARENT, label: RelationshipLabels[Relationship.GRANDPARENT] },
        { value: Relationship.GRANDCHILD, label: RelationshipLabels[Relationship.GRANDCHILD] },
        { value: Relationship.OTHER, label: RelationshipLabels[Relationship.OTHER] },
    ];

    // Fetch relatives
    const fetchRelatives = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await PatientRelativeService.getMyRelatives();
            if (response.success && response.data) {
                setRelatives(response.data);
            }
        } catch (error: any) {
            toast.error(
                error.message ||
                    t('patientRelatives.errors.loadFailed', 'Không thể tải danh sách người thân')
            );
        } finally {
            setIsLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchRelatives();
    }, [fetchRelatives]);

    // Clear errors when modal closes
    const clearErrors = () => {
        setFirstNameError('');
        setLastNameError('');
        setDateOfBirthError('');
        setPhoneError('');
        setIdentityNumberError('');
    };

    // Validate field on change
    const validateField = (field: string, value: string) => {
        switch (field) {
            case 'firstName':
                if (!value.trim()) {
                    setFirstNameError(
                        t('patientRelatives.validation.firstNameRequired', 'Vui lòng nhập họ')
                    );
                } else if (value.trim().length < 2) {
                    setFirstNameError(
                        t(
                            'patientRelatives.validation.firstNameMinLength',
                            'Họ phải có ít nhất 2 ký tự'
                        )
                    );
                } else {
                    setFirstNameError('');
                }
                break;
            case 'lastName':
                if (!value.trim()) {
                    setLastNameError(
                        t('patientRelatives.validation.lastNameRequired', 'Vui lòng nhập tên')
                    );
                } else if (value.trim().length < 2) {
                    setLastNameError(
                        t(
                            'patientRelatives.validation.lastNameMinLength',
                            'Tên phải có ít nhất 2 ký tự'
                        )
                    );
                } else {
                    setLastNameError('');
                }
                break;
            case 'dateOfBirth':
                if (!value) {
                    setDateOfBirthError(
                        t(
                            'patientRelatives.validation.dateOfBirthRequired',
                            'Vui lòng chọn ngày sinh'
                        )
                    );
                } else {
                    setDateOfBirthError('');
                }
                break;
            case 'phone':
                if (value.trim() && !AuthService.validatePhoneNumber(value)) {
                    setPhoneError(
                        t('patientRelatives.validation.phoneInvalid', 'Số điện thoại không hợp lệ')
                    );
                } else {
                    setPhoneError('');
                }
                break;
            case 'identityNumber':
                if (value.trim() && (value.trim().length < 9 || value.trim().length > 12)) {
                    setIdentityNumberError(
                        t(
                            'patientRelatives.validation.identityNumberInvalid',
                            'Số CMND/CCCD phải từ 9-12 ký tự'
                        )
                    );
                } else {
                    setIdentityNumberError('');
                }
                break;
        }
    };

    // Validate all fields before submit
    const validateAllFields = (): boolean => {
        let hasError = false;

        if (!formData.firstName.trim()) {
            setFirstNameError(
                t('patientRelatives.validation.firstNameRequired', 'Vui lòng nhập họ')
            );
            hasError = true;
        } else if (formData.firstName.trim().length < 2) {
            setFirstNameError(
                t('patientRelatives.validation.firstNameMinLength', 'Họ phải có ít nhất 2 ký tự')
            );
            hasError = true;
        }

        if (!formData.lastName.trim()) {
            setLastNameError(
                t('patientRelatives.validation.lastNameRequired', 'Vui lòng nhập tên')
            );
            hasError = true;
        } else if (formData.lastName.trim().length < 2) {
            setLastNameError(
                t('patientRelatives.validation.lastNameMinLength', 'Tên phải có ít nhất 2 ký tự')
            );
            hasError = true;
        }

        if (!formData.dateOfBirth) {
            setDateOfBirthError(
                t('patientRelatives.validation.dateOfBirthRequired', 'Vui lòng chọn ngày sinh')
            );
            hasError = true;
        }

        if (phone.trim() && !AuthService.validatePhoneNumber(phone)) {
            setPhoneError(
                t('patientRelatives.validation.phoneInvalid', 'Số điện thoại không hợp lệ')
            );
            hasError = true;
        }

        if (
            formData.identityNumber.trim() &&
            (formData.identityNumber.trim().length < 9 ||
                formData.identityNumber.trim().length > 12)
        ) {
            setIdentityNumberError(
                t(
                    'patientRelatives.validation.identityNumberInvalid',
                    'Số CMND/CCCD phải từ 9-12 ký tự'
                )
            );
            hasError = true;
        }

        return !hasError;
    };

    // Handle form input change
    const handleInputChange = (
        field: keyof RelativeFormData,
        value: string | Gender | Relationship
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (typeof value === 'string') {
            validateField(field, value);
        }
    };

    // Handle gender change
    const handleGenderChange = (option: GenderOption | null) => {
        if (option) {
            setFormData((prev) => ({ ...prev, gender: option.value }));
        }
    };

    // Handle relationship change
    const handleRelationshipChange = (option: RelationshipOption | null) => {
        if (option) {
            setFormData((prev) => ({ ...prev, relationship: option.value }));
        }
    };

    // Open modal for create
    const handleOpenCreate = () => {
        setEditingRelative(null);
        setFormData(initialFormData);
        setPhoneValue('');
        clearErrors();
        setShowModal(true);
    };

    // Open modal for edit
    const handleOpenEdit = (relative: PatientRelativeResponse) => {
        setEditingRelative(relative);
        setFormData({
            firstName: relative.firstName,
            lastName: relative.lastName,
            gender: relative.gender,
            dateOfBirth: relative.dateOfBirth.split('T')[0],
            relationship: relative.relationship,
            healthInsuranceNumber: relative.healthInsuranceNumber || '',
            identityNumber: relative.identityNumber || '',
            notes: relative.notes || '',
        });
        setPhoneValue(relative.phone || '');
        clearErrors();
        setShowModal(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingRelative(null);
        setFormData(initialFormData);
        setPhoneValue('');
        clearErrors();
    };

    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateAllFields()) {
            toast.error(
                t('patientRelatives.errors.validationFailed', 'Vui lòng kiểm tra lại thông tin')
            );
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingRelative) {
                // Update
                const request: UpdatePatientRelativeRequest = {
                    firstName: formData.firstName.trim(),
                    lastName: formData.lastName.trim(),
                    gender: formData.gender,
                    dateOfBirth: formData.dateOfBirth,
                    phone: phone.trim() || undefined,
                    relationship: formData.relationship,
                    healthInsuranceNumber: formData.healthInsuranceNumber.trim() || undefined,
                    identityNumber: formData.identityNumber.trim() || undefined,
                    notes: formData.notes.trim() || undefined,
                };
                const response = await PatientRelativeService.updateRelative(
                    editingRelative.id,
                    request
                );
                if (response.success) {
                    toast.success(
                        t(
                            'patientRelatives.success.updated',
                            'Cập nhật thông tin người thân thành công'
                        )
                    );
                    handleCloseModal();
                    fetchRelatives();
                }
            } else {
                // Create
                const request: CreatePatientRelativeRequest = {
                    firstName: formData.firstName.trim(),
                    lastName: formData.lastName.trim(),
                    gender: formData.gender,
                    dateOfBirth: formData.dateOfBirth,
                    phone: phone.trim() || undefined,
                    relationship: formData.relationship,
                    healthInsuranceNumber: formData.healthInsuranceNumber.trim() || undefined,
                    identityNumber: formData.identityNumber.trim() || undefined,
                    notes: formData.notes.trim() || undefined,
                };
                const response = await PatientRelativeService.createRelative(request);
                if (response.success) {
                    toast.success(
                        t('patientRelatives.success.created', 'Thêm người thân thành công')
                    );
                    handleCloseModal();
                    fetchRelatives();
                }
            }
        } catch (error: any) {
            toast.error(error.message || t('patientRelatives.errors.saveFailed', 'Có lỗi xảy ra'));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete relative
    const handleDelete = async (id: string) => {
        try {
            setIsSubmitting(true);
            const response = await PatientRelativeService.deleteRelative(id);
            if (response.success) {
                toast.success(t('patientRelatives.success.deleted', 'Xóa người thân thành công'));
                setDeleteConfirm(null);
                fetchRelatives();
            }
        } catch (error: any) {
            toast.error(
                error.message ||
                    t('patientRelatives.errors.deleteFailed', 'Không thể xóa người thân')
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="card-title mb-0">
                    <i className="isax isax-people me-2"></i>
                    {t('patientRelatives.title', 'Quản lý người thân')}
                </h4>
                <button
                    className="btn btn-primary btn-sm"
                    onClick={handleOpenCreate}
                    disabled={relatives.length >= 10}
                >
                    <i className="fa fa-plus me-1"></i>
                    {t('patientRelatives.addButton', 'Thêm người thân')}
                </button>
            </div>
            <div className="card-body">
                {/* Info alert */}
                <div className="alert alert-info mb-4">
                    <i className="fa fa-info-circle me-2"></i>
                    <strong>{t('patientRelatives.note', 'Lưu ý')}:</strong>{' '}
                    {t(
                        'patientRelatives.maxRelatives',
                        'Bạn có thể thêm tối đa 10 người thân để đặt lịch khám thay.'
                    )}{' '}
                    {t('patientRelatives.currentCount', 'Hiện tại')}: {relatives.length}/10{' '}
                    {t('patientRelatives.relatives', 'người thân')}.
                </div>

                {/* Loading state - Skeleton */}
                {isLoading ? (
                    <div className="row">
                        {[1, 2, 3].map((index) => (
                            <div key={index} className="col-md-6 col-lg-4 mb-3">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center mb-3">
                                            <Skeleton variant="circular" width={50} height={50} />
                                            <div className="ms-3 flex-grow-1">
                                                <Skeleton variant="text" width="70%" height={24} />
                                                <Skeleton variant="text" width="50%" height={18} />
                                            </div>
                                        </div>
                                        <Skeleton variant="text" width="60%" height={18} />
                                        <Skeleton variant="text" width="80%" height={18} />
                                        <Skeleton variant="text" width="40%" height={18} />
                                        <div className="d-flex gap-2 mt-3">
                                            <Skeleton
                                                variant="rectangular"
                                                width={70}
                                                height={32}
                                                sx={{ borderRadius: 1 }}
                                            />
                                            <Skeleton
                                                variant="rectangular"
                                                width={70}
                                                height={32}
                                                sx={{ borderRadius: 1 }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : relatives.length === 0 ? (
                    /* Empty state */
                    <div className="text-center py-5">
                        <i className="isax isax-people text-muted" style={{ fontSize: '4rem' }}></i>
                        <h5 className="mt-3 text-muted">
                            {t('patientRelatives.empty.title', 'Chưa có người thân nào')}
                        </h5>
                        <p className="text-muted">
                            {t(
                                'patientRelatives.empty.description',
                                'Thêm người thân để có thể đặt lịch khám thay cho họ'
                            )}
                        </p>
                        <button className="btn btn-primary" onClick={handleOpenCreate}>
                            <i className="fa fa-plus me-1"></i>
                            {t('patientRelatives.empty.addFirst', 'Thêm người thân đầu tiên')}
                        </button>
                    </div>
                ) : (
                    /* Relatives list */
                    <div className="row">
                        {relatives.map((relative) => (
                            <div key={relative.id} className="col-md-6 col-lg-4 mb-3">
                                <div className={`card h-100 ${styles.relativeCard}`}>
                                    <div className="card-body">
                                        <div className={styles.cardHeader}>
                                            <h5 className={styles.relativeName}>
                                                {relative.fullName}
                                            </h5>
                                            <span className={styles.relationshipBadge}>
                                                {relative.relationshipDisplay}
                                            </span>
                                        </div>
                                        <div className={styles.cardInfo}>
                                            <div className={styles.infoItem}>
                                                <i className="fa fa-venus-mars"></i>
                                                {relative.genderDisplay}
                                            </div>
                                            <div className={styles.infoItem}>
                                                <i className="fa fa-birthday-cake"></i>
                                                {new Date(relative.dateOfBirth).toLocaleDateString(
                                                    'vi-VN'
                                                )}{' '}
                                                ({relative.age}{' '}
                                                {t('patientRelatives.yearsOld', 'tuổi')})
                                            </div>
                                            {relative.phone && (
                                                <div className={styles.infoItem}>
                                                    <i className="fa fa-phone"></i>
                                                    {relative.phone}
                                                </div>
                                            )}
                                            {relative.healthInsuranceNumber && (
                                                <div className={styles.infoItem}>
                                                    <i className="fa fa-id-card"></i>
                                                    BHYT: {relative.healthInsuranceNumber}
                                                </div>
                                            )}
                                        </div>
                                        <div className={styles.cardActions}>
                                            <button
                                                className={styles.btnEdit}
                                                onClick={() => handleOpenEdit(relative)}
                                            >
                                                <i className="fa fa-edit"></i>
                                                {t('common:actions.edit', 'Chỉnh sửa')}
                                            </button>
                                            <button
                                                className={styles.btnDelete}
                                                onClick={() => setDeleteConfirm(relative.id)}
                                            >
                                                <i className="fa fa-trash"></i>
                                                {t('common:actions.delete', 'Xóa')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingRelative
                                        ? t(
                                              'patientRelatives.modal.editTitle',
                                              'Cập nhật thông tin người thân'
                                          )
                                        : t(
                                              'patientRelatives.modal.createTitle',
                                              'Thêm người thân mới'
                                          )}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseModal}
                                    disabled={isSubmitting}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="row">
                                        {/* First Name */}
                                        <div className="col-md-6">
                                            <Input
                                                id="firstName"
                                                label={t('patientRelatives.fields.firstName', 'Họ')}
                                                isRequired
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) =>
                                                    handleInputChange('firstName', e.target.value)
                                                }
                                                placeholder={t(
                                                    'patientRelatives.placeholder.firstName',
                                                    'Nhập họ'
                                                )}
                                                error={firstNameError}
                                                wrapperClassName="mb-3"
                                            />
                                        </div>

                                        {/* Last Name */}
                                        <div className="col-md-6">
                                            <Input
                                                id="lastName"
                                                label={t('patientRelatives.fields.lastName', 'Tên')}
                                                isRequired
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) =>
                                                    handleInputChange('lastName', e.target.value)
                                                }
                                                placeholder={t(
                                                    'patientRelatives.placeholder.lastName',
                                                    'Nhập tên'
                                                )}
                                                error={lastNameError}
                                                wrapperClassName="mb-3"
                                            />
                                        </div>

                                        {/* Gender */}
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    {t(
                                                        'patientRelatives.fields.gender',
                                                        'Giới tính'
                                                    )}{' '}
                                                    <span className="text-danger">*</span>
                                                </label>
                                                <Select<GenderOption>
                                                    value={genderOptions.find(
                                                        (opt) => opt.value === formData.gender
                                                    )}
                                                    onChange={handleGenderChange}
                                                    options={genderOptions}
                                                    placeholder={t(
                                                        'patientRelatives.placeholder.gender',
                                                        'Chọn giới tính'
                                                    )}
                                                    styles={customSelectStyles}
                                                    isSearchable={false}
                                                />
                                            </div>
                                        </div>

                                        {/* Date of Birth */}
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <DateInput
                                                    label={t(
                                                        'patientRelatives.fields.dateOfBirth',
                                                        'Ngày sinh'
                                                    )}
                                                    value={formData.dateOfBirth}
                                                    onChange={(date) =>
                                                        handleInputChange('dateOfBirth', date)
                                                    }
                                                    placeholder={t(
                                                        'patientRelatives.placeholder.dateOfBirth',
                                                        'Chọn ngày sinh'
                                                    )}
                                                    isRequired={true}
                                                    maxDate={new Date()}
                                                    minDate={new Date('1900-01-01')}
                                                    error={dateOfBirthError}
                                                />
                                            </div>
                                        </div>

                                        {/* Relationship */}
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    {t(
                                                        'patientRelatives.fields.relationship',
                                                        'Mối quan hệ'
                                                    )}{' '}
                                                    <span className="text-danger">*</span>
                                                </label>
                                                <Select<RelationshipOption>
                                                    value={relationshipOptions.find(
                                                        (opt) => opt.value === formData.relationship
                                                    )}
                                                    onChange={handleRelationshipChange}
                                                    options={relationshipOptions}
                                                    placeholder={t(
                                                        'patientRelatives.placeholder.relationship',
                                                        'Chọn mối quan hệ'
                                                    )}
                                                    styles={customSelectStyles}
                                                    isSearchable={false}
                                                />
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="col-md-6">
                                            <Input
                                                id="phone"
                                                label={t(
                                                    'patientRelatives.fields.phone',
                                                    'Số điện thoại'
                                                )}
                                                type="tel"
                                                value={phone}
                                                onChange={handlePhoneChange}
                                                onPaste={handlePhonePaste}
                                                onKeyDown={handlePhoneKeyDown}
                                                placeholder={t(
                                                    'patientRelatives.placeholder.phone',
                                                    'Nhập số điện thoại'
                                                )}
                                                error={phoneError}
                                                wrapperClassName="mb-3"
                                            />
                                        </div>

                                        {/* Health Insurance Number */}
                                        <div className="col-md-6">
                                            <Input
                                                id="healthInsuranceNumber"
                                                label={t(
                                                    'patientRelatives.fields.healthInsurance',
                                                    'Số BHYT'
                                                )}
                                                type="text"
                                                value={formData.healthInsuranceNumber}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        'healthInsuranceNumber',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder={t(
                                                    'patientRelatives.placeholder.healthInsurance',
                                                    'Nhập số bảo hiểm y tế'
                                                )}
                                                wrapperClassName="mb-3"
                                            />
                                        </div>

                                        {/* Identity Number */}
                                        <div className="col-md-6">
                                            <Input
                                                id="identityNumber"
                                                label={t(
                                                    'patientRelatives.fields.identityNumber',
                                                    'Số CMND/CCCD'
                                                )}
                                                type="text"
                                                value={formData.identityNumber}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        'identityNumber',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder={t(
                                                    'patientRelatives.placeholder.identityNumber',
                                                    'Nhập số CMND/CCCD'
                                                )}
                                                error={identityNumberError}
                                                wrapperClassName="mb-3"
                                            />
                                        </div>

                                        {/* Notes */}
                                        <div className="col-12">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    {t('patientRelatives.fields.notes', 'Ghi chú')}
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    value={formData.notes}
                                                    onChange={(e) =>
                                                        handleInputChange('notes', e.target.value)
                                                    }
                                                    placeholder={t(
                                                        'patientRelatives.placeholder.notes',
                                                        'Ghi chú thêm (tiền sử bệnh, dị ứng...)'
                                                    )}
                                                    rows={3}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={handleCloseModal}
                                        disabled={isSubmitting}
                                    >
                                        {t('common:actions.cancel', 'Hủy')}
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-1"></span>
                                                {t('common:actions.processing', 'Đang xử lý...')}
                                            </>
                                        ) : editingRelative ? (
                                            t('common:actions.update', 'Cập nhật')
                                        ) : (
                                            t('common:actions.add', 'Thêm mới')
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title text-danger">
                                    <i className="fa fa-exclamation-triangle me-2"></i>
                                    {t('patientRelatives.delete.title', 'Xác nhận xóa')}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setDeleteConfirm(null)}
                                    disabled={isSubmitting}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>
                                    {t(
                                        'patientRelatives.delete.message',
                                        'Bạn có chắc chắn muốn xóa người thân này không?'
                                    )}
                                </p>
                                <p className="text-muted small mb-0">
                                    {t(
                                        'patientRelatives.delete.warning',
                                        'Hành động này không thể hoàn tác.'
                                    )}
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setDeleteConfirm(null)}
                                    disabled={isSubmitting}
                                >
                                    {t('common:actions.cancel', 'Hủy')}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(deleteConfirm)}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-1"></span>
                                            {t('patientRelatives.delete.deleting', 'Đang xóa...')}
                                        </>
                                    ) : (
                                        t('common:actions.delete', 'Xóa')
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientRelatives;
