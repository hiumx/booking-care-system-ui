import { useState } from 'react';
import { HeartPulse, Sparkles, Stethoscope, Activity, Heart, Shield } from 'lucide-react';
import './HeroSection.scss';

interface HeroSectionProps {
    title: string;
    description: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, description }) => {
    const [showMore, setShowMore] = useState(false);

    return (
        <section className="hero-section">
            <div className="hero-bg">
                <div className="circle circle-top"></div>
                <div className="circle circle-bottom"></div>
            </div>

            <div className="hero-container">
                <div className="hero-grid">
                    {/* Left Content */}
                    <div className="hero-left">
                        <div className="hero-card">
                            <div className="hero-title">
                                <div className="hero-icon">
                                    <HeartPulse size={28} className="icon" />
                                </div>
                                <h1>{title}</h1>
                            </div>

                            <div className="hero-description">
                                <p>{description}</p>
                                {showMore && (
                                    <p>
                                        Dịch vụ được thiết kế nhằm đáp ứng nhu cầu khám và điều trị
                                        chuyên sâu, giúp khách hàng tiếp cận phương pháp chẩn đoán
                                        và chăm sóc phù hợp ngay từ giai đoạn đầu.
                                    </p>
                                )}
                                <button
                                    onClick={() => setShowMore(!showMore)}
                                    className="showmore-btn"
                                >
                                    <span>{showMore ? 'Thu gọn' : 'Xem thêm'}</span>
                                    <Sparkles size={16} className="sparkle" />
                                </button>
                            </div>

                            <div className="hero-stats">
                                <div className="stat">
                                    <div className="value">50+</div>
                                    <div className="label">Bác sĩ</div>
                                </div>
                                <div className="stat">
                                    <div className="value">10K+</div>
                                    <div className="label">Bệnh nhân</div>
                                </div>
                                <div className="stat">
                                    <div className="value">98%</div>
                                    <div className="label">Hài lòng</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="hero-right">
                        <div className="features-grid">
                            <div className="feature">
                                <Stethoscope size={48} />
                                <h3>Khám Chuyên Sâu</h3>
                                <p>
                                    Đội ngũ bác sĩ giàu kinh nghiệm, chuyên môn cao trong từng lĩnh
                                    vực
                                </p>
                            </div>
                            <div className="feature">
                                <Activity size={48} />
                                <h3>Chẩn Đoán Hiện Đại</h3>
                                <p>Trang thiết bị y tế tiên tiến, công nghệ chẩn đoán chính xác</p>
                            </div>
                            <div className="feature">
                                <Heart size={48} />
                                <h3>Chăm Sóc Tận Tâm</h3>
                                <p>Hỗ trợ toàn diện trong suốt quá trình khám và điều trị</p>
                            </div>
                            <div className="feature">
                                <Shield size={48} />
                                <h3>An Toàn Tối Đa</h3>
                                <p>Quy trình khám chữa bệnh theo chuẩn quốc tế</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
