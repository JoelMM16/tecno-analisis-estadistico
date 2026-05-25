import { useState } from "react";
import Button from "../common/Button";

const tabs = [
  ["pedidosDetectados", "Pedidos detectados"],
  ["etapasDetectadas", "Etapas detectadas"],
  ["fallasDetectadas", "Fallas detectadas"],
  ["gastosDetectados", "Gastos detectados"],
  ["datosControlCalidad", "Control de calidad detectado"],
  ["manualPreventivo", "Recomendaciones detectadas"],
  ["errores", "Errores o advertencias"]
];

function EditableTable({ rows = [], onChange, onDelete }) {
  if (!rows.length) return <p className="muted">No se detectaron registros en esta seccion.</p>;
  const keys = Object.keys(rows[0]).filter((key) => !["originalJson"].includes(key));
  return <div className="table-wrap compact-table"><table><thead><tr>{keys.map((key) => <th key={key}>{key}</th>)}<th>Accion</th></tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{keys.map((key) => <td key={key}><input value={row[key] ?? ""} onChange={(e) => onChange(rowIndex, key, e.target.value)} /></td>)}<td><Button variant="iconDanger" onClick={() => onDelete(rowIndex)}>Quitar</Button></td></tr>)}</tbody></table></div>;
}

export default function UploadPreview({ document, analysis, onAnalysisChange }) {
  const [tab, setTab] = useState("pedidosDetectados");
  const data = analysis || {};
  const rows = Array.isArray(data[tab]) ? data[tab] : [];
  function changeCell(rowIndex, key, value) {
    const nextRows = rows.map((row, index) => index === rowIndex ? { ...row, [key]: value } : row);
    onAnalysisChange?.({ ...data, [tab]: nextRows });
  }
  function deleteRow(rowIndex) {
    const nextRows = rows.filter((_, index) => index !== rowIndex);
    onAnalysisChange?.({ ...data, [tab]: nextRows });
  }
  return <section className="grid-2"><article className="card"><h3>Contenido extraido</h3><div className="text-preview">{document?.textoExtraido || "Sube archivos o pega texto para ver el contenido extraido."}</div></article><article className="card wide-card"><h3>Preview estructurado antes de guardar</h3>{analysis ? <div className="review-summary"><p>{analysis.resumen}</p><div className="mini-stats"><span><strong>{analysis.pedidosDetectados?.length || 0}</strong> pedidos</span><span><strong>{analysis.fallasDetectadas?.length || 0}</strong> fallas</span><span><strong>{analysis.gastosDetectados?.length || 0}</strong> gastos</span><span><strong>{analysis.datosControlCalidad?.length || 0}</strong> control</span></div><div className="tabs">{tabs.map(([key, label]) => <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>{label}</button>)}</div>{tab === "errores" ? <ul className="clean-list">{(analysis.errores || []).length ? analysis.errores.map((e, i) => <li key={i}>{e}</li>) : <li>Sin errores detectados.</li>}</ul> : <EditableTable rows={rows} onChange={changeCell} onDelete={deleteRow} />}</div> : <p>Sube archivos y presiona Analizar con IA para ver pedidos, etapas, fallas, gastos, control y recomendaciones antes de guardar.</p>}</article></section>;
}
