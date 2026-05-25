import { useResource } from "./useResource";
export const useDocuments = (gestion) => useResource("documentos", { gestion });
