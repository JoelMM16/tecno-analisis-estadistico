import { useCallback, useEffect, useState } from "react";
import { api } from "../api/api";
export function useQualityMetrics(gestion = "2026") {
  const [data, setData] = useState(null);
  const load = useCallback(async () => setData(await api.get(`/metrics?gestion=${gestion}`)), [gestion]);
  useEffect(() => { load(); }, [load]);
  return { data, reload: load };
}
