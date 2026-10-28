import { useEffect, useRef, useState } from 'react';
import { HASHY, LINEA_HASHY } from '../lib/personajes';
import { sonidos } from '../lib/sonidos';

// Hashy vive en el mapa: a ratos se sienta, se duerme o juega con su pelota.
// Cuando tiene un tip, camina a otro lugar del mapa, ladra y prende un foco: al tocarlo, lo enseña.
// También se le puede tocar para despertarlo. La animación mueve el DOM directo
// (sin re-render por cuadro) y respeta "reducir movimiento".

export interface Lugar { x: number; y: number }

interface Props {
  lugares: Lugar[];    // dónde puede estar (px dentro del camino); el primero es junto a la parada que toca
  tips: string[];
}

const { gris, grisOscuro, crema, collar } = HASHY;
const L = LINEA_HASHY;
const PATA_CLARA = '#E9DFCB';

// Pata con muslo redondeado: se balancea desde la cadera (0,0)
const pata = (color: string) =>
  `<path d="M-3.2 -1 C-3.8 5 -3 10 -2.6 13 L2.4 13 C2.8 9 3.4 4 3 -1 Z" fill="${color}" ${L}/>` +
  `<ellipse cx="0.6" cy="13.4" rx="3.6" ry="2" fill="${color}" ${L}/>`;

// Cabeza de perfil mirando a la derecha; el cuello queda cerca de (10, -10)
const cabeza = (dormido = false) => `
  <path d="M9 -11 C8 -22 12 -33 19 -35 C24 -36 28 -34 30 -31 L39 -30.5 C42 -30 43 -27 42 -24 L40 -20 L28 -19 C24 -14 18 -9 10 -6 Z" fill="${gris}" ${L}/>
  <path d="M15 -32 C16 -39 22 -40 24 -36 C23 -32 21 -29 18 -27 Z" fill="${grisOscuro}" ${L}/>
  ${dormido
    ? `<path d="M23.5 -28.5 Q26 -26.5 28.5 -28.5" stroke="#1C1C24" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
    : `<circle cx="26" cy="-28.4" r="2" fill="#1C1C24"/><circle cx="26.7" cy="-29.1" r=".7" fill="#fff"/>`}
  <path d="M20 -32 C24 -37.5 30 -35.5 33.5 -30.5 L31.5 -29.5 L29.5 -31.5 L27.5 -28.5 L25 -31.5 L22.5 -29.5 Z" fill="${crema}" ${L}/>
  <path d="M27 -24 L43 -23.5 C43.5 -18 41.5 -14 38.5 -11.5 L36.5 -15 L34.5 -8.5 L31.5 -14 L29 -8.5 L27 -14 L25 -10.5 C24.5 -15.5 25 -20 27 -24 Z" fill="${crema}" ${L}/>
  <ellipse cx="41.4" cy="-28.6" rx="2.7" ry="2.3" fill="#1C1C24"/>
  <path d="M8 -12.5 L19 -16 L20.5 -11.5 L9.5 -8 Z" fill="${collar}" ${L}/>`;

// De pie (para caminar y jugar): las piezas con data-p se animan
const DE_PIE = `
<g data-p="cuerpo">
  <g data-p="cola" transform="translate(-16 -9)"><path d="M0 1 C-4 -3 -6 -9 -4 -14 C-2 -15 0 -14 0 -12 C-1 -8 1 -3 4 0 Z" fill="${gris}" ${L}/></g>
  <g data-p="la" transform="translate(-11 2)">${pata(grisOscuro)}</g>
  <g data-p="lf" transform="translate(10 2)">${pata(grisOscuro)}</g>
  <path d="M-18 -5 C-18 -11 -13 -13 -5 -13 L8 -13 C14 -13 18 -10 18 -4 C18 2 14 5 8 5 L-12 5 C-16 5 -18 1 -18 -5 Z" fill="${gris}" ${L}/>
  <path d="M-13 2 L-10.5 7.5 L-8 3.5 L-5.5 8 L-3 3.5 L-0.5 8 L2 3.5 L4.5 8 L7 3.5 L9.5 7 L12 2 Z" fill="${crema}" ${L}/>
  <g data-p="ca" transform="translate(-7 2)">${pata(PATA_CLARA)}</g>
  <g data-p="cf" transform="translate(13 2)">${pata(PATA_CLARA)}</g>
  <g data-p="cabeza">${cabeza()}</g>
