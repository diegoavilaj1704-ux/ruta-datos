---
id: m02-s02-repaso
modulo: M2 SQL desde cero
unidad: 2
parada: repaso
titulo: Nota pública
objetivo: "Al terminar podrás explicar con tus palabras cómo ordenar, sacar un top y quitar repetidos, y publicarlo."
duracion_min: 60
prerequisitos: [m02-s02-proyecto]
dataset: abarrotes_trimestre
version: 1.0
---

# Repaso · Nota pública

*1 h: 15 min de repaso, 30 min de escritura, 15 min para publicar*

Explicar lo que aprendiste es la mejor prueba de que lo entendiste. Además, cada nota suma a tu portafolio público.

## Repaso (15 min)

Vuelve a responder, sin ver las lecciones, las preguntas de "Revisa tu comprensión" de las lecciones 1 y 2. Las que falles son tu tema para la nota.

Después escribe esta consulta: producto y cantidad de las **3 ventas más grandes de la sucursal Norte**. Deben salir 30 aguas, 18 bolillos y 13 bolillos.

## Plantilla (máximo 200 palabras)

1. **Qué aprendí** (2–3 frases).
2. **Un ejemplo propio**: una consulta tuya, distinta a las de la lección.
3. **Un error que cometí** y cómo lo resolví.
4. **Una pregunta abierta** para quien lea.

**Temas sugeridos para esta unidad**

- Un top es ordenar y después cortar: ORDER BY … DESC + LIMIT.
- Por qué LIMIT sin ORDER BY no es un top.
- DISTINCT: de 280 ventas a 16 productos.

## Ejemplo de nota

> Esta semana aprendí a ordenar resultados en SQL. Con ORDER BY acomodo las filas por una columna, y con DESC las pongo de mayor a menor.
>
> Mi ejemplo: en las ventas de una tiendita encontré las 5 ventas más grandes del trimestre:
> `SELECT producto, cantidad FROM ventas ORDER BY cantidad DESC LIMIT 5;`
> Todas tenían historia: Nochebuena, Año Nuevo y Día de Muertos.
>
> Mi error: escribí LIMIT 5 sin ORDER BY y creí que eran las más grandes. Solo eran las primeras capturadas. Primero se ordena, después se corta.
>
> ¿Qué top le sacarías a los datos de tu trabajo?
>
> #SQL #DataAnalytics #AprendiendoEnPúblico

## Publicar (15 min)

1. Copia tu nota con el botón de la app.
2. Publícala en LinkedIn, en tu blog o en un archivo de tu repositorio de GitHub.
3. Guarda el enlace: al final del módulo tendrás varias notas para tu portafolio.
