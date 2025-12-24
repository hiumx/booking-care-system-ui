import React, { useState } from 'react';
import { Search } from 'lucide-react';
import './SearchSection.scss';

const SearchSection: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="search-container">
            <div className="search-box">
                {/* Header */}
                <div className="search-header">
                    <div className="search-header-icon">
                        <Search className="icon" />
                    </div>
                    <h3 className="title">Tìm kiếm nâng cao</h3>
                </div>

                {/* Input & Filters */}
                <div className="search-body">
                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder="Nhập tên bệnh viện, bác sĩ hoặc chuyên khoa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="input-icon" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchSection;
