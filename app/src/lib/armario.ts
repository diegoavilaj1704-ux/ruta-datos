// Clóset del avatar: catálogo de prendas, precios en XP y dibujo de cuerpo completo.
// El cuerpo se dibuja en 120×212; la cabeza es la misma del busto (personajes.ts)
// escalada encima, así el avatar se ve igual en el chat y en el clóset.
import { partesCabeza, PEINADOS, type Peinado, type Rasgos } from './personajes';

export const CATEGORIAS = {
  peinado: 'Peinados', ropa: 'Ropa', pantalon: 'Pantalón', tenis: 'Tenis',
  gorro: 'Gorros', lentes: 'Lentes', accesorio: 'Accesorios',
} as const;
export type Categoria = keyof typeof CATEGORIAS;

export interface Prenda { cat: Categoria; id: string; nombre: string; precio: number }

const P = (cat: Categoria, id: string, nombre: string, precio = 0): Prenda => ({ cat, id, nombre, precio });

// Precio 0 = viene incluido desde el inicio
export const CATALOGO: Prenda[] = [
  // Peinados: los básicos son gratis; los nuevos se desbloquean
  ...(Object.keys(PEINADOS) as Peinado[]).map((id) => P('peinado', id, PEINADOS[id], precioPeinado(id))),
  P('ropa', 'playera', 'Playera básica'), P('ropa', 'sudadera', 'Sudadera'),
  P('ropa', 'cuadros', 'Camisa a cuadros', 40), P('ropa', 'hawaiana', 'Camisa hawaiana', 70),
  P('ropa', 'chamarra', 'Chamarra de mezclilla', 80), P('ropa', 'chaleco', 'Chaleco acolchado', 90),
  P('ropa', 'hoodie', 'Hoodie </>', 110), P('ropa', 'jersey', 'Jersey SQL', 120),
  P('ropa', 'varsity', 'Chamarra varsity', 130), P('ropa', 'cuero', 'Chamarra de cuero', 140),
  P('ropa', 'saco', 'Saco y corbata', 160),
  P('pantalon', 'jeans', 'Jeans'), P('pantalon', 'pants', 'Pants deportivos'),
  P('pantalon', 'shorts', 'Shorts', 30), P('pantalon', 'falda', 'Falda', 50), P('pantalon', 'cargo', 'Cargo', 60),
  P('tenis', 'blancos', 'Tenis blancos'), P('tenis', 'rojos', 'Tenis rojos', 50),
  P('tenis', 'altos', 'Tenis altos', 80), P('tenis', 'botas', 'Botas', 90), P('tenis', 'neon', 'Tenis neón', 150),
  P('gorro', 'ninguno', 'Sin gorro'), P('gorro', 'gorra', 'Gorra', 40), P('gorro', 'bandana', 'Bandana', 50),
  P('gorro', 'lana', 'Gorro de lana', 60), P('gorro', 'boina', 'Boina', 70),
  P('gorro', 'sombrero', 'Sombrero', 100), P('gorro', 'corona', 'Corona de datos', 300),
  P('lentes', 'ninguno', 'Sin lentes'), P('lentes', 'redondos', 'Redondos'),
  P('lentes', 'sol', 'Lentes de sol', 50), P('lentes', 'pasta', 'Lentes de pasta', 70),
  P('accesorio', 'ninguno', 'Nada'), P('accesorio', 'reloj', 'Reloj', 40), P('accesorio', 'bufanda', 'Bufanda', 45),
  P('accesorio', 'gafete', 'Gafete DATA', 60), P('accesorio', 'audifonos', 'Audífonos', 80),
  P('accesorio', 'collar', 'Collar de cadena', 90),
];

function precioPeinado(id: Peinado): number {
  const precios: Partial<Record<Peinado, number>> = {
    bob: 40, raya: 40, coletas: 50, copete: 60, picos: 60, chongos: 70, rastas: 80, cresta: 90,
  };
  return precios[id] ?? 0;
}

