# Plan de contenido: temario revisado, historia de toda la ruta y nuevas herramientas

*Aprobado por Diego el 29 oct 2026. El temario ya está en `plan-maestro.md`; la historia guía la escritura de cada unidad.*

## Parte 1 · Revisión del temario para alguien que empieza en cero

Revisé los 19 módulos pensando en una persona que nunca ha escrito una consulta, que estudia 1 hora al día en el celular y que no tiene a nadie al lado. Encontré seis problemas.

### Lo que hay que corregir

1. **Falta una entrada suave.** Hoy la app empieza directo en SQL. Alguien en cero no sabe qué es una tabla, una base de datos ni por qué no basta con Excel. M1 existe en el plan, pero depende de Excel, que no se puede practicar dentro de la app (regla 4).
2. **La Unidad 2 de SQL trae demasiado.** ORDER BY, LIMIT, DISTINCT, AND, OR, IN, BETWEEN y LIKE son 8 ideas nuevas en una semana. Para un principiante es mucho; conviene dividirla en dos unidades.
3. **JOIN en una sola unidad y al final.** Es el tema que más cuesta. Se queda en M2 (para que el proyecto integrador use varias tablas) y se refuerza al inicio de M3.
4. **Nunca se enseña a crear ni modificar datos.** No aparecen CREATE TABLE, INSERT, UPDATE ni DELETE, y en Data Engineering se dan por sabidos. Se agregan en M3.
5. **La etapa Data Analyst es delgada.** Solo tiene 2 módulos, y la visualización va mezclada con estadística. Se separa en su propio módulo.
6. **Varias herramientas no se pueden practicar en el iPhone:** Excel, Git, la terminal, Docker, Airflow y la nube. Se resuelve con simuladores dentro de la app (ver Parte 3) y un proyecto opcional "en tu computadora" para quien tenga una.

### Temario propuesto

4 etapas, 20 módulos, unas 90 unidades. Una unidad son 5 paradas: una por día, 1 hora al día.

**Etapa 0 · Fundamentos**

| Módulo | Unidades | Qué cambia |
| --- | --- | --- |
| M1. Pensar con datos | 3 | Sin Excel: qué es un dato, tablas, preguntas de negocio y qué es una base de datos. Todo se practica en la app |
| M2. SQL desde cero | 8 | La Unidad 2 se divide en dos y se agrega una unidad de proyecto integrador |
| M3. SQL para análisis | 7 | Empieza con JOIN a fondo, agrega crear y modificar datos, y cierra con el examen de salida |
| M4. Python desde cero | 6 | Una unidad más para pandas, contado como traducción de SQL |
| M5. Git y GitHub | 2 | Con un simulador de Git en la app |

**Etapa 1 · Data Analyst**

| Módulo | Unidades | Qué cambia |
| --- | --- | --- |
| M6. Estadística descriptiva | 4 | Solo estadística |
| M7. Visualización | 3 | **Nuevo:** elegir la gráfica, hacerla en Python y gráficas que engañan |
| M8. Métricas, KPIs, dashboards y storytelling | 4 | Power BI o Looker Studio como proyecto opcional fuera de la app |

**Etapa 2 · Data Scientist**

| Módulo | Unidades |
| --- | --- |
| M9. Probabilidad | 4 |
| M10. Inferencia y pruebas A/B | 5 |
| M11. Matemáticas para ML (lo esencial) | 4 |
| M12. pandas avanzado y feature engineering | 4 |
| M13. Machine learning supervisado | 6 |
| M14. No supervisado y series de tiempo | 5 |
| M15. IA aplicada a datos (LLMs) | 3 |

**Etapa 3 · Data Engineer**

| Módulo | Unidades | Nota |
| --- | --- | --- |
| M16. Modelado de datos | 4 | Se practica con SQL en la app |
| M17. Terminal y Docker | 2 | Terminal simulada en la app; Docker como proyecto en tu computadora |
| M18. Pipelines ETL/ELT (dbt y Airflow) | 6 | Los modelos de dbt son SELECT: se practican en la app. Airflow con un simulador de DAG |
| M19. Cloud y almacenamiento | 5 | Conceptos y diagramas en la app; despliegue en tu computadora |
| M20. Calidad, monitoreo y proyecto final | 5 | Proyecto end-to-end |

**Totales:** Etapa 0 tiene 26 unidades, Etapa 1 tiene 11, Etapa 2 tiene 31 y Etapa 3 tiene 22. A una unidad por semana son unos 21 meses. Quien ya sabe (como Diego) hace el diagnóstico de cada módulo y salta al proyecto integrador.

