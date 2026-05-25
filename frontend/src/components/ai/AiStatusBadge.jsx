import Badge from "../common/Badge";
export default function AiStatusBadge({ enabled }) {
  return <Badge tone={enabled ? "green" : "yellow"}>{enabled ? "IA activa" : "IA desactivada - modo reglas locales"}</Badge>;
}
