// Dibujo del mapa como una calle del barrio (maqueta aprobada: docs/maquetas/mapa-barrio.html).
// Cada parada es un negocio en 3D isométrico con un objeto gigante en el techo; al final está el
// Banco de Datos y en el camino hay montones de monedas de regalo. Todo se dibuja en un lienzo de
// 390 de ancho y se escala al ancho de la pantalla. Lo que se toca (paradas, regalo, banco) son
// botones de React encima; aquí solo va el dibujo.

export const ANCHO = 390;
const L = '#1F1A22';
const ln = `stroke="${L}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"`;

export type EstadoLugar = 'hecha' | 'actual' | 'bloqueada';
export type EstadoPremio = 'cerrado' | 'listo' | 'abierto';

// ---------- Color, degradados e isométrico ----------

function tono(hex: string, f: number): string {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(f >= 1 ? v + (255 - v) * (f - 1) : v * f))));
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
}

// Los degradados se juntan en <defs> mientras se dibuja la escena
let defs = '';
let nGrad = 0;
let prefijo = 'b';
function grad(c1: string, c2: string, x2 = 0, y2 = 1): string {
  const id = `${prefijo}g${nGrad++}`;
  defs += `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`;
  return `url(#${id})`;
}
function radial(c1: string, c2: string): string {
  const id = `${prefijo}g${nGrad++}`;
  defs += `<radialGradient id="${id}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient>`;
  return `url(#${id})`;
}

type Pt = [number, number];
// gx hacia abajo-derecha, gy hacia abajo-izquierda, gz hacia arriba
const P = (gx: number, gy: number, gz: number): Pt => [(gx - gy) * 0.866, (gx + gy) * 0.5 - gz];
const pts = (ps: Pt[]) => ps.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
const poli = (ps: Pt[], fill: string, extra = '') => `<polygon points="${pts(ps)}" fill="${fill}" ${extra}/>`;

function caja(x: number, y: number, z: number, w: number, d: number, h: number, color: string): string {
  const e = 'stroke="rgba(40,30,50,.35)" stroke-width="1" stroke-linejoin="round"';
  const izq: Pt[] = [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)];
  const der: Pt[] = [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)];
  const arr: Pt[] = [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)];
  return poli(izq, grad(tono(color, 1.06), tono(color, 0.9)), e) + poli(der, grad(tono(color, 0.78), tono(color, 0.66)), e) + poli(arr, tono(color, 1.18), e);
}
const enIzq = (d: number, u0: number, v0: number, u1: number, v1: number, fill: string, extra = '') =>
  poli([P(u0, d, v0), P(u1, d, v0), P(u1, d, v1), P(u0, d, v1)], fill, extra);
const enDer = (w: number, t0: number, v0: number, t1: number, v1: number, fill: string) =>
  poli([P(w, t0, v0), P(w, t1, v0), P(w, t1, v1), P(w, t0, v1)], fill);
function textoIzq(d: number, u: number, v: number, txt: string, tam: number, color: string): string {
  const [x, y] = P(u, d, v);
  return `<text transform="matrix(0.866 0.5 0 1 ${x.toFixed(1)} ${y.toFixed(1)})" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="900" font-size="${tam}" fill="${color}">${txt}</text>`;
}

// ---------- Partes de los negocios ----------