</g>`;

const SENTADO = `
<g data-p="cuerpo">
  <g data-p="cola" transform="translate(-15 11)"><path d="M0 2 C-6 2 -9 -1 -9 -5 C-7 -6 -6 -3 -1 -2 Z" fill="${gris}" ${L}/></g>
  <ellipse cx="-6" cy="7" rx="11" ry="8.5" fill="${gris}" ${L}/>
  <path d="M-11 7 C-11 -4 -3 -14 6 -17 L14 -16 C17 -8 16 4 13 13 L1 13 Z" fill="${gris}" ${L}/>
  <ellipse cx="1" cy="14.2" rx="5" ry="2.2" fill="${PATA_CLARA}" ${L}/>
  <g transform="translate(8 1)">${pata(PATA_CLARA)}</g>
  <g transform="translate(12.5 1)">${pata(PATA_CLARA)}</g>
  <g data-p="cabeza"><g transform="translate(-1 -8)">${cabeza()}</g></g>
</g>`;

const DORMIDO = `
<g data-p="cuerpo">
  <path d="M-19 10 C-25 9 -25 3 -21 2 C-20 4 -20 7 -17 8 Z" fill="${gris}" ${L}/>
  <path d="M-20 9 C-20 1 -12 -3 0 -3 L10 -3 C17 -3 19 4 18 10 C17 14 12 15 8 15 L-15 15 C-19 15 -20 12 -20 9 Z" fill="${gris}" ${L}/>
  <path d="M-14 13 L-11 16 L-8 13 L-5 16 L-2 13 L1 16 L4 13 Z" fill="${crema}" ${L}/>
  <ellipse cx="21" cy="13.6" rx="6" ry="2.4" fill="${PATA_CLARA}" ${L}/>
  <g data-p="cabeza"><g transform="translate(5 14) rotate(9 12 -10)">${cabeza(true)}</g></g>
