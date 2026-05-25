export function fallbackRecommendations(falla = {}) {
  const items = [];
  if (Number(falla.gravedad) >= 7) items.push("Prioridad alta. Revisar esta falla de forma inmediata.");
  const rules = {
    Metodo: "Estandarizar el proceso con checklist, responsables y tiempos definidos.",
    "Mano de obra": "Capacitar personal, aplicar doble revision y asignar responsabilidades claras.",
    Maquina: "Aplicar mantenimiento preventivo y registrar fallas tecnicas.",
    Materiales: "Mejorar control de inventario y validacion de insumos antes de producir.",
    Medicion: "Validar datos, tallas, fichas tecnicas e informacion antes de avanzar.",
    "Medio ambiente": "Planificar riesgos externos como cambios economicos, legales o burocraticos."
  };
  if (rules[falla.categoria6M]) items.push(rules[falla.categoria6M]);
  return items;
}
