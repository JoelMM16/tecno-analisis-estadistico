import { CrudPage } from "./crudPageFactory";
export default function Pedidos({ gestion }) {
  return <CrudPage title="Pedidos" subtitle="Tabla filtrable con pedidos, estados y fechas de entrega." resource="pedidos" gestion={gestion} fields={["gestion", "codigoPedido", "cliente", "fechaPedido", "fechaEntregaPrometida", "fechaEntregaReal", "tipoPrenda", "cantidadPrendas", "estado", "etapaActual", "observaciones"]} />;
}
