import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from './api.config';
import { resetAuthState, updateAccessToken } from '@/store/slices/authSlice';
import { clearUserProfile } from '@/store/slices/userSlice';
import { AuthService } from '@/services/auth.service';

// Type for Redux store
type ReduxStore = {
    dispatch: (action: any) => void;
};

// ⚠️ Tạo biến lưu store, ban đầu là null
let reduxStore: ReduxStore | null = null;

// ✅ Hàm để inject store từ bên ngoài
export const injectStore = (_store: ReduxStore) => {
    reduxStore = _store;
};

// Extend Axios config to include metadata
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
    metadata?: {
        startTime: Date;
    };
    // mark retry
    _retry?: boolean;
}

// Create axios instance
const instance = axios.create({
    baseURL: `${API_CONFIG.baseUrl}/${API_CONFIG.defaultVersion}`,
    timeout: API_CONFIG.timeout,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor to add auth token
instance.interceptors.request.use(
    (config: ExtendedAxiosRequestConfig) => {
        // Backend does not require Authorization header; rely on HttpOnly cookies
        // Keep metadata timestamp for logging
        config.metadata = { startTime: new Date() };
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ===== Refresh token queue handling =====
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
    for (const prom of failedQueue) {
        if (token) {
            prom.resolve();
        } else {
            prom.reject(error);
        }
    }
    failedQueue = [];
};

// Helper functions to reduce cognitive complexity
const handleNetworkError = (error: AxiosError) => {
    console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        network: true,
    });
    return Promise.reject(new Error('Không thể kết nối đến máy chủ!'));
};

const handleForbiddenError = (err: any) => {
    if (globalThis.window !== undefined) {
        globalThis.location.href = '/error-403';
    }
    return Promise.reject(new Error(err?.message || 'Access forbidden'));
};

const queueFailedRequest = (originalRequest: ExtendedAxiosRequestConfig) => {
    return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
    })
        .then(() => instance(originalRequest))
        .catch((error_) => {
            throw new Error(String(error_));
        });
};

/**
 * Force logout when refresh token fails
 * Clears all auth data, Redux state, and redirects to login
 *
 * Note: We don't call logoutAsync() here because:
 * 1. Token is already expired, so API call would fail
 * 2. We just need to clear local state, not call backend
 */
const handleForceLogout = () => {
    // 1. Clear auth data (cookies, localStorage)
    AuthService.clearAuthData();

    // 2. Clear Redux state IMMEDIATELY (before redirect)
    try {
        reduxStore?.dispatch(resetAuthState()); // Reset authSlice to initialState
        reduxStore?.dispatch(clearUserProfile()); // Clear userSlice
    } catch (error) {
        console.error('Error clearing Redux state:', error);
    }

    // 3. Redirect to login (only in browser environment)
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
};

const handleTokenRefresh = async (originalRequest: ExtendedAxiosRequestConfig) => {
    try {
        const refreshResponse: any = await instance.post('/auth/refresh-token');
        const newToken = refreshResponse?.data?.token || refreshResponse?.token;

        // ✅ Update Redux state with new access token
        if (newToken && reduxStore) {
            reduxStore.dispatch(updateAccessToken(newToken));
        }

        processQueue(null, newToken || '1');
        isRefreshing = false;
        return instance(originalRequest);
    } catch (refreshError) {
        processQueue(refreshError as any, null);
        isRefreshing = false;

        // Force logout: clear all auth data and redirect
        handleForceLogout();

        throw new Error(String(refreshError));
    }
};

const handleResponseError = async (error: AxiosError) => {
    const err = error?.response?.data as any;
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    // Network error
    if (!error.response) {
        return handleNetworkError(error);
    }

    const url = (originalRequest.url || '').toString();
    const isLogin = url.includes('/auth/login');
    const isRefresh = url.includes('/auth/refresh-token');

    // Handle 403 errors
    if (error.response?.status === 403) {
        return handleForbiddenError(err);
    }

    // Handle 401 errors with token refresh
    if (error.response?.status === 401 && !isLogin && !isRefresh) {
        if (isRefreshing) {
            return queueFailedRequest(originalRequest);
        }

        originalRequest._retry = true;
        isRefreshing = true;
        return handleTokenRefresh(originalRequest);
    }

    // Log and reject other errors
    console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: err,
    });

    throw new Error(err?.message || error.message || 'An error occurred');
};

// Response interceptor for handling responses and errors
instance.interceptors.response.use(function (response: AxiosResponse) {
    // Calculate response time for performance monitoring
    const endTime = new Date();
    const config = response.config as ExtendedAxiosRequestConfig;
    const startTime = config.metadata?.startTime;
    if (startTime) {
        const responseTime = endTime.getTime() - startTime.getTime();
        console.log(`API Response Time: ${responseTime}ms for ${response.config.url}`);
    }

    // Return the data directly for easier usage
    return response.data;
}, handleResponseError);

// Add a method to update the base URL if needed
export const updateBaseURL = (newBaseURL: string) => {
    instance.defaults.baseURL = newBaseURL;
};

// Add types for common API responses
export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    errors?: string[];
}

export interface PaginatedResponse<T = any> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ApiError {
    message: string;
    status?: number;
    code?: string;
    data?: any;
    isNetworkError: boolean;
}

export default instance;
