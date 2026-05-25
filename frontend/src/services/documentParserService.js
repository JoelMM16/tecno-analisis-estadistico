export function parsePlainText(text) {
  return String(text || "").split(/\n+/).filter(Boolean);
}
