// Dibujo del avatar en estilo caricatura con contorno, de cuerpo completo: manos en las
// bolsas, playera, pantalón y tenis (maqueta aprobada: docs/maquetas/avatar-nuevo.html).
// Se dibuja en un lienzo de 200 de ancho; la cabeza va centrada en x=100 y los pies en y≈418.
import type { Equipo } from './armario';
import type { Complexion, Peinado, Vello } from './personajes';

export interface Figura {
  nombre: string;
  piel: string;
  complexion: Complexion;
  peinado: Peinado;
  pelo: string;
  cejas?: string;       // si no se indica, del color del pelo
  vello: Vello;
  aretes: boolean;
  playera: string;      // color de la playera básica
  pantalon: string;     // color de los jeans
  tenis: string;        // color de los tenis clásicos
  fondo: string;        // fondo del círculo
}

// Encuadres (viewBox) para cada vista
export const ENCUADRE = {
  completo: '20 4 160 424',
  cara: '52 18 96 96',
  peinado: '40 0 120 120', gorro: '30 -6 140 120', lentes: '62 48 76 70',
  accesorio: '24 20 152 260', ropa: '24 118 152 152', pantalon: '30 238 140 160', tenis: '30 360 140 66',
} as const;

const L = '#1F1A22';
const ln = `stroke="${L}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"`;
// Línea sin relleno; si `extra` trae su propio stroke, ese manda (un atributo repetido se ignora)
const trazo = (ancho: number, extra = '') =>
  `fill="none" ${/\bstroke="/.test(extra) ? '' : `stroke="${L}" `}stroke-width="${ancho}" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" ${extra}`;

