const OpenAI = require("openai");
const { recommendationFor } = require("./recommendations.service");

const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

function client() {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes("PEGA_AQUI") || process.env.AI_ENABLED === "false") return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const documentSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "resumen",
    "pedidosDetectados",
    "etapasDetectadas",
    "fallasDetectadas",
    "gastosDetectados",
    "datosControlCalidad",
    "causas6M",
    "recomendaciones",
    "accionesPreventivas",
    "accionesCorrectivas",
    "nivelConfianza"
  ],
  properties: {
    resumen: { type: "string" },
    pedidosDetectados: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["codigoPedido", "cliente", "fechaPedido", "tipoPrenda", "cantidadPrendas", "estado", "etapaActual", "observaciones"],
        properties: {
          codigoPedido: { type: "string" },
          cliente: { type: "string" },
          fechaPedido: { type: "string" },
          tipoPrenda: { type: "string" },
          cantidadPrendas: { type: "integer" },
          estado: { type: "string" },
          etapaActual: { type: "string" },
          observaciones: { type: "string" }
        }
      }
    },
    etapasDetectadas: { type: "array", items: { type: "string" } },
    fallasDetectadas: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["nombreFalla", "descripcion", "etapa", "frecuencia", "gravedad", "categoria6M", "causaRaiz"],
        properties: {
          nombreFalla: { type: "string" },
          descripcion: { type: "string" },
          etapa: { type: "string" },
          frecuencia: { type: "integer" },
          gravedad: { type: "integer" },
          categoria6M: { type: "string", enum: ["Mano de obra", "Metodo", "Maquina", "Materiales", "Medicion", "Medio ambiente"] },
          causaRaiz: { type: "string" }
        }
      }
    },
    gastosDetectados: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["tipoGasto", "descripcion", "monto", "etapa"],
        properties: {
          tipoGasto: { type: "string" },
          descripcion: { type: "string" },
          monto: { type: "number" },
          etapa: { type: "string" }
        }
      }
    },
    datosControlCalidad: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["fecha", "numeroFallas", "porcentajeDefectos", "tiempoProcesoHoras", "etapa"],
        properties: {
          fecha: { type: "string" },
          numeroFallas: { type: "integer" },
          porcentajeDefectos: { type: "number" },
          tiempoProcesoHoras: { type: "number" },
          etapa: { type: "string" }
        }
      }
    },
    causas6M: { type: "array", items: { type: "string" } },
    recomendaciones: { type: "array", items: { type: "string" } },
    accionesPreventivas: { type: "array", items: { type: "string" } },
    accionesCorrectivas: { type: "array", items: { type: "string" } },
    nivelConfianza: { type: "number" }
  }
};

const failureSchema = {
  type: "object",
  additionalProperties: false,
  required: ["categoria6M", "causaRaiz", "accionCorrectiva", "accionPreventiva", "prioridad", "explicacion"],
  properties: {
    categoria6M: { type: "string", enum: ["Mano de obra", "Metodo", "Maquina", "Materiales", "Medicion", "Medio ambiente"] },
    causaRaiz: { type: "string" },
    accionCorrectiva: { type: "string" },
    accionPreventiva: { type: "string" },
    prioridad: { type: "string", enum: ["alta", "media", "baja"] },
    explicacion: { type: "string" }
  }
};

async function structuredJson({ name, schema, system, user }) {
  const openai = client();
  if (!openai) return null;
  const response = await openai.responses.create({
    model,
    input: [
      { role: "system", content: system },
      { role: "user", content: user }
    ],
    text: {
      format: {
        type: "json_schema",
        name,
        strict: true,
        schema
      }
    }
  });
  return JSON.parse(response.output_text);
}

async function analyzeDocument(text = "") {
  try {
    const result = await structuredJson({
      name: "quality_document_analysis",
      schema: documentSchema,
      system: "Eres un asistente de calidad empresarial. Extraes datos desde documentos de produccion. No calcules estadistica: solo estructura datos, causas 6M y recomendaciones. Responde JSON estricto.",
      user: `Texto del documento:\n${text}`
    });
    return result || fallbackDocumentAnalysis(text);
  } catch (error) {
    return { ...fallbackDocumentAnalysis(text), apiAviso: `Fallback usado: ${error.message}` };
  }
}

async function analizarDocumento(texto = "", contextoEmpresa = {}, gestion = "2026") {
  return analyzeDocument(`Empresa/contexto: ${JSON.stringify(contextoEmpresa)}\nGestion: ${gestion}\n\n${texto}`);
}

async function classifyFailure(falla = {}) {
  try {
    const result = await structuredJson({
      name: "quality_failure_classification",
      schema: failureSchema,
      system: "Clasifica fallas de calidad empresarial con enfoque 6M. Devuelve causa raiz y acciones. Responde JSON estricto.",
      user: JSON.stringify(falla, null, 2)
    });
    return result || fallbackClassifyFailure(falla);
  } catch (error) {
    return { ...fallbackClassifyFailure(falla), apiAviso: `Fallback usado: ${error.message}` };
  }
}

