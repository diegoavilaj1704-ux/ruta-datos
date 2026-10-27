import type { Equipo } from './armario';

// Elenco de la ruta (docs/estilo-y-personajes.md). Las caras se dibujan con SVG:
// pesan casi nada, funcionan sin conexión y no tienen problemas de derechos.
//   yo     → el avatar que cada alumno arma en su perfil (protagonista)
//   hashy  → schnauzer que da tips y se pone triste cuando te equivocas
//   rafa   → Don Rafa, dueño de la tienda; y el elenco secundario

export const PIELES = ['#F9D7C0', '#EBB894', '#C98E62', '#A5693F', '#7A4A2B', '#5A3520'] as const;

export const PEINADOS = {
  ondulado: 'Ondulado', rizos: 'Rizos', afro: 'Afro', largo: 'Largo', cola: 'Cola de caballo',
  chongo: 'Chongo', trenzas: 'Trenzas', fleco: 'Fleco', corto: 'Corto', entradas: 'Entradas', calvo: 'Calvo',
  // Se desbloquean con XP en el clóset (precios en armario.ts)
  copete: 'Copete', cresta: 'Cresta', coletas: 'Coletas', bob: 'Bob', chongos: 'Dos chongos',
  rastas: 'Rastas', picos: 'Picos', raya: 'Raya de lado',
} as const;
export type Peinado = keyof typeof PEINADOS;

export const COLORES_PELO = ['#1E1714', '#4A2E1E', '#7A5A3A', '#A0462A', '#D9B26A', '#B8B2A8'] as const;

// Color de ropa y su fondo pastel
export const ROPAS = [
  ['#6C4CF1', '#E7E0FF'], ['#FF6B5B', '#FFE0DC'], ['#0E9F9A', '#D7F7EA'],
  ['#FFB020', '#FFF1C9'], ['#2B4BEE', '#DDEBFF'], ['#3A3658', '#ECEAF3'],
] as const;

