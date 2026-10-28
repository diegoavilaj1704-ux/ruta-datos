---
id: m02-s01-proyecto
modulo: M2 SQL desde cero
unidad: 1
parada: proyecto-1, proyecto-2
titulo: "Mini-proyecto: reporte para el dueño"
objetivo: "Al terminar podrás responder preguntas de negocio reales con SELECT, FROM y WHERE y explicar los hallazgos sin términos técnicos."
duracion_min: 120
prerequisitos: [m02-s01-leccion-1, m02-s01-leccion-2]
dataset: abarrotes_ventas
version: 1.1
---

# Mini-proyecto: reporte para el dueño

*2 paradas de 1 h · usa solo SELECT, FROM y WHERE*

## El encargo

Don Rafa, dueño de Abarrotes La Esquina, quiere entender sus primeras ventas de octubre antes de hacer el siguiente pedido a proveedores. Te manda cinco preguntas por WhatsApp. Tu trabajo: responderlas con consultas y explicarle los hallazgos en palabras simples.

**Las preguntas de Don Rafa**

1. ¿Qué se vendió en la sucursal Centro, en qué fecha y cuántas piezas?
2. ¿Cuánta leche y otros lácteos vendimos, y en qué sucursales?
3. ¿Cuáles fueron las ventas "grandes", de más de 3 piezas?
4. ¿Qué se vendió el 3 de octubre y dónde?
5. ¿Qué productos vendimos que **no** cuestan 18 pesos?

## Parte 1 · Preparar y explorar

1. Abre el editor del proyecto: la tabla `ventas` ya está cargada.
2. Corre `SELECT * FROM ventas;` y lee las 8 filas con calma.
3. Para cada pregunta, anota: qué columnas necesitas y cuál es la condición.
4. Escribe y prueba las consultas de las preguntas 1 y 2.

> Truco: antes de escribir WHERE, busca en el resultado de `SELECT *` cómo está escrito exactamente el valor (mayúsculas, acentos).

## Parte 2 · Responder y concluir

1. Escribe y prueba las consultas de las preguntas 3, 4 y 5.
2. Revisa que cada resultado tenga sentido contra la tabla completa.
3. Escribe tu respuesta a Don Rafa: una frase por pregunta, sin términos técnicos.
4. Agrega 2 o 3 frases de conclusión: ¿qué notas en las ventas?

## Entregable

Un archivo `reporte_unidad1.sql` con:

- Cada consulta precedida de un comentario `--` con la pregunta que responde.
- Al final, en comentarios, tu mensaje para Don Rafa.

Ejemplo del formato esperado:

```sql
-- Pregunta 1: ventas de la sucursal Centro
SELECT fecha, producto, cantidad
FROM ventas
WHERE sucursal = 'Centro';
-- Respuesta: en Centro se vendieron refrescos, leche y papas;
-- 3 ventas en total entre el 1 y el 4 de octubre.
```

## Criterios de "listo"

- [ ] Las 5 consultas corren sin error.
- [ ] Cada consulta muestra solo las columnas necesarias para responder.
- [ ] Cada consulta lleva su comentario con la pregunta.
- [ ] Cada respuesta a Don Rafa está escrita en lenguaje no técnico.
- [ ] La conclusión menciona al menos un patrón que notaste.

## Para verificar tus resultados

Compara cuántas filas te salieron. Si no coincide, revisa comillas, mayúsculas y el comparador.

| Pregunta | Filas esperadas |
| --- | --- |
| 1 · Sucursal Centro | 3 |
| 2 · Lácteos | 2 |
| 3 · Más de 3 piezas | 3 |
| 4 · 3 de octubre | 2 |
| 5 · Precio distinto de 18 | 6 |

<!-- Soluciones de referencia (para la validación automática de la app; no se muestran al alumno):
P1: SELECT fecha, producto, cantidad FROM ventas WHERE sucursal = 'Centro';
P2: SELECT producto, cantidad, sucursal FROM ventas WHERE categoria = 'Lácteos';
P3: SELECT producto, cantidad, sucursal FROM ventas WHERE cantidad > 3;
P4: SELECT producto, sucursal FROM ventas WHERE fecha = '2026-10-03';
P5: SELECT producto, sucursal FROM ventas WHERE precio_unitario <> 18;
-->

## Extensión opcional

Don Rafa agrega: "¿Y cuántas bebidas vendimos solo en Norte?". Con lo que sabes hasta hoy, ¿cómo lo resolverías? Escribe tu intento. En la Unidad 2 verás cómo combinar dos condiciones en un solo WHERE.
