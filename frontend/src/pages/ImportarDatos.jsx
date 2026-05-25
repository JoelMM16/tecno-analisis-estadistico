import { useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/common/Button";
import FileDropzone from "../components/upload/FileDropzone";
import ImportValidationPanel from "../components/upload/ImportValidationPanel";
import ExcelPreview from "../components/upload/ExcelPreview";
import { excelApi } from "../api/excelApi";
import { previewWorkbook, downloadWorkbook } from "../services/excelService";

export default function ImportarDatos({ reloadMetrics }) {
  const [file, setFile] = useState(null);
  const [validation, setValidation] = useState([]);
  const [preview, setPreview] = useState([]);
  async function handleFile(f) {
    setFile(f);
    setPreview(await previewWorkbook(f));
    const fd = new FormData();
    fd.append("archivo", f);
    setValidation(await excelApi.validar(fd));
  }
  async function importar() {
    if (!file) return alert("Selecciona un archivo Excel primero.");
    const fd = new FormData();
    fd.append("archivo", file);
    const result = await excelApi.importar(fd);
    await reloadMetrics?.();
    alert(`Importacion completada: ${JSON.stringify(result)}`);
  }
  async function exportar() {
    const data = await excelApi.exportar();
    downloadWorkbook("qualitydata-ai-datos-actuales.xlsx", data);
  }
  async function exportarInforme() {
    const data = await excelApi.exportar();
    downloadWorkbook("qualitydata-ai-informe.xlsx", { Indicadores: [data], Fallas: data.fallas, Gastos: data.gastos, ManualPreventivo: data.manual_preventivo });
  }
  return <PageContainer title="Importar datos" subtitle="Plantillas, validacion de columnas, vista previa, importacion y exportacion." actions={<div className="actions"><a className="btn btn-secondary" href={excelApi.templateUrl}>Generar plantilla Excel</a><Button onClick={importar}>Confirmar importacion</Button><Button variant="secondary" onClick={exportar}>Exportar datos actuales</Button><Button variant="secondary" onClick={exportarInforme}>Exportar informe</Button></div>}>
    <FileDropzone onFile={handleFile} accept=".xlsx" />
    <ImportValidationPanel result={validation} />
    <ExcelPreview preview={preview} />
  </PageContainer>;
}
