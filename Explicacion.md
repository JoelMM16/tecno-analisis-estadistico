# Explicacion de la aplicacion QualityData AI

## Nombre de la aplicacion

**QualityData AI - Plataforma Web de Analisis Estadistico de Calidad Empresarial**

## De que trata la aplicacion

QualityData AI es una aplicacion web profesional pensada para una feria universitaria. Su objetivo es mostrar como una empresa textil puede analizar la calidad de sus procesos productivos usando datos reales o simulados, herramientas estadisticas e inteligencia artificial como apoyo.

La demo esta enfocada en una empresa llamada:

**Empresa Textil de Uniformes**

Esta empresa se dedica a la fabricacion de uniformes, prendas personalizadas, bordados, corte, maquila y terminacion de pedidos.

La aplicacion funciona como un sistema interno de la empresa. El usuario entra mediante un login demo, selecciona una gestion o anio de analisis, por ejemplo 2024, 2025 o 2026, y desde ahi puede revisar pedidos, fallas, gastos, procesos, indicadores, graficos, recomendaciones e informes.

## Problema que busca resolver

En muchas empresas pequenas o medianas la informacion de calidad se encuentra desordenada en Excel, documentos, reportes, imagenes, apuntes o archivos sueltos. Esto dificulta saber:

- Cuales son las fallas mas frecuentes.
- Que etapa del proceso genera mas problemas.
- Cuanto dinero se pierde por reprocesos o errores.
- Que causas se repiten mas.
- Que acciones correctivas y preventivas se deben aplicar.
- Como presentar resultados claros para tomar decisiones.

QualityData AI busca ordenar esa informacion y convertirla en indicadores utiles para la gestion de calidad.

## Como funciona la aplicacion

El flujo principal es:

1. El usuario entra al login demo.
2. Inicia sesion como empresa textil.
3. Selecciona una gestion: 2024, 2025 o 2026.
4. Carga informacion desde el modulo **Carga inteligente**.
5. La app extrae y ordena los datos.
6. La IA ayuda a interpretar texto, clasificar fallas y proponer recomendaciones.
7. La app calcula indicadores estadisticos exactos.
8. Los datos se muestran en tablas, filtros y graficos.
9. Se generan informes y manuales preventivos.

## Alcance de la aplicacion

La aplicacion permite:

- Iniciar sesion con un usuario demo.
- Trabajar con una sola empresa textil.
- Organizar la informacion por gestiones o anios.
- Cargar datos desde Excel, CSV, PDF, imagenes o texto pegado.
- Extraer texto de documentos.
- Analizar informacion con IA si existe API key de OpenAI.
- Usar reglas locales si la IA no esta activa.
- Registrar pedidos.
- Gestionar procesos o etapas de produccion.
- Registrar fallas de calidad.
- Registrar gastos asociados a fallas.
- Calcular indicadores de calidad.
- Generar Pareto general.
- Generar Pareto economico.
- Analizar causas con metodologia 6M.
- Crear diagramas de dispersion.
- Crear diagramas de control.
- Ver datos en tablas con filtros, busqueda y paginacion.
- Generar informes.
- Generar manual preventivo.
- Exportar datos a Excel.

## Que no reemplaza la IA

La inteligencia artificial no reemplaza los calculos estadisticos.

Los calculos importantes los realiza la aplicacion de forma exacta:

- Frecuencias.
- Porcentajes.
- Porcentajes acumulados.
- Impacto de fallas.
- Costos estimados.
- Pareto.
- Diagramas de control.
- Diagramas de dispersion.
- Indicadores generales.

La IA solo funciona como apoyo para:

- Interpretar documentos.
- Ordenar texto desordenado.
- Clasificar fallas.
- Sugerir categoria 6M.
- Proponer causa raiz.
- Generar recomendaciones.
- Redactar informes.
- Crear procedimientos preventivos y correctivos.

## Modulos principales

### 1. Login

Permite entrar a la aplicacion con un usuario demo.

Usuario:

```txt
demo@textilquality.com
```

Contraseña:

```txt
demo123
```

### 2. Dashboard

Muestra los indicadores principales de la gestion seleccionada:

- Total de pedidos.
- Total de fallas.
- Costo total estimado.
- Tiempo total de demora.
- Pedidos retrasados.
- Etapa mas critica.
- Falla principal.
- Categoria 6M mas repetida.
- Documentos procesados.
- Alertas criticas.

Tambien muestra graficos como Pareto, fallas por etapa, gastos por etapa y distribucion 6M.

### 3. Carga inteligente

Es el modulo central de la aplicacion.

Permite cargar informacion desde:

- Excel.
- CSV.
- PDF.
- Imagenes JPG o PNG.
- Documentos escaneados.
- Texto pegado manualmente.

Luego la app extrae el contenido, lo analiza, muestra una vista previa y permite confirmar la importacion.

### 4. Explorador de datos

