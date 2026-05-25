const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const { insert, get, update, db } = require("../database/db");
const { extractText } = require("./document.service");
const { analizarDocumento } = require("./ai.service");
const { recommendationFor } = require("./recommendations.service");

const sheetMap = {
  resumen: "datos_originales",
  pedidos: "pedidosDetectados",
  etapas: "etapasDetectadas",
  procesos: "etapasDetectadas",
  fallas: "fallasDetectadas",
  gastos: "gastosDetectados",
  controlcalidad: "datosControlCalidad",
  datoscontrol: "datosControlCalidad",
  control: "datosControlCalidad",
  manualpreventivo: "manualPreventivo",
  manual: "manualPreventivo",
  recomendaciones: "recomendaciones",
  "6m": "causas6M",
  causas6m: "causas6M"
};

const categories6M = ["Mano de obra", "Metodo", "Maquina", "Materiales", "Medicion", "Medio ambiente"];

function normalizeName(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function pick(row, names, fallback = "") {
  const normalized = Object.fromEntries(Object.entries(row).map(([key, value]) => [normalizeName(key), value]));
  for (const name of names) {
    const key = normalizeName(name);
    if (normalized[key] !== undefined && normalized[key] !== "") return normalized[key];
  }
  return fallback;
}

function toNumber(value, fallback = 0) {
  const n = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : fallback;
}

function toDate(value) {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "number") {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (parsed) return `${parsed.y}-${String(parsed.m).padStart(2, "0")}-${String(parsed.d).padStart(2, "0")}`;
  }
  const text = String(value).slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}/.test(text) ? text : "";
}

function suggest6M(text = "") {
  const lower = text.toLowerCase();
  if (lower.includes("operario") || lower.includes("personal") || lower.includes("costura")) return "Mano de obra";
  if (lower.includes("maquina") || lower.includes("equipo")) return "Maquina";
  if (lower.includes("tela") || lower.includes("material") || lower.includes("insumo")) return "Materiales";
  if (lower.includes("dato") || lower.includes("medid") || lower.includes("talla")) return "Medicion";
  if (lower.includes("burocr") || lower.includes("cliente") || lower.includes("transporte")) return "Medio ambiente";
  return "Metodo";
}

function normalizePedido(row, gestion) {
  return {
    gestion,
    codigoPedido: String(pick(row, ["codigoPedido", "codigo", "pedido", "nroPedido"], `IMP-${Date.now()}`)),
    cliente: String(pick(row, ["cliente", "nombreCliente"], "Cliente detectado")),
    fechaPedido: toDate(pick(row, ["fechaPedido", "fecha", "fechaRegistro"])),
    fechaEntregaPrometida: toDate(pick(row, ["fechaEntregaPrometida", "fechaPrometida", "entregaPrometida"])),
    fechaEntregaReal: toDate(pick(row, ["fechaEntregaReal", "entregaReal"])),
    tipoPrenda: String(pick(row, ["tipoPrenda", "prenda", "producto"], "Prenda textil")),
    cantidadPrendas: toNumber(pick(row, ["cantidadPrendas", "cantidad", "unidades"]), 0),
    estado: String(pick(row, ["estado"], "pendiente")),
    etapaActual: String(pick(row, ["etapaActual", "etapa"], "Sin etapa")),
    observaciones: String(pick(row, ["observaciones", "descripcion", "detalle"], "Importado desde carga inteligente")),
    originalJson: JSON.stringify(row)
  };
}

function normalizeEtapa(row, gestion, index = 0) {
  const nombre = typeof row === "string" ? row : pick(row, ["nombreEtapa", "etapa", "proceso", "nombre"], "");
  return {
    gestion,
    nombreEtapa: String(nombre || "Etapa detectada"),
    descripcion: String(typeof row === "string" ? "" : pick(row, ["descripcion", "detalle"], "Etapa detectada por carga inteligente")),
    orden: toNumber(typeof row === "string" ? index + 1 : pick(row, ["orden", "nro"], index + 1), index + 1),
    responsable: String(typeof row === "string" ? "Calidad" : pick(row, ["responsable"], "Calidad")),
    activo: 1,
    recomendaciones: String(typeof row === "string" ? "Aplicar checklist de control." : pick(row, ["recomendacion", "recomendaciones"], "Aplicar checklist de control.")),
    originalJson: JSON.stringify(row)
  };
}

