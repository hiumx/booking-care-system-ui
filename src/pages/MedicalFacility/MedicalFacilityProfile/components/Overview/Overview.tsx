// Overview.tsx
import React from 'react';
import clsx from 'clsx';

interface Clinic {
    id: number;
    account_id: number;
    name: string;
    address: string;
    phone: string | null;
    email: string;
    description: string;
    background_url: string;
    avatar_url: string;
    status: 'ACTIVE' | 'INACTIVE';
    created_at: string;
    updated_at: string;
}

interface Specialty {
    id: number;
    name: string;
    image_url: string;
    status: 'ACTIVE' | 'INACTIVE';
    created_at: string;
    updated_at: string;
}

interface OverviewProps {
    clinic: Clinic;
    specialties: Specialty[];
    isActive?: boolean; // Add isActive prop
}

const Overview: React.FC<OverviewProps> = ({ clinic, specialties, isActive = false }) => (
    <div className={clsx('tab-pane fade', { 'show active': isActive })} id="doc_overview">
        <div className="row">
            <div className="col-md-12">
                <div className="widget about-widget">
                    <h4 className="widget-title">Giới Thiệu</h4>
                    <p>{clinic.description}</p>
                </div>
                <div className="widget specialties-widget mb-0">
                    <h4 className="widget-title">Chuyên Khoa</h4>
                    <div className="experience-box">
                        <ul className="experience-list">
                            {specialties.length > 0 ? (
                                specialties.map((specialty) => (
                                    <li key={specialty.id}>
                                        <div className="experience-user">
                                            <div className="before-circle"></div>
                                        </div>
                                        <div className="experience-content">
                                            <div className="timeline-content">
                                                <h6 className="exp-title">{specialty.name}</h6>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li>
                                    <div className="experience-content">
                                        <div className="timeline-content">
                                            <p>Không có chuyên khoa nào được liệt kê.</p>
                                        </div>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Overview;
