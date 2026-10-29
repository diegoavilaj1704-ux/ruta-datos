// Clóset del avatar: catálogo de prendas y precios en XP. El dibujo está en figura.ts.
// Los id no cambian entre versiones del dibujo: así lo que ya compraste sigue siendo tuyo.
import { PEINADOS, type Peinado } from './personajes';

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
  P('tenis', 'blancos', 'Tenis clásicos'), P('tenis', 'rojos', 'Tenis rojos', 50),
  P('tenis', 'altos', 'Tenis altos', 80), P('tenis', 'botas', 'Botas', 90), P('tenis', 'neon', 'Tenis neón', 150),
  P('gorro', 'ninguno', 'Sin gorro'), P('gorro', 'gorra', 'Gorra', 40), P('gorro', 'bandana', 'Bandana', 50),
  P('gorro', 'lana', 'Gorro de lana', 60), P('gorro', 'boina', 'Boina', 70),
  P('gorro', 'sombrero', 'Sombrero', 100), P('gorro', 'corona', 'Corona de datos', 300),
  P('lentes', 'ninguno', 'Sin lentes'), P('lentes', 'cuadrados', 'Cuadrados'), P('lentes', 'redondos', 'Redondos'),
  P('lentes', 'sol', 'Lentes de sol', 50), P('lentes', 'pasta', 'Lentes de pasta', 70),
  P('accesorio', 'ninguno', 'Nada'), P('accesorio', 'reloj', 'Reloj', 40), P('accesorio', 'bufanda', 'Bufanda', 45),
  P('accesorio', 'gafete', 'Gafete DATA', 60), P('accesorio', 'audifonos', 'Audífonos', 80),
  P('accesorio', 'collar', 'Collar de cadena', 90),
];

function precioPeinado(id: Peinado): number {
  const precios: Partial<Record<Peinado, number>> = {
    bob: 40, coletas: 50, trenzas: 50, copete: 60, picos: 60, rastas: 80, cresta: 90,
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
