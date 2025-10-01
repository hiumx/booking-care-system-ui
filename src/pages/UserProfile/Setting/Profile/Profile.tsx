import { useState, useEffect } from 'react';
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

interface GenderOption {
    value: Gender;
    label: string;
}

const Profile = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { profile, isLoading } = useSelector((state: RootState) => state.user);

    const [updateData, setUpdateData] = useState<UpdateUserRequest>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        gender: Gender.MALE,
        dateOfBirth: '',
        address: '',
        avatarUrl: '',
    });

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

    // Load user profile data when component mounts or profile changes
    useEffect(() => {
        if (profile) {
            setUpdateData({
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                email: profile.email || '',
                phoneNumber: profile.phoneNumber || '',
                gender: profile.gender || Gender.MALE,
                dateOfBirth: formatDateForInput(profile.dateOfBirth),
                address: profile.address || '',
                avatarUrl: profile.avatarUrl || '',
            });
        }
    }, [profile]);

    const handleInputChange = (field: keyof UpdateUserRequest, value: string | Gender) => {
        setUpdateData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleGenderChange = (selectedOption: GenderOption | null) => {
        if (selectedOption) {
            handleInputChange('gender', selectedOption.value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Create UpdateUserRequest object with current data
            const updateRequest: UpdateUserRequest = {
                firstName: updateData.firstName,
                lastName: updateData.lastName,
                email: updateData.email,
                phoneNumber: updateData.phoneNumber,
                gender: updateData.gender,
                dateOfBirth: updateData.dateOfBirth,
                address: updateData.address,
                avatarUrl: updateData.avatarUrl,
            };

            await dispatch(updateUserProfile(updateRequest)).unwrap();
            toast.success('Cập nhật thông tin thành công!');
        } catch (error: any) {
            console.error('Failed to update profile:', error);
            toast.error(error.message || 'Không thể cập nhật thông tin. Vui lòng thử lại!');
        }
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
                    <div className="profile-img">
                        <i className="fa-solid fa-file-image"></i>
                    </div>
                    <div className="upload-img">
                        <div className="imgs-load d-flex align-items-center">
                            <div className="change-photo">
                                Tải ảnh mới
                                <input type="file" className="upload" accept="image/*" />
                            </div>
                            <a href="#" className="upload-remove">
                                Xóa
                            </a>
                        </div>
                        <p>Ảnh của bạn phải dưới 4 MB, định dạng được chấp nhận: jpg, png, svg</p>
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
                            />
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                            <Input
                                label="Email"
                                isRequired
                                type="email"
                                value={updateData.email || ''}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                            <Input
                                label="Số điện thoại"
                                isRequired
                                type="text"
                                value={updateData.phoneNumber || ''}
                                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            />
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
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal-btn text-end">
                <a href="#" className="btn btn-md btn-light rounded-pill">
                    Hủy
                </a>
                <Button
                    text={isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    type="submit"
                    className="btn-md rounded-pill"
                    isDisabled={isLoading}
                />
            </div>
        </form>
    );
};

export default Profile;
