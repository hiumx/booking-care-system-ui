import React from 'react';

interface Doctor {
    id: string;
    name: string;
    specialty: string;
    location: string;
    consultationTime: string;
    consultationFee: number;
    rating: number;
    available: boolean;
    image: string; // This will be the imported image module
    specialtyColor: string;
}

interface DoctorCardProps {
    doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
    return (
        <div className="col-xxl-4 col-md-6">
            <div className="card">
                <div className="card-img card-img-hover">
                    <a href="doctor-profile.html">
                        <img src={doctor.image} alt={doctor.name} />
                    </a>
                    <div className="grid-overlay-item d-flex align-items-center justify-content-between">
                        <span className="badge bg-orange">
                            <i className="fa-solid fa-star me-1"></i>
                            {doctor.rating.toFixed(1)}
                        </span>
                        <a href="javascript:void(0)" className="fav-icon">
                            <i className="fa fa-heart"></i>
                        </a>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div
                        className={`d-flex active-bar active-bar-${doctor.specialtyColor} align-items-center justify-content-between p-3`}
                    >
                        <a href="#" className={`text-${doctor.specialtyColor} fw-medium fs-14`}>
                            {doctor.specialty}
                        </a>
                        <span
                            className={`badge bg-${doctor.available ? 'success' : 'danger'}-light d-inline-flex align-items-center`}
                        >
                            <i className="fa-solid fa-circle fs-5 me-1"></i>
                            {doctor.available ? 'Available' : 'Unavailable'}
                        </span>
                    </div>
                    <div className="p-3 pt-0">
                        <div className="doctor-info-detail mb-3 pb-3">
                            <h3 className="mb-1">
                                <a href="doctor-profile.html">{doctor.name}</a>
                            </h3>
                            <div className="d-flex align-items-center">
                                <p className="d-flex align-items-center mb-0 fs-14">
                                    <i className="isax isax-location me-2"></i>
                                    {doctor.location}
                                </p>
                                <i className="fa-solid fa-circle fs-5 text-primary mx-2 me-1"></i>
                                <span className="fs-14 fw-medium">{doctor.consultationTime}</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <p className="mb-1">Consultation Fees</p>
                                <h3 className="text-orange">${doctor.consultationFee}</h3>
                            </div>
                            <a
                                href="booking.html"
                                className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                            >
                                <i className="isax isax-calendar-1 me-2"></i>
                                Book Now
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorCard;
