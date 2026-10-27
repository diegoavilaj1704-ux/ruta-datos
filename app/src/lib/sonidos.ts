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
  // Fanfarria al terminar la lección
  fin: () => sonar((c) => {
    [523, 659, 784, 1047].forEach((f, i) => nota(c, f, i * 0.11, i === 3 ? 0.6 : 0.2));
  }),
};
