---
id: m02-s02-leccion-1
modulo: M2 SQL desde cero
unidad: 2
parada: leccion-1
titulo: Ordenar el resultado con ORDER BY
objetivo: "Al terminar podrás ordenar el resultado de una consulta de mayor a menor o de menor a mayor con ORDER BY."
duracion_min: 30
prerequisitos: [m02-s01-leccion-2]
dataset: abarrotes_trimestre
version: 1.0
---

# Lección 1 · Ordenar el resultado con ORDER BY

## 1. Objetivo

Al terminar podrás **ordenar el resultado de una consulta de mayor a menor o de menor a mayor** con ORDER BY.

## 2. Por qué importa

Mañana viene Toño, el proveedor de bebidas y botanas. Don Rafa quiere ver primero sus ventas más grandes del trimestre para decidir qué pedir. Ahora la tabla tiene 280 ventas: buscarlas a ojo ya no es opción. Casi todo reporte se lee ordenado: lo más vendido arriba, lo más reciente primero.

## 3. Lo que ya sabes

En la Unidad 1 elegiste columnas con SELECT y filas con WHERE. Las filas salían en el orden en que se capturaron. Si alguna vez ordenaste una lista en Excel de la A a la Z, ya conoces la idea.

La tabla `ventas` es la misma de siempre, con las mismas 7 columnas, pero ahora trae **todo el trimestre**: 280 ventas del 1 de octubre al 31 de diciembre de 2026.

## 4. La idea en una frase

ORDER BY acomoda las filas del resultado según los valores de una columna.

## 5. Analogía

Es como formar a un grupo por estatura. Le dices a todos "fórmense de la más alta a la más baja" y nadie sale ni entra al grupo: solo cambian de lugar.

Dónde deja de funcionar: en la fila del grupo la gente se queda formada. En SQL, la tabla no cambia: el orden solo vive en tu resultado.

## 6. Explicación por capas

**Capa 1 · Dónde va.** ORDER BY se escribe al final, después de WHERE (si hay WHERE).

```sql
SELECT columnas
FROM tabla
WHERE condición
ORDER BY columna;
```

Se lee: "Selecciona estas columnas de la tabla, donde se cumpla la condición, **ordenadas por** esta columna".

**Capa 2 · Hacia dónde.** Hay dos direcciones:

| Palabra | Significa | Números | Texto | Fechas |
| --- | --- | --- | --- | --- |
| ASC | ascendente (el normal) | de menor a mayor | de la A a la Z | de la más antigua a la más reciente |
| DESC | descendente | de mayor a menor | de la Z a la A | de la más reciente a la más antigua |

Si no escribes nada, SQL usa ASC. Para ir de mayor a menor tienes que escribir **DESC**.

**Capa 3 · No cambia la tabla.** ORDER BY ordena lo que ves, no lo que está guardado. Si vuelves a correr `SELECT * FROM ventas;`, las filas salen como siempre.

## 7. Ejemplo resuelto

**Pregunta:** ¿cuáles fueron las ventas más grandes de la sucursal Sur?

**Paso 1 · Columnas.** Producto y cantidad.

**Paso 2 · Tabla y filas.** De `ventas`, solo las de Sur.

**Paso 3 · Orden.** "Las más grandes primero" es de mayor a menor: `ORDER BY cantidad DESC`.

**Paso 4 · Escribe la consulta.**

```sql
-- Ventas de Sur, de la más grande a la más chica
SELECT producto, cantidad
FROM ventas
WHERE sucursal = 'Sur'
ORDER BY cantidad DESC;
```

**Paso 5 · Revisa el resultado.** Salen las 93 ventas de Sur; las primeras 4 son:

| producto | cantidad |
| --- | --- |
| Refresco 600 ml | 36 |
| Refresco 600 ml | 21 |
| Bolillo | 15 |
| Bolillo | 9 |

Los 36 refrescos se vendieron el 31 de diciembre, para Año Nuevo.

**Un segundo ejemplo, con texto.** `ORDER BY producto` ordena de la A a la Z: el primero que aparece es "Aceite 1 L" y el último, "Yogur 1 L".

