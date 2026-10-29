---
id: m02-s02-leccion-2
modulo: M2 SQL desde cero
unidad: 2
parada: leccion-2
titulo: Los primeros y los distintos con LIMIT y DISTINCT
objetivo: "Al terminar podrás quedarte con las primeras filas de un resultado (LIMIT) y quitar las filas repetidas (DISTINCT)."
duracion_min: 30
prerequisitos: [m02-s02-leccion-1]
dataset: abarrotes_trimestre
version: 1.0
---

# Lección 2 · Los primeros y los distintos con LIMIT y DISTINCT

## 1. Objetivo

Al terminar podrás **quedarte con las primeras filas de un resultado** (LIMIT) y **quitar las filas repetidas** (DISTINCT).

## 2. Por qué importa

Don Rafa vio la lista ordenada de la lección pasada y dijo: "Muy bonita, pero son 280 ventas. Nada más dime las 5 más grandes". Y luego: "¿Qué productos vendemos? Sin repetir, porque el refresco me sale como 50 veces". Un top y una lista sin repetidos son de lo que más se pide en un trabajo de datos.

## 3. Lo que ya sabes

Ya sabes ordenar con ORDER BY. Un **top** es eso mismo, pero quedándote solo con los primeros lugares, como el podio de una carrera.

## 4. La idea en una frase

LIMIT deja solo las primeras filas del resultado, y DISTINCT quita las filas repetidas.

## 5. Analogía

**LIMIT es el podio.** En una carrera corren 280, pero en el podio solo suben los 3 primeros. Para que el podio tenga sentido, primero hay que saber quién llegó antes: eso es ORDER BY.

**DISTINCT es la lista de invitados.** Si Doña Chela vino 20 veces a la tienda, en la lista de clientes aparece una sola vez.

Dónde deja de funcionar: en un podio real nadie empata sin que lo decidan los jueces. En SQL, si dos filas empatan en el último lugar, LIMIT toma cualquiera de las dos.

## 6. Explicación por capas

**Capa 1 · LIMIT va al final.** Siempre es la última pieza de la consulta.

```sql
SELECT columnas
FROM tabla
WHERE condición
ORDER BY columna DESC
LIMIT 5;
```

**Capa 2 · Un top = ORDER BY + LIMIT.** Primero ordenas y después cortas. LIMIT sin ORDER BY te da las primeras filas que encuentre SQL, que no son las más grandes ni las más recientes.

**Capa 3 · DISTINCT va justo después de SELECT.**

```sql
SELECT DISTINCT columna
FROM tabla;
```

**Capa 4 · DISTINCT con varias columnas.** Quita las **combinaciones** repetidas. `SELECT DISTINCT sucursal, categoria` da cada pareja sucursal-categoría una sola vez: 3 sucursales × 5 categorías = 15 combinaciones.

## 7. Ejemplo resuelto

**Pregunta:** ¿cuáles fueron las 5 ventas más grandes del trimestre?

**Paso 1 · Columnas.** Producto, cantidad, sucursal y fecha, para saber qué pasó ese día.

**Paso 2 · Orden.** De mayor a menor cantidad: `ORDER BY cantidad DESC`.

**Paso 3 · Corte.** Solo las primeras 5: `LIMIT 5`.

```sql
-- Top 5 de ventas más grandes del trimestre
SELECT producto, cantidad, sucursal, fecha
FROM ventas
ORDER BY cantidad DESC
LIMIT 5;
```

**Paso 4 · Revisa el resultado.**

| producto | cantidad | sucursal | fecha |
| --- | --- | --- | --- |
| Bolillo | 40 | Centro | 2026-12-24 |
| Refresco 600 ml | 36 | Sur | 2026-12-31 |
| Agua 1 L | 30 | Norte | 2026-11-02 |
| Pan dulce | 24 | Centro | 2026-11-01 |
| Refresco 600 ml | 21 | Sur | 2026-11-20 |

Las 5 ventas grandes tienen historia: Nochebuena, Año Nuevo, el Día de Muertos (1 y 2 de noviembre) y la posada de una escuela.

**Un segundo ejemplo, con DISTINCT.** ¿Qué categorías vendemos?

```sql
-- Cada categoría una sola vez
SELECT DISTINCT categoria
FROM ventas;
```

