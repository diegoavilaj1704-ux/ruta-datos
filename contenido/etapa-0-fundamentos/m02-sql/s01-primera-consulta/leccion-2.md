---
id: m02-s01-leccion-2
modulo: M2 SQL desde cero
unidad: 1
parada: leccion-2
titulo: Filtrar filas con WHERE
objetivo: "Al terminar podrás escribir una consulta que muestre solo las filas que cumplen una condición."
duracion_min: 30
prerequisitos: [m02-s01-leccion-1]
dataset: abarrotes_ventas
version: 1.1
---

# Lección 2 · Filtrar filas con WHERE

## 1. Objetivo

Al terminar podrás **escribir una consulta que muestre solo las filas que cumplen una condición**.

## 2. Por qué importa

Ahora el dueño pregunta: "¿Qué se vendió en la sucursal Norte?". No quiere las 8 ventas, solo las de Norte. Casi todo reporte de negocio empieza filtrando: un periodo, una región, un producto.

## 3. Lo que ya sabes

En la lección 1 elegiste **columnas** con SELECT. Hoy eliges **filas**. Si has usado el filtro de Excel (la flechita en el encabezado), ya conoces la idea.

## 4. La idea en una frase

WHERE deja pasar solo las filas que cumplen la condición que tú escribes.

## 5. Analogía

WHERE funciona como un colador. Echas todas las filas; las que cumplen la condición pasan, las demás se quedan fuera.

Dónde deja de funcionar: un colador separa para siempre. En SQL las filas que no pasaron siguen en la tabla; solo no aparecen en tu resultado.

## 6. Explicación por capas

**Capa 1 · Dónde va.** WHERE se escribe después de FROM. Primero dices de qué tabla, luego qué filas.

```sql
SELECT columnas
FROM tabla
WHERE condición;
```

Se lee: "Selecciona estas columnas de la tabla, donde se cumpla la condición".

**Capa 2 · La condición.** Una **condición** compara una columna con un valor. Cada fila responde sí o no. Solo las filas con "sí" aparecen.

**Capa 3 · Los comparadores.**

| Símbolo | Significa | Ejemplo |
| --- | --- | --- |
| = | igual a | `sucursal = 'Norte'` |
| <> | distinto de | `categoria <> 'Bebidas'` |
| > | mayor que | `cantidad > 3` |
| < | menor que | `precio_unitario < 20` |
| >= | mayor o igual que | `cantidad >= 4` |
| <= | menor o igual que | `precio_unitario <= 28` |

**Capa 4 · Comillas sí o no.** Textos y fechas van entre comillas simples: `'Norte'`, `'2026-10-02'`. Los números van sin comillas: `4`, `18`.

## 7. Ejemplo resuelto

**Pregunta:** ¿qué se vendió en la sucursal Norte y cuántas piezas?

**Paso 1 · Columnas.** Producto, cantidad y, para comprobar, sucursal.

**Paso 2 · Tabla.** `ventas`.

**Paso 3 · Condición.** La sucursal debe ser igual a Norte. Es texto, así que va entre comillas.

**Paso 4 · Escribe la consulta.**

```sql
-- Ventas de la sucursal Norte
SELECT producto, cantidad, sucursal
FROM ventas
WHERE sucursal = 'Norte';
```

**Paso 5 · Revisa el resultado.** De 8 filas, pasan 3:

| producto | cantidad | sucursal |
| --- | --- | --- |
| Pan de caja | 1 | Norte |
| Galletas | 4 | Norte |
| Agua 1 L | 6 | Norte |

**Un segundo ejemplo, con número.** ¿Qué ventas fueron de 4 piezas o más?

```sql
-- Ventas grandes: 4 piezas o más
SELECT producto, cantidad, sucursal
FROM ventas
WHERE cantidad >= 4;
```

| producto | cantidad | sucursal |
| --- | --- | --- |
| Refresco 600 ml | 5 | Sur |
| Galletas | 4 | Norte |
| Agua 1 L | 6 | Norte |

