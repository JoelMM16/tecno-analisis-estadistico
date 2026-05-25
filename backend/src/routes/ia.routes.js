const express = require("express");
const { analyzeDocument, classifyFailure, generateReport, generateManual, preguntarSobreDatos } = require("../services/ai.service");
const { metrics } = require("../services/statistics.service");
const router = express.Router();

router.post("/analizar-documento", async (req, res) => res.json(await analyzeDocument(req.body.texto || "")));
router.post("/clasificar-falla", async (req, res) => res.json(await classifyFailure(req.body)));
router.post("/generar-informe", async (req, res) => res.json(await generateReport(metrics(req.body.gestion || "2026"))));
router.post("/generar-manual", async (_req, res) => {
  const data = metrics(_req.body.gestion || "2026");
  res.json(await generateManual(data.fallas));
});
router.post("/preguntar", async (req, res) => {
  const gestion = req.body.gestion || "2026";
  const data = metrics(gestion);
  res.json(await preguntarSobreDatos(req.body.pregunta || "", data, { gestion, tipoConsulta: req.body.tipoConsulta, etapa: req.body.etapa }));
});

module.exports = router;
