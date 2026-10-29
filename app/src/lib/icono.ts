// Ícono del avatar en círculo (barra del mapa, chat de las lecciones, clóset): plano, sin contorno
// y sin cara, como la imagen de referencia del piloto. Cabeza grande, orejas, pelo, cuello y
// hombros con la playera. Usa los mismos datos que la figura completa (figura.ts).
import type { Equipo } from './armario';
import type { Figura } from './figura';

function tono(hex: string, f: number): string {
  if (!hex.startsWith('#')) return hex;
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(f >= 1 ? v + (255 - v) * (f - 1) : v * f))));
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
}

// Color de la parte de arriba según lo que trae puesto (la playera usa su color favorito)
const ROPA: Record<string, string> = {
  sudadera: '#FF6B5B', cuadros: '#0E9F9A', hawaiana: '#1BA39C', chamarra: '#4A7BD0', chaleco: '#FF8A3D',
  hoodie: '#26252B', jersey: '#3A3658', varsity: '#6C4CF1', cuero: '#2A2838', saco: '#2B3A67',
};

// Cabeza: centro (50, 47), de 31 a 69 de ancho y de 22 a 72 de alto
const CABEZA = 'M31 42 Q31 22 50 22 Q69 22 69 42 L69 54 Q69 71 50 72 Q31 71 31 54 Z';

function pelo(f: Figura): { atras: string; frente: string } {
  const p = f.pelo, brillo = tono(p, 1.25);
  const raya = (d: string) => `<path d="${d}" fill="none" stroke="${brillo}" stroke-width="2.2" stroke-linecap="round" opacity=".7"/>`;
  const corto = `<path d="M29 48 Q25 26 40 19 Q36 14 47 13 Q66 11 72 27 Q75 37 71 49 L69 38 Q63 31 52 32 Q44 26 36 34 Q31 38 31 48 Z" fill="${p}"/>` + raya('M46 17 Q58 15 66 24');
  switch (f.peinado) {
    case 'lado':
    case 'copete':
    case 'picos':
      return { atras: '', frente: `<path d="M29 48 Q24 24 44 15 Q54 10 64 15 Q76 22 71 49 L69 36 Q60 28 46 33 Q36 36 31 48 Z" fill="${p}"/>` +
        (f.peinado === 'picos' ? `<path d="M36 22 L38 9 L45 18 L50 6 L55 18 L63 8 L64 22 Z" fill="${p}"/>` : f.peinado === 'copete' ? `<path d="M38 22 Q40 6 58 8 Q68 10 66 22 Z" fill="${p}"/>` : '') + raya('M40 20 Q52 14 64 20') };
    case 'cresta':
      return { atras: '', frente: `<path d="M31 44 Q31 24 50 23 Q69 24 69 44 Q62 32 50 31 Q38 32 31 44 Z" fill="${p}" opacity=".5"/><path d="M45 31 L43 8 Q50 3 57 8 L55 31 Z" fill="${p}"/>` };
    case 'rizado':
    case 'afro': {
      const r = f.peinado === 'afro' ? 9 : 7;
      const ancho = f.peinado === 'afro' ? 25 : 21;
      let s = `<ellipse cx="50" cy="34" rx="${ancho}" ry="${f.peinado === 'afro' ? 19 : 14}" fill="${p}"/>`;
      for (let i = 0; i <= 8; i++) {
        const a = Math.PI * (1 + i / 8);
        s += `<circle cx="${(50 + Math.cos(a) * ancho).toFixed(1)}" cy="${(36 + Math.sin(a) * (ancho - 3)).toFixed(1)}" r="${r}" fill="${p}"/>`;
      }
      return { atras: f.peinado === 'afro' ? `<circle cx="50" cy="40" r="30" fill="${p}"/>` : '', frente: s };
    }
    case 'largo':
    case 'bob':
    case 'trenzas':
    case 'rastas': {
      const largo = f.peinado === 'bob' ? 66 : 84;
      let atras = `<path d="M27 44 Q26 20 50 18 Q74 20 73 44 L${f.peinado === 'bob' ? 72 : 75} ${largo} L${f.peinado === 'bob' ? 28 : 25} ${largo} Z" fill="${p}"/>`;
      if (f.peinado === 'trenzas') atras = [27, 73].map((x) => [0, 1, 2, 3].map((k) => `<ellipse cx="${x}" cy="${58 + k * 8}" rx="5" ry="5" fill="${p}"/>`).join('')).join('') + `<path d="M28 44 Q27 20 50 18 Q73 20 72 44 L72 56 L28 56 Z" fill="${p}"/>`;
      if (f.peinado === 'rastas') atras = [26, 31, 69, 74].map((x) => `<rect x="${x - 2.5}" y="34" width="5" height="50" rx="2.5" fill="${p}"/>`).join('') + `<path d="M28 44 Q27 20 50 18 Q73 20 72 44 Z" fill="${p}"/>`;
      return { atras, frente: `<path d="M30 46 Q28 22 50 20 Q72 22 70 46 Q66 32 52 30 L50 26 L48 30 Q34 32 30 46 Z" fill="${p}"/>` };
    }
    case 'cola':
      return { atras: `<path d="M64 26 Q86 30 82 60 Q78 46 66 40 Z" fill="${p}"/>`, frente: `<path d="M30 44 Q29 22 50 20 Q71 22 70 44 Q64 30 50 30 Q36 30 30 44 Z" fill="${p}"/><circle cx="67" cy="28" r="3" fill="#FF6B5B"/>` };
    case 'coletas':
      return { atras: `<circle cx="27" cy="34" r="9" fill="${p}"/><circle cx="73" cy="34" r="9" fill="${p}"/>`, frente: `<path d="M30 44 Q29 22 50 20 Q71 22 70 44 Q64 30 50 30 Q36 30 30 44 Z" fill="${p}"/>` };
    case 'chongo':
      return { atras: '', frente: `<circle cx="50" cy="15" r="8" fill="${p}"/><path d="M30 44 Q29 22 50 20 Q71 22 70 44 Q64 30 50 30 Q36 30 30 44 Z" fill="${p}"/>` };
    case 'rapado':
      return { atras: '', frente: `<path d="M31 42 Q31 22 50 22 Q69 22 69 42 Q64 30 50 29 Q36 30 31 42 Z" fill="${p}" opacity=".55"/>` };
    case 'calvo':
      return { atras: '', frente: `<ellipse cx="43" cy="28" rx="6" ry="3" fill="#fff" opacity=".25"/>` };
    default:
      return { atras: '', frente: corto };
  }
}

