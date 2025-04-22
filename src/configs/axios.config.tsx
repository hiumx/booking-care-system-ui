import axios from 'axios';

type ApiConfig = {
    BASE_URL: string;
    TIMEOUT: number;
};

export const API: ApiConfig = {
    BASE_URL: `${import.meta.env.VITE_API_URL}/api/v1`,
    TIMEOUT: 1000,
};

const instance = axios.create({
    baseURL: API.BASE_URL || 'http://localhost:8080/api/v1',
    timeout: API.TIMEOUT,
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    function (response) {
        return response?.data;
    },
    function (error) {
        const err = error?.response?.data;
        console.log(err);
        if (err.code === 1009) {
            localStorage.removeItem('persist:user');
            localStorage.removeItem('token');
            window.location.href = '/';
        }
        return err;
    }
);

export default instance;
