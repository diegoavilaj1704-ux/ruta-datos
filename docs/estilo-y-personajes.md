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
| **Hashy** (`hashy`) | Schnauzer sal y pimienta con collar rojo. Da tips ("Tip de Hashy"), se pasea por el mapa y, cuando te equivocas, aparece **triste** | Mapa, tips y cada error |
| Lupita, Kemi, Sofía, Beto, Mariana, Jun, Doña Chela, Toño | Elenco secundario (cajera, analista, proveedora, repartidor, gerentes de sucursal, clientes) | Cuando el tema lo pida |

**Diversidad obligatoria:** el elenco mezcla tonos de piel, complexiones (delgadas y llenitas), edades y peinados (rizos, afro, trenzas, largo, chongo, calvo).

**Avatares:** caras animadas dibujadas con código (SVG), no imágenes (`app/src/lib/personajes.ts`). Pesan casi nada, funcionan sin conexión y no tienen problemas de derechos.

**Creador de avatar:** nombre, piel (6 tonos), complexión (delgada o llenita), peinado (con vista previa de tu propia cara), color de pelo (6), barba, bigote, aretes y color favorito (6). Se edita tocando tu avatar en la barra del mapa.

**Cuerpo completo:** el avatar del alumno tiene cuerpo completo con proporciones naturales (brazos con codo y manos, cintura, piernas y tenis). En el chat se ve el recorte de su cara, con gorro y lentes incluidos. El elenco sigue en busto. Dibujo en `app/src/lib/armario.ts`.

**Hashy:** dibujado con contorno oscuro, como caricatura, a partir de dos imágenes de referencia del piloto: cara rectangular gris, cejas blancas pobladas, barba ancha que termina en punta, orejas dobladas con interior rosa, nariz negra y collar rojo. Tres caras: normal, **triste** (orejas caídas, lagrimita, boca hacia abajo) y **con lentes oscuros** (al abrir el premio de la unidad). Vive en el mapa: a ratos está **sentado**, **dormido** (con Zzz) o **jugando con su pelota**; solo **camina** cuando va a darte un tip, a otro lugar del mapa, donde ladra y prende un foco. Si lo tocas, se despierta y te da un tip. Habla como perrito ("¡Guau!", "olfatea otra vez") y nunca regaña.

## Mapa de la Ruta

*Actualizado el 27 oct 2026. El piloto rechazó un mapa oscuro de piedras (poco estético), una gráfica y un pipeline (demasiado fríos); quiere la sensación de un camino de juego sin copiar a Duolingo y con cara de datos.*

Pantalla principal. Camino de **arriba hacia abajo** sobre el fondo de la app con una cuadrícula de puntos. Paradas como **botones redondos con relieve** en violeta, con ícono de datos: `>_` lección, barras proyecto, ★ repaso; palomita menta al terminar; la que toca lleva **anillo ámbar** de avance y globo EMPEZAR/CONTINUAR; las bloqueadas, grises. Arriba, la tarjeta de la unidad (fija al bajar) con su avance y el botón **{ } FICHAS** (la chuleta de la unidad). Junto a cada parada alcanzada aparece una **gráfica** (barras, dispersión, pastel, línea) que se toca para repasar sus temas: tus datos crecen con el camino. Al final, una **base de datos** de premio con 50 XP que se abre una vez. **Hashy** empieza sentado junto a la parada que toca y recorre todo el mapa: se sienta, se duerme, juega con su pelota y camina a otro lugar cuando tiene un tip (ladra y prende un **foco**; al tocarlo lo ves). Abajo, las unidades que vienen. Maqueta en `docs/maquetas/hashy-y-camino.html`.

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

Sintetizados con Web Audio, sin archivos (`app/src/lib/sonidos.ts`): un "tic" suave en cada botón, un arpegio corto al acertar, un "ayyy" que cae con vibrato al equivocarse, una fanfarria al terminar la lección o abrir el premio y una moneda al comprar en el clóset. Hashy tiene los suyos: "¡guau, guau!" cuando llega a dar un tip, un destello cuando prende el foco, un "pop" al abrir el tip, un bostezo al dormirse y un "boing" al jugar con la pelota (solo suenan si estás viendo la app). En el iPhone respetan el interruptor de silencio, y se pueden apagar con el botón 🔊 del mapa o de la lección.

**Tips de Hashy:** se mezclan los de la unidad (`tips_hashy` en `conceptos.yaml`; con `desde: <parada>` solo salen después de terminarla), los generales de `contenido/hashy-tips.yaml` (estudio, mundo de datos, ánimo) y un repaso rápido de cada ficha ya vista. No se repiten hasta que salen todos.
