export const money = (value) => `Bs ${Number(value || 0).toLocaleString("es-BO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const percent = (value) => `${(Number(value || 0) * 100).toFixed(1)}%`;
export const date = (value) => (value ? String(value).slice(0, 10) : "");
