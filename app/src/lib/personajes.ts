// Elenco de la ruta (docs/estilo-y-personajes.md). Las caras se dibujan con SVG:
// pesan casi nada, funcionan sin conexión y no tienen problemas de derechos.

const PIEL = {
  a: '#F9D7C0', b: '#EBB894', c: '#C98E62', d: '#A5693F', e: '#7A4A2B', f: '#5A3520',
} as const;

type Peinado = 'ondulado' | 'cola' | 'entradas' | 'rizos' | 'afro' | 'largo' | 'calvo' | 'trenzas' | 'chongo' | 'fleco' | 'corto';

export interface Rasgos {
  nombre: string;
  papel: string;
  piel: keyof typeof PIEL;
  llenito?: boolean;
  peinado: Peinado;
  pelo: string;
  cejas?: string;
  barba?: string;
  bigote?: string;
  lentes?: boolean;
  aretes?: boolean;
  sudadera?: string;
  fondo: string;
  ropa: string;
}

export const PERSONAJES = {
  diego: { nombre: 'Diego', papel: 'Analista de datos', piel: 'c', peinado: 'ondulado', pelo: '#2A2420', barba: '#2A2420', sudadera: '#4B2FC9', fondo: '#E7E0FF', ropa: '#6C4CF1' },
  rafa: { nombre: 'Don Rafa', papel: 'Dueño de Abarrotes La Esquina', piel: 'c', llenito: true, peinado: 'entradas', pelo: '#B8B2A8', cejas: '#8E877C', bigote: '#B8B2A8', fondo: '#FFE3A8', ropa: '#FF6B5B' },
  fer: { nombre: 'Fer', papel: 'Amiga de Diego, ya trabaja en datos', piel: 'b', peinado: 'cola', pelo: '#5A3A22', aretes: true, fondo: '#FFE0DC', ropa: '#FF6B5B' },
  lupita: { nombre: 'Lupita', papel: 'Cajera', piel: 'a', peinado: 'rizos', pelo: '#A0462A', aretes: true, fondo: '#E7E0FF', ropa: '#6C4CF1' },
  kemi: { nombre: 'Kemi', papel: 'Analista', piel: 'f', llenito: true, peinado: 'afro', pelo: '#1E1714', fondo: '#D7F7EA', ropa: '#FFB020' },
  sofia: { nombre: 'Sofía', papel: 'Proveedora', piel: 'b', peinado: 'largo', pelo: '#1E1714', lentes: true, fondo: '#FFE0DC', ropa: '#0E9F9A' },
  beto: { nombre: 'Beto', papel: 'Repartidor', piel: 'a', llenito: true, peinado: 'calvo', pelo: '#7A5A3A', barba: '#7A5A3A', fondo: '#DDEBFF', ropa: '#2B4BEE' },
  mariana: { nombre: 'Mariana', papel: 'Gerente Norte', piel: 'e', peinado: 'trenzas', pelo: '#1E1714', aretes: true, fondo: '#FFF1C9', ropa: '#F0567A' },
  jun: { nombre: 'Jun', papel: 'Cliente', piel: 'b', peinado: 'fleco', pelo: '#1E1714', fondo: '#E2F4FF', ropa: '#4B2FC9' },
  chela: { nombre: 'Doña Chela', papel: 'Clienta frecuente', piel: 'd', llenito: true, peinado: 'chongo', pelo: '#D9D4CC', cejas: '#A9A398', lentes: true, fondo: '#F3E6FF', ropa: '#0A7773' },
  tono: { nombre: 'Toño', papel: 'Gerente Sur', piel: 'd', peinado: 'corto', pelo: '#2A2420', barba: '#2A2420', fondo: '#FFE3D1', ropa: '#3A3658' },
} satisfies Record<string, Rasgos>;

export type Quien = keyof typeof PERSONAJES;

export function esPersonaje(q: string): q is Quien {
  return q in PERSONAJES;
}