async function generateReport(data = {}) {
  const i = data.indicadores || {};
  try {
    const result = await structuredJson({
      name: "quality_report",
      schema: {
        type: "object",
        additionalProperties: false,
        required: ["informe", "conclusion", "recomendaciones"],
        properties: {
          informe: { type: "string" },
          conclusion: { type: "string" },
          recomendaciones: { type: "array", items: { type: "string" } }
        }
      },
      system: "Redacta informes ejecutivos de calidad. Usa los indicadores entregados y no inventes calculos.",
      user: JSON.stringify({ indicadores: i, pareto: data.charts?.paretoGeneral, sixM: data.charts?.sixM, alertas: data.alertas }, null, 2)
    });
    return result || fallbackReport(data);
  } catch (error) {
    return { ...fallbackReport(data), apiAviso: `Fallback usado: ${error.message}` };
  }
}

async function generateManual(fallas = []) {
  const top = fallas.slice(0, 8);
  try {
    const result = await structuredJson({
      name: "quality_preventive_manual",
      schema: {
        type: "object",
        additionalProperties: false,
        required: ["items"],
        properties: {
          items: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["etapa", "fallaRelacionada", "causa", "procedimientoPreventivo", "procedimientoCorrectivo", "responsable", "indicadorControl", "frecuenciaRevision"],
              properties: {
                etapa: { type: "string" },
                fallaRelacionada: { type: "string" },
                causa: { type: "string" },
                procedimientoPreventivo: { type: "string" },
                procedimientoCorrectivo: { type: "string" },
                responsable: { type: "string" },
                indicadorControl: { type: "string" },
                frecuenciaRevision: { type: "string" }
              }
            }
          }
        }
      },
      system: "Genera un manual preventivo y correctivo de calidad empresarial. Responde JSON estricto.",
      user: JSON.stringify(top, null, 2)
    });
    return result?.items || fallbackManual(top);
  } catch (error) {
    return fallbackManual(top).map((item) => ({ ...item, apiAviso: `Fallback usado: ${error.message}` }));
  }
}

async function preguntarSobreDatos(pregunta = "", data = {}, options = {}) {
  const local = respuestaLocal(pregunta, data, options);
  try {
    const result = await structuredJson({
      name: "quality_data_question_answer",
      schema: {
        type: "object",
        additionalProperties: false,
        required: ["titulo", "resumen", "puntos", "recomendaciones", "prioridad", "fuente"],
        properties: {
          titulo: { type: "string" },
          resumen: { type: "string" },
          puntos: { type: "array", items: { type: "string" } },
          recomendaciones: { type: "array", items: { type: "string" } },
          prioridad: { type: "string" },
          fuente: { type: "string" }
        }
      },
      system: "Responde como asistente de calidad empresarial. Usa solo el contexto entregado. No muestres JSON al usuario; entrega contenido claro para una feria.",
      user: JSON.stringify({
        pregunta,
        gestion: options.gestion,
        tipoConsulta: options.tipoConsulta,
        etapa: options.etapa,
        indicadores: data.indicadores,
        pareto: data.charts?.paretoGeneral?.slice(0, 8),
        sixM: data.charts?.sixM,
        fallasCriticas: data.alertas?.slice(0, 8),
        gastosPorEtapa: data.charts?.gastosPorEtapa,
        documentos: data.documentos?.map((d) => ({ nombre: d.nombreDocumento, resumen: d.resumenIa || d.textoExtraido?.slice(0, 220) })).slice(0, 6)
      }, null, 2)
    });
    return result || local;
  } catch (error) {
    return { ...local, aviso: `IA desactivada, usando respuesta local basada en reglas. ${error.message}` };
  }
}

function fallbackDocumentAnalysis(text = "") {
  const lower = text.toLowerCase();
  const etapas = ["corte", "maquila", "bordado", "terminacion", "compras", "moldes"].filter((word) => lower.includes(word));
  const categoria = lower.includes("maquina") ? "Maquina" : lower.includes("material") ? "Materiales" : lower.includes("capacit") ? "Mano de obra" : lower.includes("medid") || lower.includes("talla") ? "Medicion" : "Metodo";
  return {
    resumen: text ? `Resumen automatico sin API: se detecto informacion de calidad en ${text.slice(0, 180)}...` : "No se recibio texto para analizar.",
    pedidosDetectados: [],
    etapasDetectadas: etapas,
    fallasDetectadas: [{ nombreFalla: "Falla detectada desde documento", descripcion: text.slice(0, 220), etapa: etapas[0] || "Sin etapa", gravedad: 6, frecuencia: 1, categoria6M: categoria, causaRaiz: "Clasificacion por reglas locales" }],
    gastosDetectados: lower.includes("bs") || lower.includes("costo") ? [{ tipoGasto: "reproceso", monto: 100, descripcion: "Gasto estimado detectado por reglas", etapa: etapas[0] || "Sin etapa" }] : [],
    datosControlCalidad: [],
    causas6M: [categoria],
    recomendaciones: recommendationFor({ categoria6M: categoria, gravedad: 6 }),
    accionesPreventivas: ["Estandarizar registro de datos y validar con checklist."],
    accionesCorrectivas: ["Revisar el lote afectado y documentar la correccion."],
    nivelConfianza: 0.55
  };
}

