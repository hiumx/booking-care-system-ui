import clsx from 'clsx';
import styles from './OnlineContacts.module.scss';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { mockOnlineContacts } from '../../../../data/mockData';

const OnlineContacts = () => {
    return (
        <div className={clsx(styles.topOnlineContacts, 'top-online-contacts')}>
            <div className="fav-title">
                <h6>Đang online</h6>
                <a href="javascript:void(0);">Xem tất cả</a>
            </div>
            <Swiper spaceBetween={10} slidesPerView={5} className="online-contacts-swiper">
                {mockOnlineContacts.map((contact) => (
                    <SwiperSlide key={contact.id}>
                        <div className="top-contacts-box">
                            <div className={`profile-img ${contact.isOnline ? 'online' : ''}`}>
                                <img src={contact.avatar} alt={contact.name} />
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default OnlineContacts;
