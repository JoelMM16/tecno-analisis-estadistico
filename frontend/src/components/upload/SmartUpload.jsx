import { useState } from "react";
import Button from "../common/Button";
import FileDropzone from "./FileDropzone";

export default function SmartUpload({ gestion, onUpload, onAnalyze, onConfirm, onReject, onClear, onTemplate, onErrors, selected }) {
  const [files, setFiles] = useState([]);
  const [text, setText] = useState("");
  async function upload() {
    const fd = new FormData();
    files.slice(0, 5).forEach((file) => fd.append("archivos", file));
    fd.append("textoPegado", text);
    fd.append("gestion", gestion);
    await onUpload(fd);
  }
  return <article className="card smart-upload"><h3>Carga inteligente - Gestion {gestion}</h3><FileDropzone onFile={setFiles} accept=".xlsx,.csv,.docx,.pdf,.png,.jpg,.jpeg,.txt" />{files.length > 0 && <div className="file-list">{files.map((file) => <div className="file-item" key={`${file.name}-${file.size}`}><strong>{file.name}</strong><span>{file.type || "archivo"} · {(file.size / 1024).toFixed(1)} KB</span><span className="badge badge-blue">pendiente</span></div>)}</div>}<textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder="Pegar texto manualmente..." /><div className="actions"><Button onClick={upload}>Subir archivos</Button><Button variant="secondary" onClick={() => document.querySelector(".smart-upload textarea")?.focus()}>Pegar texto</Button><Button variant="secondary" onClick={onTemplate}>Descargar plantilla</Button><Button variant="secondary" onClick={onAnalyze} disabled={!selected}>Analizar con IA</Button><Button variant="secondary" onClick={() => alert("La previsualizacion se muestra debajo con texto extraido y datos detectados.")}>Previsualizar datos</Button><Button onClick={onConfirm} disabled={!selected}>Confirmar importacion</Button><Button variant="danger" onClick={onReject} disabled={!selected}>Cancelar importacion</Button><Button variant="secondary" onClick={onErrors}>Exportar errores</Button><Button variant="secondary" onClick={() => { setFiles([]); setText(""); onClear?.(); }}>Limpiar carga</Button></div></article>;
}