// Devuelve el SVG de la cara como texto; `id` evita choques entre clipPath de varias caras.
export function dibujarCara(o: Rasgos, id: string): string {
  const rx = o.llenito ? 27 : 22;
  const sk = PIEL[o.piel];
  const h = o.pelo;
  const L = 50 - rx;
  const R = 50 + rx;
  let atras = '';
  let frente = '';
  let extra = '';

  // Pelo detrás de la cabeza
  if (o.peinado === 'largo') atras += `<path d="M${L - 5},44 Q${L - 6},18 50,17 Q${R + 6},18 ${R + 5},44 L${R + 7},86 L${L - 7},86 Z" fill="${h}"/>`;
  if (o.peinado === 'afro') {
    atras += `<circle cx="50" cy="40" r="${rx + 14}" fill="${h}"/>`;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      atras += `<circle cx="${50 + Math.cos(a) * (rx + 13)}" cy="${40 + Math.sin(a) * (rx + 11)}" r="7" fill="${h}"/>`;
    }
  }
  if (o.peinado === 'rizos') {
    for (let i = 0; i < 11; i++) {
      const a = Math.PI + (i / 10) * Math.PI;
      atras += `<circle cx="${50 + Math.cos(a) * (rx + 4)}" cy="${44 + Math.sin(a) * 24}" r="7.5" fill="${h}"/>`;
    }
    atras += `<circle cx="${L - 2}" cy="54" r="7" fill="${h}"/><circle cx="${R + 2}" cy="54" r="7" fill="${h}"/>`;
  }
  if (o.peinado === 'ondulado') {
    for (let i = 0; i < 9; i++) {
      const a = Math.PI + (i / 8) * Math.PI;
      atras += `<circle cx="${50 + Math.cos(a) * (rx + 3)}" cy="${46 + Math.sin(a) * 24}" r="6" fill="${h}"/>`;
    }
  }
  if (o.peinado === 'cola') atras += `<ellipse cx="${R + 9}" cy="58" rx="8" ry="17" fill="${h}" transform="rotate(-12 ${R + 9} 58)"/><circle cx="${R + 2}" cy="38" r="4" fill="#FF6B5B"/>`;
  if (o.peinado === 'trenzas') {
    atras += `<g fill="${h}">${[0, 1, 2, 3, 4].map((i) => `<circle cx="${L - 3}" cy="${52 + i * 8}" r="4.5"/><circle cx="${R + 3}" cy="${52 + i * 8}" r="4.5"/>`).join('')}</g>`;
  }

  const ropa = `<path d="M14,100 Q16,78 50,76 Q84,78 86,100 Z" fill="${o.ropa}"/>` +
    (o.sudadera ? `<path d="M30,82 Q50,92 70,82" stroke="${o.sudadera}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M44,86 L44,96 M56,86 L56,96" stroke="#fff" stroke-opacity=".7" stroke-width="2" stroke-linecap="round"/>` : '');
  const cuello = `<rect x="44" y="64" width="12" height="14" rx="4" fill="${sk}"/><rect x="44" y="64" width="12" height="6" fill="#000" opacity=".08"/>`;
  const orejas = `<circle cx="${L}" cy="53" r="5" fill="${sk}"/><circle cx="${R}" cy="53" r="5" fill="${sk}"/>`;
  const cabeza = `<ellipse cx="50" cy="50" rx="${rx}" ry="${o.llenito ? 25 : 26}" fill="${sk}"/>`;

  // Pelo delante
  const casco = `<path d="M${L - 1},48 Q${L - 2},21 50,21 Q${R + 2},21 ${R + 1},48 Q${R - 4},33 54,31 Q${L + 8},33 ${L - 1},48 Z" fill="${h}"/>`;
  if (o.peinado === 'fleco') frente += `<path d="M${L - 1},50 Q${L - 2},22 50,21 Q${R + 2},22 ${R + 1},50 L${R - 2},40 L${L + 2},40 Z" fill="${h}"/>`;
  else if (o.peinado === 'rizos') for (let i = 0; i < 7; i++) frente += `<circle cx="${L + 4 + (i * (rx * 2 - 8)) / 6}" cy="${30 + (i % 2) * 3}" r="7" fill="${h}"/>`;
  else if (o.peinado === 'ondulado') {
    for (let i = 0; i < 6; i++) frente += `<circle cx="${L + 3 + (i * (rx * 2 - 6)) / 5}" cy="${29 + (i % 2) * 2.5}" r="6.5" fill="${h}"/>`;
    frente += `<path d="M${L + 6},30 Q50,38 ${R - 4},31" stroke="${h}" stroke-width="6" fill="none"/>`;
  } else if (['corto', 'largo', 'trenzas', 'chongo', 'cola'].includes(o.peinado)) frente += casco;
  if (o.peinado === 'chongo') frente += `<circle cx="50" cy="17" r="9" fill="${h}"/>`;
  if (o.peinado === 'calvo') frente += `<path d="M${L},50 Q${L},40 ${L + 5},38 L${L + 5},50 Z M${R},50 Q${R},40 ${R - 5},38 L${R - 5},50 Z" fill="${h}"/>`;
  if (o.peinado === 'entradas') {
    frente += `<path d="M${L - 1},50 Q${L - 2},28 ${L + 8},26 L${L + 6},44 Z M${R + 1},50 Q${R + 2},28 ${R - 8},26 L${R - 6},44 Z" fill="${h}"/>`;
    frente += `<path d="M${L + 8},26 Q50,20 ${R - 8},26 Q50,24 ${L + 8},26" fill="${h}"/>`;
  }

  const cara = `<circle cx="41" cy="52" r="2.7" fill="#2A2838"/><circle cx="59" cy="52" r="2.7" fill="#2A2838"/>` +
    `<path d="M37,46 Q41,44 45,46 M55,46 Q59,44 63,46" stroke="${o.cejas ?? h}" stroke-width="2" fill="none" stroke-linecap="round"/>` +
    `<path d="M50,54 Q48,59 51,59.5" stroke="#000" stroke-opacity=".22" stroke-width="1.8" fill="none" stroke-linecap="round"/>` +
    `<circle cx="${L + 7}" cy="60" r="4" fill="#FF6B5B" opacity=".25"/><circle cx="${R - 7}" cy="60" r="4" fill="#FF6B5B" opacity=".25"/>` +
    `<path d="M43,64 Q50,70 57,64" stroke="#2A2838" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;

  if (o.barba) extra += `<path d="M${L + 1},54 Q${L + 2},76 50,78 Q${R - 2},76 ${R - 1},54 Q${R - 4},66 57,67 Q50,72 43,67 Q${L + 4},66 ${L + 1},54 Z" fill="${o.barba}" opacity=".85"/><path d="M44,64.5 Q50,68 56,64.5" stroke="#fff" stroke-opacity=".5" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  if (o.bigote) extra += `<path d="M41,62 Q45,58 50,61 Q55,58 59,62 Q55,64.5 50,63 Q45,64.5 41,62 Z" fill="${o.bigote}"/>`;
  if (o.lentes) extra += `<g fill="none" stroke="#2A2838" stroke-width="1.8"><circle cx="41" cy="52" r="6.5"/><circle cx="59" cy="52" r="6.5"/><path d="M47.5,52 L52.5,52"/></g>`;
  if (o.aretes) extra += `<circle cx="${L}" cy="58" r="1.8" fill="#FFB020"/><circle cx="${R}" cy="58" r="1.8" fill="#FFB020"/>`;

  return `<svg viewBox="0 0 100 100" width="100%" height="100%" role="img" aria-label="${o.nombre}"><defs><clipPath id="c${id}"><circle cx="50" cy="50" r="50"/></clipPath></defs><g clip-path="url(#c${id})"><rect width="100" height="100" fill="${o.fondo}"/>${atras}${ropa}${cuello}${orejas}${cabeza}${frente}${cara}${extra}</g></svg>`;
}
