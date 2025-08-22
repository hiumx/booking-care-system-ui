import React from 'react';
import styles from './TopicsOfInterest.module.scss';
import { Link } from 'react-router-dom';

const TopicsOfInterest: React.FC = () => {
    const topics = [
        {
            id: 1,
            name: 'Chăm sóc da',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2022/06/cham-soc-da.png',
            description: 'Skin care',
            href: '/topics/cham-soc-da',
        },
        {
            id: 2,
            name: 'Dạ dày',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2022/06/da-day.png',
            description: 'Stomach',
            href: '/topics/da-day',
        },
        {
            id: 3,
            name: 'Da liễu',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2022/06/da-lieu.png',
            description: 'Dermatology',
            href: '/topics/da-lieu',
        },
        {
            id: 4,
            name: 'Dinh Dưỡng',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2022/06/dinh-duong.png',
            description: 'Nutrition',
            href: '/topics/dinh-duong',
        },
        {
            id: 5,
            name: 'Đái tháo đường',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2022/06/dai-thao-duong-1.png',
            description: 'Diabetes',
            href: '/topics/dai-thao-duong',
        },
        {
            id: 6,
            name: 'Huyết áp',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2022/06/tim-mach.png',
            description: 'Blood pressure',
            href: '/topics/huyet-ap',
        },
        {
            id: 7,
            name: 'Mang thai',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2022/06/mang-thai.png',
            description: 'Pregnant',
            href: '/topics/mang-thai',
        },
        {
            id: 8,
            name: 'Nuôi dạy con',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2022/06/nuoi-day-con.png',
            description: 'Parenting',
            href: '/topics/nuoi-day-con',
        },
        {
            id: 9,
            name: 'Sức khỏe nam giới',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2022/06/suc-khoe-nam-gioi.png',
            description: "Men's health",
            href: '/topics/suc-khoe-nam-gioi',
        },
        {
            id: 10,
            name: 'Sức khoẻ nữ giới',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2022/06/suc-khoe-nu-gioi.png',
            description: "Women's health",
            href: '/topics/suc-khoe-nu-gioi',
        },
        {
            id: 11,
            name: 'Sức khỏe tình dục',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2022/06/suc-khoe-tinh-duc.png',
            description: 'Sexual health',
            href: '/topics/suc-khoe-tinh-duc',
        },
        {
            id: 12,
            name: 'Ung Thư',
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2022/06/ung-thu.png',
            description: 'Cancer',
            href: '/topics/ung-thu',
        },
    ];

    return (
        <section className={styles.topicsOfInterest}>
            <h2 className={styles.title}>Chủ Đề Được Quan Tâm</h2>

            <div className={styles.topicsGrid}>
                {topics.map((topic) => (
                    <Link key={topic.id} to={topic.href} className={styles.topicCard}>
                        <div className={styles.topicIcon}>
                            <img src={topic.image} alt={topic.name} />
                        </div>
                        <h3 className={styles.topicName}>{topic.name}</h3>
                        <p className={styles.topicDescription}>{topic.description}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default TopicsOfInterest;
