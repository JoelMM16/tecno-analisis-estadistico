import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import CargaInteligente from "./pages/CargaInteligente";
import ExploradorDatos from "./pages/ExploradorDatos";
import Pedidos from "./pages/Pedidos";
import Etapas from "./pages/Etapas";
import Fallas from "./pages/Fallas";
import Gastos from "./pages/Gastos";
import AnalisisEstadistico from "./pages/AnalisisEstadistico";
import AsistenteIA from "./pages/AsistenteIA";
import Informes from "./pages/Informes";
import ManualPreventivo from "./pages/ManualPreventivo";
import Configuracion from "./pages/Configuracion";
import { useQualityMetrics } from "./hooks/useQualityMetrics";
import { useAuth } from "./hooks/useAuth";
import { useGestion } from "./hooks/useGestion";
import { api } from "./api/api";

export default function App() {
  const auth = useAuth();
  const { gestion, setGestion } = useGestion();
  const { data, reload } = useQualityMetrics(gestion);
  const [aiStatus, setAiStatus] = useState(null);
  useEffect(() => { api.get("/config/status").then(setAiStatus).catch(() => setAiStatus({ aiEnabled: false, aiStatus: "Backend no disponible" })); }, []);
  return <ProtectedRoute authenticated={auth.isAuthenticated} onLogin={auth.login}>
    <div className="app-shell"><Sidebar /><div className="workspace"><Header metrics={data} gestion={gestion} setGestion={setGestion} onRefresh={reload} onLogout={auth.logout} aiStatus={aiStatus} /><Routes>
      <Route path="/" element={<Dashboard metrics={data} gestion={gestion} reload={reload} />} />
      <Route path="/carga" element={<CargaInteligente gestion={gestion} reloadMetrics={reload} />} />
      <Route path="/explorador" element={<ExploradorDatos metrics={data} gestion={gestion} />} />
      <Route path="/pedidos" element={<Pedidos gestion={gestion} />} />
      <Route path="/etapas" element={<Etapas gestion={gestion} metrics={data} />} />
      <Route path="/fallas" element={<Fallas gestion={gestion} reloadMetrics={reload} />} />
      <Route path="/gastos" element={<Gastos gestion={gestion} metrics={data} />} />
      <Route path="/analisis" element={<AnalisisEstadistico metrics={data} gestion={gestion} />} />
      <Route path="/asistente" element={<AsistenteIA gestion={gestion} />} />
      <Route path="/informes" element={<Informes metrics={data} gestion={gestion} />} />
      <Route path="/manual" element={<ManualPreventivo gestion={gestion} />} />
      <Route path="/configuracion" element={<Configuracion reloadMetrics={reload} metrics={data} gestion={gestion} aiStatus={aiStatus} />} />
    </Routes></div></div>
  </ProtectedRoute>;
}
