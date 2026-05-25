const fs = require("fs");
const XLSX = require("xlsx");

async function extractText(file, pastedText = "") {
  if (pastedText) return pastedText;
  if (!file) return "";
  const name = file.originalname.toLowerCase();
  if (name.endsWith(".csv") || name.endsWith(".txt")) return fs.readFileSync(file.path, "utf8");
  if (name.endsWith(".xlsx")) {
    const wb = XLSX.readFile(file.path);
    return wb.SheetNames.map((sheet) => {
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheet], { defval: "" });
      return `${sheet}\n${JSON.stringify(rows.slice(0, 50), null, 2)}`;
    }).join("\n\n");
  }
  if (name.endsWith(".docx")) {
    try {
      const mammoth = require("mammoth");
      const result = await mammoth.extractRawText({ path: file.path });
      return result.value || "Documento Word sin texto detectable.";
    } catch {
      return "No se pudo extraer texto del documento Word.";
    }
  }
  if (name.endsWith(".pdf")) {
    try {
      const pdfParse = require("pdf-parse");
      const data = await pdfParse(fs.readFileSync(file.path));
      return data.text || "PDF escaneado o sin texto detectable. OCR preparado para la siguiente version.";
    } catch {
      return "No se pudo extraer texto del PDF. OCR preparado para la siguiente version.";
    }
  }
  if (/\.(png|jpg|jpeg|webp|bmp)$/i.test(name)) {
    try {
      const { createWorker } = require("tesseract.js");
      const worker = await createWorker("spa");
      const { data } = await worker.recognize(file.path);
      await worker.terminate();
      return data.text;
    } catch {
      return "OCR preparado para la siguiente version. No se pudo ejecutar Tesseract en este entorno.";
    }
  }
  return "Tipo de documento cargado. Extraccion avanzada preparada para la siguiente version.";
}

module.exports = { extractText };
