import React from 'react';

interface ExperienceProps {
    logo: string;
    hospitalName: string;
    specialties: string;
    positions: string;
    experiences: string;
    description: string;
    extraClass?: string;
}

const Experience: React.FC<ExperienceProps> = ({
    logo,
    hospitalName,
    specialties,
    positions,
    experiences,
    description,
    extraClass,
}) => {
    return (
        <div className="doc-information-details" id="experience">
            <div className="detail-title">
                <h4>Kinh nghiệm</h4>
            </div>

            <div className="experience-info">
                <div className="experience-logo">
                    <span>
                        <img src={logo} alt="Experience Logo" />
                    </span>
                </div>
                <div className={`experience-content ${extraClass || ''}`}>
                    <h5>{hospitalName}</h5>
                    <p>
                        <strong>Chuyên khoa:</strong> {specialties}
                    </p>
                    <p>
                        <strong>Trình độ:</strong> {positions}
                    </p>
                    <p>
                        <strong>Kinh nghiệm:</strong> {experiences}
                    </p>
                    <p>
                        <strong>Mô tả:</strong> {description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Experience;
