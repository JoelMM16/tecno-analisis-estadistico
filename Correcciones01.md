Necesito que corrijas, reorganices y mejores la aplicacion QualityData AI segun estas observaciones. La app ya existe, asi que NO quiero rehacer todo desde cero. Quiero que revises la estructura actual, mantengas lo que funciona y mejores los modulos indicados.

OBJETIVO GENERAL DE LA MEJORA

La aplicacion debe funcionar como un sistema interno para una empresa textil demo. La idea principal es que la empresa cargue sus archivos, documentos y datos; luego el sistema ordene toda esa informacion, genere tablas, graficos, conclusiones, recomendaciones, informes Word/PDF y manuales preventivos.

La app debe verse mas profesional, mas limpia y mas util para una feria universitaria.

PROBLEMAS ACTUALES DETECTADOS

1. En el Dashboard hay demasiados filtros y varios no muestran opciones reales.
2. Algunos graficos tienen nombres muy largos y se ven apretados o montados.
3. El grafico de “Distribucion 6M” no se entiende claramente.
4. En “Carga inteligente” quiero poder subir varios archivos a la vez, no solo uno.
5. El Asistente IA actualmente parece mas para analizar texto pegado, pero deberia servir para hacer preguntas sobre los documentos ya cargados.
6. Las respuestas de IA se muestran como JSON o texto crudo, eso se ve feo e inentendible.
7. “Generar informe” y “Generar manual preventivo” no deben mostrar cuadros de texto raros; deben generar documentos Word y PDF bien formateados.
8. En Informes la previsualizacion debe verse mejor.
9. En Informes se debe quitar exportar a Excel, imprimir y copiar texto completo.
10. El menu lateral debe ser plegable.
11. Hay filtros que no sirven y deben eliminarse o activarse correctamente.
12. La app debe recordar usar la API key de OpenAI desde .env, no hardcodeada.

CAMBIO 1: SIDEBAR PLEGABLE

Hacer que el menu lateral sea plegable.

Debe tener dos estados:

A) Expandido:
- muestra icono + texto
- ancho normal

B) Contraido:
- muestra solo iconos
- ancho reducido
- tooltip al pasar el mouse

Agregar boton arriba del sidebar para plegar/desplegar.

Guardar preferencia en localStorage:
sidebarCollapsed = true/false

El diseño debe seguir profesional:
- fondo azul oscuro
- opcion activa resaltada
- iconos claros
- transicion suave
- sin romper el layout

CAMBIO 2: DASHBOARD MAS LIMPIO

Reducir los filtros del Dashboard.

Actualmente hay demasiados filtros y muchos estan vacios. Quiero que solo queden filtros utiles y con datos reales.

Filtros que deben quedar:
- Gestion / Año
- Rango de fechas
- Etapa
- Estado de falla
- Nivel de criticidad

Eliminar filtros que no tengan datos reales o que no aporten.

Regla importante:
Si un filtro no tiene opciones disponibles, NO debe mostrarse.

Agregar boton:
“Limpiar filtros”

El Dashboard debe mostrar:

Tarjetas principales:
- Total de pedidos
- Total de fallas
- Costo total de fallas
- Tiempo total de demora
- Pedidos retrasados
- Etapa mas critica
- Falla mas importante
- Documentos procesados

Graficos principales:
- Pareto general
- Fallas por etapa
- Gastos por etapa
- Causas 6M por impacto
- Evolucion mensual de fallas
- Alertas criticas

CAMBIO 3: ARREGLAR GRAFICOS CON NOMBRES APRETADOS

Corregir todos los graficos donde los nombres se ven apretados, inclinados o montados.

Soluciones esperadas:
- abreviar etiquetas largas en el eje X
- mostrar nombre completo en tooltip
- permitir scroll horizontal si hay muchas categorias
- aumentar margen inferior cuando haga falta
- usar layout vertical en graficos con nombres largos
- para Pareto, preferir barras horizontales si los nombres son largos
- truncar labels con “...” cuando pasen cierto largo

Ejemplo:
En vez de mostrar:
“Terminacion, plancha, deshilado y embalaje”

