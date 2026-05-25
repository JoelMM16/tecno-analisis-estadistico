import { NavLink } from "react-router-dom";
import { BarChart3, Bot, Database, FileBarChart, Gauge, Home, Layers, Menu, PackageCheck, Receipt, Settings, ShieldCheck, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  ["/", "Dashboard", Home],
  ["/carga", "Carga inteligente", UploadCloud],
  ["/explorador", "Explorador de datos", Database],
  ["/pedidos", "Pedidos", PackageCheck],
  ["/etapas", "Procesos / Etapas", Layers],
  ["/fallas", "Fallas", ShieldCheck],
  ["/gastos", "Gastos", Receipt],
  ["/analisis", "Analisis estadistico", BarChart3],
  ["/asistente", "Asistente IA", Bot],
  ["/informes", "Informes", FileBarChart],
  ["/manual", "Manual preventivo", Gauge],
  ["/configuracion", "Configuracion", Settings]
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("sidebarCollapsed") === "true");
  useEffect(() => localStorage.setItem("sidebarCollapsed", String(collapsed)), [collapsed]);
  return <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}><div className="brand"><button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)} title={collapsed ? "Expandir menu" : "Contraer menu"}><Menu size={18} /></button><div className="brand-text"><strong>QualityData AI</strong><span>Calidad empresarial</span></div></div><nav>{links.map(([to, label, Icon]) => <NavLink key={to} to={to} end={to === "/"} title={label}><Icon size={18} /><span>{label}</span></NavLink>)}</nav></aside>;
}
