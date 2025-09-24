import React from 'react';

export interface DoctorInfo {
    name: string;
    specialty: string;
    rating: number;
    location: string;
    avatar: string;
}

export interface AppointmentInfo {
    service: string;
    serviceType: string;
    dateTime: string;
    appointmentType: string;
}

interface BookingHeaderProps {
    doctor: DoctorInfo;
    appointment: AppointmentInfo;
}

const BookingHeader: React.FC<BookingHeaderProps> = ({ doctor, appointment }) => {
    return (
        <div className="card-header pt-3">
            <div className="booking-header pb-0">
                <div className="card mb-0">
                    <div className="card-body">
                        <div className="d-flex align-items-center flex-wrap rpw-gap-2 mb-4 flex-wrap row-gap-2">
                            <span className="avatar avatar-xxxl avatar-rounded me-2 flex-shrink-0">
                                <img src={doctor.avatar} alt={doctor.name} />
                            </span>
                            <div>
                                <h4 className="mb-1">
                                    {doctor.name}{' '}
                                    <span className="badge bg-orange fs-12">
                                        <i className="fa-solid fa-star me-1"></i>
                                        {doctor.rating}
                                    </span>
                                </h4>
                                <p className="text-indigo mb-3 fw-medium">{doctor.specialty}</p>
                                <p className="mb-0">
                                    <i className="isax isax-location me-2"></i>
                                    {doctor.location}
                                </p>
                            </div>
                        </div>
                        <h6 className="mb-2">Thông tin lịch khám</h6>
                        <div className="row gx-2 gy-3">
                            <div className="col-lg-3 col-sm-6">
                                <div>
                                    <h6 className="fs-14 fw-medium mb-1">Dịch vụ</h6>
                                    <p className="mb-0">{appointment.service}</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-sm-6">
                                <div>
                                    <h6 className="fs-14 fw-medium mb-1">Dịch vụ</h6>
                                    <p className="mb-0">{appointment.serviceType}</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-sm-6">
                                <div>
                                    <h6 className="fs-14 fw-medium mb-1">Ngày & Giờ</h6>
                                    <p className="mb-0">{appointment.dateTime}</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-sm-6">
                                <div>
                                    <h6 className="fs-14 fw-medium mb-1">Loại lịch khám</h6>
                                    <p className="mb-0">{appointment.appointmentType}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingHeader;
