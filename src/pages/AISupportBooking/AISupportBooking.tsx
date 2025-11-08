import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import ChatSidebar from './components/ChatSidebar';
import ChatArea from './components/ChatArea';
import styles from './AISupportBooking.module.scss';
import { Message, ChatHistory, Doctor, Hospital, Suggestion } from './types';
import { PATHS } from '@/routes/paths';

const AISupportBooking: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatHistories, setChatHistories] = useState<ChatHistory[]>([
        {
            id: '1',
            title: 'Tư vấn đau đầu',
            lastMessage: 'Tôi bị đau đầu thường xuyên...',
            lastMessageTime: '2 giờ trước',
            avatar: '',
        },
        {
            id: '2',
            title: 'Tìm bác sĩ tim mạch',
            lastMessage: 'Bạn có thể tìm bác sĩ chuyên khoa tim mạch...',
            lastMessageTime: '1 ngày trước',
            avatar: '',
        },
    ]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [isAITyping, setIsAITyping] = useState(false);
    const [pendingSymptom, setPendingSymptom] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        // Mặc định mở trên desktop, đóng trên mobile
        if (typeof window !== 'undefined') {
            return window.innerWidth > 768;
        }
        return true;
    });

    // Kiểm tra xem message có phải là câu trả lời đồng ý không
    const isAffirmativeResponse = (message: string): boolean => {
        const lowerMessage = message.toLowerCase().trim();
        const affirmativeKeywords = [
            'có',
            'yes',
            'đồng ý',
            'ok',
            'okay',
            'được',
            'muốn',
            'vâng',
            'dạ',
        ];
        return affirmativeKeywords.some((keyword) => lowerMessage.includes(keyword));
    };

    // Lấy thông tin về triệu chứng (mock data)
    const getSymptomInfo = (symptom: string): string => {
        const lowerSymptom = symptom.toLowerCase();

        if (lowerSymptom.includes('đau bụng')) {
            return `Đau bụng có thể xuất hiện ở bất cứ vị trí nào giữa ngực và vùng bẹn, với nhiều kiểu như đau nhói từng cơn, đau quặn, đau nhẹ,... Cường độ và tần suất đau không phản ánh chính xác mức độ nguy hiểm của nguyên nhân gây đau bụng. Đau bụng có thể do các vấn đề về đường tiêu hóa hoặc là triệu chứng của bệnh lý khác, từ nhẹ đến nguy hiểm, thậm chí có thể đe dọa tính mạng nếu không được xử lý kịp thời.\n\nMột số nguyên nhân đau bụng cấp bao gồm: viêm ruột thừa, viêm túi mật, viêm bàng quang, viêm túi thừa, viêm tá tràng, thai ngoài tử cung, tắc ruột, nhiễm trùng thận, sỏi thận, viêm tụy, viêm phổi, nhiễm trùng đường tiểu, viêm dạ dày ruột do siêu vi,... Một số trường hợp đau bụng cấp có thể tự khỏi, nhưng cũng có trường hợp cần cấp cứu.`;
        }

        // Có thể thêm các triệu chứng khác ở đây
        return `Tôi hiểu bạn đang gặp vấn đề về "${symptom}". Đây là một triệu chứng cần được quan tâm và đánh giá đúng cách.`;
    };

    // Tạo danh sách bác sĩ và bệnh viện dựa trên triệu chứng
    const getDoctorHospitalList = (
        symptom: string
    ): { text: string; suggestions: Suggestion[] } => {
        const lowerSymptom = symptom.toLowerCase();

        if (lowerSymptom.includes('đau đầu') || lowerSymptom.includes('nhức đầu')) {
            const text = `Dựa trên triệu chứng của bạn, tôi gợi ý các bác sĩ và bệnh viện sau:\n\nBác sĩ Nguyễn Văn A\n\nNơi công tác: Bệnh viện Bạch Mai\nĐịa chỉ nơi công tác: 78 Giải Phóng, Phương Mai, Đống Đa, Hà Nội\nSố năm kinh nghiệm: 15 năm\nThế mạnh chuyên môn: Khám và điều trị các bệnh lý thần kinh, đau đầu, đau nửa đầu, rối loạn giấc ngủ, động kinh...\n\nBác sĩ Trần Thị B\n\nNơi công tác: Bệnh viện Việt Đức\nĐịa chỉ nơi công tác: 16 Phủ Doãn, Phường Hàng Bông, Quận Hoàn Kiếm, Hà Nội\nSố năm kinh nghiệm: 20 năm\nThế mạnh chuyên môn: Khám và điều trị đau đầu mãn tính, đau đầu căng thẳng, đau đầu do stress, các bệnh lý thần kinh...\n\nBác sĩ Lê Văn C\n\nNơi công tác: Bệnh viện Đại học Y Hà Nội\nĐịa chỉ nơi công tác: 1 Tôn Thất Tùng, Trung Tự, Đống Đa, Hà Nội\nSố năm kinh nghiệm: 18 năm\nThế mạnh chuyên môn: Chuyên khoa thần kinh, điều trị đau đầu, đau nửa đầu, rối loạn thần kinh thực vật...\n\nBác sĩ Phạm Thị D\n\nNơi công tác: Phòng khám Đa khoa Quốc tế Vinmec\nĐịa chỉ nơi công tác: 458 Minh Khai, Vĩnh Tuy, Hai Bà Trưng, Hà Nội\nSố năm kinh nghiệm: 25 năm\nThế mạnh chuyên môn: Khám và điều trị các bệnh lý thần kinh phức tạp, đau đầu mãn tính, đau đầu do nguyên nhân hiếm gặp...\n\nBác sĩ Hoàng Văn E\n\nNơi công tác: Bệnh viện Chợ Rẫy\nĐịa chỉ nơi công tác: 201B Nguyễn Chí Thanh, Phường 12, Quận 5, TP. Hồ Chí Minh\nSố năm kinh nghiệm: 22 năm\nThế mạnh chuyên môn: Chuyên điều trị đau đầu, đau nửa đầu, các bệnh lý mạch máu não, tai biến mạch máu não...\n\nBệnh viện chuyên về đau đầu:\n\nBệnh viện Bạch Mai\n\nĐịa chỉ: 78 Giải Phóng, Phương Mai, Đống Đa, Hà Nội\nThông tin giới thiệu chung: Bệnh viện tuyến Trung ương hàng đầu, có khoa Thần kinh uy tín, đội ngũ bác sĩ giàu kinh nghiệm, trang thiết bị hiện đại...\nThế mạnh chuyên môn: Khám, điều trị các bệnh lý thần kinh, đau đầu, đau nửa đầu, động kinh, rối loạn giấc ngủ, các bệnh lý mạch máu não...\n\nBệnh viện Việt Đức\n\nĐịa chỉ: 16 Phủ Doãn, Phường Hàng Bông, Quận Hoàn Kiếm, Hà Nội\nThông tin giới thiệu chung: Bệnh viện tuyến Trung ương, uy tín về ngoại khoa thần kinh, có đội ngũ bác sĩ đầu ngành, hỗ trợ đặt khám trực tuyến...\nThế mạnh chuyên môn: Khám, điều trị, phẫu thuật các bệnh lý thần kinh, đau đầu, u não, các bệnh lý cột sống, chấn thương sọ não...\n\nBệnh viện Đại học Y Hà Nội\n\nĐịa chỉ: 1 Tôn Thất Tùng, Trung Tự, Đống Đa, Hà Nội\nThông tin giới thiệu chung: Bệnh viện đại học, có khoa Thần kinh với đội ngũ giáo sư, tiến sĩ, bác sĩ giàu kinh nghiệm, trang thiết bị hiện đại...\nThế mạnh chuyên môn: Khám và điều trị các bệnh lý thần kinh, đau đầu, đau nửa đầu, rối loạn thần kinh thực vật, các bệnh lý thần kinh ngoại biên...\n\nPhòng khám Đa khoa Quốc tế Vinmec\n\nĐịa chỉ: 458 Minh Khai, Vĩnh Tuy, Hai Bà Trưng, Hà Nội\nThông tin giới thiệu chung: Hệ thống y tế tư nhân hàng đầu, có khoa Thần kinh với đội ngũ bác sĩ quốc tế, trang thiết bị hiện đại nhất...\nThế mạnh chuyên môn: Khám và điều trị các bệnh lý thần kinh, đau đầu, đau nửa đầu, rối loạn giấc ngủ, các bệnh lý thần kinh phức tạp...\n\nBệnh viện Chợ Rẫy\n\nĐịa chỉ: 201B Nguyễn Chí Thanh, Phường 12, Quận 5, TP. Hồ Chí Minh\nThông tin giới thiệu chung: Bệnh viện tuyến Trung ương lớn nhất miền Nam, có khoa Thần kinh uy tín, đội ngũ bác sĩ giàu kinh nghiệm...\nThế mạnh chuyên môn: Khám, điều trị các bệnh lý thần kinh, đau đầu, đau nửa đầu, các bệnh lý mạch máu não, tai biến mạch máu não, u não...`;

            const doctors: Doctor[] = [
                {
                    id: 'doc-1',
                    name: 'BS. Nguyễn Văn A',
                    specialtyName: 'Thần kinh',
                    hospitalName: 'Bệnh viện Bạch Mai',
                    rating: 4.8,
                    yearOfExperience: 15,
                    serviceTypeName: 'Khám chuyên khoa',
                    price: '500.000 VNĐ',
                },
                {
                    id: 'doc-2',
                    name: 'BS. Trần Thị B',
                    specialtyName: 'Thần kinh',
                    hospitalName: 'Bệnh viện Việt Đức',
                    rating: 4.9,
                    yearOfExperience: 20,
                    serviceTypeName: 'Khám chuyên khoa',
                    price: '600.000 VNĐ',
                },
                {
                    id: 'doc-3',
                    name: 'BS. Lê Văn C',
                    specialtyName: 'Thần kinh',
                    hospitalName: 'Bệnh viện Đại học Y Hà Nội',
                    rating: 4.7,
                    yearOfExperience: 18,
                    serviceTypeName: 'Khám chuyên khoa',
                    price: '550.000 VNĐ',
                },
                {
                    id: 'doc-4',
                    name: 'BS. Phạm Thị D',
                    specialtyName: 'Thần kinh',
                    hospitalName: 'Phòng khám Đa khoa Quốc tế Vinmec',
                    rating: 4.9,
                    yearOfExperience: 25,
                    serviceTypeName: 'Khám VIP',
                    price: '1.200.000 VNĐ',
                },
                {
                    id: 'doc-5',
                    name: 'BS. Hoàng Văn E',
                    specialtyName: 'Thần kinh',
                    hospitalName: 'Bệnh viện Chợ Rẫy',
                    rating: 4.8,
                    yearOfExperience: 22,
                    serviceTypeName: 'Khám chuyên khoa',
                    price: '500.000 VNĐ',
                },
            ];

            const hospitals: Hospital[] = [
                {
                    id: 'hosp-1',
                    name: 'Bệnh viện Bạch Mai',
                    address: '78 Giải Phóng, Phương Mai, Đống Đa, Hà Nội',
                    specialtyId: ['spec-1', 'spec-2', 'spec-3', 'spec-4', 'spec-5'],
                    specialtyName: [
                        'Thần kinh',
                        'Đau đầu',
                        'Đau nửa đầu',
                        'Động kinh',
                        'Rối loạn giấc ngủ',
                    ],
                },
                {
                    id: 'hosp-2',
                    name: 'Bệnh viện Việt Đức',
                    address: '16 Phủ Doãn, Phường Hàng Bông, Quận Hoàn Kiếm, Hà Nội',
                    specialtyId: ['spec-1', 'spec-2', 'spec-3'],
                    specialtyName: ['Thần kinh', 'Ngoại khoa thần kinh', 'Đau đầu'],
                },
                {
                    id: 'hosp-3',
                    name: 'Bệnh viện Đại học Y Hà Nội',
                    address: '1 Tôn Thất Tùng, Trung Tự, Đống Đa, Hà Nội',
                    specialtyId: ['spec-1', 'spec-2', 'spec-3', 'spec-4'],
                    specialtyName: [
                        'Thần kinh',
                        'Đau đầu',
                        'Rối loạn thần kinh',
                        'Thần kinh ngoại biên',
                    ],
                },
                {
                    id: 'hosp-4',
                    name: 'Phòng khám Đa khoa Quốc tế Vinmec',
                    address: '458 Minh Khai, Vĩnh Tuy, Hai Bà Trưng, Hà Nội',
                    specialtyId: ['spec-1', 'spec-2', 'spec-3'],
                    specialtyName: ['Thần kinh', 'Đau đầu', 'Rối loạn giấc ngủ'],
                },
                {
                    id: 'hosp-5',
                    name: 'Bệnh viện Chợ Rẫy',
                    address: '201B Nguyễn Chí Thanh, Phường 12, Quận 5, TP. Hồ Chí Minh',
                    specialtyId: ['spec-1', 'spec-2', 'spec-3', 'spec-4', 'spec-5', 'spec-6'],
                    specialtyName: [
                        'Thần kinh',
                        'Đau đầu',
                        'Mạch máu não',
                        'Tai biến mạch máu não',
                        'U não',
                        'Chấn thương sọ não',
                    ],
                },
            ];

            const suggestions: Suggestion[] = [
                ...doctors.map((doctor) => ({ type: 'doctor' as const, doctor })),
                ...hospitals.map((hospital) => ({ type: 'hospital' as const, hospital })),
            ];

            return { text, suggestions };
        }

        if (lowerSymptom.includes('đau bụng')) {
            const text = `Dựa trên triệu chứng của bạn, tôi gợi ý các bác sĩ và bệnh viện sau:\n\nBác sĩ Thái Văn Thành\n\nNơi công tác: Phòng khám Đa khoa Quốc tế Việt HealthCare\nĐịa chỉ nơi công tác: 16-18 Lý Thường Kiệt, Phường 07, Quận 10, TP. Hồ Chí Minh\nSố năm kinh nghiệm: 20 năm\nThế mạnh chuyên môn: Khám và điều trị các bệnh lý chuyên khoa Nội thận và Nội tiêu hóa như viêm loét dạ dày (đau bụng, nôn ói, đầy bụng), viêm đại tràng, viêm ruột, hội chứng ruột kích thích, rối loạn tiêu hóa, đau bụng chưa rõ nguyên nhân, nội soi tiêu hóa...\n\nBác sĩ Trần Ngọc An\n\nNơi công tác: Phòng khám Bệnh viện Đại học Y Dược 1\nĐịa chỉ nơi công tác: 20-22 Dương Quang Trung, Phường 12, Quận 10, Tp. HCM\nSố năm kinh nghiệm: 29 năm\nThế mạnh chuyên môn: Khám và điều trị các vấn đề đau bụng liên quan đến sản phụ khoa, chăm sóc thai kỳ, viêm nhiễm đường sinh dục...\n\nBác sĩ Chuyên khoa I Phạm Thị Nhài\n\nNơi công tác: Phòng khám Đa khoa Quốc tế Thu Cúc cơ sở Trần Duy Hưng\nĐịa chỉ nơi công tác: 216 Trần Duy Hưng, Cầu Giấy, Hà Nội\nSố năm kinh nghiệm: 32 năm\nThế mạnh chuyên môn: Khám và điều trị các vấn đề đau bụng kinh, rối loạn kinh nguyệt, các bệnh lý phụ khoa phức tạp...\n\nBác sĩ Nguyễn Văn Minh\n\nNơi công tác: Bệnh viện Bạch Mai\nĐịa chỉ nơi công tác: 78 Giải Phóng, Phương Mai, Đống Đa, Hà Nội\nSố năm kinh nghiệm: 18 năm\nThế mạnh chuyên môn: Khám và điều trị các bệnh lý tiêu hóa, đau bụng, viêm dạ dày, viêm đại tràng, rối loạn tiêu hóa, nội soi tiêu hóa...\n\nBác sĩ Lê Thị Hương\n\nNơi công tác: Bệnh viện Chợ Rẫy\nĐịa chỉ nơi công tác: 201B Nguyễn Chí Thanh, Phường 12, Quận 5, TP. Hồ Chí Minh\nSố năm kinh nghiệm: 25 năm\nThế mạnh chuyên môn: Chuyên điều trị các bệnh lý tiêu hóa phức tạp, đau bụng mãn tính, viêm loét dạ dày tá tràng, các bệnh lý gan mật...\n\nBệnh viện chuyên về đau bụng:\n\nBệnh viện Hữu nghị Việt Đức\n\nĐịa chỉ: Nhà H, Tầng 1, số 16 Phủ Doãn, Phường Hàng Bông, Quận Hoàn Kiếm, Hà Nội\nThông tin giới thiệu chung: Bệnh viện tuyến Trung ương, uy tín hàng đầu về ngoại khoa, có đội ngũ bác sĩ giàu kinh nghiệm, hỗ trợ đặt khám trực tuyến, giảm thời gian chờ đợi...\nThế mạnh chuyên môn: Khám, điều trị, phẫu thuật các bệnh lý tiêu hóa, nội soi tiêu hóa, các bệnh lý đau bụng, viêm đại tràng, viêm ruột, bệnh lý hậu môn trực tràng...\n\nPhòng khám Bệnh viện Đại học Y Dược 1\n\nĐịa chỉ: 20-22 Dương Quang Trung, Phường 12, Quận 10, Tp. HCM\nThông tin giới thiệu chung: Phòng khám đa khoa, thuộc hệ thống Bệnh viện Đại học Y Dược TP.HCM, đội ngũ bác sĩ giàu kinh nghiệm, trang thiết bị hiện đại...\nThế mạnh chuyên môn: Khám nội tiêu hóa, viêm gan, tiêu hóa, nội soi tiêu hóa, các bệnh lý đau bụng, rối loạn tiêu hóa...\n\nBệnh viện Ung bướu Hưng Việt\n\nĐịa chỉ: 34 và 40 Đại Cồ Việt, Hai Bà Trưng, Hà Nội\nThông tin giới thiệu chung: Bệnh viện chuyên khoa ung bướu, đội ngũ bác sĩ đầu ngành, trang thiết bị hiện đại, hỗ trợ đặt lịch khám trực tuyến...\nThế mạnh chuyên môn: Khám, điều trị các bệnh lý tiêu hóa, nội soi tiêu hóa, đau bụng, các bệnh lý ung bướu tiêu hóa...\n\nBệnh viện Bạch Mai\n\nĐịa chỉ: 78 Giải Phóng, Phương Mai, Đống Đa, Hà Nội\nThông tin giới thiệu chung: Bệnh viện tuyến Trung ương hàng đầu, có khoa Tiêu hóa uy tín, đội ngũ bác sĩ giàu kinh nghiệm, trang thiết bị hiện đại...\nThế mạnh chuyên môn: Khám, điều trị các bệnh lý tiêu hóa, nội soi tiêu hóa, đau bụng, viêm dạ dày, viêm đại tràng, các bệnh lý gan mật...\n\nBệnh viện Chợ Rẫy\n\nĐịa chỉ: 201B Nguyễn Chí Thanh, Phường 12, Quận 5, TP. Hồ Chí Minh\nThông tin giới thiệu chung: Bệnh viện tuyến Trung ương lớn nhất miền Nam, có khoa Tiêu hóa uy tín, đội ngũ bác sĩ giàu kinh nghiệm, trang thiết bị hiện đại...\nThế mạnh chuyên môn: Khám, điều trị các bệnh lý tiêu hóa, nội soi tiêu hóa, đau bụng, các bệnh lý gan mật, các bệnh lý tiêu hóa phức tạp...`;

            const doctors: Doctor[] = [
                {
                    id: 'doc-6',
                    name: 'BS. Thái Văn Thành',
                    specialtyName: 'Nội tiêu hóa',
                    hospitalName: 'Phòng khám Đa khoa Quốc tế Việt HealthCare',
                    rating: 4.8,
                    yearOfExperience: 20,
                    serviceTypeName: 'Khám chuyên khoa',
                    price: '600.000 VNĐ',
                },
                {
                    id: 'doc-7',
                    name: 'BS. Trần Ngọc An',
                    specialtyName: 'Sản phụ khoa',
                    hospitalName: 'Phòng khám Bệnh viện Đại học Y Dược 1',
                    rating: 4.9,
                    yearOfExperience: 29,
                    serviceTypeName: 'Khám chuyên khoa',
                    price: '550.000 VNĐ',
                },
                {
                    id: 'doc-8',
                    name: 'BS. Chuyên khoa I Phạm Thị Nhài',
                    specialtyName: 'Sản phụ khoa',
                    hospitalName: 'Phòng khám Đa khoa Quốc tế Thu Cúc',
                    rating: 4.7,
                    yearOfExperience: 32,
                    serviceTypeName: 'Khám VIP',
                    price: '1.000.000 VNĐ',
                },
                {
                    id: 'doc-9',
                    name: 'BS. Nguyễn Văn Minh',
                    specialtyName: 'Nội tiêu hóa',
                    hospitalName: 'Bệnh viện Bạch Mai',
                    rating: 4.8,
                    yearOfExperience: 18,
                    serviceTypeName: 'Khám chuyên khoa',
                    price: '500.000 VNĐ',
                },
                {
                    id: 'doc-10',
                    name: 'BS. Lê Thị Hương',
                    specialtyName: 'Nội tiêu hóa',
                    hospitalName: 'Bệnh viện Chợ Rẫy',
                    rating: 4.9,
                    yearOfExperience: 25,
                    serviceTypeName: 'Khám chuyên khoa',
                    price: '500.000 VNĐ',
                },
            ];

            const hospitals: Hospital[] = [
                {
                    id: 'hosp-6',
                    name: 'Bệnh viện Hữu nghị Việt Đức',
                    address:
                        'Nhà H, Tầng 1, số 16 Phủ Doãn, Phường Hàng Bông, Quận Hoàn Kiếm, Hà Nội',
                    specialtyId: ['spec-7', 'spec-8', 'spec-9'],
                    specialtyName: ['Tiêu hóa', 'Nội soi tiêu hóa', 'Đau bụng'],
                },
                {
                    id: 'hosp-7',
                    name: 'Phòng khám Bệnh viện Đại học Y Dược 1',
                    address: '20-22 Dương Quang Trung, Phường 12, Quận 10, Tp. HCM',
                    specialtyId: ['spec-10', 'spec-11', 'spec-12'],
                    specialtyName: ['Nội tiêu hóa', 'Nội soi tiêu hóa', 'Đau bụng'],
                },
                {
                    id: 'hosp-8',
                    name: 'Bệnh viện Ung bướu Hưng Việt',
                    address: '34 và 40 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
                    specialtyId: ['spec-13', 'spec-14', 'spec-15'],
                    specialtyName: ['Tiêu hóa', 'Nội soi tiêu hóa', 'Đau bụng'],
                },
                {
                    id: 'hosp-9',
                    name: 'Bệnh viện Bạch Mai',
                    address: '78 Giải Phóng, Phương Mai, Đống Đa, Hà Nội',
                    specialtyId: ['spec-16', 'spec-17', 'spec-18', 'spec-19', 'spec-20'],
                    specialtyName: [
                        'Nội tiêu hóa',
                        'Nội soi tiêu hóa',
                        'Đau bụng',
                        'Viêm dạ dày',
                        'Viêm đại tràng',
                    ],
                },
                {
                    id: 'hosp-10',
                    name: 'Bệnh viện Chợ Rẫy',
                    address: '201B Nguyễn Chí Thanh, Phường 12, Quận 5, TP. Hồ Chí Minh',
                    specialtyId: ['spec-21', 'spec-22', 'spec-23', 'spec-24'],
                    specialtyName: [
                        'Nội tiêu hóa',
                        'Nội soi tiêu hóa',
                        'Đau bụng',
                        'Bệnh lý gan mật',
                    ],
                },
            ];

            const suggestions: Suggestion[] = [
                ...doctors.map((doctor) => ({ type: 'doctor' as const, doctor })),
                ...hospitals.map((hospital) => ({ type: 'hospital' as const, hospital })),
            ];

            return { text, suggestions };
        }

        // Default response cho các triệu chứng khác
        return {
            text: `Dựa trên triệu chứng của bạn, tôi gợi ý các bác sĩ và bệnh viện sau:`,
            suggestions: [],
        };
    };

    // Mock AI response
    const generateAIResponse = (userMessage: string): Message => {
        // Kiểm tra xem có phải là câu trả lời đồng ý không
        if (isAffirmativeResponse(userMessage) && pendingSymptom) {
            const { text, suggestions } = getDoctorHospitalList(pendingSymptom);
            setPendingSymptom(null);
            return {
                id: Date.now().toString(),
                content: text,
                sender: 'ai',
                timestamp: new Date(),
                suggestions,
            };
        }

        // Nếu là mô tả triệu chứng mới
        const symptomInfo = getSymptomInfo(userMessage);
        const question = `\n\nBạn có muốn tôi hỗ trợ tìm kiếm bác sĩ hoặc bệnh viện chuyên về "${userMessage}" để đặt lịch khám không?`;

        setPendingSymptom(userMessage);

        return {
            id: Date.now().toString(),
            content: symptomInfo + question,
            sender: 'ai',
            timestamp: new Date(),
        };
    };

    const handleSendMessage = async (content: string) => {
        if (!content.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: content.trim(),
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);

        // Create new chat if no active chat
        if (!activeChatId) {
            const newChatId = Date.now().toString();
            const newChat: ChatHistory = {
                id: newChatId,
                title:
                    content.trim().length > 30
                        ? `${content.trim().substring(0, 30)}...`
                        : content.trim(),
                lastMessage: content.trim(),
                lastMessageTime: 'Vừa xong',
                avatar: '',
            };
            setChatHistories((prev) => [newChat, ...prev]);
            setActiveChatId(newChatId);
        }

        // Simulate AI typing
        setIsAITyping(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const aiResponse = generateAIResponse(content);
        setMessages((prev) => [...prev, aiResponse]);
        setIsAITyping(false);

        // Update chat history
        if (activeChatId) {
            setChatHistories((prev) =>
                prev.map((chat) =>
                    chat.id === activeChatId
                        ? {
                              ...chat,
                              lastMessage: content.trim(),
                              lastMessageTime: 'Vừa xong',
                          }
                        : chat
                )
            );
        }
    };

    const handleNewChat = () => {
        const newChatId = Date.now().toString();
        const newChat: ChatHistory = {
            id: newChatId,
            title: 'Cuộc trò chuyện mới',
            lastMessage: '',
            lastMessageTime: 'Vừa tạo',
            avatar: '',
        };
        setChatHistories((prev) => [newChat, ...prev]);
        setActiveChatId(newChatId);
        setMessages([]);
        setPendingSymptom(null);
    };

    const handleSelectChat = (chatId: string) => {
        setActiveChatId(chatId);
        // Load messages for this chat (mock)
        setMessages([]);
        setPendingSymptom(null);
    };

    const handleDeleteChat = (chatId: string) => {
        setChatHistories((prev) => {
            const remainingChats = prev.filter((chat) => chat.id !== chatId);
            // Nếu chat bị xóa là chat đang active, chuyển sang chat khác hoặc reset
            if (activeChatId === chatId) {
                if (remainingChats.length > 0) {
                    setActiveChatId(remainingChats[0].id);
                } else {
                    setActiveChatId(null);
                    setMessages([]);
                }
            }
            return remainingChats;
        });
    };

    const handleEditMessage = (messageId: string, newContent: string) => {
        setMessages((prev) =>
            prev.map((msg) => (msg.id === messageId ? { ...msg, content: newContent } : msg))
        );
    };

    return (
        <div className={styles.aiSupportBooking}>
            <Link to={PATHS.HOME} className={styles.homeButton}>
                <Home size={18} className={styles.homeIcon} />
                <span className={styles.homeText}>Trở về trang chủ</span>
            </Link>
            {/* Overlay khi sidebar mở trên mobile */}
            {isSidebarOpen && (
                <div className={styles.sidebarOverlay} onClick={() => setIsSidebarOpen(false)} />
            )}
            <div className={styles.container}>
                <div className={styles.chatLayout}>
                    {/* Sidebar - Lịch sử chat */}
                    <ChatSidebar
                        chatHistories={chatHistories}
                        activeChatId={activeChatId}
                        onNewChat={handleNewChat}
                        onSelectChat={handleSelectChat}
                        onDeleteChat={handleDeleteChat}
                        isOpen={isSidebarOpen}
                        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                    />

                    {/* Chat Area - Khu vực chat chính */}
                    <ChatArea
                        messages={messages}
                        isAITyping={isAITyping}
                        onSendMessage={handleSendMessage}
                        onEditMessage={handleEditMessage}
                        onToggleSidebar={() => setIsSidebarOpen(true)}
                    />
                </div>
            </div>
        </div>
    );
};

export default AISupportBooking;
