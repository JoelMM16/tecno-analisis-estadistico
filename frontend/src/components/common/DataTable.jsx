import { useMemo, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Button from "./Button";

export default function DataTable({ rows = [], columns = [], onEdit, onDelete, onDetail }) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: columns[0]?.key, dir: "asc" });
  const pageSize = 10;
  const sorted = useMemo(() => [...rows].sort((a, b) => {
    const av = a[sort.key] ?? "";
    const bv = b[sort.key] ?? "";
    return sort.dir === "asc" ? String(av).localeCompare(String(bv), "es", { numeric: true }) : String(bv).localeCompare(String(av), "es", { numeric: true });
  }), [rows, sort]);
  const pageRows = sorted.slice((page - 1) * pageSize, page * pageSize);
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  return <div className="table-card">
    <div className="table-meta">{rows.length} resultados</div>
    <div className="table-wrap"><table><thead><tr>{columns.map((col) => <th key={col.key} onClick={() => setSort({ key: col.key, dir: sort.dir === "asc" ? "desc" : "asc" })}>{col.label}</th>)}<th>Acciones</th></tr></thead><tbody>{pageRows.map((row) => <tr key={row.id}>{columns.map((col) => <td key={col.key}>{col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}</td>)}<td className="row-actions"><Button variant="icon" onClick={() => onDetail?.(row)} title="Ver detalle"><Eye size={16} /></Button><Button variant="icon" onClick={() => onEdit?.(row)} title="Editar"><Pencil size={16} /></Button><Button variant="iconDanger" onClick={() => onDelete?.(row)} title="Eliminar"><Trash2 size={16} /></Button></td></tr>)}</tbody></table></div>
    <footer className="pager"><Button variant="secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>Anterior</Button><span>Pagina {page} de {pages}</span><Button variant="secondary" disabled={page === pages} onClick={() => setPage(page + 1)}>Siguiente</Button></footer>
  </div>;
}
