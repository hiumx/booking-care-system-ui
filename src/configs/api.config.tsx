type ApiConfig = {
    BASE_URL: string;
    TIMEOUT: number;
};

export const API: ApiConfig = {
    BASE_URL: `${import.meta.env.VITE_API_URL}/api`,
    TIMEOUT: 10000,
};
