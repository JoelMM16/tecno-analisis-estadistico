import { mean, std } from "./statistics";
export function controlData(rows, key) {
  const values = rows.map((row) => Number(row[key] || 0));
  const avg = mean(values);
  const sd = std(values);
  const lsc = avg + 3 * sd;
  const lic = Math.max(0, avg - 3 * sd);
  return rows.map((row, index) => ({ punto: index + 1, valor: Number(row[key] || 0), promedio: avg, lsc, lic, fueraControl: Number(row[key] || 0) > lsc || Number(row[key] || 0) < lic }));
}
