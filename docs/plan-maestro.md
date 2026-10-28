# Plan maestro: Ruta de datos y app de aprendizaje

*Creado el 21 oct 2026 · Diego Ávila*

## Visión

Una ruta para aprender datos desde cero hasta Data Engineer, entregada en una app propia para iPhone. Yo soy el usuario piloto: cada módulo se prueba conmigo, se ajusta y solo entonces se abre a otras personas.

- **Para quién:** cualquier persona que empieza desde cero, o un analista que quiere dar el salto.
- **Compromiso:** 1 hora diaria, lunes a viernes (5 h/semana).
- **Promesa:** lecciones tan claras que no necesitas a nadie al lado para entenderlas.
- **Principio de construcción:** primero el contenido, después la app. La app solo muestra lo que el contenido ya resolvió.

## Modelo de aprendizaje híbrido

*Actualizado el 27 oct 2026: la ruta ya no va por días de la semana, sino por unidades con paradas.*

Cada módulo se divide en **unidades** (antes "semanas"). Cada unidad es un camino de **paradas** que se abren en orden; al terminar una se abre la siguiente. En la app se ve como un mapa.

| Parada | Qué se hace | Qué se entrega |
| --- | --- | --- |
| Lección 1 | Concepto nuevo, contado como historia | Quiz corto de comprensión |
| Lección 2 | Profundización + ejemplo resuelto | Ejercicios guiados |
| Proyecto 1 | Mini-proyecto: arranque | Datos explorados y plan del análisis |
| Proyecto 2 | Mini-proyecto: cierre | Consulta, script o notebook terminado |
| Repaso | Repaso + nota pública | Publicación en LinkedIn, blog o GitHub |

**Reglas del ciclo**

- Ritmo sugerido: una parada por día (1 h), lunes a viernes. Se pueden hacer varias en un día; la racha cuenta si haces al menos una.
- No se salta una parada: la ruta mide avance por temas, no por fechas.
- La nota del repaso sigue una plantilla fija: qué aprendí, un ejemplo propio, un error que cometí.
- Cada 4 unidades, una parada extra de repaso espaciado de los temas anteriores.
- Cada módulo cierra con un **proyecto integrador** para portafolio y, en los módulos clave, un **examen de salida**.

## Ruta completa

*Actualizado el 27 oct 2026: SQL se divide en dos módulos, se agrega la etapa Data Analyst, Git sube al inicio y se agrega IA aplicada a datos.*

Cuatro etapas y 19 módulos, unas 84 unidades (una unidad ≈ una semana a 1 h diaria). Las duraciones son estimadas y se ajustan con la prueba piloto.

| Etapa | Módulo | Unidades | Proyecto integrador |
| --- | --- | --- | --- |
| 0 · Fundamentos | M1. Pensar con datos: tipos de datos, preguntas de negocio, Excel | 4 | Análisis de ventas de una tienda en Excel |
| 0 · Fundamentos | M2. SQL desde cero | 6 | Reporte de clientes de Abarrotes La Esquina |
| 0 · Fundamentos | M3. SQL para análisis | 6 | Análisis de retención de clientes de La Esquina |
| 0 · Fundamentos | M4. Python desde cero (puente desde SQL) | 5 | Script que limpia y resume un CSV |
| 0 · Fundamentos | M5. Git y GitHub | 2 | Repositorio de portafolio con tus proyectos |
| 1 · Data Analyst | M6. Estadística descriptiva y visualización | 4 | Reporte visual de un dataset público |
| 1 · Data Analyst | M7. Métricas, KPIs, dashboards y storytelling | 4 | Dashboard de negocio con recomendación |
| 2 · Data Science | M8. Probabilidad | 4 | Simulador de escenarios de ventas |
| 2 · Data Science | M9. Inferencia y pruebas A/B | 5 | Evaluación de una campaña con prueba A/B |
| 2 · Data Science | M10. Álgebra lineal y cálculo para ML (lo esencial) | 4 | Regresión lineal programada a mano |
| 2 · Data Science | M11. pandas avanzado y feature engineering | 4 | Dataset listo para modelar |
| 2 · Data Science | M12. Machine learning supervisado | 6 | Modelo de churn con evaluación completa |
| 2 · Data Science | M13. No supervisado y series de tiempo | 5 | Segmentación de clientes + pronóstico de demanda |
| 2 · Data Science | M14. IA aplicada a datos (LLMs) | 3 | Clasificador de comentarios de clientes con un LLM |
| 3 · Data Engineering | M15. Modelado de datos | 4 | Modelo dimensional (estrella) de ventas |
| 3 · Data Engineering | M16. Terminal y Docker | 2 | Proyecto empaquetado en un contenedor |
| 3 · Data Engineering | M17. Pipelines ETL/ELT con dbt y Airflow | 6 | Pipeline diario automatizado |
| 3 · Data Engineering | M18. Cloud y almacenamiento (data lake, warehouse) | 5 | Pipeline desplegado en la nube |
| 3 · Data Engineering | M19. Calidad, monitoreo y proyecto final | 5 | Plataforma de datos end-to-end |

