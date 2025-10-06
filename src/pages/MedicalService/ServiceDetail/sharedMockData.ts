// Shared mock data for profile pages
import doctorImg from '@/assets/img/doctors/doc-profile-02.jpg';
import clinicImg1 from '@/assets/img/clinic/clinic-11.jpg';
import {
    Appointment,
    Hospital,
    DoctorPrice,
    Position,
    Price,
    Specialty,
    Review,
    ServiceProfile,
    DoctorProfile,
} from '@/types/profile.types';

// Mock data for Doctor
export const mockDoctor: DoctorProfile = {
    id: 1,
    account_id: 1,
    email: 'nguyenvana@example.com',
    address: 'Võ Chí Công, Đà Nẵng',
    first_name: 'Nguyễn',
    last_name: 'Văn A',
    gender: 'MALE',
    position_id: 1,
    specialty_id: 1,
    hospital_id: 1,
    bio: 'Bác sĩ giàu kinh nghiệm và đầy nhiệt huyết, luôn tận tâm chăm sóc bệnh nhân. Có kinh nghiệm trong nhiều môi trường y tế, đặc biệt am hiểu về chẩn đoán, chăm sóc ban đầu và y học cấp cứu. Thành thạo trong việc sử dụng công nghệ mới nhất để tối ưu hóa quá trình điều trị. Luôn cam kết mang đến sự quan tâm, chăm sóc cá nhân hóa và đầy nhân ái cho từng bệnh nhân...',
    avatar_url: doctorImg,
    years_of_experience: 21,
    created_at: '2020-01-15 10:00:00',
    updated_at: '2025-08-18 14:00:00',
};

// Mock data for Service
export const mockService: ServiceProfile = {
    id: 1,
    account_id: 1,
    email: 'nguyenvana@example.com',
    address: 'Võ Chí Công, Đà Nẵng',
    name: 'Chuyên Khoa Tiêu Hóa Bệnh Viện Đa Khoa Đà Nẵng',
    gender: 'MALE',
    position_id: 1,
    specialty_id: 1,
    hospital_id: 1,
    bio: 'Khoa Tiêu hóa tại Bệnh viện Đa khoa Đà Nẵng cung cấp dịch vụ chăm sóc toàn diện cho các bệnh lý về hệ tiêu hóa, bao gồm các bệnh lý dạ dày, ruột, gan, tụy và túi mật. Đội ngũ bác sĩ giàu kinh nghiệm và tận tâm của chúng tôi kết hợp chuyên môn y khoa với công nghệ chẩn đoán tiên tiến để đảm bảo đánh giá chính xác và lên kế hoạch điều trị hiệu quả.Bệnh nhân được tư vấn cá nhân hóa, từ phát hiện sớm và chăm sóc phòng ngừa đến quản lý các bệnh lý đường tiêu hóa phức tạp. Với cam kết về sự tận tâm và chuyên nghiệp, khoa luôn nỗ lực cải thiện chất lượng cuộc sống của bệnh nhân thông qua các biện pháp can thiệp kịp thời, các thủ thuật xâm lấn tối thiểu và chăm sóc theo dõi liên tục.',
    avatar_url: doctorImg,
    years_of_experience: 21,
    created_at: '2020-01-15 10:00:00',
    updated_at: '2025-08-18 14:00:00',
};

// Mock data for Specialty
export const mockSpecialty: Specialty = {
    id: 1,
    name: 'Nha khoa',
    image_url: 'https://example.com/specialty-dental.jpg',
    status: 'ACTIVE',
    created_at: '2020-01-01 09:00:00',
    updated_at: '2025-08-18 13:00:00',
};

// Mock data for Hospital
export const mockHospital: Hospital = {
    id: 1,
    account_id: 1,
    name: 'Bệnh viện Đa Khoa Đà Nẵng',
    address: 'Võ Chí Công, Đà Nẵng, Việt Nam',
    phone: '0236-123-456',
    email: 'info@dananghospital.vn',
    description: 'Bệnh viện hàng đầu tại Đà Nẵng với đội ngũ y bác sĩ chuyên nghiệp.',
    background_url: clinicImg1,
    avatar_url: clinicImg1,
    status: 'ACTIVE',
    created_at: '2019-12-01 08:00:00',
    updated_at: '2025-08-18 15:00:00',
};

// Mock data for Position
export const mockPosition: Position = {
    id: 1,
    name: 'Tiến sĩ',
    description: 'Bác sĩ có trình độ tiến sĩ y khoa.',
    created_at: '2020-01-01 09:00:00',
    updated_at: '2025-08-18 13:00:00',
};

// Mock data for Prices
export const mockPrices: Price[] = [
    {
        id: 1,
        amount: 300000,
    },
    {
        id: 2,
        amount: 500000,
    },
];

// Mock data for Doctor Prices
export const mockDoctorPrices: DoctorPrice[] = [
    {
        doctor_id: 1,
        price_id: 1,
        description: 'Standard consultation',
    },
    {
        doctor_id: 1,
        price_id: 2,
        description: 'Premium consultation',
    },
];

// Mock data for Appointments
export const mockAppointments: Appointment[] = Array.from({ length: 200 }, (_, index) => ({
    id: 201 + index,
    patient_id: 100 + (index % 50) + 1,
    doctor_id: 1,
    hospital_id: 1,
    appointment_time_id: 1,
    appointment_date: new Date(Date.now() - index * 86400000).toISOString(),
    price_id: index % 2 === 0 ? 1 : 2,
    status: 'COMPLETED',
    type: 'IN_PERSON',
    reason: `Check-up ${index + 1}`,
    result: `Successful visit ${index + 1}`,
    created_at: new Date(Date.now() - index * 86400000).toISOString(),
    updated_at: new Date(Date.now() - index * 86400000).toISOString(),
}));

