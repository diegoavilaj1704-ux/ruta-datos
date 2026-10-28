---
id: m02-s01-leccion-1
modulo: M2 SQL desde cero
unidad: 1
parada: leccion-1
titulo: Elegir columnas con SELECT y FROM
objetivo: "Al terminar podrás escribir una consulta que muestre solo las columnas que necesitas de una tabla."
duracion_min: 30
prerequisitos: []
dataset: abarrotes_ventas
version: 1.1
---

# Lección 1 · Elegir columnas con SELECT y FROM

Toda la unidad trabajas con la misma tabla: las ventas de **Abarrotes La Esquina**, una tienda con tres sucursales. La tabla ya está cargada en el editor de esta lección.

| Columna | Qué guarda | Ejemplo |
| --- | --- | --- |
| id_venta | Número único de cada venta | 1 |
| fecha | Día de la venta (año-mes-día) | 2026-10-01 |
| producto | Qué se vendió | Refresco 600 ml |
| categoria | Tipo de producto | Bebidas |
| cantidad | Piezas vendidas | 3 |
| precio_unitario | Precio de una pieza, en pesos | 18 |
| sucursal | Dónde se vendió | Centro |

## 1. Objetivo

Al terminar podrás **escribir una consulta que muestre solo las columnas que necesitas** de una tabla.

## 2. Por qué importa

El dueño de la tienda te pide: "Pásame qué productos se vendieron y cuántas piezas". La tabla tiene siete columnas, pero él solo quiere dos. Saber pedir exactamente esas dos es lo primero que se hace en cualquier trabajo con datos.

## 3. Lo que ya sabes

Ya sabes leer una tabla como una hoja de Excel. Cada **fila** es un registro (aquí, una venta). Cada **columna** es un dato de ese registro (producto, fecha, precio).

## 4. La idea en una frase

Con SQL le dices a la base de datos **qué columnas quieres ver y de qué tabla**.

## 5. Analogía

Piensa en pedir en una fonda. No dices "tráeme toda la cocina"; dices "quiero sopa y agua de jamaica". SELECT es tu pedido: nombras lo que quieres y la tabla te lo sirve.

Dónde deja de funcionar: en la fonda el plato se acaba. En SQL, la tabla original nunca cambia; solo ves una copia con las columnas que pediste.

## 6. Explicación por capas

**Capa 1 · Las palabras clave.** Una **consulta** es una pregunta escrita en SQL. La más básica usa dos palabras:

- **SELECT** ("selecciona"): qué columnas quieres.
- **FROM** ("de"): de qué tabla salen.

**Capa 2 · El orden.** Siempre va primero SELECT y luego FROM. Las columnas se separan con comas. La consulta termina con punto y coma.

**Capa 3 · La forma general.**

```sql
SELECT columna1, columna2
FROM nombre_tabla;
```

Se lee: "Selecciona la columna 1 y la columna 2 de la tabla".

**Capa 4 · Todas las columnas.** Si quieres ver la tabla completa, usa un asterisco `*`, que significa "todas":

```sql
SELECT *
FROM ventas;
```

Úsalo para explorar. En reportes, nombra las columnas: es más claro y más rápido.

## 7. Ejemplo resuelto

**Pregunta:** ¿qué productos se vendieron y cuántas piezas?

**Paso 1 · Identifica las columnas.** "Productos" está en `producto`. "Cuántas piezas" está en `cantidad`.

**Paso 2 · Identifica la tabla.** Los datos están en `ventas`.

**Paso 3 · Escribe la consulta.**

```sql
-- Productos vendidos y piezas de cada venta
SELECT producto, cantidad
FROM ventas;
```

**Paso 4 · Revisa el resultado.** Obtienes 8 filas (una por venta) y solo 2 columnas:

