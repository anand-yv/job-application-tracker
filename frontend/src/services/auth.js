import instance from "../api/axiosInstance";

export const auth = {
    login : ({email, password}) => instance.post("/auth/login",{email, password}),
}