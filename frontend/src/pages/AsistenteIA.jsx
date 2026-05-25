import PageContainer from "../components/layout/PageContainer";
import AiChatPanel from "../components/ai/AiChatPanel";

export default function AsistenteIA({ gestion }) {
  return <PageContainer title="Asistente IA" subtitle="Chat empresarial para preguntar sobre pedidos, fallas, gastos, documentos, graficos e informes ya cargados.">
    <AiChatPanel gestion={gestion} />
  </PageContainer>;
}
