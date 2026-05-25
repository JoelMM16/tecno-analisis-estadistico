import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
const short = (value = "") => value === "Medio ambiente" ? "Medio amb." : value;
export default function SixMChart({ data = [] }) {
  const chartData = data.map((d) => ({ ...d, label: short(d.nombre) }));
  return <ResponsiveContainer width="100%" height={300}><BarChart data={chartData} margin={{ left: 8, right: 18, bottom: 36 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" tick={{ fontSize: 12 }} interval={0} /><YAxis /><Tooltip labelFormatter={(_, payload) => payload?.[0]?.payload?.nombre || ""} /><Bar dataKey="valor" fill="#7c3aed" radius={[6, 6, 0, 0]} maxBarSize={54} /></BarChart></ResponsiveContainer>;
}
