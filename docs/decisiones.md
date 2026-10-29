# Decisiones del proyecto

Registro de lo que se decidió (y por qué) en las conversaciones de planeación con Claude, del 21 al 27 de octubre de 2026. Agrega aquí cada decisión nueva con su fecha.

## Contexto de origen

- Diego es Data Analyst (SQL, Power BI, Python) y quiere pasar a Data Scientist y después a Data Engineer.
- Tiempo disponible: mínimo 1 hora diaria, lunes a viernes.
- No tenía plan, punto de partida ni plataforma. Desde el inicio quiso que el proyecto sirva también para **ayudar a otras personas**, como un aprendizaje desde cero y no solo una transición.
- No hay urgencia por empezar a estudiar: se prefirió planear todo el flujo al 100 % antes.

## Decisiones tomadas

| Fecha | Decisión | Por qué |
| --- | --- | --- |
| 2026-10-21 | Ruta en 3 etapas: Fundamentos → Data Science → Data Engineering (15 módulos) | Una sola ruta sirve para el piloto (Etapa 0 en modo repaso) y para quien empieza de cero |
| 2026-10-21 | Modelo **híbrido**: lección lun–mar, mini-proyecto **cada semana** mié–jue, proyecto integrador por módulo | Equilibra teoría y práctica; deja portafolio |
| 2026-10-21 | **Nota pública cada viernes** con plantilla fija | Refuerza lo aprendido y genera contenido/portafolio; es la semilla del material para otros |
| 2026-10-21 | Prioridad: **plataforma propia**, no plataformas de terceros | Control del contenido y base para enseñar a otros |
| 2026-10-21 | Destino final: **app para celular, principalmente iPhone** | Estudiar desde el teléfono en la hora diaria |
| 2026-10-21 | Construcción en **3 fases con gates**: PWA → MVP → app nativa | Validar con uso real antes de invertir en la siguiente fase |
| 2026-10-21 | **Contenido separado de la app** (Markdown + frontmatter en el repo) | Corregir lecciones sin republicar la app; facilita el ciclo prueba-ajuste |
| 2026-10-21 | Diego es el **usuario piloto**; los módulos se ajustan con su feedback antes de abrirse | Iterar el contenido con un usuario real |
| 2026-10-21 | Las lecciones deben ser **muy claras**; se creó la skill `docente-datos` (docente certificado + diseño instruccional) | La claridad es el requisito más importante del producto |
| 2026-10-21 | Semana 1 del M2 (SQL) como lección muestra para validar el estándar | Probar la skill con contenido real antes de escalar |
| 2026-10-21 | Semana 1 aprobada: "me gustó mucho cómo quedó el aprendizaje guiado" | Valida la estructura de 11 secciones y el tono |
| 2026-10-21 | **Nada de páginas externas para practicar** (se descartó sqliteonline.com). SQL corre dentro de la app: sql.js en la PWA, SQLite nativo en la app; Python después con Pyodide | Experiencia sin fricción; la tabla viene precargada y la app puede validar respuestas |
| 2026-10-27 | El proyecto continúa en Claude Code con este repositorio | Pasar de planeación a construcción |
| 2026-10-27 | **Meta: App Store en diciembre de 2026**; de aquí a entonces Diego usa la app a diario como piloto | Diego quiere publicarla en diciembre y probar todo antes (ver `docs/camino-app-store.md`) |
| 2026-10-27 | PWA con **Vite + React** en `app/` (en vez de Next.js) | Sale una página estática que Capacitor puede empaquetar para iOS sin reescribir; no hace falta servidor |
| 2026-10-27 | Ejercicios auto-evaluables en `ejercicios.json` por semana: la app compara el resultado del alumno contra el de la `solucion` | Resuelve el pendiente de auto-evaluación. Se ignoran nombres de columna (alias) y orden de filas (salvo `orden_importa`); columnas en otro orden = "casi" |
| 2026-10-27 | El quiz se lee directo de la sección "Revisa tu comprensión" del Markdown | Una sola fuente de verdad; no hace falta `quiz.json` mientras se respete el formato de la skill |
| 2026-10-27 | PWA publicada en **GitHub Pages** desde un repo público; más adelante GitHub Pro para volverlo privado | Pages da HTTPS gratis (instalable y sin conexión en el iPhone) y publica en cada push; Pro mantiene Pages con repo privado |
| 2026-10-27 | Las lecciones se viven como **juego en tarjetas**, no como documento largo | En el iPhone, el piloto sintió la lección "como un texto aburrido"; busca que estudiar sea divertido |
| 2026-10-27 | Estilo **juguetón + terminal de código**, paleta **violeta y coral** (ver `docs/estilo-y-personajes.md`) | Le gustó la personalidad tipo juego, pero sin copiar los colores de Duolingo; la terminal hace que se sienta que se estudia código |
| 2026-10-27 | Pantallas **sin saturar**: encargo de Don Rafa + título con la instrucción exacta; nada más a la vista | Rechazó una versión con misión, traducción, columnas, resultado esperado y pistas: "muy saturado" |
| 2026-10-27 | Personajes: **Diego** (protagonista), **Don Rafa** (problema de negocio), **Fer** (tips, de vez en cuando) y elenco diverso; avatares dibujados con código *(Diego y Fer reemplazados el mismo día; ver abajo)* | Dan historia y voz a la lección; SVG ligero, sin conexión y sin problemas de derechos |
| 2026-10-27 | Cada lección tiene una **historia en tarjetas** (`<parada>.historia.yaml`) que la app muestra primero; el Markdown queda como "lección completa" | Storytelling con Don Rafa, Diego y Fer; el contenido sigue separado de la app y se verifica con `npm run verificar` |
| 2026-10-27 | XP por reto (10 al primer intento, 5 después; 5 por ejecutar un ejemplo) y avance guardado por tarjeta | Sensación de juego y poder retomar la lección donde se dejó |
| 2026-10-27 | El protagonista es **el avatar de cada alumno** (nombre y apariencia elegidos al abrir la app) en lugar del personaje Diego | El piloto prefirió que cada quien ponga nombre a su avatar; hace la historia personal para cualquier usuario |
| 2026-10-27 | **Hashy**, un schnauzer, sustituye a Fer: da tips y aparece triste cuando te equivocas | Pedido del piloto; un perrito suaviza el error y le da humor |
| 2026-10-27 | **Sonidos** sintetizados al acertar, al equivocarse ("ayyy") y al terminar; se pueden silenciar | Más sensación de juego, sin archivos de audio y sin conexión |
| 2026-10-27 | **Clóset**: los XP se gastan en peinados, ropa, pantalones, tenis, gorros, lentes y accesorios; al comprar se descuentan | Primer uso de los XP pedido por el piloto; da motivo para seguir estudiando |
| 2026-10-27 | Avatar del alumno con **cuerpo completo** de proporciones naturales; en el chat se ve el recorte de la cara | El piloto rechazó un primer cuerpo "raro" y pidió brazos, piernas y cuerpo normales; el busto no mostraba tenis ni pantalones |
| 2026-10-27 | En el clóset, lo que no tienes **se prueba antes de comprar** (botón "Comprar por ◆ N" aparte) | Evitar gastar XP por accidente con un toque |
| 2026-10-27 | Cada ejecución SQL usa una base nueva con el dataset | El alumno no puede romper la tabla (ni con DROP TABLE) |
| 2026-10-27 | La ruta va por **unidades con paradas** (Lección 1, Lección 2, Proyecto 1, Proyecto 2, Repaso) en un **mapa**, no por días de la semana | El piloto prefirió avanzar por módulos y no atarse al calendario; se puede hacer más de una parada al día |
| 2026-10-27 | El **mapa de la Ruta** es la pantalla principal (reemplaza Hoy). Cada parada y cada **ficha de tema** se puede tocar: muestra qué aprendiste, un ejemplo que se ejecuta o qué viene; Hashy da tips | El piloto pidió elementos interactivos en el mapa con información de los temas vistos |
| 2026-10-29 | **Mapa: camino de botones con degradado por módulo** (propuesta A), sin gráficas a los lados, con regalos de monedas cada 3 paradas y banco de monedas al final. Se descarta la calle de barrio | Al probar el barrio en su iPhone, al piloto no le gustó cómo se veía (ni su avatar en el mapa); prefirió el camino de antes con un fondo en degradado que cambie de color en cada módulo |
| 2026-10-29 | ~~Mapa como calle de barrio~~ (descartado el mismo día): cada parada es un negocio en 3D isométrico con un objeto gigante en el techo, regalos de monedas cada 3 paradas (XP, prenda o doble XP) y el Banco de Datos como premio de la unidad. Los XP se muestran con una moneda | El piloto quería un mapa como sus referencias de juego (edificios por los que vas pasando) y premios aleatorios al avanzar; pidió que el regalo y el ícono de los XP fueran monedas |
| 2026-10-29 | **Avatar rediseñado** como caricatura de cuerpo completo con contorno (manos en las bolsas, playera, jeans, tenis), igual para el elenco; clóset redibujado en el mismo estilo conservando lo ya comprado | Al piloto no le gustaba cómo se veían el avatar y los accesorios, y el círculo recortaba la cabeza. Mandó una imagen de referencia y aprobó la maqueta |
| 2026-10-29 | La **racha** cuenta cualquier tarjeta que avances (antes solo si ganabas XP) y se ve por día al tocarla | El piloto no entendía por qué su racha seguía en 1 |
| 2026-10-27 | Mapa rediseñado como **camino de juego con identidad de datos** (botones redondos violeta con íconos de datos, gráficas que crecen junto al camino, base de datos de premio con 50 XP) y **Hashy redibujado** como schnauzer con contorno que camina y prende un foco con su tip | El primer mapa oscuro no le pareció estético; las versiones gráfica y pipeline no le gustaron; quiere algo como Duolingo sin copiarlo. Hashy "no parecía schnauzer": se redibujó con sus dos imágenes de referencia |
| 2026-10-27 | Archivos por parada (`leccion-1`, `leccion-2`, `proyecto-1`, `proyecto-2`, `repaso`) en lugar de por día; `semana.json` pasa a `unidad.json` y el avance guardado se migra solo | Coherente con la ruta por unidades; nadie pierde su avance |
| 2026-10-27 | **SQL se divide en dos módulos**: M2 SQL desde cero y M3 SQL para análisis (CTE, funciones de ventana, cohortes), con examen de salida antes de Python | Con 5 semanas solo se aprendía a consultar, no a analizar; lo más usado por un Data Analyst estaba hasta Engineering. Así pandas se enseña como traducción de SQL |
| 2026-10-27 | Nueva **etapa Data Analyst** (estadística y visualización + métricas, KPIs, dashboards y storytelling); **Git** pasa a Fundamentos; se agrega **IA aplicada a datos**; M11 "SQL avanzado" queda como Modelado de datos. Ahora son 19 módulos | La ruta decía Analyst → Scientist → Engineer pero saltaba de Fundamentos a Data Science; el portafolio en GitHub se usa desde el inicio |

