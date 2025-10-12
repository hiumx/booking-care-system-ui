import { useState, useEffect } from 'react';
import BookingSectionWrapper from '../../components/BookingSectionWrapper';
import { mockAppointmentInfo } from '../../constants/mockData';
import { useDoctorInfo } from '../../hooks/useDoctorInfo';
import { useAppSelector } from '@/store/hooks';
import {
    selectUserFirstName,
    selectUserLastName,
    selectUserEmail,
    selectUserPhone,
} from '@/store/selectors/user.selectors';
import CustomFileInput from '@/components/CustomFileInput/CustomFileInput';

interface BasicInfoSectionProps {
    nextStep: () => void;
    prevStep: () => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ nextStep, prevStep }) => {
    // Get doctor info from Redux (already fetched in DateTimeSection)
    const doctorInfo = useDoctorInfo();

    // Get user profile from Redux
    const userFirstName = useAppSelector(selectUserFirstName);
    const userLastName = useAppSelector(selectUserLastName);
    const userEmail = useAppSelector(selectUserEmail);
    const userPhone = useAppSelector(selectUserPhone);

    // Local state for form inputs
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [reason, setReason] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);

    // Fill form with user profile data when component mounts
    useEffect(() => {
        setFirstName(userFirstName || '');
        setLastName(userLastName || '');
        setEmail(userEmail || '');
        setPhoneNumber(userPhone || '');
    }, [userFirstName, userLastName, userEmail, userPhone]);

    // Handle file upload
    const handleFileChange = (files: File[]) => {
        setAttachments(files);
    };

    return (
        <BookingSectionWrapper
            doctor={doctorInfo}
            appointment={mockAppointmentInfo}
            nextStepTitle="Chọn phương thức thanh toán"
            nextStep={nextStep}
            prevStep={prevStep}
        >
            <div className="card mb-0">
                <div className="card-body pb-1">
                    <div className="row">
                        <div className="col-lg-4 col-md-6">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="firstName">
                                    Họ <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Nhập họ"
                                />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="lastName">
                                    Tên <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Nhập tên"
                                />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="phoneNumber">
                                    Số điện thoại <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    id="phoneNumber"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="email">
                                    Địa chỉ email <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Nhập địa chỉ email"
                                />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="symptoms">
                                    Triệu chứng
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="symptoms"
                                    value={symptoms}
                                    onChange={(e) => setSymptoms(e.target.value)}
                                    placeholder="Nhập triệu chứng"
                                />
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="attachments">
                                    Tệp đính kèm
                                </label>
                                <CustomFileInput
                                    files={attachments}
                                    onChange={handleFileChange}
                                    accept="image/*,.pdf,.doc,.docx"
                                    multiple={true}
                                    maxSize={10}
                                    id="attachments"
                                />
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="reason">
                                    Lý do khám
                                </label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    id="reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Nhập lý do khám"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BookingSectionWrapper>
    );
};

export default BasicInfoSection;
