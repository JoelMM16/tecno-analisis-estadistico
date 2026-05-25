const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, "../../qualitydata.sqlite");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

function initDatabase() {
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  db.exec(schema);
}

function all(table) {
  return db.prepare(`SELECT * FROM ${table} ORDER BY id DESC`).all();
}

function list(table, filters = {}) {
  const values = [];
  let sql = `SELECT * FROM ${table}`;
  if (filters.gestion) {
    sql += " WHERE gestion = ?";
    values.push(String(filters.gestion));
  }
  sql += " ORDER BY id DESC";
  return db.prepare(sql).all(values);
}

function get(table, id) {
  return db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
}

function insert(table, payload) {
  const clean = normalizePayload(table, payload);
  const keys = Object.keys(clean);
  const values = keys.map((key) => clean[key]);
  const placeholders = keys.map(() => "?").join(", ");
  const stmt = db.prepare(`INSERT INTO ${table} (${keys.join(", ")}) VALUES (${placeholders})`);
  const info = stmt.run(values);
  return get(table, info.lastInsertRowid);
}

function update(table, id, payload) {
  const clean = normalizePayload(table, payload);
  clean.updatedAt = new Date().toISOString();
  const keys = Object.keys(clean);
  const values = keys.map((key) => clean[key]);
  db.prepare(`UPDATE ${table} SET ${keys.map((key) => `${key} = ?`).join(", ")} WHERE id = ?`).run([...values, id]);
  return get(table, id);
}

function remove(table, id) {
  const row = get(table, id);
  db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
  return row;
}

function normalizePayload(table, payload) {
  const allowed = {
    usuarios: ["usuario", "password", "nombre", "rol", "gestion"],
    empresa_demo: ["nombreEmpresa", "rubro", "descripcion", "ciudad", "responsable", "correo", "telefono", "estado"],
    gestiones: ["gestion", "descripcion", "estado"],
    etapas: ["gestion", "nombreEtapa", "descripcion", "orden", "responsable", "activo", "recomendaciones", "originalJson"],
    pedidos: ["gestion", "codigoPedido", "cliente", "fechaPedido", "fechaEntregaPrometida", "fechaEntregaReal", "tipoPrenda", "cantidadPrendas", "estado", "etapaActual", "observaciones", "originalJson"],
    fallas: ["gestion", "pedidoId", "etapa", "nombreFalla", "descripcion", "frecuencia", "gravedad", "impacto", "tiempoDemoraHoras", "costoEstimado", "impactoEconomico", "categoria6M", "causaRaiz", "accionCorrectiva", "accionPreventiva", "estado", "fechaRegistro", "originalJson"],
    gastos: ["gestion", "etapa", "fallaRelacionada", "tipoGasto", "descripcion", "monto", "fecha", "responsable", "observaciones", "originalJson"],
    documentos_cargados: ["gestion", "nombreDocumento", "tipoDocumento", "estado", "rutaArchivo", "textoExtraido", "datosDetectados", "cantidadArchivos", "pedidosDetectados", "fallasDetectadas", "gastosDetectados", "resumenIa", "errores", "originalJson"],
    control_calidad: ["gestion", "pedidoId", "fecha", "numeroFallas", "porcentajeDefectos", "tiempoProcesoHoras", "etapa"],
    manual_preventivo: ["gestion", "etapa", "fallaRelacionada", "causa", "procedimientoPreventivo", "procedimientoCorrectivo", "responsable", "indicadorControl", "frecuenciaRevision"],
    resultados_ia: ["gestion", "documentoId", "tipo", "resultadoJson", "aprobado"],
    textos_extraidos: ["gestion", "documentoId", "texto"],
    informes_generados: ["gestion", "tipoInforme", "titulo", "contenido", "datosUsados"]
  }[table];
  const clean = {};
  allowed.forEach((key) => {
    if (payload[key] !== undefined) clean[key] = payload[key];
  });
  if (table === "fallas") {
    clean.frecuencia = Number(clean.frecuencia || 1);
    clean.gravedad = Number(clean.gravedad || 1);
    clean.costoEstimado = Number(clean.costoEstimado || 0);
    clean.impacto = clean.frecuencia * clean.gravedad;
    clean.impactoEconomico = clean.frecuencia * clean.costoEstimado;
    clean.fechaRegistro = clean.fechaRegistro || new Date().toISOString().slice(0, 10);
  }
  return clean;
}

module.exports = { db, initDatabase, all, list, get, insert, update, remove };
