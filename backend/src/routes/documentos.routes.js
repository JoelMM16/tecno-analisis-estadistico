const express = require("express");
const multer = require("multer");
const path = require("path");
const { list, insert, update, get } = require("../database/db");
const { extractText } = require("../services/document.service");
const { analizarDocumento } = require("../services/ai.service");
const { processUploadedFiles, confirmImport } = require("../services/smartUpload.service");

const upload = multer({ dest: path.join(__dirname, "../uploads") });
const router = express.Router();

router.get("/", (req, res) => res.json(list("documentos_cargados", { gestion: req.query.gestion })));

router.get("/history", (req, res) => res.json(list("documentos_cargados", { gestion: req.query.gestion })));

router.post("/smart", upload.array("archivos", 5), async (req, res) => {
  try {
    const result = await processUploadedFiles(req.files || [], req.body.gestion || "2026", req.body.textoPegado || "");
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: "El archivo se cargo, pero no se pudo extraer informacion util.", detail: error.message });
  }
});

router.post("/confirm", (req, res) => {
  try {
    res.json(confirmImport(req.body.importId, req.body.data));
  } catch (error) {
    res.status(400).json({ error: "No se pudo confirmar la importacion.", detail: error.message });
  }
});

router.post("/", upload.array("archivos", 5), async (req, res) => {
  const gestion = req.body.gestion || "2026";
  const files = req.files?.length ? req.files : [null];
  const created = [];
  for (const file of files) {
    const texto = await extractText(file, req.body.textoPegado);
    const doc = insert("documentos_cargados", {
      gestion,
      nombreDocumento: req.body.nombreDocumento || file?.originalname || "Texto pegado",
      tipoDocumento: file?.mimetype || "texto",
      estado: "procesado",
      rutaArchivo: file?.path || "",
      textoExtraido: texto,
      cantidadArchivos: files.filter(Boolean).length || 1,
      originalJson: JSON.stringify({ fuente: file?.originalname || "texto pegado", size: file?.size || 0 })
    });
    insert("textos_extraidos", { gestion, documentoId: doc.id, texto });
    created.push(doc);
  }
  res.status(201).json(created.length === 1 ? created[0] : created);
});

router.post("/:id/analyze", async (req, res) => {
  const doc = get("documentos_cargados", req.params.id);
  const resultado = await analizarDocumento(doc?.textoExtraido || "", req.body.contextoEmpresa || {}, doc?.gestion || req.body.gestion || "2026");
  update("documentos_cargados", req.params.id, {
    datosDetectados: JSON.stringify(resultado),
    estado: "procesado",
    pedidosDetectados: resultado.pedidosDetectados?.length || 0,
    fallasDetectadas: resultado.fallasDetectadas?.length || 0,
    gastosDetectados: resultado.gastosDetectados?.length || 0,
    resumenIa: resultado.resumen || ""
  });
  insert("resultados_ia", { gestion: doc?.gestion || "2026", documentoId: req.params.id, tipo: "documento", resultadoJson: JSON.stringify(resultado), aprobado: 0 });
  res.json(resultado);
});

router.post("/:id/confirm", (req, res) => {
  const doc = get("documentos_cargados", req.params.id);
  const gestion = doc?.gestion || req.body.gestion || "2026";
  const data = req.body.datos || JSON.parse(doc?.datosDetectados || "{}");
  const pedidos = (data.pedidosDetectados || []).map((pedido, index) => insert("pedidos", {
    gestion,
    codigoPedido: pedido.codigoPedido || `IMP-${Date.now()}-${index + 1}`,
    cliente: pedido.cliente || "Cliente detectado",
    fechaPedido: pedido.fechaPedido || new Date().toISOString().slice(0, 10),
    fechaEntregaPrometida: pedido.fechaEntregaPrometida || "",
    fechaEntregaReal: pedido.fechaEntregaReal || "",
    tipoPrenda: pedido.tipoPrenda || "Prenda detectada",
    cantidadPrendas: pedido.cantidadPrendas || 0,
    estado: pedido.estado || "pendiente",
    etapaActual: pedido.etapaActual || "Sin etapa",
    observaciones: pedido.observaciones || "Creado desde carga inteligente",
    originalJson: JSON.stringify(pedido)
  }));
  const fallas = (data.fallasDetectadas || []).map((falla) => insert("fallas", {
    gestion,
    pedidoId: pedidos[0]?.id || null,
    etapa: falla.etapa || "Sin etapa",
    nombreFalla: falla.nombreFalla || falla.nombre || "Falla desde carga inteligente",
    descripcion: falla.descripcion || doc?.textoExtraido?.slice(0, 240),
    frecuencia: falla.frecuencia || 1,
    gravedad: falla.gravedad || 5,
    categoria6M: falla.categoria6M || "Metodo",
    causaRaiz: falla.causaRaiz || "Detectada por carga inteligente",
    accionCorrectiva: falla.accionCorrectiva || "Revisar y corregir el pedido afectado.",
    accionPreventiva: falla.accionPreventiva || "Aplicar checklist preventivo.",
    costoEstimado: falla.costoEstimado || 0,
    estado: "pendiente",
    originalJson: JSON.stringify(falla)
  }));
  const gastos = (data.gastosDetectados || []).map((gasto) => insert("gastos", {
    gestion,
    etapa: gasto.etapa || "Sin etapa",
    fallaRelacionada: gasto.fallaRelacionada || fallas[0]?.nombreFalla || "Carga inteligente",
    tipoGasto: gasto.tipoGasto || "otro",
    descripcion: gasto.descripcion || "Gasto creado desde carga inteligente",
    monto: gasto.monto || 0,
    fecha: new Date().toISOString().slice(0, 10),
    responsable: "Revision de calidad",
    originalJson: JSON.stringify(gasto)
  }));
  update("documentos_cargados", req.params.id, {
    estado: "importado",
    pedidosDetectados: pedidos.length,
    fallasDetectadas: fallas.length,
    gastosDetectados: gastos.length,
    resumenIa: data.resumen || doc?.resumenIa || ""
  });
  res.json({ pedidos, fallas, gastos });
});

router.post("/:id/reject", (req, res) => res.json(update("documentos_cargados", req.params.id, { estado: "rechazado" })));

module.exports = router;
