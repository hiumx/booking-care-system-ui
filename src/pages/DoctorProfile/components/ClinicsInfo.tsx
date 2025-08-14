import React from 'react';
import { Link } from 'react-router-dom';

interface Availability {
    day: string;
    time: string;
}

interface ClinicProps {
    image: string;
    name: string;
    clinicLinkText: string;
    clinicUrl: string;
    addressOrSpeciality: string;
    availability: Availability[];
    mapUrl: string;
    extraClass?: string;
}

const ClinicsInfo: React.FC<ClinicProps> = ({
    image,
    name,
    clinicLinkText,
    clinicUrl,
    addressOrSpeciality,
    availability,
    mapUrl,
    extraClass,
}) => {
    return (
        <div className="doc-information-details" id="clinic">
            <div className="detail-title">
                <h4>Clinics & Locations</h4>
            </div>

            <div className={`clinic-loc ${extraClass || ''}`}>
                <div className="row align-items-center">
                    <div className="col-lg-7">
                        <div className="clinic-info">
                            <div className="clinic-img">
                                <img src={image} alt={name} />
                            </div>
                            <div className="detail-clinic">
                                <h5>{name}</h5>
                                <Link to={clinicUrl} className="clinic-link">
                                    {clinicLinkText}
                                </Link>
                                <p>{addressOrSpeciality}</p>
                            </div>
                        </div>
                        <div className="d-flex align-items-center avail-time-slot">
                            {availability.map((slot, idx) => (
                                <div className="availability-date" key={idx}>
                                    <div className="book-date">
                                        <h6>{slot.day}</h6>
                                        <span>{slot.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-lg-5">
                        <div className="contact-map d-flex">
                            <iframe
                                src={mapUrl}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title={`Map for ${name}`}
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClinicsInfo;