function normalizeFalla(row, gestion) {
  const nombre = String(pick(row, ["nombreFalla", "falla", "defecto", "problema", "nombre"], "Falla detectada"));
  const etapa = String(pick(row, ["etapa", "proceso"], "Sin etapa"));
  const gravedad = Math.min(10, Math.max(1, toNumber(pick(row, ["gravedad", "severidad"], 5), 5)));
  const frecuencia = Math.max(0, toNumber(pick(row, ["frecuencia", "cantidad", "ocurrencias"], 1), 1));
  const costoEstimado = Math.max(0, toNumber(pick(row, ["costoEstimado", "costo", "monto"], 0), 0));
  const categoria6M = String(pick(row, ["categoria6M", "6M", "causa6M"], suggest6M(`${nombre} ${etapa}`)));
  const categoria = categories6M.includes(categoria6M) ? categoria6M : suggest6M(`${nombre} ${etapa} ${categoria6M}`);
  return {
    gestion,
    pedidoId: null,
    etapa,
    nombreFalla: nombre,
    descripcion: String(pick(row, ["descripcion", "detalle", "observaciones"], nombre)),
    frecuencia,
    gravedad,
    tiempoDemoraHoras: Math.max(0, toNumber(pick(row, ["tiempoDemoraHoras", "demora", "horasDemora"], 0), 0)),
    costoEstimado,
    categoria6M: categoria,
    causaRaiz: String(pick(row, ["causaRaiz", "causa"], "Causa sugerida por carga inteligente")),
    accionCorrectiva: String(pick(row, ["accionCorrectiva", "correctiva"], "Revisar y corregir el pedido afectado.")),
    accionPreventiva: String(pick(row, ["accionPreventiva", "preventiva"], recommendationFor({ categoria6M: categoria, gravedad })[0])),
    estado: String(pick(row, ["estado"], gravedad >= 7 ? "pendiente" : "en revision")),
    fechaRegistro: toDate(pick(row, ["fechaRegistro", "fecha"], "")) || new Date().toISOString().slice(0, 10),
    originalJson: JSON.stringify(row)
  };
}

function normalizeGasto(row, gestion) {
  return {
    gestion,
    etapa: String(pick(row, ["etapa", "proceso"], "Sin etapa")),
    fallaRelacionada: String(pick(row, ["fallaRelacionada", "falla", "problema"], "Carga inteligente")),
    tipoGasto: String(pick(row, ["tipoGasto", "tipo"], "otro")),
    descripcion: String(pick(row, ["descripcion", "detalle"], "Gasto detectado por carga inteligente")),
    monto: Math.max(0, toNumber(pick(row, ["monto", "costo", "importe"], 0), 0)),
    fecha: toDate(pick(row, ["fecha"], "")) || new Date().toISOString().slice(0, 10),
    responsable: String(pick(row, ["responsable"], "Calidad")),
    observaciones: String(pick(row, ["observaciones"], "")),
    originalJson: JSON.stringify(row)
  };
}

function normalizeControl(row, gestion) {
  return {
    gestion,
    pedidoId: null,
    fecha: toDate(pick(row, ["fecha"], "")) || new Date().toISOString().slice(0, 10),
    numeroFallas: Math.max(0, toNumber(pick(row, ["numeroFallas", "fallas", "cantidadFallas"], 0), 0)),
    porcentajeDefectos: Math.max(0, toNumber(pick(row, ["porcentajeDefectos", "defectos", "porcentaje"], 0), 0)),
    tiempoProcesoHoras: Math.max(0, toNumber(pick(row, ["tiempoProcesoHoras", "tiempo", "horas"], 0), 0)),
    etapa: String(pick(row, ["etapa", "proceso"], "Sin etapa"))
  };
}

function normalizeManual(row, gestion) {
  const falla = String(pick(row, ["fallaRelacionada", "falla", "problema"], "Falla detectada"));
  const etapa = String(pick(row, ["etapa", "proceso"], "Sin etapa"));
  const categoria = suggest6M(`${falla} ${etapa}`);
  return {
    gestion,
    etapa,
    fallaRelacionada: falla,
    causa: String(pick(row, ["causa", "causaRaiz"], "Causa sugerida por carga inteligente")),
    procedimientoPreventivo: String(pick(row, ["procedimientoPreventivo", "prevencion", "accionPreventiva"], recommendationFor({ categoria6M: categoria, gravedad: 6 })[0])),
    procedimientoCorrectivo: String(pick(row, ["procedimientoCorrectivo", "correccion", "accionCorrectiva"], "Corregir, registrar evidencia y validar calidad.")),
    responsable: String(pick(row, ["responsable"], "Calidad")),
    indicadorControl: String(pick(row, ["indicadorControl", "indicador"], "Pedidos sin reproceso")),
    frecuenciaRevision: String(pick(row, ["frecuenciaRevision"], "Semanal"))
  };
}

