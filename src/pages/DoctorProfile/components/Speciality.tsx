import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../DoctorProfile.module.scss';

interface SpecialityProps {
    name: string;
    link: string;
}

const Speciality: React.FC<SpecialityProps> = ({ name, link }) => {
    return (
        <div className="doc-information-details" id="speciality">
            <div className="detail-title">
                <h4>Chuyên khoa</h4>
            </div>
            <ul className="special-links">
                <li>
                    <Link to={link} className={styles.link}>
                        {name}
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Speciality;
