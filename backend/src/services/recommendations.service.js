function recommendationFor(falla = {}) {
  const rules = [];
  if (Number(falla.gravedad) >= 7) rules.push("Prioridad alta. Revisar esta falla de forma inmediata.");
  const categoryRules = {
    Metodo: "Estandarizar el proceso con checklist, responsables y tiempos definidos.",
    "Mano de obra": "Capacitar personal, aplicar doble revision y asignar responsabilidades claras.",
    Maquina: "Aplicar mantenimiento preventivo y registrar fallas tecnicas.",
    Materiales: "Mejorar control de inventario y validacion de insumos antes de producir.",
    Medicion: "Validar datos, tallas, fichas tecnicas e informacion antes de avanzar.",
    "Medio ambiente": "Planificar riesgos externos como cambios economicos, legales o burocraticos."
  };
  if (categoryRules[falla.categoria6M]) rules.push(categoryRules[falla.categoria6M]);
  return rules.length ? rules : ["Mantener seguimiento, registrar evidencia y revisar recurrencia mensual."];
}

module.exports = { recommendationFor };