### Detalle de los primeros módulos

**M1 · Pensar con datos (3 unidades)**

1. **Datos y tablas:** qué es un dato; filas, columnas y tipos (número, texto, fecha, vacío).
2. **Preguntas de negocio:** de una pregunta vaga a una pregunta que los datos pueden responder; qué es una métrica.
3. **De la libreta a la base de datos:** por qué una hoja de cálculo se queda corta, varias tablas relacionadas y qué es SQL.

**M2 · SQL desde cero (8 unidades)**

1. Tu primera consulta: SELECT, FROM, WHERE *(hecha)*
2. Ordenar y elegir: ORDER BY, ASC/DESC, LIMIT, DISTINCT
3. Filtros combinados: AND, OR, NOT, paréntesis, IN, BETWEEN, LIKE, IS NULL
4. Columnas calculadas: alias, operaciones, ROUND, CASE WHEN, NULL y COALESCE
5. Resumir: COUNT, SUM, AVG, MIN, MAX, GROUP BY, HAVING
6. Fechas y texto: mes, día de la semana, diferencia de días, UPPER, TRIM, REPLACE, SUBSTR, CAST
7. Unir tablas: llaves, INNER JOIN, LEFT JOIN y duplicados por un JOIN mal hecho
8. **Proyecto integrador:** reporte de clientes de Abarrotes La Esquina (las 5 paradas son el proyecto)

**M3 · SQL para análisis (7 unidades)**

1. JOIN a fondo y subconsultas: varias tablas, LEFT para encontrar lo que falta, subconsultas en WHERE y FROM
2. CTE (`WITH`): consultas largas, por pasos y legibles
3. Funciones de ventana I: ROW_NUMBER, RANK, top N por grupo
4. Funciones de ventana II: LAG/LEAD, acumulados, promedio móvil, % del total
5. Patrones de negocio: embudo, cohortes, retención, clientes recurrentes
6. Crear y cuidar datos: CREATE TABLE, INSERT, UPDATE, DELETE, vistas, UNION, duplicados, índices y orden de ejecución
7. **Examen de salida:** varias tablas, CTE y ventanas, explicado en palabras de negocio. Al aprobarlo se abre Python

**M4 · Python desde cero (6 unidades)**

1. Variables, tipos y operaciones
2. Listas y diccionarios
3. Condiciones y ciclos
4. Funciones y leer un CSV
5. pandas I: filtrar = WHERE, columnas nuevas = SELECT calculado
6. pandas II: `groupby` = GROUP BY, `merge` = JOIN, primera gráfica

## Parte 2 · La historia de toda la ruta

### La premisa

Llegas al barrio para ayudar a **Don Rafa** con **Abarrotes La Esquina**, una tienda con 3 sucursales (Norte, Centro y Sur) que lleva todo en una libreta. A lo largo de la ruta, La Esquina crece:

1. De tienda con libreta,
2. a cadena con pedidos en línea,
3. a empresa que predice lo que va a pasar,
4. a empresa donde los datos llegan solos, todos los días.

Tú creces con ella: de ayudante a Data Analyst, Data Scientist y Data Engineer. **Hashy**, el schnauzer de Don Rafa, te acompaña todo el camino.

Cada etapa es una **temporada** con su propio conflicto. Cada módulo es un **capítulo**, y cada unidad es una **misión** de un personaje del barrio. Así cada tema nuevo nace de un problema que alguien necesita resolver, nunca de la nada.

### El elenco

| Personaje | Quién es | Cuándo aparece | Qué le aporta a la historia |
| --- | --- | --- | --- |
| Don Rafa | Dueño de La Esquina; sabe vender, no de computadoras | Toda la ruta | Hace las preguntas de negocio en palabras simples |
| Hashy | Su schnauzer; da tips y se pone triste si te equivocas | Toda la ruta | Guía, ánimo y errores comunes |
| Lupita | Sobrina de Don Rafa; maneja redes y promociones | Temporadas 0 y 1 | Segmentar clientes, campañas, embudos |
| Toño | Proveedor de bebidas y botanas | Temporada 0 | Pedidos, inventario, top de productos |
| Doña Chela | Clienta de toda la vida | Temporadas 0 y 2 | Retención: "antes venía más gente" |
| Kemi | Contadora de La Esquina | Temporadas 0 y 1 | Importes, IVA, cierres de mes, KPIs |
| Mariana | Gerente de la sucursal Sur | Temporada 1 | Dashboards y metas por sucursal |
| Sofía | Científica de datos; mentora | Temporada 2 | Probabilidad, A/B, modelos |
| Beto | Encargado de reparto | Temporadas 2 y 3 | Rutas, tiempos, pronósticos de demanda |
| Jun | Ingeniero de datos; mentor | Temporada 3 | Pipelines, nube, calidad |

