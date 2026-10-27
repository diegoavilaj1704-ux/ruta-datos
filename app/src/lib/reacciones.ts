// Las tarjetas avisan si acertaste o te equivocaste; la pantalla de historia
// escucha para mostrar a Hashy triste, y aquí mismo suena el efecto.
import { sonidos } from './sonidos';

export type Reaccion = 'acierto' | 'error';
const EVENTO = 'ruta-datos:reaccion';

export function reaccionar(tipo: Reaccion) {
  sonidos[tipo]();
  window.dispatchEvent(new CustomEvent<Reaccion>(EVENTO, { detail: tipo }));
}

export function escucharReacciones(fn: (tipo: Reaccion) => void): () => void {
  const manejador = (e: Event) => fn((e as CustomEvent<Reaccion>).detail);
  window.addEventListener(EVENTO, manejador);
  return () => window.removeEventListener(EVENTO, manejador);
}

// Lo que dice Hashy cuando te equivocas (se elige uno al azar)
export const FRASES_HASHY = [
  '¡Auuu! Casi lo tienes.',
  'Ay, ay… olfatea otra vez.',
  '¡Guau! No pasa nada, inténtalo de nuevo.',
  'Ayyy… revisa con calma.',
];
