import React, { useMemo } from 'react';
import styles from './TableSkeleton.module.scss';

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, columns = 6 }) => {
    const skeletonData = useMemo(() => {
        return {
            headers: Array.from({ length: columns }, () => crypto.randomUUID()),
            rows: Array.from({ length: rows }, () => ({
                id: crypto.randomUUID(),
                cells: Array.from({ length: columns }, () => crypto.randomUUID()),
            })),
        };
    }, [rows, columns]);

    return (
        <div className="table-responsive">
            <table className="table table-center mb-0">
                <thead>
                    <tr>
                        {skeletonData.headers.map((headerId) => (
                            <th key={headerId}>
                                <div className={styles.skeletonHeader}></div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {skeletonData.rows.map((row) => (
                        <tr key={row.id}>
                            {row.cells.map((cellId, colIndex) => (
                                <td key={cellId}>
                                    <div className={styles.skeletonCell}>
                                        {colIndex === 1 ? (
                                            // Doctor column with avatar
                                            <div className={styles.avatarSkeleton}>
                                                <div className={styles.skeletonAvatar}></div>
                                                <div className={styles.skeletonText}></div>
                                            </div>
                                        ) : (
                                            <div className={styles.skeletonText}></div>
                                        )}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableSkeleton;
