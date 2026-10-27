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

*Actualizado el 27 oct 2026: el protagonista es el avatar de cada alumno y Hashy sustituye a Fer.*

| Personaje | Papel | Aparece |
| --- | --- | --- |
| **Tú** (`yo`) | Protagonista. Cada alumno arma su avatar y elige su nombre la primera vez que abre la app; Don Rafa le habla por ese nombre (`{nombre}` en las historias) | En cada lección |
| **Don Rafa** (`rafa`) | Dueño de Abarrotes La Esquina. Pone el problema de negocio | En cada encargo y ejercicio |
| **Hashy** (`hashy`) | Schnauzer sal y pimienta con collar coral. Da tips ("Tip de Hashy") y, cuando te equivocas, aparece **triste** con un "¡Auuu!" | Tips y cada error |
| Lupita, Kemi, Sofía, Beto, Mariana, Jun, Doña Chela, Toño | Elenco secundario (cajera, analista, proveedora, repartidor, gerentes de sucursal, clientes) | Cuando el tema lo pida |

**Diversidad obligatoria:** el elenco mezcla tonos de piel, complexiones (delgadas y llenitas), edades y peinados (rizos, afro, trenzas, largo, chongo, calvo).

**Avatares:** caras animadas dibujadas con código (SVG), no imágenes (`app/src/lib/personajes.ts`). Pesan casi nada, funcionan sin conexión y no tienen problemas de derechos.

**Creador de avatar:** nombre, piel (6 tonos), complexión (delgada o llenita), peinado (con vista previa de tu propia cara), color de pelo (6), barba, bigote, aretes y color favorito (6). Se edita tocando tu avatar en Hoy.

**Cuerpo completo:** el avatar del alumno tiene cuerpo completo con proporciones naturales (brazos con codo y manos, cintura, piernas y tenis). En el chat se ve el recorte de su cara, con gorro y lentes incluidos. El elenco sigue en busto. Dibujo en `app/src/lib/armario.ts`.

**Hashy:** dos expresiones. Feliz: orejas paradas, ojos con brillo y lengua. Triste: orejas caídas, cejas preocupadas, lagrimita y boca hacia abajo. Habla como perrito ("¡Guau!", "olfatea otra vez") y nunca regaña.

## Clóset y XP

Los XP se ganan en las lecciones y **se gastan** en el clóset (al comprar se descuentan). Lo que no tienes se **prueba primero** en el avatar y se compra con un botón aparte, para no gastar por accidente. Cada casilla muestra tu avatar con la prenda puesta, con zoom a la zona que importa.

| Categoría | Gratis | Con XP |
| --- | --- | --- |
| Peinados | 11 básicos | Bob, Raya de lado (40) · Coletas (50) · Copete, Picos (60) · Dos chongos (70) · Rastas (80) · Cresta (90) |
| Ropa | Playera (color favorito), Sudadera | Cuadros (40) · Hawaiana (70) · Mezclilla (80) · Chaleco acolchado (90) · Hoodie `</>` (110) · Jersey SQL (120) · Varsity (130) · Cuero (140) · Saco y corbata (160) |
| Pantalón | Jeans, Pants | Shorts (30) · Falda (50) · Cargo (60) |
| Tenis | Blancos | Rojos (50) · Altos (80) · Botas (90) · Neón (150) |
| Gorros | — | Gorra (40) · Bandana (50) · Lana (60) · Boina (70) · Sombrero (100) · Corona de datos (300) |
| Lentes | Redondos | Sol (50) · Pasta (70) |
| Accesorios | — | Reloj (40) · Bufanda (45) · Gafete DATA (60) · Audífonos (80) · Collar (90) |

Referencia: una lección completa da ~65 XP.

## Sonidos

Sintetizados con Web Audio, sin archivos (`app/src/lib/sonidos.ts`): un arpegio corto al acertar, un "ayyy" que cae con vibrato al equivocarse y una fanfarria al terminar la lección. En el iPhone respetan el interruptor de silencio, y se pueden apagar con el botón 🔊 de la lección.
