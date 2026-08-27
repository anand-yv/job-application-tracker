import axios from "axios"
import { TOKEN_KEY } from "../constant";

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    }
})

const PUBLIC_ENDPOINTS = ["/auth/login", "/auth/register"];

instance.interceptors.request.use(
    function(config){
        const isPublic = PUBLIC_ENDPOINTS.includes(config.url);
        const token  = localStorage.getItem(TOKEN_KEY);
        if(token && !isPublic){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    function(error){
        return Promise.reject(error);
    }
)

instance.interceptors.response.use(
    function(response){
        return response;
    },
    function(error){
        const hadToken = !!error?.config?.headers?.Authorization;
        if(error?.response?.status === 401 && hadToken){
            localStorage.removeItem(TOKEN_KEY);
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
)

export default instance;