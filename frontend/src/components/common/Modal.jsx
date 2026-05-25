import Button from "./Button";
export default function Modal({ title, open, onClose, children }) {
  if (!open) return null;
  return <div className="modal-backdrop"><section className="modal"><header><h3>{title}</h3><Button variant="ghost" onClick={onClose}>Cerrar</Button></header>{children}</section></div>;
}
