import axios from "axios";

const axiosClient = axios.create({
    baseURL: process.env.API_BASE_URL,
    timeout: 30000,
    headers: {
        Accept: "application/json, text/plain,*/*",
    },
});

axiosClient.interceptors.request.use(
    (config) => {
        return config;
    },
);

axiosClient.interceptors.response.use(
    (response) => {
        const { data } = response;
        return Promise.resolve(data)
    },
    (error) => {
        const data = error?.response?.data || {
            message: 'Somthing went wrong',
            success: false
        }
        switch (error?.response?.status) {
            case 400:
                return Promise.reject(data);
            case 401:
                return Promise.reject(data);
            case 403:
                return Promise.reject(data);
            case 404:
                return Promise.reject(data);
            case 405:
                return Promise.reject(data);
            case 501:
                return Promise.reject(data);
            case 422:
                return Promise.reject(data);
            default:
                return Promise.reject(data);
        }
    }
);
export default axiosClient