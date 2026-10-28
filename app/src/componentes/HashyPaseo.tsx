import { useEffect, useRef, useState } from 'react';
import { HASHY, LINEA_HASHY } from '../lib/personajes';

// Hashy de perfil caminando por el mapa. Se pasea junto a la parada que toca,
// se detiene, ladra y prende un foco: al tocarlo, enseña un tip.
// La animación mueve el DOM directo (sin re-render por cuadro) y respeta "reducir movimiento".

interface Props {
  x: number;           // dónde se para (px, centro de las patas)
  y: number;
  mira: 1 | -1;        // 1 = hacia la derecha
  tips: string[];
}

const { gris, grisOscuro, crema, collar } = HASHY;
const L = LINEA_HASHY;

// Pata con muslo redondeado: se balancea desde la cadera (0,0)
const pata = (color: string) =>
  `<path d="M-3.2 -1 C-3.8 5 -3 10 -2.6 13 L2.4 13 C2.8 9 3.4 4 3 -1 Z" fill="${color}" ${L}/>` +
  `<ellipse cx="0.6" cy="13.4" rx="3.6" ry="2" fill="${color}" ${L}/>`;

const SVG = `
<g data-p="cuerpo">
  <g data-p="cola" transform="translate(-16 -9)"><path d="M0 1 C-4 -3 -6 -9 -4 -14 C-2 -15 0 -14 0 -12 C-1 -8 1 -3 4 0 Z" fill="${gris}" ${L}/></g>
  <g data-p="pataLejosAtras" transform="translate(-11 2)">${pata(grisOscuro)}</g>
  <g data-p="pataLejosFrente" transform="translate(10 2)">${pata(grisOscuro)}</g>
  <path d="M-18 -5 C-18 -11 -13 -13 -5 -13 L8 -13 C14 -13 18 -10 18 -4 C18 2 14 5 8 5 L-12 5 C-16 5 -18 1 -18 -5 Z" fill="${gris}" ${L}/>
  <path d="M-13 2 L-10.5 7.5 L-8 3.5 L-5.5 8 L-3 3.5 L-0.5 8 L2 3.5 L4.5 8 L7 3.5 L9.5 7 L12 2 Z" fill="${crema}" ${L}/>
  <g data-p="pataCercaAtras" transform="translate(-7 2)">${pata('#E9DFCB')}</g>
  <g data-p="pataCercaFrente" transform="translate(13 2)">${pata('#E9DFCB')}</g>
  <g data-p="cabeza">
    <path d="M9 -11 C8 -22 12 -33 19 -35 C24 -36 28 -34 30 -31 L39 -30.5 C42 -30 43 -27 42 -24 L40 -20 L28 -19 C24 -14 18 -9 10 -6 Z" fill="${gris}" ${L}/>
    <path d="M15 -32 C16 -39 22 -40 24 -36 C23 -32 21 -29 18 -27 Z" fill="${grisOscuro}" ${L}/>
    <circle cx="26" cy="-28.4" r="2" fill="#1C1C24"/><circle cx="26.7" cy="-29.1" r=".7" fill="#fff"/>
    <path d="M20 -32 C24 -37.5 30 -35.5 33.5 -30.5 L31.5 -29.5 L29.5 -31.5 L27.5 -28.5 L25 -31.5 L22.5 -29.5 Z" fill="${crema}" ${L}/>
    <path d="M27 -24 L43 -23.5 C43.5 -18 41.5 -14 38.5 -11.5 L36.5 -15 L34.5 -8.5 L31.5 -14 L29 -8.5 L27 -14 L25 -10.5 C24.5 -15.5 25 -20 27 -24 Z" fill="${crema}" ${L}/>
    <ellipse cx="41.4" cy="-28.6" rx="2.7" ry="2.3" fill="#1C1C24"/>
    <path d="M8 -12.5 L19 -16 L20.5 -11.5 L9.5 -8 Z" fill="${collar}" ${L}/>
  </g>
</g>`;

