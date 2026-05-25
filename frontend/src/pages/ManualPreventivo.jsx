import Button from "../components/common/Button";
import { CrudPage } from "./crudPageFactory";
import { aiApi } from "../api/aiApi";
import { api } from "../api/api";
export default function ManualPreventivo({ gestion }) {
  const wordUrl = `${api.url}/informes/download?gestion=${gestion}&type=manual&format=docx`;
  const pdfUrl = `${api.url}/informes/download?gestion=${gestion}&type=manual&format=pdf`;
  return <CrudPage title="Manual preventivo" subtitle="Guia de prevencion y correccion de fallas por etapa." resource="manual_preventivo" gestion={gestion} fields={["gestion", "etapa", "fallaRelacionada", "causa", "procedimientoPreventivo", "procedimientoCorrectivo", "responsable", "indicadorControl", "frecuenciaRevision"]} extraActions={() => <><Button variant="secondary" onClick={async () => { const rows = await aiApi.generarManual(gestion); alert(`Manual generado con ${rows.length} procedimientos. Usa Descargar Word/PDF para obtener el documento formal.`); }}>Generar manual con IA</Button><a className="btn btn-secondary" href={wordUrl}>Descargar Word</a><a className="btn btn-secondary" href={pdfUrl}>Descargar PDF</a></>} />;
}
