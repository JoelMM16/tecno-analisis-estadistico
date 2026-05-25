const { db } = require("../database/db");
const { recommendationFor } = require("./recommendations.service");

function pareto(rows, labelKey, valueFn) {
  const map = new Map();
  rows.forEach((row) => {
    const label = row[labelKey] || "Sin clasificar";
    map.set(label, (map.get(label) || 0) + Number(valueFn(row) || 0));
  });
  const total = [...map.values()].reduce((sum, value) => sum + value, 0) || 1;
  let accumulated = 0;
  return [...map.entries()]
    .map(([nombre, valor]) => ({ nombre, valor }))
    .sort((a, b) => b.valor - a.valor)
    .map((item) => {
      accumulated += item.valor;
      return { ...item, porcentaje: item.valor / total, porcentajeAcumulado: accumulated / total };
    });
}

function groupedSum(rows, key, valueKey) {
  const map = new Map();
  rows.forEach((row) => map.set(row[key] || "Sin clasificar", (map.get(row[key] || "Sin clasificar") || 0) + Number(row[valueKey] || 0)));
  return [...map.entries()].map(([nombre, valor]) => ({ nombre, valor })).sort((a, b) => b.valor - a.valor);
}

function monthly(rows, dateKey, valueKey = null) {
  const map = new Map();
  rows.forEach((row) => {
    const month = String(row[dateKey] || row.createdAt || "").slice(0, 7) || "Sin fecha";
    map.set(month, (map.get(month) || 0) + (valueKey ? Number(row[valueKey] || 0) : 1));
  });
  return [...map.entries()].map(([nombre, valor]) => ({ nombre, valor })).sort((a, b) => a.nombre.localeCompare(b.nombre));
}

function controlChart(rows, valueKey = "numeroFallas") {
  const values = rows.map((row) => Number(row[valueKey] || 0));
  const avg = values.reduce((a, b) => a + b, 0) / (values.length || 1);
  const variance = values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / (values.length || 1);
  const sd = Math.sqrt(variance);
  const lsc = avg + 3 * sd;
  const lic = Math.max(0, avg - 3 * sd);
  return rows.map((row, index) => ({
    punto: index + 1,
    codigo: row.codigoPedido || row.fecha || `P${index + 1}`,
    valor: Number(row[valueKey] || 0),
    promedio: avg,
    lsc,
    lic,
    fueraControl: Number(row[valueKey] || 0) > lsc || Number(row[valueKey] || 0) < lic
  }));
}

function byGestionSql(table, gestion, extra = "") {
  return db.prepare(`SELECT * FROM ${table} WHERE gestion = ? ${extra}`).all(gestion);
}

function metrics(gestion = "2026") {
  const empresa = db.prepare("SELECT * FROM empresa_demo ORDER BY id DESC LIMIT 1").get();
  const gestiones = db.prepare("SELECT * FROM gestiones ORDER BY gestion DESC").all();
  const pedidos = byGestionSql("pedidos", gestion, "ORDER BY fechaPedido");
  const etapas = byGestionSql("etapas", gestion, "ORDER BY orden");
  const fallas = db.prepare("SELECT f.*, p.codigoPedido, p.cantidadPrendas FROM fallas f LEFT JOIN pedidos p ON p.id=f.pedidoId WHERE f.gestion = ? ORDER BY f.fechaRegistro").all(gestion);
  const gastos = byGestionSql("gastos", gestion, "ORDER BY fecha");
  const control = db.prepare("SELECT c.*, p.codigoPedido FROM control_calidad c LEFT JOIN pedidos p ON p.id=c.pedidoId WHERE c.gestion = ? ORDER BY c.fecha").all(gestion);
  const manual = byGestionSql("manual_preventivo", gestion, "ORDER BY id DESC");
  const documentos = byGestionSql("documentos_cargados", gestion, "ORDER BY id DESC");
  const resultadosIa = byGestionSql("resultados_ia", gestion, "ORDER BY id DESC");
  const costoTotal = fallas.reduce((sum, falla) => sum + Number(falla.impactoEconomico || 0), 0);
  const demoraTotal = fallas.reduce((sum, falla) => sum + Number(falla.tiempoDemoraHoras || 0), 0);
  const pedidosRetrasados = pedidos.filter((p) => p.estado === "retrasado" || (p.fechaEntregaReal && p.fechaEntregaPrometida && p.fechaEntregaReal > p.fechaEntregaPrometida)).length;
  const paretoGeneral = pareto(fallas, "nombreFalla", (f) => Number(f.frecuencia) * Number(f.gravedad));
  const paretoGastos = pareto(gastos, "fallaRelacionada", (g) => Number(g.monto));
  const fallasPorEtapa = groupedSum(fallas, "etapa", "impacto");
  const gastosPorEtapa = groupedSum(gastos, "etapa", "monto");
  const gastoPorTipo = groupedSum(gastos, "tipoGasto", "monto");
  const sixM = groupedSum(fallas, "categoria6M", "impacto");
  const etapaCritica = fallasPorEtapa[0]?.nombre || "Sin datos";
  const fallaPrincipal = paretoGeneral[0]?.nombre || "Sin datos";
  const categoria6M = sixM[0]?.nombre || "Sin datos";
  const alertas = fallas.filter((f) => Number(f.gravedad) >= 7 || Number(f.impactoEconomico) >= 500).slice(0, 10);
  return {
    empresa,
    gestiones,
    gestion,
    pedidos,
    etapas,
    fallas,
    gastos,
    control,
    manual,
    documentos,
    resultadosIa,
    indicadores: {
      empresaActiva: empresa?.nombreEmpresa || "Empresa Textil de Uniformes",
      gestionActiva: gestion,
      totalPedidos: pedidos.length,
      totalFallas: fallas.length,
      costoTotal,
      demoraTotal,
      pedidosRetrasados,
      etapaCritica,
      fallaPrincipal,
      categoria6M,
      documentosProcesados: documentos.filter((d) => ["procesado", "preview", "importado"].includes(d.estado)).length,
      recomendacionesIa: resultadosIa.length,
      alertasCriticas: alertas.length
    },
    charts: {
      paretoGeneral,
      paretoGastos,
      fallasPorEtapa,
      gastosPorEtapa,
      gastoPorTipo,
      gastoMensual: monthly(gastos, "fecha", "monto"),
      fallasMensuales: monthly(fallas, "fechaRegistro"),
      sixM,
      controlFallas: controlChart(control, "numeroFallas"),
      controlDefectos: controlChart(control, "porcentajeDefectos"),
      dispersion: fallas.map((f) => ({
        nombre: f.nombreFalla,
        gravedad: Number(f.gravedad || 0),
        frecuencia: Number(f.frecuencia || 0),
        costoEstimado: Number(f.costoEstimado || 0),
        tiempoDemoraHoras: Number(f.tiempoDemoraHoras || 0),
        cantidadPrendas: Number(f.cantidadPrendas || 0),
        porcentajeDefectos: 0,
        numeroFallas: Number(f.frecuencia || 0)
      })),
      tendenciasGestion: db.prepare("SELECT gestion, COUNT(*) as pedidos FROM pedidos GROUP BY gestion ORDER BY gestion").all()
    },
    alertas,
    recomendaciones: alertas.flatMap(recommendationFor).slice(0, 12)
  };
}

module.exports = { metrics, pareto, controlChart, groupedSum };
