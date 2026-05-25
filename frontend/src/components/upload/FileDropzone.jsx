import { Upload } from "lucide-react";
export default function FileDropzone({ onFile, accept = ".xlsx,.csv,.pdf,.png,.jpg,.jpeg" }) {
  return <label className="dropzone"><Upload size={24} /><span>Seleccionar o soltar archivos</span><small>Hasta 5 archivos por carga</small><input type="file" multiple accept={accept} onChange={(e) => onFile?.([...e.target.files].slice(0, 5))} /></label>;
}
