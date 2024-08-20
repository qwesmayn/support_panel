import axios, { InternalAxiosRequestConfig } from 'axios';

export const $host = axios.create({
    baseURL: import.meta.env.VITE_API_URL as string
});

export const $authHost = axios.create({
    baseURL: import.meta.env.VITE_API_URL as string
});

const authInterceptor = (config: InternalAxiosRequestConfig) => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
};

$authHost.interceptors.request.use(authInterceptor);
