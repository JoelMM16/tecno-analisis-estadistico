import { useState } from "react";
import Button from "../common/Button";
import AiAnswerCard from "./AiAnswerCard";
import { aiApi } from "../../api/aiApi";

const examples = [
  "Cual es la etapa mas critica de esta gestion?",
  "Que falla genera mas costo?",
  "Explicame el Pareto general en palabras simples.",
  "Que acciones preventivas recomiendas para moldes?"
];

export default function AiChatPanel({ gestion }) {
  const [pregunta, setPregunta] = useState(examples[0]);
  const [tipo, setTipo] = useState("General");
  const [etapa, setEtapa] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  async function ask(text = pregunta) {
    setLoading(true);
    setAnswer(await aiApi.preguntar({ pregunta: text, gestion, tipoConsulta: tipo, etapa }));
    setLoading(false);
  }
  return <section className="chat-layout"><article className="card"><h3>Preguntas sobre datos cargados</h3><div className="form-grid compact"><label>Gestion<input value={gestion} readOnly /></label><label>Tipo de consulta<select value={tipo} onChange={(e) => setTipo(e.target.value)}><option>General</option><option>Fallas</option><option>Gastos</option><option>Informes</option><option>Manual</option></select></label></div><input value={etapa} onChange={(e) => setEtapa(e.target.value)} placeholder="Etapa opcional, por ejemplo Preparacion de moldes" /><textarea value={pregunta} onChange={(e) => setPregunta(e.target.value)} rows={5} placeholder="Pregunta sobre documentos, fallas, gastos o indicadores..." /><div className="actions"><Button onClick={() => ask()} disabled={loading}>{loading ? "Consultando..." : "Preguntar"}</Button>{examples.map((example) => <Button key={example} variant="secondary" onClick={() => { setPregunta(example); ask(example); }}>{example}</Button>)}</div></article><AiAnswerCard answer={answer} /></section>;
}
