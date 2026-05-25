import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";
export default function ScatterQualityChart({ data = [], x = "gravedad", y = "costoEstimado" }) {
  return <ResponsiveContainer width="100%" height={320}><ScatterChart margin={{ left: 10, right: 20, bottom: 20 }}><CartesianGrid /><XAxis dataKey={x} name={x} /><YAxis dataKey={y} name={y} /><ZAxis range={[80, 220]} /><Tooltip cursor={{ strokeDasharray: "3 3" }} /><Scatter data={data} fill="#0f766e" /></ScatterChart></ResponsiveContainer>;
}