mostrar en eje:
“Terminacion...”

y en tooltip:
“Terminacion, plancha, deshilado y embalaje”

IMPORTANTE:
Los graficos deben ser faciles de explicar en una feria. No deben verse saturados.

CAMBIO 4: MEJORAR EL GRAFICO 6M

El grafico actual dice “Distribucion 6M” pero no se entiende que analiza.

Renombrarlo a:

“Causas raiz por metodologia 6M”

Agregar debajo una descripcion corta:
“Este grafico clasifica las fallas segun su causa principal: Metodo, Mano de obra, Maquina, Materiales, Medicion y Medio ambiente.”

El grafico no debe contar solamente cantidad de fallas. Debe permitir alternar entre:

1. Cantidad de fallas por 6M
2. Impacto total por 6M
3. Costo total por 6M

Agregar selector:
“Analizar por: Cantidad / Impacto / Costo”

Formula impacto:
impacto = frecuencia * gravedad

Ademas, agregar una tarjeta de interpretacion:
“Segun los datos, la categoria 6M mas critica es ____ porque concentra ____ del impacto total.”

CAMBIO 5: MEJORAR CARGA INTELIGENTE

El modulo “Carga inteligente” debe ser el centro de la app.

Debe permitir subir entre 1 y 5 archivos al mismo tiempo.

Tipos permitidos:
- Excel .xlsx
- CSV
- Word .docx
- PDF
- Imagen JPG/PNG
- Texto pegado manualmente

Flujo esperado:

1. Usuario selecciona gestion/año.
2. Usuario sube hasta 5 archivos.
3. La app muestra lista de archivos cargados.
4. Para cada archivo muestra:
   - nombre
   - tipo
   - tamaño
   - estado: pendiente, procesando, procesado, error
5. La app extrae contenido:
   - Excel/CSV: tablas
   - Word: texto y tablas si es posible
   - PDF: texto
   - Imagen: OCR
6. La app muestra una vista previa del contenido extraido.
7. La IA analiza todos los archivos juntos.
8. La IA detecta:
   - pedidos
   - etapas
   - fallas
   - gastos
   - demoras
   - causas
   - datos de control
   - acciones correctivas
   - acciones preventivas
9. La app muestra una pantalla de revision antes de guardar.
10. El usuario puede editar o corregir los datos detectados.
11. El usuario confirma.
12. Se guardan los datos en las tablas correspondientes.
13. Se actualizan Dashboard, Explorador, Graficos, Informes y Asistente IA.

Botones necesarios:
- Subir archivos
- Pegar texto
- Analizar con IA
- Previsualizar datos
- Confirmar importacion
- Cancelar importacion
- Limpiar carga
- Ver historial de cargas

IMPORTANTE:
No guardar automaticamente datos de IA sin que el usuario revise primero.

CAMBIO 6: SOPORTE PARA WORD

Agregar soporte para leer archivos Word .docx.

Backend:
Instalar y usar libreria mammoth para extraer texto de .docx.

Comando:
npm install mammoth

Servicio esperado:
backend/src/services/document.service.js

Debe detectar si el archivo es .docx y extraer el texto.

CAMBIO 7: ASISTENTE IA COMO CHAT SOBRE DATOS CARGADOS

El modulo “Asistente IA” debe cambiar de enfoque.

Ya no debe ser principalmente un cuadro para “Analizar documento”. Eso debe estar en Carga inteligente.

Ahora el Asistente IA debe funcionar como un chat/panel de preguntas sobre la informacion ya cargada.

Ejemplos de preguntas:
- ¿Cual es la etapa mas critica de la gestion 2026?
- ¿Que falla genera mas costo?
- ¿Que recomienda mejorar primero?
- ¿Que causas 6M se repiten mas?
- ¿Que pedidos tuvieron mas retrasos?
- ¿Que conclusion puedo decir en la exposicion?
- Genera un resumen ejecutivo de la empresa.
- Explicame el Pareto general en palabras simples.
- ¿Que acciones preventivas recomiendas para moldes?

La IA debe responder usando:
- datos guardados en la base de datos
- documentos cargados
- resultados de graficos
- fallas
- gastos
- pedidos
- control de calidad

