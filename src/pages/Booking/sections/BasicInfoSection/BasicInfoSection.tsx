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
                                <label className="form-label">Họ</label>
                                <input type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Tên</label>
                                <input type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Số điện thoại</label>
                                <input type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Địa chỉ email</label>
                                <input type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Triệu chứng</label>
                                <input type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="mb-3">
                                <label className="form-label">Tệp đính kèm</label>
                                <input type="file" className="form-control" />
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="mb-3">
                                <label className="form-label">Lý do khám</label>
                                <textarea className="form-control" rows={3}></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BookingSectionWrapper>
    );
};

export default BasicInfoSection;
