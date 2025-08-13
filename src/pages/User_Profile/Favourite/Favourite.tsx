import { useState } from 'react';
import DoctorCard from './components/DoctorCard';
import { mockFavouriteDoctors, FavouriteDoctor } from './data/mockData';

const Favourite = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDoctors = mockFavouriteDoctors.filter(
        (doctor: FavouriteDoctor) =>
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="dashboard-header">
                <h3>Favourites</h3>
                <ul className="header-list-btns">
                    <li>
                        <div className="input-block dash-search-input">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <span className="search-icon">
                                <i className="isax isax-search-normal"></i>
                            </span>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Favourites */}
            <div className="row">
                {filteredDoctors.map((doctor: FavouriteDoctor) => (
                    <div key={doctor.id} className="col-md-6 col-lg-4 d-flex">
                        <DoctorCard doctor={doctor} />
                    </div>
                ))}
            </div>

            <div className="col-md-12">
                <div className="loader-item text-center mt-0">
                    <button className="btn btn-outline-primary rounded-pill">Load More</button>
                </div>
            </div>
        </>
    );
};

export default Favourite;
