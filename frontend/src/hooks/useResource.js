import { useCallback, useEffect, useState } from "react";
import { api } from "../api/api";

export function useResource(resource, options = {}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const gestion = options.gestion || localStorage.getItem("qualitydata-gestion") || "2026";
  const load = useCallback(async () => {
    setLoading(true);
    setRows(await api.get(`/${resource}?gestion=${gestion}`));
    setLoading(false);
  }, [resource, gestion]);
  useEffect(() => { load(); }, [load]);
  return { rows, loading, reload: load, create: (body) => api.create(resource, body).then(load), update: (id, body) => api.update(resource, id, body).then(load), remove: (id) => api.remove(resource, id).then(load) };
}
