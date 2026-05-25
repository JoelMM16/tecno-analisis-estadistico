import PageContainer from "../components/layout/PageContainer";
import Button from "../components/common/Button";
import { api } from "../api/api";

export default function Configuracion({ reloadMetrics, metrics, gestion, aiStatus }) {
  async function action(path, message) {
    await api.post(path, {});
    await reloadMetrics?.();
    alert(message);
  }
  return <PageContainer title="Configuracion" subtitle="Empresa demo, gestion activa, estado de servicios y respaldo.">
    <section className="grid-2"><article className="card"><h3>Empresa demo</h3><p><strong>{metrics?.empresa?.nombreEmpresa}</strong></p><p>{metrics?.empresa?.rubro}</p><p>{metrics?.empresa?.descripcion}</p><p>Gestion activa: {gestion}</p><p className="insight">Estado IA: {aiStatus?.aiStatus}</p></article><article className="card"><h3>Datos demo</h3><div className="actions stacked"><Button onClick={() => action("/demo/load", "Datos demo cargados.")}>Cargar datos demo</Button><Button variant="secondary" onClick={() => action("/demo/restore", "Demo textil restaurada con gestiones 2024, 2025 y 2026.")}>Restaurar datos demo</Button><Button variant="danger" onClick={() => action("/demo/clear", "Datos demo limpiados.")}>Limpiar datos demo</Button></div></article><article className="card"><h3>Pruebas de conexion</h3><div className="actions stacked"><Button variant="secondary" onClick={async () => { const r = await api.get("/health"); alert(r.ok ? "Backend conectado correctamente." : "Backend no disponible."); }}>Probar backend</Button><Button variant="secondary" onClick={async () => { const r = await api.get("/config/status"); alert(r.aiEnabled ? "OpenAI configurado. IA activa." : "No hay API key valida o AI_ENABLED=false. Usando reglas locales."); }}>Probar conexion con OpenAI</Button><Button variant="secondary" onClick={() => alert("Exportar base de datos preparado: usa Explorador para exportar vistas actuales.")}>Exportar base de datos</Button><Button variant="secondary" onClick={() => alert("Importar respaldo preparado para la siguiente version.")}>Importar respaldo</Button></div></article><article className="card"><h3>Servicios preparados</h3><ul className="clean-list"><li>OpenAI API: usar OPENAI_API_KEY en backend/.env.</li><li>Structured Outputs: capa aiService con fallback JSON interno.</li><li>OCR: Tesseract.js integrado para imagenes cuando el entorno lo permita.</li><li>Word .docx: extraccion de texto con mammoth.</li><li>PDF con texto: extraccion directa con pdf-parse.</li></ul></article></section>
  </PageContainer>;
}
