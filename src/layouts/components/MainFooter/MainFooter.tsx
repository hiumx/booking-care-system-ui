import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PATHS } from '@/routes/paths';
import footerBg01 from '@/assets/img/bg/footer-bg-01.png';
import footerBg02 from '@/assets/img/bg/footer-bg-02.png';
import footerBg03 from '@/assets/img/bg/footer-bg-03.png';
import footerBg04 from '@/assets/img/bg/footer-bg-04.png';
import footerBg05 from '@/assets/img/bg/footer-bg-05.png';
import card01 from '@/assets/img/icons/card-01.svg';
import card02 from '@/assets/img/icons/card-02.svg';
import card03 from '@/assets/img/icons/card-03.svg';
import card04 from '@/assets/img/icons/card-04.svg';
import card05 from '@/assets/img/icons/card-05.svg';
import card06 from '@/assets/img/icons/card-06.svg';

interface FooterLink {
    text: string;
    path: string;
}

const MainFooter: React.FC = () => {
    const { t } = useTranslation('home');

    const companyLinks = t('footer.company.links', { returnObjects: true }) as FooterLink[];
    const treatmentLinks = t('footer.treatments.links', { returnObjects: true }) as FooterLink[];
    const specialityLinks = t('footer.specialities.links', { returnObjects: true }) as FooterLink[];
    const utilityLinks = t('footer.utilities.links', { returnObjects: true }) as FooterLink[];

    return (
        <footer className="footer inner-footer">
            <div className="footer-top">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="row">
                                <div className="col-lg-3 col-md-3">
                                    <div className="footer-widget footer-menu">
                                        <h6 className="footer-title">
                                            {t('footer.company.title')}
                                        </h6>
                                        <ul>
                                            {companyLinks.map((link) => (
                                                <li key={`${link.path}-${link.text}`}>
                                                    <Link to={link.path}>{link.text}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-3">
                                    <div className="footer-widget footer-menu">
                                        <h6 className="footer-title">
                                            {t('footer.treatments.title')}
                                        </h6>
                                        <ul>
                                            {treatmentLinks.map((link) => (
                                                <li key={`${link.path}-${link.text}`}>
                                                    <Link to={link.path}>{link.text}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-3">
                                    <div className="footer-widget footer-menu">
                                        <h6 className="footer-title">
                                            {t('footer.specialities.title')}
                                        </h6>
                                        <ul>
                                            {specialityLinks.map((link) => (
                                                <li key={`${link.path}-${link.text}`}>
                                                    <Link to={link.path}>{link.text}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-3">
                                    <div className="footer-widget footer-menu">
                                        <h6 className="footer-title">
                                            {t('footer.utilities.title')}
                                        </h6>
                                        <ul>
                                            {utilityLinks.map((link) => (
                                                <li key={`${link.path}-${link.text}`}>
                                                    <Link to={link.path}>{link.text}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-7">
                            <div className="footer-widget">
                                <h6 className="footer-title">{t('footer.newsletter.title')}</h6>
                                <p className="mb-2">{t('footer.newsletter.description')}</p>
                                <div className="subscribe-input">
                                    <form action="#">
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder={t('footer.newsletter.placeholder')}
                                        />
                                        <button
                                            type="submit"
                                            className="btn btn-md btn-primary-gradient d-inline-flex align-items-center"
                                        >
                                            <i className="isax isax-send-25 me-1"></i>
                                            {t('footer.newsletter.button')}
                                        </button>
                                    </form>
                                </div>
                                <div className="social-icon">
                                    <h6 className="mb-3">{t('footer.connectWithUs')}</h6>
                                    <ul>
                                        <li>
                                            <Link to="#">
                                                <i className="fa-brands fa-facebook"></i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#">
                                                <i className="fa-brands fa-x-twitter"></i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#">
                                                <i className="fa-brands fa-instagram"></i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#">
                                                <i className="fa-brands fa-linkedin"></i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#">
                                                <i className="fa-brands fa-pinterest"></i>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-bg">
                    <img src={footerBg01} alt="img" className="footer-bg-01" />
                    <img src={footerBg02} alt="img" className="footer-bg-02" />
                    <img src={footerBg03} alt="img" className="footer-bg-03" />
                    <img src={footerBg04} alt="img" className="footer-bg-04" />
                    <img src={footerBg05} alt="img" className="footer-bg-05" />
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <div className="copyright">
                        <div className="copyright-text">
                            <p className="mb-0">{t('footer.copyright')}</p>
                        </div>
                        <div className="copyright-menu">
                            <ul className="policy-menu">
                                <li>
                                    <Link to={PATHS.LEGAL_NOTICE}>{t('footer.legalNotice')}</Link>
                                </li>
                                <li>
                                    <Link to={PATHS.PRIVACY_POLICY}>
                                        {t('footer.privacyPolicy')}
                                    </Link>
                                </li>
                                <li>
                                    <Link to={PATHS.REFUND_POLICY}>{t('footer.refundPolicy')}</Link>
                                </li>
                            </ul>
                        </div>
                        <ul className="payment-method">
                            <li>
                                <Link to="#">
                                    <img src={card01} alt="Img" />
                                </Link>
                            </li>
                            <li>
                                <Link to="#">
                                    <img src={card02} alt="Img" />
                                </Link>
                            </li>
                            <li>
                                <Link to="#">
                                    <img src={card03} alt="Img" />
                                </Link>
                            </li>
                            <li>
                                <Link to="#">
                                    <img src={card04} alt="Img" />
                                </Link>
                            </li>
                            <li>
                                <Link to="#">
                                    <img src={card05} alt="Img" />
                                </Link>
                            </li>
                            <li>
                                <Link to="#">
                                    <img src={card06} alt="Img" />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default MainFooter;