Permite revisar toda la informacion guardada:

- Cargas realizadas.
- Pedidos.
- Etapas.
- Fallas.
- Gastos.
- Control de calidad.
- Resultados IA.
- Manual preventivo.

### 5. Pedidos

Muestra y gestiona los pedidos de la empresa textil.

### 6. Procesos / Etapas

Muestra las etapas del proceso productivo:

1. Cliente realiza el pedido.
2. Pedido pasa a produccion.
3. Compra de materia prima e insumos.
4. Preparacion de moldes.
5. Proceso de corte.
6. Proceso de maquila.
7. Personalizacion de prendas.
8. Terminacion, plancha, deshilado y embalaje.
9. Envio a oficina central para entrega al cliente.

### 7. Fallas

Permite registrar y analizar fallas de calidad.

La aplicacion calcula:

```txt
impacto = frecuencia * gravedad
```

Y tambien:

```txt
impactoEconomico = frecuencia * costoEstimado
```

### 8. Gastos

Permite registrar costos relacionados con fallas, reprocesos, demoras, materiales perdidos, transporte, mantenimiento u otros gastos.

### 9. Analisis estadistico

Incluye:

- Pareto general.
- Pareto por etapa.
- Pareto economico.
- Analisis 6M.
- Diagrama de dispersion.
- Diagrama de control.
- Tendencias por gestion.

### 10. Asistente IA

Permite usar inteligencia artificial para analizar informacion, clasificar fallas, generar recomendaciones, conclusiones, informes y manuales preventivos.

### 11. Informes

Genera informes de gestion, informes economicos, informes por etapa, informes de fallas criticas e informes para exposicion.

### 12. Manual preventivo

Muestra procedimientos preventivos y correctivos basados en las fallas detectadas.

### 13. Configuracion

Permite ver datos de la empresa demo, gestion activa, estado de IA, probar conexion con backend, restaurar datos demo y revisar configuraciones.

## Tecnologias que vamos a usar

## Frontend

El frontend es la parte visual de la aplicacion.

Tecnologias:

- **React**: para construir la interfaz.
- **Vite**: para ejecutar y compilar el proyecto rapidamente.
- **React Router**: para manejar las pantallas de la aplicacion.
- **Recharts**: para crear graficos estadisticos.
- **SheetJS / xlsx**: para leer y exportar archivos Excel.
- **Lucide React**: para iconos modernos.
- **TanStack Table**: para tablas avanzadas.
- **PapaParse**: para leer archivos CSV.
- **Date-fns**: para manejo de fechas.
- **jsPDF**: para preparar exportacion de informes en PDF.
- **CSS moderno**: para el diseño visual responsivo y profesional.

## Backend

El backend es la parte que procesa datos, guarda informacion y expone la API.

Tecnologias:

- **Node.js**: entorno de ejecucion del servidor.
- **Express**: framework para crear la API REST.
- **SQLite**: base de datos local para la demo.
- **better-sqlite3**: libreria para trabajar con SQLite.
- **CORS**: para conectar frontend y backend.
- **Dotenv**: para leer variables de entorno.
- **Multer**: para subir archivos.
- **Zod**: para validar datos.
- **SheetJS / xlsx**: para importar y exportar Excel.
- **pdf-parse**: para extraer texto de PDFs.
- **Tesseract.js**: para OCR en imagenes o documentos escaneados.
- **OpenAI SDK**: para conectar con la API de OpenAI.
- **UUID**: para identificadores unicos.
- **Dayjs**: para manejo de fechas.
- **Nodemon**: para desarrollo del backend.

## Inteligencia artificial

La app esta preparada para usar OpenAI API mediante una clave en el archivo:

```txt
backend/.env
```

La clave no debe estar escrita directamente en el codigo.

Si existe `OPENAI_API_KEY` y `AI_ENABLED=true`, la app muestra:

```txt
IA activa
```

Si no existe una clave valida, la app muestra:

```txt
IA desactivada - modo reglas locales
```

En ese caso, la aplicacion sigue funcionando con reglas locales.

## Base de datos

La base de datos usa SQLite y contiene tablas como:

- usuarios.
- empresa_demo.
- gestiones.
- pedidos.
- etapas.
- fallas.
- gastos.
- documentos_cargados.
- textos_extraidos.
- resultados_ia.
- control_calidad.
- manual_preventivo.
- informes_generados.

## Resultado esperado

El resultado final es una demo profesional para feria donde se puede mostrar:

- Una empresa textil realista.
- Login demo.
- Datos organizados por gestion.
- Carga inteligente de informacion.
- Analisis estadistico.
- Graficos.
- Tablas filtrables.
- Recomendaciones.
- Informes.
- Manual preventivo.
- Asistencia con IA.

La aplicacion busca demostrar como una empresa puede transformar informacion desordenada en decisiones claras para mejorar la calidad de sus procesos.
