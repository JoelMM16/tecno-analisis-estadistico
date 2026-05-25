import { CrudPage } from "./crudPageFactory";
import StatCard from "../components/common/StatCard";
import CostChart from "../components/charts/CostChart";
import { money } from "../utils/formatters";
export default function Gastos({ gestion, metrics }) {
  const total = metrics?.gastos?.reduce((sum, g) => sum + Number(g.monto || 0), 0) || 0;
  const max = metrics?.gastos?.reduce((top, g) => Number(g.monto || 0) > Number(top?.monto || 0) ? g : top, null);
  const avg = metrics?.gastos?.length ? total / metrics.gastos.length : 0;
  return <><section className="page"><div className="stats-grid"><StatCard title="Total acumulado" value={money(total)} tone="green" /><StatCard title="Gasto promedio" value={money(avg)} /><StatCard title="Gasto mas alto" value={money(max?.monto)} tone="red" /><StatCard title="Tipo destacado" value={max?.tipoGasto || "-"} /></div>{metrics?.charts && <div className="grid-2"><article className="card"><h3>Gasto por tipo</h3><CostChart data={metrics.charts.gastoPorTipo} /></article><article className="card"><h3>Gasto mensual</h3><CostChart data={metrics.charts.gastoMensual} /></article></div>}</section><CrudPage title="Gastos" subtitle="Costos por etapa, falla, tipo y responsable." resource="gastos" gestion={gestion} fields={["gestion", "etapa", "fallaRelacionada", "tipoGasto", "descripcion", "monto", "fecha", "responsable", "observaciones"]} /></>;
}
