import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import Input from '@/components/Input';
import Button from '@/components/Button';
import CustomFileInput from '@/components/CustomFileInput';
import { PATHS } from '@/routes/paths';
import { hospitalRegistrationSchema } from '@/utils/hospital-registration-validation';
import { HospitalRegistrationService } from '@/services/hospital-registration.service';

const ContactUs: React.FC = () => {
    const [formData, setFormData] = useState({
        hospitalName: '',
        email: '',
        phone: '',
        address: '',
        taxCode: '',
    });

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
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleFileChange = (field: keyof typeof files, selectedFiles: File[]) => {
        setFiles((prev) => ({
            ...prev,
            [field]: selectedFiles,
        }));
        // Clear error for this field when user selects files
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        const validationData = {
            hospitalName: formData.hospitalName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
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
            toast.error('Vui lòng kiểm tra lại thông tin và điền đầy đủ các trường bắt buộc', {
                position: 'top-right',
                autoClose: 5000,
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Create FormData for file upload
            const formDataToSubmit = new FormData();
            formDataToSubmit.append('HospitalName', formData.hospitalName);
            formDataToSubmit.append('Email', formData.email);
            formDataToSubmit.append('Phone', formData.phone);
            formDataToSubmit.append('Address', formData.address);
            formDataToSubmit.append('TaxCode', formData.taxCode);

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
                    'Đơn đăng ký hợp tác đã được gửi thành công! Chúng tôi sẽ xem xét và liên hệ lại trong thời gian sớm nhất.',
                    {
                        position: 'top-right',
                        autoClose: 7000,
                    }
                );

                // Reset form
                setFormData({
                    hospitalName: '',
                    email: '',
                    phone: '',
                    address: '',
                    taxCode: '',
                });
                setFiles({
                    licenseFile: [],
                    businessCertificateFile: [],
                    identityCardFile: [],
                });
            }
        } catch (error: any) {
            toast.error(
                error.message || 'Có lỗi xảy ra khi gửi đơn đăng ký. Vui lòng thử lại sau.',
                {
                    position: 'top-right',
                    autoClose: 5000,
                }
            );
        } finally {
            setIsSubmitting(false);
        }
    };

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

                {/* Contact Us */}
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
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                {/* Hospital Name */}
                                                <div className="col-md-12">
                                                    <div className="mb-3">
                                                        <Input
                                                            label="Tên bệnh viện"
                                                            placeholder="Nhập tên bệnh viện đầy đủ"
                                                            isRequired
                                                            value={formData.hospitalName}
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    'hospitalName',
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        {errors.hospitalName && (
                                                            <div className="text-danger small mt-1">
                                                                {errors.hospitalName}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Email */}
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <Input
                                                            label="Email"
                                                            type="email"
                                                            placeholder="Nhập địa chỉ email của bệnh viện"
                                                            isRequired
                                                            value={formData.email}
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    'email',
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        {errors.email && (
                                                            <div className="text-danger small mt-1">
                                                                {errors.email}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Phone */}
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <Input
                                                            label="Số điện thoại"
                                                            type="tel"
                                                            placeholder="Nhập số điện thoại liên hệ"
                                                            isRequired
                                                            value={formData.phone}
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    'phone',
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        {errors.phone && (
                                                            <div className="text-danger small mt-1">
                                                                {errors.phone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Address */}
                                                <div className="col-md-12">
                                                    <div className="mb-3">
                                                        <Input
                                                            label="Địa chỉ"
                                                            placeholder="Nhập địa chỉ đầy đủ của bệnh viện"
                                                            isRequired
                                                            value={formData.address}
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    'address',
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        {errors.address && (
                                                            <div className="text-danger small mt-1">
                                                                {errors.address}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Tax Code */}
                                                <div className="col-md-12">
                                                    <div className="mb-3">
                                                        <Input
                                                            label="Mã số thuế"
                                                            placeholder="Nhập mã số thuế (10 chữ số hoặc 10 chữ số-XXX)"
                                                            isRequired
                                                            value={formData.taxCode}
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    'taxCode',
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        {errors.taxCode && (
                                                            <div className="text-danger small mt-1">
                                                                {errors.taxCode}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* License File */}
                                                <div className="col-md-12">
                                                    <div className="mb-3">
                                                        <label className="form-label">
                                                            Giấy phép hoạt động
                                                            <span className="text-danger">*</span>
                                                        </label>
                                                        <CustomFileInput
                                                            files={files.licenseFile}
                                                            onChange={(selectedFiles) =>
                                                                handleFileChange(
                                                                    'licenseFile',
                                                                    selectedFiles
                                                                )
                                                            }
                                                            accept="image/*,.pdf,.doc,.docx"
                                                            multiple={false}
                                                            maxSize={10}
                                                            id="license-file-input"
                                                        />
                                                        {errors.licenseFile && (
                                                            <div className="text-danger small mt-1">
                                                                {errors.licenseFile}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Business Certificate File */}
                                                <div className="col-md-12">
                                                    <div className="mb-3">
                                                        <label className="form-label">
                                                            Giấy chứng nhận đăng ký doanh nghiệp
                                                            <span className="text-danger">*</span>
                                                        </label>
                                                        <CustomFileInput
                                                            files={files.businessCertificateFile}
                                                            onChange={(selectedFiles) =>
                                                                handleFileChange(
                                                                    'businessCertificateFile',
                                                                    selectedFiles
                                                                )
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

                                                {/* Identity Card File */}
                                                <div className="col-md-12">
                                                    <div className="mb-3">
                                                        <label className="form-label">
                                                            CMND/CCCD người đại diện
                                                            <span className="text-danger">*</span>
                                                        </label>
                                                        <CustomFileInput
                                                            files={files.identityCardFile}
                                                            onChange={(selectedFiles) =>
                                                                handleFileChange(
                                                                    'identityCardFile',
                                                                    selectedFiles
                                                                )
                                                            }
                                                            accept="image/*,.pdf,.doc,.docx"
                                                            multiple={false}
                                                            maxSize={10}
                                                            id="identity-card-file-input"
                                                        />
                                                        {errors.identityCardFile && (
                                                            <div className="text-danger small mt-1">
                                                                {errors.identityCardFile}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Submit Button */}
                                                <div className="col-md-12">
                                                    <div className="form-group-btn mb-0 text-end">
                                                        <Button
                                                            text={
                                                                isSubmitting
                                                                    ? 'Đang gửi...'
                                                                    : 'Gửi đơn đăng ký'
                                                            }
                                                            type="submit"
                                                            isDisabled={isSubmitting}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* /Contact Us */}

                {/* Contact Map */}
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
                {/* /Contact Map */}
            </MainLayout>
        </div>
    );
};

export default ContactUs;
