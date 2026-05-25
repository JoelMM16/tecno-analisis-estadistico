import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const short = (value = "") => value.length > 15 ? `${value.slice(0, 12)}...` : value;

export default function CostChart({ data = [] }) {
  const chartData = data.map((d) => ({ ...d, label: short(d.nombre) }));
  const width = Math.max(680, chartData.length * 92);
  return <div className="chart-scroll"><div style={{ minWidth: width, height: 320 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} margin={{ left: 8, right: 20, top: 12, bottom: 68 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" interval={0} tick={{ fontSize: 12 }} angle={-35} textAnchor="end" height={68} /><YAxis /><Tooltip labelFormatter={(_, payload) => payload?.[0]?.payload?.nombre || ""} /><Bar dataKey="valor" fill="#059669" radius={[6, 6, 0, 0]} maxBarSize={46} /></BarChart></ResponsiveContainer></div></div>;
}
