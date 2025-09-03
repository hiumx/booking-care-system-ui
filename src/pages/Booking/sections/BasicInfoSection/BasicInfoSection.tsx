const BasicInfoSection: React.FC = () => {
    return (
        <fieldset>
            <div className="card booking-card mb-0">
                <div className="card-header">
                    <div className="booking-header pb-0">
                        <div className="card mb-0">
                            <div className="card-body">
                                <div className="d-flex align-items-center flex-wrap rpw-gap-2 mb-4 flex-wrap row-gap-2">
                                    <span className="avatar avatar-xxxl avatar-rounded me-2 flex-shrink-0">
                                        <img src="assets/img/clients/client-15.jpg" alt="" />
                                    </span>
                                    <div>
                                        <h4 className="mb-1">
                                            Dr. Michael Brown{' '}
                                            <span className="badge bg-orange fs-12">
                                                <i className="fa-solid fa-star me-1"></i>5.0
                                            </span>
                                        </h4>
                                        <p className="text-indigo mb-3 fw-medium">Psychologist</p>
                                        <p className="mb-0">
                                            <i className="isax isax-location me-2"></i>5th Street -
                                            1011 W 5th St, Suite 120, Austin, TX 78703
                                        </p>
                                    </div>
                                </div>
                                <h6 className="mb-2">Booking Info</h6>
                                <div className="row gx-2 gy-3">
                                    <div className="col-lg-3 col-sm-6">
                                        <div>
                                            <h6 className="fs-14 fw-medium mb-1">Service</h6>
                                            <p className="mb-0">Cardiology (30 Mins)</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-sm-6">
                                        <div>
                                            <h6 className="fs-14 fw-medium mb-1">Service</h6>
                                            <p className="mb-0">Echocardiograms</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-sm-6">
                                        <div>
                                            <h6 className="fs-14 fw-medium mb-1">Date & Time</h6>
                                            <p className="mb-0">10:00 - 11:00 AM, 15, Oct</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-sm-6">
                                        <div>
                                            <h6 className="fs-14 fw-medium mb-1">
                                                Appointment type
                                            </h6>
                                            <p className="mb-0">Clinic (Wellness Path)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body booking-body">
                    <div className="card mb-0">
                        <div className="card-body pb-1">
                            <div className="row">
                                <div className="col-lg-4 col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">First Name</label>
                                        <input type="text" className="form-control" />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Last Name</label>
                                        <input type="text" className="form-control" />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Phone Number</label>
                                        <input type="text" className="form-control" />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Email Address</label>
                                        <input type="text" className="form-control" />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Select Patient</label>
                                        <select className="select">
                                            <option>Andrew Fletcher</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Symptoms</label>
                                        <input type="text" className="form-control" />
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="mb-3">
                                        <label className="form-label">Attachment</label>
                                        <input type="file" className="form-control" />
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="mb-3">
                                        <label className="form-label">Reason for Visit</label>
                                        <textarea className="form-control" rows={3}></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer">
                    <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between">
                        <a
                            href="javascript:void(0);"
                            className="btn btn-md btn-dark prev_btns inline-flex align-items-center rounded-pill"
                        >
                            <i className="isax isax-arrow-left-2 me-1"></i>
                            Back
                        </a>
                        <a
                            href="javascript:void(0);"
                            className="btn btn-md btn-primary-gradient next_btns inline-flex align-items-center rounded-pill"
                        >
                            Select Payment
                            <i className="isax isax-arrow-right-3 ms-1"></i>
                        </a>
                    </div>
                </div>
            </div>
        </fieldset>
    );
};

export default BasicInfoSection;
