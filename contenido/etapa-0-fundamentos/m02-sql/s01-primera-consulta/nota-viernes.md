---
id: m02-s01-viernes
modulo: M2 SQL desde cero
semana: 1
dia: viernes
titulo: Nota pública
objetivo: "Al terminar podrás explicar con tus palabras lo aprendido en la semana y publicarlo."
duracion_min: 60
prerequisitos: [m02-s01-proyecto]
dataset: abarrotes_ventas
version: 1.0
---

# Viernes · Nota pública

*1 h: 15 min de repaso, 30 min de escritura, 15 min para publicar*

Explicar lo que aprendiste es la mejor prueba de que lo entendiste. Además, cada nota suma a tu portafolio público.

## Repaso (15 min)

Vuelve a responder, sin ver las lecciones, las preguntas de "Revisa tu comprensión" del lunes y del martes. Las que falles son tu tema para la nota.

## Plantilla (máximo 200 palabras)

1. **Qué aprendí** (2–3 frases).
2. **Un ejemplo propio**: una consulta tuya, distinta a las de la lección.
3. **Un error que cometí** y cómo lo resolví.
4. **Una pregunta abierta** para quien lea.

**Temas sugeridos para esta semana**

- La diferencia entre elegir columnas (SELECT) y elegir filas (WHERE).
- Por qué `'Norte'` y `'norte'` no son lo mismo.
- `>` contra `>=`: una sola rayita cambia el resultado.

## Ejemplo de nota

> Esta semana empecé a aprender SQL desde cero. Aprendí que una consulta básica responde dos preguntas: qué columnas quiero ver (SELECT) y qué filas me interesan (WHERE).
>
> Mi ejemplo: con la tabla de ventas de una tiendita, encontré lo que se vendió en la sucursal Norte:
> `SELECT producto, cantidad FROM ventas WHERE sucursal = 'Norte';`
>
> Mi error: escribí 'norte' en minúsculas y me salieron cero filas. No había error, solo un resultado vacío. Aprendí a revisar cómo está escrito el valor en la tabla antes de filtrar.
>
> Pregunta para ti: ¿cuál fue la primera consulta SQL que escribiste?
>
> #SQL #DataAnalytics #AprendiendoEnPúblico

Esta nota tiene unas 100 palabras. Úsala como guía de tono, no la copies: tu ejemplo y tu error deben ser tuyos.

## Evaluación piloto (solo durante la prueba)

Lee la semana como si no supieras SQL y marca todo lo que te haga detenerte:

- [ ] ¿"La idea en una frase" se entiende sin leer lo demás?
- [ ] ¿Las analogías ayudan o distraen?
- [ ] ¿Algún término apareció sin explicarse?
- [ ] ¿Los ejemplos resueltos tienen el nivel de detalle correcto?
- [ ] ¿La retroalimentación del quiz te enseñó algo al fallar?
- [ ] ¿Cada lección cabe en 30 minutos leyendo en el celular?
- [ ] ¿El mini-proyecto se siente como un trabajo real?
