import { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Select from 'react-select';
import settingStyles from '@/pages/UserProfile/Setting/Setting.module.scss';
import clsx from 'clsx';
import Button from '@/components/Button';
import Input from '@/components/Input';
import DateInput from '@/components/DateInput';
import { AppDispatch, RootState } from '@/store';
import { updateUserProfile } from '@/store/slices/userSlice';
import { Gender } from '@/enums/common.enums';
import { getGenderText, UpdateUserRequest } from '@/types/user.types';
import { AuthService } from '@/services/auth.service';
import { UploadService } from '@/services/upload.service';
import { usePhoneInput } from '@/hooks/usePhoneInput';
import { validateAge } from '@/utils/validation';

interface GenderOption {
    value: Gender;
    label: string;
}

// Default avatar URLs based on gender
const DEFAULT_AVATAR_MALE =
    'https://d24em9p7s2uixh.cloudfront.net/avatars/patients/male_20251003_f9c91483.png';
const DEFAULT_AVATAR_FEMALE =
    'https://d24em9p7s2uixh.cloudfront.net/avatars/patients/female_20251003_d13e4998.png';

/**
 * Get default avatar URL based on gender
 */
const getDefaultAvatarByGender = (gender: Gender | undefined): string => {
    if (gender === Gender.FEMALE) {
        return DEFAULT_AVATAR_FEMALE;
    }
    // Default to male avatar for MALE, OTHER, or undefined
    return DEFAULT_AVATAR_MALE;
};

const Profile = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { profile, isLoading } = useSelector((state: RootState) => state.user);
    const { emailConfirmed, phoneConfirmed } = useSelector((state: RootState) => state.auth);

    // Use phone input hook
    const { phone, handlePhoneChange, handlePhonePaste, handlePhoneKeyDown, setPhoneValue } =
        usePhoneInput();

    const [updateData, setUpdateData] = useState<UpdateUserRequest>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: Gender.MALE,
        dateOfBirth: '',
        address: '',
        avatarUrl: '',
    });

    // Store original data for comparison
    const [originalData, setOriginalData] = useState<UpdateUserRequest>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: Gender.MALE,
        dateOfBirth: '',
        address: '',
        avatarUrl: '',
    });

    // Validation states
    const [emailError, setEmailError] = useState<string>('');
    const [phoneError, setPhoneError] = useState<string>('');
    const [firstNameError, setFirstNameError] = useState<string>('');
    const [lastNameError, setLastNameError] = useState<string>('');
    const [addressError, setAddressError] = useState<string>('');
    const [dateOfBirthError, setDateOfBirthError] = useState<string>('');

    // Avatar upload states
    const [avatarPreview, setAvatarPreview] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isAvatarDeleted, setIsAvatarDeleted] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const genderOptions: GenderOption[] = [
        { value: Gender.MALE, label: getGenderText(Gender.MALE) },
        { value: Gender.FEMALE, label: getGenderText(Gender.FEMALE) },
        { value: Gender.OTHER, label: getGenderText(Gender.OTHER) },
    ];

    // Helper function to format date for input field
    const formatDateForInput = (dateString: string): string => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0]; // YYYY-MM-DD format
        } catch {
            return '';
        }
    };

    // Check if data has changed from original
    const hasChanges = useMemo(() => {
        return (
            updateData.firstName !== originalData.firstName ||
            updateData.lastName !== originalData.lastName ||
            updateData.email !== originalData.email ||
            phone !== originalData.phone || // Use phone from hook
            updateData.gender !== originalData.gender ||
            updateData.dateOfBirth !== originalData.dateOfBirth ||
            updateData.address !== originalData.address ||
            updateData.avatarUrl !== originalData.avatarUrl ||
            selectedFile !== null || // Có file mới chọn
            isAvatarDeleted // Đã đánh dấu xóa
        );
    }, [updateData, originalData, phone, selectedFile, isAvatarDeleted]);

    // Load user profile data when component mounts or profile changes
    useEffect(() => {
        if (profile) {
            // Set default avatar if not exists
            const avatarUrl =
                profile.avatarUrl || getDefaultAvatarByGender(profile.gender || Gender.MALE);

            const profileData = {
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                email: profile.email || '',
                phone: profile.phone || '',
                gender: profile.gender || Gender.MALE,
                dateOfBirth: formatDateForInput(profile.dateOfBirth),
                address: profile.address || '',
                avatarUrl: avatarUrl,
            };

            setUpdateData(profileData);
            setOriginalData(profileData); // Store original data
            // Set phone value from profile
            setPhoneValue(profile.phone || '');
            // Set avatar preview from profile (use default if not exists)
            setAvatarPreview(avatarUrl);
            // Clear all error states
            setEmailError('');
            setPhoneError('');
            setFirstNameError('');
            setLastNameError('');
            setAddressError('');
            setDateOfBirthError('');
        }
    }, [profile, setPhoneValue]);

    // Cleanup avatar preview URL on unmount
    useEffect(() => {
        return () => {
            if (avatarPreview?.startsWith('blob:')) {
                UploadService.revokePreviewUrl(avatarPreview);
            }
        };
    }, [avatarPreview]);

    // Helper: Validate field on change
    const validateFieldOnChange = (field: keyof UpdateUserRequest, value: string | Gender) => {
        if (typeof value !== 'string') return;

        const validators: Record<string, () => void> = {
            firstName: () => {
                let error = '';
                if (!value.trim()) {
                    error = 'Họ không được để trống';
                } else if (value.trim().length < 2) {
                    error = 'Họ phải có ít nhất 2 ký tự';
                }
                setFirstNameError(error);
            },
            lastName: () => {
                let error = '';
                if (!value.trim()) {
                    error = 'Tên không được để trống';
                } else if (value.trim().length < 2) {
                    error = 'Tên phải có ít nhất 2 ký tự';
                }
                setLastNameError(error);
            },
            email: () => {
                if (emailConfirmed) return;
                const error =
                    value.trim() && !AuthService.validateEmail(value) ? 'Email không hợp lệ' : '';
                setEmailError(error);
            },
            dateOfBirth: () => {
                let error = '';
                if (!value.trim()) {
                    error = 'Ngày sinh không được để trống';
                } else if (!validateAge(value)) {
                    error = 'Bạn phải từ 18 tuổi trở lên';
                }
                setDateOfBirthError(error);
            },
            address: () => {
                let error = '';
                if (!value.trim()) {
                    error = 'Địa chỉ không được để trống';
                } else if (value.trim().length < 5) {
                    error = 'Địa chỉ phải có ít nhất 5 ký tự';
                }
                setAddressError(error);
            },
        };

        validators[field]?.();
    };

    const handleInputChange = (field: keyof UpdateUserRequest, value: string | Gender) => {
        setUpdateData((prev) => ({ ...prev, [field]: value }));
        validateFieldOnChange(field, value);
    };

    const handleGenderChange = (selectedOption: GenderOption | null) => {
        if (selectedOption) {
            handleInputChange('gender', selectedOption.value);
        }
    };

    // Handle phone validation separately
    const handlePhoneValidation = (value: string) => {
        if (phoneConfirmed) return;

        if (value.trim()) {
            if (AuthService.validatePhoneNumber(value)) {
                setPhoneError('');
            } else {
                setPhoneError('Số điện thoại phải có 10 chữ số và bắt đầu bằng 0');
            }
        } else {
            setPhoneError('');
        }
    };

    // Helper: Validate all fields before submit
    const validateAllFields = (): boolean => {
        let hasError = false;

        // Validate firstName
        if (!updateData.firstName?.trim()) {
            setFirstNameError('Họ không được để trống');
            hasError = true;
        } else if (updateData.firstName.trim().length < 2) {
            setFirstNameError('Họ phải có ít nhất 2 ký tự');
            hasError = true;
        }

        // Validate lastName
        if (!updateData.lastName?.trim()) {
            setLastNameError('Tên không được để trống');
            hasError = true;
        } else if (updateData.lastName.trim().length < 2) {
            setLastNameError('Tên phải có ít nhất 2 ký tự');
            hasError = true;
        }

        // Validate email if not confirmed
        if (
            !emailConfirmed &&
            updateData.email?.trim() &&
            !AuthService.validateEmail(updateData.email)
        ) {
            setEmailError('Email không hợp lệ');
            hasError = true;
        }

        // Validate phone if not confirmed (use phone from hook)
        if (!phoneConfirmed && phone.trim() && !AuthService.validatePhoneNumber(phone)) {
            setPhoneError('Số điện thoại phải có 10 chữ số và bắt đầu bằng 0');
            hasError = true;
        }

        // Validate dateOfBirth
        if (!updateData.dateOfBirth?.trim()) {
            setDateOfBirthError('Ngày sinh không được để trống');
            hasError = true;
        } else if (!validateAge(updateData.dateOfBirth)) {
            setDateOfBirthError('Bạn phải từ 18 tuổi trở lên');
            hasError = true;
        }

        // Validate address
        if (!updateData.address?.trim()) {
            setAddressError('Địa chỉ không được để trống');
            hasError = true;
        } else if (updateData.address.trim().length < 5) {
            setAddressError('Địa chỉ phải có ít nhất 5 ký tự');
            hasError = true;
        }

        // Check if at least one of email or phone is provided (use phone from hook)
        if (!updateData.email?.trim() && !phone.trim()) {
            toast.error('Vui lòng cung cấp ít nhất một trong email hoặc số điện thoại!');
            hasError = true;
        }

        return hasError;
    };

    // Helper: Handle avatar upload
    const processAvatarUpload = async (): Promise<string | undefined> => {
        if (selectedFile) {
            const uploadResult = await UploadService.uploadAvatar(selectedFile);
            if (uploadResult.success) {
                return uploadResult.cloudFrontUrl || uploadResult.fileUrl || '';
            }
            throw new Error(uploadResult.errorMessage || 'Upload ảnh thất bại');
        }

        if (isAvatarDeleted) {
            return getDefaultAvatarByGender(updateData.gender);
        }

        return updateData.avatarUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if there are any changes (including avatar)
        const hasAvatarChange = selectedFile !== null || isAvatarDeleted;
        if (!hasChanges && !hasAvatarChange) {
            toast.info('Không có thay đổi nào để lưu');
            return;
        }

        // Validate all fields
        if (validateAllFields()) {
            toast.error('Vui lòng kiểm tra lại thông tin!');
            return;
        }

        try {
            setIsUploadingAvatar(true);

            // Process avatar upload/delete
            const avatarUrl = await processAvatarUpload();

            // Create UpdateUserRequest object
            const updateRequest: UpdateUserRequest = {
                firstName: updateData.firstName,
                lastName: updateData.lastName,
                email: updateData.email,
                phone: phone || undefined,
                gender: updateData.gender,
                dateOfBirth: updateData.dateOfBirth,
                address: updateData.address,
                avatarUrl,
            };

            await dispatch(updateUserProfile(updateRequest)).unwrap();

            // Reset avatar states
            setSelectedFile(null);
            setIsAvatarDeleted(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            toast.success('Cập nhật thông tin thành công!');
        } catch (error: any) {
            console.error('Failed to update profile:', error);
            toast.error(error.message || 'Không thể cập nhật thông tin. Vui lòng thử lại!');
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    // Handle avatar file selection (CHỈ preview, chưa upload)
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        const validation = UploadService.validateImageFile(file);
        if (!validation.valid) {
            toast.error(validation.error);
            // Reset input để có thể chọn lại file khác
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        // Lưu file và tạo preview (chưa upload)
        setSelectedFile(file);
        const previewUrl = UploadService.createPreviewUrl(file);
        setAvatarPreview(previewUrl);
        setIsAvatarDeleted(false); // Reset trạng thái xóa nếu có

        // Reset input value để có thể chọn lại cùng file
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handle avatar delete (Chỉ đánh dấu, chưa xóa thật)
    const handleAvatarDelete = () => {
        if (!avatarPreview && !originalData.avatarUrl) {
            toast.info('Không có ảnh đại diện để xóa');
            return;
        }

        // Cleanup blob URL nếu có
        if (avatarPreview?.startsWith('blob:')) {
            UploadService.revokePreviewUrl(avatarPreview);
        }

        // Set default avatar based on gender
        const defaultAvatar = getDefaultAvatarByGender(updateData.gender);
        setAvatarPreview(defaultAvatar);
        setSelectedFile(null);
        setIsAvatarDeleted(true);

        // Reset input để có thể chọn lại file
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handle cancel delete (Khôi phục ảnh cũ)
    const handleCancelDelete = () => {
        setAvatarPreview(originalData.avatarUrl || '');
        setSelectedFile(null);
        setIsAvatarDeleted(false);

        // Reset input để có thể chọn lại file
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Trigger file input click
    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    // Handle cancel - reset to original profile data
    const handleCancel = () => {
        // Reset to original data
        setUpdateData(originalData);
        setPhoneValue(originalData.phone || '');

        // Reset avatar preview
        if (avatarPreview?.startsWith('blob:')) {
            UploadService.revokePreviewUrl(avatarPreview);
        }
        setAvatarPreview(originalData.avatarUrl || '');

        // Reset avatar states
        setSelectedFile(null);
        setIsAvatarDeleted(false);

        // Reset input để có thể chọn lại file
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        // Clear all errors
        setEmailError('');
        setPhoneError('');
        setFirstNameError('');
        setLastNameError('');
        setAddressError('');
        setDateOfBirthError('');

        toast.info('Đã hủy thay đổi');
    };

    const customSelectStyles = {
        control: (provided: any) => ({
            ...provided,
            minHeight: '45px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#0d6efd' : state.isFocused ? '#f8f9fa' : 'white',
            color: state.isSelected ? 'white' : '#212529',
        }),
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="setting-card">
                <label className="form-label mb-2">Ảnh đại diện</label>
                <div className="change-avatar img-upload">
                    <div
                        className="profile-img"
                        style={{
                            position: 'relative',
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f5f5f5',
                        }}
                    >
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt="Avatar preview"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        ) : (
                            <i
                                className="fa-solid fa-user"
                                style={{ fontSize: '48px', color: '#ccc' }}
                            ></i>
                        )}
                    </div>
                    <div className="upload-img">
                        <div className="imgs-load d-flex align-items-center">
                            <button
                                type="button"
                                className="change-photo"
                                onClick={handleAvatarClick}
                                style={{ cursor: 'pointer', border: 'none', background: 'none' }}
                            >
                                Tải ảnh mới
                            </button>{' '}
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="upload"
                                accept="image/jpeg,image/jpg,image/png,image/gif"
                                onChange={handleAvatarChange}
                                disabled={isUploadingAvatar}
                                style={{ display: 'none' }}
                            />
                            <button
                                type="button"
                                className={'upload-remove'}
                                onClick={() => {
                                    if (isAvatarDeleted) {
                                        handleCancelDelete();
                                    } else {
                                        handleAvatarDelete();
                                    }
                                }}
                                disabled={isUploadingAvatar}
                                style={{
                                    border: 'none',
                                    background: 'none',
                                    cursor: isUploadingAvatar ? 'not-allowed' : 'pointer',
                                    opacity: isUploadingAvatar ? 0.5 : 1,
                                }}
                            >
                                {isAvatarDeleted ? 'Hủy' : 'Xóa'}
                            </button>
                        </div>
                        <p>
                            Ảnh của bạn phải dưới 5 MB, định dạng được chấp nhận: jpg, jpeg, png,
                            gif
                        </p>
                    </div>
                </div>
            </div>

            <div className="setting-title">
                <h6>Thông tin cá nhân</h6>
            </div>
            <div className="setting-card">
                <div className={clsx('row', settingStyles.input)}>
                    <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                            <Input
                                label="Họ"
                                isRequired
                                type="text"
                                value={updateData.firstName || ''}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                error={firstNameError}
                            />
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                            <Input
                                label="Tên"
                                isRequired
                                type="text"
                                value={updateData.lastName || ''}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                error={lastNameError}
                            />
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                            <label className="form-label">
                                Giới tính <span className="text-danger">*</span>
                            </label>
                            <Select
                                value={genderOptions.find(
                                    (option) => option.value === updateData.gender
                                )}
                                onChange={handleGenderChange}
                                options={genderOptions}
                                placeholder="Chọn giới tính"
                                styles={customSelectStyles}
                                isSearchable={false}
                            />
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                            <DateInput
                                label="Ngày sinh"
                                value={updateData.dateOfBirth || ''}
                                onChange={(date) => handleInputChange('dateOfBirth', date)}
                                placeholder="Chọn ngày sinh"
                                isRequired={true}
                                maxDate={new Date()} // Không cho chọn ngày tương lai
                                minDate={new Date('1900-01-01')} // Giới hạn năm sinh
                                error={dateOfBirthError}
                            />
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                            <Input
                                label="Email"
                                isRequired={emailConfirmed}
                                type="email"
                                value={updateData.email || ''}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                disabled={emailConfirmed}
                                error={emailError}
                            />
                            {emailConfirmed && (
                                <small className="text-success d-block mt-1">
                                    <i className="fa-solid fa-circle-check me-1"></i> Email đã được
                                    xác thực
                                </small>
                            )}
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                            <Input
                                label="Số điện thoại"
                                isRequired={phoneConfirmed}
                                type="tel"
                                inputMode="numeric"
                                value={phone}
                                onChange={(e) => {
                                    handlePhoneChange(e);
                                    handlePhoneValidation(e.target.value);
                                }}
                                onKeyDown={handlePhoneKeyDown}
                                onPaste={handlePhonePaste}
                                disabled={phoneConfirmed}
                                error={phoneError}
                            />
                            {phoneConfirmed && (
                                <small className="text-success d-block mt-1">
                                    <i className="fa-solid fa-circle-check me-1"></i> Số điện thoại
                                    đã được xác thực
                                </small>
                            )}
                        </div>
                    </div>

                    <div className="col-lg-8 col-md-6">
                        <div className="mb-3">
                            <Input
                                label="Địa chỉ"
                                isRequired
                                type="text"
                                value={updateData.address || ''}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                error={addressError}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal-btn text-end">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-md btn-light rounded-pill"
                    disabled={isUploadingAvatar || isLoading || !hasChanges}
                >
                    Hủy
                </button>
                <Button
                    text={isUploadingAvatar ? 'Đang lưu...' : 'Lưu thay đổi'}
                    type="submit"
                    className="btn-md rounded-pill"
                    isDisabled={isUploadingAvatar || isLoading || !hasChanges}
                />
            </div>
        </form>
    );
};

export default Profile;
