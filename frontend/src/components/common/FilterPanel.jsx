import { Search, RotateCcw } from "lucide-react";
import Button from "./Button";
export default function FilterPanel({ query, setQuery, children }) {
  return <div className="filter-panel"><label className="search"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar y filtrar..." /></label>{children}<Button variant="secondary" onClick={() => setQuery("")}><RotateCcw size={16} /> Limpiar</Button></div>;
}
