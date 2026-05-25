import { LogOut, RefreshCw } from "lucide-react";
import Button from "../common/Button";
import Badge from "../common/Badge";
export default function Header({ metrics, gestion, setGestion, onRefresh, onLogout, aiStatus }) {
  return <header className="topbar"><div><h1>{metrics?.empresa?.nombreEmpresa || "Empresa Textil de Uniformes"}</h1><p>QualityData AI - Sistema interno de analisis estadistico de calidad</p></div><div className="selectors"><select value={gestion} onChange={(e) => setGestion(e.target.value)}><option value="2024">Gestion 2024</option><option value="2025">Gestion 2025</option><option value="2026">Gestion 2026</option></select><Badge tone={aiStatus?.aiEnabled ? "green" : "yellow"}>{aiStatus?.aiStatus || "IA desactivada - modo reglas locales"}</Badge><Button variant="secondary" onClick={onRefresh}><RefreshCw size={16} /> Actualizar</Button><Button variant="ghost" onClick={onLogout}><LogOut size={16} /> Cerrar sesion</Button></div></header>;
}