## Decisiones pendientes

- **Temario revisado (20 módulos), historia de toda la ruta y nuevas herramientas** en `docs/plan-de-contenido.md` (29 oct). Falta que Diego lo apruebe; al aprobarse reemplaza la tabla de `plan-maestro.md`.
- Stack de la app nativa. **Propuesta (27 oct): Capacitor** sobre la misma PWA, por la meta de diciembre. Expo o SwiftUI implicarían reescribir la app. Falta que Diego lo confirme.
- Cuándo pasar a GitHub Pro para volver privado el repositorio.
- Cuenta de Apple Developer y cómo compilar para iOS desde Windows (Mac prestada, Codemagic o GitHub Actions).
- Nombre y marca de la plataforma.
- Modelo para otros usuarios: gratis, freemium o pago.
- Barra inferior de la app. Propuesta: **Ruta · Práctica · Chuleta · Tú** (Portafolio cuando haya proyectos). El piloto no quiere Inicio · Ruta · Clóset · Perfil. El mapa de la Ruta ya está aprobado (`docs/maquetas/ruta-mapa.html`).

## Enlaces de referencia (claude.ai)

- Plan maestro (doc original): https://claude.ai/artifact/UD9VPSTbMr6JogejGVq8pT
- Semana 1 SQL (doc original): https://claude.ai/artifact/U6ftVKz1JKkGJb3fBYMzir
