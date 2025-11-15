import React from 'react';
import styles from './TypingIndicator.module.scss';

const TypingIndicator: React.FC = () => {
    return (
        <div className={styles.typingIndicator}>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
        </div>
    );
};

export default TypingIndicator;
