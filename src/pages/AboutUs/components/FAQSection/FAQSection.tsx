import React, { useEffect, useRef, useState } from 'react';
import './FAQSection.module.scss';
import faqImg from '@/assets/img/faq-img.png';
import smilingIcon from '@/assets/img/icons/smiling-icon.svg';

interface CountUpOnViewProps {
    end: number;
    duration?: number; // ms
    className?: string;
}

const CountUpOnView: React.FC<CountUpOnViewProps> = ({ end, duration = 1500, className }) => {
    const [value, setValue] = useState<number>(0);
    const [started, setStarted] = useState<boolean>(false);
    const ref = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !started) setStarted(true);
                });
            },
            { threshold: 0.3 }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started) return;
        let af: number;
        const t0 = performance.now();
        const animate = (t: number) => {
            const p = Math.min((t - t0) / duration, 1);
            setValue(Math.round(p * end));
            if (p < 1) af = requestAnimationFrame(animate);
        };
        af = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(af);
    }, [started, end, duration]);

    return (
        <span ref={ref} className={className} aria-label={`count to ${end}`}>
            {value}
        </span>
    );
};

const items = [
    {
        id: 'one',
        q: 'Làm thế nào để đặt lịch khám?',
        a: 'Bạn có thể đăng nhập hoặc tạo tài khoản, tìm bác sĩ theo chuyên khoa, khu vực hoặc thời gian trống và xác nhận đặt lịch.',
    },
    {
        id: 'two',
        q: 'Tôi có thể đặt lịch khám trực tuyến không?',
        a: 'Có. Chỉ cần truy cập hệ thống, chọn bác sĩ/phòng khám phù hợp và hoàn tất đặt lịch trong vài bước.',
    },
    {
        id: 'three',
        q: 'Thông tin cá nhân của tôi có được bảo mật không?',
        a: 'Tất cả dữ liệu đều được mã hóa và chỉ chia sẻ với bác sĩ khi có sự đồng ý của bạn.',
    },
    {
        id: 'four',
        q: 'Tôi có thể hủy hoặc dời lịch hẹn không?',
        a: 'Bạn có thể hủy hoặc đổi lịch trước giờ khám theo chính sách của phòng khám/bác sĩ.',
    },
    {
        id: 'five',
        q: 'Làm sao để tìm đúng bác sĩ/chuyên gia phù hợp?',
        a: 'Bạn có thể lọc theo chuyên khoa, vị trí, thời gian rảnh, đánh giá và chi phí để chọn bác sĩ phù hợp.',
    },
];

const FAQSection: React.FC = () => {
    const [openId, setOpenId] = useState<string>('one'); // first open by default

    const toggle = (id: string) => setOpenId((prev) => (prev === id ? '' : id));

    return (
        <section className="faq-section faq-section-inner">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="section-inner-header text-center">
                            <h6>Giải đáp thắc mắc</h6>
                            <h2>Câu hỏi thường gặp</h2>
                        </div>
                    </div>
                </div>
                <div className="row align-items-center">
                    <div className="col-lg-6 col-md-12">
                        <div className="faq-img">
                            <img src={faqImg} className="img-fluid" alt="img" />
                            <div className="faq-patients-count">
                                <div className="faq-smile-img">
                                    <img src={smilingIcon} alt="icon" />
                                </div>
                                <div className="faq-patients-content">
                                    <h4>
                                        <CountUpOnView className="count-digit" end={95} />
                                        k+
                                    </h4>
                                    <p>Khách hàng hài lòng</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12">
                        <div className="faq-info">
                            <div className="accordion" id="accordionExample">
                                {items.map((it) => {
                                    const isOpen = openId === it.id;
                                    const headingId = `heading-${it.id}`;
                                    const panelId = `panel-${it.id}`;
                                    return (
                                        <div className="accordion-item" key={it.id}>
                                            <h2 className="accordion-header" id={headingId}>
                                                <button
                                                    type="button"
                                                    className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
                                                    aria-expanded={isOpen}
                                                    aria-controls={panelId}
                                                    onClick={() => toggle(it.id)}
                                                >
                                                    {it.q}
                                                </button>
                                            </h2>
                                            <div
                                                id={panelId}
                                                className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
                                                aria-labelledby={headingId}
                                            >
                                                <div className="accordion-body">
                                                    <div className="accordion-content">
                                                        <p>{it.a}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
