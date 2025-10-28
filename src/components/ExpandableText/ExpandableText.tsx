import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { getDisplayText } from '@/utils/profileUtils';

interface ExpandableTextProps {
    text?: string;
    limit?: number;
    className?: string;
}

/**
 * Reusable component for expandable text with "Show more/Show less" functionality
 * Eliminates duplicate code between components
 */
const ExpandableText: React.FC<ExpandableTextProps> = ({ text = '', limit = 300, className }) => {
    const [expanded, setExpanded] = useState(false);

    const isLongText = text.length > limit;
    const displayText = getDisplayText(text, expanded, isLongText, limit);

    if (!text) {
        return <p className={className}>Không có thông tin</p>;
    }

    return (
        <div>
            <p className={className}>{displayText}</p>
            {isLongText && (
                <Link
                    to="#"
                    className="show-more d-flex align-items-center"
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

export default ExpandableText;
