export default function DocumentPreview({ document }) {
  return <article className="card"><h3>{document?.nombreDocumento || "Documento"}</h3><pre>{document?.textoExtraido || "Sin texto extraido aun."}</pre></article>;
}
