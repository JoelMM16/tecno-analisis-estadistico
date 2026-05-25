require("dotenv").config();
const { db, initDatabase, insert } = require("./db");

const tables = [
  "informes_generados",
  "manual_preventivo",
  "control_calidad",
  "resultados_ia",
  "textos_extraidos",
  "documentos_cargados",
  "gastos",
  "fallas",
  "pedidos",
  "etapas",
  "gestiones",
  "empresa_demo",
  "usuarios",
  "documento_textos",
  "ai_resultados",
  "documentos",
  "proyectos",
  "empresas"
];

const etapas = [
  "Cliente realiza el pedido",
  "Pedido pasa a produccion",
  "Compra de materia prima e insumos",
  "Preparacion de moldes",
  "Proceso de corte",
  "Proceso de maquila",
  "Personalizacion de prendas",
  "Terminacion, plancha, deshilado y embalaje",
  "Envio a oficina central para entrega al cliente"
];

const fallasBase = [
  ["Cliente realiza el pedido", "Demora del cliente por tramites burocraticos", 5, "Medio ambiente"],
  ["Cliente realiza el pedido", "Condiciones cambiantes economicas, legales o burocraticas", 5, "Medio ambiente"],
  ["Cliente realiza el pedido", "Falta de comunicacion o malentendido", 3, "Medicion"],
  ["Cliente realiza el pedido", "Problemas al encontrar materiales", 2, "Materiales"],
  ["Preparacion de moldes", "Mal acomodado de piezas", 3, "Metodo"],
  ["Preparacion de moldes", "Comportamiento anomalo de tejido", 2, "Materiales"],
  ["Preparacion de moldes", "Telas que necesitan prelavado", 3, "Materiales"],
  ["Preparacion de moldes", "Demoras en preparacion de moldes", 8, "Metodo"],
  ["Preparacion de moldes", "Mala colocacion de datos por parte del personal", 3, "Mano de obra"],
  ["Proceso de corte", "Mala seleccion de piezas", 5, "Metodo"],
  ["Proceso de corte", "Falta de control de materiales", 2, "Materiales"],
  ["Proceso de corte", "Fallas en las maquinas", 3, "Maquina"],
  ["Proceso de corte", "Demoras en los cortes", 5, "Metodo"],
  ["Proceso de corte", "Falta de comunicacion o informacion", 5, "Medicion"],
  ["Proceso de maquila", "Falta de informacion", 3, "Medicion"],
  ["Proceso de maquila", "Demora en los procesos", 2, "Metodo"],
  ["Personalizacion de prendas", "Productos danados", 2, "Mano de obra"],
  ["Terminacion, plancha, deshilado y embalaje", "Demora", 3, "Metodo"],
  ["Terminacion, plancha, deshilado y embalaje", "Productos danados", 3, "Mano de obra"],
  ["Envio a oficina central para entrega al cliente", "Producto extraviado", 1, "Medio ambiente"]
];