export interface Rasgos {
  nombre: string;
  piel: string;
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

// Lo que guarda el perfil del alumno (progreso.perfil)
export interface Perfil {
  nombre: string;
  piel: number;
  llenito: boolean;
  peinado: Peinado;
  pelo: number;
  barba: boolean;
  bigote: boolean;
  lentes?: boolean;     // versión anterior; ahora los lentes están en `equipo`
  aretes: boolean;
  ropa: number;         // color favorito: playera básica y fondo del avatar
  equipo?: Equipo;      // lo que trae puesto (clóset)
}

export const PERFIL_INICIAL: Perfil = {
  nombre: '', piel: 2, llenito: false, peinado: 'ondulado', pelo: 0,
  barba: false, bigote: false, aretes: false, ropa: 0,
};

export function rasgosDePerfil(p: Perfil): Rasgos {
  const pelo = COLORES_PELO[p.pelo] ?? COLORES_PELO[0];
  const [ropa, fondo] = ROPAS[p.ropa] ?? ROPAS[0];
  return {
    nombre: p.nombre || 'Tú',
    piel: PIELES[p.piel] ?? PIELES[2],
    llenito: p.llenito,
    peinado: p.peinado,
    pelo,
    barba: p.barba ? pelo : undefined,
    bigote: p.bigote ? pelo : undefined,
    lentes: p.lentes,
    aretes: p.aretes,
    fondo,
    ropa,
  };
}

const p = (i: number) => PIELES[i];

export const ELENCO = {
  rafa: { nombre: 'Don Rafa', piel: p(2), llenito: true, peinado: 'entradas', pelo: '#B8B2A8', cejas: '#8E877C', bigote: '#B8B2A8', fondo: '#FFE3A8', ropa: '#FF6B5B' },
  lupita: { nombre: 'Lupita', piel: p(0), peinado: 'rizos', pelo: '#A0462A', aretes: true, fondo: '#E7E0FF', ropa: '#6C4CF1' },
  kemi: { nombre: 'Kemi', piel: p(5), llenito: true, peinado: 'afro', pelo: '#1E1714', fondo: '#D7F7EA', ropa: '#FFB020' },
  sofia: { nombre: 'Sofía', piel: p(1), peinado: 'largo', pelo: '#1E1714', lentes: true, fondo: '#FFE0DC', ropa: '#0E9F9A' },
  beto: { nombre: 'Beto', piel: p(0), llenito: true, peinado: 'calvo', pelo: '#7A5A3A', barba: '#7A5A3A', fondo: '#DDEBFF', ropa: '#2B4BEE' },
  mariana: { nombre: 'Mariana', piel: p(4), peinado: 'trenzas', pelo: '#1E1714', aretes: true, fondo: '#FFF1C9', ropa: '#F0567A' },
  jun: { nombre: 'Jun', piel: p(1), peinado: 'fleco', pelo: '#1E1714', fondo: '#E2F4FF', ropa: '#4B2FC9' },
  chela: { nombre: 'Doña Chela', piel: p(3), llenito: true, peinado: 'chongo', pelo: '#D9D4CC', cejas: '#A9A398', lentes: true, fondo: '#F3E6FF', ropa: '#0A7773' },
  tono: { nombre: 'Toño', piel: p(3), peinado: 'corto', pelo: '#2A2420', barba: '#2A2420', fondo: '#FFE3D1', ropa: '#3A3658' },
} satisfies Record<string, Rasgos>;

export type Quien = keyof typeof ELENCO | 'yo' | 'hashy';
export type Animo = 'feliz' | 'triste';

export function nombreDe(quien: Quien, perfil?: Perfil): string {
  if (quien === 'yo') return perfil?.nombre || 'Tú';
  if (quien === 'hashy') return 'Hashy';
  return ELENCO[quien].nombre;
}

// Devuelve el SVG de la cara como texto; `id` evita choques entre clipPath de varias caras.
export function dibujarCara(o: Rasgos, id: string): string {
  const { atras, frente } = partesCabeza(o);
  const ropa = `<path d="M14,100 Q16,78 50,76 Q84,78 86,100 Z" fill="${o.ropa}"/>` +
    (o.sudadera ? `<path d="M30,82 Q50,92 70,82" stroke="${o.sudadera}" stroke-width="4" fill="none" stroke-linecap="round"/>` : '');
  const cuello = `<rect x="44" y="64" width="12" height="14" rx="4" fill="${o.piel}"/><rect x="44" y="64" width="12" height="6" fill="#000" opacity=".08"/>`;
  return envolver(o.nombre, id, o.fondo, `${atras}${ropa}${cuello}${frente}`);
}

// Cabeza en coordenadas de 100×100 (centro 50,50): `atras` va detrás del cuerpo
// (pelo largo, afro…) y `frente` es la cara con el pelo de enfrente. La usan el
// busto del elenco y el cuerpo completo del avatar (cuerpo.ts).
export function partesCabeza(o: Rasgos): { atras: string; frente: string } {
  const rx = o.llenito ? 27 : 22;
  const sk = o.piel;
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

  if (o.peinado === 'coletas') atras += `<ellipse cx="${L - 7}" cy="46" rx="7" ry="12" fill="${h}"/><ellipse cx="${R + 7}" cy="46" rx="7" ry="12" fill="${h}"/>`;
  if (o.peinado === 'bob') atras += `<path d="M${L - 4},44 Q${L - 6},16 50,15 Q${R + 6},16 ${R + 4},44 Q${R + 7},64 ${R + 1},70 Q${R - 3},72 ${R - 4},66 L${L + 4},66 Q${L + 3},72 ${L - 1},70 Q${L - 7},64 ${L - 4},44 Z" fill="${h}"/>`;
  // Rastas: caen por los lados y la espalda, no por detrás de la cara
  if (o.peinado === 'rastas') {
    for (const [x, largo, giro] of [[L - 9, 50, 6], [L - 3, 56, 3], [R + 3, 56, -3], [R + 9, 50, -6]] as const) {
      atras += `<rect x="${x - 3}" y="30" width="6.5" height="${largo}" rx="3.2" fill="${h}" transform="rotate(${giro} ${x} 30)"/>`;
    }
  }

  const orejas = `<circle cx="${L}" cy="53" r="5" fill="${sk}"/><circle cx="${R}" cy="53" r="5" fill="${sk}"/>`;
  const cabeza = `<ellipse cx="50" cy="50" rx="${rx}" ry="${o.llenito ? 25 : 26}" fill="${sk}"/>`;

  // Pelo delante
  const casco = `<path d="M${L - 1},48 Q${L - 2},21 50,21 Q${R + 2},21 ${R + 1},48 Q${R - 4},33 54,31 Q${L + 8},33 ${L - 1},48 Z" fill="${h}"/>`;
  if (o.peinado === 'fleco') frente += `<path d="M${L - 1},50 Q${L - 2},22 50,21 Q${R + 2},22 ${R + 1},50 L${R - 2},40 L${L + 2},40 Z" fill="${h}"/>`;
  else if (o.peinado === 'rizos') for (let i = 0; i < 7; i++) frente += `<circle cx="${L + 4 + (i * (rx * 2 - 8)) / 6}" cy="${30 + (i % 2) * 3}" r="7" fill="${h}"/>`;
  else if (o.peinado === 'ondulado') {
    for (let i = 0; i < 6; i++) frente += `<circle cx="${L + 3 + (i * (rx * 2 - 6)) / 5}" cy="${29 + (i % 2) * 2.5}" r="6.5" fill="${h}"/>`;
    frente += `<path d="M${L + 6},30 Q50,38 ${R - 4},31" stroke="${h}" stroke-width="6" fill="none"/>`;
  } else if (['corto', 'largo', 'trenzas', 'chongo', 'cola', 'coletas', 'chongos', 'rastas'].includes(o.peinado)) frente += casco;
  if (o.peinado === 'chongo') frente += `<circle cx="50" cy="17" r="9" fill="${h}"/>`;
  if (o.peinado === 'chongos') frente += `<circle cx="${L + 5}" cy="20" r="8" fill="${h}"/><circle cx="${R - 5}" cy="20" r="8" fill="${h}"/>`;
  if (o.peinado === 'coletas') frente += `<circle cx="${L - 2}" cy="37" r="2.8" fill="#FF6B5B"/><circle cx="${R + 2}" cy="37" r="2.8" fill="#FF6B5B"/>`;
  if (o.peinado === 'rastas') frente += [44, 50, 56].map((x) => `<rect x="${x - 2.5}" y="28" width="5" height="15" rx="2.5" fill="${h}"/>`).join('');
  if (o.peinado === 'bob') frente += `<path d="M${L - 1},46 Q${L - 2},21 50,20 Q${R + 2},21 ${R + 1},46 L${R - 1},38 L${L + 1},38 Z" fill="${h}"/>`;
  if (o.peinado === 'copete') {
    // Lados cortos y un tupé que se levanta y cae hacia un lado
    frente += `<path d="M${L - 1},50 Q${L - 2},38 ${L + 2},34 L${L + 3},48 Z M${R + 1},50 Q${R + 2},38 ${R - 2},34 L${R - 3},48 Z" fill="${h}"/>`;
    frente += `<path d="M${L + 1},38 Q${L - 3},14 44,11 Q66,4 ${R + 3},20 Q${R + 4},30 ${R - 2},34 Q${R - 6},24 58,24 Q${L + 10},24 ${L + 1},38 Z" fill="${h}"/>`;
    frente += `<path d="M${L + 8},22 Q50,14 ${R - 6},20" stroke="#fff" stroke-opacity=".18" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  }
  if (o.peinado === 'cresta') {
    frente += `<path d="${casco.match(/d="([^"]+)"/)![1]}" fill="${h}" opacity=".25"/>`;
    frente += `<path d="M44,34 L41,8 L47,16 L50,4 L53,16 L59,8 L56,34 Z" fill="${h}"/>`;
  }
  if (o.peinado === 'picos') frente += `<path d="M${L - 1},46 L${L - 2},24 L${L + 6},28 L${L + 8},12 L${L + 16},24 L50,8 L${R - 16},24 L${R - 8},12 L${R - 6},28 L${R + 2},24 L${R + 1},46 Q50,32 ${L - 1},46 Z" fill="${h}"/>`;
  if (o.peinado === 'raya') frente += `<path d="M${L - 1},48 Q${L - 2},21 50,21 Q${R + 2},21 ${R + 1},48 Q${R - 2},34 ${R - 10},30 Q${L + 14},26 ${L + 4},40 Q${L},44 ${L - 1},48 Z" fill="${h}"/>`;
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

  return { atras, frente: `${orejas}${cabeza}${frente}${cara}${extra}` };
}

// Hashy: schnauzer sal y pimienta, con cejas y barba pobladas y collar coral
export function dibujarHashy(animo: Animo, id: string): string {
  const triste = animo === 'triste';
  const pelaje = '#8E959C';
  const oscuro = '#5F666D';
  const claro = '#E9EBEE';
  const cuerpo = `<path d="M16,100 Q18,80 50,78 Q82,80 84,100 Z" fill="${pelaje}"/>` +
    `<rect x="30" y="83" width="40" height="6" rx="3" fill="#FF6B5B"/><circle cx="50" cy="92" r="4" fill="#FFB020"/>`;
  // Orejas dobladas hacia el frente; tristes, caen más
  const orejas = triste
    ? `<path d="M27,34 Q18,40 20,54 Q28,48 34,42 Z" fill="${oscuro}"/><path d="M73,34 Q82,40 80,54 Q72,48 66,42 Z" fill="${oscuro}"/>`
    : `<path d="M28,36 Q20,20 34,18 Q40,24 38,34 Z" fill="${oscuro}"/><path d="M72,36 Q80,20 66,18 Q60,24 62,34 Z" fill="${oscuro}"/>`;
  const cabeza = `<path d="M27,40 Q27,22 50,22 Q73,22 73,40 L73,62 Q73,74 50,74 Q27,74 27,62 Z" fill="${pelaje}"/>`;
  // Cejas pobladas: preocupadas (inclinadas hacia arriba al centro) cuando está triste
  const cejas = triste
    ? `<path d="M31,42 Q38,34 46,38 L45,42 Q38,40 32,46 Z" fill="${claro}"/><path d="M69,42 Q62,34 54,38 L55,42 Q62,40 68,46 Z" fill="${claro}"/>`
    : `<path d="M31,40 Q38,32 46,40 L44,43 Q38,38 32,44 Z" fill="${claro}"/><path d="M69,40 Q62,32 54,40 L56,43 Q62,38 68,44 Z" fill="${claro}"/>`;
  const ojos = triste
    ? `<ellipse cx="40" cy="48" rx="2.6" ry="2.2" fill="#1C1B22"/><ellipse cx="60" cy="48" rx="2.6" ry="2.2" fill="#1C1B22"/>` +
      `<path d="M62,52 Q60,57 62,59 Q64,57 62,52 Z" fill="#7CC4FF"/>`
    : `<circle cx="40" cy="47" r="3.2" fill="#1C1B22"/><circle cx="60" cy="47" r="3.2" fill="#1C1B22"/>` +
      `<circle cx="41" cy="46" r="1" fill="#fff"/><circle cx="61" cy="46" r="1" fill="#fff"/>`;
  // Hocico con barba de schnauzer
  const barba = `<path d="M33,54 Q30,80 50,84 Q70,80 67,54 Q60,60 50,58 Q40,60 33,54 Z" fill="${claro}"/>` +
    `<path d="M38,70 L36,78 M44,73 L43,82 M56,73 L57,82 M62,70 L64,78" stroke="#C9CDD2" stroke-width="1.4" stroke-linecap="round"/>`;
  const nariz = `<ellipse cx="50" cy="57" rx="6" ry="4.5" fill="#1C1B22"/><ellipse cx="48" cy="55.5" rx="1.6" ry="1" fill="#fff" opacity=".5"/>`;
  const boca = triste
    ? `<path d="M44,68 Q50,63 56,68" stroke="#3A3D44" stroke-width="2" fill="none" stroke-linecap="round"/>`
    : `<path d="M44,64 Q50,70 56,64" stroke="#3A3D44" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M48,67 Q50,73 52,67 Z" fill="#FF8FA3"/>`;
  return envolver('Hashy', id, triste ? '#DCE6F2' : '#E2F4FF', `${cuerpo}${orejas}${cabeza}${cejas}${ojos}${barba}${nariz}${boca}`);
}

function envolver(nombre: string, id: string, fondo: string, contenido: string): string {
  return `<svg viewBox="0 0 100 100" width="100%" height="100%" role="img" aria-label="${nombre}"><defs><clipPath id="c${id}"><circle cx="50" cy="50" r="50"/></clipPath></defs><g clip-path="url(#c${id})"><rect width="100" height="100" fill="${fondo}"/>${contenido}</g></svg>`;
}