Implementacion sugerida:
- crear endpoint /api/ia/preguntar
- recibir pregunta, gestion activa y contexto
- buscar datos relevantes en la base de datos
- incluir resumen de documentos cargados
- enviar contexto a OpenAI
- devolver respuesta clara y formateada

Si no hay OpenAI API key:
- responder usando analisis local basico
- mostrar aviso: “IA desactivada, usando respuesta local basada en reglas.”

QUITAR FILTROS INUTILES DEL ASISTENTE IA

Eliminar filtros que no sirven o que esten vacios.

Solo dejar:
- Gestion
- Etapa opcional
- Tipo de consulta: General / Fallas / Gastos / Informes / Manual

Si no son necesarios, ocultarlos.

CAMBIO 8: NO MOSTRAR JSON CRUDO EN LA INTERFAZ

Actualmente la IA muestra respuestas como JSON o texto crudo en cuadros oscuros. Eso debe cambiar.

Nunca mostrar JSON crudo al usuario final salvo en modo desarrollador.

Crear componentes visuales:

- AiAnswerCard
- AiRecommendationList
- AiInsightPanel
- AiGeneratedReportPreview

Las respuestas deben mostrarse con:
- titulo
- resumen
- puntos importantes
- recomendaciones
- acciones sugeridas
- nivel de prioridad
- fuente de datos usada

Si internamente la IA responde JSON, convertirlo en HTML/Markdown visual antes de mostrar.

CAMBIO 9: GENERAR INFORME WORD Y PDF

El boton “Generar informe” debe crear documentos reales, no solo texto en pantalla.

Formatos:
- Word .docx
- PDF .pdf

Eliminar exportar a Excel desde Informes.

Instalar dependencias necesarias:

Backend:
npm install docx

Para PDF usar una de estas opciones:
- puppeteer
o
- html-pdf-node
o
- generar HTML imprimible y exportarlo a PDF desde backend

Preferencia:
Usar docx para Word y puppeteer para PDF si es posible.

El informe generado debe verse decente y formal.

Estructura del informe:

1. Portada
   - QualityData AI
   - Informe Ejecutivo de Calidad
   - Empresa Textil de Uniformes
   - Gestion seleccionada
   - Fecha de generacion

2. Resumen ejecutivo

3. Datos analizados
   - total de pedidos
   - total de fallas
   - total de gastos
   - documentos procesados

4. Indicadores principales

5. Analisis de fallas
   - etapa mas critica
   - falla principal
   - fallas criticas

6. Analisis economico
   - costo total
   - gasto por etapa
   - fallas con mayor impacto economico

7. Analisis 6M
   - categoria mas critica
   - causas principales

8. Recomendaciones

9. Acciones correctivas

10. Acciones preventivas

11. Conclusion

El Word debe tener:
- titulos claros
- subtitulos
- tablas
- listas
- buena separacion
- texto legible
- nada de JSON crudo

El PDF debe verse similar al Word.

CAMBIO 10: GENERAR MANUAL PREVENTIVO WORD Y PDF

El boton “Generar manual preventivo” debe generar un documento real Word y PDF.

Debe estar en el modulo Manual Preventivo o como accion rapida, pero NO debe ensuciar el modulo Informes.

Estructura del manual:

1. Portada
   - Manual Preventivo de Calidad
   - Empresa Textil de Uniformes
   - Gestion seleccionada

2. Objetivo del manual

3. Alcance

4. Procesos analizados

5. Tabla de fallas preventivas

Columnas:
- Etapa
- Falla posible
- Causa probable
- Prevencion
- Accion correctiva
- Responsable sugerido
- Indicador de control

6. Procedimientos por etapa

7. Recomendaciones generales

8. Conclusion

IMPORTANTE:
No mostrar el manual como cuadro de JSON.
Debe tener previsualizacion visual y botones para descargar Word/PDF.

CAMBIO 11: MEJORAR MODULO INFORMES

En el modulo Informes:

Eliminar botones:
- Exportar a Excel
- Imprimir
- Copiar texto completo

Dejar solo:
- Generar informe
- Descargar Word
- Descargar PDF
- Regenerar con IA

