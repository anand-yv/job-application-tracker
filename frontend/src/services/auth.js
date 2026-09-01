import instance from "../api/axiosInstance";

export const auth = {
    login : ({email, password}) => instance.post("/auth/login",{email, password}),
    register : ({email, password}) => instance.post("/auth/register", {email, password}),
    getMe : () => instance.get("/auth/me")
}