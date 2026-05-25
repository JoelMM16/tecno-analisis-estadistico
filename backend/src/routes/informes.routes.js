const express = require("express");
const { metrics } = require("../services/statistics.service");
const { generateReport } = require("../services/ai.service");
const { buildDocxReport, buildPdfReport } = require("../services/report.service");
const router = express.Router();

router.get("/", async (req, res) => {
  const data = metrics(req.query.gestion || "2026");
  res.json({ ...(await generateReport(data)), indicadores: data.indicadores, pareto: data.charts.paretoGeneral, sixM: data.charts.sixM });
});

router.get("/download", async (req, res) => {
  const gestion = req.query.gestion || "2026";
  const type = req.query.type === "manual" ? "manual" : "report";
  const format = req.query.format === "pdf" ? "pdf" : "docx";
  const data = metrics(gestion);
  const buffer = format === "pdf" ? await buildPdfReport(data, type) : await buildDocxReport(data, type);
  const base = type === "manual" ? "manual-preventivo" : "informe-calidad";
  res.setHeader("Content-Disposition", `attachment; filename=${base}-${gestion}.${format}`);
  res.type(format === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  res.send(buffer);
});

module.exports = router;
