import { Link } from 'react-router-dom';
import { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Select from '@/components/Select';
import { PATHS } from '@/routes/paths';
import styles from './ContactUs.module.scss';
import clsx from 'clsx';

const ContactUs: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        facilityName: '',
        facilityType: '',
        consultationPackage: '',
        message: '',
    });

    const facilityTypeOptions = [
        { label: 'Bệnh viện', value: 'hospital' },
        { label: 'Khác', value: 'other' },
    ];

    const consultationPackageOptions = [
        { label: 'NÂNG CAO', value: 'advanced' },
        { label: 'CAO CẤP', value: 'premium' },
    ];

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Handle form submission here
    };

    return (
        <div>
            <MainLayout>
                <Breadcrumb
                    items={[
                        { label: 'Home', path: PATHS.HOME },
                        { label: 'Liên hệ với chúng tôi', isActive: true },
                    ]}
                    title="Liên hệ với chúng tôi"
                />

                {/* Contact Us */}
                <section className="contact-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-5 col-md-12">
                                <div className="section-inner-header contact-inner-header">
                                    <h6>Liên hệ với chúng tôi</h6>
                                    <h2>Bạn có câu hỏi gì không?</h2>
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
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <Input
                                                            label="Họ tên"
                                                            placeholder="Nhập họ và tên đầy đủ của bạn"
                                                            isRequired
                                                            value={formData.name}
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    'name',
                                                                    e.target.value
                                                                )
                                                            }
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <Input
                                                            label="Email"
                                                            type="email"
                                                            placeholder="Nhập địa chỉ email của bạn"
                                                            isRequired
                                                            value={formData.email}
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    'email',
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
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
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <Input
                                                            label="Tên cơ sở y tế"
                                                            placeholder="Bệnh viện, phòng khám, tổ chức, công ty"
                                                            isRequired
                                                            value={formData.facilityName}
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    'facilityName',
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">
                                                            Loại hình cơ sở y tế
                                                            <span className="text-danger">*</span>
                                                        </label>
                                                        <Select
                                                            title="Chọn loại hình cơ sở y tế"
                                                            items={facilityTypeOptions}
                                                            value={formData.facilityType}
                                                            onChange={(value) =>
                                                                handleInputChange(
                                                                    'facilityType',
                                                                    value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">
                                                            Gói muốn tư vấn
                                                            <span className="text-danger">*</span>
                                                        </label>
                                                        <Select
                                                            title="Chọn gói muốn tư vấn"
                                                            items={consultationPackageOptions}
                                                            value={formData.consultationPackage}
                                                            onChange={(value) =>
                                                                handleInputChange(
                                                                    'consultationPackage',
                                                                    value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="mb-3">
                                                        <label className="form-label">
                                                            Tin nhắn
                                                            <span className="text-danger">*</span>
                                                        </label>
                                                        <textarea
                                                            className={clsx(
                                                                'form-control rounded-3',
                                                                styles.inputCustom
                                                            )}
                                                            rows={6}
                                                            value={formData.message}
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    'message',
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Nhập tin nhắn chi tiết của bạn, mô tả nhu cầu tư vấn hoặc câu hỏi cụ thể..."
                                                        ></textarea>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-group-btn mb-0">
                                                        <Button text="Gửi tin nhắn" type="submit" />
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
                    ></iframe>
                </div>
                {/* /Contact Map */}
            </MainLayout>
        </div>
    );
};

export default ContactUs;
