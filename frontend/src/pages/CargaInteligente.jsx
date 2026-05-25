import { useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/common/Button";
import DataTable from "../components/common/DataTable";
import SmartUpload from "../components/upload/SmartUpload";
import UploadPreview from "../components/upload/UploadPreview";
import { documentsApi } from "../api/documentsApi";
import { excelApi } from "../api/excelApi";
import { useDocuments } from "../hooks/useDocuments";
import { downloadWorkbook } from "../services/excelService";

export default function CargaInteligente({ gestion, reloadMetrics }) {
  const docsResource = useDocuments(gestion);
  const [selected, setSelected] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [importId, setImportId] = useState(null);
  const [processing, setProcessing] = useState(false);

  async function upload(formData) {
    setProcessing(true);
    try {
      const result = await documentsApi.smart(formData);
      setImportId(result.importId);
      setAnalysis(result.preview);
      setSelected({
        id: result.importId,
        nombreDocumento: `Carga inteligente ${result.importId}`,
        textoExtraido: result.files?.map((f) => `Archivo: ${f.nombre}\n${f.textoExtraido || ""}`).join("\n\n---\n\n") || "",
        estado: "preview"
      });
      await docsResource.reload();
    } catch (error) {
      alert("El archivo se cargo, pero no se pudo extraer informacion util.");
    } finally {
      setProcessing(false);
    }
  }

  async function analyze() {
    if (!analysis) return alert("Primero sube archivos para generar una previsualizacion.");
    alert("Los archivos ya fueron extraidos y analizados. Revise y edite las pestañas antes de confirmar.");
  }

  async function confirm() {
    if (!importId || !analysis) return alert("No hay importacion pendiente.");
    const result = await documentsApi.confirmImport({ importId, data: analysis });
    await reloadMetrics?.();
    await docsResource.reload();
    alert(`Importacion confirmada. Pedidos: ${result.resumen.pedidos}, fallas: ${result.resumen.fallas}, gastos: ${result.resumen.gastos}, control: ${result.resumen.control}, manual: ${result.resumen.manual}`);
  }

  async function reject() {
    if (importId) await documentsApi.reject(importId);
    setImportId(null);
    setAnalysis(null);
    setSelected(null);
    await docsResource.reload();
    alert("Importacion cancelada.");
  }

  return <PageContainer title="Carga inteligente" subtitle="Importa Excel, CSV, Word, PDF, imagenes o texto; extrae, estructura, revisa y confirma datos reales para la gestion activa." actions={<div className="actions"><a className="btn btn-secondary" href={excelApi.templateUrl}>Generar plantilla Excel</a><Button variant="secondary" onClick={() => alert("Historial visible en la tabla inferior y en Explorador de datos.")}>Ver historial de cargas</Button></div>}>
    <SmartUpload gestion={gestion} selected={Boolean(importId)} onUpload={upload} onAnalyze={analyze} onConfirm={confirm} onReject={reject} onTemplate={() => window.open(excelApi.templateUrl, "_blank")} onErrors={() => downloadWorkbook("errores-carga-inteligente.xlsx", { Errores: (analysis?.errores || []).map((mensaje) => ({ mensaje })) })} onClear={() => { setImportId(null); setSelected(null); setAnalysis(null); }} />
    {processing && <article className="card insight">Procesando archivos, extrayendo contenido y generando preview estructurado...</article>}
    <UploadPreview document={selected} analysis={analysis} onAnalysisChange={setAnalysis} />
    <DataTable rows={docsResource.rows} columns={[{ key: "nombreDocumento", label: "Carga" }, { key: "gestion", label: "Gestion" }, { key: "tipoDocumento", label: "Tipo" }, { key: "estado", label: "Estado" }, { key: "pedidosDetectados", label: "Pedidos" }, { key: "fallasDetectadas", label: "Fallas" }, { key: "gastosDetectados", label: "Gastos" }, { key: "resumenIa", label: "Resumen" }, { key: "createdAt", label: "Fecha" }]} onDetail={setSelected} onEdit={(row) => { setImportId(row.id); setSelected(row); setAnalysis(row.datosDetectados ? JSON.parse(row.datosDetectados) : null); }} onDelete={async (row) => { await documentsApi.reject(row.id); await docsResource.reload(); }} />
  </PageContainer>;
}
