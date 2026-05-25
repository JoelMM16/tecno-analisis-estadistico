export default function AiSuggestionCard({ title, items = [] }) {
  return <article className="card"><h3>{title}</h3><ul className="clean-list">{items.map((item, index) => <li key={index}>{typeof item === "string" ? item : JSON.stringify(item)}</li>)}</ul></article>;
}
