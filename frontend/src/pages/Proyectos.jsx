import { CrudPage } from "./crudPageFactory";
export default function Proyectos() {
  return <CrudPage title="Proyectos de analisis" resource="proyectos" fields={["empresaId", "nombreProyecto", "objetivo", "fechaInicio", "fechaFin", "muestraPedidos", "estado"]} />;
}
