import { api } from "./api";
export const aiApi = {
  analizarDocumento: (texto) => api.post("/ia/analizar-documento", { texto }),
  clasificarFalla: (payload) => api.post("/ia/clasificar-falla", payload),
  generarInforme: (gestion) => api.post("/ia/generar-informe", { gestion }),
  generarManual: (gestion) => api.post("/ia/generar-manual", { gestion }),
  preguntar: (payload) => api.post("/ia/preguntar", payload)
};
