# QualityData AI

**QualityData AI - Plataforma Web de Analisis Estadistico de Calidad Empresarial** es una aplicacion web para feria universitaria enfocada como sistema interno de una empresa textil de uniformes y prendas personalizadas. La informacion se organiza por gestiones/anios: 2024, 2025 y 2026.

## Objetivo

Permitir que la Empresa Textil de Uniformes cargue informacion operativa, importe Excel/CSV, cargue documentos, visualice datos limpios por gestion, aplique herramientas estadisticas exactas y use IA como apoyo para interpretar documentos, clasificar fallas, sugerir causas 6M, proponer acciones y redactar informes.

La IA no reemplaza los calculos estadisticos. Pareto, costos, frecuencias, porcentajes, dispersion y limites de control son calculados por la app.

## Tecnologias

- Frontend: React, Vite, React Router, Recharts, SheetJS/xlsx, lucide-react.
- Backend: Node.js, Express, SQLite con better-sqlite3, Multer.
- Documentos: pdf-parse para PDF con texto, Tesseract.js preparado para OCR.
- IA: capa `ai.service.js` con salida JSON y fallback sin API key.

## Abrir en Visual Studio Code

1. Abre `QualityData-AI.code-workspace`.
2. En terminal ejecuta:

```bash
npm run install:all
npm run dev
```

Tambien puedes usar las tareas de VS Code:

- `Instalar dependencias`
- `Ejecutar app completa`
- `Backend`
- `Frontend`

## Ejecucion manual

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000/api/health`

## Login demo

- Usuario: `demo@textilquality.com`
- Contraseña: `demo123`

Tambien puedes usar el boton `Entrar como empresa demo`.

## Datos demo

La base SQLite se crea automaticamente y carga:

- usuario demo.
- Empresa Textil de Uniformes.
- gestiones 2024, 2025 y 2026.
- 9 etapas del proceso productivo.
- 50 pedidos en la gestion 2026.
- Fallas por etapa.
- Gastos inventados.
- Datos de control de calidad.
- Manual preventivo inicial.

En `Configuracion` existen botones para cargar, limpiar y restaurar la demo textil.

## Importar Excel

En `Carga inteligente`:

1. Presiona `Generar plantilla Excel`.
2. Llena las hojas: Pedidos, Etapas, Fallas, Gastos, ControlCalidad y ManualPreventivo.
3. Sube el archivo `.xlsx`.
4. Revisa validacion y vista previa.
5. Presiona `Confirmar importacion`.

Tambien puedes exportar datos actuales o un informe a Excel.

## IA

La pantalla `Asistente IA` permite:

- Analizar documentos.
- Clasificar fallas.
- Generar informe.
- Generar manual preventivo.

Sin `OPENAI_API_KEY`, la app usa reglas fallback y sigue funcionando. Para integrar OpenAI, crea `backend/.env` basado en `backend/.env.example` y agrega tu clave.

## OCR y documentos

La pantalla `Carga inteligente` acepta:

- PDF.
- Imagen PNG/JPG.
- Excel.
- CSV.
- Texto pegado.

El texto extraido se muestra, se analiza y luego el usuario puede crear fallas o gastos desde el documento. Si el entorno no puede ejecutar OCR, la app muestra un mensaje claro y mantiene el flujo activo.

## Estructura

El proyecto mantiene la estructura solicitada:

- `frontend/src/api`
- `frontend/src/components`
- `frontend/src/pages`
- `frontend/src/hooks`
- `frontend/src/services`
- `frontend/src/utils`
- `frontend/src/constants`
- `backend/src/database`
- `backend/src/routes`
- `backend/src/controllers`
- `backend/src/services`
- `backend/src/uploads`

## Alcance del MVP

Incluye login demo, dashboard por gestion, carga inteligente, pedidos, procesos/etapas, fallas, gastos, explorador de datos, analisis estadistico, asistente IA, informes, manual preventivo y configuracion de demo.

Algunas integraciones avanzadas quedan preparadas para una siguiente version, como OCR pagina por pagina en PDF escaneado y Structured Outputs reales con OpenAI. La app muestra fallback claro y no se detiene si no hay API key.

## Herramientas estadisticas

**Pareto general**: ordena fallas de mayor a menor por `frecuencia * gravedad`, calcula porcentaje individual y porcentaje acumulado.

**Pareto economico**: ordena por impacto economico, usando `frecuencia * costoEstimado` o los gastos registrados.

**6M**: agrupa fallas por Mano de obra, Metodo, Maquina, Materiales, Medicion y Medio ambiente para priorizar causas.

**Dispersion**: compara dos variables seleccionables, como gravedad vs costo o tiempo de demora vs costo.

**Diagrama de control**: calcula promedio, desviacion estandar, limite superior de control y limite inferior de control. Si el LIC es menor a 0, se usa 0.

## Comandos utiles

```bash
npm run dev
npm run backend
npm run frontend
npm run build --prefix frontend
npm test --prefix backend
```
