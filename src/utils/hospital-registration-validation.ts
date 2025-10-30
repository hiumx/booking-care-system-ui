import { z } from 'zod';

// Vietnamese phone number regex: starts with 03, 05, 07, 08, or 09 followed by 8 digits
const vietnamesePhoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;

// Tax code regex: 10 digits or 10 digits followed by -XXX
const taxCodeRegex = /^\d{10}(-\d{3})?$/;

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed file types
const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const fileValidation = z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: 'Kích thước tệp không được vượt quá 10MB',
    })
    .refine((file) => ALLOWED_FILE_TYPES.includes(file.type), {
        message: 'Định dạng tệp không hợp lệ. Chỉ chấp nhận: Ảnh, PDF, DOC, DOCX',
    });

export const hospitalRegistrationSchema = z.object({
    hospitalName: z
        .string()
        .min(1, 'Tên bệnh viện là bắt buộc')
        .max(255, 'Tên bệnh viện không được vượt quá 255 ký tự'),
    email: z
        .string()
        .min(1, 'Email là bắt buộc')
        .email('Email không hợp lệ')
        .max(100, 'Email không được vượt quá 100 ký tự'),
    phone: z
        .string()
        .min(1, 'Số điện thoại là bắt buộc')
        .regex(
            vietnamesePhoneRegex,
            'Số điện thoại phải là số điện thoại Việt Nam hợp lệ (ví dụ: 0912345678)'
        ),
    address: z.string().min(1, 'Địa chỉ là bắt buộc'),
    licenseFile: fileValidation,
    businessCertificateFile: fileValidation,
    identityCardFile: fileValidation,
    taxCode: z
        .string()
        .min(1, 'Mã số thuế là bắt buộc')
        .regex(
            taxCodeRegex,
            'Mã số thuế không hợp lệ. Mã số thuế phải có 10 chữ số hoặc 10 chữ số theo sau bởi -XXX (ví dụ: 0123456789 hoặc 0123456789-001)'
        ),
});

export type HospitalRegistrationFormData = z.infer<typeof hospitalRegistrationSchema>;
