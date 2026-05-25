import { useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/common/Button";
import AiGeneratedReportPreview from "../components/ai/AiGeneratedReportPreview";
import { aiApi } from "../api/aiApi";
import { api } from "../api/api";

export default function Informes({ metrics, gestion }) {
  const [report, setReport] = useState(null);
  async function generate() {
    const result = await aiApi.generarInforme(gestion);
    setReport({
      titulo: "Informe Ejecutivo de Calidad",
      subtitulo: `Empresa Textil de Uniformes · Gestion ${gestion}`,
      resumen: result.informe,
      problemas: [
        `Etapa mas critica: ${metrics?.indicadores?.etapaCritica || "Sin datos"}`,
        `Falla principal: ${metrics?.indicadores?.fallaPrincipal || "Sin datos"}`,
        `Costo total: ${Number(metrics?.indicadores?.costoTotal || 0).toFixed(2)}`
      ],
      recomendaciones: result.recomendaciones || [],
      conclusion: result.conclusion
    });
  }
  const wordUrl = `${api.url}/informes/download?gestion=${gestion}&type=report&format=docx`;
  const pdfUrl = `${api.url}/informes/download?gestion=${gestion}&type=report&format=pdf`;
  return <PageContainer title="Informes" subtitle="Genera informes formales de gestion en Word y PDF, con previsualizacion limpia para feria." actions={<div className="actions"><Button onClick={generate}>Generar informe</Button><a className="btn btn-secondary" href={wordUrl}>Descargar Word</a><a className="btn btn-secondary" href={pdfUrl}>Descargar PDF</a><Button variant="secondary" onClick={generate}>Regenerar con IA</Button></div>}>
    <section className="grid-2"><article className="card"><h3>Datos usados</h3><ul className="clean-list"><li>{metrics?.indicadores?.totalPedidos || 0} pedidos analizados</li><li>{metrics?.indicadores?.totalFallas || 0} fallas registradas</li><li>{metrics?.gastos?.length || 0} gastos asociados</li><li>{metrics?.indicadores?.documentosProcesados || 0} documentos procesados</li></ul></article><AiGeneratedReportPreview report={report || { titulo: "Informe Ejecutivo de Calidad", subtitulo: `Empresa Textil de Uniformes · Gestion ${gestion}`, resumen: "Presiona Generar informe para crear una version redactada con IA o reglas locales.", problemas: ["El informe incluira fallas criticas, costos, 6M y recomendaciones."], recomendaciones: metrics?.recomendaciones?.slice(0, 4) || [], conclusion: "La conclusion se generara a partir de los indicadores de la gestion." }} /></section>
  </PageContainer>;
}
