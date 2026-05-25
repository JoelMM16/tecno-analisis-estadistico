import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import { CrudPage } from "./crudPageFactory";
import { aiApi } from "../api/aiApi";
function criticidad(gravedad) {
  const g = Number(gravedad || 0);
  if (g >= 8) return ["critica", "red"];
  if (g >= 6) return ["alta", "yellow"];
  if (g >= 4) return ["media", "blue"];
  return ["baja", "green"];
}
export default function Fallas({ gestion }) {
  return <CrudPage title="Fallas" subtitle="Impacto = frecuencia x gravedad. Impacto economico = frecuencia x costo estimado." resource="fallas" gestion={gestion} fields={["gestion", "pedidoId", "etapa", "nombreFalla", "descripcion", "frecuencia", "gravedad", "tiempoDemoraHoras", "costoEstimado", "categoria6M", "causaRaiz", "accionCorrectiva", "accionPreventiva", "estado", "fechaRegistro"]} columns={[{ key: "nombreFalla", label: "Falla" }, { key: "etapa", label: "Etapa" }, { key: "gravedad", label: "Gravedad" }, { key: "criticidad", label: "Criticidad", render: (_, row) => { const [label, tone] = criticidad(row.gravedad); return <Badge tone={tone}>{label}</Badge>; } }, { key: "impacto", label: "Impacto" }, { key: "costoEstimado", label: "Costo" }, { key: "categoria6M", label: "6M" }, { key: "estado", label: "Estado" }]} extraActions={(api) => <><Button variant="secondary" onClick={async () => { const first = api.rows.find((f) => Number(f.gravedad) >= 7) || api.rows[0]; if (!first) return alert("No hay fallas para analizar."); const r = await aiApi.clasificarFalla(first); alert(`${r.categoria6M}\n${r.causaRaiz}\n\nCorrectiva: ${r.accionCorrectiva}\nPreventiva: ${r.accionPreventiva}`); }}>Analizar con IA</Button><Button variant="secondary" onClick={() => alert("Filtro rapido: usa la busqueda para escribir critica o revisa las fallas con gravedad mayor o igual a 7.")}>Solo criticas</Button><Button variant="secondary" onClick={() => alert("Revision sugerida: ordenar por accionPreventiva y completar las filas vacias.")}>Sin accion preventiva</Button></>} />;
}
