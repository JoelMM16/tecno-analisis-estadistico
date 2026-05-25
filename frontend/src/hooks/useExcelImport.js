import { useState } from "react";
export function useExcelImport() {
  const [preview, setPreview] = useState([]);
  return { preview, setPreview };
}
