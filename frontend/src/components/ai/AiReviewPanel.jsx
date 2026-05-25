import { useState } from "react";
import Button from "../common/Button";
export default function AiReviewPanel({ data, onAccept }) {
  const [text, setText] = useState(JSON.stringify(data || {}, null, 2));
  return <article className="card"><h3>Revision de resultados IA</h3><textarea value={text} onChange={(e) => setText(e.target.value)} rows={12} /><div className="actions"><Button onClick={() => onAccept?.(JSON.parse(text))}>Aceptar datos revisados</Button><Button variant="secondary" onClick={() => setText("{}")}>Rechazar</Button></div></article>;
}
