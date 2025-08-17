import clsx from 'clsx';
import styles from './OnlineContacts.module.scss';

import { mockOnlineContacts } from '../../../../data/mockData';

const OnlineContacts = () => {
    return (
        <div className={clsx(styles.topOnlineContacts, 'top-online-contacts')}>
            <div className="fav-title">
                <h6>Đang online</h6>
                <a href="javascript:void(0);">Xem tất cả</a>
            </div>
            <div className="swiper-container">
                <div className="swiper-wrapper">
                    {mockOnlineContacts.map((contact) => (
                        <div key={contact.id} className="swiper-slide">
                            <div className="top-contacts-box">
                                <div className={`profile-img ${contact.isOnline ? 'online' : ''}`}>
                                    <img src={contact.avatar} alt={contact.name} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OnlineContacts;
