import BookingAction from '../../components/BookingAction/BookingAction';

interface BasicInfoSectionProps {
    nextStep: () => void;
    prevStep: () => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ nextStep, prevStep }) => {
    return (
        <fieldset className="d-block">
            <div className="card booking-card mb-0">
                <div className="card-header pt-3">
                    <div className="booking-header pb-0">
                        <div className="card mb-0">
                            <div className="card-body">
                                <div className="d-flex align-items-center flex-wrap rpw-gap-2 mb-4 flex-wrap row-gap-2">
                                    <span className="avatar avatar-xxxl avatar-rounded me-2 flex-shrink-0">
                                        <img src="/src/assets/img/clients/client-15.jpg" alt="" />
                                    </span>
                                    <div>
                                        <h4 className="mb-1">
                                            BS. Nguyễn Văn Minh{' '}
                                            <span className="badge bg-orange fs-12">
                                                <i className="fa-solid fa-star me-1"></i>5.0
                                            </span>
                                        </h4>
                                        <p className="text-indigo mb-3 fw-medium">
                                            Bác sĩ Tâm lý Cao cấp
                                        </p>
                                        <p className="mb-0">
                                            <i className="isax isax-location me-2"></i>Quận 1, TP.
                                            Hồ Chí Minh
                                        </p>
                                    </div>
                                </div>
                                <h6 className="mb-2">Thông tin lịch khám</h6>
                                <div className="row gx-2 gy-3">
                                    <div className="col-lg-3 col-sm-6">
                                        <div>
                                            <h6 className="fs-14 fw-medium mb-1">Dịch vụ</h6>
                                            <p className="mb-0">Tim mạch (30 phút)</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-sm-6">
                                        <div>
                                            <h6 className="fs-14 fw-medium mb-1">Dịch vụ</h6>
                                            <p className="mb-0">Siêu âm tim</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-sm-6">
                                        <div>
                                            <h6 className="fs-14 fw-medium mb-1">Ngày & Giờ</h6>
                                            <p className="mb-0">10:00 - 11:00, 15 Tháng 10</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-sm-6">
                                        <div>
                                            <h6 className="fs-14 fw-medium mb-1">Loại lịch khám</h6>
                                            <p className="mb-0">Phòng khám (Wellness Path)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body booking-body">
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
                </div>
                <BookingAction
                    nextStepTitle="Chọn phương thức thanh toán"
                    nextStep={nextStep}
                    prevStep={prevStep}
                />
            </div>
        </fieldset>
    );
};

export default BasicInfoSection;
