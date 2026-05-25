import { useState } from "react";
import Button from "../components/common/Button";
import { empresaDemo } from "../constants/empresaDemo";

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState(empresaDemo.usuario);
  const [password, setPassword] = useState(empresaDemo.password);
  const [error, setError] = useState("");
  async function submit(e) {
    e?.preventDefault();
    try {
      await onLogin(usuario, password);
    } catch {
      setError("No se pudo iniciar sesion. Verifica que el backend este activo.");
    }
  }
  return <main className="login-page"><section className="login-card"><div><span className="login-kicker">Demo empresarial</span><h1>QualityData AI</h1><p>Sistema interno de analisis estadistico para la Empresa Textil de Uniformes.</p></div><form onSubmit={submit}><label>Usuario<input value={usuario} onChange={(e) => setUsuario(e.target.value)} /></label><label>Contraseña<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>{error && <p className="form-error">{error}</p>}<Button type="submit">Iniciar sesion</Button><Button type="button" variant="secondary" onClick={submit}>Entrar como empresa demo</Button></form><footer><strong>{empresaDemo.nombreEmpresa}</strong><span>{empresaDemo.rubro}</span></footer></section></main>;
}
