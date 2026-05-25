import { useMemo, useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/common/Button";
import StatCard from "../components/common/StatCard";
import ParetoChart from "../components/charts/ParetoChart";
import CostChart from "../components/charts/CostChart";
import SixMChart from "../components/charts/SixMChart";
import Badge from "../components/common/Badge";
import { money } from "../utils/formatters";

function group(rows, key, valueFn) {
  const map = new Map();
  rows.forEach((row) => map.set(row[key] || "Sin clasificar", (map.get(row[key] || "Sin clasificar") || 0) + Number(valueFn(row) || 0)));
  return [...map.entries()].map(([nombre, valor]) => ({ nombre, valor })).sort((a, b) => b.valor - a.valor);
}

function pareto(rows, key, valueFn) {
  const base = group(rows, key, valueFn);
  const total = base.reduce((sum, item) => sum + item.valor, 0) || 1;
  let acc = 0;
  return base.map((item) => {
    acc += item.valor;
    return { ...item, porcentaje: item.valor / total, porcentajeAcumulado: acc / total };
  });
}

function criticidad(gravedad) {
  const g = Number(gravedad || 0);
  if (g >= 8) return "Critica";
  if (g >= 6) return "Alta";
  if (g >= 4) return "Media";
  return "Baja";
}

export default function Dashboard({ metrics, gestion }) {
  const [filters, setFilters] = useState({ etapa: "", estado: "", criticidad: "", desde: "", hasta: "" });
  const [sixMMode, setSixMMode] = useState("impacto");
  const i = metrics?.indicadores || {};
  const fallas = metrics?.fallas || [];
  const gastos = metrics?.gastos || [];
  const etapas = [...new Set(fallas.map((f) => f.etapa).filter(Boolean))];
  const estados = [...new Set(fallas.map((f) => f.estado).filter(Boolean))];
  const filteredFallas = useMemo(() => fallas.filter((f) => {
    if (filters.etapa && f.etapa !== filters.etapa) return false;
    if (filters.estado && f.estado !== filters.estado) return false;
    if (filters.criticidad && criticidad(f.gravedad) !== filters.criticidad) return false;
    if (filters.desde && String(f.fechaRegistro || "") < filters.desde) return false;
    if (filters.hasta && String(f.fechaRegistro || "") > filters.hasta) return false;
    return true;
  }), [fallas, filters]);
  const filteredGastos = useMemo(() => gastos.filter((g) => !filters.etapa || g.etapa === filters.etapa), [gastos, filters.etapa]);
  const charts = {
    paretoGeneral: pareto(filteredFallas, "nombreFalla", (f) => f.impacto),
    fallasPorEtapa: group(filteredFallas, "etapa", (f) => f.impacto),
    gastosPorEtapa: group(filteredGastos, "etapa", (g) => g.monto),
    fallasMensuales: group(filteredFallas.map((f) => ({ ...f, mes: String(f.fechaRegistro || "").slice(0, 7) || "Sin fecha" })), "mes", () => 1),
    sixM: group(filteredFallas, "categoria6M", (f) => sixMMode === "cantidad" ? 1 : sixMMode === "costo" ? f.impactoEconomico : f.impacto)
  };
  const totalSixM = charts.sixM.reduce((sum, item) => sum + item.valor, 0) || 1;
  const topSixM = charts.sixM[0];
  return <PageContainer title="Dashboard general" subtitle={`Indicadores claros de la gestion ${gestion} para la Empresa Textil de Uniformes.`}>
    {(i.totalPedidos || 0) === 0 && (i.totalFallas || 0) === 0 && <article className="card insight">No hay datos importados para esta gestion. Usa Carga inteligente para subir Excel, Word, PDF o imagenes.</article>}
    {(i.totalPedidos || 0) > 0 && <article className="card insight"><strong>Analisis inteligente cargado:</strong> el sistema proceso datos operativos, documentos de calidad y registros de costos. Detecto fallas por etapa, calculo impacto economico, clasifico causas 6M y genero recomendaciones preventivas para priorizar la mejora.</article>}
    <section className="filter-panel dashboard-filters">
      <select value={gestion} disabled><option>Gestion {gestion}</option></select>
      <label>Desde<input type="date" value={filters.desde} onChange={(e) => setFilters({ ...filters, desde: e.target.value })} /></label>
      <label>Hasta<input type="date" value={filters.hasta} onChange={(e) => setFilters({ ...filters, hasta: e.target.value })} /></label>
      {etapas.length > 0 && <select value={filters.etapa} onChange={(e) => setFilters({ ...filters, etapa: e.target.value })}><option value="">Etapa: Todas</option>{etapas.map((e) => <option key={e}>{e}</option>)}</select>}
      {estados.length > 0 && <select value={filters.estado} onChange={(e) => setFilters({ ...filters, estado: e.target.value })}><option value="">Estado: Todos</option>{estados.map((e) => <option key={e}>{e}</option>)}</select>}
      <select value={filters.criticidad} onChange={(e) => setFilters({ ...filters, criticidad: e.target.value })}><option value="">Criticidad: Todas</option><option>Critica</option><option>Alta</option><option>Media</option><option>Baja</option></select>
      <Button variant="secondary" onClick={() => setFilters({ etapa: "", estado: "", criticidad: "", desde: "", hasta: "" })}>Limpiar filtros</Button>
    </section>
    <section className="stats-grid">
      <StatCard title="Total de pedidos" value={i.totalPedidos || 0} />
      <StatCard title="Total de fallas" value={filteredFallas.length || 0} tone="red" />
      <StatCard title="Costo total de fallas" value={money(filteredFallas.reduce((s, f) => s + Number(f.impactoEconomico || 0), 0))} tone="green" />
      <StatCard title="Tiempo total de demora" value={`${filteredFallas.reduce((s, f) => s + Number(f.tiempoDemoraHoras || 0), 0).toFixed(0)} h`} tone="yellow" />
      <StatCard title="Pedidos retrasados" value={i.pedidosRetrasados || 0} tone="yellow" />
      <StatCard title="Etapa mas critica" value={charts.fallasPorEtapa[0]?.nombre || "-"} tone="red" />
      <StatCard title="Falla mas importante" value={charts.paretoGeneral[0]?.nombre || "-"} />
      <StatCard title="Documentos procesados" value={i.documentosProcesados || 0} />
    </section>
    <section className="grid-2">
      <article className="card"><h3>Pareto general de fallas detectadas</h3><ParetoChart data={charts.paretoGeneral} /><p className="chart-note">El Pareto muestra que pocas fallas concentran la mayor parte del impacto. Las primeras barras son la prioridad de accion para la feria.</p></article>
      <article className="card"><h3>Fallas por etapa</h3><CostChart data={charts.fallasPorEtapa} /></article>
      <article className="card"><h3>Gastos por etapa</h3><CostChart data={charts.gastosPorEtapa} /></article>
      <article className="card"><div className="section-row"><h3>Causas raiz por metodologia 6M</h3><select value={sixMMode} onChange={(e) => setSixMMode(e.target.value)}><option value="cantidad">Cantidad</option><option value="impacto">Impacto</option><option value="costo">Costo</option></select></div><p className="chart-note">Este grafico clasifica las fallas segun su causa principal: Metodo, Mano de obra, Maquina, Materiales, Medicion y Medio ambiente.</p><SixMChart data={charts.sixM} />{topSixM && <p className="insight">Segun los datos, la categoria 6M mas critica es <strong>{topSixM.nombre}</strong> porque concentra <strong>{((topSixM.valor / totalSixM) * 100).toFixed(1)}%</strong> del {sixMMode === "costo" ? "costo total" : sixMMode === "cantidad" ? "total de fallas" : "impacto total"}.</p>}</article>
      <article className="card"><h3>Evolucion mensual de fallas</h3><CostChart data={charts.fallasMensuales} /></article>
    </section>
    <section className="grid-2"><article className="card"><h3>7 errores destacados y alertas criticas</h3><ul className="clean-list">{filteredFallas.filter((a) => Number(a.gravedad) >= 7).slice(0, 7).map((a) => <li key={a.id}><Badge tone="red">{criticidad(a.gravedad)}</Badge> {a.nombreFalla} - {a.etapa}</li>)}</ul></article><article className="card"><h3>Recomendaciones generadas</h3><ul className="clean-list">{metrics?.recomendaciones?.slice(0, 7).map((r, idx) => <li key={idx}>{r}</li>)}</ul></article></section>
  </PageContainer>;
}