function vello(f: Figura): string {
  const c = f.pelo;
  const bigote = `<path d="M42 59 Q50 55 58 59 Q54 61 50 60 Q46 61 42 59 Z" fill="${c}"/>`;
  switch (f.vello) {
    case 'bigote': return bigote;
    case 'candado': return bigote + `<path d="M45 65 Q50 67 55 65 L54 71 Q50 73 46 71 Z" fill="${c}"/>`;
    case 'barba': return `<path d="M31 50 Q32 68 42 71 Q50 75 58 71 Q68 68 69 50 Q66 60 58 62 Q50 58 42 62 Q34 60 31 50 Z" fill="${c}"/>` + bigote;
    default: return '';
  }
}

function lentes(e: Equipo): string {
  switch (e.lentes) {
    case 'cuadrados': return `<g fill="#fff" fill-opacity=".25" stroke="#26252B" stroke-width="2.4"><rect x="35" y="43" width="12" height="9" rx="2.5"/><rect x="53" y="43" width="12" height="9" rx="2.5"/></g><path d="M47 47 H53" stroke="#26252B" stroke-width="2"/>`;
    case 'redondos': return `<g fill="#fff" fill-opacity=".25" stroke="#26252B" stroke-width="2.2"><circle cx="41" cy="48" r="6"/><circle cx="59" cy="48" r="6"/></g><path d="M47 47 H53" stroke="#26252B" stroke-width="2"/>`;
    case 'sol': return `<path d="M34 43 H48 V47 Q48 54 41 54 Q34 54 34 47 Z M52 43 H66 V47 Q66 54 59 54 Q52 54 52 47 Z" fill="#1C1B22"/><path d="M48 45 H52" stroke="#1C1B22" stroke-width="2"/><path d="M37 46 L40 50 M55 46 L58 50" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".45"/>`;
    case 'pasta': return `<g fill="#fff" fill-opacity=".2" stroke="#B3262E" stroke-width="3.2"><rect x="34" y="42" width="13" height="10" rx="3"/><rect x="53" y="42" width="13" height="10" rx="3"/></g><path d="M47 46 H53" stroke="#B3262E" stroke-width="2.6"/>`;
    default: return '';
  }
}

