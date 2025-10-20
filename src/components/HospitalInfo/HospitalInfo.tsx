import React from 'react';
import { Link } from 'react-router-dom';

interface HospitalInfoProps {
    hospital: {
        id: number;
        name: string;
        address: string;
        background_url: string;
    };
    availabilitySlots?: Array<{
        day: string;
        time: string;
    }>;
}

const HospitalInfo: React.FC<HospitalInfoProps> = ({
    hospital,
    availabilitySlots = [
        {
            day: 'Monday',
            time: '07:00 AM - 09:00 PM',
        },
        {
            day: 'Tuesday',
            time: '07:00 AM - 09:00 PM',
        },
    ],
}) => {
    return (
        <div className="clinic-loc">
            <div className="row align-items-center">
                <div className="col-lg-7">
                    <div className="clinic-info">
                        <div className="clinic-img">
                            <img src={hospital.background_url} alt={hospital.name} />
                        </div>
                        <div className="detail-clinic">
                            <h5>{hospital.name}</h5>
                            <Link to="/phong-kham/da-nang" className="clinic-link">
                                Xem thông tin bệnh viện
                            </Link>
                            <p>{hospital.address}</p>
                        </div>
                    </div>
                    <div className="d-flex align-items-center avail-time-slot">
                        {availabilitySlots.map((slot) => (
                            <div className="availability-date" key={`availability-${slot.day}`}>
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
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.7301009561315!2d-76.13077892422932!3d36.82498697224007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89bae976cfe9f8af%3A0xa61eac05156fbdb9!2sBeachStreet%20USA!5e0!3m2!1sen!2sin!4v1669777904208!5m2!1sen!2sin"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`Map for ${hospital.name}`}
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HospitalInfo;
