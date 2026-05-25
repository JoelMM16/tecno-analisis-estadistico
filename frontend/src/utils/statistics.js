export function mean(values) {
  return values.reduce((sum, value) => sum + Number(value || 0), 0) / (values.length || 1);
}
export function std(values) {
  const avg = mean(values);
  return Math.sqrt(values.reduce((sum, value) => sum + (Number(value || 0) - avg) ** 2, 0) / (values.length || 1));
}