### Cómo crecen los datos

Todo el SQL usa el mismo mundo, y la base crece con la historia (regla 3: cada dato se verifica contra el dataset):

| Momento | Tablas | Tamaño |
| --- | --- | --- |
| M2 · U1 (hoy) | `ventas` | 8 filas, 4 días |
| M2 · U2 a U6 | `ventas` ampliada | ~300 filas, 3 meses, con errores de captura a propósito (para LIKE, TRIM y NULL) |
| M2 · U7 y U8 | + `clientes`, `productos`, `sucursales` | Llaves para unir |
| M3 | 12 meses, `pedidos_en_linea` | Cohortes, retención, embudo |
| Etapas 1 a 3 | CSV para Python, encuestas, reparto, eventos | Según cada módulo |

### Temporada 0 · "La libreta de Don Rafa" (Fundamentos)

**M1 · Pensar con datos.** Don Rafa te enseña su libreta llena de tachones. Antes de tocar la computadora, aprendes a ver sus anotaciones como datos.

| Unidad | Misión |
| --- | --- |
| 1 · Datos y tablas | Pasar una página de la libreta a una tabla: qué va en filas y qué en columnas |
| 2 · Preguntas de negocio | Don Rafa dice "quiero vender más". Tú lo conviertes en preguntas que se pueden contestar |
| 3 · De la libreta a la base de datos | Cuando la libreta ya no alcanza: tablas separadas que se relacionan, y tu primera mirada a SQL |

**M2 · SQL desde cero.** Ya está todo en la computadora. Cada unidad es un encargo del barrio.

| Unidad | Lección 1 | Lección 2 | Proyecto 1 | Proyecto 2 | Repaso (nota pública) |
| --- | --- | --- | --- | --- | --- |
| 1 · Tu primera consulta *(hecha)* | Don Rafa pide producto y cantidad: SELECT/FROM | Solo las ventas de una sucursal: WHERE | Explorar la tabla y responder sus primeras preguntas | El reporte para Don Rafa | Mi primera consulta |
| 2 · Ordenar y elegir | Toño viene mañana y Don Rafa quiere saber qué se vende más: ORDER BY | "Nada más los 5 primeros" y "¿qué productos distintos vendemos?": LIMIT, DISTINCT | La lista de pedido para Toño | ¿Qué sucursal hizo las ventas más grandes? | Cómo encontré el top 5 |
| 3 · Filtros combinados | Lupita arma una promoción y necesita ventas que cumplan dos condiciones a la vez: AND, OR, NOT | Muchas opciones, rangos y "algo que contenga…": IN, BETWEEN, LIKE, IS NULL | Elegir las ventas para la promo "Bebidas de fin de semana" | Encontrar productos mal escritos en la libreta ("coca", "Coca Cola", "COCA") | El filtro que me salvó |
| 4 · Columnas calculadas | Kemi necesita el importe de cada venta: cantidad × precio, alias, ROUND | Ventas chicas, medianas y grandes, y qué hacer con los vacíos: CASE WHEN, NULL, COALESCE | Calcular el importe y el IVA del mes | Clasificar los tickets para Kemi | Calcular en vez de copiar |
| 5 · Resumir | Cierre de mes: "¿cuánto vendimos?": COUNT, SUM, AVG, MIN, MAX | "¿Y por sucursal?": GROUP BY, HAVING | El reporte mensual por sucursal y categoría | ¿Qué categorías venden menos de lo esperado? | De 300 filas a 3 números |
| 6 · Fechas y texto | Doña Chela dice que antes venía más gente los lunes: mes, día de la semana, días entre fechas | Los nombres vienen con espacios y mayúsculas raras: UPPER, TRIM, REPLACE, SUBSTR, CAST | Ventas por día de la semana: ¿tenía razón Doña Chela? | Limpiar el catálogo de productos | Los datos sucios |
| 7 · Unir tablas | Los clientes están en otra tabla: llaves e INNER JOIN | ¿Quién no ha vuelto a comprar? LEFT JOIN y duplicados | Ventas por cliente con su nombre | La lista de clientes a los que Lupita debe escribirles | Juntar tablas sin duplicar |
| 8 · Proyecto integrador | Planear el reporte de clientes | Explorar las 4 tablas | Responder las preguntas de Don Rafa | Hallazgos y recomendación | Proyecto de portafolio |