Si se mantiene “Copiar”, que solo copie el titulo o resumen corto, no todo el informe.

Quitar del modulo Informes la parte de “Manual preventivo” como tipo de informe, porque el manual ya tiene su propio modulo.

Mejorar previsualizacion:
- no mostrar texto crudo
- no mostrar JSON
- mostrar estructura tipo documento
- tarjetas o secciones con titulos
- tablas resumidas
- recomendaciones en lista

La previsualizacion debe parecer un informe real.

CAMBIO 12: MEJORAS EN PROCESOS, FALLAS, GASTOS Y ANALISIS ESTADISTICO

Estos apartados estan aceptables, pero se pueden mejorar.

Procesos / Etapas:
Agregar por cada etapa:
- total de fallas
- costo asociado
- tiempo de demora
- nivel de riesgo
- recomendacion principal

Fallas:
Agregar:
- badge de criticidad: baja, media, alta, critica
- accion rapida “analizar con IA”
- accion rapida “generar recomendacion”
- filtro “solo criticas”
- filtro “sin accion preventiva”

Gastos:
Agregar:
- total acumulado arriba
- gasto promedio por falla
- gasto mas alto
- gasto por tipo
- grafico de gasto mensual

Analisis estadistico:
Agregar textos explicativos cortos debajo de cada grafico.

Ejemplo para Pareto:
“El Pareto ayuda a identificar las fallas que concentran mayor impacto. Se recomienda priorizar las primeras barras porque representan la mayor parte del problema.”

Ejemplo para Diagrama de control:
“Este grafico permite observar si el proceso se mantiene estable o si existen puntos fuera de control.”

CAMBIO 13: RECORDATORIO DE OPENAI API KEY

Revisar que la app use OpenAI API correctamente.

No hardcodear la key.

backend/.env.example debe incluir:

PORT=3000
DATABASE_URL=./database/qualitydata.sqlite
OPENAI_API_KEY=colocar_api_key_aqui
AI_ENABLED=true

El backend debe leer:
process.env.OPENAI_API_KEY

Agregar en Configuracion:
- Estado de IA
- Boton “Probar conexion con OpenAI”
- Mensaje claro si no hay key
- Mensaje claro si la key funciona

Si no hay key:
La app debe seguir funcionando con reglas locales.

CAMBIO 14: HISTORIAL DE CARGAS

En Carga inteligente agregar historial:

Cada carga debe guardar:
- fecha
- gestion
- archivos cargados
- cantidad de pedidos detectados
- cantidad de fallas detectadas
- cantidad de gastos detectados
- estado
- resumen IA
- errores si existieron

Debe poder verse desde Explorador de datos.

CAMBIO 15: VALIDACION FINAL

Antes de terminar, revisar:

1. El Dashboard no debe tener filtros vacios.
2. Los graficos no deben tener labels montados.
3. El 6M debe explicar que analiza.
4. Carga inteligente debe aceptar multiples archivos.
5. Asistente IA debe responder preguntas sobre datos ya cargados.
6. No debe mostrarse JSON crudo al usuario.
7. Generar informe debe crear Word y PDF.
8. Generar manual preventivo debe crear Word y PDF.
9. Informes no debe tener exportar Excel ni imprimir.
10. Sidebar debe ser plegable.
11. Todo debe funcionar con y sin OpenAI API key.
12. No dejar botones sin accion real.

RESULTADO ESPERADO

Quiero que la aplicacion quede mas profesional, limpia y util para feria.

El flujo ideal debe ser:

1. La empresa inicia sesion.
2. Selecciona gestion.
3. Sube varios archivos en Carga inteligente.
4. La app extrae informacion.
5. La IA ordena y clasifica datos.
6. El usuario revisa y confirma.
7. La app actualiza tablas y graficos.
8. El Dashboard muestra indicadores claros.
9. El Asistente IA responde preguntas sobre la informacion cargada.
10. El sistema genera informes Word/PDF.
11. El sistema genera manual preventivo Word/PDF.
12. Todo se ve ordenado, sin JSON crudo ni cuadros incomprensibles.