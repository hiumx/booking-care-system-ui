// src/pages/ScreenManagement/ScreenManagement.tsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    SCREENS_DATA,
    getScreensByCategory,
    searchScreens,
    getScreenStats,
} from '@/pages/ScreenManagement/data/screens.data';
import { ScreenCategory, ScreenStatus, ScreenFilter } from '@/types/screen.types';
import clsx from 'clsx';
import styles from './ScreenManagement.module.scss';

const ScreenManagement: React.FC = () => {
    const [filter, setFilter] = useState<ScreenFilter>({});
    const [view, setView] = useState<'grid' | 'list'>('grid');

    // Filter screens based on current filter
    const filteredScreens = useMemo(() => {
        let screens = SCREENS_DATA;

        if (filter.category) {
            screens = getScreensByCategory(filter.category);
        }

        if (filter.status) {
            screens = screens.filter((screen) => screen.status === filter.status);
        }

        if (filter.search) {
            screens = searchScreens(filter.search);
        }

        return screens;
    }, [filter]);

    const stats = getScreenStats();

    const getStatusBadgeClass = (status: ScreenStatus) => {
        switch (status) {
            case ScreenStatus.COMPLETED:
                return 'badge bg-success';
            case ScreenStatus.IN_PROGRESS:
                return 'badge bg-warning';
            case ScreenStatus.PLANNED:
                return 'badge bg-info';
            case ScreenStatus.DEPRECATED:
                return 'badge bg-danger';
            default:
                return 'badge bg-secondary';
        }
    };

    const getCategoryIcon = (category: ScreenCategory) => {
        switch (category) {
            case ScreenCategory.AUTHENTICATION:
                return 'feather-shield';
            case ScreenCategory.USER_PROFILE:
                return 'feather-user';
            case ScreenCategory.DOCTOR:
                return 'feather-users';
            case ScreenCategory.DASHBOARD:
                return 'feather-grid';
            case ScreenCategory.PUBLIC:
                return 'feather-globe';
            case ScreenCategory.DEMO:
                return 'feather-layout';
            default:
                return 'feather-file';
        }
    };

    return (
        <div className={styles.screenManagement}>
            {/* Header */}
            <div className={styles.header}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="h3 mb-2">Screen Management</h1>
                        <p className="text-muted">
                            Manage and overview all screens in the booking care system
                        </p>
                    </div>
                    <div className={styles.viewToggle}>
                        <button
                            className={clsx(
                                'btn btn-sm',
                                view === 'grid' ? 'btn-primary' : 'btn-outline-primary'
                            )}
                            onClick={() => setView('grid')}
                        >
                            <i className="feather-grid me-1"></i>
                            Grid
                        </button>
                        <button
                            className={clsx(
                                'btn btn-sm',
                                view === 'list' ? 'btn-primary' : 'btn-outline-primary'
                            )}
                            onClick={() => setView('list')}
                        >
                            <i className="feather-list me-1"></i>
                            List
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="row mb-4">
                    <div className="col-md-3">
                        <div className="card bg-primary text-white">
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <h4 className="mb-0">{stats.total}</h4>
                                        <p className="mb-0">Total Screens</p>
                                    </div>
                                    <i className="feather-monitor fs-2"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-success text-white">
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <h4 className="mb-0">{stats.completed}</h4>
                                        <p className="mb-0">Completed</p>
                                    </div>
                                    <i className="feather-check-circle fs-2"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-warning text-white">
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <h4 className="mb-0">{stats.inProgress}</h4>
                                        <p className="mb-0">In Progress</p>
                                    </div>
                                    <i className="feather-clock fs-2"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-info text-white">
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <h4 className="mb-0">{stats.completionRate}%</h4>
                                        <p className="mb-0">Completion Rate</p>
                                    </div>
                                    <i className="feather-trending-up fs-2"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="card mb-4">
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label">Search</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="feather-search"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search screens..."
                                        value={filter.search || ''}
                                        onChange={(e) =>
                                            setFilter((prev) => ({
                                                ...prev,
                                                search: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-select"
                                    value={filter.category || ''}
                                    onChange={(e) =>
                                        setFilter((prev) => ({
                                            ...prev,
                                            category:
                                                (e.target.value as ScreenCategory) || undefined,
                                        }))
                                    }
                                >
                                    <option value="">All Categories</option>
                                    {Object.values(ScreenCategory).map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    value={filter.status || ''}
                                    onChange={(e) =>
                                        setFilter((prev) => ({
                                            ...prev,
                                            status: (e.target.value as ScreenStatus) || undefined,
                                        }))
                                    }
                                >
                                    <option value="">All Statuses</option>
                                    {Object.values(ScreenStatus).map((status) => (
                                        <option key={status} value={status}>
                                            {status.charAt(0).toUpperCase() +
                                                status.slice(1).replace('-', ' ')}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {(filter.search || filter.category || filter.status) && (
                            <div className="mt-3">
                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => setFilter({})}
                                >
                                    <i className="feather-x me-1"></i>
                                    Clear Filters
                                </button>
                                <span className="text-muted ms-3">
                                    Showing {filteredScreens.length} of {stats.total} screens
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Screen List/Grid */}
            <div className={styles.screensContainer}>
                {view === 'grid' ? (
                    <div className="row">
                        {filteredScreens.map((screen) => (
                            <div key={screen.id} className="col-md-6 col-lg-4 mb-4">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div className="d-flex align-items-center">
                                                <i
                                                    className={clsx(
                                                        getCategoryIcon(screen.category),
                                                        'me-2 text-primary'
                                                    )}
                                                ></i>
                                                <h6 className="card-title mb-0">{screen.name}</h6>
                                            </div>
                                            <span className={getStatusBadgeClass(screen.status)}>
                                                {screen.status.replace('-', ' ')}
                                            </span>
                                        </div>
                                        <p className="card-text text-muted small mb-3">
                                            {screen.description}
                                        </p>
                                        <div className="mb-3">
                                            <small className="text-muted">Path:</small>
                                            <code className="d-block">{screen.path}</code>
                                        </div>
                                        <div className="mb-3">
                                            <small className="text-muted">Component:</small>
                                            <span className="d-block">{screen.component}</span>
                                        </div>
                                        {screen.tags && (
                                            <div className="mb-3">
                                                {screen.tags.slice(0, 3).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="badge bg-light text-dark me-1"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {screen.tags.length > 3 && (
                                                    <span className="text-muted small">
                                                        +{screen.tags.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        <div className="d-flex justify-content-between">
                                            <span className="badge bg-secondary">
                                                <i className={getCategoryIcon(screen.category)}></i>{' '}
                                                {screen.category}
                                            </span>
                                            {screen.path !== '*' && (
                                                <Link
                                                    to={screen.path}
                                                    className="btn btn-sm btn-outline-primary"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <i className="feather-external-link me-1"></i>
                                                    View
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Screen</th>
                                        <th>Path</th>
                                        <th>Category</th>
                                        <th>Status</th>
                                        <th>Component</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredScreens.map((screen) => (
                                        <tr key={screen.id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <i
                                                        className={clsx(
                                                            screen.icon ||
                                                                getCategoryIcon(screen.category),
                                                            'me-2'
                                                        )}
                                                    ></i>
                                                    <div>
                                                        <div className="fw-medium">
                                                            {screen.name}
                                                        </div>
                                                        <small className="text-muted">
                                                            {screen.description}
                                                        </small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <code>{screen.path}</code>
                                            </td>
                                            <td>
                                                <span className="badge bg-secondary">
                                                    <i
                                                        className={getCategoryIcon(screen.category)}
                                                    ></i>{' '}
                                                    {screen.category}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={getStatusBadgeClass(screen.status)}
                                                >
                                                    {screen.status.replace('-', ' ')}
                                                </span>
                                            </td>
                                            <td>{screen.component}</td>
                                            <td>
                                                {screen.path !== '*' && (
                                                    <Link
                                                        to={screen.path}
                                                        className="btn btn-sm btn-outline-primary"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <i className="feather-external-link me-1"></i>
                                                        View
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {filteredScreens.length === 0 && (
                    <div className="text-center py-5">
                        <i className="feather-search fs-1 text-muted mb-3"></i>
                        <h5>No screens found</h5>
                        <p className="text-muted">Try adjusting your filters or search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScreenManagement;
