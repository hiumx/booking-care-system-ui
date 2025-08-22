import React, { MouseEvent } from 'react';
import styles from './TableOfContents.module.scss';

type TocItem = { id: string; title: string };

type Props = {
    items: TocItem[];
    onClick: (e: MouseEvent<HTMLAnchorElement>, id: string) => void;
};

const TableOfContents: React.FC<Props> = ({ items, onClick }) => {
    return (
        <div className={styles.toc}>
            <div className={styles.tocTitle}>Nội dung bài viết</div>
            <ul>
                {items.map((s) => (
                    <li key={s.id}>
                        <a href={`#${s.id}`} onClick={(e) => onClick(e, s.id)}>
                            {s.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TableOfContents;
