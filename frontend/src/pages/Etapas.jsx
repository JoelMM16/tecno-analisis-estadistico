import PageContainer from "../components/layout/PageContainer";
import DataTable from "../components/common/DataTable";
import Badge from "../components/common/Badge";
import { money } from "../utils/formatters";

function riesgo(gravedad, costo) {
  if (gravedad >= 8 || costo >= 800) return ["critica", "red"];
  if (gravedad >= 6 || costo >= 400) return ["alta", "yellow"];
  if (gravedad >= 3) return ["media", "blue"];
  return ["baja", "green"];
}

export default function Etapas({ gestion, metrics }) {
  const rows = (metrics?.etapas || []).map((etapa) => {
    const fallas = (metrics?.fallas || []).filter((f) => f.etapa === etapa.nombreEtapa);
    const gastos = (metrics?.gastos || []).filter((g) => g.etapa === etapa.nombreEtapa);
    const costo = gastos.reduce((sum, g) => sum + Number(g.monto || 0), 0);
    const demora = fallas.reduce((sum, f) => sum + Number(f.tiempoDemoraHoras || 0), 0);
    const maxGravedad = Math.max(0, ...fallas.map((f) => Number(f.gravedad || 0)));
    const [nivel, tone] = riesgo(maxGravedad, costo);
    return { ...etapa, totalFallas: fallas.length, costoAsociado: costo, tiempoDemora: demora, nivelRiesgo: nivel, riesgoTone: tone, recomendacionPrincipal: fallas[0]?.accionPreventiva || etapa.recomendaciones || "Mantener control por checklist." };
  });
  return <PageContainer title="Procesos / Etapas" subtitle={`Indicadores por etapa del proceso textil en la gestion ${gestion}.`}>
    <DataTable rows={rows} columns={[{ key: "orden", label: "Orden" }, { key: "nombreEtapa", label: "Etapa" }, { key: "responsable", label: "Responsable" }, { key: "totalFallas", label: "Fallas" }, { key: "costoAsociado", label: "Costo", render: money }, { key: "tiempoDemora", label: "Demora h" }, { key: "nivelRiesgo", label: "Riesgo", render: (_, row) => <Badge tone={row.riesgoTone}>{row.nivelRiesgo}</Badge> }, { key: "recomendacionPrincipal", label: "Recomendacion" }]} onDetail={(row) => alert(`${row.nombreEtapa}\n\nFallas: ${row.totalFallas}\nCosto: ${money(row.costoAsociado)}\nDemora: ${row.tiempoDemora} h\n\n${row.recomendacionPrincipal}`)} />
  </PageContainer>;
}
