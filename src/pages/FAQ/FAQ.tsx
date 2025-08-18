import React, { useState, useMemo } from 'react';
import styles from './FAQ.module.scss';
import MainLayout from '~/layouts/MainLayout';
import Breadcrumb from '~/components/Breadcrumb';

interface Question {
    id: string;
    question: string;
    answer: string;
}

interface FAQCategory {
    id: string;
    title: string;
    questions: Question[];
}

const faqData: FAQCategory[] = [
    {
        id: 'health-records',
        title: 'Hồ sơ sức khỏe',
        questions: [
            {
                id: 'hr-1',
                question: 'Làm thế nào để tạo hồ sơ sức khỏe trực tuyến?',
                answer: 'Bạn có thể tạo hồ sơ sức khỏe bằng cách đăng ký tài khoản trên website của chúng tôi, sau đó điền đầy đủ thông tin cá nhân và tiền sử bệnh của bạn trong phần "Hồ sơ sức khỏe".',
            },
            {
                id: 'hr-2',
                question: 'Thông tin hồ sơ sức khỏe có được bảo mật không?',
                answer: 'Chúng tôi cam kết bảo mật tuyệt đối thông tin hồ sơ sức khỏe của bạn. Tất cả dữ liệu được mã hóa và chỉ được chia sẻ với bác sĩ khi có sự đồng ý của bạn.',
            },
            {
                id: 'hr-3',
                question: 'Tôi có thể cập nhật thông tin hồ sơ sức khỏe không?',
                answer: 'Có, bạn có thể cập nhật thông tin hồ sơ sức khỏe bất cứ lúc nào bằng cách đăng nhập và truy cập vào phần "Hồ sơ của tôi".',
            },
        ],
    },
    {
        id: 'appointments',
        title: 'Đặt lịch khám',
        questions: [
            {
                id: 'ap-1',
                question: 'Làm thế nào để đặt lịch khám bệnh?',
                answer: 'Bạn có thể đặt lịch khám bằng cách chọn chuyên khoa, bác sĩ, thời gian phù hợp trong phần "Đặt lịch khám". Sau đó xác nhận và thanh toán để hoàn tất việc đặt lịch.',
            },
            {
                id: 'ap-2',
                question: 'Tôi có thể hủy hoặc thay đổi lịch hẹn không?',
                answer: 'Có, bạn có thể hủy hoặc thay đổi lịch hẹn trước ít nhất 2 tiếng so với giờ khám. Truy cập "Lịch hẹn của tôi" để thực hiện thay đổi.',
            },
            {
                id: 'ap-3',
                question: 'Có thể đặt lịch khám cho người thân không?',
                answer: 'Có thể, bạn có thể thêm thông tin người thân vào tài khoản của mình và đặt lịch khám cho họ. Cần cung cấp đầy đủ thông tin cá nhân của người được khám.',
            },
        ],
    },
    {
        id: 'payment',
        title: 'Thanh toán',
        questions: [
            {
                id: 'py-1',
                question: 'Các hình thức thanh toán được hỗ trợ?',
                answer: 'Chúng tôi hỗ trợ thanh toán qua thẻ ATM, thẻ tín dụng, ví điện tử (MoMo, ZaloPay, VNPay) và thanh toán trực tiếp tại phòng khám.',
            },
            {
                id: 'py-2',
                question: 'Thông tin thanh toán có an toàn không?',
                answer: 'Tất cả thông tin thanh toán được mã hóa và xử lý thông qua các cổng thanh toán được chứng nhận PCI DSS, đảm bảo an toàn tuyệt đối.',
            },
            {
                id: 'py-3',
                question: 'Tôi có nhận được hóa đơn sau khi thanh toán không?',
                answer: 'Có, bạn sẽ nhận được hóa đơn điện tử ngay sau khi thanh toán thành công qua email và có thể tải xuống trong tài khoản của mình.',
            },
        ],
    },
    {
        id: 'telemedicine',
        title: 'Khám bệnh từ xa',
        questions: [
            {
                id: 'tm-1',
                question: 'Khám bệnh từ xa hoạt động như thế nào?',
                answer: 'Khám bệnh từ xa được thực hiện qua video call với bác sĩ. Bạn cần chuẩn bị thiết bị có camera và microphone, kết nối internet ổn định.',
            },
            {
                id: 'tm-2',
                question: 'Những trường hợp nào phù hợp với khám từ xa?',
                answer: 'Khám từ xa phù hợp với tư vấn sức khỏe, theo dõi bệnh mãn tính, tái khám, và các vấn đề sức khỏe không cần thăm khám thực tế.',
            },
            {
                id: 'tm-3',
                question: 'Có thể kê đơn thuốc qua khám từ xa không?',
                answer: 'Có, bác sĩ có thể kê đơn thuốc điện tử sau khi khám từ xa. Đơn thuốc sẽ được gửi đến nhà thuốc đối tác để bạn mua thuốc.',
            },
        ],
    },
    {
        id: 'support',
        title: 'Hỗ trợ khách hàng',
        questions: [
            {
                id: 'sp-1',
                question: 'Làm thế nào để liên hệ hỗ trợ khách hàng?',
                answer: 'Bạn có thể liên hệ qua hotline 1900-xxxx, email support@hospital.vn hoặc chat trực tuyến trên website. Chúng tôi hỗ trợ 24/7.',
            },
            {
                id: 'sp-2',
                question: 'Thời gian phản hồi của bộ phận hỗ trợ?',
                answer: 'Chúng tôi cam kết phản hồi trong vòng 15 phút qua chat trực tuyến, 1 giờ qua email và tư vấn ngay lập tức qua hotline.',
            },
            {
                id: 'sp-3',
                question: 'Có thể khiếu nại về chất lượng dịch vụ không?',
                answer: 'Có, mọi khiếu nại về chất lượng dịch vụ sẽ được xử lý nghiêm túc. Bạn có thể gửi khiếu nại qua email hoặc form trên website.',
            },
        ],
    },
];

