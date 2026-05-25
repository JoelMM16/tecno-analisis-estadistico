import { CrudPage } from "./crudPageFactory";
export default function Empresas() {
  return <CrudPage title="Empresas" subtitle="Registro, edicion, eliminacion y seleccion de empresas." resource="empresas" fields={["nombreEmpresa", "rubro", "descripcion", "ciudad", "responsable", "correo", "telefono", "estado"]} />;
}
