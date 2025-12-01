import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

// Pre-computed confetti particles for animation (not security-sensitive)
// Using deterministic values based on index to avoid Math.random() in render
const CONFETTI_COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];
const CONFETTI_COUNT = 50;

// Generate deterministic but varied positions using simple hash function
const generateConfettiParticles = () => {
    return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
        // Use modular arithmetic for pseudo-random but deterministic distribution
        left: (i * 37 + 13) % 100,
        duration: 3 + ((i * 17) % 20) / 10,
        delay: ((i * 23) % 20) / 10,
        color: CONFETTI_COLORS[i % 5],
        isCircle: i % 3 === 0,
    }));
};

const ContractSigningSuccessPage: React.FC = () => {
    const navigate = useNavigate();
    const [showContent, setShowContent] = useState(false);

    // Memoize confetti particles to prevent recalculation on re-renders
    const confettiParticles = useMemo(() => generateConfettiParticles(), []);

    useEffect(() => {
        // Trigger animation after mount
        setTimeout(() => setShowContent(true), 100);
    }, []);

    return (
        <div className="container py-5">
            {/* Confetti Effect - uses pre-computed values for visual animation only */}
            <div
                className="position-fixed top-0 start-0 w-100 h-100"
                style={{ pointerEvents: 'none', zIndex: 1 }}
            >
                {confettiParticles.map((particle) => (
                    <div
                        key={`confetti-${particle.left}-${particle.duration}`}
                        className="position-absolute"
                        style={{
                            left: `${particle.left}%`,
                            top: '-10px',
                            width: '10px',
                            height: '10px',
                            backgroundColor: particle.color,
                            opacity: 0.7,
                            animation: `fall ${particle.duration}s linear ${particle.delay}s infinite`,
                            borderRadius: particle.isCircle ? '50%' : '0',
                        }}
                    />
                ))}
            </div>

            <style>{`
                @keyframes fall {
                    to {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
                @keyframes scaleIn {
                    from {
                        transform: scale(0);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                @keyframes slideUp {
                    from {
                        transform: translateY(30px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>

            <div className="row justify-content-center">
                <div className="col-lg-9">
                    <div
                        className="card border-0 shadow-lg"
                        style={{ position: 'relative', zIndex: 2 }}
                    >
                        <div className="card-body text-center p-5">
                            {/* Success Icon */}
                            <div
                                className="mb-4"
                                style={{
                                    animation: showContent ? 'scaleIn 0.5s ease-out' : 'none',
                                }}
                            >
                                <div
                                    className="rounded-circle d-inline-flex align-items-center justify-content-center position-relative"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        background:
                                            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)',
                                    }}
                                >
                                    <i
                                        className="ti ti-circle-check text-white"
                                        style={{ fontSize: '50px' }}
                                    ></i>
                                    {/* Pulse rings */}
                                    <div
                                        className="position-absolute rounded-circle"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            border: '3px solid #667eea',
                                            animation: 'pulse 2s ease-out infinite',
                                            opacity: 0.6,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Success Message */}
                            <div
                                style={{
                                    animation: showContent
                                        ? 'slideUp 0.6s ease-out 0.2s both'
                                        : 'none',
                                }}
                            >
                                <h2
                                    className="fw-bold mb-3"
                                    style={{
                                        background:
                                            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}
                                >
                                    Ký hợp đồng thành công!
                                </h2>
                                <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                                    🎉 Cảm ơn bạn đã hoàn tất việc ký hợp đồng điện tử
                                </p>
                            </div>

                            <style>{`
                                @keyframes pulse {
                                    0% {
                                        transform: scale(1);
                                        opacity: 0.6;
                                    }
                                    50% {
                                        transform: scale(1.1);
                                        opacity: 0.3;
                                    }
                                    100% {
                                        transform: scale(1.2);
                                        opacity: 0;
                                    }
                                }
                            `}</style>

                            {/* Info Box */}
                            <div
                                style={{
                                    animation: showContent
                                        ? 'slideUp 0.6s ease-out 0.4s both'
                                        : 'none',
                                }}
                            >
                                <div
                                    className="alert alert-info border-0 text-start mb-4"
                                    style={{
                                        background:
                                            'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)',
                                    }}
                                >
                                    <h5 className="alert-heading text-primary">
                                        <i className="ti ti-info-circle me-2" aria-hidden="true" />{' '}
                                        Bước tiếp theo
                                    </h5>
                                    <hr className="border-primary opacity-25" />
                                    <ul className="mb-0 ps-3">
                                        <li className="mb-2">
                                            <i
                                                className="ti ti-check text-success me-2"
                                                aria-hidden="true"
                                            />{' '}
                                            Hợp đồng đã được ký thành công và gửi đến hệ thống
                                            BookingCare
                                        </li>
                                        <li className="mb-2">
                                            <i
                                                className="ti ti-clock text-warning me-2"
                                                aria-hidden="true"
                                            />{' '}
                                            Đội ngũ quản trị sẽ xem xét và phê duyệt hợp đồng trong
                                            thời gian sớm nhất
                                        </li>
                                        <li className="mb-2">
                                            <i
                                                className="ti ti-mail text-info me-2"
                                                aria-hidden="true"
                                            />{' '}
                                            Bạn sẽ nhận được email thông báo khi hợp đồng được phê
                                            duyệt
                                        </li>
                                        <li className="mb-0">
                                            <i
                                                className="ti ti-user-check text-success me-2"
                                                aria-hidden="true"
                                            />{' '}
                                            Sau khi phê duyệt, tài khoản bệnh viện sẽ được kích hoạt
                                            và bạn có thể đăng nhập vào hệ thống
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div
                                style={{
                                    animation: showContent
                                        ? 'slideUp 0.6s ease-out 0.6s both'
                                        : 'none',
                                }}
                            >
                                <div
                                    className="card border-0 shadow-sm mb-4"
                                    style={{
                                        background:
                                            'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                    }}
                                >
                                    <div className="card-body p-4">
                                        <h5 className="card-title text-start mb-4">
                                            <i
                                                className="ti ti-timeline me-2 text-primary"
                                                aria-hidden="true"
                                            />{' '}
                                            Quy trình tiếp theo
                                        </h5>
                                        <div className="timeline position-relative">
                                            {/* Vertical line */}
                                            <div
                                                className="position-absolute bg-secondary"
                                                style={{
                                                    left: '19px',
                                                    top: '40px',
                                                    bottom: '40px',
                                                    width: '2px',
                                                    opacity: 0.2,
                                                }}
                                            />

                                            <div className="d-flex align-items-start mb-4 position-relative">
                                                <div className="flex-shrink-0">
                                                    <div
                                                        className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center shadow-sm"
                                                        style={{ width: '40px', height: '40px' }}
                                                    >
                                                        <i
                                                            className="ti ti-check"
                                                            style={{ fontSize: '20px' }}
                                                        ></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3 text-start">
                                                    <h6 className="mb-1 fw-bold">Ký hợp đồng</h6>
                                                    <p className="text-success small mb-0">
                                                        <i
                                                            className="ti ti-circle-check me-1"
                                                            aria-hidden="true"
                                                        />{' '}
                                                        Đã hoàn thành
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-start mb-4 position-relative">
                                                <div className="flex-shrink-0">
                                                    <div
                                                        className="rounded-circle text-white d-flex align-items-center justify-content-center shadow-sm"
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            background:
                                                                'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                                        }}
                                                    >
                                                        <i
                                                            className="ti ti-clock"
                                                            style={{ fontSize: '20px' }}
                                                        ></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3 text-start">
                                                    <h6 className="mb-1 fw-bold">
                                                        Xem xét hợp đồng
                                                    </h6>
                                                    <p className="text-warning small mb-0">
                                                        <i
                                                            className="ti ti-loader me-1"
                                                            aria-hidden="true"
                                                        />{' '}
                                                        Đang chờ admin phê duyệt
                                                    </p>
                                                    <div
                                                        className="progress mt-2"
                                                        style={{ height: '4px' }}
                                                    >
                                                        <div
                                                            className="progress-bar progress-bar-striped progress-bar-animated bg-warning"
                                                            style={{ width: '60%' }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-start position-relative">
                                                <div className="flex-shrink-0">
                                                    <div
                                                        className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            opacity: 0.6,
                                                        }}
                                                    >
                                                        <i
                                                            className="ti ti-user-check"
                                                            style={{ fontSize: '20px' }}
                                                        ></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3 text-start">
                                                    <h6 className="mb-1 fw-bold text-muted">
                                                        Kích hoạt tài khoản
                                                    </h6>
                                                    <p className="text-muted small mb-0">
                                                        <i
                                                            className="ti ti-hourglass me-1"
                                                            aria-hidden="true"
                                                        />{' '}
                                                        Chờ phê duyệt
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div
                                style={{
                                    animation: showContent
                                        ? 'slideUp 0.6s ease-out 0.8s both'
                                        : 'none',
                                }}
                            >
                                <div
                                    className="card border-0 mb-4"
                                    style={{
                                        background:
                                            'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                                    }}
                                >
                                    <div className="card-body p-4">
                                        <h6 className="mb-3 text-center">
                                            <i
                                                className="ti ti-help-circle me-2 text-warning"
                                                aria-hidden="true"
                                            />{' '}
                                            <strong>Cần hỗ trợ?</strong>
                                        </h6>
                                        <p className="mb-3 small text-center">
                                            Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với
                                            chúng tôi:
                                        </p>
                                        <div className="d-flex justify-content-center gap-4 flex-wrap">
                                            <a
                                                href="mailto:support@bookingcare.vn"
                                                className="text-decoration-none d-flex align-items-center"
                                            >
                                                <div
                                                    className="rounded-circle bg-white p-2 me-2 shadow-sm d-flex align-items-center justify-content-center"
                                                    style={{ width: '32px', height: '32px' }}
                                                >
                                                    <i className="ti ti-mail text-primary"></i>
                                                </div>
                                                <span className="fw-semibold">
                                                    support@bookingcare.vn
                                                </span>
                                            </a>
                                            <a
                                                href="tel:1900xxxx"
                                                className="text-decoration-none d-flex align-items-center"
                                            >
                                                <div
                                                    className="rounded-circle bg-white p-2 me-2 shadow-sm d-flex align-items-center justify-content-center"
                                                    style={{ width: '32px', height: '32px' }}
                                                >
                                                    <i className="ti ti-phone text-success"></i>
                                                </div>
                                                <span className="fw-semibold">1900-xxxx</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div
                                style={{
                                    animation: showContent
                                        ? 'slideUp 0.6s ease-out 1s both'
                                        : 'none',
                                }}
                            >
                                <button
                                    type="button"
                                    className="btn btn-lg px-5 py-3 shadow"
                                    onClick={() => navigate(PATHS.HOME)}
                                    style={{
                                        background:
                                            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        color: 'white',
                                        minWidth: '200px',
                                    }}
                                >
                                    <i
                                        className="ti ti-home me-2"
                                        style={{ fontSize: '20px' }}
                                        aria-hidden="true"
                                    />{' '}
                                    Về trang chủ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContractSigningSuccessPage;
