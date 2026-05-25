import { useMemo, useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/common/Button";
import DataTable from "../components/common/DataTable";
import FilterPanel from "../components/common/FilterPanel";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { useResource } from "../hooks/useResource";
import { useFilters } from "../hooks/useFilters";
import { downloadWorkbook } from "../services/excelService";

export function CrudPage({ title, subtitle, resource, fields, columns, defaults = {}, extraActions, gestion }) {
  const api = useResource(resource, { gestion });
  const { query, setQuery, filtered } = useFilters(api.rows);
  const [editing, setEditing] = useState(null);
  const [detail, setDetail] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [form, setForm] = useState(defaults);
  const tableColumns = useMemo(() => columns || fields.slice(0, 8).map((field) => ({ key: field, label: field })), [columns, fields]);
  function startCreate() { setForm({ gestion, ...defaults }); setEditing({}); }
  function startEdit(row) { setForm(row); setEditing(row); }
  async function save() {
    if (editing?.id) await api.update(editing.id, form);
    else await api.create(form);
    setEditing(null);
  }
  async function confirmDelete() {
    await api.remove(removing.id);
    setRemoving(null);
  }
  return <PageContainer title={title} subtitle={subtitle} actions={<div className="actions"><Button onClick={startCreate}>Crear</Button><Button variant="secondary" onClick={() => downloadWorkbook(`${resource}.xlsx`, { [title]: filtered })}>Exportar vista</Button>{extraActions?.(api)}</div>}>
    <FilterPanel query={query} setQuery={setQuery} />
    <DataTable rows={filtered} columns={tableColumns} onEdit={startEdit} onDelete={setRemoving} onDetail={setDetail} />
    <Modal open={Boolean(editing)} title={editing?.id ? `Editar ${title}` : `Crear ${title}`} onClose={() => setEditing(null)}>
      <div className="form-grid">{fields.map((field) => <label key={field}>{field}<input value={form[field] ?? ""} onChange={(e) => setForm({ ...form, [field]: e.target.value })} /></label>)}</div>
      <div className="actions"><Button onClick={save}>Guardar</Button><Button variant="secondary" onClick={() => setEditing(null)}>Cancelar</Button></div>
    </Modal>
    <Modal open={Boolean(detail)} title="Detalle" onClose={() => setDetail(null)}><pre>{JSON.stringify(detail, null, 2)}</pre></Modal>
    <ConfirmDialog open={Boolean(removing)} message={`Eliminar registro ${removing?.id}?`} onCancel={() => setRemoving(null)} onConfirm={confirmDelete} />
  </PageContainer>;
}
