import { useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/common/Button";
import DataTable from "../components/common/DataTable";
import FileDropzone from "../components/upload/FileDropzone";
import DocumentPreview from "../components/upload/DocumentPreview";
import AiReviewPanel from "../components/ai/AiReviewPanel";
import { useDocuments } from "../hooks/useDocuments";
import { documentsApi } from "../api/documentsApi";

export default function Documentos({ reloadMetrics }) {
  const docs = useDocuments();
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [selected, setSelected] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  async function upload() {
    const fd = new FormData();
    if (file) fd.append("archivo", file);
    fd.append("textoPegado", text);
    fd.append("empresaId", 1);
    fd.append("proyectoId", 1);
    const doc = await documentsApi.upload(fd);
    setSelected(doc);
    await docs.reload();
  }
  async function analyze(row) {
    const result = await documentsApi.analyze(row.id);
    setSelected({ ...row, datosDetectados: JSON.stringify(result) });
    setAiResult(result);
    await docs.reload();
  }
  return <PageContainer title="Documentos" subtitle="Carga PDF, imagen, Excel, CSV o texto pegado; extrae texto y lo analiza con IA fallback.">
    <section className="grid-2"><article className="card"><FileDropzone onFile={setFile} /><textarea rows={7} value={text} onChange={(e) => setText(e.target.value)} placeholder="O pega texto manualmente aqui..." /><Button onClick={upload}>Subir / procesar documento</Button></article><DocumentPreview document={selected} /></section>
    {aiResult && <AiReviewPanel data={aiResult} onAccept={() => alert("Resultado aprobado para revision. Usa los botones de creacion en la tabla para guardar fallas o gastos.")} />}
    <DataTable rows={docs.rows} columns={[{ key: "nombreDocumento", label: "Documento" }, { key: "tipoDocumento", label: "Tipo" }, { key: "estado", label: "Estado" }, { key: "createdAt", label: "Fecha" }]} onDetail={setSelected} onEdit={analyze} onDelete={async (row) => alert(`Ver texto extraido:\n\n${row.textoExtraido || "Sin texto"}`)} />
    <div className="actions">{selected && <><Button onClick={() => analyze(selected)}>Analizar con IA</Button><Button variant="secondary" onClick={async () => { await documentsApi.createFallas(selected.id); await reloadMetrics?.(); alert("Fallas creadas desde documento."); }}>Crear fallas desde este documento</Button><Button variant="secondary" onClick={async () => { await documentsApi.createGastos(selected.id); await reloadMetrics?.(); alert("Gastos creados desde documento."); }}>Crear gastos desde este documento</Button></>}</div>
  </PageContainer>;
}
