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
| 2026-10-27 | Cada ejecución SQL usa una base nueva con el dataset | El alumno no puede romper la tabla (ni con DROP TABLE) |

## Decisiones pendientes

- Stack de la app nativa. **Propuesta (27 oct): Capacitor** sobre la misma PWA, por la meta de diciembre. Expo o SwiftUI implicarían reescribir la app. Falta que Diego lo confirme.
- Cuándo pasar a GitHub Pro para volver privado el repositorio.
- Cuenta de Apple Developer y cómo compilar para iOS desde Windows (Mac prestada, Codemagic o GitHub Actions).
- Nombre y marca de la plataforma.
- Modelo para otros usuarios: gratis, freemium o pago.
- Mockups de las pantallas Hoy, Lección y Ruta.

## Enlaces de referencia (claude.ai)

- Plan maestro (doc original): https://claude.ai/artifact/UD9VPSTbMr6JogejGVq8pT
- Semana 1 SQL (doc original): https://claude.ai/artifact/U6ftVKz1JKkGJb3fBYMzir
