import axios from "axios"
import { TOKEN_KEY } from "./constant";

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    }
})

instance.interceptors.request.use(
    function(config){
        const token  = localStorage.getItem(TOKEN_KEY);
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    function(error){
        return Promise.reject(error);
    }
)

export default instance;