function fallbackClassifyFailure(falla = {}) {
  const text = `${falla.nombreFalla || ""} ${falla.descripcion || ""} ${falla.etapa || ""}`.toLowerCase();
  const categoria6M = text.includes("costura") || text.includes("operario") ? "Mano de obra"
    : text.includes("maquina") || text.includes("corte") ? "Maquina"
    : text.includes("material") || text.includes("insumo") ? "Materiales"
    : text.includes("talla") || text.includes("medida") ? "Medicion"
    : text.includes("transporte") || text.includes("extern") ? "Medio ambiente"
    : "Metodo";
  return {
    categoria6M,
    causaRaiz: "Clasificacion fallback: causa probable identificada por palabras clave y etapa del proceso.",
    accionCorrectiva: "Corregir el pedido afectado, registrar evidencia y revisar aprobacion de calidad.",
    accionPreventiva: recommendationFor({ categoria6M, gravedad: falla.gravedad || 6 }).join(" "),
    prioridad: Number(falla.gravedad || 5) >= 7 ? "alta" : "media",
    explicacion: "La prioridad se asigno por gravedad, etapa y palabras clave usando reglas locales."
  };
}

function fallbackReport(data = {}) {
  const i = data.indicadores || {};
  return {
    informe: `QualityData AI analizo ${i.totalPedidos || 0} pedidos y ${i.totalFallas || 0} fallas. La etapa mas critica es ${i.etapaCritica || "sin datos"} y la falla principal es ${i.fallaPrincipal || "sin datos"}. El costo total estimado asciende a ${Number(i.costoTotal || 0).toFixed(2)}.`,
    conclusion: "La mejora debe concentrarse en las etapas con mayor impacto acumulado, aplicando control preventivo y seguimiento semanal.",
    recomendaciones: data.recomendaciones || ["Aplicar Pareto, revisar causas 6M y mantener control de indicadores."]
  };
}

function fallbackManual(fallas = []) {
  return fallas.slice(0, 8).map((falla) => ({
    etapa: falla.etapa,
    fallaRelacionada: falla.nombreFalla,
    causa: falla.causaRaiz || "Causa por confirmar en revision de calidad.",
    procedimientoPreventivo: "Verificar requisitos, materiales, responsables y evidencias antes de liberar la etapa.",
    procedimientoCorrectivo: "Detener avance del pedido afectado, corregir la falla y registrar accion.",
    responsable: "Responsable de Calidad",
    indicadorControl: "Pedidos sin reproceso",
    frecuenciaRevision: "Semanal"
  }));
}

function respuestaLocal(pregunta = "", data = {}, options = {}) {
  const i = data.indicadores || {};
  const topGasto = data.charts?.paretoGastos?.[0];
  const p = pregunta.toLowerCase();
  const puntos = [
    `Gestion analizada: ${options.gestion || i.gestionActiva || "sin gestion"}.`,
    `Etapa mas critica: ${i.etapaCritica || "sin datos"}.`,
    `Falla principal: ${i.fallaPrincipal || "sin datos"}.`,
    `Categoria 6M dominante: ${i.categoria6M || "sin datos"}.`
  ];
  if (p.includes("costo") || p.includes("gasto")) puntos.push(`Mayor impacto economico observado: ${topGasto?.nombre || "sin datos"}. Costo total estimado: ${Number(i.costoTotal || 0).toFixed(2)}.`);
  if (p.includes("recom")) puntos.push("La mejora prioritaria es controlar la primera etapa critica del Pareto con checklist, responsable y seguimiento semanal.");
  return {
    titulo: "Respuesta local de QualityData AI",
    resumen: `Segun los datos cargados, la prioridad de mejora esta en ${i.etapaCritica || "la etapa con mayor impacto"} porque concentra fallas relevantes y costos asociados.`,
    puntos,
    recomendaciones: data.recomendaciones?.slice(0, 5) || ["Aplicar Pareto, revisar causas 6M y actualizar el manual preventivo."],
    prioridad: Number(i.alertasCriticas || 0) > 0 ? "alta" : "media",
    fuente: "Base de datos local, indicadores, fallas, gastos y documentos cargados",
    aviso: client() ? "" : "IA desactivada, usando respuesta local basada en reglas."
  };
}

module.exports = { fallbackDocumentAnalysis, analyzeDocument, analizarDocumento, classifyFailure, generateReport, generateManual, preguntarSobreDatos };
