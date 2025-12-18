import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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

const ContactUs: React.FC = () => {
    const { t } = useTranslation('contact');

    const STEP_ITEMS = [
        { id: 1, title: t('steps.ekyc') },
        { id: 2, title: t('steps.registration') },
    ];

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
            toast.error(t('messages.validationError'));
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
                toast.success(t('messages.success'));

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
            toast.error(error.message || t('messages.error'));
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
                    <span>{t('form.ekycVerified')}</span>
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
                    <h5 className="mb-0 text-primary fw-bold">{t('form.representative.title')}</h5>
                </div>
                {isEkycVerified && (
                    <p className="text-muted small mb-3">{t('form.representative.autoFillNote')}</p>
                )}
                <div className="row">
                    <div className="col-md-12">
                        <div className="mb-3">
                            <Input
                                label={t('form.representative.name.label')}
                                placeholder={t('form.representative.name.placeholder')}
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
                                label={t('form.representative.email.label')}
                                type="email"
                                placeholder={t('form.representative.email.placeholder')}
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
                                label={t('form.representative.phone.label')}
                                type="tel"
                                placeholder={t('form.representative.phone.placeholder')}
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
                <label className="form-label" htmlFor="identity-card-file-input">
                    {t('form.identityCard.label')} <span className="text-danger">*</span>
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
                    <h5 className="mb-0 text-success fw-bold">{t('form.hospital.title')}</h5>
                </div>
                <p className="text-muted small mb-3">{t('form.hospital.description')}</p>
                <div className="row">
                    <div className="col-md-12">
                        <div className="mb-3">
                            <Input
                                label={t('form.hospital.name.label')}
                                placeholder={t('form.hospital.name.placeholder')}
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
                                label={t('form.hospital.email.label')}
                                type="email"
                                placeholder={t('form.hospital.email.placeholder')}
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
                                label={t('form.hospital.phone.label')}
                                type="tel"
                                placeholder={t('form.hospital.phone.placeholder')}
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
                                label={t('form.hospital.address.label')}
                                placeholder={t('form.hospital.address.placeholder')}
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
                                label={t('form.hospital.taxCode.label')}
                                placeholder={t('form.hospital.taxCode.placeholder')}
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
                            <label className="form-label" htmlFor="license-file-input">
                                {t('form.hospital.license.label')}{' '}
                                <span className="text-danger">*</span>
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
                            <label className="form-label" htmlFor="business-certificate-file-input">
                                {t('form.hospital.businessCertificate.label')}{' '}
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
                    text={isSubmitting ? t('form.submit.submitting') : t('form.submit.button')}
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
                        { label: t('breadcrumb.home'), path: PATHS.HOME },
                        { label: t('breadcrumb.contact'), isActive: true },
                    ]}
                    title={t('title')}
                />

                <section className="contact-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-5 col-md-12">
                                <div className="section-inner-header contact-inner-header">
                                    <h6>{t('header.subtitle')}</h6>
                                    <h2>{t('header.title')}</h2>
                                    <p className="mt-3">{t('header.description')}</p>
                                </div>
                                <div className="card contact-card">
                                    <div className="card-body">
                                        <div className="contact-icon">
                                            <i className="isax isax-location5"></i>
                                        </div>
                                        <div className="contact-details">
                                            <h4>{t('contactInfo.address.title')}</h4>
                                            <p>{t('contactInfo.address.value')}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card contact-card">
                                    <div className="card-body">
                                        <div className="contact-icon">
                                            <i className="isax isax-call5"></i>
                                        </div>
                                        <div className="contact-details">
                                            <h4>{t('contactInfo.phone.title')}</h4>
                                            <p>{t('contactInfo.phone.value')}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card contact-card">
                                    <div className="card-body">
                                        <div className="contact-icon">
                                            <i className="isax isax-sms5"></i>
                                        </div>
                                        <div className="contact-details">
                                            <h4>{t('contactInfo.email.title')}</h4>
                                            <p>
                                                <Link
                                                    to={`mailto:${t('contactInfo.email.value')}`}
                                                    className="__cf_email__"
                                                >
                                                    {t('contactInfo.email.value')}
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