**M3 · SQL para análisis.** La Esquina abre pedidos por WhatsApp y llegan meses de datos. Las preguntas ya no se responden con una sola consulta.

| Unidad | Misión |
| --- | --- |
| 1 · JOIN a fondo y subconsultas | Juntar ventas, clientes, productos y pedidos en línea; encontrar productos que nadie compra |
| 2 · CTE | El reporte de Kemi ya es una consulta de 40 líneas: la partes en pasos con `WITH` |
| 3 · Ventanas I | El top 3 de productos de cada sucursal, para que cada gerente pida lo suyo |
| 4 · Ventanas II | ¿Las ventas suben o bajan contra el mes pasado? Acumulados y % del total |
| 5 · Patrones de negocio | Doña Chela y los clientes que dejaron de venir: cohortes y retención; el embudo de los pedidos en línea |
| 6 · Crear y cuidar datos | Don Rafa quiere capturar ventas nuevas sin romper nada: tablas, INSERT, UPDATE, vistas, duplicados |
| 7 · Examen de salida | Un mes completo de La Esquina: respondes como analista y lo explicas sin tecnicismos |

**M4 · Python desde cero.** Kemi te manda archivos CSV cada semana y quiere el resumen automático. SQL no lee archivos sueltos ni manda correos: llega Python.

| Unidad | Misión |
| --- | --- |
| 1 | Calcular el cambio de una venta con variables |
| 2 | La lista del súper de Don Rafa como lista y diccionario |
| 3 | Revisar cada venta y avisar si falta algo |
| 4 | Leer el CSV de Kemi |
| 5 | Lo que ya hacías con WHERE, ahora en pandas |
| 6 | El resumen semanal en una gráfica |

**M5 · Git y GitHub.** Rompiste el script de Kemi y no sabes qué cambiaste. Aprendes a guardar versiones (unidad 1) y a publicar tu portafolio (unidad 2).

### Temporada 1 · "La Esquina abre en línea" (Data Analyst)

La Esquina lanza pedidos en línea y abre una cuarta sucursal. Mariana, gerente del Sur, necesita saber cómo va su tienda sin esperar a fin de mes.

| Módulo | Misión del capítulo |
| --- | --- |
| M6 · Estadística descriptiva | Unidades: ¿el ticket "típico" es el promedio o la mediana?; ¿qué tan variables son las ventas?; ¿qué forma tienen?; ¿el calor hace vender más refrescos? (correlación no es causalidad) |
| M7 · Visualización | Mariana tiene 5 minutos con el dueño. Unidades: elegir la gráfica correcta; hacerla en Python; descubrir la gráfica engañosa que le mandó un proveedor |
| M8 · Métricas y storytelling | Unidades: definir los KPIs de La Esquina; el embudo de los pedidos en línea; armar el dashboard; presentar una recomendación a Don Rafa. Proyecto: dashboard con historia |

### Temporada 2 · "¿Qué va a pasar?" (Data Scientist)

Abre **MegaMart** a dos cuadras. Don Rafa ya no solo quiere saber qué pasó, sino qué va a pasar. Llega Sofía, científica de datos, como mentora.

| Módulo | Misión del capítulo |
| --- | --- |
| M9 · Probabilidad | ¿Cuántas veces se acaba el pan antes de las 10? Simular escenarios de ventas |
| M10 · Inferencia y A/B | Lupita prueba dos promociones. ¿La nueva ganó de verdad o fue suerte? |
| M11 · Matemáticas para ML | Sofía te enseña lo justo de vectores, pendientes y derivadas para entender cómo aprende un modelo |
| M12 · pandas avanzado y features | Preparar los datos de clientes para predecir: frecuencia, ticket promedio, días sin venir |
| M13 · ML supervisado | ¿Qué clientes se van a ir a MegaMart? Modelo de churn, evaluarlo bien y explicarlo |
| M14 · No supervisado y series de tiempo | Grupos de clientes parecidos; pronóstico de demanda para que Beto no lleve de más ni de menos |
| M15 · IA aplicada a datos | Cientos de comentarios de clientes: clasificarlos con un LLM y medir si lo hizo bien |

### Temporada 3 · "Datos que llegan solos" (Data Engineer)

La Esquina ya tiene 20 sucursales. Los reportes llegan tarde, a veces rotos, y alguien los arma a mano cada lunes. Jun, ingeniero de datos, te muestra cómo hacer que todo llegue solo.

