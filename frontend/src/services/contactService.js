import instance from "@/api/axiosInstance";

export const contactService = {
    getAll : () => instance.get("/contacts"),
    getById : (id) => instance.get(`/contacts/${id}`),
    createContact : (data) => instance.post("/contacts", data),
    updateContactById : (id, data) => instance.put(`/contacts/${id}`, data),
    deleteContactById : (id) => instance.delete(`/contacts/${id}`)
}