| producto | cantidad |
| --- | --- |
| Refresco 600 ml | 3 |
| Pan de caja | 1 |
| Leche 1 L | 2 |
| Refresco 600 ml | 5 |
| Galletas | 4 |
| Leche 1 L | 1 |
| Papas fritas | 2 |
| Agua 1 L | 6 |

Fíjate: "Refresco 600 ml" aparece dos veces porque se vendió en dos ventas distintas. SELECT no junta ni suma nada; solo muestra.

> Las líneas que empiezan con `--` son **comentarios**: notas para personas que SQL ignora.

## 8. Errores comunes

**Coma de más al final.** `SELECT producto, cantidad, FROM ventas;` da error. Después de la última columna no va coma.

**Coma de menos.** `SELECT producto cantidad FROM ventas;` no da error, pero muestra una sola columna llamada "cantidad" con los productos. SQL entendió que querías renombrar `producto`. Si ves algo raro, revisa tus comas.

**Nombre mal escrito.** `SELECT produto FROM ventas;` da un error del tipo "no such column". Copia los nombres tal como aparecen en la tabla, sin acentos si no los tienen.

## 9. Práctica guiada

**Ejercicio 1 (con pista).** Muestra el producto y la sucursal de cada venta.

> Pista: las columnas se llaman `producto` y `sucursal`. Sigue la forma `SELECT … FROM …;`

**Ejercicio 2 (pista opcional).** Muestra la fecha, el producto y el precio de una pieza.

> Pista opcional: el precio de una pieza está en la columna que termina en "unitario".

**Ejercicio 3 (sin pista).** Muestra todas las columnas de la tabla sin escribir sus nombres.

**Soluciones comentadas**

```sql
-- Ejercicio 1: dos columnas, separadas por coma
SELECT producto, sucursal
FROM ventas;

-- Ejercicio 2: el orden de las columnas en SELECT
-- es el orden en que aparecen en el resultado
SELECT fecha, producto, precio_unitario
FROM ventas;

-- Ejercicio 3: el asterisco trae todas las columnas
SELECT *
FROM ventas;
```

En los ejercicios 1 y 2 debes ver 8 filas. En el 3, 8 filas y 7 columnas.

## 10. Revisa tu comprensión

**Pregunta 1.** ¿Qué hace `FROM ventas`?

- a) Borra la tabla ventas.
- b) Indica de qué tabla salen los datos. ✅
- c) Elige las columnas a mostrar.

> a) No: SELECT y FROM solo leen; nunca borran ni cambian datos. · c) Eso lo hace SELECT. Es la confusión más común al empezar: SELECT dice *qué*, FROM dice *de dónde*.

**Pregunta 2.** ¿Cuál consulta está bien escrita?

- a) `FROM ventas SELECT producto;`
- b) `SELECT producto, FROM ventas;`
- c) `SELECT producto FROM ventas;` ✅

> a) El orden importa: SELECT siempre va primero. · b) Sobra la coma antes de FROM; después de la última columna no lleva coma.

**Pregunta 3.** Corres `SELECT producto FROM ventas;`. ¿Cuántas filas ves?

- a) 1, porque pediste una columna.
- b) 8, una por cada venta. ✅
- c) 6, una por cada producto distinto.

> a) Elegir columnas no reduce filas; filtrar filas lo verás en la lección 2. · c) SELECT no quita repetidos: si un producto se vendió dos veces, aparece dos veces.

**Pregunta 4 (repaso del M1).** En la tabla `ventas`, ¿qué representa una fila?

- a) Un producto del catálogo.
- b) Una venta. ✅
- c) Una sucursal.

> a) Un mismo producto aparece en varias filas, así que una fila no puede ser "el producto". · c) Hay 3 sucursales y 8 filas; cada fila dice en qué sucursal ocurrió la venta.

## 11. Resumen

- **SELECT** dice qué columnas quieres; **FROM**, de qué tabla.
- Las columnas van separadas por comas, sin coma después de la última.
- `SELECT *` trae todas las columnas; úsalo para explorar.
