import React, { useState } from 'react';
import styles from './TabAccordion.module.scss';

const TabAccordion: React.FC = () => {
    const [active, setActive] = useState<'disclaimer' | 'refs' | 'feedback'>('disclaimer');

    return (
        <section className={styles.postActions} aria-label="Thông tin bổ sung bài viết">
            <div>
                <div className={styles.tabs}>
                    <div className={styles.tabList} role="tablist" aria-label="Bổ sung bài viết">
                        <button
                            type="button"
                            className={`${styles.tabItem} ${active === 'disclaimer' ? styles.activeTab : ''}`}
                            onClick={() => setActive('disclaimer')}
                            role="tab"
                            aria-selected={active === 'disclaimer'}
                        >
                            Miễn trừ trách nhiệm
                        </button>
                    </div>

                    <div className={styles.tabPanel} role="tabpanel">
                        {active === 'disclaimer' && (
                            <div className={styles.disclaimerBox}>
                                Nội dung bài viết chỉ mang tính chất tham khảo, không thay thế cho
                                việc chẩn đoán và điều trị y khoa.
                            </div>
                        )}
                        {active === 'refs' && (
                            <section aria-label="Nguồn tham khảo">
                                <div>
                                    <div className={styles.sourceInfoBox}>
                                        Trang tin y tế YouMed chỉ sử dụng các nguồn tham khảo có độ
                                        uy tín cao, các tổ chức y dược, học thuật chính thống, tài
                                        liệu từ các cơ quan chính phủ để hỗ trợ các thông tin trong
                                        bài viết của chúng tôi. Tìm hiểu về{' '}
                                        <a href="#" className={styles.link}>
                                            Quy trình biên tập
                                        </a>{' '}
                                        để hiểu rõ hơn cách chúng tôi đảm bảo nội dung luôn chính
                                        xác, minh bạch và tin cậy.
                                    </div>
                                    <ol className={styles.referenceList}>
                                        <li>
                                            Đỗ Tất Lợi (2004). Những cây thuốc và vị thuốc Việt Nam.
                                            NXB Y học. Trang 271 – 272.
                                            <br />
                                            <a
                                                href="https://youmed.vn/tin-tuc/wp-content/uploads/2022/04/nhung-cay-thuoc-va-vi-thuoc-viet-nam-2006.pdf#page=287"
                                                className={styles.link}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                https://youmed.vn/tin-tuc/wp-content/uploads/2022/04/nhung-cay-thuoc-va-vi-thuoc-viet-nam-2006.pdf#page=287
                                            </a>
                                        </li>
                                        <li>
                                            Viện dược liệu (2004). Cây thuốc và động vật làm thuốc ở
                                            Việt Nam tập 2. NXB Khoa học và kỹ thuật. Trang 577 –
                                            579.
                                            <br />
                                            <a
                                                href="https://youmed.vn/tin-tuc/wp-content/uploads/docs/cay-thuoc-va-dong-vat-lam-thuoc-o-viet-nam-tap2.pdf#page=575"
                                                className={styles.link}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                https://youmed.vn/tin-tuc/wp-content/uploads/docs/cay-thuoc-va-dong-vat-lam-thuoc-o-viet-nam-tap2.pdf#page=575
                                            </a>
                                        </li>
                                        <li>
                                            Assessment report on Polygonum aviculare L., herba
                                            <br />
                                            <a
                                                href="https://www.ema.europa.eu/en/documents/herbal-report/final-assessment-report-polygonum-aviculare-l-herba_en.pdf"
                                                className={styles.link}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                https://www.ema.europa.eu/en/documents/herbal-report/final-assessment-report-polygonum-aviculare-l-herba_en.pdf
                                            </a>
                                        </li>
                                    </ol>
                                    <div className={styles.referenceDate}>
                                        Ngày tham khảo: 16/10/2022
                                    </div>
                                </div>
                            </section>
                        )}
                        {active === 'feedback' && (
                            <div className={styles.feedbackBox}>
                                Nếu bạn có góp ý để cải thiện nội dung bài viết, vui lòng gửi phản
                                hồi cho chúng tôi qua{' '}
                                <a href="#" className={styles.link}>
                                    biểu mẫu góp ý
                                </a>
                                .
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TabAccordion;