export type Equipo = Record<Exclude<Categoria, 'peinado'>, string>;
export const EQUIPO_INICIAL: Equipo = {
  ropa: 'playera', pantalon: 'jeans', tenis: 'blancos', gorro: 'ninguno', lentes: 'ninguno', accesorio: 'ninguno',
};

export const clavePrenda = (p: Pick<Prenda, 'cat' | 'id'>) => `${p.cat}:${p.id}`;
export function precioDe(cat: Categoria, id: string): number {
  return CATALOGO.find((p) => p.cat === cat && p.id === id)?.precio ?? 0;
}

// Encuadres (viewBox) para cada vista del cuerpo
export const ENCUADRE = {
  completo: '0 0 120 212',
  cara: '36 6 48 48',
  peinado: '28 -2 64 64', gorro: '28 -2 64 64', lentes: '36 16 48 48',
  accesorio: '18 0 84 150', ropa: '0 0 120 212', pantalon: '25 110 70 102', tenis: '30 150 60 62',
} as const;

const COLOR_ROPA: Record<string, string> = {
  sudadera: '#FF6B5B', cuadros: '#0E9F9A', hawaiana: '#1BA39C', chamarra: '#4A7BD0', chaleco: '#9AA3AE',
  hoodie: '#1C1B22', jersey: '#3A3658', varsity: '#6C4CF1', cuero: '#2A2838', saco: '#2B3A67',
};

