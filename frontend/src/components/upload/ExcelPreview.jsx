export default function ExcelPreview({ preview = [] }) {
  return <div className="preview-grid">{preview.map((sheet) => <article className="card" key={sheet.hoja}><h3>{sheet.hoja}</h3><small>{sheet.filas?.length || sheet.filas || 0} filas en vista previa</small><pre>{JSON.stringify(sheet.preview || sheet.filas || [], null, 2)}</pre></article>)}</div>;
}
