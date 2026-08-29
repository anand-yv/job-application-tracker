import instance from "../api/axiosInstance";

export const applications = {
    getAll : () => instance.get("/applications"),
    getById : ({id}) => instance.get(`/applications/${id}`),
    create : (data) => instance.post("/applications", data)
}