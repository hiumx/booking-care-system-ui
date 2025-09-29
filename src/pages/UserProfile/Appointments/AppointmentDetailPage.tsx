import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import AppointmentDetail from './components/AppointmentDetail';
import { mockAppointmentDetailData } from './data/appointmentDetailMockData';
import { AppointmentDetailStatus } from './types/appointmentDetail.types';

const AppointmentDetailPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Get appointment ID and status from URL params
    const getUrlParams = () => {
        const urlParams = new URLSearchParams(location.search);
        const appointmentId = urlParams.get('id') || '';
        const status = (urlParams.get('status') as AppointmentDetailStatus) || 'upcoming';
        return { appointmentId, status };
    };

    const { status } = getUrlParams();

    // Get appointment data (in real app, this would be fetched from API)
    const appointmentData = mockAppointmentDetailData[status];

    const handleStartSession = () => {
        alert('Bắt đầu phiên tư vấn');
        // In real app: navigate to video call page or open video modal
    };

    const handleCancel = () => {
        if (window.confirm('Bạn có chắc chắn muốn hủy cuộc hẹn này?')) {
            alert('Cuộc hẹn đã được hủy');
            // In real app: call API to cancel appointment
            navigate('/user-profile?tab=appointments');
        }
    };

    const handleReschedule = () => {
        alert('Chuyển đến trang đặt lại lịch hẹn');
        // In real app: navigate to booking page with pre-filled data
    };

    const handleDownloadPrescription = () => {
        alert('Tải đơn thuốc');
        // In real app: trigger download or open prescription modal
    };

    const handleBackToList = () => {
        navigate('/user/profile?tab=appointments');
    };

    if (!appointmentData) {
        return (
            <div className="text-center py-5">
                <h4>Không tìm thấy thông tin cuộc hẹn</h4>
                <button type="button" className="btn btn-primary mt-3" onClick={handleBackToList}>
                    Quay lại danh sách
                </button>
            </div>
        );
    }

    return (
        <>
            {/* Dashboard Header */}
            <div className="dashboard-header">
                <div className="header-back">
                    <Link to="/user/profile?tab=appointments" className="back-arrow">
                        <i className="fa-solid fa-arrow-left"></i>
                    </Link>

                    <h3>Chi Tiết Cuộc Hẹn</h3>
                </div>
            </div>

            {/* Appointment Detail Component */}
            <AppointmentDetail
                appointment={appointmentData}
                onStartSession={handleStartSession}
                onCancel={handleCancel}
                onReschedule={handleReschedule}
                onDownloadPrescription={handleDownloadPrescription}
            />

            {/* Recent Appointments Section */}
            <div className="recent-appointments">
                <h5 className="head-text">Lịch Hẹn Gần Đây</h5>

                {/* Appointment List */}
                <div className="appointment-wrap">
                    <ul>
                        <li>
                            <div className="patinet-information">
                                <Link to="#">
                                    <img
                                        src="/src/assets/img/doctors/doctor-15.jpg"
                                        alt="User Image"
                                    />
                                </Link>
                                <div className="patient-info">
                                    <p>#Apt0002</p>
                                    <h6>
                                        <Link to="#">Dr.Shanta Nesmith</Link>
                                    </h6>
                                </div>
                            </div>
                        </li>
                        <li className="appointment-info">
                            <p>
                                <i className="isax isax-clock5"></i>11 Nov 2024 10.45 AM
                            </p>
                            <ul className="d-flex apponitment-types">
                                <li>General Visit</li>
                                <li>Chat</li>
                            </ul>
                        </li>
                        <li className="mail-info-patient">
                            <ul>
                                <li>
                                    <i className="isax isax-sms5"></i>
                                    <Link to="mailto:doctor@example.com">doctor@example.com</Link>
                                </li>
                                <li>
                                    <i className="isax isax-call5"></i> +1 504 368 6874
                                </li>
                            </ul>
                        </li>
                        <li className="appointment-action">
                            <ul>
                                <li>
                                    <Link to="#">
                                        <i className="isax isax-eye4"></i>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>

                {/* Another Appointment List */}
                <div className="appointment-wrap">
                    <ul>
                        <li>
                            <div className="patinet-information">
                                <a href="#">
                                    <img
                                        src="/src/assets/img/doctors/doctor-thumb-02.jpg"
                                        alt="User Image"
                                    />
                                </a>
                                <div className="patient-info">
                                    <p>#Apt0003</p>
                                    <h6>
                                        <a href="#">Dr.John Ewel</a>
                                    </h6>
                                </div>
                            </div>
                        </li>
                        <li className="appointment-info">
                            <p>
                                <i className="isax isax-clock5"></i>27 Oct 2024 09.30 AM
                            </p>
                            <ul className="d-flex apponitment-types">
                                <li>General Visit</li>
                                <li>Video Call</li>
                            </ul>
                        </li>
                        <li className="mail-info-patient">
                            <ul>
                                <li>
                                    <i className="isax isax-sms5"></i>
                                    <Link to="mailto:doctor2@example.com">doctor2@example.com</Link>
                                </li>
                                <li>
                                    <i className="isax isax-call5"></i> +1 749 104 6291
                                </li>
                            </ul>
                        </li>
                        <li className="appointment-action">
                            <ul>
                                <li>
                                    <Link to="#">
                                        <i className="isax isax-eye4"></i>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Appointment Cancel Reason Modal */}
            <div className="modal fade custom-modal custom-modal-two" id="reject_reason">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Lý Do Hủy</h5>
                            <button type="button" data-bs-dismiss="modal" aria-label="Close">
                                <span>
                                    <i className="fa-solid fa-x"></i>
                                </span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="reason-of-rejection">
                                <p>
                                    Tôi có ca phẫu thuật khẩn cấp trong thời gian cuộc hẹn nên tôi
                                    phải hủy cuộc hẹn này. Bạn có thể đặt lại lịch hẹn vào tuần tới.
                                </p>
                                <span className="text-danger">
                                    Đã hủy bởi bạn vào ngày 23 tháng 3 năm 2023
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AppointmentDetailPage;