function emptyPreview() {
  return {
    pedidosDetectados: [],
    etapasDetectadas: [],
    fallasDetectadas: [],
    gastosDetectados: [],
    datosControlCalidad: [],
    manualPreventivo: [],
    recomendaciones: [],
    causas6M: [],
    datos_originales: [],
    errores: [],
    resumen: "",
    nivelConfianza: 0
  };
}

function mergePreview(target, source) {
  Object.keys(emptyPreview()).forEach((key) => {
    if (Array.isArray(target[key]) && Array.isArray(source[key])) target[key].push(...source[key]);
  });
  if (source.resumen) target.resumen = [target.resumen, source.resumen].filter(Boolean).join("\n");
  if (source.nivelConfianza) target.nivelConfianza = Math.max(target.nivelConfianza || 0, source.nivelConfianza);
}

async function processUploadedFiles(files = [], gestion = "2026", pastedText = "") {
  const preview = emptyPreview();
  const fileSummaries = [];
  for (const file of files.slice(0, 5)) {
    try {
      const ext = path.extname(file.originalname).toLowerCase();
      const result = ext === ".xlsx" ? await processExcel(file.path, gestion)
        : ext === ".csv" ? await processCsv(file.path, gestion)
        : ext === ".docx" ? await processWord(file.path, gestion)
        : ext === ".pdf" ? await processPdf(file.path, gestion)
        : [".jpg", ".jpeg", ".png", ".webp", ".bmp"].includes(ext) ? await processImage(file.path, gestion)
        : await processText(file.path, gestion);
      mergePreview(preview, result.preview);
      fileSummaries.push({ nombre: file.originalname, tipo: ext || file.mimetype, tamano: file.size, estado: "procesado", textoExtraido: result.textoExtraido || "", errores: result.preview.errores || [] });
    } catch (error) {
      preview.errores.push(`El archivo ${file.originalname} se cargo, pero no se pudo extraer informacion util: ${error.message}`);
      fileSummaries.push({ nombre: file.originalname, tipo: file.mimetype, tamano: file.size, estado: "error", errores: [error.message] });
    }
  }
  if (pastedText) {
    const result = await processTextContent(pastedText, gestion, "Texto pegado manualmente");
    mergePreview(preview, result.preview);
    fileSummaries.push({ nombre: "Texto pegado", tipo: "texto", tamano: pastedText.length, estado: "procesado", textoExtraido: pastedText, errores: [] });
  }
  preview.resumen = preview.resumen || `Se procesaron ${fileSummaries.length} fuentes. Revise los datos detectados antes de confirmar.`;
  const textoExtraido = fileSummaries.map((f) => `Archivo: ${f.nombre}\n${f.textoExtraido || ""}`).join("\n\n---\n\n");
  const doc = insert("documentos_cargados", {
    gestion,
    nombreDocumento: `Carga inteligente ${new Date().toISOString().slice(0, 19).replace("T", " ")}`,
    tipoDocumento: "carga inteligente",
    estado: "preview",
    rutaArchivo: "",
    textoExtraido,
    datosDetectados: JSON.stringify(preview),
    cantidadArchivos: fileSummaries.length,
    pedidosDetectados: preview.pedidosDetectados.length,
    fallasDetectadas: preview.fallasDetectadas.length,
    gastosDetectados: preview.gastosDetectados.length,
    resumenIa: preview.resumen,
    errores: preview.errores.join("\n"),
    originalJson: JSON.stringify({ archivos: fileSummaries.map(({ textoExtraido, ...rest }) => rest) })
  });
  insert("textos_extraidos", { gestion, documentoId: doc.id, texto: textoExtraido });
  return buildImportPreview({ importId: doc.id, gestion, files: fileSummaries, preview });
}

