const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeadingLevel } = require("docx");
const PDFDocument = require("pdfkit");

function money(value) {
  return `Bs ${Number(value || 0).toFixed(2)}`;
}

function p(text, opts = {}) {
  return new Paragraph({
    heading: opts.heading,
    spacing: { after: opts.after ?? 180 },
    children: [new TextRun({ text: String(text || ""), bold: opts.bold, size: opts.size || 22 })]
  });
}

function simpleTable(headers, rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: headers.map((h) => new TableCell({ children: [p(h, { bold: true, after: 80 })] })) }),
      ...rows.map((row) => new TableRow({ children: row.map((cell) => new TableCell({ children: [p(cell, { after: 80 })] })) }))
    ]
  });
}

function reportModel(data) {
  const i = data.indicadores || {};
  return {
    titulo: "Informe Ejecutivo de Calidad",
    subtitulo: "Empresa Textil de Uniformes",
    gestion: data.gestion,
    resumen: `En la gestion ${data.gestion}, se analizaron ${i.totalPedidos || 0} pedidos y ${i.totalFallas || 0} fallas. La etapa mas critica es ${i.etapaCritica || "sin datos"} y la falla mas importante es ${i.fallaPrincipal || "sin datos"}.`,
    datos: [
      ["Pedidos analizados", i.totalPedidos || 0],
      ["Fallas registradas", i.totalFallas || 0],
      ["Costo total", money(i.costoTotal)],
      ["Documentos procesados", i.documentosProcesados || 0]
    ],
    fallasCriticas: data.alertas?.slice(0, 8).map((f) => [f.etapa, f.nombreFalla, f.gravedad, money(f.impactoEconomico)]) || [],
    gastos: data.charts?.gastosPorEtapa?.slice(0, 8).map((g) => [g.nombre, money(g.valor)]) || [],
    sixM: data.charts?.sixM?.slice(0, 6).map((s) => [s.nombre, s.valor]) || [],
    recomendaciones: data.recomendaciones?.slice(0, 8) || ["Estandarizar procesos, aplicar checklist y hacer seguimiento semanal."],
    conclusion: "La empresa debe priorizar las etapas con mayor impacto acumulado y sostener controles preventivos con responsables claros."
  };
}

function manualModel(data) {
  return {
    titulo: "Manual Preventivo de Calidad",
    subtitulo: "Empresa Textil de Uniformes",
    gestion: data.gestion,
    objetivo: "Establecer acciones preventivas y correctivas para reducir fallas recurrentes del proceso textil.",
    alcance: "Aplica a pedidos, moldes, corte, maquila, bordado, terminacion y entrega.",
    items: data.manual?.slice(0, 30).map((m) => [m.etapa, m.fallaRelacionada, m.causa, m.procedimientoPreventivo, m.procedimientoCorrectivo, m.responsable, m.indicadorControl]) || [],
    recomendaciones: data.recomendaciones?.slice(0, 8) || ["Revisar el manual semanalmente y actualizarlo con nuevas fallas detectadas."],
    conclusion: "El manual permite prevenir reprocesos, reducir costos y mantener evidencia de control por etapa."
  };
}

async function buildDocxReport(data, type = "report") {
  const model = type === "manual" ? manualModel(data) : reportModel(data);
  const children = [
    p("QualityData AI", { bold: true, size: 28 }),
    p(model.titulo, { heading: HeadingLevel.TITLE, size: 34 }),
    p(model.subtitulo, { size: 26 }),
    p(`Gestion ${model.gestion} - Fecha de generacion ${new Date().toISOString().slice(0, 10)}`),
    p(type === "manual" ? "Objetivo del manual" : "Resumen ejecutivo", { heading: HeadingLevel.HEADING_1 }),
    p(type === "manual" ? model.objetivo : model.resumen),
    ...(type === "manual" ? [p("Alcance", { heading: HeadingLevel.HEADING_1 }), p(model.alcance), p("Tabla de fallas preventivas", { heading: HeadingLevel.HEADING_1 }), simpleTable(["Etapa", "Falla posible", "Causa probable", "Prevencion", "Accion correctiva", "Responsable", "Indicador"], model.items)] : [
      p("Datos analizados", { heading: HeadingLevel.HEADING_1 }),
      simpleTable(["Indicador", "Valor"], model.datos),
      p("Analisis de fallas", { heading: HeadingLevel.HEADING_1 }),
      simpleTable(["Etapa", "Falla", "Gravedad", "Impacto economico"], model.fallasCriticas),
      p("Analisis economico", { heading: HeadingLevel.HEADING_1 }),
      simpleTable(["Etapa", "Costo"], model.gastos),
      p("Analisis 6M", { heading: HeadingLevel.HEADING_1 }),
      simpleTable(["Categoria", "Impacto"], model.sixM)
    ]),
    p("Recomendaciones", { heading: HeadingLevel.HEADING_1 }),
    ...model.recomendaciones.map((r) => p(`• ${r}`)),
    p("Conclusion", { heading: HeadingLevel.HEADING_1 }),
    p(model.conclusion)
  ];
  const doc = new Document({ sections: [{ properties: {}, children }] });
  return Packer.toBuffer(doc);
}

function buildPdfReport(data, type = "report") {
  const model = type === "manual" ? manualModel(data) : reportModel(data);
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 48, size: "A4" });
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.fontSize(12).fillColor("#2563eb").text("QualityData AI");
    doc.moveDown(.5).fontSize(22).fillColor("#0f172a").text(model.titulo, { align: "left" });
    doc.fontSize(13).fillColor("#334155").text(`${model.subtitulo} · Gestion ${model.gestion}`);
    doc.text(`Fecha de generacion ${new Date().toISOString().slice(0, 10)}`);
    doc.moveDown();
    const section = (title) => doc.moveDown(.5).fontSize(15).fillColor("#0f172a").text(title).moveDown(.25).fontSize(10).fillColor("#334155");
    section(type === "manual" ? "Objetivo" : "Resumen ejecutivo");
    doc.text(type === "manual" ? model.objetivo : model.resumen, { lineGap: 4 });
    if (type === "manual") {
      section("Alcance");
      doc.text(model.alcance);
      section("Tabla de fallas preventivas");
      model.items.slice(0, 18).forEach((row) => doc.text(`• ${row[0]}: ${row[1]} | Prevencion: ${row[3]} | Responsable: ${row[5]}`, { lineGap: 3 }));
    } else {
      section("Datos analizados");
      model.datos.forEach(([a, b]) => doc.text(`• ${a}: ${b}`));
      section("Fallas criticas");
      model.fallasCriticas.forEach((row) => doc.text(`• ${row[0]} - ${row[1]} | Gravedad ${row[2]} | ${row[3]}`));
      section("Analisis 6M");
      model.sixM.forEach((row) => doc.text(`• ${row[0]}: ${row[1]}`));
    }
    section("Recomendaciones");
    model.recomendaciones.forEach((r) => doc.text(`• ${r}`, { lineGap: 3 }));
    section("Conclusion");
    doc.text(model.conclusion, { lineGap: 4 });
    doc.end();
  });
}

module.exports = { buildDocxReport, buildPdfReport, reportModel, manualModel };