const FAQ: React.FC = () => {
    const [openCategory, setOpenCategory] = useState<string | null>(null);
    const [openQuestion, setOpenQuestion] = useState<string | null>(null);

    const leftCategories = useMemo(() => faqData.slice(0, Math.ceil(faqData.length / 2)), []);
    const rightCategories = useMemo(() => faqData.slice(Math.ceil(faqData.length / 2)), []);

    const breadcrumbData = {
        items: [
            { label: '', path: '/', isActive: false },
            { label: 'Hỏi đáp', isActive: true },
        ],
        title: 'Câu hỏi thường gặp',
    };

    const toggleCategory = (categoryId: string) => {
        if (openCategory === categoryId) {
            setOpenCategory(null);
            setOpenQuestion(null);
        } else {
            setOpenCategory(categoryId);
            setOpenQuestion(null);
        }
    };

    const toggleQuestion = (questionId: string) => {
        setOpenQuestion((prev) => (prev === questionId ? null : questionId));
    };

    const renderQuestion = (q: Question) => {
        const isOpen = openQuestion === q.id;
        const headingId = `q-head-${q.id}`;
        const panelId = `q-panel-${q.id}`;
        return (
            <div className="accordion-item" key={q.id}>
                <h2 className="accordion-header" id={headingId}>
                    <a
                        href="#"
                        className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={(e) => {
                            e.preventDefault();
                            toggleQuestion(q.id);
                        }}
                    >
                        {q.question}
                    </a>
                </h2>
                <div
                    id={panelId}
                    className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
                    aria-labelledby={headingId}
                >
                    <div className="accordion-body">
                        <div className="accordion-content">
                            <p>{q.answer}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderCategory = (cat: FAQCategory) => {
        const isOpen = openCategory === cat.id;
        const headingId = `cat-head-${cat.id}`;
        const panelId = `cat-panel-${cat.id}`;
        return (
            <div className="accordion-item" key={cat.id}>
                <h2 className="accordion-header" id={headingId}>
                    <a
                        href="#"
                        className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={(e) => {
                            e.preventDefault();
                            toggleCategory(cat.id);
                        }}
                    >
                        {cat.title}
                    </a>
                </h2>
                <div
                    id={panelId}
                    className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
                    aria-labelledby={headingId}
                >
                    <div className="accordion-body">
                        <div className="accordion" id={`q-accordion-${cat.id}`}>
                            {cat.questions.map(renderQuestion)}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <MainLayout>
            <Breadcrumb items={breadcrumbData.items} title={breadcrumbData.title} />

            <section className={`${styles.faq} faq-inner-page`}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="section-inner-header text-center">
                                <h3>
                                    Tìm hiểu thêm về các dịch vụ y tế của chúng tôi thông qua những
                                    câu hỏi phổ biến nhất
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <div className="faq-info faq-inner-info">
                                <div className="accordion" id="faq-left">
                                    {leftCategories.map(renderCategory)}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <div className="faq-info faq-inner-info">
                                <div className="accordion" id="faq-right">
                                    {rightCategories.map(renderCategory)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="row">
                        <div className="col-12">
                            <div className={styles['contact-section']}>
                                <h3>Không tìm thấy câu trả lời?</h3>
                                <p>
                                    Đội ngũ hỗ trợ khách hàng của chúng tôi luôn sẵn sàng giúp đỡ
                                    bạn 24/7
                                </p>
                                <div className={styles['btn-group']}>
                                    <a href="#" className="btn btn-primary">
                                        Chat trực tuyến
                                    </a>
                                    <a href="tel:1900-xxxx" className="btn btn-outline-primary">
                                        Gọi hotline: 1900-xxxx
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
};

export default FAQ;
