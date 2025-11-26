import React, { useRef } from 'react';
import { FileText } from 'lucide-react';
import styles from './LabResultAnalysisCard.module.scss';

interface LabResultAnalysisCardProps {
    onFileSelect: (file: File) => void;
}

const LabResultAnalysisCard: React.FC<LabResultAnalysisCardProps> = ({ onFileSelect }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCardClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelect(file);
        }
    };

    return (
        <>
            <div
                className={styles.labResultCard}
                onClick={handleCardClick}
                role="button"
                tabIndex={0}
            >
                <div className={styles.iconWrapper}>
                    <FileText size={32} className={styles.icon} />
                </div>
                <div className={styles.content}>
                    <h3 className={styles.title}>Phân tích kết quả xét nghiệm</h3>
                    <p className={styles.description}>
                        Upload ảnh kết quả xét nghiệm để AI phân tích và đề xuất chuyên khoa, bác
                        sĩ, bệnh viện phù hợp
                    </p>
                </div>
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
        </>
    );
};

export default LabResultAnalysisCard;
