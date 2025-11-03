import { useState, useEffect } from 'react';
import BookingSectionWrapper from '../../components/BookingSectionWrapper';
import { mockAppointmentInfo } from '../../constants/mockData';
import { useDoctorInfo } from '../../hooks/useDoctorInfo';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
    selectUserFirstName,
    selectUserLastName,
    selectUserEmail,
    selectUserPhone,
} from '@/store/selectors/user.selectors';
import CustomFileInput from '@/components/CustomFileInput/CustomFileInput';
import Input from '@/components/Input';
import {
    setBookingSymptoms,
    addAttachmentUrl,
    clearAttachmentUrls,
} from '@/store/slices/bookingSlice';
import { AppointmentService } from '@/services/appointment.service';
import { toast } from 'react-toastify';

interface BasicInfoSectionProps {
    nextStep: () => void;
    prevStep: () => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ nextStep, prevStep }) => {
    // Get doctor info from Redux (already fetched in DateTimeSection)
    const doctorInfo = useDoctorInfo();
    const dispatch = useAppDispatch();

    // Get user profile from Redux
    const userFirstName = useAppSelector(selectUserFirstName);
    const userLastName = useAppSelector(selectUserLastName);
    const userEmail = useAppSelector(selectUserEmail);
    const userPhone = useAppSelector(selectUserPhone);
    const bookingState = useAppSelector((state) => state.booking);

    // Local state for form inputs
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [symptoms, setSymptoms] = useState(bookingState.symptoms || '');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    // Fill form with user profile data when component mounts
    useEffect(() => {
        setFirstName(userFirstName || '');
        setLastName(userLastName || '');
        setEmail(userEmail || '');
        setPhoneNumber(userPhone || '');
    }, [userFirstName, userLastName, userEmail, userPhone]);

    // Clear attachment URLs when component mounts to avoid duplicate uploads
    useEffect(() => {
        dispatch(clearAttachmentUrls());
    }, [dispatch]);

    // Handle file selection (không upload ngay)
    const handleFileChange = (files: File[]) => {
        setAttachments(files);
    };

    // Handle symptoms change
    const handleSymptomsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setSymptoms(value);
        dispatch(setBookingSymptoms(value));
    };

    // Upload files when user clicks next step
    const handleNextStep = async () => {
        // Upload attachments if any
        if (attachments.length > 0) {
            setIsUploading(true);
            try {
                for (const file of attachments) {
                    const response = await AppointmentService.uploadAttachment(file);
                    if (response.success && response.data?.fileUrl) {
                        dispatch(addAttachmentUrl(response.data.fileUrl));
                    }
                }
            } catch (error: any) {
                toast.error(error.message || 'Không thể tải tệp lên');
                setIsUploading(false);
                return; // Dừng lại nếu upload thất bại
            } finally {
                setIsUploading(false);
            }
        }

        // Proceed to next step
        nextStep();
    };

    return (
        <BookingSectionWrapper
            doctor={doctorInfo}
            appointment={mockAppointmentInfo}
            nextStepTitle={isUploading ? 'Đang xử lý...' : 'Chọn phương thức thanh toán'}
            nextStep={handleNextStep}
            prevStep={prevStep}
            disabled={isUploading}
        >
            <div className="card mb-0">
                <div className="card-body pb-1">
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <Input
                                id="firstName"
                                label="Họ"
                                isRequired
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Nhập họ"
                                disabled
                                wrapperClassName="mb-3"
                            />
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <Input
                                id="lastName"
                                label="Tên"
                                isRequired
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Nhập tên"
                                disabled
                                wrapperClassName="mb-3"
                            />
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <Input
                                id="email"
                                label="Địa chỉ email"
                                isRequired
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập địa chỉ email"
                                disabled
                                wrapperClassName="mb-3"
                            />
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <Input
                                id="phoneNumber"
                                label="Số điện thoại"
                                isRequired
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Nhập số điện thoại"
                                disabled
                                wrapperClassName="mb-3"
                            />
                        </div>

                        <div className="col-lg-12">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="attachments">
                                    Tệp đính kèm{' '}
                                    <span className="text-muted ms-1">(Không bắt buộc)</span>
                                    {attachments.length > 0 && (
                                        <small className="text-success ms-2">
                                            ({attachments.length} tệp đã chọn)
                                        </small>
                                    )}
                                </label>
                                <div className="alert alert-info py-2 mb-2">
                                    <i className="fa fa-info-circle me-2"></i>
                                    <small>
                                        <strong>Khi nào nên đính kèm tệp?</strong>
                                        <ul className="mb-0 mt-1 ps-3">
                                            <li>
                                                Tái khám: Kết quả xét nghiệm, hình ảnh chụp từ lần
                                                khám trước
                                            </li>
                                            <li>Khám bệnh mãn tính: Hồ sơ bệnh án, đơn thuốc cũ</li>
                                            <li>
                                                Tư vấn từ xa: Hình ảnh triệu chứng, kết quả khám bên
                                                ngoài
                                            </li>
                                        </ul>
                                        <strong className="d-block mt-1">Chấp nhận:</strong> Ảnh
                                        (JPG, PNG), PDF, Word (DOC, DOCX) - Tối đa 10MB/tệp
                                    </small>
                                </div>
                                <CustomFileInput
                                    files={attachments}
                                    onChange={handleFileChange}
                                    accept="image/*,.pdf,.doc,.docx"
                                    multiple={true}
                                    maxSize={10}
                                    id="attachments"
                                />
                                {attachments.length > 0 && (
                                    <small className="text-muted mt-1 d-block">
                                        <i className="fa fa-info-circle me-1"></i> Tệp sẽ được tải
                                        lên khi bạn chuyển sang bước tiếp theo
                                    </small>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="symptoms">
                                    Triệu chứng
                                </label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    id="symptoms"
                                    value={symptoms}
                                    onChange={handleSymptomsChange}
                                    placeholder="Nhập triệu chứng"
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
