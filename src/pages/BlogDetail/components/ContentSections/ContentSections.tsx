import React from 'react';
import styles from './ContentSections.module.scss';

type Section = { id: string; title: string; content?: React.ReactNode };

type Props = { sections: Section[] };

const ContentSections: React.FC<Props> = ({ sections }) => {
    return (
        <>
            {sections.map((s) => (
                <section id={s.id} key={s.id} className={styles.section}>
                    <h2>{s.title}</h2>
                    {s.content || (
                        <>
                            <p>
                                Nội dung minh họa cho phần "{s.title}". Thay thế bằng dữ liệu thật
                                khi tích hợp API hoặc CMS. Văn bản đủ dài để thấy hiệu ứng cuộn mượt
                                tới từng mục nội dung bên dưới. Một bài viết hữu ích, một video tư
                                vấn rõ ràng, hay thậm chí chỉ là vài dòng chia sẻ tâm huyết nếu được
                                đầu tư bằng chuyên môn và sự chân thành, đều có thể trở thành “sợi
                                dây” kết nối Bác sĩ với cộng đồng. Việc xây dựng những nội dung giá
                                trị không chỉ giúp lan tỏa kiến thức, mà còn kiến tạo hình ảnh một
                                người Bác sĩ biết lắng nghe, biết cho đi và nhận lại sự tin tưởng
                                bền lâu từ người bệnh.
                            </p>
                            <p>
                                Nội dung minh họa cho phần "{s.title}". Thay thế bằng dữ liệu thật
                                khi tích hợp API hoặc CMS. Văn bản đủ dài để thấy hiệu ứng cuộn mượt
                                tới từng mục nội dung bên dưới. Một bài viết hữu ích, một video tư
                                vấn rõ ràng, hay thậm chí chỉ là vài dòng chia sẻ tâm huyết nếu được
                                đầu tư bằng chuyên môn và sự chân thành, đều có thể trở thành “sợi
                                dây” kết nối Bác sĩ với cộng đồng. Việc xây dựng những nội dung giá
                                trị không chỉ giúp lan tỏa kiến thức, mà còn kiến tạo hình ảnh một
                                người Bác sĩ biết lắng nghe, biết cho đi và nhận lại sự tin tưởng
                                bền lâu từ người bệnh.
                            </p>
                            <p>
                                Nội dung minh họa cho phần "{s.title}". Thay thế bằng dữ liệu thật
                                khi tích hợp API hoặc CMS. Văn bản đủ dài để thấy hiệu ứng cuộn mượt
                                tới từng mục nội dung bên dưới. Một bài viết hữu ích, một video tư
                                vấn rõ ràng, hay thậm chí chỉ là vài dòng chia sẻ tâm huyết nếu được
                                đầu tư bằng chuyên môn và sự chân thành, đều có thể trở thành “sợi
                                dây” kết nối Bác sĩ với cộng đồng. Việc xây dựng những nội dung giá
                                trị không chỉ giúp lan tỏa kiến thức, mà còn kiến tạo hình ảnh một
                                người Bác sĩ biết lắng nghe, biết cho đi và nhận lại sự tin tưởng
                                bền lâu từ người bệnh.
                            </p>
                        </>
                    )}
                </section>
            ))}
        </>
    );
};

export default ContentSections;