function ventanaIzq(d: number, u0: number, v0: number, u1: number, v1: number): string {
  return enIzq(d, u0 - 1.5, v0 - 1.5, u1 + 1.5, v1 + 1.5, '#FFFFFF') + enIzq(d, u0, v0, u1, v1, grad('#CFF1FF', '#7CC3E8')) +
    poli([P(u0 + 2, d, v1 - 2), P(u0 + 6, d, v1 - 2), P(u0 + 2 + (v1 - v0) * 0.1, d, v0 + 3)], 'rgba(255,255,255,.65)');
}
function ventanaDer(w: number, t0: number, v0: number, t1: number, v1: number): string {
  return enDer(w, t0 - 1.5, v0 - 1.5, t1 + 1.5, v1 + 1.5, '#F4F0E8') + enDer(w, t0, v0, t1, v1, grad('#A9D8EE', '#5E9CC4'));
}
function toldoIzq(d: number, u0: number, u1: number, v: number, colores: [string, string]): string {
  const franjas = 7, paso = (u1 - u0) / franjas, fondo = 9, caida = 9;
  let s = '';
  for (let i = 0; i < franjas; i++) {
    const a = u0 + i * paso, b = a + paso, c = colores[i % 2];
    s += poli([P(a, d, v), P(b, d, v), P(b, d + fondo, v - caida), P(a, d + fondo, v - caida)], c, 'stroke="rgba(40,30,50,.3)" stroke-width=".8"');
    const [x1, y1] = P(a, d + fondo, v - caida), [x2, y2] = P(b, d + fondo, v - caida);
    s += `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} Q${((x1 + x2) / 2).toFixed(1)} ${((y1 + y2) / 2 + 6).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="${c}" stroke="rgba(40,30,50,.3)" stroke-width=".8"/>`;
  }
  return s;
}
function letreroIzq(d: number, u0: number, u1: number, v0: number, v1: number, texto: string, fondo: string, color: string, tam = 7.5): string {
  return enIzq(d, u0, v0, u1, v1, fondo, 'stroke="rgba(40,30,50,.45)" stroke-width="1"') + textoIzq(d, (u0 + u1) / 2, v0 + (v1 - v0) * 0.28, texto, tam, color);
}
function puertaIzq(d: number, u0: number, u1: number, alto: number, color: string): string {
  return enIzq(d, u0 - 1.5, 0, u1 + 1.5, alto + 1.5, '#F4F0E8') + enIzq(d, u0, 0, u1, alto, grad(tono(color, 1.1), tono(color, 0.8))) +
    enIzq(d, u0 + 2, alto * 0.45, u1 - 2, alto - 2, 'rgba(190,230,250,.75)');
}

