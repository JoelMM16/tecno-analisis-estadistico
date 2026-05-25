import Login from "../../pages/Login";
export default function ProtectedRoute({ authenticated, onLogin, children }) {
  if (!authenticated) return <Login onLogin={onLogin} />;
  return children;
}
