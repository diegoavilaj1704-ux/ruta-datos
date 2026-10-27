# Estilo visual y personajes

*Definido el 27 oct 2026 con el piloto, a partir de maquetas comparadas.*

## Personalidad

**Juguetón con alma de código.** La app se siente como un juego (botones con relieve, letra redonda, barra de avance gruesa, XP y racha), pero cada vez que se escribe SQL aparece una **terminal de código real**. Así quien estudia siente que está aprendiendo a programar, no llenando un formulario.

Lo que el piloto rechazó, para no repetirlo:

- **Texto largo tipo documento** ("parece un texto aburrido"). La lección se vive en tarjetas cortas con retos, no en 11 secciones seguidas.
- **Pantallas saturadas.** Una maqueta con misión, traducción negocio→SQL, lista de columnas, resultado esperado y pistas fue rechazada por saturada. Menos elementos por pantalla.
- **Colores de Duolingo** (verde `#58CC02`, azul `#1CB0F6`, naranja `#FF9600`). Se buscó una paleta propia.

## Paleta: violeta y coral

| Uso | Color |
| --- | --- |
| Principal (botones, barra de avance) | `#6C4CF1` · relieve `#4B2FC9` |
| Racha y errores | coral `#FF6B5B` |
| XP | ámbar `#FFB020` |
| Texto | `#2A2838` sobre blanco; bordes `#ECEAF3` |

**Terminal:** fondo `#13121C`, barra superior `#1D1B2A` con tres puntos (coral, ámbar, menta) y el nombre del archivo (`ventas.db`), números de línea `#4E4A66`, palabras clave `#B9A8FF`, columnas y resultados `#7CF2C3`, cursor parpadeante.

**Teclas para armar la consulta:** viven *dentro* de la terminal (fondo `#2A2740`, borde inferior oscuro de relieve), con el texto del mismo color con el que aparecerá en el código. Fuera de la terminal, sobre blanco, no se leían.

**Tipografía:** Nunito (UI, pesos 600/800/900) y JetBrains Mono (código).

## Pantalla de reto (referencia)

1. Barra de avance + racha + XP.
2. Burbuja de **Don Rafa** con el encargo en lenguaje de negocio.
3. **Título con la instrucción exacta**, con los nombres de columna resaltados tal como se escriben: *Muestra las columnas `producto` y `cantidad`*.
4. Terminal con la consulta y su teclado de piezas.
5. Botón **EJECUTAR ▶**. El resultado sale "impreso" en la terminal (`✓ 8 filas · 2 columnas · +10 xp`).

## Personajes

| Personaje | Papel | Aparece |
| --- | --- | --- |
| **Diego** | Protagonista. Analista de datos que ayuda a Don Rafa; resuelve los encargos *junto con* quien estudia | En cada lección |
| **Don Rafa** | Dueño de Abarrotes La Esquina. Pone el problema de negocio | En cada encargo y ejercicio |
| **Fer** | Amiga de Diego, ya trabaja en datos. Da tips, atajos y cuenta errores que ella cometió ("Tip de Fer") | De vez en cuando, sobre todo en errores comunes |
| Lupita, Kemi, Sofía, Beto, Mariana, Jun, Doña Chela, Toño | Elenco secundario (cajera, analista, proveedora, repartidor, gerentes de sucursal, clientes) | Cuando el tema lo pida |

**Diversidad obligatoria:** el elenco mezcla tonos de piel, complexiones (delgadas y llenitas), edades y peinados (rizos, afro, trenzas, largo, chongo, calvo).

**Avatares:** caras animadas dibujadas con código (SVG), no imágenes. Se arman combinando tono de piel (6), complexión, peinado, barba, bigote, lentes y aretes. Pesan casi nada, funcionan sin conexión, no tienen problemas de derechos y sirven después para que cada alumno arme su propio avatar.

| Personaje | Rasgos |
| --- | --- |
| Diego | Piel morena clara, pelo ondulado, barba corta, sudadera violeta |
| Fer | Piel apiñonada, cola de caballo con moño coral, aretes |
| Don Rafa | Piel morena, cara llenita, canas con entradas, bigote canoso, camisa coral |