function gorro(e: Equipo): string {
  switch (e.gorro) {
    case 'gorra': return `<path d="M29 40 Q28 17 50 16 Q72 17 71 40 Q50 34 29 40 Z" fill="#FF6B5B"/><path d="M50 36 Q72 32 88 40 Q72 44 50 41 Z" fill="#D9503F"/><circle cx="50" cy="17" r="2" fill="#D9503F"/>`;
    case 'bandana': return `<path d="M29 36 Q50 26 71 36 L71 42 Q50 32 29 42 Z" fill="#E0464B"/><path d="M70 37 L80 34 L77 42 Z" fill="#C93A40"/>`;
    case 'lana': return `<path d="M28 42 Q27 13 50 12 Q73 13 72 42 Z" fill="#0E9F9A"/><rect x="27" y="35" width="46" height="9" rx="4" fill="#0A7773"/><circle cx="50" cy="11" r="6" fill="#FFB020"/>`;
    case 'boina': return `<ellipse cx="52" cy="25" rx="25" ry="9" transform="rotate(-8 52 25)" fill="#2A2838"/>`;
    case 'sombrero': return `<ellipse cx="50" cy="36" rx="36" ry="7" fill="#C9A26B"/><path d="M33 36 Q33 14 50 14 Q67 14 67 36 Z" fill="#D9B27B"/><rect x="33" y="29" width="34" height="5" fill="#B23A2B"/>`;
    case 'corona': return `<path d="M35 28 L35 10 L43 19 L50 5 L57 19 L65 10 L65 28 Z" fill="#FFC531"/><circle cx="50" cy="21" r="2.6" fill="#7CF2C3"/>`;
    default: return '';
  }
}

function accesorio(e: Equipo): string {
  switch (e.accesorio) {
    case 'audifonos': return `<path d="M28 50 Q26 17 50 16 Q74 17 72 50" fill="none" stroke="#2A2838" stroke-width="4"/><rect x="23" y="44" width="9" height="14" rx="4" fill="#6C4CF1"/><rect x="68" y="44" width="9" height="14" rx="4" fill="#6C4CF1"/>`;
    case 'bufanda': return `<path d="M38 78 Q50 86 62 78 L63 85 Q50 93 37 85 Z" fill="#FFB020"/>`;
    case 'collar': return `<path d="M42 80 Q50 92 58 80" fill="none" stroke="#E3B341" stroke-width="2" stroke-dasharray="2 1.5"/>`;
    case 'gafete': return `<path d="M42 79 L47 100 M58 79 L53 100" stroke="#6C4CF1" stroke-width="2"/>`;
    case 'mandil': return `<path d="M36 86 H64 V100 H36 Z" fill="#F4F2EE"/><path d="M36 86 L42 78 M64 86 L58 78" stroke="#F4F2EE" stroke-width="2.4"/>`;
    default: return '';
  }
}

export function svgIcono(f: Figura, e: Equipo, id: string): string {
  const piel = f.piel, sombra = tono(piel, 0.86);
  const ropa = e.ropa === 'playera' ? f.playera : ROPA[e.ropa] ?? f.playera;
  const { atras, frente } = pelo(gorro(e) && ['copete', 'picos', 'cresta', 'chongo', 'afro'].includes(f.peinado) ? { ...f, peinado: 'corto' } : f);
  const anchoHombros = f.complexion === 'llenita' ? 40 : f.complexion === 'media' ? 37 : 34;
  const contenido =
    `<rect width="100" height="100" fill="${f.fondo}"/><g transform="translate(50 62) scale(1.1) translate(-50 -62)">` + atras +
    // Hombros y playera
    `<path d="M${50 - anchoHombros} 104 Q${50 - anchoHombros} 82 38 78 L62 78 Q${50 + anchoHombros} 82 ${50 + anchoHombros} 104 Z" fill="${ropa}"/>` +
    `<path d="M40 78 Q50 86 60 78 L58 78 Q50 83 42 78 Z" fill="${tono(ropa, 0.75)}"/>` +
    // Cuello, orejas y cabeza
    `<path d="M43 64 H57 V79 Q50 84 43 79 Z" fill="${sombra}"/>` +
    `<ellipse cx="30" cy="50" rx="5" ry="7" fill="${sombra}"/><ellipse cx="70" cy="50" rx="5" ry="7" fill="${sombra}"/>` +
    `<path d="${CABEZA}" fill="${piel}"/>` +
    (f.aretes ? `<circle cx="30" cy="57" r="1.8" fill="#FFB020"/><circle cx="70" cy="57" r="1.8" fill="#FFB020"/>` : '') +
    vello(f) + frente + lentes(e) + gorro(e) + accesorio(e) + '</g>';
  return `<svg viewBox="0 0 100 100" width="100%" height="100%" role="img" aria-label="${f.nombre}"><defs><clipPath id="i${id}"><circle cx="50" cy="50" r="50"/></clipPath></defs><g clip-path="url(#i${id})">${contenido}</g></svg>`;
}
