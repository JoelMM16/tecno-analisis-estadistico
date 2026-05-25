import * as XLSX from "xlsx";

export function downloadWorkbook(name, sheets) {
  const wb = XLSX.utils.book_new();
  Object.entries(sheets).forEach(([sheetName, rows]) => {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows || []), sheetName);
  });
  XLSX.writeFile(wb, name);
}

export async function previewWorkbook(file) {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer);
  return wb.SheetNames.map((sheet) => ({ hoja: sheet, filas: XLSX.utils.sheet_to_json(wb.Sheets[sheet], { defval: "" }).slice(0, 8) }));
}