const erroresDetectadosDemo = [
  {
    etapa: "Preparacion de moldes",
    nombreFalla: "Demora critica en preparacion de moldes",
    descripcion: "La ficha tecnica llego incompleta y el molde tuvo que rehacerse antes del corte.",
    frecuencia: 6,
    gravedad: 9,
    costoEstimado: 185,
    demora: 18,
    categoria6M: "Metodo",
    causa: "No existe checklist obligatorio antes de liberar moldes.",
    correctiva: "Revisar fichas tecnicas incompletas y bloquear avance hasta validar tallas.",
    preventiva: "Implementar checklist digital de moldes con responsable y tiempo maximo de preparacion."
  },
  {
    etapa: "Proceso de corte",
    nombreFalla: "Corte desalineado por calibracion de maquina",
    descripcion: "Se detectaron piezas cortadas con desviacion en lotes de uniformes corporativos.",
    frecuencia: 5,
    gravedad: 8,
    costoEstimado: 160,
    demora: 12,
    categoria6M: "Maquina",
    causa: "La cortadora no tenia registro reciente de calibracion.",
    correctiva: "Separar piezas afectadas, reprocesar corte y registrar ajuste tecnico.",
    preventiva: "Programar mantenimiento preventivo semanal y bitacora de calibracion."
  },
  {
    etapa: "Compra de materia prima e insumos",
    nombreFalla: "Tela recibida con variacion de tono",
    descripcion: "El lote de tela azul no coincidio con la muestra aprobada por el cliente.",
    frecuencia: 4,
    gravedad: 7,
    costoEstimado: 140,
    demora: 10,
    categoria6M: "Materiales",
    causa: "Proveedor entrego lote sin validacion de color ni ficha de control.",
    correctiva: "Retener lote, solicitar reposicion y actualizar evidencia fotografica.",
    preventiva: "Validar tono, gramaje y lote antes de liberar material a produccion."
  },
  {
    etapa: "Proceso de maquila",
    nombreFalla: "Costura irregular en laterales",
    descripcion: "Varias prendas presentaron puntadas irregulares en costuras laterales.",
    frecuencia: 5,
    gravedad: 6,
    costoEstimado: 95,
    demora: 8,
    categoria6M: "Mano de obra",
    causa: "Operario nuevo sin doble revision en la primera tanda.",
    correctiva: "Rehacer costuras defectuosas y validar la muestra con control de calidad.",
    preventiva: "Capacitar personal nuevo y aplicar doble revision en primeras 20 prendas."
  },
  {
    etapa: "Personalizacion de prendas",
    nombreFalla: "Bordado desplazado del centro",
    descripcion: "El logo institucional quedo desplazado en prendas bordadas.",
    frecuencia: 3,
    gravedad: 7,
    costoEstimado: 130,
    demora: 7,
    categoria6M: "Medicion",
    causa: "La posicion del bordado no fue marcada con plantilla fija.",
    correctiva: "Rehacer bordado de prendas afectadas y validar ubicacion con muestra patron.",
    preventiva: "Usar plantilla de posicion y fotografia de aprobacion por pedido."
  },
  {
    etapa: "Terminacion, plancha, deshilado y embalaje",
    nombreFalla: "Prendas con hilos sueltos en embalaje",
    descripcion: "El control final encontro prendas embaladas con hilos sin retirar.",
    frecuencia: 7,
    gravedad: 5,
    costoEstimado: 65,
    demora: 5,
    categoria6M: "Metodo",
    causa: "La inspeccion final no tenia secuencia estandarizada.",
    correctiva: "Reabrir cajas afectadas, retirar hilos y volver a embalar.",
    preventiva: "Agregar punto de inspeccion visual final antes de sellar cajas."
  },
  {
    etapa: "Envio a oficina central para entrega al cliente",
    nombreFalla: "Retraso de traslado a oficina central",
    descripcion: "El lote terminado llego tarde a oficina central por coordinacion de transporte.",
    frecuencia: 4,
    gravedad: 6,
    costoEstimado: 90,
    demora: 9,
    categoria6M: "Medio ambiente",
    causa: "Dependencia de transporte externo sin horario confirmado.",
    correctiva: "Reprogramar entrega y comunicar nueva hora al cliente.",
    preventiva: "Confirmar transporte 24 horas antes y registrar plan alternativo."
  }
];

const tiposPrenda = ["Uniforme corporativo", "Chaqueta institucional", "Polera bordada", "Camisa personalizada", "Pantalon de trabajo"];
const clientes = ["Colegio San Marcos", "Clinica Norte", "Banco Andino", "Universidad Central", "Constructora Sol", "Hotel Plaza", "Restaurante Aroma"];

function dropLegacyAndCurrent() {
  db.pragma("foreign_keys = OFF");
  tables.forEach((table) => db.prepare(`DROP TABLE IF EXISTS ${table}`).run());
  db.pragma("foreign_keys = ON");
}

function resetDemo() {
  dropLegacyAndCurrent();
  initDatabase();
}

