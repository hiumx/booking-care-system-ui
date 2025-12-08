import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import Input from '@/components/Input';
import Button from '@/components/Button';
import CustomFileInput from '@/components/CustomFileInput';
import StepWizard from '@/components/StepWizard';
import { PATHS } from '@/routes/paths';
import { hospitalRegistrationSchema } from '@/utils/hospital-registration-validation';
import { HospitalRegistrationService } from '@/services/hospital-registration.service';
import { EkycVerification } from './components';
import type { EkycFormData } from '@/types/ekyc.types';

type StepType = 1 | 2;

const STEPS: Record<string, StepType> = {
    EKYC_VERIFICATION: 1,
    REGISTRATION_FORM: 2,
};

const STEP_ITEMS = [
    { id: 1, title: 'Xác thực danh tính' },
    { id: 2, title: 'Thông tin đăng ký' },
];

const ContactUs: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<StepType>(STEPS.EKYC_VERIFICATION);
    const [formData, setFormData] = useState({
        representativeName: '',
        representativeEmail: '',
        representativePhone: '',
        hospitalName: '',
        hospitalEmail: '',
        hospitalPhone: '',
        address: '',
        taxCode: '',
    });

    const [ekycData, setEkycData] = useState<EkycFormData>({ isVerified: false });
    const [isEkycVerified, setIsEkycVerified] = useState(false);

    const [files, setFiles] = useState<{
        licenseFile: File[];
        businessCertificateFile: File[];
        identityCardFile: File[];
    }>({
        licenseFile: [],
        businessCertificateFile: [],
        identityCardFile: [],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleFileChange = (field: keyof typeof files, selectedFiles: File[]) => {
        setFiles((prev) => ({ ...prev, [field]: selectedFiles }));
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleEkycComplete = (data: EkycFormData) => {
        setEkycData(data);
        setIsEkycVerified(true);

        // Auto-fill representative name from OCR result
        if (data.idCardName) {
            setFormData((prev) => ({
                ...prev,
                representativeName: data.idCardName || prev.representativeName,
            }));
        }

        setCurrentStep(STEPS.REGISTRATION_FORM);
    };

    const validateForm = (): boolean => {
        const validationData = {
            representativeName: formData.representativeName,
            representativeEmail: formData.representativeEmail,
            representativePhone: formData.representativePhone,
            hospitalName: formData.hospitalName,
            hospitalEmail: formData.hospitalEmail,
            hospitalPhone: formData.hospitalPhone,
            hospitalAddress: formData.address,
            taxCode: formData.taxCode,
            licenseFile: files.licenseFile[0] || new File([], ''),
            businessCertificateFile: files.businessCertificateFile[0] || new File([], ''),
            identityCardFile: files.identityCardFile[0] || new File([], ''),
        };

        const result = hospitalRegistrationSchema.safeParse(validationData);

        if (!result.success) {
            const formattedErrors: Record<string, string> = {};
            for (const issue of result.error.issues) {
                const path = issue.path[0] as string;
                formattedErrors[path] = issue.message;
            }
            setErrors(formattedErrors);
            return false;
        }

        setErrors({});
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Vui lòng kiểm tra lại thông tin và điền đầy đủ các trường bắt buộc');
            return;
        }

        setIsSubmitting(true);

        try {
            const formDataToSubmit = new FormData();
            formDataToSubmit.append('RepresentativeName', formData.representativeName);
            formDataToSubmit.append('RepresentativeEmail', formData.representativeEmail);
            formDataToSubmit.append('RepresentativePhone', formData.representativePhone);
            formDataToSubmit.append('HospitalName', formData.hospitalName);
            formDataToSubmit.append('HospitalEmail', formData.hospitalEmail);
            formDataToSubmit.append('HospitalPhone', formData.hospitalPhone);
            formDataToSubmit.append('Address', formData.address);
            formDataToSubmit.append('TaxCode', formData.taxCode);

            // Append eKYC data if verified (privacy-friendly: only verification status)
            if (isEkycVerified && ekycData.isVerified) {
                formDataToSubmit.append('IsEkycVerified', 'true');
                if (ekycData.ekycSessionId) {
                    formDataToSubmit.append('EkycSessionId', ekycData.ekycSessionId);
                }
                if (ekycData.faceMatchScore !== undefined) {
                    formDataToSubmit.append('FaceMatchScore', ekycData.faceMatchScore.toString());
                }
                if (ekycData.livenessScore !== undefined) {
                    formDataToSubmit.append('LivenessScore', ekycData.livenessScore.toString());
                }
            }

            if (files.licenseFile[0]) {
                formDataToSubmit.append('LicenseFile', files.licenseFile[0]);
            }
            if (files.businessCertificateFile[0]) {
                formDataToSubmit.append(
                    'BusinessCertificateFile',
                    files.businessCertificateFile[0]
                );
            }
            if (files.identityCardFile[0]) {
                formDataToSubmit.append('IdentityCardFile', files.identityCardFile[0]);
            }

            const response = await HospitalRegistrationService.submitRegistration(formDataToSubmit);

            if (response.success) {
                toast.success(
                    'Đơn đăng ký hợp tác đã được gửi thành công! Chúng tôi sẽ xem xét và liên hệ lại trong thời gian sớm nhất.'
                );

                // Reset form
                setFormData({
                    representativeName: '',
                    representativeEmail: '',
                    representativePhone: '',
                    hospitalName: '',
                    hospitalEmail: '',
                    hospitalPhone: '',
                    address: '',
                    taxCode: '',
                });
                setFiles({
                    licenseFile: [],
                    businessCertificateFile: [],
                    identityCardFile: [],
                });
                setEkycData({ isVerified: false });
                setIsEkycVerified(false);
                setCurrentStep(STEPS.EKYC_VERIFICATION);
            }
        } catch (error: any) {
            toast.error(
                error.message || 'Có lỗi xảy ra khi gửi đơn đăng ký. Vui lòng thử lại sau.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepIndicator = () => (
        <StepWizard steps={STEP_ITEMS} currentStep={currentStep} className="mb-4" />
    );

    const renderEkycStep = () => (
        <div className="mb-4">
            <EkycVerification onVerificationComplete={handleEkycComplete} />
        </div>
    );

    const renderRegistrationFormStep = () => (
        <form onSubmit={handleSubmit}>
            {/* eKYC Status Badge */}
            {isEkycVerified && (
                <div className="alert alert-success d-flex align-items-center mb-4">
                    <i className="isax isax-tick-circle me-2"></i>
                    <span>Đã xác thực danh tính thành công</span>
                </div>
            )}

            {/* Representative Information Section */}
            <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                    <div className="section-divider-icon me-3">
                        <i
                            className="isax isax-user"
                            style={{ fontSize: '24px', color: '#0d6efd' }}
                        ></i>
                    </div>
                    <h5 className="mb-0 text-primary fw-bold">Thông tin người đại diện</h5>
                </div>
                {isEkycVerified && (
                    <p className="text-muted small mb-3">
                        Tên người đại diện đã được tự động điền từ CMND/CCCD
                    </p>
                )}
                <div className="row">
                    <div className="col-md-12">
                        <div className="mb-3">
                            <Input
                                label="Tên người đại diện"
                                placeholder="Nhập họ và tên người đại diện"
                                isRequired
                                value={formData.representativeName}
                                onChange={(e) =>
                                    handleInputChange('representativeName', e.target.value)
                                }
                            />
                            {errors.representativeName && (
                                <div className="text-danger small mt-1">
                                    {errors.representativeName}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <Input
                                label="Email người đại diện"
                                type="email"
                                placeholder="Nhập địa chỉ email người đại diện"
                                isRequired
                                value={formData.representativeEmail}
                                onChange={(e) =>
                                    handleInputChange('representativeEmail', e.target.value)
                                }
                            />
                            {errors.representativeEmail && (
                                <div className="text-danger small mt-1">
                                    {errors.representativeEmail}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <Input
                                label="Số điện thoại người đại diện"
                                type="tel"
                                placeholder="Nhập số điện thoại người đại diện"
                                isRequired
                                value={formData.representativePhone}
                                onChange={(e) =>
                                    handleInputChange('representativePhone', e.target.value)
                                }
                            />
                            {errors.representativePhone && (
                                <div className="text-danger small mt-1">
                                    {errors.representativePhone}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Identity Card File - Only show if not eKYC verified */}

            <div className="mb-4">
                <label className="form-label">
                    CMND/CCCD người đại diện <span className="text-danger">*</span>
                </label>
                <CustomFileInput
                    files={files.identityCardFile}
                    onChange={(selectedFiles) =>
                        handleFileChange('identityCardFile', selectedFiles)
                    }
                    accept="image/*,.pdf,.doc,.docx"
                    multiple={false}
                    maxSize={10}
                    id="identity-card-file-input"
                />
                {errors.identityCardFile && (
                    <div className="text-danger small mt-1">{errors.identityCardFile}</div>
                )}
            </div>

            {/* Hospital Information Section */}
            <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                    <div className="section-divider-icon me-3">
                        <i
                            className="isax isax-hospital"
                            style={{ fontSize: '24px', color: '#28a745' }}
                        ></i>
                    </div>
                    <h5 className="mb-0 text-success fw-bold">Thông tin bệnh viện</h5>
                </div>
                <p className="text-muted small mb-3">
                    Vui lòng cung cấp thông tin chi tiết về bệnh viện muốn hợp tác
                </p>
                <div className="row">
                    <div className="col-md-12">
                        <div className="mb-3">
                            <Input
                                label="Tên bệnh viện"
                                placeholder="Nhập tên bệnh viện đầy đủ"
                                isRequired
                                value={formData.hospitalName}
                                onChange={(e) => handleInputChange('hospitalName', e.target.value)}
                            />
                            {errors.hospitalName && (
                                <div className="text-danger small mt-1">{errors.hospitalName}</div>
                            )}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <Input
                                label="Email bệnh viện"
                                type="email"
                                placeholder="Nhập địa chỉ email chính thức của bệnh viện"
                                isRequired
                                value={formData.hospitalEmail}
                                onChange={(e) => handleInputChange('hospitalEmail', e.target.value)}
                            />
                            {errors.hospitalEmail && (
                                <div className="text-danger small mt-1">{errors.hospitalEmail}</div>
                            )}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <Input
                                label="Số điện thoại bệnh viện"
                                type="tel"
                                placeholder="Nhập số điện thoại chính của bệnh viện"
                                isRequired
                                value={formData.hospitalPhone}
                                onChange={(e) => handleInputChange('hospitalPhone', e.target.value)}
                            />
                            {errors.hospitalPhone && (
                                <div className="text-danger small mt-1">{errors.hospitalPhone}</div>
                            )}
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="mb-3">
                            <Input
                                label="Địa chỉ bệnh viện"
                                placeholder="Nhập địa chỉ đầy đủ của bệnh viện"
                                isRequired
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                            />
                            {errors.hospitalAddress && (
                                <div className="text-danger small mt-1">
                                    {errors.hospitalAddress}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="mb-3">
                            <Input
                                label="Mã số thuế doanh nghiệp"
                                placeholder="Nhập mã số thuế doanh nghiệp (10 chữ số hoặc 10 chữ số-XXX)"
                                isRequired
                                value={formData.taxCode}
                                onChange={(e) => handleInputChange('taxCode', e.target.value)}
                            />
                            {errors.taxCode && (
                                <div className="text-danger small mt-1">{errors.taxCode}</div>
                            )}
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="mb-3">
                            <label className="form-label">
                                Giấy phép hoạt động <span className="text-danger">*</span>
                            </label>
                            <CustomFileInput
                                files={files.licenseFile}
                                onChange={(selectedFiles) =>
                                    handleFileChange('licenseFile', selectedFiles)
                                }
                                accept="image/*,.pdf,.doc,.docx"
                                multiple={false}
                                maxSize={10}
                                id="license-file-input"
                            />
                            {errors.licenseFile && (
                                <div className="text-danger small mt-1">{errors.licenseFile}</div>
                            )}
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="mb-3">
                            <label className="form-label">
                                Giấy chứng nhận đăng ký doanh nghiệp{' '}
                                <span className="text-danger">*</span>
                            </label>
                            <CustomFileInput
                                files={files.businessCertificateFile}
                                onChange={(selectedFiles) =>
                                    handleFileChange('businessCertificateFile', selectedFiles)
                                }
                                accept="image/*,.pdf,.doc,.docx"
                                multiple={false}
                                maxSize={10}
                                id="business-certificate-file-input"
                            />
                            {errors.businessCertificateFile && (
                                <div className="text-danger small mt-1">
                                    {errors.businessCertificateFile}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-end">
                <Button
                    text={isSubmitting ? 'Đang gửi...' : 'Gửi đơn đăng ký hợp tác'}
                    type="submit"
                    isDisabled={isSubmitting}
                />
            </div>
        </form>
    );

    return (
        <div>
            <MainLayout>
                <Breadcrumb
                    items={[
                        { label: 'Home', path: PATHS.HOME },
                        { label: 'Liên hệ hợp tác', isActive: true },
                    ]}
                    title="Liên hệ hợp tác"
                />

                <section className="contact-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-5 col-md-12">
                                <div className="section-inner-header contact-inner-header">
                                    <h6>Liên hệ hợp tác</h6>
                                    <h2>Đăng ký trở thành đối tác</h2>
                                    <p className="mt-3">
                                        Chúng tôi đang tìm kiếm các bệnh viện, phòng khám uy tín để
                                        hợp tác cung cấp dịch vụ chăm sóc sức khỏe tốt nhất cho
                                        người dùng. Vui lòng điền thông tin bên dưới để đăng ký hợp
                                        tác.
                                    </p>
                                </div>
                                <div className="card contact-card">
                                    <div className="card-body">
                                        <div className="contact-icon">
                                            <i className="isax isax-location5"></i>
                                        </div>
                                        <div className="contact-details">
                                            <h4>Địa chỉ</h4>
                                            <p>Đà Nẵng, Việt Nam</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card contact-card">
                                    <div className="card-body">
                                        <div className="contact-icon">
                                            <i className="isax isax-call5"></i>
                                        </div>
                                        <div className="contact-details">
                                            <h4>Số điện thoại</h4>
                                            <p>+84 236 3 822 888</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card contact-card">
                                    <div className="card-body">
                                        <div className="contact-icon">
                                            <i className="isax isax-sms5"></i>
                                        </div>
                                        <div className="contact-details">
                                            <h4>Email</h4>
                                            <p>
                                                <Link
                                                    to="mailto:info@example.com"
                                                    className="__cf_email__"
                                                >
                                                    info@example.com
                                                </Link>
                                            </p>
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
                                        {renderStepIndicator()}

                                        {currentStep === STEPS.EKYC_VERIFICATION &&
                                            renderEkycStep()}
                                        {currentStep === STEPS.REGISTRATION_FORM &&
                                            renderRegistrationFormStep()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="contact-map d-flex">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.262841!2d108.2583164!3d15.968891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142116949840599%3A0x365b35580f52e8d5!2sFPT%20University%20Danang!5e0!3m2!1sen!2s!4v1692873600000!5m2!1sen!2s"
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Maps - Đà Nẵng, Việt Nam"
                        onError={(e) => {
                            console.warn(
                                'Google Maps iframe failed to load, likely blocked by ad blocker'
                            );
                            e.currentTarget.style.display = 'none';
                        }}
                    ></iframe>
                </div>
            </MainLayout>
        </div>
    );
};

export default ContactUs;
