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

## Modelo de estudio (1 h al día, por unidades)

- La ruta va por **módulos → unidades → paradas**, no por días. En la app se ve como un mapa.
- Cada unidad (antes "semana"): Lección 1 → Lección 2 → Proyecto 1 → Proyecto 2 → Repaso + nota pública. Las paradas se abren en orden; ritmo sugerido, una por día.
- Cada módulo (4–6 unidades) cierra con un proyecto integrador para portafolio; SQL cierra con examen de salida.
- Temario completo (19 módulos, 4 etapas) en `docs/plan-maestro.md`. SQL se cubre a fondo (M2 y M3) antes de Python.

## Estructura del contenido

```
contenido/
  hashy-tips.yaml              # tips generales de Hashy (estudio, mundo de datos, ánimo)
  etapa-0-fundamentos/
    m02-sql/
      modulo.json              # metadatos del módulo y lista de sus unidades (las que no tienen carpeta salen "próximamente")
      datasets/*.sql           # se cargan automáticamente en el editor de la app
      s01-primera-consulta/    # una unidad
        unidad.json            # las paradas del camino, en orden
        ejercicios.json        # ejercicios auto-evaluables (solución + filas esperadas)
        conceptos.yaml         # fichas de temas que se tocan en el mapa + tips de Hashy (con `desde: <parada>`)
        <parada>.historia.yaml # cada parada contada en tarjetas (lo que la app muestra primero)
        leccion-1.md  leccion-2.md  proyecto.md  repaso.md   # versión completa en texto
```

Paradas de una unidad: `leccion-1`, `leccion-2`, `proyecto-1`, `proyecto-2` (ambas usan `proyecto.md`) y `repaso`.

Frontmatter de cada lección: `id, modulo, unidad, parada, objetivo, duracion_min, prerequisitos, dataset, version`.

## Estado actual

- Hecho: plan maestro, skill `docente-datos`, Semana 1 del M2 (SQL: SELECT/FROM y WHERE) v1.0, revisada por el piloto y aprobada en claridad.
- Ajuste ya aplicado en esta versión: se quitó la dependencia de sqliteonline.com; la práctica será en el editor integrado.
- Hecho (27 oct): **prototipo PWA** en `app/`: Lección (bloques, editor SQL con ejercicios auto-evaluados, quiz interactivo, nota del viernes), funciona sin conexión.
- Meta: **App Store en diciembre 2026** con Capacitor (ver `docs/camino-app-store.md`).
- Publicación: https://diegoavilaj1704-ux.github.io/ruta-datos/ (GitHub Pages) vía `.github/workflows/publicar-pwa.yml` en cada push a `main` (repo público por ahora; migrar a GitHub Pro para volverlo privado).
- Definido (27 oct): estilo visual, personajes y regla de ejercicios (ver `docs/estilo-y-personajes.md`).
- Hecho (27 oct): lección 1 como historia en tarjetas (`leccion-1.historia.yaml`) con el estilo nuevo, avatares, XP y avance guardado.
- Hecho (27 oct): avatar propio con nombre (protagonista), Hashy el schnauzer (tips y errores) y sonidos.
- Hecho (27 oct): avatar de cuerpo completo y clóset donde se gastan los XP (catálogo en `app/src/lib/armario.ts`).
- Hecho (29 oct): **mapa con degradado por módulo** (paleta en `app/src/lib/colores.ts`), regalos de monedas cada 3 paradas (`app/src/lib/regalos.ts`) y banco de monedas al final; XP con ícono de moneda.
- Hecho (29 oct): **avatar rediseñado** en estilo caricatura con contorno (`app/src/lib/figura.ts`), con elenco y clóset en el mismo estilo; racha visible por día.
- Definido (27 oct): ruta por unidades con paradas en un mapa (maqueta `docs/maquetas/ruta-mapa.html`) y temario ampliado: SQL en dos módulos, etapa Data Analyst, Git al inicio, IA aplicada a datos.
- Hecho (27 oct): **mapa de la Ruta** como pantalla principal (`app/src/pantallas/Ruta.tsx`): camino de botones con íconos de datos, gráficas que se tocan para repasar (fichas con ejemplo ejecutable), chuleta { } FICHAS, base de datos de premio (+50 XP) y Hashy (schnauzer redibujado) que camina y da tips con un foco (`app/src/componentes/HashyPaseo.tsx`). **Unidad 1 completa en historia**: lecciones 1 y 2, proyecto en dos partes y repaso con nota pública.
- Siguiente: Unidad 2 (Ordenar y filtrar mejor) con dataset ampliado; barra inferior por definir; después Capacitor + recordatorio diario.

## Comandos de la app (desde `app/`)

- `npm run dev`: servidor local (también accesible desde el iPhone en la misma red Wi-Fi).
- `npm run build`: genera `app/dist/`, la PWA lista para publicar.
- `npm run verificar`: corre cada solución de `ejercicios.json` contra su dataset y compara las filas esperadas (regla 3); también revisa las historias (`*.historia.yaml`). Córrelo después de tocar ejercicios, historias o datasets.
- `npm run iconos`: regenera los íconos de `app/public/`.

## Pendientes conocidos

- Decisiones abiertas en `docs/decisiones.md`.

## Configuración inicial (una sola vez)

La skill está en `skills/docente-datos/`. Para que Claude Code la cargue como skill del proyecto, muévela a `.claude/skills/docente-datos/SKILL.md` (puedes pedírselo a Claude Code en la primera sesión) y actualiza las rutas de este archivo.
