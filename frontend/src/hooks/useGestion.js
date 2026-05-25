import { useEffect, useState } from "react";
export function useGestion() {
  const [gestion, setGestion] = useState(() => localStorage.getItem("qualitydata-gestion") || "2026");
  useEffect(() => localStorage.setItem("qualitydata-gestion", gestion), [gestion]);
  return { gestion, setGestion };
}
