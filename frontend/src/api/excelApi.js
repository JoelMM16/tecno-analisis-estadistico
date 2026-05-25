import { api } from "./api";
export const excelApi = {
  templateUrl: `${api.url}/excel/template`,
  exportar: () => api.get("/excel/export"),
  validar: (formData) => api.post("/excel/validate", formData),
  importar: (formData) => api.post("/excel/import", formData)
};
