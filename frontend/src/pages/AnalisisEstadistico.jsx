import { useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import ParetoChart from "../components/charts/ParetoChart";
import CostChart from "../components/charts/CostChart";
import SixMChart from "../components/charts/SixMChart";
import ScatterQualityChart from "../components/charts/ScatterQualityChart";
import ControlChart from "../components/charts/ControlChart";
import DataTable from "../components/common/DataTable";
import { percent } from "../utils/formatters";

export default function AnalisisEstadistico({ metrics }) {
  const [tab, setTab] = useState("pareto");
  const [x, setX] = useState("gravedad");
  const [y, setY] = useState("costoEstimado");
  const charts = metrics?.charts || {};
  const variables = ["gravedad", "frecuencia", "costoEstimado", "tiempoDemoraHoras", "cantidadPrendas", "porcentajeDefectos", "numeroFallas"];
  return <PageContainer title="Analisis estadistico" subtitle="Calculos exactos hechos por la app: Pareto, 6M, dispersion y control.">
    <div className="tabs">{["pareto", "etapa", "economico", "6m", "dispersion", "control", "tendencias"].map((t) => <button className={tab === t ? "active" : ""} onClick={() => setTab(t)} key={t}>{t}</button>)}</div>
    {tab === "pareto" && <article className="card"><h3>Pareto general</h3><ParetoChart data={charts.paretoGeneral} /><p className="chart-note">El Pareto ayuda a identificar las fallas que concentran mayor impacto. Se recomienda priorizar las primeras barras porque representan la mayor parte del problema.</p><DataTable rows={charts.paretoGeneral || []} columns={[{ key: "nombre", label: "Falla" }, { key: "valor", label: "Impacto" }, { key: "porcentaje", label: "%", render: percent }, { key: "porcentajeAcumulado", label: "% acum.", render: percent }]} /></article>}
    {tab === "etapa" && <article className="card"><h3>Pareto por etapa</h3><CostChart data={charts.fallasPorEtapa} /><p className="chart-note">Muestra que etapas del proceso textil concentran mayor impacto de fallas.</p></article>}
    {tab === "economico" && <article className="card"><h3>Pareto economico</h3><ParetoChart data={charts.paretoGastos} /><p className="chart-note">Identifica las fallas o conceptos que generan mayor gasto estimado.</p></article>}
    {tab === "6m" && <article className="card"><h3>Analisis 6M</h3><SixMChart data={charts.sixM} /><p className="chart-note">Clasifica causas raiz en Metodo, Mano de obra, Maquina, Materiales, Medicion y Medio ambiente.</p></article>}
    {tab === "dispersion" && <article className="card"><h3>Diagrama de dispersion</h3><div className="actions"><select value={x} onChange={(e) => setX(e.target.value)}>{variables.map((v) => <option key={v}>{v}</option>)}</select><select value={y} onChange={(e) => setY(e.target.value)}>{variables.map((v) => <option key={v}>{v}</option>)}</select></div><ScatterQualityChart data={charts.dispersion} x={x} y={y} /><p className="chart-note">Permite observar relaciones entre variables, por ejemplo gravedad contra costo.</p></article>}
    {tab === "control" && <article className="card"><h3>Diagrama de control</h3><ControlChart data={charts.controlFallas} /><p className="chart-note">Este grafico permite observar si el proceso se mantiene estable o si existen puntos fuera de control.</p></article>}
    {tab === "tendencias" && <article className="card"><h3>Tendencias por gestion</h3><CostChart data={(charts.tendenciasGestion || []).map((g) => ({ nombre: g.gestion, valor: g.pedidos }))} /><p className="chart-note">Compara el volumen de pedidos entre gestiones para observar crecimiento o variaciones.</p></article>}
  </PageContainer>;
}
