require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { initDatabase, all, db } = require("./database/db");
const { seedDemoData, resetDemo } = require("./database/seedDemoData");
const { metrics } = require("./services/statistics.service");
const { makeTemplate, validateWorkbook, importWorkbook } = require("./services/excel.service");

initDatabase();
seedDemoData();

const app = express();
const upload = multer();
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => res.json({ ok: true, app: "QualityData AI", port: process.env.PORT || 3000 }));
function isAiEnabled() {
  return Boolean(process.env.OPENAI_API_KEY) && !process.env.OPENAI_API_KEY.includes("PEGA_AQUI") && process.env.AI_ENABLED !== "false";
}

app.get("/api/config/status", (_req, res) => res.json({
  ok: true,
  aiEnabled: isAiEnabled(),
  aiStatus: isAiEnabled() ? "IA activa" : "IA desactivada - modo reglas locales"
}));
app.post("/api/auth/login", (req, res) => {
  const user = db.prepare("SELECT id, usuario, nombre, rol, gestion FROM usuarios WHERE usuario = ? AND password = ?").get(req.body.usuario, req.body.password);
  if (!user) return res.status(401).json({ error: "Credenciales invalidas" });
  res.json({ token: "demo-token-qualitydata", user, empresa: db.prepare("SELECT * FROM empresa_demo LIMIT 1").get() });
});
app.get("/api/auth/demo", (_req, res) => res.json({
  usuario: "demo@textilquality.com",
  password: "demo123",
  empresa: db.prepare("SELECT * FROM empresa_demo LIMIT 1").get()
}));
app.get("/api/metrics", (req, res) => res.json(metrics(req.query.gestion || "2026")));
app.get("/api/dashboard", (req, res) => res.json(metrics(req.query.gestion || "2026")));
app.get("/api/analytics", (req, res) => res.json(metrics(req.query.gestion || "2026").charts));
app.post("/api/demo/load", (_req, res) => res.json(seedDemoData({ reset: false })));
app.post("/api/demo/clear", (_req, res) => {
  resetDemo();
  res.json({ ok: true });
});
app.post("/api/demo/restore", (_req, res) => res.json(seedDemoData({ reset: true })));

app.get("/api/excel/template", (_req, res) => {
  res.setHeader("Content-Disposition", "attachment; filename=plantilla-qualitydata-ai.xlsx");
  res.type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet").send(makeTemplate());
});
app.get("/api/excel/export", (_req, res) => res.json({
  empresa_demo: all("empresa_demo"),
  gestiones: all("gestiones"),
  etapas: all("etapas"),
  pedidos: all("pedidos"),
  fallas: all("fallas"),
  gastos: all("gastos"),
  documentos_cargados: all("documentos_cargados"),
  control_calidad: all("control_calidad"),
  manual_preventivo: all("manual_preventivo")
}));
app.post("/api/excel/validate", upload.single("archivo"), (req, res) => res.json(validateWorkbook(req.file.buffer)));
app.post("/api/excel/import", upload.single("archivo"), (req, res) => res.json(importWorkbook(req.file.buffer, req.body.gestion || "2026")));

app.use("/api/pedidos", require("./routes/pedidos.routes"));
app.use("/api/etapas", require("./routes/etapas.routes"));
app.use("/api/fallas", require("./routes/fallas.routes"));
app.use("/api/gastos", require("./routes/gastos.routes"));
app.use("/api/documentos", require("./routes/documentos.routes"));
app.use("/api/upload", require("./routes/documentos.routes"));
app.use("/api/ia", require("./routes/ia.routes"));
app.use("/api/informes", require("./routes/informes.routes"));
app.use("/api/manual_preventivo", require("./routes/generic.routes").crudRoutes("manual_preventivo"));
app.use("/api/control_calidad", require("./routes/generic.routes").crudRoutes("control_calidad"));
app.use("/api/resultados_ia", require("./routes/generic.routes").crudRoutes("resultados_ia"));
app.use("/api/documentos_cargados", require("./routes/generic.routes").crudRoutes("documentos_cargados"));
app.use("/api/gestiones", require("./routes/generic.routes").crudRoutes("gestiones"));

app.get("/api/:table", (req, res) => {
  const allowed = ["control_calidad", "manual_preventivo", "resultados_ia", "textos_extraidos", "documentos_cargados", "gestiones", "empresa_demo", "informes_generados"];
  if (!allowed.includes(req.params.table)) return res.status(404).json({ error: "Modulo no encontrado" });
  res.json(db.prepare(`SELECT * FROM ${req.params.table} ORDER BY id DESC`).all());
});

module.exports = app;
