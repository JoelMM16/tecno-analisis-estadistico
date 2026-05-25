const XLSX = require("xlsx");
const { insert } = require("../database/db");

const sheets = {
  Pedidos: ["gestion", "codigoPedido", "cliente", "fechaPedido", "fechaEntregaPrometida", "fechaEntregaReal", "tipoPrenda", "cantidadPrendas", "estado", "etapaActual", "observaciones"],
  Etapas: ["gestion", "nombreEtapa", "descripcion", "orden", "responsable", "activo"],
  Fallas: ["gestion", "pedidoId", "etapa", "nombreFalla", "descripcion", "frecuencia", "gravedad", "tiempoDemoraHoras", "costoEstimado", "categoria6M", "causaRaiz", "accionCorrectiva", "accionPreventiva", "estado", "fechaRegistro"],
  Gastos: ["gestion", "etapa", "fallaRelacionada", "tipoGasto", "descripcion", "monto", "fecha", "responsable", "observaciones"],
  ControlCalidad: ["gestion", "pedidoId", "fecha", "numeroFallas", "porcentajeDefectos", "tiempoProcesoHoras", "etapa"],
  ManualPreventivo: ["gestion", "etapa", "fallaRelacionada", "causa", "procedimientoPreventivo", "procedimientoCorrectivo", "responsable", "indicadorControl", "frecuenciaRevision"]
};

const mapTables = {
  Etapas: "etapas",
  Pedidos: "pedidos",
  Fallas: "fallas",
  Gastos: "gastos",
  ControlCalidad: "control_calidad",
  ManualPreventivo: "manual_preventivo"
};

function makeTemplate() {
  const wb = XLSX.utils.book_new();
  Object.entries(sheets).forEach(([name, columns]) => {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([Object.fromEntries(columns.map((c) => [c, c === "gestion" ? "2026" : ""]))], { header: columns }), name);
  });
  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
}

function validateWorkbook(buffer) {
  const wb = XLSX.read(buffer, { type: "buffer" });
  return wb.SheetNames.map((name) => {
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[name], { defval: "" });
    const expected = sheets[name] || [];
    const actual = rows[0] ? Object.keys(rows[0]) : [];
    const missing = expected.filter((column) => !actual.includes(column));
    return { hoja: name, filas: rows.length, columnas: actual, faltantes: missing, valido: missing.length === 0, preview: rows.slice(0, 5) };
  });
}

function importWorkbook(buffer, gestion = "2026") {
  const wb = XLSX.read(buffer, { type: "buffer" });
  const result = [];
  wb.SheetNames.forEach((name) => {
    const table = mapTables[name];
    if (!table) return;
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[name], { defval: "" });
    rows.forEach((row) => {
      const payload = { ...row, gestion: row.gestion || gestion, originalJson: JSON.stringify(row) };
      if (Object.values(row).some((v) => String(v).trim() !== "")) insert(table, payload);
    });
    result.push({ hoja: name, tabla: table, importados: rows.length });
  });
  return result;
}

module.exports = { sheets, makeTemplate, validateWorkbook, importWorkbook };
