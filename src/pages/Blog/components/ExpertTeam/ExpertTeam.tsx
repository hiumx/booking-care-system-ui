import React from 'react';
import styles from './ExpertTeam.module.scss';
import doc1 from '@/assets/img/doctors/doctor-01.jpg';
import doc2 from '@/assets/img/doctors/doctor-02.jpg';
import doc3 from '@/assets/img/doctors/doctor-03.jpg';
import doc4 from '@/assets/img/doctors/doctor-04.jpg';
import doc5 from '@/assets/img/doctors/doctor-05.jpg';
import doc6 from '@/assets/img/doctors/doctor-06.jpg';
import { Link } from 'react-router-dom';

const ExpertTeam: React.FC = () => {
    const experts = [
        {
            id: 1,
            name: 'ThS.BS Nguyễn Hồng Vân Khánh',
            specialty: 'Gan mật tụy - Ghép gan, Nhi',
            image: doc1,
            href: '/experts/1',
        },
        {
            id: 2,
            name: 'ThS.BS Phan Lê Nam',
            specialty: 'Sản phụ khoa',
            image: doc2,
            href: '/experts/2',
        },
        {
            id: 3,
            name: 'ThS.BS Đinh Thị Lan Phương',
            specialty: 'Tai - Mũi - Họng',
            image: doc3,
            href: '/experts/3',
        },
        {
            id: 4,
            name: 'Dược sĩ Dương Anh Hoàng',
            specialty: 'Dược',
            image: doc4,
            href: '/experts/4',
        },
        {
            id: 5,
            name: 'ThS.BS Vũ Thành Đô',
            specialty: 'Tim - Thận - Khớp - Nội tiết',
            image: doc5,
            href: '/experts/5',
        },
        {
            id: 6,
            name: 'ThS.BS Nguyễn Trung Nghĩa',
            specialty: 'Tâm thần',
            image: doc6,
            href: '/experts/6',
        },
    ];

    return (
        <section className={styles.expertTeam}>
            <h2 className={styles.title}>Đội Ngũ Chuyên Gia</h2>

            <div className={styles.wrapper}>
                <div className={styles.contentGrid}>
                    <div className={styles.expertsGrid}>
                        {experts.map((ex) => (
                            <Link key={ex.id} to={ex.href} className={styles.expertItem}>
                                <div className={styles.avatarBox}>
                                    <img src={ex.image} alt={ex.name} />
                                </div>
                                <div className={styles.info}>
                                    <h3 className={styles.name}>{ex.name}</h3>
                                    <p className={styles.specialty}>{ex.specialty}</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <aside className={styles.commitBlock}>
                        <p className={styles.commitText}>
                            Hội đồng tham vấn y khoa cùng đội ngũ biên tập viên là các bác sĩ, dược
                            sĩ đảm bảo nội dung chúng tôi cung cấp chính xác về mặt y khoa và cập
                            nhật những thông tin mới nhất.
                        </p>
                        <Link to="#" className={styles.commitCta}>
                            Đội ngũ chuyên gia
                            <span className={styles.ctaIcon} aria-hidden="true">
                                →
                            </span>
                        </Link>
                    </aside>
                </div>
            </div>
        </section>
    );
};

export default ExpertTeam;
