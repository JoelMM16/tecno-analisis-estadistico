export default function ImportValidationPanel({ result = [] }) {
  return <div className="preview-grid">{result.map((item) => <article className={`card ${item.valido ? "ok" : "warn"}`} key={item.hoja}><h3>{item.hoja}</h3><p>{item.valido ? "Columnas validas" : `Faltan: ${item.faltantes.join(", ")}`}</p><small>{item.filas} filas detectadas</small></article>)}</div>;
}