Galletas entra porque tiene exactamente 4: `>=` incluye el 4. Con `> 4` se habría quedado fuera.

## 8. Errores comunes

**Texto sin comillas.** `WHERE sucursal = Norte` da error: SQL cree que Norte es una columna. Escribe `'Norte'`.

**Mayúsculas distintas.** `WHERE sucursal = 'norte'` no da error, pero devuelve 0 filas. En muchas bases de datos 'norte' y 'Norte' son textos diferentes. Copia el valor tal como está en la tabla.

**WHERE en el lugar equivocado.** `SELECT producto WHERE sucursal = 'Norte' FROM ventas;` da error. El orden siempre es SELECT → FROM → WHERE.

## 9. Práctica guiada

**Ejercicio 1 (con pista).** Muestra producto y categoría de las ventas de la categoría Bebidas.

> Pista: la condición es `categoria = 'Bebidas'`. Va después de FROM.

**Ejercicio 2 (pista opcional).** Muestra producto y precio de las ventas con precio unitario menor a 20 pesos.

> Pista opcional: el precio es un número, así que va sin comillas.

**Ejercicio 3 (sin pista).** Muestra el id de venta y el producto de todo lo vendido el 2 de octubre de 2026.

**Soluciones comentadas**

```sql
-- Ejercicio 1: texto entre comillas → 3 filas
SELECT producto, categoria
FROM ventas
WHERE categoria = 'Bebidas';

-- Ejercicio 2: número sin comillas → 3 filas
SELECT producto, precio_unitario
FROM ventas
WHERE precio_unitario < 20;
```

```sql
-- Ejercicio 3: fecha entre comillas, formato año-mes-día
-- → 2 filas: Leche 1 L (id 3) y Refresco 600 ml (id 4)
SELECT id_venta, producto
FROM ventas
WHERE fecha = '2026-10-02';
```

En el ejercicio 2 salen dos refrescos (18 pesos) y el agua (12 pesos). Las papas (20 pesos) no entran: 20 no es menor que 20.

## 10. Revisa tu comprensión

**Pregunta 1.** ¿Qué hace WHERE?

- a) Elige qué columnas mostrar.
- b) Elige qué filas mostrar. ✅
- c) Ordena las filas.

> a) Eso es SELECT. SELECT recorta columnas; WHERE recorta filas. · c) Ordenar es otra instrucción que verás en la Unidad 2.

**Pregunta 2.** ¿Cuál condición está bien escrita?

- a) `WHERE categoria = Lácteos`
- b) `WHERE categoria = 'Lácteos'` ✅
- c) `WHERE cantidad = '2'`

> a) Sin comillas, SQL busca una columna llamada Lácteos y marca error. · c) Puede funcionar en algunas bases, pero es mala práctica: los números van sin comillas.

**Pregunta 3.** `WHERE cantidad > 4` en esta tabla, ¿cuántas filas devuelve?

- a) 3
- b) 2 ✅
- c) 4

> a) Ese es el resultado de `>= 4`. Con `>` solo, Galletas (4 piezas) queda fuera. Solo pasan el refresco de Sur (5) y el agua (6).

**Pregunta 4.** Escribes `WHERE sucursal = 'sur'` y obtienes 0 filas. ¿Qué pasó?

- a) No hay ventas en Sur.
- b) El valor en la tabla es 'Sur', con mayúscula. ✅
- c) WHERE no funciona con texto.

> a) Sí hay: las ventas 4 y 6. · c) WHERE sí funciona con texto, pero compara letra por letra. Revisa siempre cómo está escrito el valor en la tabla.

**Pregunta 5 (repaso de la lección 1).** ¿Qué trae `SELECT *`?

- a) Todas las columnas. ✅
- b) Todas las tablas.
- c) Solo la primera fila.

> b) FROM sigue indicando una sola tabla. · c) El asterisco se refiere a columnas; las filas se controlan con WHERE.

## 11. Resumen

- **WHERE** filtra filas; va siempre después de FROM.
- Texto y fechas entre comillas simples; números sin comillas.
- `>` excluye el valor del límite; `>=` lo incluye.
