import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumb';

const ContractSigningSuccessPage: React.FC = () => {
    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: 'Trang chủ', path: PATHS.HOME },
        { label: 'Ký hợp đồng', path: PATHS.HOME },
        { label: 'Hoàn tất', isActive: true },
    ];

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbItems} title="Ký hợp đồng thành công" />

            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-lg-9">
                        {/* Success Card */}
                        <div className="card booking-card">
                            <div className="card-body p-4">
                                {/* Success Header */}
                                <div className="card-header pt-3 pb-3 border-bottom">
                                    <h5 className="d-flex align-items-center flex-wrap gap-2 mb-0">
                                        <i className="isax isax-tick-circle5 text-success me-2"></i>{' '}
                                        Ký hợp đồng thành công
                                    </h5>
                                </div>

                                {/* Success Message */}
                                <div className="card-header d-flex align-items-center flex-wrap gap-2 py-3">
                                    <p className="mb-0">
                                        🎉 Cảm ơn bạn đã hoàn tất việc ký hợp đồng điện tử. Hợp đồng
                                        đã được gửi đến hệ thống{' '}
                                        <span className="text-dark fw-semibold">BookingCare</span>{' '}
                                        để xem xét và phê duyệt.
                                    </p>
                                </div>

                                {/* Next Steps Info */}
                                <div className="card-body pb-3">
                                    <h6 className="mb-3">
                                        <i className="isax isax-info-circle me-2 text-primary"></i>{' '}
                                        Bước tiếp theo
                                    </h6>
                                    <div className="alert alert-light border mb-4">
                                        <ul className="mb-0 ps-3">
                                            <li className="mb-2">
                                                <i className="isax isax-tick-circle text-success me-2"></i>{' '}
                                                Hợp đồng đã được ký thành công và gửi đến hệ thống
                                                BookingCare
                                            </li>
                                            <li className="mb-2">
                                                <i className="isax isax-clock text-warning me-2"></i>{' '}
                                                Đội ngũ quản trị sẽ xem xét và phê duyệt hợp đồng
                                                trong thời gian sớm nhất
                                            </li>
                                            <li className="mb-2">
                                                <i className="isax isax-sms text-info me-2"></i> Bạn
                                                sẽ nhận được email thông báo khi hợp đồng được phê
                                                duyệt
                                            </li>
                                            <li className="mb-0">
                                                <i className="isax isax-user-tick text-success me-2"></i>{' '}
                                                Sau khi phê duyệt, tài khoản bệnh viện sẽ được kích
                                                hoạt và bạn có thể đăng nhập vào hệ thống
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Timeline - Horizontal Steps */}
                                    <h6 className="mb-3">
                                        <i className="isax isax-timer-1 me-2 text-primary"></i> Quy
                                        trình xử lý
                                    </h6>
                                    <div className="card border mb-4">
                                        <div className="card-body p-4">
                                            <div className="d-flex align-items-start justify-content-between position-relative">
                                                {/* Connecting line background */}
                                                <div
                                                    className="position-absolute"
                                                    style={{
                                                        left: '70px',
                                                        right: '70px',
                                                        top: '20px',
                                                        height: '4px',
                                                        backgroundColor: '#e9ecef',
                                                        zIndex: 0,
                                                    }}
                                                />
                                                {/* Progress line */}
                                                <div
                                                    className="position-absolute"
                                                    style={{
                                                        left: '70px',
                                                        width: 'calc(50% - 70px)',
                                                        top: '20px',
                                                        height: '4px',
                                                        backgroundColor: '#28a745',
                                                        zIndex: 1,
                                                    }}
                                                />

                                                {/* Step 1: Completed */}
                                                <div
                                                    className="text-center position-relative"
                                                    style={{ zIndex: 2, flex: '1' }}
                                                >
                                                    <div
                                                        className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center mx-auto mb-2 shadow-sm"
                                                        style={{ width: '44px', height: '44px' }}
                                                    >
                                                        <i
                                                            className="isax isax-tick-circle"
                                                            style={{ fontSize: '20px' }}
                                                        ></i>
                                                    </div>
                                                    <h6 className="mb-1 fw-semibold small">
                                                        Ký hợp đồng
                                                    </h6>
                                                    <span className="badge bg-success-subtle text-success">
                                                        Hoàn thành
                                                    </span>
                                                </div>

                                                {/* Step 2: In Progress */}
                                                <div
                                                    className="text-center position-relative"
                                                    style={{ zIndex: 2, flex: '1' }}
                                                >
                                                    <div
                                                        className="rounded-circle bg-warning text-white d-flex align-items-center justify-content-center mx-auto mb-2 shadow-sm"
                                                        style={{ width: '44px', height: '44px' }}
                                                    >
                                                        <i
                                                            className="isax isax-clock"
                                                            style={{ fontSize: '20px' }}
                                                        ></i>
                                                    </div>
                                                    <h6 className="mb-1 fw-semibold small">
                                                        Xem xét hợp đồng
                                                    </h6>
                                                    <span className="badge bg-warning-subtle text-warning">
                                                        Đang chờ
                                                    </span>
                                                </div>

                                                {/* Step 3: Pending */}
                                                <div
                                                    className="text-center position-relative"
                                                    style={{ zIndex: 2, flex: '1' }}
                                                >
                                                    <div
                                                        className="rounded-circle bg-light text-secondary d-flex align-items-center justify-content-center mx-auto mb-2 border"
                                                        style={{ width: '44px', height: '44px' }}
                                                    >
                                                        <i
                                                            className="isax isax-user-tick"
                                                            style={{ fontSize: '20px' }}
                                                        ></i>
                                                    </div>
                                                    <h6 className="mb-1 fw-semibold small text-muted">
                                                        Kích hoạt tài khoản
                                                    </h6>
                                                    <span className="badge bg-light text-muted border">
                                                        Chờ xử lý
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Support */}
                                    <h6 className="mb-3">
                                        <i className="isax isax-message-question me-2 text-primary"></i>{' '}
                                        Cần hỗ trợ?
                                    </h6>
                                    <div className="card border bg-light mb-4">
                                        <div className="card-body p-3">
                                            <p className="mb-3 small">
                                                Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với
                                                chúng tôi:
                                            </p>
                                            <div className="d-flex flex-wrap gap-4">
                                                <a
                                                    href="mailto:support@bookingcare.vn"
                                                    className="text-decoration-none d-flex align-items-center"
                                                >
                                                    <span className="avatar avatar-sm avatar-rounded bg-white me-2 d-flex align-items-center justify-content-center shadow-sm">
                                                        <i className="isax isax-sms text-primary"></i>
                                                    </span>
                                                    <span className="fw-semibold text-dark">
                                                        support@bookingcare.vn
                                                    </span>
                                                </a>
                                                <a
                                                    href="tel:1900xxxx"
                                                    className="text-decoration-none d-flex align-items-center"
                                                >
                                                    <span className="avatar avatar-sm avatar-rounded bg-white me-2 d-flex align-items-center justify-content-center shadow-sm">
                                                        <i className="isax isax-call text-success"></i>
                                                    </span>
                                                    <span className="fw-semibold text-dark">
                                                        19001979
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="text-center">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-lg px-5"
                                            onClick={() => navigate(PATHS.HOME)}
                                        >
                                            <i className="isax isax-home me-2"></i> Về trang chủ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ContractSigningSuccessPage;