## 8. Errores comunes

**Olvidar DESC.** `ORDER BY cantidad` pone primero las ventas más **chicas**. Si tu "top" empieza con 1 pieza, te faltó DESC.

**ORDER BY antes de WHERE.** `SELECT producto FROM ventas ORDER BY cantidad WHERE sucursal = 'Sur';` da error. El orden de las piezas es SELECT → FROM → WHERE → ORDER BY.

**Creer que se ordenó la tabla.** ORDER BY solo acomoda tu resultado. La siguiente consulta sin ORDER BY vuelve a salir en el orden original.

## 9. Práctica guiada

**Ejercicio 1 (con pista).** Muestra producto y cantidad de las ventas de Norte, de la más grande a la más chica.

> Pista: después de WHERE va `ORDER BY cantidad`. "De la más grande a la más chica" es de mayor a menor: DESC.

**Ejercicio 2 (pista opcional).** Muestra producto y precio de las ventas de Lácteos, del precio más bajo al más alto.

> Pista opcional: "del más bajo al más alto" es el orden normal (ASC); no necesitas escribir nada después de la columna.

**Ejercicio 3 (sin pista).** Muestra fecha, producto y cantidad de las ventas de Bebidas, de la más reciente a la más antigua.

**Soluciones comentadas**

```sql
-- Ejercicio 1: de mayor a menor → DESC (77 filas; arriba, 30 aguas)
SELECT producto, cantidad
FROM ventas
WHERE sucursal = 'Norte'
ORDER BY cantidad DESC;
```

```sql
-- Ejercicio 2: de menor a mayor es el orden normal (47 filas)
SELECT producto, precio_unitario
FROM ventas
WHERE categoria = 'Lácteos'
ORDER BY precio_unitario;
```

```sql
-- Ejercicio 3: fechas recientes primero → DESC (81 filas)
SELECT fecha, producto, cantidad
FROM ventas
WHERE categoria = 'Bebidas'
ORDER BY fecha DESC;
```

En el ejercicio 2 aparecen primero las leches (28 pesos), luego los yogures (38) y al final los quesos (55).

## 10. Revisa tu comprensión

**Pregunta 1.** ¿Qué hace ORDER BY?

- a) Filtra las filas que cumplen una condición.
- b) Acomoda las filas del resultado según una columna. ✅
- c) Cambia el orden de las filas guardadas en la tabla.

> a) Eso es WHERE. · c) La tabla no cambia: solo tu resultado sale ordenado.

**Pregunta 2.** Quieres las ventas de la más grande a la más chica. ¿Qué escribes?

- a) `ORDER BY cantidad`
- b) `ORDER BY cantidad DESC` ✅
- c) `ORDER BY DESC cantidad`

> a) Sin DESC va de menor a mayor: la más chica primero. · c) DESC va después de la columna, no antes.

**Pregunta 3.** ¿Dónde va ORDER BY?

- a) Antes de FROM.
- b) Entre FROM y WHERE.
- c) Después de WHERE. ✅

> a) y b) El orden fijo es SELECT → FROM → WHERE → ORDER BY. Cualquier otro orden da error.

**Pregunta 4.** `ORDER BY fecha` sin nada más, ¿qué venta sale primero?

- a) La más antigua. ✅
- b) La más reciente.
- c) Una cualquiera.

> b) Para la más reciente necesitas DESC. · c) Con ORDER BY el orden ya no es al azar: va de la fecha más antigua a la más reciente.

**Pregunta 5 (repaso de la Unidad 1).** ¿Cuál condición está bien escrita?

- a) `WHERE sucursal = 'Sur'` ✅
- b) `WHERE sucursal = Sur`
- c) `WHERE 'sucursal' = Sur`

> b) Sin comillas, SQL busca una columna llamada Sur. · c) Las comillas van en el valor, no en el nombre de la columna.

## 11. Resumen

- **ORDER BY** acomoda las filas del resultado; va al final, después de WHERE.
- Sin nada, ordena de menor a mayor (ASC); con **DESC**, de mayor a menor.
- Funciona con números, texto (A→Z) y fechas (antigua→reciente), y no cambia la tabla.
