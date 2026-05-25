import { categorias6M } from "../constants/categorias6M";
export function summarizeSixM(fallas) {
  return categorias6M.map((categoria) => ({
    nombre: categoria,
    valor: fallas.filter((falla) => falla.categoria6M === categoria).reduce((sum, falla) => sum + Number(falla.impacto || 0), 0),
    fallas: fallas.filter((falla) => falla.categoria6M === categoria).length
  }));
}
