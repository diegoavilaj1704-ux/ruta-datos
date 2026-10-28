// Sonidos sintetizados con Web Audio: sin archivos, funcionan sin conexión.
// En iPhone respetan el interruptor de silencio (sesión de audio "ambient").
import { progresoActual } from './progreso';

let ctx: AudioContext | null = null;

function contexto(): AudioContext | null {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

// iOS solo deja sonar audio después de un toque: se desbloquea en el primero
export function prepararSonido() {
  const nav = navigator as Navigator & { audioSession?: { type: string } };
  if (nav.audioSession) nav.audioSession.type = 'ambient';
  const desbloquear = () => {
    contexto();
    window.removeEventListener('pointerdown', desbloquear);
  };
  window.addEventListener('pointerdown', desbloquear);
  // Cada botón de la app hace "tic" al tocarlo (los que traen su propio sonido llevan data-sin-toque)
  window.addEventListener('pointerdown', (e) => {
    const el = (e.target as Element | null)?.closest?.('button, [role="button"], a');
    if (el && !el.closest('[data-sin-toque]') && !(el as HTMLButtonElement).disabled) sonidos.toque();
  }, true);
}

function nota(c: AudioContext, frec: number, inicio: number, dur: number, tipo: OscillatorType = 'triangle', vol = 0.18) {
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = tipo;
  osc.frequency.setValueAtTime(frec, c.currentTime + inicio);
  g.gain.setValueAtTime(0, c.currentTime + inicio);
  g.gain.linearRampToValueAtTime(vol, c.currentTime + inicio + 0.015);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + inicio + dur);
  osc.connect(g).connect(c.destination);
  osc.start(c.currentTime + inicio);
  osc.stop(c.currentTime + inicio + dur + 0.05);
  return osc;
}

// Un "guau" corto: tono que cae, pasado por un filtro para que suene a hocico y no a silbato
function ladrido(c: AudioContext, inicio: number, tono = 1) {
  const t = c.currentTime + inicio;
  const osc = c.createOscillator();
  const filtro = c.createBiquadFilter();
  const g = c.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(470 * tono, t);
  osc.frequency.exponentialRampToValueAtTime(230 * tono, t + 0.14);
  filtro.type = 'bandpass';
  filtro.frequency.setValueAtTime(1100, t);
  filtro.Q.value = 1.6;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.32, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.17);
  osc.connect(filtro).connect(g).connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.2);
}

function sonar(fn: (c: AudioContext) => void) {
  if (!progresoActual().sonido) return;
  const c = contexto();
  if (c) fn(c);
}

export const sonidos = {
  // Arpegio corto hacia arriba
  acierto: () => sonar((c) => {
    nota(c, 659, 0, 0.18);
    nota(c, 880, 0.09, 0.28);
  }),
  // "Ayyy": tono que cae con vibrato, como quejido de perrito
  error: () => sonar((c) => {
    const osc = nota(c, 620, 0, 0.6, 'sawtooth', 0.07);
    osc.frequency.exponentialRampToValueAtTime(260, c.currentTime + 0.55);
    const lfo = c.createOscillator();
    const prof = c.createGain();
    lfo.frequency.value = 9;
    prof.gain.value = 18;
    lfo.connect(prof).connect(osc.frequency);
    lfo.start();
    lfo.stop(c.currentTime + 0.65);
  }),
  // Tic suave al tocar cualquier botón
  toque: () => sonar((c) => {
    const osc = nota(c, 880, 0, 0.06, 'sine', 0.07);
    osc.frequency.exponentialRampToValueAtTime(520, c.currentTime + 0.05);
  }),
  // Hashy ladra al llegar a dar un tip: "¡guau, guau!"
  guau: () => sonar((c) => {
    ladrido(c, 0);
    ladrido(c, 0.2, 1.08);
  }),
  // El foco se prende: destello de tres notas agudas
  foco: () => sonar((c) => {
    [1319, 1760, 2637].forEach((f, i) => nota(c, f, i * 0.06, 0.22, 'sine', 0.06));
  }),
  // Se abre la burbuja del tip: "pop"
  pop: () => sonar((c) => {
    const osc = nota(c, 520, 0, 0.12, 'sine', 0.14);
    osc.frequency.exponentialRampToValueAtTime(1040, c.currentTime + 0.08);
  }),
  // Hashy se pone a jugar con su pelota: "boing"
  boing: () => sonar((c) => {
    const osc = nota(c, 200, 0, 0.35, 'sine', 0.12);
    osc.frequency.exponentialRampToValueAtTime(560, c.currentTime + 0.12);
    osc.frequency.exponentialRampToValueAtTime(300, c.currentTime + 0.3);
  }),
  // Hashy se duerme: bostezo que baja
  bostezo: () => sonar((c) => {
    const osc = nota(c, 520, 0, 0.7, 'triangle', 0.06);
    osc.frequency.exponentialRampToValueAtTime(240, c.currentTime + 0.65);
  }),
  // Gastar o ganar XP: moneda
  moneda: () => sonar((c) => {
    nota(c, 988, 0, 0.09, 'square', 0.05);
    nota(c, 1319, 0.08, 0.35, 'square', 0.05);
  }),
  // Fanfarria al terminar la lección
  fin: () => sonar((c) => {
    [523, 659, 784, 1047].forEach((f, i) => nota(c, f, i * 0.11, i === 3 ? 0.6 : 0.2));
  }),
};