// Dibuja el cuerpo completo (sin envoltura <svg>): `playera` es el color favorito del perfil
export function dibujarCuerpo(o: Rasgos, e: Equipo, id: string): string {
  const sk = o.piel;
  const w = o.llenito ? 4 : 0;
  const { atras, frente } = partesCabeza({ ...o, lentes: false });
  const cabeza = (svg: string) => `<g transform="translate(60 38) scale(0.82) translate(-50 -50)">${svg}</g>`;
  let s = cabeza(atras);

  // Piernas, pantalón y tenis
  const pi = 50 - w / 2;
  const pd = 70 + w / 2;
  const grosor = 15 + w * 0.8;
  const colorPant = { jeans: '#3B5BA9', pants: '#3A3658', shorts: '#8A7350', falda: '#F0567A', cargo: '#7D7350' }[e.pantalon] ?? '#3B5BA9';
  if (e.pantalon === 'shorts' || e.pantalon === 'falda') {
    s += `<path d="M${pi},140 L${pi},194 M${pd},140 L${pd},194" stroke="${sk}" stroke-width="${grosor - 3}" stroke-linecap="round"/>`;
    s += e.pantalon === 'shorts'
      ? `<path d="M${40 - w},122 L${80 + w},122 L${82 + w},160 L62,160 L60,148 L58,160 L${38 - w},160 Z" fill="${colorPant}"/>`
      : `<path d="M${41 - w},122 L${79 + w},122 L${88 + w},162 Q60,168 ${32 - w},162 Z" fill="${colorPant}"/><path d="M${41 - w},126 L${79 + w},126" stroke="#C93D66" stroke-width="3"/>`;
  } else {
    s += `<path d="M${pi},134 L${pi - 0.5},195 M${pd},134 L${pd + 0.5},195" stroke="${colorPant}" stroke-width="${grosor}" stroke-linecap="round"/>`;
    s += `<path d="M${40 - w},122 L${80 + w},122 L${81 + w},142 L${39 - w},142 Z" fill="${colorPant}"/>`;
    if (e.pantalon === 'jeans') s += `<path d="M60,126 L60,142 M${pi - 5},170 L${pi - 5},190 M${pd + 5},170 L${pd + 5},190" stroke="#2E4A8E" stroke-width="1.4"/>`;
    if (e.pantalon === 'pants') s += `<path d="M${pi - grosor / 2 + 0.3},138 L${pi - grosor / 2 - 0.2},194 M${pd + grosor / 2 - 0.3},138 L${pd + grosor / 2 + 0.2},194" stroke="#fff" stroke-width="2" opacity=".8"/>`;
    if (e.pantalon === 'cargo') s += `<rect x="${pi - grosor / 2 - 1}" y="152" width="7" height="10" rx="1.5" fill="#666047"/><rect x="${pd + grosor / 2 - 6}" y="152" width="7" height="10" rx="1.5" fill="#666047"/>`;
  }
  const zap = { blancos: ['#FFFFFF', '#D9D6E5'], rojos: ['#FF5D5D', '#FFFFFF'], altos: ['#6C4CF1', '#FFFFFF'], botas: ['#7A4A2B', '#4A2E1E'], neon: ['#C6F432', '#FF6BB5'] }[e.tenis] ?? ['#FFFFFF', '#D9D6E5'];
  const alto = e.tenis === 'botas' || e.tenis === 'altos' ? 12 : 0;
  const zi = pi - 9;
  const zd = pd - 8;
  s += `<path d="M${zi},${194 - alto} L${zi + 17},${194 - alto} L${zi + 17},200 Q${zi + 17},207 ${zi + 11},207 L${zi - 1},207 Q${zi - 6},207 ${zi - 6},203 Q${zi - 6},198 ${zi},197 Z" fill="${zap[0]}" stroke="#2A2838" stroke-width="1.2"/>`;
  s += `<path d="M${zd},${194 - alto} L${zd + 17},${194 - alto} L${zd + 17},197 Q${zd + 23},198 ${zd + 23},203 Q${zd + 23},207 ${zd + 18},207 L${zd + 6},207 Q${zd},207 ${zd},200 Z" fill="${zap[0]}" stroke="#2A2838" stroke-width="1.2"/>`;
  s += `<path d="M${zi - 6},205 L${zi + 17},205 M${zd},205 L${zd + 23},205" stroke="${zap[1]}" stroke-width="3" stroke-linecap="round"/>`;
  if (e.tenis === 'altos') s += `<path d="M${zi + 4},186 L${zi + 13},186 M${zi + 4},190 L${zi + 13},190 M${zd + 4},186 L${zd + 13},186 M${zd + 4},190 L${zd + 13},190" stroke="#fff" stroke-width="1.3"/>`;

  // Brazos: piel completa y encima la manga (corta o larga)
  const bi = `M${43 - w},76 Q${34 - w},90 ${33 - w},106 Q${32 - w},121 ${32 - w},134`;
  const bd = `M${77 + w},76 Q${86 + w},90 ${87 + w},106 Q${88 + w},121 ${88 + w},134`;
  const mi = `M${43 - w},76 Q${36 - w},87 ${34.5 - w},97`;
  const md = `M${77 + w},76 Q${84 + w},87 ${85.5 + w},97`;
  const color = e.ropa === 'playera' ? o.ropa : COLOR_ROPA[e.ropa] ?? o.ropa;
  const mangaCorta = ['playera', 'jersey', 'hawaiana', 'chaleco'].includes(e.ropa);
  const colorManga = e.ropa === 'varsity' ? '#F3E9D2' : e.ropa === 'chaleco' ? '#FFFFFF' : color;
  s += `<path d="${bi}" stroke="${sk}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="${bd}" stroke="${sk}" stroke-width="10" fill="none" stroke-linecap="round"/>`;
  s += `<path d="${mangaCorta ? mi : bi}" stroke="${colorManga}" stroke-width="12.5" fill="none" stroke-linecap="round"/><path d="${mangaCorta ? md : bd}" stroke="${colorManga}" stroke-width="12.5" fill="none" stroke-linecap="round"/>`;
  if (e.ropa === 'jersey') s += `<path d="M${35.6 - w},93 L${34.4 - w},97 M${84.4 + w},93 L${85.6 + w},97" stroke="#B9A8FF" stroke-width="3"/>`;
  if (e.ropa === 'varsity') s += `<path d="M${32.6 - w},128 L${31.4 - w},131 M${87.4 + w},128 L${88.6 + w},131" stroke="#6C4CF1" stroke-width="4"/>`;

  // Cuello y torso
  s += `<rect x="55" y="54" width="10" height="16" rx="4" fill="${sk}"/><rect x="55" y="54" width="10" height="6" fill="#000" opacity=".1"/>`;
  const torso = `M${42 - w},74 Q${44 - w},67 60,66 Q${76 + w},67 ${78 + w},74 L${79 + w},126 Q60,130 ${41 - w},126 Z`;
  s += `<path d="${torso}" fill="${e.ropa === 'chaleco' ? '#FFFFFF' : color}"/>`;
  s += detalleTorso(e.ropa, torso, color, id, w);

  // Manos
  s += `<circle cx="${32 - w}" cy="139" r="6" fill="${sk}"/><circle cx="${88 + w}" cy="139" r="6" fill="${sk}"/>`;
  if (e.accesorio === 'reloj') s += `<rect x="${27 - w}" y="129" width="10" height="5" rx="2" fill="#2A2838"/><circle cx="${32 - w}" cy="131.5" r="2" fill="#7CF2C3"/>`;
  if (e.accesorio === 'bufanda') s += `<path d="M50,63 Q60,72 70,63 L71,70 Q60,79 49,70 Z" fill="#FFB020"/><rect x="63" y="70" width="7" height="20" rx="3" fill="#E09A10"/>`;
  if (e.accesorio === 'collar') s += `<path d="M53,68 Q60,82 67,68" stroke="#E3B341" stroke-width="2.2" fill="none" stroke-dasharray="2.6 1.4"/><circle cx="60" cy="78" r="3" fill="#E3B341"/>`;
  if (e.accesorio === 'gafete') s += `<path d="M53,67 L58,96 M67,67 L62,96" stroke="#6C4CF1" stroke-width="1.6"/><rect x="53" y="95" width="14" height="17" rx="2" fill="#FFFFFF" stroke="#2A2838" stroke-width="1"/><rect x="56" y="98" width="8" height="6" rx="1" fill="#C98E62"/><text x="60" y="110" text-anchor="middle" font-family="monospace" font-weight="700" font-size="3.6" fill="#2A2838">DATA</text>`;

  s += cabeza(frente);
  s += lentesYGorro(e);
  return s;
}