export function HashyPaseo({ x, y, mira, tips }: Props) {
  const raiz = useRef<SVGGElement>(null);
  const [foco, setFoco] = useState(false);
  const [guau, setGuau] = useState(false);
  const [tip, setTip] = useState<string | null>(null);
  const n = useRef(0);
  const reanudar = useRef<() => void>(() => undefined);

  useEffect(() => {
    const g = raiz.current;
    if (!g) return;
    g.querySelector('[data-p="giro"]')!.innerHTML = SVG;
    const parte = (p: string) => g.querySelector<SVGGElement>(`[data-p="${p}"]`)!;
    const partes = {
      cuerpo: parte('cuerpo'), cabeza: parte('cabeza'), cola: parte('cola'),
      la: parte('pataLejosAtras'), lf: parte('pataLejosFrente'), ca: parte('pataCercaAtras'), cf: parte('pataCercaFrente'),
    };
    const base = { la: [-11, 2], lf: [10, 2], ca: [-7, 2], cf: [13, 2] } as const;
    const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Recorrido: entra desde la orilla, se para junto a la parada, ladra; luego olfatea un poco y vuelve
    const lejos = 60 * -mira;    // la orilla queda del lado contrario a donde mira
    let px = quieto ? 0 : lejos;
    let destino = 0;
    let estado: 'camina' | 'ladra' | 'espera' | 'olfatea' = quieto ? 'espera' : 'camina';
    let t0 = 0;
    let antes = performance.now();
    let cuadro = 0;
    if (quieto) setFoco(true);

    reanudar.current = () => {
      if (quieto) return;
      estado = 'olfatea';
      destino = -mira * 34;
      t0 = performance.now();
    };

    function pose(t: number, andando: boolean) {
      const fase = t / 95;
      const a = andando ? Math.sin(fase) * 26 : 0;
      // Paso diagonal: delantera cerca + trasera lejos juntas, y al revés
      const rota = (k: keyof typeof base, ang: number) =>
        partes[k].setAttribute('transform', `translate(${base[k][0]} ${base[k][1]}) rotate(${ang})`);
      rota('cf', a); rota('la', a); rota('ca', -a); rota('lf', -a);
      const brinco = andando ? -Math.abs(Math.cos(fase)) * 1.6 : 0;
      partes.cuerpo.setAttribute('transform', `translate(0 ${brinco})`);
      partes.cabeza.setAttribute('transform', `rotate(${andando ? Math.sin(fase * 2) * 2.5 : Math.sin(t / 700) * 2} 12 -10)`);
      partes.cola.setAttribute('transform', `translate(-16 -9) rotate(${Math.sin(t / (andando ? 110 : 160)) * 20})`);
    }

    function paso(t: number) {
      const dt = Math.min(50, t - antes);
      antes = t;
      if (estado === 'camina' || estado === 'olfatea') {
        const dir = Math.sign(destino - px);
        px += dir * Math.min(Math.abs(destino - px), 0.05 * dt);
        g!.querySelector('[data-p="giro"]')!.setAttribute('transform', `scale(${dir === 0 ? mira : dir} 1)`);
        pose(t, true);
        if (Math.abs(destino - px) < 0.5) {
          if (estado === 'camina') { estado = 'ladra'; t0 = t; setGuau(true); }
          else if (destino !== 0) { destino = 0; }
          else { estado = 'ladra'; t0 = t; setGuau(true); }
        }
      } else if (estado === 'ladra') {
        g!.querySelector('[data-p="giro"]')!.setAttribute('transform', `scale(${mira} 1)`);
        const d = t - t0;
        pose(t, false);
        partes.cabeza.setAttribute('transform', `rotate(${d < 700 ? -8 - Math.abs(Math.sin(d / 70)) * 6 : 0} 12 -10)`);
        if (d > 1200) { setGuau(false); setFoco(true); estado = 'espera'; }
      } else {
        pose(t, false);
      }
      g!.setAttribute('transform', `translate(${x + px} ${y})`);
      cuadro = requestAnimationFrame(paso);
    }
    cuadro = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(cuadro);
  }, [x, y, mira]);

  function tocarFoco() {
    if (!tips.length) return;
    setTip(tips[n.current % tips.length]);
    n.current++;
    setFoco(false);
  }
  function cerrarTip() {
    setTip(null);
    reanudar.current();
  }

  return (
    <>
      <svg className="hashy-paseo" aria-hidden={!foco}>
        <g ref={raiz}>
          <g data-p="giro" />
          {guau && (
            <g className="hashy-guau">
              <rect x="-22" y="-62" width="48" height="20" rx="10" fill="#fff" stroke="#2A2838" strokeWidth="1.5" />
              <text x="2" y="-48" fontSize="11" textAnchor="middle" fill="#2A2838">¡Guau!</text>
            </g>
          )}
          {foco && (
            <g className="hashy-foco" onClick={tocarFoco} role="button" aria-label="Ver el tip de Hashy">
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
