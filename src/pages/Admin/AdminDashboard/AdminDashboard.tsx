import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS, buildPath } from '../../../routes/paths';

const AdminDashboard: React.FC = () => {
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="mb-0">Admin Dashboard</h3>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <div className="card bg-primary text-white">
                                        <div className="card-body">
                                            <h5 className="card-title">Discount Management</h5>
                                            <p className="card-text">
                                                Manage discount codes, create promotions, and track
                                                usage.
                                            </p>
                                            <Link
                                                to={buildPath(
                                                    PATHS.ADMIN.ROOT,
                                                    PATHS.ADMIN.DISCOUNT_MANAGEMENT
                                                )}
                                                className="btn btn-light me-2"
                                            >
                                                Manage Discounts
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <div className="card bg-info text-white">
                                        <div className="card-body">
                                            <h5 className="card-title">Discount Demo</h5>
                                            <p className="card-text">
                                                Test discount validation functionality in a booking
                                                context.
                                            </p>
                                            <Link
                                                to={buildPath(
                                                    PATHS.ADMIN.ROOT,
                                                    PATHS.ADMIN.DISCOUNT_DEMO
                                                )}
                                                className="btn btn-light"
                                            >
                                                Try Demo
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <div className="card bg-success text-white">
                                        <div className="card-body">
                                            <h5 className="card-title">User Management</h5>
                                            <p className="card-text">
                                                Manage user accounts, roles, and permissions.
                                            </p>
                                            <button className="btn btn-light" disabled>
                                                Coming Soon
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <div className="card bg-warning text-dark">
                                        <div className="card-body">
                                            <h5 className="card-title">Analytics</h5>
                                            <p className="card-text">
                                                View reports, analytics, and business insights.
                                            </p>
                                            <button className="btn btn-dark" disabled>
                                                Coming Soon
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="card bg-secondary text-white">
                                        <div className="card-body">
                                            <h5 className="card-title">Settings</h5>
                                            <p className="card-text">
                                                System configuration and preferences.
                                            </p>
                                            <button className="btn btn-light" disabled>
                                                Coming Soon
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