| Módulo | Misión del capítulo |
| --- | --- |
| M16 · Modelado de datos | Rediseñar las tablas en estrella para que los reportes de 20 sucursales sean rápidos |
| M17 · Terminal y Docker | Que tu proyecto funcione igual en la computadora de Jun que en la tuya |
| M18 · Pipelines (dbt y Airflow) | Cada noche, los datos de las cajas se cargan, se limpian y se resumen solos |
| M19 · Cloud | Llevar todo a la nube: data lake, warehouse, costos |
| M20 · Calidad y proyecto final | Alarmas cuando algo llega mal. **Final:** Don Rafa se retira y te deja la plataforma de datos de La Esquina funcionando de punta a punta |

### Cómo se escribe cada unidad a partir de esta historia

- Cada unidad empieza con un personaje y un problema real, nunca con la definición.
- La misión del proyecto usa lo de las dos lecciones, y nada más.
- El repaso cierra la historia de la unidad y deja abierta la siguiente: Hashy o Don Rafa adelantan el siguiente encargo.
- Toda cifra que diga un personaje sale del dataset y se comprueba con `npm run verificar`.
- Se sigue `skills/docente-datos/SKILL.md`: 11 secciones, historia en tarjetas, fichas y tips de Hashy.

## Parte 3 · Nuevas herramientas para la app

Ordenadas por cuánto ayudan a alguien que empieza en cero contra lo que cuestan.

### Alto valor, primero

| Herramienta | Qué hace | Por qué importa |
| --- | --- | --- |
| **Hashy te explica el error** | Traduce los errores de SQL ("no such column", "syntax error near FROM") a español claro, con la pista exacta | Es el momento donde más abandona un principiante |
| **Mira cómo piensa SQL** | Animación con la tabla: se iluminan las filas que pasan el WHERE y luego las columnas del SELECT | Hace visible lo invisible; sirve para WHERE, GROUP BY y JOIN |
| **Tabla a la mano** | Junto al editor, las columnas de la tabla; al tocar una se escribe su nombre | Menos errores de dedo en el celular y menos memoria |
| **Repaso inteligente (pestaña Práctica)** | Los ejercicios donde fallaste vuelven días después, en sesiones de 5 minutos | Repetir espaciado es lo que fija lo aprendido |
| **Recordatorio diario** | Notificación a la hora que elijas (ya planeada con Capacitor) | Sostiene la racha |
| **"No me quedó claro"** | Botón en cada tarjeta que guarda dónde te atoraste | El piloto marca y se corrige la lección con datos, no de memoria |

### Valor medio, después

| Herramienta | Qué hace |
| --- | --- |
| **Chuleta (pestaña)** | Todo lo desbloqueado, con ejemplos que corren |
| **Adivina antes de ejecutar** | Antes de correr una consulta, eliges cuántas filas crees que salen |
| **SQL del día** | Un reto de 2 minutos con lo ya visto; da monedas |
| **Diagnóstico inicial** | 10 preguntas para saltar módulos que ya dominas |
| **Insignias y logros** | Por terminar unidades, rachas o 0 errores en un proyecto |
| **Tarjeta para LinkedIn** | La nota pública se convierte en imagen lista para compartir, con tu avatar |
| **Simuladores** | Terminal, Git y DAG de Airflow simulados dentro de la app, para los temas que no se pueden practicar en el iPhone |

### Más adelante

| Herramienta | Qué hace | Ojo |
| --- | --- | --- |
| **Python en la app** (Pyodide) | Editor de Python que corre en el teléfono | Pesa ~10 MB; se descarga al llegar a M4 |
| **Pregúntale a Hashy** (tutor con IA) | Chat que responde dudas con el contexto de la lección | Cuesta por uso y requiere cuenta; mejor después de App Store |
| **Comunidad** | Ver notas públicas de otros alumnos | Requiere cuentas y moderación |
| **Lectura en voz alta y tamaño de letra** | Accesibilidad | Barato; conviene antes de abrir a otros |

### Mi recomendación de orden

1. Aprobar este temario y esta historia.
2. Ampliar el dataset de La Esquina para M2 (300 ventas, 3 meses, errores a propósito).
3. Escribir M2 completo: unidades 2 a 8. Cada unidad tiene 5 historias, 5 lecciones en texto, ejercicios, fichas y tips, y se verifica contra el dataset.
4. Mientras tanto, en la app: "Hashy te explica el error", "Tabla a la mano" y el recordatorio diario.
5. Después escribir M1 (corto) y M3, y seguir así por temporada.