function seedDemoData({ reset = false } = {}) {
  if (reset) resetDemo();
  else {
    initDatabase();
    const etapaColumns = db.prepare("PRAGMA table_info(etapas)").all().map((c) => c.name);
    const docColumns = db.prepare("PRAGMA table_info(documentos_cargados)").all().map((c) => c.name);
    if (!etapaColumns.includes("gestion") || !docColumns.includes("resumenIa")) resetDemo();
  }
  const count = db.prepare("SELECT COUNT(*) as total FROM usuarios").get().total;
  if (count && !reset) return { skipped: true, message: "La demo interna ya estaba cargada." };

  insert("usuarios", {
    usuario: "demo@textilquality.com",
    password: "demo123",
    nombre: "Empresa Demo",
    rol: "empresa_demo",
    gestion: "2026"
  });

  const empresa = insert("empresa_demo", {
    nombreEmpresa: "Empresa Textil de Uniformes",
    rubro: "Fabricacion de uniformes y prendas personalizadas",
    descripcion: "Empresa textil dedicada a la produccion de uniformes, prendas personalizadas, bordados, corte, maquila y terminacion de pedidos.",
    ciudad: "La Paz",
    responsable: "Responsable de Calidad",
    correo: "demo@textilquality.com",
    telefono: "+591 70000000",
    estado: "activa"
  });

  ["2024", "2025", "2026"].forEach((gestion) => insert("gestiones", {
    gestion,
    descripcion: `Gestion ${gestion} de la Empresa Textil de Uniformes`,
    estado: gestion === "2026" ? "activa" : "historica"
  }));

  ["2024", "2025", "2026"].forEach((gestion, gIndex) => {
    etapas.forEach((nombreEtapa, index) => insert("etapas", {
      gestion,
      nombreEtapa,
      descripcion: `Etapa ${index + 1} del proceso textil interno.`,
      orden: index + 1,
      responsable: ["Ventas", "Produccion", "Compras", "Diseno", "Corte", "Maquila", "Bordado", "Calidad", "Logistica"][index],
      activo: 1,
      recomendaciones: "Aplicar checklist de avance, evidencia y responsable asignado."
    }));
  });

  const pedidos2026 = [];
  ["2024", "2025", "2026"].forEach((gestion, gIndex) => {
    const pedidosGestion = gestion === "2026" ? 50 : 24;
    for (let i = 1; i <= pedidosGestion; i += 1) {
      const fecha = new Date(Number(gestion), 1 + (i % 9), 1 + i);
      const prometida = new Date(fecha);
      prometida.setDate(fecha.getDate() + 8 + (i % 6));
      const real = new Date(prometida);
      real.setDate(prometida.getDate() + (i % 5 === 0 ? 3 : i % 7 === 0 ? 2 : 0));
      const pedido = insert("pedidos", {
        gestion,
        codigoPedido: `TXT-${gestion}-${String(i).padStart(3, "0")}`,
        cliente: clientes[(i + gIndex) % clientes.length],
        fechaPedido: fecha.toISOString().slice(0, 10),
        fechaEntregaPrometida: prometida.toISOString().slice(0, 10),
        fechaEntregaReal: real.toISOString().slice(0, 10),
        tipoPrenda: tiposPrenda[i % tiposPrenda.length],
        cantidadPrendas: 20 + (i * 7) % 160,
        estado: real > prometida ? "retrasado" : i % 8 === 0 ? "en produccion" : "entregado",
        etapaActual: etapas[i % etapas.length],
        observaciones: i % 5 === 0 ? "Pedido con reproceso registrado." : "Pedido controlado en flujo normal.",
        originalJson: JSON.stringify({ origen: "seed demo", gestion, fila: i })
      });
      if (gestion === "2026") pedidos2026.push(pedido);
      insert("control_calidad", {
        gestion,
        pedidoId: pedido.id,
        fecha: pedido.fechaPedido,
        numeroFallas: 1 + (i % 5 === 0 ? 2 : i % 3 === 0 ? 1 : 0),
        porcentajeDefectos: Number(((i % 9) * 0.7 + 1.2 + gIndex * 0.2).toFixed(2)),
        tiempoProcesoHoras: 16 + (i % 10) * 2,
        etapa: etapas[i % etapas.length]
      });
    }
  });

  const allPedidos = db.prepare("SELECT * FROM pedidos ORDER BY id").all();
  allPedidos.forEach((pedido, index) => {
    const base = fallasBase[index % fallasBase.length];
    const frecuencia = 1 + (index % 4);
    const gravedad = base[2];
    const costo = 45 + (index % 9) * 25;
    insert("fallas", {
      gestion: pedido.gestion,
      pedidoId: pedido.id,
      etapa: base[0],
      nombreFalla: base[1],
      descripcion: `Detectado en ${pedido.codigoPedido}: ${base[1].toLowerCase()}.`,
      frecuencia,
      gravedad,
      tiempoDemoraHoras: 2 + (index % 12),
      costoEstimado: costo,
      categoria6M: base[3],
      causaRaiz: "Causa inicial demo para analisis 6M.",
      accionCorrectiva: "Revisar el pedido afectado, corregir registros y validar calidad antes de avanzar.",
      accionPreventiva: "Aplicar checklist por etapa, responsable asignado y tiempos maximos.",
      estado: gravedad >= 7 ? "pendiente" : index % 3 === 0 ? "en revision" : "solucionada",
      fechaRegistro: pedido.fechaPedido,
      originalJson: JSON.stringify({ origen: "seed demo", gestion: pedido.gestion })
    });
    insert("gastos", {
      gestion: pedido.gestion,
      etapa: base[0],
      fallaRelacionada: base[1],
      tipoGasto: ["reproceso", "perdida de material", "horas extra", "transporte"][index % 4],
      descripcion: `Costo asociado a ${base[1]}.`,
      monto: frecuencia * costo,
      fecha: pedido.fechaPedido,
      responsable: ["Calidad", "Produccion", "Logistica"][index % 3],
      observaciones: "Dato demo estimado para feria.",
      originalJson: JSON.stringify({ origen: "seed demo" })
    });
  });

  ["2024", "2025", "2026"].forEach((gestion) => {
    fallasBase.forEach((base, index) => insert("manual_preventivo", {
      gestion,
      etapa: base[0],
      fallaRelacionada: base[1],
      causa: "Causa recurrente detectada en la gestion.",
      procedimientoPreventivo: "Verificar requisitos, materiales, responsables y evidencias antes de liberar la etapa.",
      procedimientoCorrectivo: "Detener avance del pedido afectado, corregir la falla y registrar accion.",
      responsable: ["Calidad", "Produccion", "Compras", "Logistica"][index % 4],
      indicadorControl: "Pedidos sin reproceso",
      frecuenciaRevision: "Semanal"
    }));
    insert("documentos_cargados", {
      gestion,
      nombreDocumento: `Registro demo de calidad ${gestion}.txt`,
      tipoDocumento: "texto demo",
      estado: "procesado",
      textoExtraido: `Documento demo ${gestion}: se reportan demoras, reprocesos, productos danados y acciones preventivas por etapa.`,
      datosDetectados: JSON.stringify({ resumen: "Documento demo procesado", gestion }),
      originalJson: JSON.stringify({ origen: "seed demo" })
    });
  });

  seedShowcaseAnalysis();

  return { skipped: false, empresa, gestiones: 3, pedidos2026: pedidos2026.length };
}

