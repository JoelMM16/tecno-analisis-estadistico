CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  nombre TEXT,
  rol TEXT DEFAULT 'empresa_demo',
  gestion TEXT DEFAULT '2026',
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS empresa_demo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombreEmpresa TEXT NOT NULL,
  rubro TEXT,
  descripcion TEXT,
  ciudad TEXT,
  responsable TEXT,
  correo TEXT,
  telefono TEXT,
  estado TEXT DEFAULT 'activa',
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gestiones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  gestion TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  estado TEXT DEFAULT 'activa',
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS etapas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  gestion TEXT NOT NULL,
  nombreEtapa TEXT NOT NULL,
  descripcion TEXT,
  orden INTEGER,
  responsable TEXT,
  activo INTEGER DEFAULT 1,
  recomendaciones TEXT,
  originalJson TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pedidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  gestion TEXT NOT NULL,
  codigoPedido TEXT NOT NULL,
  cliente TEXT,
  fechaPedido TEXT,
  fechaEntregaPrometida TEXT,
  fechaEntregaReal TEXT,
  tipoPrenda TEXT,
  cantidadPrendas INTEGER,
  estado TEXT,
  etapaActual TEXT,
  observaciones TEXT,
  originalJson TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fallas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  gestion TEXT NOT NULL,
  pedidoId INTEGER,
  etapa TEXT,
  nombreFalla TEXT NOT NULL,
  descripcion TEXT,
  frecuencia INTEGER DEFAULT 1,
  gravedad INTEGER DEFAULT 1,
  impacto INTEGER DEFAULT 1,
  tiempoDemoraHoras REAL DEFAULT 0,
  costoEstimado REAL DEFAULT 0,
  impactoEconomico REAL DEFAULT 0,
  categoria6M TEXT,
  causaRaiz TEXT,
  accionCorrectiva TEXT,
  accionPreventiva TEXT,
  estado TEXT DEFAULT 'pendiente',
  fechaRegistro TEXT,
  originalJson TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gastos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  gestion TEXT NOT NULL,
  etapa TEXT,
  fallaRelacionada TEXT,
  tipoGasto TEXT,
  descripcion TEXT,
  monto REAL DEFAULT 0,
  fecha TEXT,
  responsable TEXT,
  observaciones TEXT,
  originalJson TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documentos_cargados (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  gestion TEXT NOT NULL,
  nombreDocumento TEXT,
  tipoDocumento TEXT,
  estado TEXT DEFAULT 'pendiente',
  rutaArchivo TEXT,
  textoExtraido TEXT,
  datosDetectados TEXT,
  cantidadArchivos INTEGER DEFAULT 1,
  pedidosDetectados INTEGER DEFAULT 0,
  fallasDetectadas INTEGER DEFAULT 0,
  gastosDetectados INTEGER DEFAULT 0,
  resumenIa TEXT,
  errores TEXT,
  originalJson TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS textos_extraidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  gestion TEXT NOT NULL,
  documentoId INTEGER,
  texto TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resultados_ia (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  gestion TEXT NOT NULL,
  documentoId INTEGER,
  tipo TEXT,
  resultadoJson TEXT,
  aprobado INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS control_calidad (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  gestion TEXT NOT NULL,
  pedidoId INTEGER,
  fecha TEXT,
  numeroFallas INTEGER,
  porcentajeDefectos REAL,
  tiempoProcesoHoras REAL,
  etapa TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS manual_preventivo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  gestion TEXT NOT NULL,
  etapa TEXT,
  fallaRelacionada TEXT,
  causa TEXT,
  procedimientoPreventivo TEXT,
  procedimientoCorrectivo TEXT,
  responsable TEXT,
  indicadorControl TEXT,
  frecuenciaRevision TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS informes_generados (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  gestion TEXT NOT NULL,
  tipoInforme TEXT,
  titulo TEXT,
  contenido TEXT,
  datosUsados TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);
