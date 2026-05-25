import { api } from "./api";
export const documentsApi = {
  list: () => api.get("/documentos"),
  smart: (formData) => api.post("/upload/smart", formData),
  confirmImport: (payload) => api.post("/upload/confirm", payload),
  history: (gestion) => api.get(`/upload/history?gestion=${gestion}`),
  upload: (formData) => api.post("/upload", formData),
  analyze: (id) => api.post(`/documentos/${id}/analyze`, {}),
  confirm: (id, datos) => api.post(`/documentos/${id}/confirm`, { datos }),
  reject: (id) => api.post(`/documentos/${id}/reject`, {})
};
