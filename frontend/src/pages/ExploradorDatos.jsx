import { useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import DataTable from "../components/common/DataTable";
import FilterPanel from "../components/common/FilterPanel";
import { useFilters } from "../hooks/useFilters";
import { downloadWorkbook } from "../services/excelService";
import Button from "../components/common/Button";

export default function ExploradorDatos({ metrics }) {
  const tabs = { "Cargas realizadas": "documentos", Pedidos: "pedidos", Etapas: "etapas", Fallas: "fallas", Gastos: "gastos", "Control de calidad": "control", "Resultados IA": "resultadosIa", "Manual preventivo": "manual" };
  const [tab, setTab] = useState("Cargas realizadas");
  const [normalized, setNormalized] = useState(true);
  const rows = metrics?.[tabs[tab]] || [];
  const { query, setQuery, filtered } = useFilters(rows);
  const columns = Object.keys(rows[0] || {}).slice(0, 9).map((key) => ({ key, label: key }));
  return <PageContainer title="Explorador de datos" subtitle="Vista integral de datos originales y normalizados." actions={<div className="actions"><label className="switch"><input type="checkbox" checked={normalized} onChange={(e) => setNormalized(e.target.checked)} />{normalized ? "Ver datos normalizados" : "Ver datos originales"}</label><Button variant="secondary" onClick={() => downloadWorkbook(`explorador-${tab}.xlsx`, { [tab]: filtered })}>Exportar vista actual</Button></div>}>
    <div className="tabs">{Object.keys(tabs).map((t) => <button className={tab === t ? "active" : ""} onClick={() => setTab(t)} key={t}>{t}</button>)}</div>
    <FilterPanel query={query} setQuery={setQuery} />
    <DataTable rows={filtered} columns={columns} onDetail={(row) => alert(JSON.stringify(row, null, 2))} />
  </PageContainer>;
}
