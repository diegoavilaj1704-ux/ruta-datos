# Ruta de datos: app de aprendizaje

Proyecto para aprender datos desde cero hasta Data Engineer (Data Analyst → Data Scientist → Data Engineer), entregado en una **app propia para iPhone**. El autor (Diego, Data Analyst en Growth; usa SQL, Power BI y Python) es el **usuario piloto**: cada módulo se prueba con él, se ajusta y solo después se abre a otras personas que empiezan desde cero.

Idioma del proyecto: **español** (contenido, comentarios de código, commits y UI). Tono: cercano y profesional, tuteando.

## Documentos clave

| Archivo | Qué contiene |
| --- | --- |
| `docs/plan-maestro.md` | Visión, modelo de estudio, ruta de 15 módulos, estándar pedagógico, arquitectura, fases de la app, flujo de usuario |
| `docs/decisiones.md` | Historial de decisiones tomadas y pendientes (léelo antes de proponer cambios de rumbo) |
| `skills/docente-datos/SKILL.md` | Estándar obligatorio para escribir o revisar cualquier lección (léelo completo antes de tocar `contenido/`) |
| `contenido/` | El contenido de la ruta, en el formato que la app va a leer |
| `app/` | Prototipo PWA (Vite + React + sql.js). Lee `contenido/` en tiempo de build |
| `docs/estilo-y-personajes.md` | Estilo visual (juguetón + terminal, violeta y coral), personajes y pantalla de reto |
| `docs/camino-app-store.md` | Calendario y requisitos para publicar en App Store en diciembre 2026 |

## Reglas de trabajo

1. **Contenido separado de la app.** Las lecciones viven en `contenido/` como Markdown con frontmatter; la app solo las lee. Corregir una lección nunca debe requerir publicar la app.
2. **Toda lección se escribe o revisa siguiendo `skills/docente-datos/SKILL.md`.** Estructura de 11 secciones + checklist de calidad. La claridad para alguien sin experiencia es el requisito número uno.
3. **Verifica cada resultado.** Todo ejemplo resuelto, ejercicio o "filas esperadas" debe comprobarse ejecutando la consulta o el código contra el dataset (por ejemplo con `sqlite3`). Nunca escribas resultados de memoria.
4. **Práctica dentro de la app, sin páginas externas.** SQL corre en el dispositivo (sql.js en la PWA, SQLite nativo en la app); Python más adelante con Pyodide. El dataset de cada módulo se carga solo desde `datasets/`. El alumno nunca copia scripts.
5. **Versionado de lecciones.** Cada corrección sube `version` en el frontmatter (1.0 → 1.1).
6. **Pensado para celular:** bloques cortos, código de máximo 10–12 líneas por bloque.

## Modelo de estudio (1 h, lunes a viernes)

- Lunes y martes: lección (concepto + profundización).
- Miércoles y jueves: mini-proyecto de la semana.
- Viernes: repaso + nota pública (LinkedIn, blog o GitHub).
- Cada módulo (4–6 semanas) cierra con un proyecto integrador para portafolio.

## Estructura del contenido

```
contenido/
  etapa-0-fundamentos/
    m02-sql/
      modulo.json              # metadatos del módulo
      datasets/*.sql           # se cargan automáticamente en el editor de la app
      s01-primera-consulta/
        semana.json            # metadatos de la semana
        ejercicios.json        # ejercicios auto-evaluables (solución + filas esperadas)
        lunes.historia.yaml    # la lección contada en tarjetas (lo que la app muestra primero)
        lunes.md  martes.md    # lecciones
        proyecto.md            # mini-proyecto (mié–jue)
        nota-viernes.md        # repaso y nota pública
```

Frontmatter de cada lección: `id, modulo, semana, dia, objetivo, duracion_min, prerequisitos, dataset, version`.

## Estado actual

- Hecho: plan maestro, skill `docente-datos`, Semana 1 del M2 (SQL: SELECT/FROM y WHERE) v1.0, revisada por el piloto y aprobada en claridad.
- Ajuste ya aplicado en esta versión: se quitó la dependencia de sqliteonline.com; la práctica será en el editor integrado.
- Hecho (27 oct): **prototipo PWA** en `app/`: Hoy (siguiente sesión, racha, avance de la semana), Lección (bloques, editor SQL con ejercicios auto-evaluados, quiz interactivo, nota del viernes), funciona sin conexión.
- Meta: **App Store en diciembre 2026** con Capacitor (ver `docs/camino-app-store.md`).
- Publicación: https://diegoavilaj1704-ux.github.io/ruta-datos/ (GitHub Pages) vía `.github/workflows/publicar-pwa.yml` en cada push a `main` (repo público por ahora; migrar a GitHub Pro para volverlo privado).
- Definido (27 oct): estilo visual, personajes y regla de ejercicios (ver `docs/estilo-y-personajes.md`).
- Hecho (27 oct): lección del lunes como historia en tarjetas (`lunes.historia.yaml`) con el estilo nuevo, avatares, XP y avance guardado.
- Hecho (27 oct): avatar propio con nombre (protagonista), Hashy el schnauzer (tips y errores) y sonidos.
- Siguiente: historia del martes, mini-proyecto y viernes con el mismo estilo; después Capacitor + recordatorio diario.

## Comandos de la app (desde `app/`)

- `npm run dev`: servidor local (también accesible desde el iPhone en la misma red Wi-Fi).
- `npm run build`: genera `app/dist/`, la PWA lista para publicar.
- `npm run verificar`: corre cada solución de `ejercicios.json` contra su dataset y compara las filas esperadas (regla 3); también revisa las historias (`*.historia.yaml`). Córrelo después de tocar ejercicios, historias o datasets.
- `npm run iconos`: regenera los íconos de `app/public/`.

## Pendientes conocidos

- Decisiones abiertas en `docs/decisiones.md`.

## Configuración inicial (una sola vez)

La skill está en `skills/docente-datos/`. Para que Claude Code la cargue como skill del proyecto, muévela a `.claude/skills/docente-datos/SKILL.md` (puedes pedírselo a Claude Code en la primera sesión) y actualiza las rutas de este archivo.
