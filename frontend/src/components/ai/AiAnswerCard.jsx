export default function AiAnswerCard({ answer }) {
  if (!answer) return <article className="card empty-state"><h3>Respuesta del asistente</h3><p>Haz una pregunta sobre pedidos, fallas, gastos, Pareto, 6M o documentos cargados.</p></article>;
  const puntos = answer.puntos || answer.problemasPrincipales || [];
  const recomendaciones = answer.recomendaciones || [];
  return <article className="card ai-answer"><div className="section-row"><h3>{answer.titulo || "Respuesta del asistente"}</h3>{answer.prioridad && <span className="badge badge-yellow">{answer.prioridad}</span>}</div>{answer.aviso && <p className="insight">{answer.aviso}</p>}<p className="answer-summary">{answer.resumen || answer.respuesta || answer.informe}</p>{puntos.length > 0 && <><h4>Puntos importantes</h4><ul className="clean-list">{puntos.map((item, index) => <li key={index}>{typeof item === "string" ? item : JSON.stringify(item)}</li>)}</ul></>}{recomendaciones.length > 0 && <><h4>Recomendaciones</h4><ul className="clean-list">{recomendaciones.map((item, index) => <li key={index}>{item}</li>)}</ul></>}{answer.fuente && <p className="source-note">Fuente: {answer.fuente}</p>}</article>;
}
