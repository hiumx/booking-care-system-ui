import axiosInstance from '@/configs/axios.config';

export interface FileUploadResult {
    success: boolean;
    fileUrl?: string;
    cloudFrontUrl?: string;
    fileName?: string;
    s3Key?: string;
    fileSize: number;
    contentType?: string;
    errorMessage?: string;
    uploadedAt: string;
}

export class UploadService {
    /**
     * Upload user avatar
     */
    static async uploadAvatar(file: File): Promise<FileUploadResult> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosInstance.post<FileUploadResult>(`/avatar/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    }

    /**
     * Delete user avatar
     */
    static async deleteAvatar(): Promise<void> {
        await axiosInstance.delete(`/avatar`);
    }

    /**
     * Validate image file
     */
    static validateImageFile(file: File): { valid: boolean; error?: string } {
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return {
                valid: false,
                error: 'Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc GIF',
            };
        }

        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return {
                valid: false,
                error: 'Kích thước file không được vượt quá 5MB',
            };
        }

        return { valid: true };
    }

    /**
     * Create image preview URL
     */
    static createPreviewUrl(file: File): string {
        return URL.createObjectURL(file);
    }

    /**
     * Revoke preview URL to free memory
     */
    static revokePreviewUrl(url: string): void {
        URL.revokeObjectURL(url);
    }
}
