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
export type Animo = 'feliz' | 'triste' | 'lentes';

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
// Hashy: schnauzer sal y pimienta, con contorno como de caricatura. Cara rectangular,
// cejas y barba blancas pobladas, orejas dobladas y collar rojo.
// Triste cuando te equivocas; con lentes oscuros al terminar una unidad.
export const HASHY = { gris: '#8F959D', grisOscuro: '#5E646C', crema: '#F3EBDC', cremaSombra: '#D9CBB0', rosa: '#E9A3A0', collar: '#D93D48' };
export const LINEA_HASHY = 'stroke="#2A2838" stroke-width="1.6" stroke-linejoin="round"';

export function dibujarHashy(animo: Animo, id: string): string {
  const { gris, grisOscuro, crema, cremaSombra, rosa, collar } = HASHY;
  const L = LINEA_HASHY;
  const triste = animo === 'triste';
  const orejas = triste
    ? `<path d="M33 27 Q16 28 12 46 Q18 50 24 45 Q27 35 34 33 Z" fill="${grisOscuro}" ${L}/><path d="M67 27 Q84 28 88 46 Q82 50 76 45 Q73 35 66 33 Z" fill="${grisOscuro}" ${L}/>`
    : `<path d="M35 24 Q20 15 9 23 Q8 33 16 38 Q20 30 34 31 Z" fill="${grisOscuro}" ${L}/><path d="M30 24 Q20 20 14 26 Q17 30 23 29 Z" fill="${rosa}"/>` +
      `<path d="M65 24 Q80 15 91 23 Q92 33 84 38 Q80 30 66 31 Z" fill="${grisOscuro}" ${L}/><path d="M70 24 Q80 20 86 26 Q83 30 77 29 Z" fill="${rosa}"/>`;
  const cuerpo = `<path d="M8 100 Q10 76 30 70 L70 70 Q90 76 92 100 Z" fill="${gris}" ${L}/>` +
    `<path d="M32 100 L35 90 L38 94 L42 86 L46 92 L50 85 L54 92 L58 86 L62 94 L65 90 L68 100 Z" fill="${crema}" ${L}/>` +
    `<path d="M27 74 Q50 83 73 74 L73 80 Q50 89 27 80 Z" fill="${collar}" ${L}/>`;
  const cabeza = `<path d="M31 36 Q30 19 50 18 Q70 19 69 36 L71 54 L29 54 Z" fill="${gris}" ${L}/>` +
    `<path d="M40 21 Q50 17 60 21 L57 29 Q50 27 43 29 Z" fill="${grisOscuro}" opacity=".35"/>`;
  const ojos = animo === 'lentes'
    ? ''
    : triste
      ? `<ellipse cx="38" cy="45" rx="3" ry="2.6" fill="#1C1C24"/><ellipse cx="62" cy="45" rx="3" ry="2.6" fill="#1C1C24"/>`
      : `<circle cx="38" cy="43.5" r="4" fill="#1C1C24"/><circle cx="62" cy="43.5" r="4" fill="#1C1C24"/><circle cx="39.5" cy="42" r="1.4" fill="#fff"/><circle cx="63.5" cy="42" r="1.4" fill="#fff"/>`;
  // Cejas pobladas: preocupadas (más bajas por fuera) cuando está triste
  const cejas = triste
    ? `<path d="M25 42 Q26 32 36 30 Q44 29 47 33 L46 37 L43 36 L41 39 L38 37 L35 40 L32 38 L28 42 Z" fill="${crema}" ${L}/><path d="M75 42 Q74 32 64 30 Q56 29 53 33 L54 37 L57 36 L59 39 L62 37 L65 40 L68 38 L72 42 Z" fill="${crema}" ${L}/>`
    : `<path d="M24 37 Q25 27 36 27 Q44 28 47 33 L46 38 L43 36 L41 40 L38 37 L35 41 L32 38 L28 40 Z" fill="${crema}" ${L}/><path d="M76 37 Q75 27 64 27 Q56 28 53 33 L54 38 L57 36 L59 40 L62 37 L65 41 L68 38 L72 40 Z" fill="${crema}" ${L}/>`;
  const lentes = animo === 'lentes'
    ? `<path d="M27 38 H73" stroke="#1C1C24" stroke-width="2.5"/><path d="M29 37 H47 V42 Q47 50 38 50 Q29 50 29 42 Z M53 37 H71 V42 Q71 50 62 50 Q53 50 53 42 Z" fill="#1C1C24"/><path d="M33 41 L37 45 M57 41 L61 45" stroke="#fff" stroke-opacity=".4" stroke-width="2" stroke-linecap="round"/>`
    : '';
  const barba = `<path d="M30 50 Q22 51 21 60 Q19 69 26 75 Q29 83 38 86 L43 93 L47 87 L50 96 L53 87 L57 93 L62 86 Q71 83 74 75 Q81 69 79 60 Q78 51 70 50 Q62 53 56 49 Q50 52 44 49 Q38 53 30 50 Z" fill="${crema}" ${L}/>` +
    `<path d="M50 57 Q42 59 34 68 M50 57 Q58 59 66 68 M41 70 L40 80 M59 70 L60 80 M50 64 V 82 M27 62 L31 66 M73 62 L69 66" stroke="${cremaSombra}" stroke-width="1.4" stroke-linecap="round" fill="none"/>`;
  const puente = `<path d="M45 32 L55 32 L54 50 L46 50 Z" fill="${gris}"/>`;
  const nariz = `<path d="M43 50 Q50 45.5 57 50 Q56 56 50 57 Q44 56 43 50 Z" fill="#1C1C24"/><ellipse cx="47.5" cy="49.5" rx="2" ry="1.1" fill="#fff" opacity=".45"/>`;
  const extra = triste
    ? `<path d="M64 49 Q62 54 64 56 Q66 54 64 49 Z" fill="#7CC4FF" stroke="#3B82C4" stroke-width=".8"/><path d="M45 74 Q50 70 55 74" stroke="#9C8B6C" stroke-width="2" fill="none" stroke-linecap="round"/>`
    : '';
  const fondo = triste ? '#DCE6F2' : animo === 'lentes' ? '#FFE3EC' : '#E8E3FF';
  return envolver('Hashy', id, fondo, `${cuerpo}${orejas}${cabeza}${puente}${ojos}${barba}${nariz}${cejas}${lentes}${extra}`);
}

function envolver(nombre: string, id: string, fondo: string, contenido: string): string {
  return `<svg viewBox="0 0 100 100" width="100%" height="100%" role="img" aria-label="${nombre}"><defs><clipPath id="c${id}"><circle cx="50" cy="50" r="50"/></clipPath></defs><g clip-path="url(#c${id})"><rect width="100" height="100" fill="${fondo}"/>${contenido}</g></svg>`;
}