// Mock data for Reviews
const baseReviews = [
    {
        id: 1,
        patient_id: 101,
        doctor_id: 1,
        appointment_id: 201,
        rating: 5,
        comment: 'Cảm ơn bác sĩ vì sự tận tâm! Dịch vụ rất tốt.',
        recommend: true,
        parent_review_id: null,
        created_at: '2025-08-17 14:03:00',
        updated_at: '2025-08-17 14:03:00',
        timeAgo: '2 days ago',
        user: {
            id: 101,
            account_id: 101,
            email: 'patient1@example.com',
            first_name: 'Nguyễn',
            last_name: 'Thị B',
            gender: 'FEMALE',
            address: 'Hải Châu, Đà Nẵng',
            phone: '0905-123-456',
            avatar_url: doctorImg,
            created_at: '2025-01-01 10:00:00',
            updated_at: '2025-08-17 14:00:00',
        },
    },
    {
        id: 2,
        patient_id: 102,
        doctor_id: 1,
        appointment_id: 202,
        rating: 5,
        comment: 'Bác sĩ rất chuyên nghiệp, tôi rất hài lòng!',
        recommend: true,
        parent_review_id: null,
        created_at: '2025-07-19 14:03:00',
        updated_at: '2025-07-19 14:03:00',
        timeAgo: '31 days ago',
        user: {
            id: 102,
            account_id: 102,
            email: 'patient2@example.com',
            first_name: 'Trần',
            last_name: 'Văn C',
            gender: 'MALE',
            address: 'Sơn Trà, Đà Nẵng',
            phone: '0905-654-321',
            avatar_url: doctorImg,
            created_at: '2025-02-01 10:00:00',
            updated_at: '2025-07-19 14:00:00',
        },
    },
    {
        id: 3,
        patient_id: 103,
        doctor_id: 1,
        appointment_id: 203,
        rating: 5,
        comment: 'Dịch vụ tuyệt vời, sẽ quay lại!',
        recommend: true,
        parent_review_id: null,
        created_at: '2025-08-04 14:03:00',
        updated_at: '2025-08-04 14:03:00',
        timeAgo: '15 days ago',
        user: {
            id: 103,
            account_id: 103,
            email: 'patient3@example.com',
            first_name: 'Lê',
            last_name: 'Thị D',
            gender: 'FEMALE',
            address: 'Ngũ Hành Sơn, Đà Nẵng',
            phone: '0905-789-123',
            avatar_url: doctorImg,
            created_at: '2025-03-01 10:00:00',
            updated_at: '2025-08-04 14:00:00',
        },
        replies: [
            {
                id: 4,
                patient_id: 104,
                doctor_id: 1,
                appointment_id: null,
                rating: null,
                comment: 'Cảm ơn ý kiến của bạn, chúng tôi sẽ cải thiện!',
                recommend: false,
                parent_review_id: 3,
                created_at: '2025-08-05 14:03:00',
                updated_at: '2025-08-05 14:03:00',
                user: {
                    id: 104,
                    account_id: 104,
                    email: 'reply1@example.com',
                    first_name: 'Phan',
                    last_name: 'Văn E',
                    gender: 'MALE',
                    address: 'Liên Chiểu, Đà Nẵng',
                    phone: '0905-456-789',
                    avatar_url: doctorImg,
                    created_at: '2025-04-01 10:00:00',
                    updated_at: '2025-08-05 14:00:00',
                },
            },
        ],
    },
];

// Generate 150 reviews to match "150 Đánh giá" and achieve 94% recommendation
export const reviews: Review[] = Array.from({ length: 150 }, (_, index) => {
    const baseIndex = index % baseReviews.length;
    const baseReview = baseReviews[baseIndex];
    const recommend = index < 141;
    return {
        ...baseReview,
        id: index + 1,
        patient_id: 100 + index + 1,
        appointment_id: 201 + index,
        rating: 5,
        comment: `${baseReview.comment} (Review ${index + 1})`,
        recommend,
        created_at: new Date(Date.now() - index * 86400000).toISOString(),
        updated_at: new Date(Date.now() - index * 86400000).toISOString(),
        timeAgo: `${(index % 30) + 1} days ago`,
        userId: baseReview.user.id, // Add userId for edit/delete permission check
        user: {
            ...baseReview.user,
            id: 100 + index + 1,
            account_id: 100 + index + 1,
            email: `patient${index + 1}@example.com`,
            first_name: baseReview.user.first_name,
            last_name: `${baseReview.user.last_name}${index + 1}`,
            created_at: new Date(Date.now() - index * 86400000).toISOString(),
            updated_at: new Date(Date.now() - index * 86400000).toISOString(),
        },
        replies: baseReview.replies?.map((reply) => ({
            ...reply,
            id: reply.id + index,
            patient_id: 100 + index + 2,
            recommend: false,
            userId: reply.user.id, // Add userId for edit/delete permission
            user: {
                ...reply.user,
                id: 100 + index + 2,
                account_id: 100 + index + 2,
                email: `reply${index + 1}@example.com`,
                first_name: reply.user.first_name,
                last_name: `${reply.user.last_name}${index + 1}`,
                created_at: new Date(Date.now() - (index + 1) * 86400000).toISOString(),
                updated_at: new Date(Date.now() - (index + 1) * 86400000).toISOString(),
            },
        })),
    };
});
