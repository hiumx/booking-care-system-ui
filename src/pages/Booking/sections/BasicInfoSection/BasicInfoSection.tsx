import BookingSectionWrapper from '../../components/BookingSectionWrapper/BookingSectionWrapper';
import { mockDoctorInfo, mockAppointmentInfo } from '../../constants/mockData';

interface BasicInfoSectionProps {
    nextStep: () => void;
    prevStep: () => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ nextStep, prevStep }) => {
    return (
        <BookingSectionWrapper
            doctor={mockDoctorInfo}
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
                                    Họ
                                </label>
                                <input type="text" className="form-control" id="firstName" />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="lastName">
                                    Tên
                                </label>
                                <input type="text" className="form-control" id="lastName" />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="phoneNumber">
                                    Số điện thoại
                                </label>
                                <input type="text" className="form-control" id="phoneNumber" />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="email">
                                    Địa chỉ email
                                </label>
                                <input type="text" className="form-control" id="email" />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="symptoms">
                                    Triệu chứng
                                </label>
                                <input type="text" className="form-control" id="symptoms" />
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="attachments">
                                    Tệp đính kèm
                                </label>
                                <input type="file" className="form-control" id="attachments" />
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="reason">
                                    Lý do khám
                                </label>
                                <textarea className="form-control" rows={3} id="reason"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BookingSectionWrapper>
    );
};

export default BasicInfoSection;
