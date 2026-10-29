import type { Equipo } from './armario';
import type { Figura } from './figura';

// Elenco de la ruta (docs/estilo-y-personajes.md). Todos se dibujan con SVG en el mismo
// estilo de caricatura con contorno (figura.ts): pesan casi nada y funcionan sin conexión.
//   yo     → el avatar que cada alumno arma en su perfil (protagonista)
//   hashy  → schnauzer que da tips y se pone triste cuando te equivocas
//   rafa   → Don Rafa, dueño de la tienda; y el elenco secundario

export const PIELES = ['#F7D9C4', '#EFC3A0', '#D9A27A', '#B87A50', '#8A5634', '#5E3A22'] as const;
export const COLORES_PELO = ['#211A17', '#4A2F21', '#7B5634', '#A5492B', '#D7B46E', '#B9B3AA'] as const;
// Playera básica (los primeros seis conservan el orden del "color favorito" anterior)
export const PLAYERAS = ['#6C4CF1', '#FF6B5B', '#0E9F9A', '#E8A317', '#2B4BEE', '#2F3A4A', '#C2302B', '#F2EFE8'] as const;
export const PANTALONES = ['#3F6C93', '#2A3E5C', '#2B2A2E', '#B49A72', '#5A6B4A'] as const;
export const TENIS = ['#26252B', '#F4F2EE', '#C2302B', '#6C4CF1'] as const;

export const COMPLEXIONES = { delgada: 'Delgada', media: 'Media', llenita: 'Llenita' } as const;
export type Complexion = keyof typeof COMPLEXIONES;
export const VELLO = { nada: 'Nada', bigote: 'Bigote', candado: 'Candado', barba: 'Barba' } as const;
export type Vello = keyof typeof VELLO;

export const PEINADOS = {
  corto: 'Corto', lado: 'De lado', rizado: 'Rizado', afro: 'Afro', largo: 'Largo', cola: 'Cola de caballo',
  chongo: 'Chongo', rapado: 'Rapado', calvo: 'Sin pelo',
  // Se desbloquean con XP en el clóset (precios en armario.ts)
  bob: 'Bob', trenzas: 'Trenzas', coletas: 'Coletas', copete: 'Copete', picos: 'Picos', rastas: 'Rastas', cresta: 'Cresta',
} as const;
export type Peinado = keyof typeof PEINADOS;

// Peinados del avatar anterior → el más parecido del estilo nuevo
const PEINADO_ANTERIOR: Record<string, Peinado> = {
  ondulado: 'corto', rizos: 'rizado', fleco: 'lado', entradas: 'rapado', chongos: 'coletas', raya: 'lado',
};

// Lo que guarda el perfil del alumno (progreso.perfil)
export interface Perfil {
  nombre: string;
  piel: number;
  complexion?: Complexion;
  peinado: string;
  pelo: number;
  vello?: Vello;
  aretes: boolean;
  ropa: number;         // color de la playera básica
  pantalon?: number;    // color de los jeans
  tenis?: number;       // color de los tenis clásicos
  equipo?: Equipo;      // lo que trae puesto (clóset)
  // Versión anterior del avatar: se leen solo si faltan los campos nuevos
  llenito?: boolean;
  barba?: boolean;
  bigote?: boolean;
  lentes?: boolean;
}

export const PERFIL_INICIAL: Perfil = {
  nombre: '', piel: 1, complexion: 'delgada', peinado: 'corto', pelo: 0, vello: 'nada',
  aretes: false, ropa: 6, pantalon: 0, tenis: 0,
};

export const complexionDe = (p: Perfil): Complexion => p.complexion ?? (p.llenito ? 'llenita' : 'delgada');
export const velloDe = (p: Perfil): Vello => p.vello ?? (p.barba ? 'barba' : p.bigote ? 'bigote' : 'nada');
export const peinadoDe = (p: Perfil): Peinado =>
  p.peinado in PEINADOS ? (p.peinado as Peinado) : PEINADO_ANTERIOR[p.peinado] ?? 'corto';