function detalleTorso(ropa: string, torso: string, color: string, id: string, w: number): string {
  switch (ropa) {
    case 'playera': return `<path d="M54,67 Q60,73 66,67" stroke="#000" stroke-opacity=".25" stroke-width="2.2" fill="none"/>`;
    case 'sudadera': return `<path d="M48,68 Q60,80 72,68" stroke="#C94B3E" stroke-width="4.5" fill="none"/><path d="M56,76 L55.5,88 M64,76 L64.5,88" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><path d="M48,104 L72,104 L74,120 L46,120 Z" fill="#E85A4B"/>`;
    case 'cuadros': return `<clipPath id="p${id}"><path d="${torso}"/></clipPath><g clip-path="url(#p${id})" stroke="#085041" stroke-width="2.2" opacity=".5">${[78, 90, 102, 114].map((y) => `<path d="M20,${y} H100"/>`).join('')}${[46, 54, 66, 74].map((v) => `<path d="M${v},60 V130"/>`).join('')}</g><path d="M54,67 L60,76 L66,67 Z" fill="#fff"/><path d="M60,76 L60,126" stroke="#085041" stroke-width="1.2"/>`;
    case 'hawaiana': {
      const flor = (x: number, y: number, c: string) => `<g fill="${c}">${[0, 72, 144, 216, 288].map((a) => `<circle cx="${x + Math.cos((a * Math.PI) / 180) * 2.6}" cy="${y + Math.sin((a * Math.PI) / 180) * 2.6}" r="2"/>`).join('')}</g><circle cx="${x}" cy="${y}" r="1.4" fill="#FFB020"/>`;
      return `${flor(48, 84, '#FFFFFF')}${flor(70, 92, '#FF8FB1')}${flor(52, 110, '#FF8FB1')}${flor(72, 116, '#FFFFFF')}${flor(62, 100, '#FFE27A')}<path d="M53,67 L60,78 L67,67" stroke="#0A7773" stroke-width="2" fill="none"/>`;
    }
    case 'chamarra': return `<path d="M53,67 L60,127 L67,67 Z" fill="#FFFFFF"/><path d="M53,67 L48,80 L57,79 Z M67,67 L72,80 L63,79 Z" fill="#3A62B0"/><circle cx="50" cy="96" r="1.5" fill="#E3B341"/><circle cx="70" cy="96" r="1.5" fill="#E3B341"/><path d="M${41 - w},120 L${79 + w},120" stroke="#3A62B0" stroke-width="4"/>`;
    case 'chaleco': return `<path d="M${42 - w},74 Q${44 - w},68 54,67 L60,74 L66,67 Q${76 + w},68 ${78 + w},74 L${79 + w},126 Q60,130 ${41 - w},126 Z" fill="#FF8A3D"/>${[86, 98, 110].map((y) => `<path d="M${41 - w},${y} Q60,${y + 3} ${79 + w},${y}" stroke="#E0702A" stroke-width="1.6" fill="none"/>`).join('')}<path d="M60,74 L60,127" stroke="#C9CDD2" stroke-width="2"/>`;
    case 'hoodie': return `<path d="M48,68 Q60,80 72,68" stroke="#3A3940" stroke-width="4.5" fill="none"/><path d="M56,76 L55.5,86 M64,76 L64.5,86" stroke="#7CF2C3" stroke-width="1.6" stroke-linecap="round"/><text x="60" y="104" text-anchor="middle" font-family="monospace" font-weight="700" font-size="11" fill="#7CF2C3">&lt;/&gt;</text>`;
    case 'jersey': return `<path d="M54,67 Q60,72 66,67" stroke="#7CF2C3" stroke-width="2.6" fill="none"/><text x="60" y="100" text-anchor="middle" font-family="monospace" font-weight="700" font-size="12" fill="#7CF2C3">SQL</text>`;
    case 'varsity': return `<path d="M54,67 Q60,73 66,67" stroke="#F3E9D2" stroke-width="3" fill="none"/><path d="M60,70 L60,127" stroke="#F3E9D2" stroke-width="1.4" stroke-dasharray="2 2"/><text x="50" y="96" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="13" fill="#F3E9D2" stroke="#FFB020" stroke-width=".6">D</text><path d="M${41 - w},123 L${79 + w},123" stroke="#F3E9D2" stroke-width="3"/>`;
    case 'cuero': return `<path d="M54,67 L60,127 L66,67 Z" fill="#F4F2F8"/><path d="M54,67 L46,82 L57,80 Z M66,67 L74,82 L63,80 Z" fill="#45434F"/><path d="M63,80 L61,126" stroke="#C9CDD2" stroke-width="1.6"/><rect x="${45 - w}" y="104" width="8" height="2" rx="1" fill="#C9CDD2"/>`;
    case 'saco': return `<path d="M53,67 L60,112 L67,67 Z" fill="#FFFFFF"/><path d="M58.5,69 L61.5,69 L62.5,96 L60,100 L57.5,96 Z" fill="#E0464B"/><path d="M53,67 L47,84 L56,82 Z M67,67 L73,84 L64,82 Z" fill="#22305A"/><circle cx="60" cy="116" r="1.6" fill="#22305A"/><rect x="${45 - w}" y="88" width="7" height="2" rx="1" fill="#FFFFFF"/>`;
    default: return '';
  }
}