// Objetos gigantes del techo (centrados en su punto de apoyo)
const PROPS: Record<string, () => string> = {
  tienda: () => `<path d="M-20 -6 L20 -6 L16 -44 L-16 -44 Z" fill="${grad('#E8C690', '#C69A5C')}" stroke="#8A6236" stroke-width="1.4"/>
    <path d="M-16 -44 L16 -44 L13 -50 L-13 -50 Z" fill="#D9B27A" stroke="#8A6236" stroke-width="1.2"/>
    <path d="M-8 -50 Q-14 -72 -4 -70 Q2 -66 -2 -50 Z" fill="${grad('#7ED08A', '#3E9E52')}"/>
    <rect x="2" y="-74" width="7" height="30" rx="3.5" transform="rotate(18 5 -60)" fill="${grad('#F0C27A', '#C98E3E')}"/>
    <circle cx="-10" cy="-48" r="8" fill="${radial('#FF8A80', '#D32F2F')}"/><path d="M-10 -56 q2 -4 5 -4" stroke="#3E7A2E" stroke-width="2" fill="none"/>
    <circle cx="11" cy="-47" r="6.5" fill="${radial('#FFE082', '#F9A825')}"/>
    <text x="0" y="-20" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="900" font-size="10" fill="#8A4A1E">ABARROTES</text>`,
  cafe: () => `<ellipse cx="0" cy="-4" rx="30" ry="9" fill="${grad('#FFFFFF', '#D8D2C8')}" stroke="#A89F92" stroke-width="1.2"/>
    <path d="M-20 -46 L20 -46 L16 -10 Q0 -2 -16 -10 Z" fill="${grad('#FFFFFF', '#E3DDD2', 1, 0)}" stroke="#A89F92" stroke-width="1.4"/>
    <path d="M19 -38 Q34 -36 30 -24 Q27 -16 17 -18" fill="none" stroke="#E3DDD2" stroke-width="5"/>
    <ellipse cx="0" cy="-46" rx="20" ry="6" fill="${radial('#A0673A', '#5A3418')}" stroke="#A89F92" stroke-width="1.2"/>
    <rect x="-12" y="-34" width="24" height="12" rx="3" fill="#6C4CF1"/><text x="0" y="-25" text-anchor="middle" font-family="monospace" font-weight="700" font-size="8" fill="#fff">byte</text>
    <g fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><path class="b-vapor" d="M-8 -56 q-5 -8 0 -14 q5 -6 0 -12"/><path class="b-vapor" style="animation-delay:.8s" d="M6 -56 q-5 -8 0 -14 q5 -6 0 -12"/></g>`,
  fonda: () => `<ellipse cx="0" cy="-6" rx="30" ry="9" fill="${grad('#FFFFFF', '#D8D2C8')}" stroke="#B5ADA0" stroke-width="1.2"/>
    <path d="M-26 -12 A26 26 0 0 1 26 -12 Z" fill="${grad('#FFE08A', '#E9A93A')}" stroke="#B9782A" stroke-width="1.4"/>
    <path d="M-22 -14 Q-16 -30 -6 -34 Q2 -40 10 -34 Q20 -30 22 -14" fill="none" stroke="#5DBB4E" stroke-width="7" stroke-linecap="round"/>
    ${[[-12, -26], [0, -32], [12, -26], [-4, -22], [8, -20]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.4" fill="#E53935"/>`).join('')}
    <g transform="translate(26 -40) rotate(20)"><rect x="-1.5" y="0" width="3" height="26" rx="1.5" fill="#B0B6BE"/><path d="M-5 0 v-10 M0 0 v-10 M5 0 v-10 M-5 0 h10" stroke="#B0B6BE" stroke-width="2"/></g>`,
  peluqueria: () => `<g transform="rotate(-20)">
      <path d="M-3 -10 L30 -58 L34 -54 L4 -8 Z" fill="${grad('#F5F7FA', '#9AA3AE', 1, 0)}" stroke="#6E7781" stroke-width="1.2"/>
      <path d="M3 -10 L-30 -58 L-34 -54 L-4 -8 Z" fill="${grad('#E3E7EC', '#8A939E', 1, 0)}" stroke="#6E7781" stroke-width="1.2"/>
      <circle cx="0" cy="-12" r="3.4" fill="#5B6470"/>
      <circle cx="-9" cy="4" r="9" fill="none" stroke="#E2453C" stroke-width="5"/><circle cx="9" cy="4" r="9" fill="none" stroke="#E2453C" stroke-width="5"/></g>`,
  papeleria: () => `<path d="M-26 -8 L8 -2 L26 -14 L-8 -20 Z" fill="${grad('#FFFFFF', '#E6E1F7')}" stroke="#9A93B8" stroke-width="1.2"/>
    <path d="M-26 -8 L8 -2 L8 2 L-26 -4 Z" fill="#6C4CF1"/>
    <g transform="rotate(38 0 -40)">
      <rect x="-6" y="-70" width="12" height="44" fill="${grad('#FFD54F', '#F2A61A', 1, 0)}" stroke="#B9781A" stroke-width="1.2"/>
      <rect x="-6" y="-80" width="12" height="10" rx="3" fill="#FF8FB1" stroke="#C0577A" stroke-width="1.2"/><rect x="-6" y="-72" width="12" height="3" fill="#C9CDD2"/>
      <path d="M-6 -26 L0 -12 L6 -26 Z" fill="#F4D6B0" stroke="#B9781A" stroke-width="1.2"/><path d="M-2 -17 L0 -12 L2 -17 Z" fill="#3A3658"/></g>`,
  banco: () => monedas(),
};

// Montón de monedas: el techo del banco y los regalos del camino
function monedas(): string {
  return [0, 1, 2].map((i) => `<g transform="translate(0 ${-i * 13})"><ellipse cx="0" cy="-6" rx="24" ry="8" fill="${grad('#FFE07A', '#E8A417')}" stroke="#A86F00" stroke-width="1.2"/><path d="M-24 -6 V-14 A24 8 0 0 0 24 -14 V-6" fill="${grad('#FFD23F', '#C98A00', 1, 0)}" stroke="#A86F00" stroke-width="1.2"/></g>`).join('') +
    `<ellipse cx="0" cy="-40" rx="24" ry="8" fill="${radial('#FFF2B3', '#F2B624')}" stroke="#A86F00" stroke-width="1.2"/>
    <ellipse cx="0" cy="-40" rx="14" ry="4.6" fill="none" stroke="#D99A00" stroke-width="1.4"/>
    <g class="b-destello" fill="#fff"><path d="M30 -52 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z"/><path d="M-32 -30 l1.5 3.5 l3.5 1.5 l-3.5 1.5 l-1.5 3.5 l-1.5 -3.5 l-3.5 -1.5 l3.5 -1.5 Z"/></g>`;
}

interface Negocio { pared: string; techo: string; toldo: [string, string]; letrero: [string, string]; puerta: string; extra: (w: number, d: number) => string }
const NEGOCIOS: Record<string, Negocio> = {
  tienda: { pared: '#F6E2BC', techo: '#E7D6B5', toldo: ['#E2453C', '#FFFFFF'], letrero: ['#FFFFFF', '#C0392B'], puerta: '#4A9E5C', extra: (_w, d) => cajones(d) },
  cafe: { pared: '#B98558', techo: '#8E5E3A', toldo: ['#5A3418', '#F4E2C8'], letrero: ['#3A2416', '#FFE2B8'], puerta: '#5A3418', extra: (_w, d) => mesita(d, 50) },
  fonda: { pared: '#F2B48E', techo: '#D98C62', toldo: ['#2E9E5B', '#FFFFFF'], letrero: ['#FFFFFF', '#2E7D4E'], puerta: '#B23A2B', extra: (_w, d) => macetas(d) },
  peluqueria: { pared: '#BFE0F7', techo: '#93C1E3', toldo: ['#3D6FD1', '#FFFFFF'], letrero: ['#FFFFFF', '#2F55A8'], puerta: '#2F55A8', extra: (w, d) => poste(w, d) },
  papeleria: { pared: '#FFE08A', techo: '#E8C25E', toldo: ['#6C4CF1', '#FFFFFF'], letrero: ['#6C4CF1', '#FFFFFF'], puerta: '#6C4CF1', extra: (_w, d) => macetas(d) },
};
// Si una parada no dice su negocio, se reparte en este orden
export const ORDEN_NEGOCIOS = ['tienda', 'cafe', 'fonda', 'peluqueria', 'papeleria'];

function cajones(d: number): string {
  return ([[4, '#E53935'], [14, '#FFB300'], [24, '#7CB342']] as const).map(([u, c]) => caja(u, d + 2, 0, 9, 7, 6, '#B07A45') +
    [0, 1, 2].map((k) => { const [x, y] = P(u + 2 + k * 2.6, d + 5, 7.5); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="${c}"/>`; }).join('')).join('');
}
function mesita(d: number, u: number): string {
  const [x, y] = P(u, d + 10, 0);
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><ellipse cx="0" cy="2" rx="9" ry="3" fill="rgba(0,0,0,.18)"/><rect x="-1" y="-12" width="2" height="12" fill="#5A3418"/><ellipse cx="0" cy="-12" rx="9" ry="3.5" fill="#fff" stroke="rgba(40,30,50,.4)"/><path d="M0 -40 L-14 -26 H14 Z" fill="#FF6B5B" stroke="rgba(40,30,50,.4)"/><rect x="-.8" y="-40" width="1.6" height="28" fill="#5A3418"/></g>`;
}
function macetas(d: number): string {
  return [6, 50].map((u) => { const [x, y] = P(u, d + 3, 0); return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><path d="M-5 0 L5 0 L6 -8 L-6 -8 Z" fill="#C46A3A"/><circle cx="0" cy="-13" r="7" fill="${radial('#8BD69A', '#3E9E52')}"/></g>`; }).join('');
}
function poste(w: number, d: number): string {
  const [x, y] = P(w + 2, d + 2, 0);
  const id = `${prefijo}poste${nGrad++}`;
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><clipPath id="${id}"><rect x="-4" y="-42" width="8" height="40" rx="4"/></clipPath><rect x="-4" y="-42" width="8" height="40" rx="4" fill="#fff" stroke="rgba(40,30,50,.4)"/><g clip-path="url(#${id})">${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M-4 ${-38 + i * 8} L4 ${-44 + i * 8}" stroke="#E2453C" stroke-width="3"/>`).join('')}</g><circle cx="0" cy="-44" r="4.5" fill="#3D6FD1"/></g>`;
}

function candado(x: number, y: number): string {
  return `<g transform="translate(${x} ${y})"><path d="M-8 -6 V-12 Q0 -24 8 -12 V-6" fill="none" stroke="#4A4660" stroke-width="5"/><rect x="-13" y="-7" width="26" height="20" rx="5" fill="${grad('#7C7896', '#4A4660')}" ${ln}/><circle cx="0" cy="2" r="3" fill="#2A2838"/></g>`;
}

// Un negocio: lote con banqueta, edificio, toldo, letrero y su objeto gigante. (cx, base) = esquina del frente
function edificio(cx: number, base: number, tipo: string, letrero: string, estado: EstadoLugar): string {
  const c = NEGOCIOS[tipo] ?? NEGOCIOS.tienda;
  const w = 66, d = 44, h = 50;
  let s = poli([P(-6, -6, 0), P(w + 14, -6, 0), P(w + 14, d + 16, 0), P(-6, d + 16, 0)].map(([x, y]) => [x + 10, y + 6] as Pt), 'rgba(0,40,30,.18)');
  s += caja(-6, -6, -5, w + 18, d + 20, 5, '#E9E4D8');
  s += caja(0, 0, 0, w, d, h, c.pared) + enIzq(d, 0, 0, w, 6, 'rgba(0,0,0,.12)');
  s += caja(-2, -2, h, w + 4, 4, 5, c.techo) + caja(-2, d - 2, h, w + 4, 4, 5, c.techo) + caja(-2, -2, h, 4, d + 4, 5, c.techo) + caja(w - 2, -2, h, 4, d + 4, 5, c.techo);
  s += puertaIzq(d, 8, 20, 26, c.puerta) + ventanaIzq(d, 28, 8, 58, 26) + ventanaDer(w, 8, 14, 20, 30) + ventanaDer(w, 26, 14, 38, 30);
  s += toldoIzq(d, 2, w - 2, 34, c.toldo) + letreroIzq(d, 6, w - 6, 38, 47, letrero, c.letrero[0], c.letrero[1]) + c.extra(w, d);
  const [px, py] = P(w / 2, d / 2, h + 2);
  s += `<g transform="translate(${px.toFixed(1)} ${py.toFixed(1)})"><g class="b-flota">${(PROPS[tipo] ?? PROPS.tienda)()}</g></g>`;
  const [fx, fy] = P(w + 12, d + 14, -5);
  const dentro = `<g transform="translate(${cx} ${base}) scale(1.32) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})">${s}</g>`;
  return estado === 'bloqueada' ? `<g filter="url(#${prefijo}gris)" opacity=".6">${dentro}</g>${candado(cx, base - 70)}` : dentro;
}

function banco(cx: number, base: number, estado: EstadoPremio): string {
  const w = 86, d = 52, h = 58;
  let s = poli([P(-8, -8, 0), P(w + 16, -8, 0), P(w + 16, d + 18, 0), P(-8, d + 18, 0)].map(([x, y]) => [x + 10, y + 6] as Pt), 'rgba(0,40,30,.18)');
  s += caja(-8, -8, -6, w + 22, d + 24, 6, '#E9E4D8') + caja(-4, -4, 0, w + 8, d + 8, 6, '#F4F0FF') + caja(0, 0, 6, w, d, h, '#EEF0FA');
  for (let i = 0; i < 5; i++) s += caja(6 + i * 17, d + 2, 6, 6, 6, 40, '#FFFFFF');
  s += caja(-3, -3, h + 6, w + 6, d + 6, 6, '#6C4CF1');
  s += letreroIzq(d + 9, 10, w - 10, h - 4, h + 5, 'BANCO DE DATOS', '#FFFFFF', '#4B2FC9', 8);
  s += ventanaDer(w, 8, 24, 22, 44) + ventanaDer(w, 30, 24, 44, 44);
  const [px, py] = P(w / 2, d / 2, h + 12);
  s += `<g transform="translate(${px.toFixed(1)} ${py.toFixed(1)})"><g class="${estado === 'listo' ? 'b-rebota' : 'b-flota'}">${monedas()}</g></g>`;
  const [fx, fy] = P(w + 14, d + 16, -6);
  const dentro = `<g transform="translate(${cx} ${base}) scale(1.25) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})">${s}</g>`;
  return estado === 'cerrado' ? `<g filter="url(#${prefijo}gris)" opacity=".65">${dentro}</g>` : dentro;
}

// Regalo del camino: un montón de monedas
function regalo(x: number, y: number, estado: EstadoPremio): string {
  if (estado === 'abierto') {
    return `<g transform="translate(${x} ${y})"><ellipse cx="2" cy="14" rx="22" ry="6" fill="rgba(0,40,30,.18)"/>
      <g transform="translate(0 12) scale(.55)">${moneda1(0, 0)}</g></g>`;
  }
  const montón = `<ellipse cx="3" cy="16" rx="28" ry="7" fill="rgba(0,40,30,.25)"/>
    <g transform="translate(0 14) scale(.8)">${monedas()}</g>
    ${moneda1(-20, 4)}${moneda1(20, 8)}
    <g transform="translate(12 -26) rotate(18)"><ellipse cx="0" cy="0" rx="9" ry="12" fill="${radial('#FFF2B3', '#F2B624')}" stroke="#A86F00" stroke-width="1.4"/><ellipse cx="0" cy="0" rx="5" ry="7.5" fill="none" stroke="#D99A00" stroke-width="1.2"/></g>`;
  return `<g transform="translate(${x} ${y})">${estado === 'listo' ? `<circle cy="0" r="40" fill="#FFF3B0" class="b-destello"/>` : ''}
    <g class="${estado === 'listo' ? 'b-rebota' : ''}" ${estado === 'cerrado' ? `filter="url(#${prefijo}gris)" opacity=".8"` : ''}>${montón}</g></g>`;
}
function moneda1(x: number, y: number): string {
  return `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="2" rx="9" ry="3.4" fill="#C98A00"/><ellipse cx="0" cy="0" rx="9" ry="3.4" fill="${radial('#FFF2B3', '#F2B624')}" stroke="#A86F00" stroke-width="1"/></g>`;
}

// ---------- Escenografía ----------

function arbol(x: number, y: number, k = 1): string {
  const hoja = radial('#7FE3A0', '#239A63');
  return `<g transform="translate(${x} ${y}) scale(${k})"><ellipse cx="6" cy="2" rx="20" ry="6" fill="rgba(0,40,30,.2)"/><path d="M-3 0 L3 0 L2 -20 L-2 -20 Z" fill="#7A4A2B"/>
    <circle cx="-9" cy="-24" r="13" fill="${hoja}"/><circle cx="9" cy="-26" r="12" fill="${hoja}"/><circle cx="0" cy="-38" r="14" fill="${hoja}"/><circle cx="-4" cy="-42" r="5" fill="#B4F2C6" opacity=".7"/></g>`;
}
function pino(x: number, y: number, k = 1): string {
  return `<g transform="translate(${x} ${y}) scale(${k})"><ellipse cx="5" cy="2" rx="14" ry="5" fill="rgba(0,40,30,.2)"/><rect x="-2.5" y="-10" width="5" height="12" fill="#7A4A2B"/>
    <path d="M0 -56 L16 -24 L-16 -24 Z M0 -42 L19 -8 L-19 -8 Z" fill="${grad('#3FBF7F', '#1E7F55')}"/></g>`;
}
function arbusto(x: number, y: number): string {
  const g = radial('#8FE8AE', '#2FA36B');
  return `<g transform="translate(${x} ${y})"><ellipse cx="4" cy="2" rx="22" ry="5" fill="rgba(0,40,30,.18)"/><circle cx="-10" cy="-8" r="10" fill="${g}"/><circle cx="8" cy="-9" r="11" fill="${g}"/><circle cx="-1" cy="-16" r="10" fill="${g}"/></g>`;
}
function farol(x: number, y: number): string {
  return `<g transform="translate(${x} ${y})"><ellipse cx="3" cy="1" rx="7" ry="2.5" fill="rgba(0,40,30,.2)"/><rect x="-1.5" y="-44" width="3" height="44" fill="#3A3658"/><path d="M-6 -44 H6 L4 -54 H-4 Z" fill="#FFE27A" stroke="#3A3658" stroke-width="1.5"/><circle cx="0" cy="-49" r="10" fill="#FFF3B0" opacity=".35" class="b-destello"/></g>`;
}
function cartelera(x: number, y: number): string {
  return `<g transform="translate(${x} ${y})"><ellipse cx="4" cy="2" rx="24" ry="5" fill="rgba(0,40,30,.2)"/><rect x="-14" y="-28" width="3" height="28" fill="#7A4A2B"/><rect x="11" y="-28" width="3" height="28" fill="#7A4A2B"/>
    <rect x="-28" y="-72" width="56" height="44" rx="5" fill="#fff" stroke="#3A3658" stroke-width="2"/>` +
    ([[-20, 14, '#6C4CF1'], [-8, 24, '#FF6B5B'], [4, 18, '#2EC4A0'], [16, 32, '#FFB020']] as const).map(([bx, bh, c]) => `<rect x="${bx - 4}" y="${-34 - bh}" width="8" height="${bh}" rx="1.5" fill="${c}"/>`).join('') + '</g>';
}
function fuente(x: number, y: number): string {
  return `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="0" rx="34" ry="14" fill="#D9D4E8"/><ellipse cx="0" cy="-4" rx="30" ry="11" fill="${grad('#8FD8F5', '#3FA4D8')}"/>
    <rect x="-4" y="-26" width="8" height="22" fill="#E9E4F5"/><ellipse cx="0" cy="-26" rx="12" ry="4" fill="#E9E4F5"/>
    <path d="M0 -26 q-8 -14 -16 0 M0 -26 q8 -14 16 0" fill="none" stroke="#BFEFFF" stroke-width="2.5" class="b-destello"/></g>`;
}
function flores(x: number, y: number): string {
  return [0, 8, 16, 5, 12].map((d, i) => `<circle cx="${x + d}" cy="${y + (i > 2 ? -6 : 0)}" r="3" fill="${['#FF8FB1', '#FFE27A', '#fff', '#FFB74D', '#CE93D8'][i]}"/>`).join('');
}

// ---------- Escena completa ----------

export interface Lugar { x: number; y: number }
export interface Escena {
  paradas: (Lugar & { negocio: string; letrero: string; estado: EstadoLugar })[];
  regalos: (Lugar & { estado: EstadoPremio })[];
  banco: Lugar & { estado: EstadoPremio };
  alto: number;
  avatar?: Lugar & { svg: string };   // figura completa (lienzo de 200×424) a escala .22
}

// Dónde va cada cosa: las paradas zigzaguean; el regalo, a media calle después de cada 3 paradas
export const ARRIBA = 200;
export const PASO = 230;
export const puntoParada = (i: number): Lugar => ({ x: i % 2 ? 240 : 150, y: ARRIBA + i * PASO });
export const ladoLibre = (p: Lugar) => (p.x > ANCHO / 2 ? 1 : -1);   // del lado contrario al negocio

function calle(puntos: Lugar[]): string {
  const d = puntos.reduce((acc, p, i) => {
    if (!i) return `M${p.x} ${p.y}`;
    const a = puntos[i - 1], m = (a.y + p.y) / 2;
    return `${acc} C${a.x} ${m} ${p.x} ${m} ${p.x} ${p.y}`;
  }, '');
  return `<path d="${d}" fill="none" stroke="rgba(0,60,40,.18)" stroke-width="66" stroke-linecap="round" transform="translate(4 6)"/>
    <path d="${d}" fill="none" stroke="#D8CCB2" stroke-width="60" stroke-linecap="round"/>
    <path d="${d}" fill="none" stroke="${grad('#F1E8D6', '#E2D5BB', 1, 0)}" stroke-width="50" stroke-linecap="round"/>
    <path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="12 14" stroke-linecap="round" opacity=".85"/>`;
}

export function dibujarBarrio(e: Escena, id: string): string {
  defs = '';
  nGrad = 0;
  prefijo = id;
  let s = `<rect width="${ANCHO}" height="${e.alto}" fill="${grad('#4CD3A3', '#2FB98A')}"/>`;
  // Manchas de pasto y escenografía entre paradas, en las orillas
  e.paradas.forEach((p, i) => {
    const lado = ladoLibre(p);
    s += `<ellipse cx="${lado < 0 ? 50 : 340}" cy="${p.y - 90}" rx="90" ry="44" fill="${i % 2 ? '#36BE8F' : '#5ADDB0'}" opacity=".7"/>`;
  });
  // La calle termina en la puerta del Banco de Datos
  s += calle([{ x: ANCHO / 2, y: 0 }, ...e.paradas, { x: e.banco.x, y: e.banco.y - 20 }]);
  const adornos = [
    (y: number, izq: boolean) => pino(izq ? 30 : 360, y, 0.9) + pino(izq ? 56 : 334, y - 20, 0.7),
    (y: number, izq: boolean) => arbol(izq ? 32 : 356, y) + flores(izq ? 70 : 300, y + 30),
    (y: number, izq: boolean) => arbusto(izq ? 26 : 364, y) + farol(izq ? 112 : 284, y + 30),
    (y: number, izq: boolean) => cartelera(izq ? 48 : 340, y + 20),
  ];
  e.paradas.forEach((p, i) => {
    const izq = ladoLibre(p) < 0;
    s += adornos[i % adornos.length](p.y + 125, izq);
    s += i % 2 ? arbusto(izq ? 364 : 26, p.y - 95) : farol(izq ? 284 : 112, p.y - 70);
  });
  s += arbol(40, e.banco.y + 80, 0.9) + pino(352, e.banco.y + 70) + fuente(70, e.alto - 60);
  e.paradas.forEach((p) => {
    s += edificio(p.x > ANCHO / 2 ? 102 : 292, p.y + 40, p.negocio, p.letrero, p.estado);
  });
  s += banco(e.banco.x, e.banco.y, e.banco.estado);
  e.regalos.forEach((r) => { s += regalo(r.x, r.y, r.estado); });
  if (e.avatar) {
    const a = e.avatar;
    s += `<g transform="translate(${a.x - 22} ${a.y - 64}) scale(.22)">${a.svg}</g>`;
  }
  return `<defs><filter id="${id}gris"><feColorMatrix type="saturate" values="0.12"/></filter>${defs}</defs>${s}`;
}