**Entrada por nivel:** quien ya trabaja con SQL, Power BI y Python hace la Etapa 0 en modo repaso (examen diagnóstico por módulo; si lo aprueba, pasa directo al integrador).

### SQL a fondo antes de Python

SQL es la base de todo lo demás, así que se cubre completo antes de pasar a Python. Todo SQL avanzado (CTE, funciones de ventana) vive aquí y no en la etapa de Engineering, porque es lo que más usa un Data Analyst en el trabajo diario.

**M2 · SQL desde cero**

1. Tu primera consulta: SELECT, FROM, WHERE *(hecha)*
2. Ordenar y filtrar mejor: ORDER BY, LIMIT, DISTINCT, AND/OR, IN, BETWEEN, LIKE
3. Columnas calculadas y vacíos: alias, operaciones, NULL, CASE WHEN
4. Resumir: COUNT, SUM, AVG, MIN, MAX, GROUP BY, HAVING
5. Fechas y texto: extraer mes, diferencias de días, limpiar texto, CAST
6. Unir tablas: INNER y LEFT JOIN, llaves, duplicados por un JOIN mal hecho

**M3 · SQL para análisis**

1. Subconsultas y CTE (`WITH`): consultas largas pero legibles
2. Funciones de ventana I: ROW_NUMBER, RANK, top N por grupo
3. Funciones de ventana II: LAG/LEAD, acumulados, promedio móvil, % del total
4. Patrones de negocio: embudos, cohortes, retención, clientes recurrentes
5. Calidad de datos: duplicados, UNION, validaciones, crear tablas y vistas
6. Consultas eficientes: orden de ejecución, índices, buen estilo

**Examen de salida de SQL:** responder preguntas de negocio sobre varias tablas usando CTE y funciones de ventana, y explicar el resultado. Aprobarlo abre Python.

**Dataset:** Abarrotes La Esquina crece con el curso: tablas de clientes, productos, sucursales y 12 meses de ventas, para que existan tendencias, cohortes y retención. SQLite (sql.js) soporta funciones de ventana.

**Puente a Python (M4):** primero lo básico del lenguaje (variables, listas, diccionarios, ciclos, funciones) con los mismos datos de Don Rafa. Después pandas se enseña como traducción de lo que ya sabes: filtrar = WHERE, `groupby` = GROUP BY, `merge` = JOIN. Al final, lo que SQL no puede hacer: leer archivos y APIs, automatizar y graficar.

## Estándar pedagógico de las lecciones

Toda lección sigue la misma estructura y pasa el mismo checklist antes de publicarse. Este estándar vive en la skill `docente-datos` (`skills/docente-datos/SKILL.md`), que se usa para escribir y revisar cada lección.

**Estructura de una lección (30 min de lectura y práctica)**

1. **Objetivo:** "Al terminar podrás…" con un verbo medible (calcular, escribir, interpretar).
2. **Por qué importa:** una situación real de trabajo donde se usa.
3. **Lo que ya sabes:** conecta con un tema anterior o con la vida diaria.
4. **La idea en una frase:** el concepto sin jerga.
5. **Analogía:** una imagen cotidiana que lo haga intuitivo.
6. **Explicación por capas:** de lo simple a lo formal; la fórmula o el código al final, no al inicio.
7. **Ejemplo resuelto:** paso a paso, con datos realistas y cada paso comentado.
8. **Errores comunes:** 2–3 confusiones típicas y cómo detectarlas.
9. **Práctica guiada:** ejercicios con pistas graduales.
10. **Revisa tu comprensión:** 3–5 preguntas con retroalimentación que explica el porqué.
11. **Resumen:** 3 ideas clave para llevar.

**Reglas de claridad**

- Una idea por párrafo; frases de menos de 25 palabras.
- Todo término técnico se define la primera vez que aparece.
- Nada se da por sabido si no está en un módulo anterior.
- Ejemplos con contextos reconocibles: tiendas, ventas, clientes, transporte.
- Pensado para leerse en el celular: bloques cortos, código de pocas líneas.

**Checklist de calidad (antes de publicar)**

