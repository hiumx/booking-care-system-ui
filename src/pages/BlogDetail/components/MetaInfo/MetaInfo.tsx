import React from 'react';
import styles from './MetaInfo.module.scss';

type Props = {
    authorUrl: string;
    authorName: string;
    authorAvatar: string;
    date: string;
};

const MetaInfo: React.FC<Props> = ({ authorUrl, authorName, authorAvatar, date }) => {
    return (
        <div className={styles.meta}>
            <a href={authorUrl} className={styles.authorLink} aria-label={authorName}>
                <img src={authorAvatar} alt={authorName} className={styles.avatar} />
            </a>
            <div className={styles.metaText}>
                <div className={styles.authorLabel}>Tác giả:</div>
                <div className={styles.author}>
                    <a href={authorUrl}>{authorName}</a>
                </div>
                <div className={styles.date}>{date}</div>
            </div>
        </div>
    );
};

export default MetaInfo;
