export default function AiInsightPanel({ title, children }) {
  return <article className="card insight-panel"><h3>{title}</h3>{children}</article>;
}
