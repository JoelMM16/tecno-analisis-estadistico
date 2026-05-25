export default function StatCard({ title, value, detail, tone = "blue" }) {
  return <article className={`stat stat-${tone}`}><span>{title}</span><strong>{value}</strong>{detail && <small>{detail}</small>}</article>;
}
