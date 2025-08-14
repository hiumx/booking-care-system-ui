import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from '../DoctorProfile.module.scss';

interface BiographyProps {
    text: string;
}

const Biography: React.FC<BiographyProps> = ({ text }) => {
    const [expanded, setExpanded] = useState(false);

    const limit = 300;
    const isLongText = text.length > limit;
    const displayText = expanded || !isLongText ? text : text.slice(0, limit) + '...';

    return (
        <div className="doc-information-details bio-detail" id="doc_bio">
            <div className="detail-title">
                <h4>Tiểu sử bác sĩ</h4>
            </div>
            <p>{displayText}</p>
            {isLongText && (
                <Link
                    to="#"
                    className={clsx('show-more', 'd-flex', 'align-items-center', styles.link)}
                    onClick={(e) => {
                        e.preventDefault();
                        setExpanded((prev) => !prev);
                    }}
                >
                    {expanded ? 'Thu gọn' : 'Xem thêm'}
                    <i
                        className={clsx('fa-solid', 'ms-2', {
                            'fa-chevron-up': expanded,
                            'fa-chevron-down': !expanded,
                        })}
                    ></i>
                </Link>
            )}
        </div>
    );
};

export default Biography;
