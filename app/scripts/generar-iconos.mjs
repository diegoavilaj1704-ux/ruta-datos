// Genera los íconos PNG de la PWA sin dependencias (fondo + tabla estilizada).
// Uso: npm run iconos   → public/icono-192.png, icono-512.png, apple-touch-icon.png
import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const publico = resolve(dirname(fileURLToPath(import.meta.url)), '../public');

const FONDO = [15, 82, 87];
const CLARO = [246, 244, 239];
const ACENTO = [224, 137, 43];

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function bloque(tipo, datos) {
  const largo = Buffer.alloc(4);
  largo.writeUInt32BE(datos.length);
  const td = Buffer.concat([Buffer.from(tipo), datos]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([largo, td, crc]);
}

function icono(tam) {
  const px = (x, y) => {
    // Coordenadas normalizadas 0..1; el dibujo queda dentro de la zona segura (80 %)
    const u = x / tam, v = y / tam;
    const dentro = (x0, y0, x1, y1) => u >= x0 && u < x1 && v >= y0 && v < y1;
    if (dentro(0.24, 0.27, 0.76, 0.37)) return ACENTO;                // encabezado de la tabla
    for (const fila of [0.42, 0.54, 0.66]) {
      if (dentro(0.24, fila, 0.44, fila + 0.07)) return CLARO;        // columna 1
      if (dentro(0.48, fila, 0.76, fila + 0.07)) return CLARO;        // columna 2
    }
    return FONDO;
  };
  const crudo = Buffer.alloc((tam * 3 + 1) * tam);
  for (let y = 0; y < tam; y++) {
    crudo[y * (tam * 3 + 1)] = 0;
    for (let x = 0; x < tam; x++) {
      const [r, g, b] = px(x, y);
      const i = y * (tam * 3 + 1) + 1 + x * 3;
      crudo[i] = r; crudo[i + 1] = g; crudo[i + 2] = b;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(tam, 0);
  ihdr.writeUInt32BE(tam, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    bloque('IHDR', ihdr),
    bloque('IDAT', deflateSync(crudo)),
    bloque('IEND', Buffer.alloc(0)),
  ]);
}

writeFileSync(resolve(publico, 'icono-192.png'), icono(192));
writeFileSync(resolve(publico, 'icono-512.png'), icono(512));
writeFileSync(resolve(publico, 'apple-touch-icon.png'), icono(180));
writeFileSync(resolve(publico, 'icono-1024.png'), icono(1024)); // para App Store Connect
writeFileSync(
  resolve(publico, 'icono.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="#0f5257"/><rect x="24" y="27" width="52" height="10" fill="#e0892b"/>${[42, 54, 66].map((y) => `<rect x="24" y="${y}" width="20" height="7" fill="#f6f4ef"/><rect x="48" y="${y}" width="28" height="7" fill="#f6f4ef"/>`).join('')}</svg>`,
);
console.log('Íconos generados en public/');