function lentesYGorro(e: Equipo): string {
  let h = '';
  if (e.lentes === 'redondos') h += `<g fill="none" stroke="#2A2838" stroke-width="1.5"><circle cx="53" cy="40.6" r="5"/><circle cx="67" cy="40.6" r="5"/><path d="M58,40.6 L62,40.6"/></g>`;
  if (e.lentes === 'sol') h += `<path d="M46.5,37.6 h12 v5 q-6,4.5 -12,0 Z M61.5,37.6 h12 v5 q-6,4.5 -12,0 Z" fill="#1C1B22"/><path d="M58.5,39 L61.5,39" stroke="#1C1B22" stroke-width="1.6"/><path d="M48,38.6 h3" stroke="#fff" stroke-width="1" opacity=".6"/>`;
  if (e.lentes === 'pasta') h += `<g fill="none" stroke="#7A2E2E" stroke-width="2.5"><rect x="46.5" y="36" width="12.5" height="9" rx="2.5"/><rect x="61" y="36" width="12.5" height="9" rx="2.5"/><path d="M59,39.5 L61,39.5"/></g>`;
  switch (e.gorro) {
    case 'gorra': h += `<path d="M41,27 Q42,11 60,11 Q78,11 79,27 Z" fill="#FF6B5B"/><path d="M60,25 Q76,23 88,29 Q76,31 60,28 Z" fill="#C94B3E"/><circle cx="60" cy="12" r="1.8" fill="#C94B3E"/>`; break;
    case 'bandana': h += `<path d="M41,26 Q42,13 60,13 Q78,13 79,26 Q60,22 41,26 Z" fill="#E0464B"/>${[48, 56, 64, 72].map((x) => `<circle cx="${x}" cy="19" r="1" fill="#fff"/>`).join('')}<path d="M78,24 L86,30 L82,22 Z" fill="#C93A40"/>`; break;
    case 'lana': h += `<path d="M40,31 Q40,6 60,6 Q80,6 80,31 Z" fill="#0E9F9A"/><rect x="39" y="26" width="42" height="7" rx="3.5" fill="#0A7773"/><circle cx="60" cy="6" r="5" fill="#FFB020"/>`; break;
    case 'boina': h += `<ellipse cx="62" cy="20" rx="22" ry="8" fill="#2A2838" transform="rotate(-8 62 20)"/><circle cx="62" cy="12" r="1.8" fill="#2A2838"/>`; break;
    case 'sombrero': h += `<ellipse cx="60" cy="25" rx="31" ry="6" fill="#C9A26B"/><path d="M46,25 Q46,6 60,6 Q74,6 74,25 Z" fill="#D9B27B"/><rect x="46" y="19" width="28" height="4" fill="#B23A2B"/>`; break;
    case 'corona': h += `<path d="M45,21 L45,6 L52,13 L60,1 L68,13 L75,6 L75,21 Z" fill="#FFC531" stroke="#B07A00" stroke-width="1.2"/><circle cx="60" cy="14" r="2.4" fill="#7CF2C3"/><circle cx="50" cy="17" r="1.6" fill="#FF6B5B"/><circle cx="70" cy="17" r="1.6" fill="#B9A8FF"/>`; break;
  }
  if (e.accesorio === 'audifonos') h += `<path d="M40,40 Q40,12 60,12 Q80,12 80,40" stroke="#2A2838" stroke-width="3.5" fill="none"/><rect x="36" y="34" width="8" height="13" rx="3.5" fill="#6C4CF1"/><rect x="76" y="34" width="8" height="13" rx="3.5" fill="#6C4CF1"/>`;
  return h;
}

// Envuelve el cuerpo en un <svg> con el encuadre pedido; `circulo` lo recorta para el chat
export function svgCuerpo(o: Rasgos, e: Equipo, id: string, encuadre: string, circulo = false): string {
  const [x, y, ancho, alto] = encuadre.split(' ').map(Number);
  const fondo = circulo
    ? `<defs><clipPath id="c${id}"><circle cx="${x + ancho / 2}" cy="${y + alto / 2}" r="${ancho / 2}"/></clipPath></defs><g clip-path="url(#c${id})"><rect x="${x}" y="${y}" width="${ancho}" height="${alto}" fill="${o.fondo}"/>`
    : '<g>';
  return `<svg viewBox="${encuadre}" width="100%" height="100%" role="img" aria-label="${o.nombre}">${fondo}${dibujarCuerpo(o, e, id)}</g></svg>`;
}
