import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import SearchInput from '@/components/SearchInput';
import { PATHS } from '@/routes/paths';
import styles from './Banner.module.scss';
import videoIcon from '@/assets/img/icons/video.svg';
import bannerDoctor from '@/assets/img/banner/banner-doctor.svg';
import patient19 from '@/assets/img/patients/patient19.jpg';
import patient16 from '@/assets/img/patients/patient16.jpg';
import patient18 from '@/assets/img/patients/patient18.jpg';
import bannerBg02 from '@/assets/img/bg/banner-bg-02.png';
import bannerBg03 from '@/assets/img/bg/banner-bg-03.png';
import bannerBg04 from '@/assets/img/bg/banner-bg-04.png';
import bannerBg05 from '@/assets/img/bg/banner-bg-05.png';
import bannerIcon01 from '@/assets/img/bg/banner-icon-01.svg';

const Banner: React.FC = () => {
    const { t } = useTranslation('home');
    const navigate = useNavigate();
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const handleNavigate = () => {
        navigate(PATHS.AI_SUPPORT_BOOKING);
    };

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
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    style={{
                                        border: '2px #1082fdb3 solid',
                                    }}
                                >
                                    <div className="avatar-list-stacked avatar-group-lg">
                                        <span className="avatar avatar-rounded">
                                            <img
                                                src="https://img.freepik.com/premium-vector/ai-robot-doctor_78370-9566.jpg?semt=ais_hybrid&w=740&q=80"
                                                alt="img"
                                            />
                                        </span>
                                    </div>
                                    <div className="me-2">
                                        <h6 className="mb-1" style={{ color: '#1082fd' }}>
                                            {t('banner.aiSupport.title')}
                                        </h6>
                                        <div className="d-flex align-items-center">
                                            <div className="d-flex align-items-center">
                                                <i className="fa-solid fa-star text-orange me-1"></i>
                                                <i className="fa-solid fa-star text-orange me-1"></i>
                                                <i className="fa-solid fa-star text-orange me-1"></i>
                                                <i className="fa-solid fa-star text-orange me-1"></i>
                                                <i className="fa-solid fa-star text-orange me-1"></i>
                                            </div>
                                            <p>{t('banner.aiSupport.rating')}</p>
                                        </div>
                                    </div>
                                </motion.button>
                            </motion.div>
                            <h1 className="display-5">
                                <span className={styles.bannerText}>
                                    {t('banner.headline.part1')}
                                </span>
                                <span className={`banner-icon ${styles.bannerIcon}`}>
                                    <img src={videoIcon} alt="img" />
                                </span>
                                <span className={`text-gradient ${styles.textGradient}`}>
                                    {t('banner.headline.highlight')}
                                </span>
                                <span className={styles.bannerText}>
                                    {t('banner.headline.part2')}
                                </span>
                            </h1>
                            <SearchInput forceWrap />
                        </div>
                    </div>
                    <div className="col-lg-5">
                        <div className="banner-img aos" data-aos="fade-up">
                            <img src={bannerDoctor} className="img-fluid" alt="patient-image" />
                            <div className="banner-appointment">
                                <h6 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                    {t('banner.stats.appointments.count')}
                                </h6>
                                <p style={{ fontSize: '16px' }}>
                                    {t('banner.stats.appointments.label')}{' '}
                                    <span className="d-block">
                                        {t('banner.stats.appointments.sublabel')}
                                    </span>
                                </p>
                            </div>
                            <div className="banner-patient">
                                <div className="avatar-list-stacked avatar-group-sm">
                                    <span className="avatar avatar-rounded">
                                        <img src={patient19} alt="img" />
                                    </span>
                                    <span className="avatar avatar-rounded">
                                        <img src={patient16} alt="img" />
                                    </span>
                                    <span className="avatar avatar-rounded">
                                        <img src={patient18} alt="img" />
                                    </span>
                                </div>
                                <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                    {t('banner.stats.patients.count')}
                                </p>
                                <p style={{ fontSize: '16px' }}>
                                    {t('banner.stats.patients.label')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="banner-bg">
                <img src={bannerBg02} alt="img" className="banner-bg-01" />
                <img src={bannerBg03} alt="img" className="banner-bg-02" />
                <img src={bannerBg04} alt="img" className="banner-bg-03" />
                <img src={bannerBg05} alt="img" className="banner-bg-04" />
                <img src={bannerIcon01} alt="img" className="banner-bg-05" />
                <img src={bannerIcon01} alt="img" className="banner-bg-06" />
            </div>
        </section>
    );
};

export default Banner;
