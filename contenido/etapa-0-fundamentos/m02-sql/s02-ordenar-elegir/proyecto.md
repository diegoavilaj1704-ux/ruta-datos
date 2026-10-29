---
id: m02-s02-proyecto
modulo: M2 SQL desde cero
unidad: 2
parada: proyecto-1, proyecto-2
titulo: "Mini-proyecto: la lista de pedido para Toño"
objetivo: "Al terminar podrás armar listas sin repetidos y tops con ORDER BY, LIMIT y DISTINCT, y explicar lo que encontraste sin términos técnicos."
duracion_min: 120
prerequisitos: [m02-s02-leccion-1, m02-s02-leccion-2]
dataset: abarrotes_trimestre
version: 1.0
---

# Mini-proyecto: la lista de pedido para Toño

*2 paradas de 1 h · usa SELECT, FROM, WHERE, ORDER BY, LIMIT y DISTINCT*

## El encargo

Mañana viene **Toño**, el proveedor de bebidas y botanas. Don Rafa quiere tener lista la conversación: qué productos le compra a Toño y cuáles fueron las ventas que más movieron mercancía en el trimestre. Te manda cinco preguntas.

**Las preguntas de Don Rafa**

1. ¿Qué bebidas distintas vende La Esquina? En orden alfabético.
2. ¿Y qué botanas distintas? También en orden alfabético.
3. ¿Cuáles fueron las 3 ventas de bebidas más grandes del trimestre, cuándo y dónde?
4. ¿Cuáles son los 3 productos más caros que vendemos y cuánto cuestan?
5. ¿Qué productos distintos se vendieron el último día del año?

## Parte 1 · La lista para Toño

1. Abre el editor del proyecto: la tabla `ventas` ya está cargada, con las 280 ventas del trimestre.
2. Corre `SELECT DISTINCT categoria FROM ventas;` y fíjate cómo se escriben Bebidas y Botanas.
3. Responde las preguntas 1 y 2: DISTINCT para no repetir, WHERE para la categoría y ORDER BY para el orden alfabético.

> Truco: cuando la lista es para otra persona, ordénala. "Agua, Café, Jugo, Refresco" se revisa en segundos.

## Parte 2 · El top para Don Rafa

1. Responde las preguntas 3, 4 y 5.
2. En cada top, revisa que el primer lugar sea de verdad el más grande: si sale el más chico, te faltó DESC.
3. Escribe tu respuesta a Don Rafa: una frase por pregunta, sin términos técnicos.
4. Agrega 2 o 3 frases de conclusión: ¿qué le dirías a Toño?

## Entregable

Un archivo `reporte_unidad2.sql` con:

- Cada consulta precedida de un comentario `--` con la pregunta que responde.
- Al final, en comentarios, tu mensaje para Don Rafa.

```sql
-- Pregunta 3: las 3 ventas de bebidas más grandes
SELECT fecha, producto, cantidad, sucursal
FROM ventas
WHERE categoria = 'Bebidas'
ORDER BY cantidad DESC
LIMIT 3;
-- Respuesta: 36 refrescos en Sur el 31 de diciembre,
-- 30 aguas en Norte el 2 de noviembre y 21 refrescos en Sur el 20 de noviembre.
```

## Criterios de "listo"

- [ ] Las 5 consultas corren sin error.
- [ ] Las listas no tienen productos repetidos.
- [ ] En los tops, el primer lugar es el más grande (o el más caro).
- [ ] Cada consulta lleva su comentario con la pregunta.
- [ ] Cada respuesta a Don Rafa está en lenguaje no técnico.
- [ ] La conclusión dice algo útil para la plática con Toño.

## Para verificar tus resultados

| Pregunta | Filas esperadas | Primera fila |
| --- | --- | --- |
| 1 · Bebidas distintas | 4 | Agua 1 L |
| 2 · Botanas distintas | 3 | Cacahuates 150 g |
| 3 · Top 3 de bebidas | 3 | 36 refrescos, Sur, 2026-12-31 |
| 4 · Los 3 más caros | 3 | Café soluble 120 g, 65 pesos |
| 5 · Último día del año | 3 | — (ese día hubo 4 ventas, pero el refresco se repite) |

## Extensión opcional

¿Cuáles fueron las 5 ventas más grandes de la sucursal Centro? Pista: es el top de siempre con un WHERE antes del ORDER BY.
