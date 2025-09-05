import { useState } from 'react';
import Select from 'react-select';
import settingStyles from '@/pages/UserProfile/Setting/Setting.module.scss';
import clsx from 'clsx';
import Button from '@/components/Button';
import Input from '@/components/Input';

interface ProfileData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phoneNumber: string;
    email: string;
    gender: string;
    address: string;
}

interface GenderOption {
    value: string;
    label: string;
}

const Profile = () => {
    // Mock data
    const [profileData, setProfileData] = useState<ProfileData>({
        firstName: 'Nguyễn Văn',
        lastName: 'An',
        dateOfBirth: '15/03/1990',
        phoneNumber: '0901234567',
        email: 'nguyenvanan@gmail.com',
        gender: 'Nam',
        address: '123 Đường ABC, Phường XYZ',
    });

    const genderOptions: GenderOption[] = [
        { value: 'Nam', label: 'Nam' },
        { value: 'Nữ', label: 'Nữ' },
        { value: 'Khác', label: 'Khác' },
    ];

    const handleInputChange = (field: keyof ProfileData, value: string) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleGenderChange = (selectedOption: GenderOption | null) => {
        if (selectedOption) {
            setProfileData((prev) => ({
                ...prev,
                gender: selectedOption.value,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Profile data:', profileData);
        // Xử lý lưu dữ liệu
    };

    const customSelectStyles = {
        control: (provided: any) => ({
            ...provided,
            minHeight: '38px',
            border: '1px solid #ced4da',
            borderRadius: '0.375rem',
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
                                value={profileData.firstName}
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
                                value={profileData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                            <label className="form-label">
                                Ngày sinh <span className="text-danger">*</span>
                            </label>
                            <div className="form-icon">
                                <input
                                    type="text"
                                    className="form-control datetimepicker"
                                    placeholder="dd/mm/yyyy"
                                    value={profileData.dateOfBirth}
                                    onChange={(e) =>
                                        handleInputChange('dateOfBirth', e.target.value)
                                    }
                                />
                                <span className="icon">
                                    <i className="isax isax-calendar-1"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                            <label className="form-label">
                                Giới tính <span className="text-danger">*</span>
                            </label>
                            <Select
                                value={genderOptions.find(
                                    (option) => option.value === profileData.gender
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
                            <Input
                                label="Số điện thoại"
                                isRequired
                                type="text"
                                value={profileData.phoneNumber}
                                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <div className="mb-3">
                            <Input
                                label="Email"
                                isRequired
                                type="email"
                                value={profileData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-lg-12">
                        <div className="mb-3">
                            <Input
                                label="Địa chỉ"
                                isRequired
                                type="text"
                                value={profileData.address}
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
                <Button text="Lưu thay đổi" type="submit" className="btn-md rounded-pill" />
            </div>
        </form>
    );
};

export default Profile;
