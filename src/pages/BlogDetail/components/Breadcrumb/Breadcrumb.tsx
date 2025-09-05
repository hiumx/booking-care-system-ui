import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Breadcrumb.module.scss';

export type BreadcrumbItem = { label: string; path?: string };

type Props = { items: BreadcrumbItem[] };

const Breadcrumb: React.FC<Props> = ({ items }) => {
    return (
        <nav className={styles.breadcrumb} aria-label="breadcrumb">
            <ol>
                {items.map((item, idx) => (
                    <li key={idx} className={idx === items.length - 1 ? styles.active : ''}>
                        {item.path ? (
                            <Link to={item.path}>{item.label}</Link>
                        ) : (
                            <span>{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
