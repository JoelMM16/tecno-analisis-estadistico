import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
export default function ControlChart({ data = [] }) {
  return <ResponsiveContainer width="100%" height={320}><LineChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="punto" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="valor" stroke="#2563eb" strokeWidth={3} /><Line type="monotone" dataKey="promedio" stroke="#16a34a" dot={false} /><Line type="monotone" dataKey="lsc" stroke="#ef4444" dot={false} /><Line type="monotone" dataKey="lic" stroke="#f59e0b" dot={false} /></LineChart></ResponsiveContainer>;
}