</g>`;

type Pose = 'pie' | 'sentado' | 'dormido';
type Estado = 'sentado' | 'dormido' | 'juega' | 'camina' | 'ladra' | 'espera';
// Elige un tip que no hayas visto; cuando ya salieron todos, vuelve a empezar.
// Los vistos se recuerdan en este dispositivo para que no se repitan al abrir la app.
const VISTOS = 'ruta-datos:tips-vistos';
function elegirTip(tips: string[], anterior: string | null): string {
  let vistos: string[] = [];
  try { vistos = JSON.parse(localStorage.getItem(VISTOS) ?? '[]'); } catch { /* sin memoria: igual funciona */ }
  let quedan = tips.filter((t) => !vistos.includes(t));
  if (!quedan.length) {
    vistos = [];
    quedan = tips.length > 1 ? tips.filter((t) => t !== anterior) : tips;
  }
  const tip = quedan[Math.floor(Math.random() * quedan.length)];
  try { localStorage.setItem(VISTOS, JSON.stringify([...vistos, tip].filter((t) => tips.includes(t)))); } catch { /* idem */ }
  return tip;
}

// Los sonidos de Hashy solo suenan si estás viendo la app
const sonar = (fn: () => void) => { if (document.visibilityState === 'visible') fn(); };

const DURA: Record<'sentado' | 'dormido' | 'juega', number> = { sentado: 7000, dormido: 12000, juega: 8000 };

export function HashyPaseo({ lugares, tips }: Props) {
  const raiz = useRef<SVGGElement>(null);
  const [foco, setFoco] = useState(false);
  const [guau, setGuau] = useState(false);
  const [zzz, setZzz] = useState(false);
  const [tip, setTip] = useState<string | null>(null);
  const anterior = useRef<string | null>(null);
  const ordenes = useRef({ despertar: () => undefined as void, trasTip: () => undefined as void });
  const claveLugares = lugares.map((l) => `${Math.round(l.x)},${Math.round(l.y)}`).join(' ');

  useEffect(() => {
    const g = raiz.current;
    if (!g || !lugares.length) return;
    const giro = g.querySelector<SVGGElement>('[data-p="giro"]')!;
    const pelota = g.querySelector<SVGGElement>('[data-p="pelota"]')!;
    const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;

    let pose: Pose | null = null;
    let partes: Record<string, SVGGElement | null> = {};
    function ponerPose(p: Pose) {
      if (pose === p) return;
      pose = p;
      giro.innerHTML = p === 'pie' ? DE_PIE : p === 'sentado' ? SENTADO : DORMIDO;
      const q = (k: string) => giro.querySelector<SVGGElement>(`[data-p="${k}"]`);
      partes = { cuerpo: q('cuerpo'), cabeza: q('cabeza'), cola: q('cola'), la: q('la'), lf: q('lf'), ca: q('ca'), cf: q('cf') };
    }
    const base: Record<string, [number, number]> = { la: [-11, 2], lf: [10, 2], ca: [-7, 2], cf: [13, 2] };
    const rota = (k: string, ang: number) =>
      partes[k]?.setAttribute('transform', `translate(${base[k][0]} ${base[k][1]}) rotate(${ang})`);
    const colaBase = () => (pose === 'sentado' ? 'translate(-15 11)' : 'translate(-16 -9)');

    let pos = { ...lugares[0] };
    let destino = pos;
    let mira = 1;
    let estado: Estado = quieto ? 'espera' : 'sentado';
    let desde = performance.now();
    let antes = desde;
    let cuadro = 0;
    let ultimoLugar = 0;

    function cambiar(e: Estado, t = performance.now()) {
      estado = e;
      desde = t;
      setZzz(e === 'dormido');
      pelota.style.display = e === 'juega' ? '' : 'none';
      if (e === 'ladra') { setGuau(true); sonar(sonidos.guau); }
      if (e === 'dormido') sonar(sonidos.bostezo);
      if (e === 'juega') sonar(sonidos.boing);
    }
    // Después de cada rato quieto, camina a otro lugar del mapa a darte un tip
    function irAOtroLugar() {
      let k = ultimoLugar;
      if (lugares.length > 1) while (k === ultimoLugar) k = Math.floor(Math.random() * lugares.length);
      ultimoLugar = k;
      destino = lugares[k];
      cambiar('camina');
    }
    function descansar() {
      const opciones: Estado[] = ['sentado', 'dormido', 'juega'];
      cambiar(opciones[Math.floor(Math.random() * opciones.length)]);
    }
    ordenes.current.despertar = () => {
      if (quieto || estado === 'camina' || estado === 'ladra' || estado === 'espera') return;
      cambiar('ladra');
    };
    ordenes.current.trasTip = () => {
      if (!quieto) descansar();
    };

    function paso(t: number) {
      const dt = Math.min(50, t - antes);
      antes = t;
      const d = t - desde;
      let x = pos.x, y = pos.y;

      if (estado === 'camina') {
        ponerPose('pie');
        const dx = destino.x - pos.x, dy = destino.y - pos.y;
        const dist = Math.hypot(dx, dy);
        const avance = Math.min(dist, 0.065 * dt);
        if (Math.abs(dx) > 1) mira = dx > 0 ? 1 : -1;
        if (dist > 0.5) { pos = { x: pos.x + (dx / dist) * avance, y: pos.y + (dy / dist) * avance }; x = pos.x; y = pos.y; }
        const fase = t / 95, a = Math.sin(fase) * 26;
        rota('cf', a); rota('la', a); rota('ca', -a); rota('lf', -a);
        partes.cuerpo?.setAttribute('transform', `translate(0 ${-Math.abs(Math.cos(fase)) * 1.6})`);
        partes.cabeza?.setAttribute('transform', `rotate(${Math.sin(fase * 2) * 2.5} 12 -10)`);
        partes.cola?.setAttribute('transform', `${colaBase()} rotate(${Math.sin(t / 110) * 20})`);
        if (dist <= 0.5) cambiar('ladra', t);
      } else if (estado === 'ladra') {
        ponerPose('pie');
        ['la', 'lf', 'ca', 'cf'].forEach((k) => rota(k, 0));
        partes.cuerpo?.setAttribute('transform', `translate(0 ${d < 700 ? -Math.abs(Math.sin(d / 70)) * 2 : 0})`);
        partes.cabeza?.setAttribute('transform', `rotate(${d < 700 ? -8 - Math.abs(Math.sin(d / 70)) * 6 : 0} 12 -10)`);
        partes.cola?.setAttribute('transform', `${colaBase()} rotate(${Math.sin(t / 90) * 24})`);
        if (d > 1200) { setGuau(false); setFoco(true); sonar(sonidos.foco); cambiar('espera', t); }
      } else if (estado === 'espera') {
        // Se sienta junto a su foco; si nadie lo toca en un rato, lo apaga y sigue con lo suyo
        ponerPose('sentado');
        partes.cabeza?.setAttribute('transform', `rotate(${Math.sin(t / 700) * 3} 10 -18)`);
        partes.cola?.setAttribute('transform', `${colaBase()} rotate(${Math.sin(t / 160) * 14})`);
        if (!quieto && d > 15000) { setFoco(false); descansar(); }
      } else if (estado === 'sentado') {
        ponerPose('sentado');
        partes.cabeza?.setAttribute('transform', `rotate(${Math.sin(t / 900) * 4} 10 -18)`);
        partes.cola?.setAttribute('transform', `${colaBase()} rotate(${Math.sin(t / 200) * 12})`);
        if (d > DURA.sentado) irAOtroLugar();
      } else if (estado === 'dormido') {
        ponerPose('dormido');
        const respira = 1 + Math.sin(t / 600) * 0.025;
        partes.cuerpo?.setAttribute('transform', `translate(0 15) scale(1 ${respira}) translate(0 -15)`);
        if (d > DURA.dormido) irAOtroLugar();
      } else if (estado === 'juega') {
        // Persigue su pelota: brinca, la sigue con la cabeza y mueve la cola rápido
        ponerPose('pie');
        const rebote = Math.abs(Math.sin(t / 260));
        const brinco = Math.abs(Math.sin(t / 260 + 1.2));
        ['la', 'lf'].forEach((k) => rota(k, -8)); ['ca', 'cf'].forEach((k) => rota(k, 8));
        partes.cuerpo?.setAttribute('transform', `translate(0 ${-brinco * 4})`);
        partes.cabeza?.setAttribute('transform', `rotate(${(1 - rebote) * 12 - 6} 12 -10)`);
        partes.cola?.setAttribute('transform', `${colaBase()} rotate(${Math.sin(t / 70) * 28})`);
        pelota.setAttribute('transform', `translate(${mira * (54 + Math.sin(t / 900) * 8)} ${11 - rebote * 26}) rotate(${t / 4})`);
        if (d > DURA.juega) irAOtroLugar();
      }

      giro.setAttribute('transform', `scale(${mira} 1)`);
      g!.setAttribute('transform', `translate(${x} ${y})`);
      cuadro = requestAnimationFrame(paso);
    }

    pelota.style.display = 'none';
    ponerPose('sentado');
    g.setAttribute('transform', `translate(${pos.x} ${pos.y})`);
    if (quieto) { setFoco(true); return; }
    cuadro = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(cuadro);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claveLugares]);

  function tocarFoco() {
    if (!tips.length) return;
    anterior.current = elegirTip(tips, anterior.current);
    setTip(anterior.current);
    sonidos.pop();
    setFoco(false);
  }
  function cerrarTip() {
    setTip(null);
    ordenes.current.trasTip();
  }

  return (
    <>
      <svg className="hashy-paseo" aria-hidden={!foco}>
        <g ref={raiz}>
          <g data-p="pelota">
            <circle r="6" fill="#FF6B5B" stroke="#2A2838" strokeWidth="1.5" />
            <path d="M-6 0 Q0 -4 6 0 M-6 0 Q0 4 6 0" stroke="#fff" strokeWidth="1.3" fill="none" />
          </g>
          <g data-p="giro" className="hashy-cuerpo" onClick={() => ordenes.current.despertar()} />
          {zzz && (
            <g className="hashy-zzz">
              <text x="26" y="-14" fontSize="10">z</text>
              <text x="33" y="-24" fontSize="13">z</text>
              <text x="41" y="-36" fontSize="16">Z</text>
            </g>
          )}
          {guau && (
            <g className="hashy-guau">
              <rect x="-22" y="-62" width="48" height="20" rx="10" fill="#fff" stroke="#2A2838" strokeWidth="1.5" />
              <text x="2" y="-48" fontSize="11" textAnchor="middle" fill="#2A2838">¡Guau!</text>
            </g>
          )}
          {foco && (
            <g className="hashy-foco" data-sin-toque onClick={tocarFoco} role="button" aria-label="Ver el tip de Hashy">
              <circle cx="4" cy="-62" r="22" fill="transparent" />
              <circle className="brillo" cx="4" cy="-62" r="17" fill="#FFD25A" opacity=".35" />
              <g className="brillo" stroke="#FFB020" strokeWidth="2.2" strokeLinecap="round">
                <line x1="4" y1="-89" x2="4" y2="-84" /><line x1="-14" y1="-80" x2="-10" y2="-76" /><line x1="22" y1="-80" x2="18" y2="-76" />
              </g>
              <circle cx="4" cy="-64" r="10" fill="#FFD25A" stroke="#E0A400" strokeWidth="1.5" />
              <rect x="-0.5" y="-55" width="9" height="7" rx="2" fill="#B9BDC6" stroke="#8A8F99" strokeWidth="1" />
              <path d="M1 -65 q3 4 6 0" stroke="#B07400" strokeWidth="1.6" fill="none" />
            </g>
          )}
        </g>
      </svg>
      {tip && (
        <div className="hashy-tip" role="status" onClick={cerrarTip}>
          <b>Tip de Hashy</b>
          <p>{tip}</p>
          <small>Toca para cerrar</small>
        </div>
      )}
    </>
  );
}

// Las poses sueltas, para vistas previas
export const POSES_HASHY = { pie: DE_PIE, sentado: SENTADO, dormido: DORMIDO };