async function processExcel(filePath, gestion) {
  const wb = XLSX.readFile(filePath, { cellDates: true });
  const preview = emptyPreview();
  wb.SheetNames.forEach((sheetName) => {
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { defval: "" });
    const mapped = sheetMap[normalizeName(sheetName)];
    if (!mapped) {
      preview.datos_originales.push({ hoja: sheetName, filas: rows.slice(0, 50) });
      preview.errores.push(`Se detecto hoja no reconocida: ${sheetName}. Puede revisarse como datos originales o analizarse con IA.`);
      return;
    }
    if (mapped === "pedidosDetectados") preview.pedidosDetectados.push(...rows.map((r) => normalizePedido(r, gestion)));
    else if (mapped === "etapasDetectadas") preview.etapasDetectadas.push(...rows.map((r, i) => normalizeEtapa(r, gestion, i)));
    else if (mapped === "fallasDetectadas") preview.fallasDetectadas.push(...rows.map((r) => normalizeFalla(r, gestion)));
    else if (mapped === "gastosDetectados") preview.gastosDetectados.push(...rows.map((r) => normalizeGasto(r, gestion)));
    else if (mapped === "datosControlCalidad") preview.datosControlCalidad.push(...rows.map((r) => normalizeControl(r, gestion)));
    else if (mapped === "manualPreventivo") preview.manualPreventivo.push(...rows.map((r) => normalizeManual(r, gestion)));
    else if (mapped === "recomendaciones") preview.recomendaciones.push(...rows.map((r) => String(pick(r, ["recomendacion", "descripcion", "detalle"], Object.values(r).join(" ")))).filter(Boolean));
    else if (mapped === "causas6M") preview.causas6M.push(...rows.map((r) => String(pick(r, ["categoria6M", "6M", "causa"], Object.values(r)[0] || ""))).filter(Boolean));
  });
  preview.resumen = `Excel procesado con ${wb.SheetNames.length} hojas.`;
  preview.nivelConfianza = 0.9;
  return { textoExtraido: workbookText(wb), preview: normalizeExtractedData(preview, gestion) };
}

async function processCsv(filePath, gestion) {
  const wb = XLSX.readFile(filePath, { type: "file", raw: false });
  return processExcelLikeWorkbook(wb, gestion, "CSV procesado.");
}

async function processExcelLikeWorkbook(wb, gestion, resumen) {
  const temp = path.join(__dirname, `../../uploads/temp-${Date.now()}.xlsx`);
  XLSX.writeFile(wb, temp);
  const result = await processExcel(temp, gestion);
  result.preview.resumen = resumen;
  fs.unlinkSync(temp);
  return result;
}

async function processWord(filePath, gestion) {
  const textoExtraido = await extractText({ path: filePath, originalname: "documento.docx" });
  return processTextContent(textoExtraido, gestion, "Documento Word procesado.");
}

async function processPdf(filePath, gestion) {
  const textoExtraido = await extractText({ path: filePath, originalname: "documento.pdf" });
  return processTextContent(textoExtraido, gestion, "PDF procesado.");
}

async function processImage(filePath, gestion) {
  const textoExtraido = await extractText({ path: filePath, originalname: "imagen.png" });
  return processTextContent(textoExtraido, gestion, "Imagen procesada con OCR.");
}

async function processText(filePath, gestion) {
  const textoExtraido = fs.readFileSync(filePath, "utf8");
  return processTextContent(textoExtraido, gestion, "Texto procesado.");
}

async function processTextContent(textoExtraido, gestion, resumen) {
  const ai = await analizarDocumento(textoExtraido, { empresa: "Empresa Textil de Uniformes" }, gestion);
  const preview = normalizeExtractedData({
    ...emptyPreview(),
    ...ai,
    etapasDetectadas: (ai.etapasDetectadas || []).map((e, i) => typeof e === "string" ? normalizeEtapa(e, gestion, i) : normalizeEtapa(e, gestion, i)),
    fallasDetectadas: (ai.fallasDetectadas || []).map((f) => normalizeFalla(f, gestion)),
    gastosDetectados: (ai.gastosDetectados || []).map((g) => normalizeGasto(g, gestion)),
    datosControlCalidad: (ai.datosControlCalidad || []).map((c) => normalizeControl(c, gestion)),
    manualPreventivo: (ai.fallasDetectadas || []).slice(0, 12).map((f) => normalizeManual({ ...f, accionPreventiva: ai.accionesPreventivas?.[0], accionCorrectiva: ai.accionesCorrectivas?.[0] }, gestion)),
    resumen: ai.resumen || resumen,
    nivelConfianza: ai.nivelConfianza || 0.6
  }, gestion);
  return { textoExtraido, preview };
}

