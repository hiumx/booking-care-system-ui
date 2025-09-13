import Carousel from '@/components/Carousel';
import React from 'react';
import styles from './SectionItem.module.scss';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface SectionItemProps {
    title: string;
    desc: string;
    items: React.ReactNode[];
    breakpoints: object;
    viewAllTarget?: string;
    viewAllText?: string;
    isBackgroundColor?: boolean;
    isAutoPlay?: boolean;
}

const SectionItem: React.FC<SectionItemProps> = ({
    title,
    desc,
    items,
    breakpoints,
    viewAllTarget,
    viewAllText = 'View All',
    isBackgroundColor = false,
    isAutoPlay = false,
}) => {
    return (
        <section
            className={clsx(styles.sectionItemContainer, {
                [styles.backGroundColor]: isBackgroundColor,
            })}
        >
            <div className="container">
                <div
                    className={`section-header sec-header-one text-center aos ${styles.sectionHeader}`}
                >
                    <div className={styles.headerContent}>
                        <div className={styles.headerText}>
                            <span className="badge badge-primary">{title}</span>
                            <h2>{desc}</h2>
                        </div>
                    </div>
                    {viewAllTarget && (
                        <div className={styles.headerActions}>
                            <Link
                                className={`btn btn-outline-primary ${styles.viewAllBtn}`}
                                to={viewAllTarget}
                            >
                                {viewAllText}
                                <i className="fas fa-arrow-right ms-2"></i>
                            </Link>
                        </div>
                    )}
                </div>
                <div className="owl-carousel spciality-slider aos">
                    <Carousel slides={items} breakpoints={breakpoints} isAutoPlay={isAutoPlay} />
                </div>
            </div>
        </section>
    );
};

export default SectionItem;
