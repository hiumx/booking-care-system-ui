import React from 'react';
import { Link } from 'react-router-dom';
import GoogleMaps from '@/components/GoogleMaps/GoogleMaps';

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
                    <GoogleMaps
                        address={hospital.address}
                        title={`Map for ${hospital.name}`}
                        fallbackMessage="Bản đồ bệnh viện không thể tải. Có thể do trình chặn quảng cáo."
                    />
                </div>
            </div>
        </div>
    );
};

export default HospitalInfo;
