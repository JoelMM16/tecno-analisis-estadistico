import { useEffect, useState } from "react";
import { api } from "../api/api";
import { empresaDemo } from "../constants/empresaDemo";

export function useAuth() {
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem("qualitydata-session") || "null"));
  useEffect(() => {
    if (session) localStorage.setItem("qualitydata-session", JSON.stringify(session));
    else localStorage.removeItem("qualitydata-session");
  }, [session]);
  async function login(usuario = empresaDemo.usuario, password = empresaDemo.password) {
    const data = await api.post("/auth/login", { usuario, password });
    setSession(data);
    return data;
  }
  function logout() {
    setSession(null);
  }
  return { session, login, logout, isAuthenticated: Boolean(session?.token) };
}