function seedShowcaseAnalysis() {
  const gestion = "2026";
  const pedidos = db.prepare("SELECT * FROM pedidos WHERE gestion = ? ORDER BY id LIMIT 14").all(gestion);
  erroresDetectadosDemo.forEach((error, index) => {
    const pedido = pedidos[index] || pedidos[0];
    insert("fallas", {
      gestion,
      pedidoId: pedido?.id || null,
      etapa: error.etapa,
      nombreFalla: error.nombreFalla,
      descripcion: error.descripcion,
      frecuencia: error.frecuencia,
      gravedad: error.gravedad,
      tiempoDemoraHoras: error.demora,
      costoEstimado: error.costoEstimado,
      categoria6M: error.categoria6M,
      causaRaiz: error.causa,
      accionCorrectiva: error.correctiva,
      accionPreventiva: error.preventiva,
      estado: error.gravedad >= 8 ? "pendiente" : "en revision",
      fechaRegistro: `2026-0${(index % 5) + 3}-${String(10 + index).padStart(2, "0")}`,
      originalJson: JSON.stringify({ origen: "carga inteligente demo", archivo: "Datos_Prueba_Empresa_Textil_QualityDataAI.xlsx" })
    });
    insert("gastos", {
      gestion,
      etapa: error.etapa,
      fallaRelacionada: error.nombreFalla,
      tipoGasto: ["reproceso", "perdida de material", "horas extra", "mantenimiento", "reposicion", "transporte", "demora"][index],
      descripcion: `Costo calculado por ${error.nombreFalla.toLowerCase()}.`,
      monto: error.frecuencia * error.costoEstimado,
      fecha: `2026-0${(index % 5) + 3}-${String(10 + index).padStart(2, "0")}`,
      responsable: ["Calidad", "Produccion", "Compras", "Logistica"][index % 4],
      observaciones: "Dato detectado por carga inteligente demo.",
      originalJson: JSON.stringify({ origen: "carga inteligente demo" })
    });
    insert("control_calidad", {
      gestion,
      pedidoId: pedido?.id || null,
      fecha: `2026-0${(index % 5) + 3}-${String(10 + index).padStart(2, "0")}`,
      numeroFallas: error.frecuencia,
      porcentajeDefectos: Number((error.frecuencia * 0.8 + error.gravedad * 0.25).toFixed(2)),
      tiempoProcesoHoras: 18 + error.demora,
      etapa: error.etapa
    });
    insert("manual_preventivo", {
      gestion,
      etapa: error.etapa,
      fallaRelacionada: error.nombreFalla,
      causa: error.causa,
      procedimientoPreventivo: error.preventiva,
      procedimientoCorrectivo: error.correctiva,
      responsable: ["Calidad", "Produccion", "Compras", "Logistica"][index % 4],
      indicadorControl: "Pedidos sin reproceso",
      frecuenciaRevision: error.gravedad >= 8 ? "Diaria" : "Semanal"
    });
  });

  const preview = {
    resumen: "Carga inteligente demo: se procesaron un Excel operativo y un Word de reporte de calidad. El sistema detecto 7 errores relevantes, costos asociados, causas 6M y acciones recomendadas.",
    pedidosDetectados: pedidos.slice(0, 7).map((pedido) => ({
      gestion,
      codigoPedido: pedido.codigoPedido,
      cliente: pedido.cliente,
      fechaPedido: pedido.fechaPedido,
      tipoPrenda: pedido.tipoPrenda,
      cantidadPrendas: pedido.cantidadPrendas,
      estado: pedido.estado,
      etapaActual: pedido.etapaActual,
      observaciones: "Pedido usado para analisis demo de carga inteligente."
    })),
    etapasDetectadas: [...new Set(erroresDetectadosDemo.map((e) => e.etapa))],
    fallasDetectadas: erroresDetectadosDemo,
    gastosDetectados: erroresDetectadosDemo.map((e) => ({ etapa: e.etapa, fallaRelacionada: e.nombreFalla, monto: e.frecuencia * e.costoEstimado })),
    datosControlCalidad: erroresDetectadosDemo.map((e) => ({ etapa: e.etapa, numeroFallas: e.frecuencia, porcentajeDefectos: Number((e.frecuencia * 0.8 + e.gravedad * 0.25).toFixed(2)) })),
    causas6M: [...new Set(erroresDetectadosDemo.map((e) => e.categoria6M))],
    recomendaciones: erroresDetectadosDemo.map((e) => e.preventiva),
    accionesCorrectivas: erroresDetectadosDemo.map((e) => e.correctiva),
    accionesPreventivas: erroresDetectadosDemo.map((e) => e.preventiva),
    nivelConfianza: 0.92
  };
  const doc = insert("documentos_cargados", {
    gestion,
    nombreDocumento: "Carga inteligente demo - Excel y Word textil",
    tipoDocumento: "xlsx + docx",
    estado: "importado",
    textoExtraido: "Excel: pedidos, fallas, gastos y control de calidad. Word: reporte narrativo con causas, recomendaciones y acciones por etapa.",
    datosDetectados: JSON.stringify(preview),
    cantidadArchivos: 2,
    pedidosDetectados: 7,
    fallasDetectadas: 7,
    gastosDetectados: 7,
    resumenIa: preview.resumen,
    errores: "",
    originalJson: JSON.stringify({ archivos: ["Datos_Prueba_Empresa_Textil_QualityDataAI.xlsx", "Documento_Prueba_Empresa_Textil_QualityDataAI.docx"] })
  });
  insert("resultados_ia", {
    gestion,
    documentoId: doc.id,
    tipo: "carga_inteligente_demo",
    resultadoJson: JSON.stringify(preview),
    aprobado: 1
  });
}

if (require.main === module) console.log(seedDemoData({ reset: true }));

module.exports = { seedDemoData, resetDemo, etapas };
