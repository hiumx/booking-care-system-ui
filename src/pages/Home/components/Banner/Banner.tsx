import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import SearchInput from '@/components/SearchInput';
import { PATHS } from '@/routes/paths';
import styles from './Banner.module.scss';

const Banner: React.FC = () => {
    const navigate = useNavigate();
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null);
    const controls = useAnimation();
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const handleNavigate = () => {
        navigate(PATHS.AI_SUPPORT_BOOKING);
    };

    const updateTooltipPosition = () => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        setTooltipPos({ top: rect.bottom + 8, left: rect.left + rect.width / 2 });
    };

    const handleHoverStart = () => {
        setIsTooltipVisible(true);
        updateTooltipPosition();
        controls.start({ opacity: 1, scale: 1 });
    };

    const handleHoverEnd = () => {
        setIsTooltipVisible(false);
        controls.start({ opacity: 0, scale: 0.9 });
    };

    useEffect(() => {
        if (!isTooltipVisible) return;
        const onResize = () => updateTooltipPosition();
        window.addEventListener('resize', onResize);
        window.addEventListener('scroll', onResize, true);
        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('scroll', onResize, true);
        };
    }, [isTooltipVisible]);

    return (
        <section
            className="banner-section banner-sec-one"
            style={{ overflow: 'visible', position: 'relative', zIndex: 2 }}
        >
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-7">
                        <div className="banner-content aos" data-aos="fade-up">
                            <motion.div
                                className="relative inline-block"
                                style={{
                                    position: 'relative',
                                    display: 'inline-block',
                                    overflow: 'visible',
                                    zIndex: 2,
                                }}
                            >
                                <motion.button
                                    ref={buttonRef}
                                    className="rating-appointment d-inline-flex align-items-center gap-2"
                                    onClick={handleNavigate}
                                    onMouseEnter={handleHoverStart}
                                    onMouseLeave={handleHoverEnd}
                                    onFocus={handleHoverStart}
                                    onBlur={handleHoverEnd}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <div className="avatar-list-stacked avatar-group-lg">
                                        <span className="avatar avatar-rounded">
                                            <img
                                                src="https://img.freepik.com/premium-psd/happy-robot-3d-ai-character-chat-bot-mascot-gpt-chatbot-icon-artificial-intelligence_95505-496.jpg?semt=ais_incoming&w=740&q=80"
                                                alt="img"
                                            />
                                        </span>
                                    </div>
                                    <div className="me-2">
                                        <h6 className="mb-1">Hỗ trợ đặt lịch</h6>
                                        <div className="d-flex align-items-center">
                                            <div className="d-flex align-items-center">
                                                <i className="fa-solid fa-star text-orange me-1"></i>
                                                <i className="fa-solid fa-star text-orange me-1"></i>
                                                <i className="fa-solid fa-star text-orange me-1"></i>
                                                <i className="fa-solid fa-star text-orange me-1"></i>
                                                <i className="fa-solid fa-star text-orange me-1"></i>
                                            </div>
                                            <p>5.0 sao</p>
                                        </div>
                                    </div>
                                </motion.button>
                                <motion.div
                                    style={{
                                        position: 'fixed',
                                        top: tooltipPos ? `${tooltipPos.top}px` : '-9999px',
                                        left: tooltipPos ? `${tooltipPos.left}px` : '-9999px',
                                        transform: 'translateX(-50%)',
                                        background:
                                            'linear-gradient(990deg, #BDFCFF, #0066FF 0%, #2EA8FF 50% 100%)',
                                        color: '#ffffff',
                                        fontSize: '0.875rem',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '0.5rem',
                                        boxShadow:
                                            '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
                                        zIndex: 100000,
                                        whiteSpace: 'nowrap',
                                        pointerEvents: 'none',
                                        visibility: isTooltipVisible ? 'visible' : 'hidden',
                                    }}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={
                                        isTooltipVisible
                                            ? { opacity: 1, scale: 1 }
                                            : { opacity: 0, scale: 0.95 }
                                    }
                                    transition={{ duration: 0.15 }}
                                >
                                    <span className={styles.bannerText}>
                                        Click vào đặt lịch thông minh nha!
                                    </span>
                                    <span className={styles.tooltipArrow} />
                                </motion.div>
                            </motion.div>
                            <h1 className="display-5">
                                <span className={styles.bannerText}>Khám sức khỏe: Tìm bác sĩ</span>
                                <span className={`banner-icon ${styles.bannerIcon}`}>
                                    <img src="/src/assets/img/icons/video.svg" alt="img" />
                                </span>
                                <span className={`text-gradient ${styles.textGradient}`}>
                                    của bạn
                                </span>
                                <span className={styles.bannerText}>ngay hôm nay</span>
                            </h1>
                            <SearchInput forceWrap />
                        </div>
                    </div>
                    <div className="col-lg-5">
                        <div className="banner-img aos" data-aos="fade-up">
                            <img
                                src="/src/assets/img/banner/banner-doctor.svg"
                                className="img-fluid"
                                alt="patient-image"
                            />
                            <div className="banner-appointment">
                                <h6 style={{ fontSize: '20px', fontWeight: 'bold' }}>100</h6>
                                <p style={{ fontSize: '16px' }}>
                                    Cuộc hẹn <span className="d-block">đã hoàn thành</span>
                                </p>
                            </div>
                            <div className="banner-patient">
                                <div className="avatar-list-stacked avatar-group-sm">
                                    <span className="avatar avatar-rounded">
                                        <img
                                            src="/src/assets/img/patients/patient19.jpg"
                                            alt="img"
                                        />
                                    </span>
                                    <span className="avatar avatar-rounded">
                                        <img
                                            src="/src/assets/img/patients/patient16.jpg"
                                            alt="img"
                                        />
                                    </span>
                                    <span className="avatar avatar-rounded">
                                        <img
                                            src="/src/assets/img/patients/patient18.jpg"
                                            alt="img"
                                        />
                                    </span>
                                </div>
                                <p style={{ fontSize: '20px', fontWeight: 'bold' }}>1000</p>
                                <p style={{ fontSize: '16px' }}>Bệnh nhân hài lòng</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="banner-bg">
                <img src="/src/assets/img/bg/banner-bg-02.png" alt="img" className="banner-bg-01" />
                <img src="/src/assets/img/bg/banner-bg-03.png" alt="img" className="banner-bg-02" />
                <img src="/src/assets/img/bg/banner-bg-04.png" alt="img" className="banner-bg-03" />
                <img src="/src/assets/img/bg/banner-bg-05.png" alt="img" className="banner-bg-04" />
                <img
                    src="/src/assets/img/bg/banner-icon-01.svg"
                    alt="img"
                    className="banner-bg-05"
                />
                <img
                    src="/src/assets/img/bg/banner-icon-01.svg"
                    alt="img"
                    className="banner-bg-06"
                />
            </div>
        </section>
    );
};

export default Banner;