function oscurecer(hex: string, f: number): string {
  if (!hex.startsWith('#')) return hex;
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${[n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(v * f)).join(',')})`;
}
const esClaro = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return (n >> 16) + ((n >> 8) & 255) + (n & 255) > 600;
};
const espejo = 'transform="translate(200 0) scale(-1 1)"';

// ---------- Cuerpo ----------

const PLAYERA = 'M86 131 Q100 139 114 131 L140 137 Q152 141 156 155 L165 191 L146 198 L142 178 L141 250 Q100 256 59 250 L58 178 L54 198 L35 191 L44 155 Q48 141 60 137 Z';
const TORSO = 'M86 131 Q100 139 114 131 L140 137 Q152 141 156 155 L146 178 L142 178 L141 250 Q100 256 59 250 L58 178 L54 178 L44 155 Q48 141 60 137 Z';
const BRAZO = 'M38 192 C39 220 48 244 58 266 L74 260 C66 240 59 218 53 198 Z';
const MANGA_LARGA = 'M44 155 L35 191 C37 220 46 244 56 266 L74 260 C66 240 60 218 56 198 L58 178 Z';
const PANTALON = 'M59 246 L141 246 L143 300 L138 398 L106 398 L102 292 L98 292 L94 398 L62 398 L57 300 Z';

interface Ropa { color: string; larga: boolean; detalle?: (id: string) => string; puño?: string; mangas?: string }

function ropaDe(f: Figura, e: Equipo): Ropa {
  const clip = (id: string, dentro: string) => `<g clip-path="url(#${id}-t)">${dentro}</g>`;
  switch (e.ropa) {
    case 'sudadera': return {
      color: '#FF6B5B', larga: true, puño: '#D9503F',
      detalle: () => `<path d="M60 242 Q100 250 140 242" ${trazo(5, 'stroke="#D9503F" opacity=".9"')}/><path d="M86 131 Q100 145 114 131" ${trazo(4, 'stroke="#D9503F"')}/>`,
    };
    case 'cuadros': return {
      color: '#0E9F9A', larga: true, puño: '#0A6F6B',
      detalle: (id) => clip(id, [150, 170, 190, 210, 230].map((y) => `<path d="M30 ${y} H170" stroke="#06433F" stroke-width="3" opacity=".45"/>`).join('') +
        [70, 86, 114, 130].map((x) => `<path d="M${x} 120 V260" stroke="#06433F" stroke-width="3" opacity=".45"/>`).join('')) +
        `<path d="M88 132 L100 148 L112 132" fill="#F4F2EE" ${ln}/><path d="M100 148 V250" ${trazo(1.6)}/>${[165, 190, 215, 238].map((y) => `<circle cx="103" cy="${y}" r="1.6" fill="${L}"/>`).join('')}`,
    };
    case 'hawaiana': {
      const flor = (x: number, y: number, c: string) =>
        [0, 72, 144, 216, 288].map((a) => `<circle cx="${(x + Math.cos((a * Math.PI) / 180) * 4.5).toFixed(1)}" cy="${(y + Math.sin((a * Math.PI) / 180) * 4.5).toFixed(1)}" r="3.4" fill="${c}"/>`).join('') + `<circle cx="${x}" cy="${y}" r="2.4" fill="#FFB020"/>`;
      return {
        color: '#1BA39C', larga: false,
        detalle: (id) => clip(id, flor(72, 168, '#fff') + flor(124, 182, '#FF8FB1') + flor(82, 214, '#FF8FB1') + flor(128, 232, '#fff') + flor(104, 196, '#FFE27A') + flor(150, 162, '#FFE27A') + flor(48, 170, '#fff')) +
          `<path d="M88 132 L100 152 L112 132" fill="${f.piel}" ${ln}/>`,
      };
    }
    case 'chamarra': return {
      color: '#4A7BD0', larga: true, puño: '#3A62B0',
      detalle: () => `<path d="M88 133 L100 150 L112 133 L112 251 Q100 253 88 251 Z" fill="#F4F2EE" ${ln}/><path d="M88 133 L80 152 L92 150 Z M112 133 L120 152 L108 150 Z" fill="#3A62B0" ${ln}/>` +
        `<path d="M66 175 H82 V188 H66 Z M118 175 H134 V188 H118 Z" fill="none" ${trazo(1.6)}/><path d="M59 242 H88 M112 242 H141" ${trazo(4, 'stroke="#3A62B0"')}/>`,
    };
    case 'chaleco': return {
      color: f.playera, larga: false,
      detalle: () => `<path d="M60 140 L86 133 L100 150 L114 133 L140 140 L141 250 Q100 256 59 250 Z" fill="#FF8A3D" ${ln}/>` +
        [170, 195, 220].map((y) => `<path d="M60 ${y} Q100 ${y + 5} 140 ${y}" ${trazo(1.6, 'stroke="#C9601E"')}/>`).join('') + `<path d="M100 150 V253" ${trazo(2.2, 'stroke="#C9CDD2"')}/>`,
    };
    case 'hoodie': return {
      color: '#26252B', larga: true, puño: '#3A3940',
      detalle: () => `<path d="M80 132 Q100 156 120 132" ${trazo(7, 'stroke="#3A3940"')}/><path d="M94 146 L93 168 M106 146 L107 168" ${trazo(2.2, 'stroke="#7CF2C3"')}/>` +
        `<text x="100" y="206" text-anchor="middle" font-family="monospace" font-weight="700" font-size="22" fill="#7CF2C3">&lt;/&gt;</text><path d="M76 218 H124 L128 244 H72 Z" fill="none" ${trazo(1.6, 'stroke="#55545C"')}/>`,
    };
    case 'jersey': return {
      color: '#3A3658', larga: false, mangas: '#7CF2C3',
      detalle: () => `<path d="M86 131 Q100 141 114 131" ${trazo(4, 'stroke="#7CF2C3"')}/><text x="100" y="196" text-anchor="middle" font-family="monospace" font-weight="700" font-size="22" fill="#7CF2C3">SQL</text><text x="100" y="230" text-anchor="middle" font-family="monospace" font-weight="700" font-size="24" fill="#fff">01</text>`,
    };
    case 'varsity': return {
      color: '#6C4CF1', larga: true, puño: '#F3E9D2', mangas: '#F3E9D2',
      detalle: () => `<path d="M86 131 Q100 145 114 131" ${trazo(4, 'stroke="#F3E9D2"')}/><path d="M100 142 V252" ${trazo(1.6, 'stroke-dasharray="4 4"')}/>` +
        `<text x="78" y="190" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="26" fill="#F3E9D2" stroke="#FFB020" stroke-width="1.2">D</text><path d="M60 244 Q100 251 140 244" ${trazo(5, 'stroke="#F3E9D2"')}/>`,
    };
    case 'cuero': return {
      color: '#2A2838', larga: true, puño: '#45434F',
      detalle: () => `<path d="M88 133 L100 152 L112 133 L112 251 Q100 253 88 251 Z" fill="#F4F2EE" ${ln}/><path d="M88 133 L74 160 L92 156 Z M112 133 L126 160 L108 156 Z" fill="#45434F" ${ln}/>` +
        `<path d="M108 158 L104 250" ${trazo(2, 'stroke="#C9CDD2"')}/><path d="M66 200 H82" ${trazo(2.4, 'stroke="#C9CDD2"')}/>`,
    };
    case 'saco': return {
      color: '#2B3A67', larga: true, puño: '#F4F2EE',
      detalle: () => `<path d="M88 133 L100 196 L112 133 Z" fill="#F4F2EE" ${ln}/><path d="M97 136 L103 136 L105 176 L100 184 L95 176 Z" fill="#E0464B" ${ln}/>` +
        `<path d="M88 133 L78 166 L94 162 Z M112 133 L122 166 L106 162 Z" fill="#22305A" ${ln}/><circle cx="100" cy="214" r="2.4" fill="${L}"/><circle cx="100" cy="232" r="2.4" fill="${L}"/><path d="M68 170 H80" ${trazo(2.4, 'stroke="#F4F2EE"')}/>`,
    };
    default: return {
      color: f.playera, larga: false,
      detalle: () => `<path d="M86 131 Q100 147 114 131" ${trazo(2.6)}/>`,
    };
  }
}

function cuerpo(f: Figura, e: Equipo, id: string): string {
  const ancho = { delgada: 1, media: 1.08, llenita: 1.18 }[f.complexion];
  const esc = `transform="translate(100 0) scale(${ancho} 1) translate(-100 0)"`;
  const r = ropaDe(f, e);
  const manga = r.mangas ?? r.color;
  const sombra = (dentro: string) => `<g clip-path="url(#${id}-t)">${dentro}</g>`;

  // Brazos (piel o manga larga) detrás del torso
  let s = `<g ${esc}>`;
  const brazo = r.larga ? MANGA_LARGA : BRAZO;
  const colorBrazo = r.larga ? manga : f.piel;
  s += `<path d="${brazo}" fill="${colorBrazo}" ${ln}/><path d="${brazo}" ${espejo} fill="${colorBrazo}" ${ln}/>`;
  if (r.larga) s += `<path d="M47 236 L64 230" ${trazo(5, `stroke="${r.puño ?? oscurecer(manga, 0.8)}"`)}/><path d="M47 236 L64 230" ${trazo(5, `stroke="${r.puño ?? oscurecer(manga, 0.8)}" ${espejo}`)}/>`;
  if (e.accesorio === 'reloj') s += `<path d="M46 228 L63 222" ${trazo(6, 'stroke="#2A2838"')}/><circle cx="55" cy="225" r="3.4" fill="#7CF2C3" ${ln}/>`;

  // Torso: con mangas cortas, las mangas son parte de la playera
  s += `<clipPath id="${id}-t"><path d="${r.larga ? TORSO : PLAYERA}"/></clipPath>`;
  if (!r.larga && r.mangas) s += `<path d="${PLAYERA}" fill="${r.mangas}" ${ln}/><path d="${TORSO}" fill="${r.color}" ${ln}/>`;
  else s += `<path d="${r.larga ? TORSO : PLAYERA}" fill="${r.color}" ${ln}/>`;
  s += r.detalle?.(id) ?? '';
  s += sombra(`<path d="M118 128 L172 128 L172 262 L120 262 Q128 200 118 128 Z" fill="#000" opacity=".12"/>`);
  s += `<path d="M70 200 Q76 220 72 236 M128 200 Q124 218 128 236" ${trazo(1.4, 'opacity=".3"')}/>`;
  if (e.accesorio === 'mandil') s += `<path d="M72 160 L128 160 L132 262 Q100 268 68 262 Z" fill="#F4F2EE" ${ln}/><path d="M72 160 L86 133 M128 160 L114 133" ${trazo(3)}/><path d="M84 200 H116 V222 H84 Z" fill="none" ${trazo(1.6)}/>`;
  s += '</g>';

  // Pantalón (se ensancha igual que el torso)
  s += `<g ${esc}>${pantalon(f, e, id)}</g>`;
  return s;
}

function pantalon(f: Figura, e: Equipo, id: string): string {
  const sombra = `<g clip-path="url(#${id}-p)"><path d="M118 246 L152 246 L152 400 L118 400 Q126 320 118 246 Z" fill="#000" opacity=".14"/></g>`;
  const piernas = `<path d="M66 300 L93 300 L92 396 L67 396 Z" fill="${f.piel}" ${ln}/><path d="M66 300 L93 300 L92 396 L67 396 Z" ${espejo} fill="${f.piel}" ${ln}/>`;
  const conClip = (forma: string, color: string, extra = '') =>
    `<clipPath id="${id}-p"><path d="${forma}"/></clipPath><path d="${forma}" fill="${color}" ${ln}/>${sombra}${extra}`;
  switch (e.pantalon) {
    case 'shorts': {
      const forma = 'M59 246 L141 246 L143 300 L141 324 L104 324 L102 292 L98 292 L96 324 L59 324 L57 300 Z';
      return piernas + conClip(forma, '#8A7350', `<path d="M59 255 L141 255 M100 255 L100 284" ${trazo(1.8)}/>`);
    }
    case 'falda': {
      const forma = 'M60 246 L140 246 L152 328 Q100 338 48 328 Z';
      return piernas + conClip(forma, '#F0567A', `<path d="M60 256 L140 256" ${trazo(3, 'stroke="#C93D66"')}/><path d="M80 262 L74 330 M100 262 V334 M120 262 L126 330" ${trazo(1.4, 'opacity=".35"')}/>`);
    }
    case 'pants':
      return conClip(PANTALON, '#3A3658', `<path d="M60 250 L64 396 M140 250 L136 396" ${trazo(3, 'stroke="#fff" opacity=".85"')}/><path d="M59 255 L141 255" ${trazo(1.8)}/>`);
    case 'cargo':
      return conClip(PANTALON, '#7D7350', `<path d="M59 255 L141 255 M100 255 L100 286" ${trazo(1.8)}/><path d="M60 318 H76 V342 H60 Z M124 318 H140 V342 H124 Z" fill="#666047" ${ln}/>`);
    default:
      return conClip(PANTALON, f.pantalon,
        `<path d="M59 255 L141 255 M100 255 L100 286 M60 258 Q70 262 74 272 M140 258 Q130 262 126 272" ${trazo(1.8)}/><path d="M78 300 L79 390 M122 300 L121 390" ${trazo(1.2, 'opacity=".3"')}/>`);
  }
}

function tenis(f: Figura, e: Equipo): string {
  const [color, raya, cana] = ({
    rojos: ['#D93D48', '#F4F2EE', 0], altos: ['#6C4CF1', '#F4F2EE', 22], botas: ['#7A4A2B', '#4A2E1E', 26], neon: ['#C6F432', '#FF6BB5', 0],
  } as Record<string, [string, string, number]>)[e.tenis] ?? [f.tenis, esClaro(f.tenis) ? '#2A2838' : '#E8B53A', 0];
  const zapato = 'M60 391 L97 391 L99 411 Q99 418 93 418 L46 418 Q39 418 41 410 Q45 398 60 391 Z';
  const uno = `${cana ? `<path d="M61 ${391 - cana} L96 ${391 - cana} L97 393 L60 393 Z" fill="${color}" ${ln}/>` : ''}
    <path d="${zapato}" fill="${color}" ${ln}/>
    <path d="M41.5 411 L99 411 L99 413 Q99 418 93 418 L46 418 Q39 418 41.5 411 Z" fill="${e.tenis === 'botas' ? '#3A2416' : '#F4F1EA'}" ${ln}/>
    ${e.tenis === 'botas' ? '' : `<path d="M66 397 L74 407 M73 395 L81 405" ${trazo(3, `stroke="${raya}"`)}/>`}
    ${e.tenis === 'altos' ? `<path d="M68 376 H88 M68 383 H88" ${trazo(2, 'stroke="#fff"')}/>` : ''}`;
  return `<g>${uno}</g><g ${espejo}>${uno}</g>`;
}

// ---------- Cabeza ----------

function cabeza(f: Figura): { atras: string; frente: string } {
  const m = f.complexion === 'llenita' ? 4 : f.complexion === 'media' ? 2 : 0;
  const piel = f.piel, pelo = f.pelo;
  const cara = `M72 66 C70 ${90 + m} ${75 - m} 108 100 121 C${125 + m} 108 ${130 + m} ${90 + m} 128 66 C128 44 116 34 100 34 C84 34 72 44 72 66 Z`;
  const orejas = `<ellipse cx="${71 - m / 2}" cy="80" rx="7" ry="10" fill="${piel}" ${ln}/><ellipse cx="${129 + m / 2}" cy="80" rx="7" ry="10" fill="${piel}" ${ln}/>` +
    `<path d="M69 76 Q66 81 70 85 M131 76 Q134 81 130 85" ${trazo(1.4, 'opacity=".55"')}/>`;
  const cuello = `<path d="M90 108 L90 134 Q100 140 110 134 L110 108 Z" fill="${piel}" ${ln}/><path d="M90 117 Q100 127 110 117 L110 125 Q100 132 90 125 Z" fill="${oscurecer(piel, 0.86)}"/>`;
  const p = (d: string) => `<path d="${d}" fill="${pelo}" ${ln}/>`;

  let atras = '';
  let pelos = '';
  switch (f.peinado) {
    case 'corto':
      pelos = p('M70 72 C64 44 80 26 101 26 C122 27 135 42 130 72 C128 60 124 52 117 47 C107 52 90 52 81 47 C76 53 72 62 70 72 Z') + `<path d="M88 30 Q95 23 104 27" ${trazo(2.6)}/>`;
      break;
    case 'lado':
      pelos = p('M70 74 C62 42 84 23 107 27 C127 30 136 46 130 72 C126 58 120 49 109 43 C99 52 84 51 76 55 C73 61 71 67 70 74 Z') + `<path d="M84 36 Q96 34 107 43" ${trazo(1.5, 'opacity=".6"')}/>`;
      break;
    case 'rizado': {
      pelos = p('M70 70 C66 40 84 26 100 26 C116 26 134 40 130 70 Q100 50 70 70 Z');
      for (let i = 0; i <= 8; i++) {
        const a = Math.PI * (1.08 + (i / 8) * 0.84);
        pelos += `<circle cx="${(100 + Math.cos(a) * 31).toFixed(1)}" cy="${(64 + Math.sin(a) * 31).toFixed(1)}" r="9.5" fill="${pelo}" ${ln}/>`;
      }
      pelos += `<path d="M74 64 Q100 46 126 64 Q100 54 74 64 Z" fill="${pelo}"/>`;
      break;
    }
    case 'afro':
      atras = `<circle cx="100" cy="58" r="44" fill="${pelo}" ${ln}/>`;
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2;
        atras += `<circle cx="${(100 + Math.cos(a) * 42).toFixed(1)}" cy="${(58 + Math.sin(a) * 40).toFixed(1)}" r="9" fill="${pelo}"/>`;
      }
      pelos = p('M72 66 C70 46 84 38 100 38 C116 38 130 46 128 66 Q100 52 72 66 Z');
      break;
    case 'largo':
      atras = p('M70 60 C62 90 60 128 64 150 Q100 160 136 150 C140 128 138 90 130 60 Z');
      pelos = p('M71 76 C64 44 82 27 100 27 C118 27 136 44 129 76 C126 60 116 46 100 44 C84 46 74 60 71 76 Z') + `<path d="M100 29 L100 44" ${trazo(1.5, 'opacity=".6"')}/>`;
      break;
    case 'cola':
      atras = p('M120 44 C152 50 156 104 140 134 C134 112 132 84 116 62 Z');
      pelos = p('M71 70 C66 42 82 30 100 30 C118 30 134 42 129 70 C124 56 114 46 100 46 C86 46 76 56 71 70 Z') + `<circle cx="127" cy="50" r="5" fill="#FF6B5B" ${ln}/>`;
      break;
    case 'chongo':
      pelos = `<circle cx="100" cy="24" r="13" fill="${pelo}" ${ln}/>` + p('M71 70 C66 44 82 32 100 32 C118 32 134 44 129 70 C124 56 114 46 100 46 C86 46 76 56 71 70 Z');
      break;
    case 'rapado':
      pelos = `<path d="M72 64 C70 42 84 32 100 32 C116 32 130 42 128 64 C122 52 112 46 100 46 C88 46 78 52 72 64 Z" fill="${pelo}" opacity=".75" ${ln}/>`;
      break;
    case 'calvo':
      pelos = `<path d="M86 42 Q92 38 98 40" ${trazo(3, 'stroke="#fff" opacity=".45"')}/>`;
      break;
    case 'bob':
      atras = p('M66 58 C60 90 62 114 70 122 L130 122 C138 114 140 90 134 58 Z');
      pelos = p('M70 74 C64 42 82 27 100 27 C118 27 136 42 130 74 L126 62 Q100 56 74 62 Z');
      break;
    case 'trenzas':
      for (const x of [68, 132]) {
        for (let i = 0; i < 6; i++) atras += `<ellipse cx="${x + (x < 100 ? -2 : 2)}" cy="${98 + i * 13}" rx="7" ry="8" fill="${pelo}" ${ln}/>`;
        atras += `<circle cx="${x + (x < 100 ? -2 : 2)}" cy="${180}" r="4" fill="#FF6B5B" ${ln}/>`;
      }
      pelos = p('M71 76 C64 44 82 27 100 27 C118 27 136 44 129 76 C126 60 116 46 100 44 C84 46 74 60 71 76 Z') + `<path d="M100 29 L100 44" ${trazo(1.5, 'opacity=".6"')}/>`;
      break;
    case 'coletas':
      atras = `<circle cx="62" cy="56" r="14" fill="${pelo}" ${ln}/><circle cx="138" cy="56" r="14" fill="${pelo}" ${ln}/>`;
      pelos = p('M71 70 C66 42 82 30 100 30 C118 30 134 42 129 70 C124 56 114 46 100 46 C86 46 76 56 71 70 Z') + `<path d="M100 31 V46" ${trazo(1.5, 'opacity=".6"')}/>`;
      break;
    case 'copete':
      pelos = p('M70 72 C62 40 76 12 104 12 C130 12 140 34 130 72 C126 56 118 46 110 44 C100 50 84 50 76 52 C73 58 71 65 70 72 Z') + `<path d="M84 22 Q100 14 118 22" ${trazo(1.6, 'opacity=".6"')}/>`;
      break;
    case 'picos':
      pelos = p('M70 70 L66 44 L78 46 L76 26 L90 36 L96 16 L106 34 L118 20 L120 40 L134 38 L130 70 C124 54 112 48 100 48 C88 48 76 56 70 70 Z');
      break;
    case 'rastas':
      for (const x of [66, 74, 126, 134]) atras += `<path d="M${x} 56 Q${x + (x < 100 ? -6 : 6)} 110 ${x + (x < 100 ? -2 : 2)} 150" ${trazo(9, `stroke="${pelo}"`)}/>`;
      pelos = p('M70 72 C64 42 82 28 100 28 C118 28 136 42 130 72 C126 58 116 48 100 48 C84 48 74 58 70 72 Z');
      break;
    case 'cresta':
      pelos = `<path d="M72 64 C70 42 84 32 100 32 C116 32 130 42 128 64 C122 52 112 46 100 46 C88 46 78 52 72 64 Z" fill="${pelo}" opacity=".5"/>` + p('M92 50 L88 12 Q100 2 112 12 L108 50 Z');
      break;
  }

  const cejas = f.cejas ?? (f.peinado === 'calvo' ? oscurecer(piel, 0.55) : pelo);
  const bigote = `<path d="M89 100 Q100 94 111 100 Q105 103 100 101 Q95 103 89 100 Z" fill="${pelo}" ${ln}/>`;
  const vello = {
    nada: '',
    bigote,
    candado: bigote + `<path d="M92 110 Q100 114 108 110 L107 119 Q100 123 93 119 Z" fill="${pelo}" ${ln}/>`,
    barba: `<path d="M73 86 C75 ${108 + m} 86 124 100 125 C114 124 ${125 + m} ${108 + m} 127 86 C123 99 117 108 110 109 Q100 104 90 109 C83 108 77 99 73 86 Z" fill="${pelo}" ${ln}/>` + bigote,
  }[f.vello];
  const rostro = `<path d="${cara}" fill="${piel}" ${ln}/>` +
    `<ellipse cx="82" cy="98" rx="5" ry="3" fill="#E8826E" opacity=".25"/><ellipse cx="118" cy="98" rx="5" ry="3" fill="#E8826E" opacity=".25"/>` +
    vello +
    `<ellipse cx="88" cy="83" rx="3.4" ry="4.2" fill="${L}"/><ellipse cx="112" cy="83" rx="3.4" ry="4.2" fill="${L}"/>` +
    `<circle cx="89.2" cy="81.6" r="1.2" fill="#fff"/><circle cx="113.2" cy="81.6" r="1.2" fill="#fff"/>` +
    `<path d="M80 73 Q87 68 95 72 M105 72 Q113 68 120 73" fill="none" stroke="${cejas}" stroke-width="3.6" stroke-linecap="round"/>` +
    `<path d="M100 87 Q97 95 100 97 Q103 98 105 95" ${trazo(1.7)}/>` +
    `<path d="M91 105 Q101 111 110 103" ${trazo(2.2)}/>` +
    (f.aretes ? `<circle cx="${70 - m / 2}" cy="92" r="2.6" fill="#FFB020" ${ln}/><circle cx="${130 + m / 2}" cy="92" r="2.6" fill="#FFB020" ${ln}/>` : '');

  return { atras, frente: `${cuello}${orejas}${rostro}${pelos}` };
}

function lentes(e: Equipo): string {
  switch (e.lentes) {
    case 'cuadrados': return `<g fill="#fff" fill-opacity=".18" stroke="${L}" stroke-width="3"><rect x="77" y="74" width="21" height="16" rx="4"/><rect x="102" y="74" width="21" height="16" rx="4"/></g>` +
      `<path d="M98 80 Q100 78 102 80 M77 79 L72 77 M123 79 L128 77" ${trazo(2.6)}/>`;
    case 'redondos': return `<g fill="#fff" fill-opacity=".18" stroke="${L}" stroke-width="2.6"><circle cx="88" cy="83" r="9.5"/><circle cx="112" cy="83" r="9.5"/></g>` +
      `<path d="M97.5 81 Q100 79 102.5 81 M78.5 81 L72 78 M121.5 81 L128 78" ${trazo(2.4)}/>`;
    case 'sol': return `<path d="M76 75 H98 V82 Q98 92 87 92 Q76 92 76 82 Z M102 75 H124 V82 Q124 92 113 92 Q102 92 102 82 Z" fill="#1C1B22" ${ln}/>` +
      `<path d="M98 78 H102 M76 77 L72 76 M124 77 L128 76" ${trazo(2.6)}/><path d="M80 79 L85 85 M106 79 L111 85" stroke="#fff" stroke-opacity=".45" stroke-width="2" stroke-linecap="round"/>`;
    case 'pasta': return `<g fill="#fff" fill-opacity=".15" stroke="#B3262E" stroke-width="4.4"><rect x="76" y="73" width="22" height="17" rx="5"/><rect x="102" y="73" width="22" height="17" rx="5"/></g>` +
      `<path d="M98 79 H102 M76 78 L71 76 M124 78 L129 76" fill="none" stroke="#B3262E" stroke-width="3.4" stroke-linecap="round"/>`;
    default: return '';
  }
}

function gorro(e: Equipo): string {
  switch (e.gorro) {
    case 'gorra': return `<path d="M70 62 C68 36 84 22 100 22 C116 22 132 36 130 62 Q100 54 70 62 Z" fill="#FF6B5B" ${ln}/>` +
      `<path d="M98 56 Q130 50 154 60 Q132 68 98 64 Z" fill="#C94B3E" ${ln}/><circle cx="100" cy="23" r="3" fill="#C94B3E" ${ln}/><path d="M100 24 Q98 40 100 56" ${trazo(1.4, 'opacity=".5"')}/>`;
    case 'bandana': return `<path d="M70 56 Q100 42 130 56 L130 66 Q100 52 70 66 Z" fill="#E0464B" ${ln}/>` +
      [80, 92, 104, 116].map((x) => `<circle cx="${x}" cy="${55 - (x === 92 || x === 104 ? 2 : 0)}" r="1.6" fill="#fff"/>`).join('') +
      `<path d="M129 58 L144 54 L140 66 Z M129 62 L142 74 L132 72 Z" fill="#C93A40" ${ln}/>`;
    case 'lana': return `<path d="M68 66 C66 30 84 16 100 16 C116 16 134 30 132 66 Z" fill="#0E9F9A" ${ln}/>` +
      `<rect x="66" y="54" width="68" height="14" rx="6" fill="#0A7773" ${ln}/><circle cx="100" cy="14" r="8" fill="#FFB020" ${ln}/>` +
      [80, 90, 100, 110, 120].map((x) => `<path d="M${x} 56 V66" ${trazo(1.2, 'opacity=".4"')}/>`).join('');
    case 'boina': return `<ellipse cx="104" cy="42" rx="36" ry="13" transform="rotate(-8 104 42)" fill="#2A2838" ${ln}/><circle cx="106" cy="28" r="3" fill="#2A2838" ${ln}/>`;
    case 'sombrero': return `<ellipse cx="100" cy="58" rx="54" ry="10" fill="#C9A26B" ${ln}/>` +
      `<path d="M74 58 C74 30 86 20 100 20 C114 20 126 30 126 58 Z" fill="#D9B27B" ${ln}/><path d="M75 48 H125 V56 H75 Z" fill="#B23A2B" ${ln}/>`;
    case 'corona': return `<path d="M76 46 L76 18 L89 32 L100 10 L111 32 L124 18 L124 46 Z" fill="#FFC531" ${ln}/>` +
      `<circle cx="100" cy="34" r="4" fill="#7CF2C3" ${ln}/><circle cx="85" cy="40" r="2.6" fill="#FF6B5B"/><circle cx="115" cy="40" r="2.6" fill="#B9A8FF"/>`;
    default: return '';
  }
}

function accesorios(e: Equipo): string {
  switch (e.accesorio) {
    case 'bufanda': return `<path d="M84 126 Q100 142 116 126 L118 138 Q100 154 82 138 Z" fill="#FFB020" ${ln}/><path d="M104 140 L102 186 L116 186 L114 138 Z" fill="#E09A10" ${ln}/>` +
      `<path d="M104 178 H115 M104 170 H115" ${trazo(1.4, 'opacity=".4"')}/>`;
    case 'collar': return `<path d="M88 134 Q100 160 112 134" fill="none" stroke="#E3B341" stroke-width="3" stroke-dasharray="3 2"/><circle cx="100" cy="153" r="5" fill="#E3B341" ${ln}/>`;
    case 'gafete': return `<path d="M88 134 L96 184 M112 134 L104 184" ${trazo(2.4, 'stroke="#6C4CF1"')}/>` +
      `<rect x="88" y="182" width="24" height="30" rx="3" fill="#fff" ${ln}/><rect x="93" y="187" width="14" height="10" rx="2" fill="#D9A27A"/>` +
      `<text x="100" y="207" text-anchor="middle" font-family="monospace" font-weight="700" font-size="7" fill="#2A2838">DATA</text>`;
    case 'audifonos': return `<path d="M66 82 Q64 28 100 26 Q136 28 134 82" ${trazo(6, 'stroke="#2A2838"')}/>` +
      `<rect x="58" y="70" width="14" height="22" rx="6" fill="#6C4CF1" ${ln}/><rect x="128" y="70" width="14" height="22" rx="6" fill="#6C4CF1" ${ln}/>`;
    default: return '';
  }
}

// Dibuja la figura completa (sin envoltura <svg>)
export function dibujarFigura(f: Figura, e: Equipo, id: string): string {
  // Con gorro, los peinados altos se aplastan: si no, saldrían por encima del gorro
  const alto = ['copete', 'picos', 'cresta', 'chongo'].includes(f.peinado);
  const { atras, frente } = cabeza(alto && !['ninguno', 'bandana'].includes(e.gorro) ? { ...f, peinado: 'corto' } : f);
  return `<ellipse cx="100" cy="418" rx="64" ry="6" fill="#000" opacity=".12"/>` +
    atras + cuerpo(f, e, id) + tenis(f, e) + frente + lentes(e) + accesorios(e) + gorro(e);
}

// Envuelve la figura en un <svg> con el encuadre pedido; `circulo` la recorta en círculo con fondo
export function svgFigura(f: Figura, e: Equipo, id: string, encuadre: string, circulo = false): string {
  const [x, y, ancho, alto] = encuadre.split(' ').map(Number);
  const marco = circulo
    ? `<defs><clipPath id="c${id}"><circle cx="${x + ancho / 2}" cy="${y + alto / 2}" r="${ancho / 2}"/></clipPath></defs><g clip-path="url(#c${id})"><rect x="${x}" y="${y}" width="${ancho}" height="${alto}" fill="${f.fondo}"/>`
    : '<g>';
  // En el círculo las líneas se encogen con el dibujo: con grosor fijo, a 40 px la cara se vuelve una mancha
  const dibujo = circulo ? dibujarFigura(f, e, id).replace(/ vector-effect="non-scaling-stroke"/g, '') : dibujarFigura(f, e, id);
  return `<svg viewBox="${encuadre}" width="100%" height="100%" role="img" aria-label="${f.nombre}">${marco}${dibujo}</g></svg>`;
}