- [ ] ¿Alguien sin experiencia entiende la idea en una frase?
- [ ] ¿El ejemplo resuelto se puede reproducir paso a paso?
- [ ] ¿Cada ejercicio practica exactamente el objetivo de la lección?
- [ ] ¿La retroalimentación explica el error, no solo la respuesta correcta?
- [ ] ¿Lo probé yo (piloto) y anoté qué no quedó claro?

## Arquitectura de contenido

El contenido vive separado de la app, en el repositorio (carpeta `contenido/`). Así una lección se corrige sin volver a publicar la app.

**Cada lección lleva un encabezado (frontmatter) que la app lee:** id, módulo, semana, día, objetivo, duración, prerequisitos, dataset y versión.

**Práctica integrada:** el editor de la app carga automáticamente el dataset del módulo (`datasets/*.sql`) y ejecuta las consultas en el propio dispositivo. No se usan páginas externas.

**Ciclo de prueba y ajuste**

1. Se escribe la lección con la skill de docente.
2. La estudio como piloto y anoto dudas en la app (botón "no me quedó claro").
3. Se corrige y sube la versión (v1.0 → v1.1).
4. El módulo se marca "listo para otros" cuando pasa el checklist y la prueba piloto.

## Camino a la app en 3 fases

La app crece en tres fases y solo se pasa a la siguiente cuando la anterior se validó en uso real. La Fase 1 empieza en cuanto exista la primera semana de contenido (ya existe).

```mermaid
flowchart LR
  F1["Fase 1 · Prototipo<br/>Meses 1–2<br/>PWA instalable<br/>Hoy, Lección, editor SQL, quiz, racha<br/>Lee la Semana 1 del repo<br/>Stack: Next.js + Markdown + sql.js"]
  G1{{"Gate 1<br/>4 semanas de uso diario sin fallas"}}
  F2["Fase 2 · MVP<br/>Meses 3–5<br/>Ruta y progreso por módulo<br/>Proyectos y nota del viernes<br/>Recordatorio diario<br/>Botón de dudas por lección<br/>Stack: + Supabase"]
  G2{{"Gate 2<br/>1 módulo completo probado por otros"}}
  F3["Fase 3 · App nativa<br/>Mes 6 en adelante<br/>App Store<br/>Cuentas para otros usuarios<br/>Comunidad y notas públicas<br/>Stack: Expo o SwiftUI"]
  F1 --> G1 --> F2 --> G2 --> F3
```

Los meses son estimados. Next.js y Supabase son sugerencias para empezar rápido; la elección entre Expo y SwiftUI queda en las decisiones pendientes.

## Flujo del usuario en la app

La app abre en la **Ruta**: un mapa con la parada que te toca, sin tener que decidir qué estudiar.

**Primera vez**

1. Bienvenida: elegir meta (Analyst, Scientist o Engineer) y horario de estudio.
2. Diagnóstico corto para decidir desde qué módulo empezar.
3. Activar recordatorio diario.

**Recorrido diario**

1. Notificación a la hora elegida.
2. **Ruta**: la parada que te toca, con su tema y tiempo estimado.
3. Lección, mini-proyecto o repaso con nota, según la parada.
4. Quiz o entregable del día.
5. Marcar como completado: suma racha y avance del módulo.

**Pantallas principales**

| Pantalla | Para qué sirve |
| --- | --- |
| Ruta | Mapa de la unidad con sus paradas; arriba "sigue donde te quedaste" |
| Lección | Lectura por bloques, editor de código integrado y quiz |
| Proyecto | Instrucciones, dataset precargado y entrega |
| Notas | Editor de la nota del repaso con plantilla y botón para compartir |
| Práctica *(propuesta)* | Terminal libre con los datasets y repaso de tus errores y temas pasados |
| Chuleta *(propuesta)* | Todo lo que has desbloqueado (comandos y ejemplos), para consultar rápido |
| Tú | Avatar, clóset, racha, logros y ajustes |

La barra inferior está por definir; la propuesta es **Ruta · Práctica · Chuleta · Tú**, y Portafolio cuando haya proyectos que mostrar.

## Próximos pasos

- [x] Guardar la skill de docente y ajustarla con una lección de prueba
- [x] Escribir la Semana 1 del M2 (SQL) completa como lección muestra
- [x] Crear el repositorio de contenido con la estructura propuesta
- [x] Diseñar el mapa de la Ruta (maqueta en `docs/maquetas/ruta-mapa.html`)
- [ ] Definir la barra inferior (propuesta: Ruta · Práctica · Chuleta · Tú)
- [x] Construir el prototipo PWA que lea la Semana 1, con editor SQL integrado (sql.js)
- [ ] Publicar la PWA y usarla a diario (Gate 1); camino a App Store en `docs/camino-app-store.md`
