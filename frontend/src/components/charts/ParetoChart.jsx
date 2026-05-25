import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const short = (value = "") => value.length > 15 ? `${value.slice(0, 12)}...` : value;

export default function ParetoChart({ data = [] }) {
  const chartData = data.map((d) => ({ ...d, label: short(d.nombre), acumulado: Number(d.porcentajeAcumulado || 0) * 100, valor: Number(d.valor || 0) }));
  const width = Math.max(720, chartData.length * 92);
  return <div className="chart-scroll"><div style={{ minWidth: width, height: 360 }}><ResponsiveContainer width="100%" height="100%"><ComposedChart data={chartData} margin={{ left: 12, right: 24, top: 16, bottom: 74 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" interval={0} tick={{ fontSize: 12 }} angle={-35} textAnchor="end" height={74} /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" domain={[0, 100]} /><Tooltip formatter={(value, name) => [Number(value).toFixed(name === "acumulado" ? 1 : 0), name]} labelFormatter={(_, payload) => payload?.[0]?.payload?.nombre || ""} /><Legend /><Bar yAxisId="left" dataKey="valor" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={46} /><Line yAxisId="right" type="monotone" dataKey="acumulado" stroke="#ef4444" strokeWidth={3} dot /></ComposedChart></ResponsiveContainer></div></div>;
}
