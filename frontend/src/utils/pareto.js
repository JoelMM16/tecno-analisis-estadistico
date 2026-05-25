export function makePareto(rows, labelKey, valueFn) {
  const grouped = rows.reduce((acc, row) => {
    const label = row[labelKey] || "Sin clasificar";
    acc[label] = (acc[label] || 0) + Number(valueFn(row) || 0);
    return acc;
  }, {});
  const total = Object.values(grouped).reduce((a, b) => a + b, 0) || 1;
  let acc = 0;
  return Object.entries(grouped).map(([nombre, valor]) => ({ nombre, valor })).sort((a, b) => b.valor - a.valor).map((item) => {
    acc += item.valor;
    return { ...item, porcentaje: item.valor / total, porcentajeAcumulado: acc / total };
  });
}