Salen 5 filas: Botanas, Bebidas, Abarrotes, Lácteos y Panadería. Sin DISTINCT saldrían 280.

## 8. Errores comunes

**LIMIT sin ORDER BY.** `SELECT producto, cantidad FROM ventas LIMIT 5;` no es un top: son las primeras 5 filas capturadas. Ordena primero.

**LIMIT en el lugar equivocado.** `SELECT producto FROM ventas LIMIT 5 ORDER BY cantidad DESC;` da error. LIMIT siempre va hasta el final.

**DISTINCT en medio.** `SELECT producto, DISTINCT categoria FROM ventas;` da error. DISTINCT va justo después de SELECT y aplica a todas las columnas.

## 9. Práctica guiada

**Ejercicio 1 (con pista).** Muestra producto, cantidad y sucursal de las 3 ventas más grandes del trimestre.

> Pista: primero ordena de mayor a menor (`ORDER BY cantidad DESC`) y al final corta con `LIMIT 3`.

**Ejercicio 2 (pista opcional).** Muestra la lista de productos que vende La Esquina, sin repetir ninguno.

> Pista opcional: DISTINCT va justo después de SELECT.

**Ejercicio 3 (sin pista).** Muestra id_venta, fecha y producto de las últimas 5 ventas que se registraron. Cada venta nueva recibe un `id_venta` más grande que la anterior.

**Soluciones comentadas**

```sql
-- Ejercicio 1: top 3 → ordenar y cortar
-- Bolillo 40 (Centro), Refresco 36 (Sur), Agua 30 (Norte)
SELECT producto, cantidad, sucursal
FROM ventas
ORDER BY cantidad DESC
LIMIT 3;
```

```sql
-- Ejercicio 2: 16 productos distintos
SELECT DISTINCT producto
FROM ventas;
```

```sql
-- Ejercicio 3: el id más grande es la venta más nueva
-- → ventas 280 a 276 (del 30 y 31 de diciembre)
SELECT id_venta, fecha, producto
FROM ventas
ORDER BY id_venta DESC
LIMIT 5;
```

## 10. Revisa tu comprensión

**Pregunta 1.** ¿Qué hace LIMIT 3?

- a) Deja solo las 3 filas más grandes.
- b) Deja solo las primeras 3 filas del resultado. ✅
- c) Quita 3 filas repetidas.

> a) Solo si antes ordenaste con ORDER BY … DESC. LIMIT por sí solo no sabe qué es "más grande". · c) Eso se parece a DISTINCT, que quita repetidos.

**Pregunta 2.** ¿Cuál es el orden correcto?

- a) `SELECT … FROM … LIMIT 5 ORDER BY cantidad DESC;`
- b) `SELECT … FROM … ORDER BY cantidad DESC LIMIT 5;` ✅
- c) `SELECT LIMIT 5 … FROM … ORDER BY cantidad DESC;`

> a) LIMIT siempre va al final. · c) En SQLite, LIMIT no va junto a SELECT.

**Pregunta 3.** `SELECT DISTINCT sucursal FROM ventas;`, ¿cuántas filas devuelve?

- a) 280
- b) 3 ✅
- c) 1

> a) Eso sería sin DISTINCT. · c) Hay 3 sucursales distintas: Norte, Centro y Sur.

**Pregunta 4.** `SELECT DISTINCT sucursal, categoria FROM ventas;`, ¿cuántas filas devuelve?

- a) 8, la suma de 3 sucursales y 5 categorías.
- b) 15 ✅
- c) 5

> a) DISTINCT con dos columnas da combinaciones: cada sucursal vendió de las 5 categorías, 3 × 5 = 15. · c) Esas son solo las categorías.

**Pregunta 5 (repaso de la lección 1).** Sin escribir nada después de la columna, ¿cómo ordena ORDER BY?

- a) De menor a mayor. ✅
- b) De mayor a menor.
- c) Como se capturaron.

> b) Para eso necesitas DESC. · c) Eso pasa cuando no hay ORDER BY.

## 11. Resumen

- **LIMIT N** deja las primeras N filas y va siempre al final.
- Un **top** es ORDER BY … DESC + LIMIT: primero ordenas, después cortas.
- **DISTINCT** quita las filas repetidas; va justo después de SELECT y con varias columnas quita combinaciones repetidas.
