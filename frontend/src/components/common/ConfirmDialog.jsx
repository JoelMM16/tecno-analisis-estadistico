import Modal from "./Modal";
import Button from "./Button";
export default function ConfirmDialog({ open, title = "Confirmar", message, onCancel, onConfirm }) {
  return <Modal open={open} title={title} onClose={onCancel}><p>{message}</p><div className="actions"><Button variant="secondary" onClick={onCancel}>Cancelar</Button><Button variant="danger" onClick={onConfirm}>Eliminar</Button></div></Modal>;
}
