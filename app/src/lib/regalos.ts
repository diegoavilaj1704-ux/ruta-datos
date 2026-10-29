// Regalos de monedas del camino: aparecen después de cada 3 paradas de una unidad.
// Al abrir uno sale al azar más XP, una prenda del clóset gratis o doble XP en la siguiente parada.
import { CATALOGO, clavePrenda } from './armario';

export const CADA = 3;

export type Regalo =
  | { tipo: 'xp'; cantidad: number; titulo: string; texto: string }
  | { tipo: 'prenda'; clave: string; titulo: string; texto: string }
  | { tipo: 'doble'; titulo: string; texto: string };

// Posiciones de los regalos en una unidad de `n` paradas: después de la 3.ª, la 6.ª…
// (no se pone uno al final: ahí está el Banco de Datos)
export function regalosDeUnidad(n: number): number[] {
  const r: number[] = [];
  for (let k = CADA; k < n; k += CADA) r.push(k);
  return r;
}

export function elegirRegalo(comprados: string[], azar = Math.random): Regalo {
  const prendas = CATALOGO.filter((p) => p.precio > 0 && p.precio <= 90 && !comprados.includes(clavePrenda(p)));
  const opciones: Regalo[] = [
    { tipo: 'xp', cantidad: 30, titulo: '+30 XP', texto: 'Para gastar en tu clóset.' },
    { tipo: 'xp', cantidad: 60, titulo: '+60 XP', texto: '¡Te tocó el regalo grande!' },
    { tipo: 'doble', titulo: 'Doble XP', texto: 'La siguiente parada que termines te da el doble de XP.' },
  ];
  if (prendas.length) {
    const p = prendas[Math.floor(azar() * prendas.length)];
    opciones.push({ tipo: 'prenda', clave: clavePrenda(p), titulo: p.nombre, texto: 'Ya está en tu clóset, gratis. ¡Pruébatela!' });
  }
  return opciones[Math.floor(azar() * opciones.length)];
}
