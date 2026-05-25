export function filterRows(rows, query) {
  const q = String(query || "").toLowerCase();
  if (!q) return rows;
  return rows.filter((row) => Object.values(row).join(" ").toLowerCase().includes(q));
}