// Mezcla un color con blanco: fondo pastel del círculo
export function pastel(hex: string, f = 0.78): string {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(v + (255 - v) * f));
  return `rgb(${c.join(',')})`;
}

export function figuraDePerfil(p: Perfil): Figura {
  const playera = PLAYERAS[p.ropa] ?? PLAYERAS[6];
  return {
    nombre: p.nombre || 'Tú',
    piel: PIELES[p.piel] ?? PIELES[1],
    complexion: complexionDe(p),
    peinado: peinadoDe(p),
    pelo: COLORES_PELO[p.pelo] ?? COLORES_PELO[0],
    vello: velloDe(p),
    aretes: p.aretes,
    playera,
    pantalon: PANTALONES[p.pantalon ?? 0] ?? PANTALONES[0],
    tenis: TENIS[p.tenis ?? 0] ?? TENIS[0],
    fondo: pastel(playera),
  };
}

const p = (i: number) => PIELES[i];
const base = { aretes: false, vello: 'nada', complexion: 'delgada', pantalon: '#3F6C93', tenis: '#F4F2EE' } as const;
const sinNada: Equipo = { ropa: 'playera', pantalon: 'jeans', tenis: 'blancos', gorro: 'ninguno', lentes: 'ninguno', accesorio: 'ninguno' };

// Elenco: su figura y lo que trae puesto
export const ELENCO = {
  rafa: { figura: { ...base, nombre: 'Don Rafa', piel: p(2), complexion: 'llenita', peinado: 'rapado', pelo: '#B9B3AA', cejas: '#8E877C', vello: 'bigote', playera: '#FF6B5B', fondo: '#FFE3A8' }, equipo: { ...sinNada, accesorio: 'mandil' } },
  lupita: { figura: { ...base, nombre: 'Lupita', piel: p(0), peinado: 'rizado', pelo: '#A5492B', aretes: true, playera: '#6C4CF1', fondo: '#E7E0FF' }, equipo: sinNada },
  kemi: { figura: { ...base, nombre: 'Kemi', piel: p(5), complexion: 'llenita', peinado: 'afro', pelo: '#211A17', playera: '#E8A317', fondo: '#D7F7EA' }, equipo: sinNada },
  sofia: { figura: { ...base, nombre: 'Sofía', piel: p(1), peinado: 'largo', pelo: '#211A17', playera: '#0E9F9A', fondo: '#FFE0DC' }, equipo: { ...sinNada, lentes: 'redondos' } },
  beto: { figura: { ...base, nombre: 'Beto', piel: p(0), complexion: 'llenita', peinado: 'calvo', pelo: '#7B5634', vello: 'barba', playera: '#2B4BEE', fondo: '#DDEBFF' }, equipo: sinNada },
  mariana: { figura: { ...base, nombre: 'Mariana', piel: p(4), peinado: 'trenzas', pelo: '#211A17', aretes: true, playera: '#F0567A', fondo: '#FFF1C9' }, equipo: sinNada },
  jun: { figura: { ...base, nombre: 'Jun', piel: p(1), peinado: 'lado', pelo: '#211A17', playera: '#4B2FC9', fondo: '#E2F4FF' }, equipo: sinNada },
  chela: { figura: { ...base, nombre: 'Doña Chela', piel: p(3), complexion: 'llenita', peinado: 'chongo', pelo: '#D9D4CC', cejas: '#A9A398', playera: '#0A7773', fondo: '#F3E6FF' }, equipo: { ...sinNada, lentes: 'redondos' } },
  tono: { figura: { ...base, nombre: 'Toño', piel: p(3), peinado: 'corto', pelo: '#2A2420', vello: 'candado', playera: '#3A3658', fondo: '#FFE3D1' }, equipo: sinNada },
} satisfies Record<string, { figura: Figura; equipo: Equipo }>;

export type Quien = keyof typeof ELENCO | 'yo' | 'hashy';
export type Animo = 'feliz' | 'triste' | 'lentes';

export function nombreDe(quien: Quien, perfil?: Perfil): string {
  if (quien === 'yo') return perfil?.nombre || 'Tú';
  if (quien === 'hashy') return 'Hashy';
  return ELENCO[quien].figura.nombre;
}

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