function workbookText(wb) {
  return wb.SheetNames.map((sheet) => {
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheet], { defval: "" });
    return `${sheet}\n${JSON.stringify(rows.slice(0, 30), null, 2)}`;
  }).join("\n\n");
}

function normalizeExtractedData(rawData, gestion = "2026") {
  const preview = { ...emptyPreview(), ...rawData };
  preview.pedidosDetectados = (preview.pedidosDetectados || []).map((r) => normalizePedido(r, gestion));
  preview.etapasDetectadas = (preview.etapasDetectadas || []).map((r, i) => normalizeEtapa(r, gestion, i));
  preview.fallasDetectadas = (preview.fallasDetectadas || []).map((r) => normalizeFalla(r, gestion));
  preview.gastosDetectados = (preview.gastosDetectados || []).map((r) => normalizeGasto(r, gestion));
  preview.datosControlCalidad = (preview.datosControlCalidad || []).map((r) => normalizeControl(r, gestion));
  preview.manualPreventivo = (preview.manualPreventivo || []).map((r) => normalizeManual(r, gestion));
  preview.recomendaciones = [...new Set(preview.recomendaciones || [])].filter(Boolean);
  preview.causas6M = [...new Set([...(preview.causas6M || []), ...preview.fallasDetectadas.map((f) => f.categoria6M)])].filter(Boolean);
  return preview;
}

function buildImportPreview(extractedData) {
  return extractedData;
}

function ensureStage(etapa, gestion) {
  const name = etapa.nombreEtapa || etapa.etapa || etapa;
  const existing = db.prepare("SELECT * FROM etapas WHERE gestion = ? AND nombreEtapa = ?").get(gestion, name);
  if (existing) return existing;
  return insert("etapas", normalizeEtapa(typeof etapa === "string" ? etapa : etapa, gestion, db.prepare("SELECT COUNT(*) as total FROM etapas WHERE gestion = ?").get(gestion).total));
}

function confirmImport(importId, editedData = null) {
  const doc = get("documentos_cargados", importId);
  if (!doc) throw new Error("No se encontro la carga seleccionada.");
  const gestion = doc.gestion;
  const data = normalizeExtractedData(editedData || JSON.parse(doc.datosDetectados || "{}"), gestion);
  data.etapasDetectadas.forEach((etapa) => ensureStage(etapa, gestion));
  data.fallasDetectadas.forEach((falla) => ensureStage(falla.etapa, gestion));
  data.gastosDetectados.forEach((gasto) => ensureStage(gasto.etapa, gestion));
  data.datosControlCalidad.forEach((control) => ensureStage(control.etapa, gestion));
  const pedidos = data.pedidosDetectados.map((row) => insert("pedidos", row));
  const fallas = data.fallasDetectadas.map((row) => insert("fallas", row));
  const gastos = data.gastosDetectados.map((row) => insert("gastos", row));
  const control = data.datosControlCalidad.map((row) => insert("control_calidad", row));
  const manualRows = data.manualPreventivo.length ? data.manualPreventivo : data.fallasDetectadas.slice(0, 20).map((f) => normalizeManual(f, gestion));
  const manual = manualRows.map((row) => insert("manual_preventivo", row));
  const ia = insert("resultados_ia", { gestion, documentoId: importId, tipo: "carga_inteligente", resultadoJson: JSON.stringify(data), aprobado: 1 });
  update("documentos_cargados", importId, {
    estado: "importado",
    datosDetectados: JSON.stringify(data),
    pedidosDetectados: pedidos.length,
    fallasDetectadas: fallas.length,
    gastosDetectados: gastos.length,
    resumenIa: data.resumen,
    errores: (data.errores || []).join("\n")
  });
  return { importId, gestion, pedidos, fallas, gastos, control, manual, resultadosIa: [ia], resumen: { pedidos: pedidos.length, fallas: fallas.length, gastos: gastos.length, control: control.length, manual: manual.length } };
}

module.exports = { processUploadedFiles, processExcel, processWord, processPdf, processImage, normalizeExtractedData, buildImportPreview, confirmImport };
