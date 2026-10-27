# Camino a App Store (diciembre 2026)

*Creado el 27 oct 2026*

## Lo que buscamos

Una app propia para iPhone que guarde toda la ruta (lecciones, ejercicios, avance) y que esté en App Store en **diciembre de 2026**. De aquí a entonces, Diego la usa a diario como piloto para probar todo el funcionamiento.

## Cómo encaja con el plan maestro

El plan original ponía App Store en el mes 6 con Expo o SwiftUI. Para llegar a diciembre se comprime el camino **sin reescribir la app**:

- La PWA se construye con Vite + React (en `app/`). Es una página estática: no necesita servidor.
- Para App Store se envuelve ese mismo código con **Capacitor**, que lo convierte en una app nativa de iOS.
- El Gate 1 del plan ("4 semanas de uso diario sin fallas") cabe justo: de finales de octubre a inicios de diciembre.

## Calendario propuesto

| Semanas | Qué se hace | Cómo lo pruebas tú |
| --- | --- | --- |
| 27 oct – 2 nov | Prototipo PWA: Hoy, Lección, editor SQL, ejercicios auto-evaluados, quiz, racha ✅ | En tu iPhone desde una URL HTTPS: Safari → Compartir → "Agregar a inicio" |
| 3 – 16 nov | Capacitor + recordatorio diario (notificación local) + contenido remoto con caché (corregir lecciones sin publicar la app) + Semanas 2–3 de SQL | PWA a diario; anotas lo que no quedó claro |
| 17 – 23 nov | Build de iOS, TestFlight, pantallas de App Store, política de privacidad | La app "de verdad" en tu iPhone vía TestFlight |
| 24 – 30 nov | Ajustes del piloto, Semanas 4–5 de SQL | TestFlight |
| 1 – 12 dic | Envío a revisión de Apple (suele tardar 1–3 días; deja margen por si la rechazan) | — |

## Requisitos de Apple

- **Apple Developer Program:** 99 USD al año, a nombre tuyo (persona física). Sin esto no hay TestFlight ni App Store. Conviene darse de alta ya: la aprobación puede tardar días.
- **Una Mac con Xcode** para compilar y subir la app. Trabajas en Windows, así que hay tres opciones: una Mac propia o prestada, un servicio en la nube (Codemagic, Ionic Appflow) o GitHub Actions con máquinas macOS.
- **Ficha de la tienda:** ícono de 1024 px (ya se genera en `app/public/icono-1024.png`), capturas de iPhone, descripción, URL de soporte y **URL de política de privacidad**.
- **Privacidad:** mientras el avance viva solo en el teléfono, la app no recolecta datos; eso simplifica el cuestionario de privacidad.

## Riesgos a cuidar

1. **Funcionalidad mínima (guía 4.2 de Apple).** Apple rechaza apps que son "solo una página web empaquetada". Lo que nos protege: funciona sin conexión, editor SQL en el dispositivo, ejercicios que se califican solos, y el recordatorio diario con notificación nativa.
2. **App incompleta (guía 2.1).** Con una sola semana de contenido la app se ve vacía. La ruta crítica es el **contenido**: lo ideal es enviar con el M2 de SQL completo (5 semanas).
3. **Corregir lecciones sin publicar.** En la PWA basta con volver a publicar la página. En la app nativa el contenido debe descargarse de internet y guardarse en caché; está en el calendario de noviembre.
4. **Avance solo en el teléfono.** Si borras la app, pierdes el avance. Para el piloto está bien; para otros usuarios se resuelve con cuentas (Fase 2, Supabase).

## Dónde vive la PWA mientras tanto

- **Hoy (27 oct):** repositorio **público** en GitHub con **GitHub Pages**. Cada push a `main` corre `.github/workflows/publicar-pwa.yml`: verifica los ejercicios contra el dataset, compila y publica. La URL es https://diegoavilaj1704-ux.github.io/ruta-datos/ (repo: https://github.com/diegoavilaj1704-ux/ruta-datos).
- **Después: GitHub Pro (4 USD/mes)** para hacer el repositorio privado sin perder Pages. Conviene antes de abrir la app a otras personas o de que el contenido crezca.

**Cómo migrar a Pro (sin tocar código):**

1. En GitHub: Settings → Billing and plans → cambiar a **Pro**.
2. En el repo: Settings → General → Danger Zone → **Change visibility → Private**.
3. Revisa Settings → Pages: debe seguir en "GitHub Actions" y con la misma URL.

Ojo: con el repo privado, la **página** de Pages sigue siendo pública (cualquiera con la URL la abre); lo privado es el código y el contenido fuente. Restringir quién ve la página requiere GitHub Enterprise, o mover la publicación a TestFlight en noviembre.
